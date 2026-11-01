/* Pixel Studio — editor front-end.
 * Original implementation, MIT licensed. Runs entirely in the browser;
 * nothing is uploaded anywhere.
 */
(function () {
  'use strict';

  var C = window.PSCore;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var MAX_BACKING_PIXELS = 12e6;
  var AUTOSAVE_KEY = 'pixelstudio.autosave.v1';

  /* ------------------------------------------------------------------ state */

  var S = {
    w: 64, h: 64, zoom: 8, panX: 0, panY: 0,
    layers: [], active: 0,
    tool: 'pencil',
    color: '#1b1b1f', color2: '#ffffff',
    brush: 1, opacity: 1, tolerance: 0,
    symX: false, symY: false, fillShapes: false, showGrid: true,
    sel: null, floating: null, preview: null, drag: null,
    history: [], hpos: -1,
    fxBase: null,
    textAnchor: null,
    palette: [],
    ready: false,
    spaceDown: false,
    panning: null
  };

  var screen = $('#screen');
  var screenCtx = screen.getContext('2d');
  var stage = $('#stage');
  var viewport = $('#viewport');

  var compCv = document.createElement('canvas');
  var compCtx = compCv.getContext('2d');
  var prevCv = document.createElement('canvas');
  var prevCtx = prevCv.getContext('2d');
  var checkerPattern = null;
  var toastTimer = null;

  /* ----------------------------------------------------------------- helpers */

  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  function modal(title, html, onOk, okLabel) {
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML =
      '<div class="modal"><h3>' + title + '</h3>' +
      '<div class="content">' + html + '</div>' +
      '<div class="actions"><button class="btn" data-cancel>Cancel</button>' +
      '<button class="btn primary" data-ok>' + (okLabel || 'OK') + '</button></div></div>';
    document.body.appendChild(overlay);
    function close() { overlay.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } }
    document.addEventListener('keydown', onKey, true);
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
    $('[data-cancel]', overlay).onclick = close;
    $('[data-ok]', overlay).onclick = function () {
      if (onOk(overlay) !== false) close();
    };
    return overlay;
  }

  function download(blobOrUrl, filename) {
    var a = document.createElement('a');
    a.href = typeof blobOrUrl === 'string' ? blobOrUrl : URL.createObjectURL(blobOrUrl);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (typeof blobOrUrl !== 'string') setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  }

  /* ------------------------------------------------------------------ layers */

  function mkLayer(name) {
    var cv = document.createElement('canvas');
    cv.width = S.w; cv.height = S.h;
    return {
      name: name, visible: true, opacity: 1, locked: false,
      canvas: cv, ctx: cv.getContext('2d', { willReadFrequently: true })
    };
  }

  function activeLayer() { return S.layers[S.active]; }

  function guardLayer() {
    var l = activeLayer();
    if (!l) { toast('No layer selected'); return null; }
    if (l.locked) { toast('This layer is locked'); return null; }
    if (!l.visible) { toast('This layer is hidden'); return null; }
    return l;
  }

  /* ----------------------------------------------------------------- history */

  function snapshot() {
    return {
      w: S.w, h: S.h, active: S.active,
      layers: S.layers.map(function (l) {
        return {
          name: l.name, visible: l.visible, opacity: l.opacity, locked: l.locked,
          data: l.ctx.getImageData(0, 0, S.w, S.h)
        };
      })
    };
  }

  function restore(snap) {
    S.w = snap.w; S.h = snap.h;
    S.layers = snap.layers.map(function (o) {
      var l = mkLayer(o.name);
      l.visible = o.visible; l.opacity = o.opacity; l.locked = o.locked;
      l.ctx.putImageData(o.data, 0, 0);
      return l;
    });
    S.active = Math.min(snap.active, S.layers.length - 1);
    S.sel = null; S.floating = null;
    $('#resize-w').value = S.w;
    $('#resize-h').value = S.h;
    render(); renderLayers(); updateStatus();
  }

  function pushHistory() {
    S.history = S.history.slice(0, S.hpos + 1);
    S.history.push(snapshot());
    if (S.history.length > 24) S.history.shift();
    S.hpos = S.history.length - 1;
    updateHistoryButtons();
    queueAutosave();
  }

  function undo() {
    if (S.hpos <= 0) return;
    S.hpos--;
    restore(S.history[S.hpos]);
    updateHistoryButtons();
  }

  function redo() {
    if (S.hpos >= S.history.length - 1) return;
    S.hpos++;
    restore(S.history[S.hpos]);
    updateHistoryButtons();
  }

  function updateHistoryButtons() {
    $('#btn-undo').disabled = S.hpos <= 0;
    $('#btn-redo').disabled = S.hpos >= S.history.length - 1;
  }

  /* ---------------------------------------------------------------- rendering */

  function effZoom() {
    var max = Math.floor(Math.sqrt(MAX_BACKING_PIXELS / Math.max(1, S.w * S.h)));
    return Math.max(1, Math.min(S.zoom, Math.max(1, max)));
  }

  function composite() {
    if (compCv.width !== S.w || compCv.height !== S.h) { compCv.width = S.w; compCv.height = S.h; }
    compCtx.clearRect(0, 0, S.w, S.h);
    for (var i = 0; i < S.layers.length; i++) {
      var l = S.layers[i];
      if (!l.visible || l.opacity <= 0) continue;
      compCtx.globalAlpha = l.opacity;
      compCtx.drawImage(l.canvas, 0, 0);
    }
    compCtx.globalAlpha = 1;
    return compCv;
  }

  function drawChecker(ctx, W, H) {
    if (!checkerPattern) {
      var p = document.createElement('canvas');
      p.width = 16; p.height = 16;
      var pc = p.getContext('2d');
      pc.fillStyle = '#181c24'; pc.fillRect(0, 0, 16, 16);
      pc.fillStyle = '#222836'; pc.fillRect(0, 0, 8, 8); pc.fillRect(8, 8, 8, 8);
      checkerPattern = ctx.createPattern(p, 'repeat');
    }
    ctx.fillStyle = checkerPattern;
    ctx.fillRect(0, 0, W, H);
  }

  function drawShape(c, p) {
    var x0 = p.x0, y0 = p.y0, x1 = p.x1, y1 = p.y1;
    var lw = Math.max(1, S.brush);
    var off = lw % 2 === 1 ? 0.5 : 0;
    c.save();
    c.globalAlpha = S.opacity;
    c.strokeStyle = p.color;
    c.fillStyle = p.color;
    c.lineWidth = lw;
    c.lineCap = 'butt';
    c.lineJoin = 'miter';
    if (p.tool === 'line') {
      c.beginPath();
      c.moveTo(x0 + off, y0 + off);
      c.lineTo(x1 + off, y1 + off);
      c.stroke();
    } else if (p.tool === 'rect') {
      var rx = Math.min(x0, x1), ry = Math.min(y0, y1);
      var rw = Math.abs(x1 - x0) + 1, rh = Math.abs(y1 - y0) + 1;
      if (S.fillShapes) c.fillRect(rx, ry, rw, rh);
      else c.strokeRect(rx + off, ry + off, rw - 1, rh - 1);
    } else if (p.tool === 'ellipse') {
      var cx = (x0 + x1) / 2 + 0.5, cy = (y0 + y1) / 2 + 0.5;
      var rx2 = Math.abs(x1 - x0) / 2 + 0.5, ry2 = Math.abs(y1 - y0) / 2 + 0.5;
      c.beginPath();
      c.ellipse(cx, cy, rx2, ry2, 0, 0, Math.PI * 2);
      if (S.fillShapes) c.fill(); else c.stroke();
    }
    c.restore();
  }

  function render() {
    var z = effZoom();
    var W = S.w * z, H = S.h * z;
    if (screen.width !== W || screen.height !== H) { screen.width = W; screen.height = H; }

    screenCtx.setTransform(1, 0, 0, 1, 0, 0);
    screenCtx.clearRect(0, 0, W, H);
    screenCtx.imageSmoothingEnabled = false;

    drawChecker(screenCtx, W, H);
    screenCtx.drawImage(composite(), 0, 0, W, H);

    if (S.floating) {
      screenCtx.drawImage(S.floating.canvas,
        (S.floating.x + S.floating.dx) * z, (S.floating.y + S.floating.dy) * z,
        S.floating.w * z, S.floating.h * z);
    }

    if (S.preview) {
      if (prevCv.width !== S.w || prevCv.height !== S.h) { prevCv.width = S.w; prevCv.height = S.h; }
      prevCtx.clearRect(0, 0, S.w, S.h);
      prevCtx.imageSmoothingEnabled = false;
      drawShape(prevCtx, S.preview);
      screenCtx.drawImage(prevCv, 0, 0, W, H);
    }

    if (S.showGrid && z >= 5) {
      screenCtx.save();
      screenCtx.strokeStyle = 'rgba(255,255,255,0.10)';
      screenCtx.lineWidth = 1;
      screenCtx.beginPath();
      for (var x = 1; x < S.w; x++) { screenCtx.moveTo(x * z + 0.5, 0); screenCtx.lineTo(x * z + 0.5, H); }
      for (var y = 1; y < S.h; y++) { screenCtx.moveTo(0, y * z + 0.5); screenCtx.lineTo(W, y * z + 0.5); }
      screenCtx.stroke();
      screenCtx.restore();
    }

    var selRect = S.sel;
    if (S.drag && S.drag.type === 'sel' && S.drag.cur) {
      selRect = normalizeRect(S.drag.start, S.drag.cur);
    }
    if (selRect && selRect.w > 0 && selRect.h > 0) {
      screenCtx.save();
      screenCtx.strokeStyle = '#6ee7b7';
      screenCtx.lineWidth = 1;
      screenCtx.setLineDash([4, 3]);
      screenCtx.strokeRect(selRect.x * z + 0.5, selRect.y * z + 0.5, selRect.w * z - 1, selRect.h * z - 1);
      screenCtx.restore();
    }

    $('#zoom-label').textContent = Math.round(z * 100) + '%';
  }

  function normalizeRect(a, b) {
    var x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
    var w = Math.abs(b.x - a.x) + 1, h = Math.abs(b.y - a.y) + 1;
    x = Math.max(0, Math.min(S.w - 1, x));
    y = Math.max(0, Math.min(S.h - 1, y));
    w = Math.min(w, S.w - x);
    h = Math.min(h, S.h - y);
    return { x: x, y: y, w: w, h: h };
  }

  function updateStatus() {
    $('#status-size').textContent = S.w + ' × ' + S.h;
    var l = activeLayer();
    $('#status-layer').textContent = l ? l.name : '—';
  }

  function fitZoom() {
    var pad = 60;
    var zx = (viewport.clientWidth - pad) / S.w;
    var zy = (viewport.clientHeight - pad) / S.h;
    S.zoom = Math.max(1, Math.min(32, Math.floor(Math.min(zx, zy)) || 1));
    render();
  }

  function setZoom(z) {
    S.zoom = Math.max(1, Math.min(64, Math.round(z)));
    render();
  }

  /* --------------------------------------------------------------- layers UI */

  function renderLayers() {
    var box = $('#layers');
    box.innerHTML = '';
    for (var i = S.layers.length - 1; i >= 0; i--) {
      (function (i) {
        var l = S.layers[i];
        var el = document.createElement('div');
        el.className = 'layer' + (i === S.active ? ' active' : '');
        el.draggable = false;

        var eye = document.createElement('button');
        eye.className = 'eye' + (l.visible ? ' on' : '');
        eye.textContent = l.visible ? '●' : '○';
        eye.title = 'Show / hide';
        eye.onclick = function (e) { e.stopPropagation(); l.visible = !l.visible; render(); renderLayers(); };

        var th = document.createElement('canvas');
        th.width = 34; th.height = 34;
        var tc = th.getContext('2d');
        tc.imageSmoothingEnabled = false;
        var sc = Math.min(34 / S.w, 34 / S.h);
        var dw = Math.max(1, Math.round(S.w * sc)), dh = Math.max(1, Math.round(S.h * sc));
        tc.drawImage(l.canvas, Math.round((34 - dw) / 2), Math.round((34 - dh) / 2), dw, dh);

        var name = document.createElement('div');
        name.className = 'name';
        name.textContent = l.name;
        name.title = 'Double-click to rename';
        name.ondblclick = function (e) {
          e.stopPropagation();
          var v = prompt('Layer name', l.name);
          if (v) { l.name = v; renderLayers(); updateStatus(); }
        };

        var lock = document.createElement('button');
        lock.className = 'lock' + (l.locked ? ' on' : '');
        lock.textContent = l.locked ? '🔒' : '🔓';
        lock.title = 'Lock / unlock';
        lock.onclick = function (e) { e.stopPropagation(); l.locked = !l.locked; renderLayers(); };

        el.appendChild(eye);
        el.appendChild(th);
        el.appendChild(name);
        el.appendChild(lock);
        el.onclick = function () { S.active = i; renderLayers(); updateStatus(); $('#layer-opacity').value = Math.round(l.opacity * 100); };
        box.appendChild(el);
      })(i);
    }
    var cur = activeLayer();
    if (cur) $('#layer-opacity').value = Math.round(cur.opacity * 100);
    $('#layer-opacity-val').textContent = Math.round((cur ? cur.opacity : 1) * 100);
  }

  /* ------------------------------------------------------------------ colour */

  function setColor(hex, secondary) {
    var norm = C.rgbToHex.apply(null, C.hexToRgb(hex));
    if (secondary) S.color2 = norm; else S.color = norm;
    $('#swatch-primary').style.background = S.color;
    $('#swatch-secondary').style.background = S.color2;
    if (!secondary) {
      $('#hex-input').value = S.color.toUpperCase();
      $('#color-input').value = S.color;
    }
    markPaletteSelection();
  }

  function renderPalette() {
    var box = $('#palette');
    box.innerHTML = '';
    S.palette.forEach(function (hex) {
      var b = document.createElement('button');
      b.style.background = hex;
      b.title = hex + ' — click to use, shift-click for secondary, right-click to remove';
      b.dataset.hex = hex.toLowerCase();
      b.onclick = function (e) {
        if (e.shiftKey) setColor(hex, true); else setColor(hex, false);
      };
      b.oncontextmenu = function (e) {
        e.preventDefault();
        S.palette = S.palette.filter(function (c) { return c !== hex; });
        renderPalette();
      };
      box.appendChild(b);
    });
    markPaletteSelection();
  }

  function markPaletteSelection() {
    $$('#palette button').forEach(function (b) {
      b.classList.toggle('sel', b.dataset.hex === S.color.toLowerCase());
    });
  }

  function loadPalette(key) {
    var p = C.PALETTES[key];
    if (!p) return;
    S.palette = p.colors.slice();
    renderPalette();
  }

  function fillPaletteSelects() {
    var opts = Object.keys(C.PALETTES).map(function (k) {
      return '<option value="' + k + '">' + C.PALETTES[k].name + '</option>';
    }).join('');
    $('#palette-select').innerHTML = opts;
    $('#dither-palette').innerHTML = opts;
  }

  function selectedDitherPalette() {
    var p = C.PALETTES[$('#dither-palette').value];
    return p ? p.colors.slice() : (S.palette.length ? S.palette.slice() : C.PALETTES.db16.colors.slice());
  }

  /* ------------------------------------------------------------------- tools */

  function pixelFromEvent(e) {
    var r = screen.getBoundingClientRect();
    var x = Math.floor((e.clientX - r.left) / r.width * S.w);
    var y = Math.floor((e.clientY - r.top) / r.height * S.h);
    return {
      x: Math.max(0, Math.min(S.w - 1, x)),
      y: Math.max(0, Math.min(S.h - 1, y)),
      inside: x >= 0 && y >= 0 && x < S.w && y < S.h
    };
  }

  function stampAt(layer, x, y, colorHex, erase) {
    var ctx = layer.ctx;
    var size = Math.max(1, S.brush);
    var half = Math.floor((size - 1) / 2);
    ctx.save();
    if (erase) ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = erase ? 1 : S.opacity;
    ctx.fillStyle = colorHex;
    var pts = [[x, y]];
    if (S.symX) pts.push([S.w - 1 - x, y]);
    if (S.symY) pts.push([x, S.h - 1 - y]);
    if (S.symX && S.symY) pts.push([S.w - 1 - x, S.h - 1 - y]);
    for (var i = 0; i < pts.length; i++) {
      ctx.fillRect(pts[i][0] - half, pts[i][1] - half, size, size);
    }
    ctx.restore();
  }

  function strokeTo(layer, x0, y0, x1, y1, color, erase) {
    var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    var err = dx + dy, guard = 0;
    while (guard++ < 20000) {
      stampAt(layer, x0, y0, color, erase);
      if (x0 === x1 && y0 === y1) break;
      var e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }

  function bucketFill(p) {
    var l = guardLayer();
    if (!l) return;
    var img = l.ctx.getImageData(0, 0, S.w, S.h);
    C.floodFill(img, p.x, p.y, C.parseColor(S.color), S.tolerance);
    l.ctx.putImageData(img, 0, 0);
    pushHistory();
    render(); renderLayers();
  }

  function pickColor(p) {
    var img = compCtx.getImageData(0, 0, S.w, S.h);
    var px = C.getPixel(img, p.x, p.y);
    if (px[3] === 0) { toast('Transparent pixel'); return; }
    setColor(C.rgbToHex(px[0], px[1], px[2]));
    toast('Picked ' + C.rgbToHex(px[0], px[1], px[2]).toUpperCase());
  }

  /* ---------------------------------------------------------- pointer events */

  function onDown(e) {
    if (e.button === 2) { /* secondary colour stroke */ }
    var useSecondary = e.button === 2;
    if (e.button === 1 || S.spaceDown || S.tool === 'hand') {
      S.panning = { x: e.clientX, y: e.clientY, px: S.panX, py: S.panY };
      stage.classList.add('panning');
      e.preventDefault();
      return;
    }
    var p = pixelFromEvent(e);
    if (!p.inside) return;
    var color = useSecondary ? S.color2 : S.color;
    var l = activeLayer();

    if (S.tool === 'pencil' || S.tool === 'eraser') {
      if (!guardLayer()) return;
      S.drag = { type: 'draw', last: p, color: color, erase: S.tool === 'eraser' };
      stampAt(l, p.x, p.y, color, S.tool === 'eraser');
      render();
      screen.setPointerCapture && screen.setPointerCapture(e.pointerId);
    } else if (S.tool === 'bucket') {
      bucketFill(p);
    } else if (S.tool === 'picker') {
      pickColor(p);
    } else if (S.tool === 'line' || S.tool === 'rect' || S.tool === 'ellipse') {
      if (!guardLayer()) return;
      S.drag = { type: 'shape', tool: S.tool, start: p };
      S.preview = { tool: S.tool, x0: p.x, y0: p.y, x1: p.x, y1: p.y, color: color };
      render();
    } else if (S.tool === 'select') {
      if (S.sel && p.x >= S.sel.x && p.x < S.sel.x + S.sel.w && p.y >= S.sel.y && p.y < S.sel.y + S.sel.h && l) {
        beginMove(p);
      } else {
        S.drag = { type: 'sel', start: p, cur: p };
        S.sel = null;
        render();
      }
    } else if (S.tool === 'text') {
      S.textAnchor = { x: p.x, y: p.y };
      toast('Text anchor set at ' + p.x + ', ' + p.y);
      var ta = $('#text-content');
      ta.focus();
    }
  }

  function beginMove(p) {
    var l = guardLayer();
    if (!l) return;
    var r = S.sel;
    var fl = document.createElement('canvas');
    fl.width = r.w; fl.height = r.h;
    var fc = fl.getContext('2d');
    fc.imageSmoothingEnabled = false;
    fc.drawImage(l.canvas, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h);
    l.ctx.clearRect(r.x, r.y, r.w, r.h);
    S.floating = { canvas: fl, x: r.x, y: r.y, dx: 0, dy: 0, w: r.w, h: r.h };
    S.drag = { type: 'move', start: p };
    render();
  }

  function onMove(e) {
    var p = pixelFromEvent(e);
    $('#status-pos').textContent = p.inside ? (p.x + ', ' + p.y) : '—';

    if (S.panning) {
      S.panX = S.panning.px + (e.clientX - S.panning.x);
      S.panY = S.panning.py + (e.clientY - S.panning.y);
      stage.style.transform = 'translate(' + S.panX + 'px,' + S.panY + 'px)';
      return;
    }
    if (!S.drag) return;

    if (S.drag.type === 'draw') {
      var l = activeLayer();
      if (!l) return;
      strokeTo(l, S.drag.last.x, S.drag.last.y, p.x, p.y, S.drag.color, S.drag.erase);
      S.drag.last = p;
      render();
    } else if (S.drag.type === 'shape') {
      S.preview.x1 = p.x; S.preview.y1 = p.y;
      render();
    } else if (S.drag.type === 'sel') {
      S.drag.cur = p;
      render();
    } else if (S.drag.type === 'move' && S.floating) {
      S.floating.dx = p.x - S.drag.start.x;
      S.floating.dy = p.y - S.drag.start.y;
      render();
    }
  }

  function onUp(e) {
    if (S.panning) {
      S.panning = null;
      stage.classList.remove('panning');
      return;
    }
    if (!S.drag) return;
    var d = S.drag;
    S.drag = null;

    if (d.type === 'draw') {
      pushHistory();
      renderLayers();
    } else if (d.type === 'shape') {
      var l = guardLayer();
      if (l && S.preview) {
        drawShape(l.ctx, S.preview);
        pushHistory();
      }
      S.preview = null;
      render(); renderLayers();
    } else if (d.type === 'sel') {
      if (d.cur) {
        var r = normalizeRect(d.start, d.cur);
        S.sel = (r.w > 0 && r.h > 0) ? r : null;
      }
      render();
    } else if (d.type === 'move' && S.floating) {
      var l2 = guardLayer();
      var f = S.floating;
      if (l2) {
        l2.ctx.drawImage(f.canvas, f.x + f.dx, f.y + f.dy);
        pushHistory();
        renderLayers();
      }
      S.sel = { x: f.x + f.dx, y: f.y + f.dy, w: f.w, h: f.h };
      S.floating = null;
      render();
    }
  }

  /* ----------------------------------------------------------------- actions */

  function clearSelection() {
    if (!S.sel) return;
    var l = guardLayer();
    if (!l) return;
    l.ctx.clearRect(S.sel.x, S.sel.y, S.sel.w, S.sel.h);
    pushHistory(); render(); renderLayers();
  }

  function addLayer() {
    var l = mkLayer('Layer ' + (S.layers.length + 1));
    S.layers.splice(S.active + 1, 0, l);
    S.active = S.active + 1;
    pushHistory(); renderLayers(); render(); updateStatus();
  }

  function duplicateLayer() {
    var src = activeLayer();
    if (!src) return;
    var l = mkLayer(src.name + ' copy');
    l.opacity = src.opacity;
    l.ctx.drawImage(src.canvas, 0, 0);
    S.layers.splice(S.active + 1, 0, l);
    S.active++;
    pushHistory(); renderLayers(); render(); updateStatus();
  }

  function deleteLayer() {
    if (S.layers.length <= 1) { toast('The document needs at least one layer'); return; }
    S.layers.splice(S.active, 1);
    S.active = Math.max(0, S.active - 1);
    pushHistory(); renderLayers(); render(); updateStatus();
  }

  function moveLayer(dir) {
    var i = S.active, j = i + dir;
    if (j < 0 || j >= S.layers.length) return;
    var tmp = S.layers[i];
    S.layers[i] = S.layers[j];
    S.layers[j] = tmp;
    S.active = j;
    pushHistory(); renderLayers(); render(); updateStatus();
  }

  function mergeDown() {
    if (S.active === 0) { toast('Nothing below to merge into'); return; }
    var top = S.layers[S.active], below = S.layers[S.active - 1];
    below.ctx.save();
    below.ctx.globalAlpha = top.opacity;
    below.ctx.drawImage(top.canvas, 0, 0);
    below.ctx.restore();
    S.layers.splice(S.active, 1);
    S.active--;
    pushHistory(); renderLayers(); render(); updateStatus();
  }

  function clearLayer() {
    var l = guardLayer();
    if (!l) return;
    l.ctx.clearRect(0, 0, S.w, S.h);
    pushHistory(); render(); renderLayers();
  }

  function transformDoc(kind) {
    var rotate = (kind === 'rot-cw' || kind === 'rot-ccw');
    var nw = rotate ? S.h : S.w;
    var nh = rotate ? S.w : S.h;
    S.layers.forEach(function (l) {
      var cv = document.createElement('canvas');
      cv.width = nw; cv.height = nh;
      var c = cv.getContext('2d');
      c.imageSmoothingEnabled = false;
      c.save();
      if (kind === 'flip-h') { c.translate(nw, 0); c.scale(-1, 1); }
      else if (kind === 'flip-v') { c.translate(0, nh); c.scale(1, -1); }
      else if (kind === 'rot-cw') { c.translate(nw, 0); c.rotate(Math.PI / 2); }
      else { c.translate(0, nh); c.rotate(-Math.PI / 2); }
      c.drawImage(l.canvas, 0, 0);
      c.restore();
      l.canvas = cv;
      l.ctx = cv.getContext('2d', { willReadFrequently: true });
    });
    S.w = nw; S.h = nh; S.sel = null; S.floating = null;
    $('#resize-w').value = S.w;
    $('#resize-h').value = S.h;
    pushHistory(); fitZoom(); render(); renderLayers(); updateStatus();
  }

  function resizeDoc(nw, nh) {
    nw = Math.max(1, Math.min(1024, Math.round(nw)));
    nh = Math.max(1, Math.min(1024, Math.round(nh)));
    S.layers.forEach(function (l) {
      var cv = document.createElement('canvas');
      cv.width = nw; cv.height = nh;
      var c = cv.getContext('2d');
      c.imageSmoothingEnabled = false;
      c.drawImage(l.canvas, 0, 0, S.w, S.h, 0, 0, nw, nh);
      l.canvas = cv;
      l.ctx = cv.getContext('2d', { willReadFrequently: true });
    });
    S.w = nw; S.h = nh; S.sel = null; S.floating = null;
    $('#resize-w').value = nw;
    $('#resize-h').value = nh;
    pushHistory(); fitZoom(); render(); renderLayers(); updateStatus();
  }

  /* ----------------------------------------------------------------- effects */

  function readLayer() {
    var l = guardLayer();
    if (!l) return null;
    return { layer: l, img: l.ctx.getImageData(0, 0, S.w, S.h) };
  }

  function commitLayer(l, img) {
    l.ctx.putImageData(img, 0, 0);
    pushHistory(); render(); renderLayers();
  }

  function runEffect(name) {
    var got = readLayer();
    if (!got) return;
    var img = got.img;
    switch (name) {
      case 'invert': C.invert(img); break;
      case 'grayscale': C.grayscale(img); break;
      case 'posterize': C.posterize(img, +$('#fx-levels').value); break;
      case 'threshold': C.threshold(img, 128); break;
      case 'blur': C.blur(img, +$('#fx-blur').value); break;
      case 'noise': C.noise(img, +$('#fx-noise').value, (Date.now() % 99991)); break;
      case 'outline': C.outline(img, $('#outline-color').value, +$('#outline-width').value); break;
      case 'shadow': C.dropShadow(img, +$('#shadow-dx').value, +$('#shadow-dy').value, $('#shadow-color').value, 1); break;
      default: return;
    }
    commitLayer(got.layer, img);
  }

  function applyAdjust(live) {
    var l = activeLayer();
    if (!l || l.locked) return;
    if (!S.fxBase) S.fxBase = l.ctx.getImageData(0, 0, S.w, S.h);
    var img = { width: S.w, height: S.h, data: new Uint8ClampedArray(S.fxBase.data) };
    C.brightness(img, +$('#fx-brightness').value);
    C.contrast(img, +$('#fx-contrast').value);
    C.saturation(img, +$('#fx-saturation').value);
    C.hueRotate(img, +$('#fx-hue').value);
    l.ctx.putImageData(new ImageData(new Uint8ClampedArray(img.data), S.w, S.h), 0, 0);
    render();
    if (!live) { pushHistory(); renderLayers(); }
  }

  function resetAdjust(commit) {
    var l = activeLayer();
    if (S.fxBase && l) l.ctx.putImageData(S.fxBase, 0, 0);
    S.fxBase = null;
    ['fx-brightness', 'fx-contrast', 'fx-saturation', 'fx-hue'].forEach(function (id) {
      $('#' + id).value = 0;
      $('#' + id + '-val').textContent = '0';
    });
    if (commit) { pushHistory(); renderLayers(); }
    render();
  }

  function applyPaletteToLayer(mode) {
    var got = readLayer();
    if (!got) return;
    var pal = selectedDitherPalette();
    if (mode === 'quantize') C.quantize(got.img, pal);
    else if (mode === 'fs') C.ditherFloydSteinberg(got.img, pal);
    else C.ditherBayer(got.img, pal, 32);
    commitLayer(got.layer, got.img);
  }

  function addText() {
    var l = guardLayer();
    if (!l) return;
    var txt = $('#text-content').value;
    if (!txt.trim()) { toast('Type some text first'); return; }
    var size = Math.max(4, +$('#text-size').value || 12);
    var bold = $('#text-bold').checked ? 'bold ' : '';
    var font = $('#text-font').value;
    var anchor = S.textAnchor || { x: 2, y: 2 };
    l.ctx.save();
    l.ctx.globalAlpha = S.opacity;
    l.ctx.fillStyle = S.color;
    l.ctx.font = bold + size + 'px ' + font;
    l.ctx.textBaseline = 'top';
    var lines = txt.split('\n');
    for (var i = 0; i < lines.length; i++) {
      l.ctx.fillText(lines[i], anchor.x, anchor.y + i * Math.round(size * 1.2));
    }
    l.ctx.restore();
    pushHistory(); render(); renderLayers();
    toast('Text added');
  }

  /* -------------------------------------------------------------- file / IO */

  function newDoc(w, h) {
    S.w = w; S.h = h;
    S.layers = [mkLayer('Layer 1')];
    S.active = 0;
    S.sel = null; S.floating = null; S.preview = null; S.fxBase = null;
    S.history = []; S.hpos = -1;
    $('#resize-w').value = w;
    $('#resize-h').value = h;
    fitZoom(); render(); renderLayers(); updateStatus();
    pushHistory();
  }

  function projectObject() {
    return {
      app: 'Pixel Studio', version: 1,
      w: S.w, h: S.h,
      palette: S.palette.slice(),
      layers: S.layers.map(function (l) {
        return {
          name: l.name, visible: l.visible, opacity: l.opacity, locked: l.locked,
          data: l.canvas.toDataURL('image/png')
        };
      })
    };
  }

  function loadProject(obj) {
    if (!obj || !obj.layers || !obj.layers.length) { toast('Not a Pixel Studio project'); return; }
    S.w = obj.w || 64; S.h = obj.h || 64;
    S.layers = obj.layers.map(function (o) {
      var l = mkLayer(o.name || 'Layer');
      l.visible = o.visible !== false;
      l.opacity = typeof o.opacity === 'number' ? o.opacity : 1;
      l.locked = !!o.locked;
      return l;
    });
    S.active = 0;
    if (Array.isArray(obj.palette) && obj.palette.length) { S.palette = obj.palette.slice(); renderPalette(); }
    var pending = S.layers.length;
    S.layers.forEach(function (l, i) {
      var im = new Image();
      im.onload = function () {
        l.ctx.imageSmoothingEnabled = false;
        l.ctx.clearRect(0, 0, S.w, S.h);
        l.ctx.drawImage(im, 0, 0, S.w, S.h);
        pending--;
        if (pending <= 0) {
          S.history = []; S.hpos = -1;
          fitZoom(); render(); renderLayers(); updateStatus();
          pushHistory();
          toast('Project loaded');
        }
      };
      im.onerror = function () {
        pending--;
        if (pending <= 0) { render(); renderLayers(); }
      };
      im.src = obj.layers[i].data;
    });
  }

  var autosaveTimer = null;
  function queueAutosave() {
    if (!S.ready) return;            // never overwrite an existing autosave on load
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(function () {
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(projectObject()));
        var d = new Date();
        $('#autosave-hint').textContent = 'Autosave: ' +
          ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) +
          ':' + ('0' + d.getSeconds()).slice(-2);
      } catch (err) {
        $('#autosave-hint').textContent = 'Autosave: unavailable (storage full)';
      }
    }, 900);
  }

  function exportPNG(scale, filename) {
    var cv = document.createElement('canvas');
    cv.width = S.w * scale; cv.height = S.h * scale;
    var c = cv.getContext('2d');
    c.imageSmoothingEnabled = false;
    c.drawImage(composite(), 0, 0, cv.width, cv.height);
    cv.toBlob(function (blob) {
      download(blob, filename || 'pixel-studio.png');
      toast('Exported ' + cv.width + '×' + cv.height + ' PNG');
    }, 'image/png');
  }

  function importImage(file) {
    var url = URL.createObjectURL(file);
    var im = new Image();
    im.onload = function () {
      var sc = Math.min(S.w / im.width, S.h / im.height);
      var dw = Math.max(1, Math.round(im.width * sc));
      var dh = Math.max(1, Math.round(im.height * sc));
      var ox = Math.round((S.w - dw) / 2);
      var oy = Math.round((S.h - dh) / 2);
      var l = mkLayer(file.name.replace(/\.[^.]+$/, '').slice(0, 20) || 'Imported');
      l.ctx.imageSmoothingEnabled = false;
      l.ctx.drawImage(im, 0, 0, im.width, im.height, ox, oy, dw, dh);
      S.layers.splice(S.active + 1, 0, l);
      S.active++;
      URL.revokeObjectURL(url);
      pushHistory(); render(); renderLayers(); updateStatus();
      toast('Imported — reduce colours in the Palette panel for pixel art');
    };
    im.onerror = function () { toast('Could not read that image'); URL.revokeObjectURL(url); };
    im.src = url;
  }

  /* ------------------------------------------------------------------- wiring */

  function bindUI() {
    // tools
    $$('.tool').forEach(function (b) {
      b.onclick = function () {
        S.tool = b.dataset.tool;
        $$('.tool').forEach(function (x) { x.classList.toggle('active', x === b); });
        stage.style.cursor = (S.tool === 'hand') ? 'grab' : (S.tool === 'text' ? 'text' : 'crosshair');
      };
    });

    // file buttons
    $('#btn-new').onclick = function () {
      modal('New document',
        '<div class="row"><label>Width</label><input type="number" id="nw" min="1" max="1024" value="' + S.w + '"></div>' +
        '<div class="row"><label>Height</label><input type="number" id="nh" min="1" max="1024" value="' + S.h + '"></div>' +
        '<div class="presets-row" id="presets">' +
        [16, 32, 48, 64, 128, 256, 512].map(function (v) { return '<button class="btn" data-p="' + v + '">' + v + '²</button>'; }).join('') +
        '</div><div class="hint">Changing the size starts a fresh document with one empty layer.</div>',
        function (ov) {
          var w = +$('#nw', ov).value || 64, h = +$('#nh', ov).value || 64;
          newDoc(Math.max(1, Math.min(1024, w)), Math.max(1, Math.min(1024, h)));
          toast('New ' + S.w + '×' + S.h + ' document');
        }, 'Create');
      $$('#presets button').forEach(function (b) {
        b.onclick = function () {
          $('#nw').value = b.dataset.p;
          $('#nh').value = b.dataset.p;
        };
      });
    };

    $('#btn-open').onclick = function () { $('#file-open').click(); };
    $('#file-open').onchange = function (e) {
      var f = e.target.files[0];
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        try { loadProject(JSON.parse(fr.result)); }
        catch (err) { toast('That file is not a valid project'); }
      };
      fr.readAsText(f);
      e.target.value = '';
    };

    $('#btn-save').onclick = function () {
      var blob = new Blob([JSON.stringify(projectObject())], { type: 'application/json' });
      download(blob, 'pixel-studio-project.json');
      toast('Project saved');
    };

    $('#btn-import').onclick = function () { $('#file-import').click(); };
    $('#file-import').onchange = function (e) {
      var f = e.target.files[0];
      if (f) importImage(f);
      e.target.value = '';
    };

    $('#btn-export').onclick = function () {
      modal('Export PNG',
        '<div class="row"><label>Scale</label><select id="ex-scale">' +
        [1, 2, 4, 8, 10, 16, 20].map(function (s) {
          return '<option value="' + s + '"' + (s === 8 ? ' selected' : '') + '>' + s + '× (' + (S.w * s) + '×' + (S.h * s) + ')</option>';
        }).join('') + '</select></div>' +
        '<div class="row"><label>Name</label><input type="text" id="ex-name" value="pixel-studio"></div>' +
        '<div class="hint">Nearest-neighbour scaling keeps the pixels sharp.</div>',
        function (ov) {
          var s = +$('#ex-scale', ov).value || 1;
          var name = ($('#ex-name', ov).value || 'pixel-studio').replace(/[^\w\-]+/g, '-');
          exportPNG(s, name + '.png');
        }, 'Download');
    };

    $('#btn-undo').onclick = undo;
    $('#btn-redo').onclick = redo;

    $('#zoom-in').onclick = function () { setZoom(effZoom() + 1); };
    $('#zoom-out').onclick = function () { setZoom(effZoom() - 1); };
    $('#zoom-fit').onclick = function () { S.panX = 0; S.panY = 0; stage.style.transform = ''; fitZoom(); };

    viewport.addEventListener('wheel', function (e) {
      if (!e.ctrlKey && !e.metaKey && Math.abs(e.deltaY) < 4) return;
      e.preventDefault();
      setZoom(effZoom() + (e.deltaY < 0 ? 1 : -1));
    }, { passive: false });

    // canvas pointer events
    screen.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    screen.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    // colour
    $('#hex-input').onchange = function () { setColor(this.value); };
    $('#color-input').oninput = function () { setColor(this.value); };
    $('#swap-colors').onclick = function () {
      var t = S.color; S.color = S.color2; S.color2 = t;
      setColor(S.color); setColor(S.color2, true);
    };
    $('#palette-select').onchange = function () { loadPalette(this.value); };
    $('#add-swatch').onclick = function () {
      if (S.palette.indexOf(S.color) === -1) { S.palette.push(S.color); renderPalette(); toast('Added to palette'); }
    };
    $('#reset-palette').onclick = function () { loadPalette($('#palette-select').value); };

    // brush
    $('#brush-size').oninput = function () {
      S.brush = +this.value;
      $('#brush-size-val').textContent = S.brush;
    };
    $('#brush-opacity').oninput = function () {
      S.opacity = +this.value / 100;
      $('#brush-opacity-val').textContent = this.value;
    };
    $('#sym-x').onchange = function () { S.symX = this.checked; };
    $('#sym-y').onchange = function () { S.symY = this.checked; };
    $('#fill-shapes').onchange = function () { S.fillShapes = this.checked; };
    $('#show-grid').onchange = function () { S.showGrid = this.checked; render(); };
    $('#tolerance').oninput = function () {
      S.tolerance = +this.value;
      $('#tolerance-val').textContent = this.value;
    };

    // layers
    $('#layer-add').onclick = addLayer;
    $('#layer-dup').onclick = duplicateLayer;
    $('#layer-del').onclick = deleteLayer;
    $('#layer-up').onclick = function () { moveLayer(1); };
    $('#layer-down').onclick = function () { moveLayer(-1); };
    $('#layer-merge').onclick = mergeDown;
    $('#layer-clear').onclick = clearLayer;
    $('#layer-opacity').oninput = function () {
      var l = activeLayer();
      if (!l) return;
      l.opacity = +this.value / 100;
      $('#layer-opacity-val').textContent = this.value;
      render();
    };
    $('#layer-opacity').onchange = function () { pushHistory(); };

    // adjust sliders
    ['fx-brightness', 'fx-contrast', 'fx-saturation', 'fx-hue'].forEach(function (id) {
      var el = $('#' + id);
      el.addEventListener('input', function () {
        $('#' + id + '-val').textContent = el.value;
        applyAdjust(true);
      });
      el.addEventListener('change', function () {
        applyAdjust(false);
        S.fxBase = null;
      });
    });
    $('#fx-apply').onclick = function () {
      if (S.fxBase) { pushHistory(); S.fxBase = null; toast('Adjustments applied'); }
    };
    $('#fx-reset').onclick = function () { resetAdjust(false); };

    // effects
    $$('[data-fx]').forEach(function (b) {
      b.onclick = function () { runEffect(b.dataset.fx); };
    });
    $('#fx-levels').oninput = function () { $('#fx-levels-val').textContent = this.value; };
    $('#fx-blur').oninput = function () { $('#fx-blur-val').textContent = this.value; };
    $('#fx-noise').oninput = function () { $('#fx-noise-val').textContent = this.value; };

    // palette & dither
    $('#do-quantize').onclick = function () { applyPaletteToLayer('quantize'); };
    $('#do-dither-fs').onclick = function () { applyPaletteToLayer('fs'); };
    $('#do-dither-bayer').onclick = function () { applyPaletteToLayer('bayer'); };

    // text
    $('#text-add').onclick = addText;
    $('#text-clear').onclick = function () { $('#text-content').value = ''; };

    // canvas ops
    $('#doc-fliph').onclick = function () { transformDoc('flip-h'); };
    $('#doc-flipv').onclick = function () { transformDoc('flip-v'); };
    $('#doc-rot-cw').onclick = function () { transformDoc('rot-cw'); };
    $('#doc-rot-ccw').onclick = function () { transformDoc('rot-ccw'); };
    $('#do-resize').onclick = function () {
      resizeDoc(+$('#resize-w').value, +$('#resize-h').value);
      toast('Canvas resized to ' + S.w + '×' + S.h);
    };
    $('#btn-restore').onclick = function () {
      var raw = localStorage.getItem(AUTOSAVE_KEY);
      if (!raw) { toast('No autosave found'); return; }
      try { loadProject(JSON.parse(raw)); } catch (err) { toast('Autosave is unreadable'); }
    };

    // keyboard
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', function (e) { if (e.code === 'Space') S.spaceDown = false; });
  }

  var TOOL_KEYS = {
    b: 'pencil', p: 'pencil', e: 'eraser', g: 'bucket', l: 'line',
    r: 'rect', o: 'ellipse', i: 'picker', m: 'select', t: 'text', h: 'hand'
  };

  function onKeyDown(e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    if (e.code === 'Space') { S.spaceDown = true; e.preventDefault(); return; }
    var k = e.key.toLowerCase();

    if ((e.ctrlKey || e.metaKey) && k === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo(); else undo();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); redo(); return; }
    if ((e.ctrlKey || e.metaKey) && k === 's') {
      e.preventDefault();
      var blob = new Blob([JSON.stringify(projectObject())], { type: 'application/json' });
      download(blob, 'pixel-studio-project.json');
      return;
    }
    if ((e.ctrlKey || e.metaKey) && k === 'a') {
      e.preventDefault();
      S.sel = { x: 0, y: 0, w: S.w, h: S.h };
      render();
      return;
    }
    if (e.ctrlKey || e.metaKey) return;

    if (TOOL_KEYS[k]) {
      S.tool = TOOL_KEYS[k];
      $$('.tool').forEach(function (x) { x.classList.toggle('active', x.dataset.tool === S.tool); });
      return;
    }
    if (k === 'x') { $('#swap-colors').click(); return; }
    if (k === '[') { S.brush = Math.max(1, S.brush - 1); $('#brush-size').value = S.brush; $('#brush-size-val').textContent = S.brush; return; }
    if (k === ']') { S.brush = Math.min(24, S.brush + 1); $('#brush-size').value = S.brush; $('#brush-size-val').textContent = S.brush; return; }
    if (k === '+' || k === '=') { setZoom(effZoom() + 1); return; }
    if (k === '-') { setZoom(effZoom() - 1); return; }
    if (k === '0') { fitZoom(); return; }
    if (k === 'escape') { S.sel = null; S.floating = null; render(); return; }
    if (k === 'delete' || k === 'backspace') { e.preventDefault(); clearSelection(); return; }
  }

  /* --------------------------------------------------------------------- boot */

  function boot() {
    fillPaletteSelects();
    loadPalette('db16');
    setColor('#1b1b1f');
    setColor('#ffffff', true);
    bindUI();
    newDoc(64, 64);
    S.ready = true;
    window.addEventListener('resize', function () { render(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
