/* Pixel Studio Edit — editor front-end.
 * Original implementation, MIT licensed. Everything runs locally in the browser.
 */
(function () {
  'use strict';

  var C = window.PSCore;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var byId = function (id) { return document.getElementById(id); };

  var MAX_BACKING = 12e6;
  var AUTOSAVE_KEY = 'pixelstudioedit.autosave.v3';

  var STICKERS = [
    '★', '☆', '✦', '❤', '♥', '●', '■', '▲', '◆', '⬟',
    '✓', '✖', '→', '↺', '☀', '☁', '⚡', '♪', '✈', '⚑',
    '☺', '☹', '✿', '❄', '🍄', '🌸', '⭐', '🔥', '🎮', '👾',
    '🤖', '💎', '🎈', '🍕', '😀', '😎', '🚀', '💡', '🏆', '🎯'
  ];

  var FONTS = [
    { name: 'Arcade', css: "'Press Start 2P', monospace" },
    { name: 'Bungee', css: 'Bungee, Impact, sans-serif' },
    { name: 'Lobster', css: 'Lobster, cursive' },
    { name: 'Pacifico', css: 'Pacifico, cursive' },
    { name: 'Anton', css: 'Anton, Impact, sans-serif' },
    { name: 'Righteous', css: 'Righteous, sans-serif' },
    { name: 'Monoton', css: 'Monoton, fantasy' },
    { name: 'Orbitron', css: 'Orbitron, sans-serif' },
    { name: 'Bebas', css: "'Bebas Neue', Impact, sans-serif" },
    { name: 'Caveat', css: 'Caveat, cursive' },
    { name: 'Fredoka', css: 'Fredoka, sans-serif' },
    { name: 'Cinzel', css: 'Cinzel, serif' },
    { name: 'Impact', css: 'Impact, sans-serif' },
    { name: 'Georgia', css: 'Georgia, serif' },
    { name: 'Courier', css: "'Courier New', monospace" },
    { name: 'Arial', css: 'Arial, Helvetica, sans-serif' }
  ];

  var S = {
    w: 64, h: 64, zoom: 8,
    layers: [], active: 0,
    tool: 'pencil',
    color: '#1b1b1f', color2: '#ffffff',
    brush: 1, opacity: 1, tolerance: 0,
    symX: false, symY: false, showGrid: true, fillShapes: false,
    sel: null, floating: null, preview: null, drag: null, panning: null,
    history: [], hpos: -1,
    fxBase: null, textAnchor: null,
    palette: [], ready: false, spaceDown: false,
    text: {
      font: "'Press Start 2P', monospace",
      bold: true, italic: false, gradient: false,
      stroke: 0, strokeColor: '#000000',
      shadow: 0, shadowColor: '#000000',
      curve: 0, depth: 0, depthColor: '#2b2b3a',
      reflection: false, emboss: false
    },
    sticker: '★',
    mode3d: 'text',
    tab: 'text'
  };

  var screen, screenCtx, stage, stageWrap;
  var compCv = document.createElement('canvas');
  var compCtx = compCv.getContext('2d');
  var prevCv = document.createElement('canvas');
  var prevCtx = prevCv.getContext('2d');
  var checkerPattern = null;
  var toastTimer = null;
  var autosaveTimer = null;

  /* ----------------------------------------------------------------- helpers */

  function toast(msg) {
    var t = byId('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  function on(id, evt, fn) {
    var el = byId(id);
    if (!el) { console.warn('pixelstudioedit: missing element #' + id); return; }
    el.addEventListener(evt, fn);
  }

  function modal(title, html, onOk, okLabel) {
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML =
      '<div class="modal"><h3>' + title + '</h3><div class="content">' + html + '</div>' +
      '<div class="actions"><button class="btn" data-cancel>Cancel</button>' +
      '<button class="btn primary" data-ok>' + (okLabel || 'OK') + '</button></div></div>';
    document.body.appendChild(overlay);
    function close() { overlay.remove(); document.removeEventListener('keydown', esc, true); }
    function esc(e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } }
    document.addEventListener('keydown', esc, true);
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
    $('[data-cancel]', overlay).onclick = close;
    $('[data-ok]', overlay).onclick = function () { if (onOk(overlay) !== false) close(); };
    return overlay;
  }

  function saveBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  function offscreen(w, h) {
    var cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    var c = cv.getContext('2d');
    c.imageSmoothingEnabled = false;
    return cv;
  }

  /* ------------------------------------------------------------------ layers */

  function mkLayer(name) {
    var cv = document.createElement('canvas');
    cv.width = S.w;
    cv.height = S.h;
    return {
      name: name, visible: true, opacity: 1, locked: false,
      canvas: cv, ctx: cv.getContext('2d', { willReadFrequently: true })
    };
  }

  function activeLayer() { return S.layers[S.active]; }

  function guardLayer() {
    var l = activeLayer();
    if (!l) { toast('No layer selected'); return null; }
    if (l.locked) { toast('Layer is locked'); return null; }
    if (!l.visible) { toast('Layer is hidden'); return null; }
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
    S.sel = null; S.floating = null; S.preview = null;
    render(); renderLayers(); updateStatus();
  }

  function setSaveStatus(text) {
    var el = byId('save-status');
    if (el) { el.textContent = text; el.classList.toggle('dirty', text !== 'Saved'); }
  }

  function pushHistory() {
    setSaveStatus('Unsaved');
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
    byId('btn-undo').disabled = S.hpos <= 0;
    byId('btn-redo').disabled = S.hpos >= S.history.length - 1;
  }

  /* --------------------------------------------------------------- rendering */

  function effZoom() {
    var max = Math.floor(Math.sqrt(MAX_BACKING / Math.max(1, S.w * S.h)));
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

  /* Transparency checkerboard: small, low-contrast squares in screen space so it
     never competes with the artwork. */
  function drawChecker(ctx, W, H) {
    var cell = 10;
    ctx.fillStyle = '#252b35';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#2c333f';
    for (var y = 0; y < H; y += cell) {
      for (var x = ((y / cell) % 2) * cell; x < W; x += cell * 2) {
        ctx.fillRect(x, y, Math.min(cell, W - x), Math.min(cell, H - y));
      }
    }
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

    if (S.showChecker) drawChecker(screenCtx, W, H);
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

    if (S.showGrid && z >= 6 && z <= 20) {
      screenCtx.save();
      screenCtx.strokeStyle = 'rgba(255,255,255,0.055)';
      screenCtx.lineWidth = 1;
      screenCtx.beginPath();
      for (var x = 1; x < S.w; x++) { screenCtx.moveTo(x * z + 0.5, 0); screenCtx.lineTo(x * z + 0.5, H); }
      for (var y = 1; y < S.h; y++) { screenCtx.moveTo(0, y * z + 0.5); screenCtx.lineTo(W, y * z + 0.5); }
      screenCtx.stroke();
      screenCtx.restore();
    }

    var selRect = S.sel;
    if (S.drag && (S.drag.type === 'sel' || S.drag.type === 'crop') && S.drag.cur) {
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

    byId('zoom-label').textContent = Math.round(z * 100) + '%';
  }

  function normalizeRect(a, b) {
    var x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
    var w = Math.abs(b.x - a.x) + 1, h = Math.abs(b.y - a.y) + 1;
    x = Math.max(0, Math.min(S.w - 1, x));
    y = Math.max(0, Math.min(S.h - 1, y));
    return { x: x, y: y, w: Math.min(w, S.w - x), h: Math.min(h, S.h - y) };
  }

  function updateStatus() {
    var l = activeLayer();
    byId('status-layer').textContent = l ? l.name : '—';
    byId('doc-chip').textContent = S.w + ' × ' + S.h;
  }

  function fitZoom() {
    var pad = 56;
    var zx = (stageWrap.clientWidth - pad) / S.w;
    var zy = (stageWrap.clientHeight - pad) / S.h;
    S.zoom = Math.max(1, Math.min(16, Math.floor(Math.min(zx, zy)) || 1));
    render();
  }

  function setZoom(z) {
    S.zoom = Math.max(1, Math.min(64, Math.round(z)));
    render();
  }

  /* --------------------------------------------------------------- layers UI */

  function renderLayers() {
    var box = byId('layers');
    box.innerHTML = '';
    for (var i = S.layers.length - 1; i >= 0; i--) {
      (function (i) {
        var l = S.layers[i];
        var el = document.createElement('div');
        el.className = 'layer' + (i === S.active ? ' active' : '');

        var eye = document.createElement('button');
        eye.className = 'eye' + (l.visible ? ' on' : '');
        eye.textContent = l.visible ? '●' : '○';
        eye.title = 'Show / hide';
        eye.onclick = function (e) { e.stopPropagation(); l.visible = !l.visible; render(); renderLayers(); };

        var th = document.createElement('canvas');
        th.width = 36; th.height = 36;
        var tc = th.getContext('2d');
        tc.imageSmoothingEnabled = false;
        var sc = Math.min(36 / S.w, 36 / S.h);
        var dw = Math.max(1, Math.round(S.w * sc)), dh = Math.max(1, Math.round(S.h * sc));
        tc.drawImage(l.canvas, Math.round((36 - dw) / 2), Math.round((36 - dh) / 2), dw, dh);

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
        el.onclick = function () {
          S.active = i;
          byId('layer-opacity').value = Math.round(l.opacity * 100);
          byId('layer-opacity-val').textContent = Math.round(l.opacity * 100);
          renderLayers(); updateStatus();
        };
        box.appendChild(el);
      })(i);
    }
    var cur = activeLayer();
    if (cur) {
      byId('layer-opacity').value = Math.round(cur.opacity * 100);
      byId('layer-opacity-val').textContent = Math.round(cur.opacity * 100);
    }
  }

  /* ------------------------------------------------------------------ colour */

  function setColor(hex, secondary) {
    var rgb = C.parseColor(hex);
    var norm = C.rgbToHex(rgb[0], rgb[1], rgb[2]);
    if (secondary) S.color2 = norm; else S.color = norm;
    byId('rail-primary').style.background = S.color;
    byId('rail-secondary').style.background = S.color2;
    byId('sw-primary').firstElementChild.style.background = S.color;
    byId('sw-secondary').firstElementChild.style.background = S.color2;
    if (!secondary) {
      byId('hex-input').value = S.color.toUpperCase();
      byId('color-input').value = S.color;
    }
    markPaletteSelection();
  }

  function renderPalette() {
    var box = byId('palette');
    box.innerHTML = '';
    S.palette.forEach(function (hex) {
      var b = document.createElement('button');
      b.style.background = hex;
      b.title = hex;
      b.dataset.hex = hex.toLowerCase();
      b.onclick = function (e) { setColor(hex, e.shiftKey); };
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
    var html = Object.keys(C.PALETTES).map(function (k) {
      return '<option value="' + k + '">' + C.PALETTES[k].name + '</option>';
    }).join('');
    byId('palette-select').innerHTML = html;
    byId('dither-palette').innerHTML = html;
  }

  function selectedDitherPalette() {
    var p = C.PALETTES[byId('dither-palette').value];
    if (p) return p.colors.slice();
    return S.palette.length ? S.palette.slice() : C.PALETTES.db16.colors.slice();
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
    var half = Math.floor(size / 2);
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
    pushHistory(); render(); renderLayers();
  }

  function pickColor(p) {
    var img = compCtx.getImageData(0, 0, S.w, S.h);
    var px = C.getPixel(img, p.x, p.y);
    if (px[3] === 0) { toast('That pixel is transparent'); return; }
    var hex = C.rgbToHex(px[0], px[1], px[2]);
    setColor(hex);
    toast('Picked ' + hex.toUpperCase());
  }

  /* ---------------------------------------------------------- pointer events */

  function onDown(e) {
    if (e.button === 1 || S.spaceDown || S.tool === 'hand') {
      S.panning = { x: e.clientX, y: e.clientY };
      stage.classList.add('panning');
      e.preventDefault();
      return;
    }
    var p = pixelFromEvent(e);
    if (!p.inside) return;
    var color = e.button === 2 ? S.color2 : S.color;
    var l = activeLayer();

    if (S.tool === 'pencil' || S.tool === 'eraser') {
      if (!guardLayer()) return;
      var erase = S.tool === 'eraser';
      S.drag = { type: 'draw', last: p, color: color, erase: erase };
      stampAt(l, p.x, p.y, color, erase);
      render();
      if (screen.setPointerCapture) { try { screen.setPointerCapture(e.pointerId); } catch (err) {} }
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
    } else if (S.tool === 'crop') {
      S.drag = { type: 'crop', start: p, cur: p };
      S.preview = null;
      render();
    } else if (S.tool === 'text') {
      openTextOverlay(p);
    }
  }

  function beginMove(p) {
    var l = guardLayer();
    if (!l) return;
    var r = S.sel;
    var fl = offscreen(r.w, r.h);
    fl.getContext('2d').drawImage(l.canvas, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h);
    l.ctx.clearRect(r.x, r.y, r.w, r.h);
    S.floating = { canvas: fl, x: r.x, y: r.y, dx: 0, dy: 0, w: r.w, h: r.h };
    S.drag = { type: 'move', start: p };
    render();
  }

  function onMove(e) {
    var p = pixelFromEvent(e);
    byId('status-pos').textContent = p.inside ? (p.x + ', ' + p.y) : '—';

    if (S.panning) {
      stageWrap.scrollLeft -= e.clientX - S.panning.x;
      stageWrap.scrollTop -= e.clientY - S.panning.y;
      S.panning = { x: e.clientX, y: e.clientY };
      return;
    }
    if (!S.drag) return;

    if (S.drag.type === 'draw') {
      var l = activeLayer();
      if (!l) return;
      if (!p.inside) { S.drag.last = p; return; }
      strokeTo(l, S.drag.last.x, S.drag.last.y, p.x, p.y, S.drag.color, S.drag.erase);
      S.drag.last = p;
      render();
    } else if (S.drag.type === 'shape') {
      S.preview.x1 = p.x; S.preview.y1 = p.y;
      render();
    } else if (S.drag.type === 'sel' || S.drag.type === 'crop') {
      S.drag.cur = p;
      render();
    } else if (S.drag.type === 'move' && S.floating) {
      S.floating.dx = p.x - S.drag.start.x;
      S.floating.dy = p.y - S.drag.start.y;
      render();
    }
  }

  function onUp() {
    if (S.panning) { S.panning = null; stage.classList.remove('panning'); return; }
    if (!S.drag) return;
    var d = S.drag;
    S.drag = null;

    if (d.type === 'draw') {
      pushHistory(); renderLayers();
    } else if (d.type === 'shape') {
      var l = guardLayer();
      if (l && S.preview) { drawShape(l.ctx, S.preview); pushHistory(); }
      S.preview = null;
      render(); renderLayers();
    } else if (d.type === 'crop') {
      if (d.cur) {
        var cr = normalizeRect(d.start, d.cur);
        if (cr.w > 1 && cr.h > 1) { S.sel = cr; cropToSelection(); }
        else toast('Drag a larger area to crop');
      }
      render();
    } else if (d.type === 'sel') {
      if (d.cur) {
        var r = normalizeRect(d.start, d.cur);
        S.sel = (r.w > 0 && r.h > 0) ? r : null;
      }
      render();
    } else if (d.type === 'move' && S.floating) {
      var l2 = guardLayer();
      var f = S.floating;
      if (l2) { l2.ctx.drawImage(f.canvas, f.x + f.dx, f.y + f.dy); pushHistory(); renderLayers(); }
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
    S.active++;
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
    if (S.layers.length <= 1) { toast('Keep at least one layer'); return; }
    S.layers.splice(S.active, 1);
    S.active = Math.max(0, S.active - 1);
    pushHistory(); renderLayers(); render(); updateStatus();
  }

  function moveLayer(dir) {
    var j = S.active + dir;
    if (j < 0 || j >= S.layers.length) return;
    var tmp = S.layers[S.active];
    S.layers[S.active] = S.layers[j];
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
      var cv = offscreen(nw, nh);
      var c = cv.getContext('2d');
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
    pushHistory(); fitZoom(); render(); renderLayers(); updateStatus();
  }

  function resizeDoc(nw, nh) {
    nw = Math.max(1, Math.min(2048, Math.round(nw || S.w)));
    nh = Math.max(1, Math.min(2048, Math.round(nh || S.h)));
    S.layers.forEach(function (l) {
      var cv = offscreen(nw, nh);
      cv.getContext('2d').drawImage(l.canvas, 0, 0, S.w, S.h, 0, 0, nw, nh);
      l.canvas = cv;
      l.ctx = cv.getContext('2d', { willReadFrequently: true });
    });
    S.w = nw; S.h = nh; S.sel = null; S.floating = null;
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
      case 'posterize': C.posterize(img, +byId('fx-levels').value); break;
      case 'threshold': C.threshold(img, 128); break;
      case 'blur': C.blur(img, +byId('fx-blur').value); break;
      case 'noise': C.noise(img, +byId('fx-noise').value, Date.now() % 99991); break;
      case 'vignette': C.vignette(img, 0.7); break;
      case 'sharpen': C.sharpen(img, 60); break;
      case 'sepia': C.sepia(img); break;
      case 'stripes': C.stripes(img, 4, 0.18); break;
      case 'outline': C.outline(img, byId('outline-color').value, +byId('outline-width').value); break;
      case 'shadow': C.dropShadow(img, +byId('shadow-dx').value, +byId('shadow-dy').value, byId('shadow-color').value, 1); break;
      default: return;
    }
    commitLayer(got.layer, img);
  }

  function applyAdjust(live) {
    var l = activeLayer();
    if (!l || l.locked) return;
    if (!S.fxBase) S.fxBase = l.ctx.getImageData(0, 0, S.w, S.h);
    var img = { width: S.w, height: S.h, data: new Uint8ClampedArray(S.fxBase.data) };
    C.brightness(img, +byId('fx-brightness').value);
    C.contrast(img, +byId('fx-contrast').value);
    C.saturation(img, +byId('fx-saturation').value);
    C.hueRotate(img, +byId('fx-hue').value);
    l.ctx.putImageData(new ImageData(new Uint8ClampedArray(img.data), S.w, S.h), 0, 0);
    render();
    if (!live) { pushHistory(); renderLayers(); }
  }

  function resetAdjust() {
    var l = activeLayer();
    if (S.fxBase && l) l.ctx.putImageData(S.fxBase, 0, 0);
    S.fxBase = null;
    ['fx-brightness', 'fx-contrast', 'fx-saturation', 'fx-hue'].forEach(function (id) {
      byId(id).value = 0;
      byId(id + '-val').textContent = '0';
    });
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

  function fillBackground(mode) {
    var l = guardLayer();
    if (!l) return;
    var ctx = l.ctx;
    ctx.save();
    if (mode === 'gradient') {
      var g = ctx.createLinearGradient(0, 0, S.w, S.h);
      g.addColorStop(0, S.color);
      g.addColorStop(1, S.color2);
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = S.color;
    }
    ctx.fillRect(0, 0, S.w, S.h);
    ctx.restore();
    pushHistory(); render(); renderLayers();
    toast(mode === 'gradient' ? 'Gradient background' : 'Background filled');
  }

  function removeBackground(white) {
    var got = readLayer();
    if (!got) return;
    var target = white ? [255, 255, 255] : C.parseColor(S.color);
    C.chromaKey(got.img, target, +byId('bg-tolerance').value);
    commitLayer(got.layer, got.img);
    toast('Background removed');
  }

  /* -------------------------------------------------------------------- text */

  function textFont(size) {
    return (S.text.bold ? 'bold ' : '') + (S.text.italic ? 'italic ' : '') +
      Math.max(4, size) + 'px ' + S.text.font;
  }

  function renderFontList() {
    var box = byId('font-list');
    if (!box) return;
    box.innerHTML = '';
    FONTS.forEach(function (f) {
      var b = document.createElement('button');
      b.className = 'font-item' + (S.text.font === f.css ? ' sel' : '');
      b.textContent = f.name;
      b.style.fontFamily = f.css;
      b.title = f.name;
      b.onclick = function () {
        S.text.font = f.css;
        $$('#font-list .font-item').forEach(function (x) { x.classList.toggle('sel', x === b); });
        toast('Font: ' + f.name);
      };
      box.appendChild(b);
    });
    markFontAvailability();
  }

  /* Dims any font the browser cannot actually render. */
  function markFontAvailability() {
    if (!document.fonts || !document.fonts.check) return;
    var missing = 0;
    $$('#font-list .font-item').forEach(function (el, i) {
      var f = FONTS[i];
      if (!f) return;
      var ok = true;
      try { ok = document.fonts.check('16px ' + f.css.split(',')[0].trim()); } catch (err) { ok = true; }
      el.classList.toggle('unavailable', !ok);
      if (!ok) missing++;
    });
    var note = byId('font-note');
    if (note) note.textContent = missing ? missing + ' fonts need internet' : '';
  }

  /* Draws one line, optionally curved, into ctx. */
  function drawLine(ctx, line, x, y, size, curve) {
    if (!curve) {
      ctx.fillText(line, x, y);
      if (S.text.stroke > 0) ctx.strokeText(line, x, y);
      return;
    }
    var chars = Array.from(line);
    var widths = chars.map(function (ch) { return ctx.measureText(ch).width; });
    var total = widths.reduce(function (a, b) { return a + b; }, 0);
    var acc = 0;
    for (var i = 0; i < chars.length; i++) {
      var t = chars.length === 1 ? 0 : (acc / Math.max(1, total)) * 2 - 1;
      var dy = (curve / 100) * size * 1.4 * (t * t - 1);
      ctx.fillText(chars[i], x + acc, y + dy);
      if (S.text.stroke > 0) ctx.strokeText(chars[i], x + acc, y + dy);
      acc += widths[i];
    }
  }

  /* Builds the finished text as a canvas the size of the document. */
  function buildTextCanvas() {
    var txt = byId('text-content').value;
    if (!txt || !txt.trim()) return null;
    var size = +byId('text-size').value || 12;
    var anchor = S.textAnchor || { x: 2, y: 2 };

    // 1. mask (white text) — used for depth, shadow, reflection, emboss
    var mask = offscreen(S.w, S.h);
    var mc = mask.getContext('2d');
    mc.font = textFont(size);
    mc.textBaseline = 'top';
    mc.fillStyle = '#ffffff';
    var lines = txt.split('\n');
    for (var i = 0; i < lines.length; i++) {
      drawLine(mc, lines[i], anchor.x, anchor.y + i * Math.round(size * 1.25), size, S.text.curve);
    }

    var out = offscreen(S.w, S.h);
    var c = out.getContext('2d');

    function tinted(colour) {
      var cv = offscreen(S.w, S.h);
      var cc = cv.getContext('2d');
      cc.fillStyle = colour;
      cc.fillRect(0, 0, S.w, S.h);
      cc.globalCompositeOperation = 'destination-in';
      cc.drawImage(mask, 0, 0);
      return cv;
    }

    // 2. drop shadow
    if (S.text.shadow > 0) {
      var sh = tinted(S.text.shadowColor);
      c.save();
      c.globalAlpha = 0.75;
      c.drawImage(sh, S.text.shadow, S.text.shadow);
      c.restore();
    }

    // 3. reflection
    if (S.text.reflection) {
      var refl = tinted(S.color);
      c.save();
      c.globalAlpha = 0.32;
      c.translate(0, S.h);
      c.scale(1, -1);
      c.drawImage(refl, 0, -(S.h - Math.round(size * 1.1)));
      c.restore();
    }

    // 4. extrusion (3D depth)
    if (S.text.depth > 0) {
      var ang = (+byId('td-angle').value) * Math.PI / 180;
      var img = mask.getContext('2d').getImageData(0, 0, S.w, S.h);
      var sideRgb = C.parseColor(S.text.depthColor);
      C.extrude(img, Math.cos(ang), Math.sin(ang), S.text.depth, sideRgb, null);
      var dep = offscreen(S.w, S.h);
      dep.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(img.data), S.w, S.h), 0, 0);
      c.drawImage(dep, 0, 0);
    }

    // 5. emboss
    if (S.text.emboss) {
      c.save();
      c.globalAlpha = 0.85;
      c.drawImage(tinted('#ffffff'), -1, -1);
      c.drawImage(tinted('#000000'), 1, 1);
      c.restore();
    }

    // 6. face
    c.save();
    c.font = textFont(size);
    c.textBaseline = 'top';
    c.lineJoin = 'round';
    var fill = S.color;
    if (S.text.gradient) {
      var mctx = offscreen(S.w, S.h).getContext('2d');
      mctx.font = textFont(size);
      var wMax = 0;
      lines.forEach(function (ln) { wMax = Math.max(wMax, mctx.measureText(ln).width); });
      var g = c.createLinearGradient(anchor.x, anchor.y, anchor.x + Math.max(2, wMax), anchor.y + Math.max(2, lines.length * size * 1.25));
      g.addColorStop(0, S.color);
      g.addColorStop(1, byId('text-grad2').value);
      fill = g;
    }
    c.fillStyle = fill;
    if (S.text.stroke > 0) {
      c.strokeStyle = S.text.strokeColor;
      c.lineWidth = S.text.stroke;
    }
    for (var j = 0; j < lines.length; j++) {
      drawLine(c, lines[j], anchor.x, anchor.y + j * Math.round(size * 1.25), size, S.text.curve);
    }
    c.restore();

    return out;
  }

  function addText() {
    var l = guardLayer();
    if (!l) return;
    if (!byId('text-content').value.trim()) { toast('Type some text first'); return; }
    var cv = buildTextCanvas();
    if (!cv) return;
    l.ctx.save();
    l.ctx.globalAlpha = S.opacity;
    l.ctx.drawImage(cv, 0, 0);
    l.ctx.restore();
    pushHistory(); render(); renderLayers();
    toast('Text added');
  }

  function applyStylePreset(name) {
    var presets = {
      plain: { stroke: 0, shadow: 0, depth: 0, curve: 0, reflection: false, emboss: false, gradient: false },
      poster: { stroke: 2, shadow: 0, depth: 10, curve: 0, reflection: false, emboss: false, gradient: false },
      neon: { stroke: 1, shadow: 6, depth: 0, curve: 0, reflection: true, emboss: false, gradient: true }
    };
    var p = presets[name];
    if (!p) return;
    Object.keys(p).forEach(function (k) { S.text[k] = p[k]; });
    syncTextControls();
    toast('Style: ' + name);
  }

  function syncTextControls() {
    byId('text-stroke').value = S.text.stroke;
    byId('text-stroke-val').textContent = S.text.stroke;
    byId('text-shadow').value = S.text.shadow;
    byId('text-shadow-val').textContent = S.text.shadow;
    byId('text-depth').value = S.text.depth;
    byId('text-depth-val').textContent = S.text.depth;
    byId('text-curve').value = S.text.curve;
    byId('text-curve-val').textContent = S.text.curve;
    byId('text-fill').classList.toggle('on', S.text.gradient);
    byId('grad-row').hidden = !S.text.gradient;
    byId('text-reflection').classList.toggle('on', S.text.reflection);
    byId('text-emboss').classList.toggle('on', S.text.emboss);
  }

  /* ---------------------------------------------------------------- stickers */

  function renderStickerGrid() {
    var box = byId('sticker-grid');
    box.innerHTML = '';
    STICKERS.forEach(function (glyph) {
      var b = document.createElement('button');
      b.textContent = glyph;
      b.title = 'Add ' + glyph;
      b.className = 'sticker' + (S.sticker === glyph ? ' sel' : '');
      b.onclick = function () {
        S.sticker = glyph;
        $$('#sticker-grid .sticker').forEach(function (x) { x.classList.toggle('sel', x === b); });
        placeSticker();
      };
      box.appendChild(b);
    });
    markFontAvailability();
  }

  /* Dims any font the browser cannot actually render. */
  function markFontAvailability() {
    if (!document.fonts || !document.fonts.check) return;
    var missing = 0;
    $$('#font-list .font-item').forEach(function (el, i) {
      var f = FONTS[i];
      if (!f) return;
      var ok = true;
      try { ok = document.fonts.check('16px ' + f.css.split(',')[0].trim()); } catch (err) { ok = true; }
      el.classList.toggle('unavailable', !ok);
      if (!ok) missing++;
    });
    var note = byId('font-note');
    if (note) note.textContent = missing ? missing + ' fonts need internet' : '';
  }

  function placeSticker(atCentre) {
    var l = guardLayer();
    if (!l) return;
    var size = +byId('sticker-size').value || 24;
    var anchor = (atCentre || !S.textAnchor)
      ? { x: Math.max(0, Math.round((S.w - size) / 2)), y: Math.max(0, Math.round((S.h - size) / 2)) }
      : S.textAnchor;
    l.ctx.save();
    l.ctx.globalAlpha = S.opacity;
    l.ctx.font = size + 'px "Segoe UI Emoji", "Noto Color Emoji", "Apple Color Emoji", sans-serif';
    l.ctx.textBaseline = 'top';
    l.ctx.fillStyle = S.color;
    l.ctx.fillText(S.sticker, anchor.x, anchor.y);
    l.ctx.restore();
    pushHistory(); render(); renderLayers();
    toast('Sticker added');
  }

  /* --------------------------------------------------------- inline text box */

  function openTextOverlay(p) {
    var ov = byId('text-overlay');
    S.textAnchor = { x: p.x, y: p.y };
    var z = effZoom();
    var rect = screen.getBoundingClientRect();
    var wrap = byId('stage-wrap').getBoundingClientRect();
    var left = rect.left - wrap.left + p.x * z;
    var top = rect.top - wrap.top + p.y * z;
    ov.style.left = Math.max(4, Math.min(wrap.width - 260, left)) + 'px';
    ov.style.top = Math.max(4, Math.min(wrap.height - 48, top)) + 'px';
    ov.hidden = false;
    var input = byId('text-overlay-input');
    input.value = byId('text-content').value || '';
    setTimeout(function () { input.focus(); input.select(); }, 30);
  }

  function closeTextOverlay(commit) {
    var ov = byId('text-overlay');
    if (ov.hidden) return;
    var input = byId('text-overlay-input');
    if (commit) {
      byId('text-content').value = input.value;
      if (input.value.trim()) addText();
    }
    ov.hidden = true;
  }

  /* ------------------------------------------------------------------- photo */

  function pixelize(dither) {
    var got = readLayer();
    if (!got) return;
    var block = Math.max(1, +byId('px-block').value);
    var nw = Math.max(1, Math.round(S.w / block));
    var nh = Math.max(1, Math.round(S.h / block));
    var small = C.resample(got.img, nw, nh);
    C.quantize(small, selectedDitherPalette());
    if (dither) C.ditherFloydSteinberg(small, selectedDitherPalette());
    var big = C.resample(small, S.w, S.h);
    got.img.data.set(big.data);
    commitLayer(got.layer, got.img);
    toast('Pixel art: ' + nw + '×' + nh + ' blocks');
  }

  function scaleImage(factor) {
    var nw = Math.max(1, Math.min(1024, Math.round(S.w * factor)));
    var nh = Math.max(1, Math.min(1024, Math.round(S.h * factor)));
    resizeDoc(nw, nh);
    toast('Scaled to ' + nw + '×' + nh);
  }

  function cropToSelection() {
    if (!S.sel) { toast('Select an area first (M tool)'); return; }
    var r = S.sel;
    S.layers.forEach(function (l) {
      var cv = offscreen(r.w, r.h);
      cv.getContext('2d').drawImage(l.canvas, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h);
      l.canvas = cv;
      l.ctx = cv.getContext('2d', { willReadFrequently: true });
    });
    S.w = r.w; S.h = r.h; S.sel = null;
    pushHistory(); fitZoom(); render(); renderLayers(); updateStatus();
    toast('Cropped to ' + S.w + '×' + S.h);
  }

  function autoRemoveBg() {
    var got = readLayer();
    if (!got) return;
    C.autoKey(got.img, +byId('bg-tolerance').value);
    commitLayer(got.layer, got.img);
    toast('Background removed');
  }

  function extractPalette() {
    var got = readLayer();
    if (!got) return;
    var cols = C.dominantColors(got.img, 12);
    if (!cols.length) { toast('Nothing to sample'); return; }
    S.palette = cols;
    renderPalette();
    toast('Palette from image: ' + cols.length + ' colours');
  }

  /* ---------------------------------------------------------------------- 3D */

  function add3DText() {
    var l = guardLayer();
    if (!l) return;
    if (!byId('text-content').value.trim()) {
      openTab('text');
      toast('Type your text in the Text tab first');
      return;
    }
    var depth = +byId('td-depth').value;
    S.text.depth = depth;
    S.text.depthColor = byId('td-side').value;
    if (byId('td-shade').classList.contains('on')) {
      S.text.depthColor = C.rgbToHex.apply(null, C.shade(C.parseColor(S.color), 0.55));
    }
    syncTextControls();
    var cv = buildTextCanvas();
    if (!cv) return;
    l.ctx.drawImage(cv, 0, 0);
    pushHistory(); render(); renderLayers();
    toast('3D text added');
  }

  function apply3DImage() {
    var got = readLayer();
    if (!got) return;
    var img = got.img;
    var depth = +byId('td-extrude').value;
    if (depth > 0) {
      var ang = (+byId('td-img-angle').value) * Math.PI / 180;
      C.extrude(img, Math.cos(ang), Math.sin(ang), depth, C.shade(C.parseColor(S.color), 0.55), null);
    }
    C.perspective(img, { rotateY: +byId('td-rotate-y').value, tiltX: +byId('td-tilt-x').value });
    commitLayer(got.layer, img);
    toast('3D applied');
  }

  function set3DMode(mode) {
    S.mode3d = mode;
    $$('#mode-3d .seg').forEach(function (b) { b.classList.toggle('active', b.dataset.mode === mode); });
    $$('.mode-block').forEach(function (b) { b.hidden = b.dataset.block !== mode; });
  }

  /* ------------------------------------------------------------------ file IO */

  function newDoc(w, h) {
    S.w = w; S.h = h;
    S.layers = [mkLayer('Layer 1')];
    S.active = 0;
    S.sel = null; S.floating = null; S.preview = null; S.fxBase = null;
    S.history = []; S.hpos = -1;
    fitZoom(); render(); renderLayers(); updateStatus();
    pushHistory();
  }

  function projectObject() {
    return {
      app: 'pixelstudioedit', version: 3,
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
    if (!obj || !obj.layers || !obj.layers.length) { toast('Not a Pixel Studio Edit project'); return; }
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
        if (--pending <= 0) {
          S.history = []; S.hpos = -1;
          fitZoom(); render(); renderLayers(); updateStatus(); pushHistory();
          toast('Project loaded');
        }
      };
      im.onerror = function () { if (--pending <= 0) { render(); renderLayers(); } };
      im.src = obj.layers[i].data;
    });
  }

  function queueAutosave() {
    if (!S.ready) return;
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(function () {
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(projectObject()));
        setSaveStatus('Autosaved');
      } catch (err) { /* storage full — nothing to do */ }
    }, 900);
  }

  function exportImage(scale, filename, format, quality) {
    var cv = document.createElement('canvas');
    cv.width = S.w * scale; cv.height = S.h * scale;
    var c = cv.getContext('2d');
    c.imageSmoothingEnabled = false;
    if (format !== 'image/png') {           // JPEG has no alpha: fill white first
      c.fillStyle = '#ffffff';
      c.fillRect(0, 0, cv.width, cv.height);
    }
    c.drawImage(composite(), 0, 0, cv.width, cv.height);
    cv.toBlob(function (blob) {
      saveBlob(blob, filename || 'pixelstudioedit.png');
      var kb = blob ? Math.round(blob.size / 1024) : 0;
      toast('Exported ' + cv.width + '×' + cv.height + ' · ' + kb + ' KB');
    }, format || 'image/png', quality);
  }

  function importImage(file) {
    var url = URL.createObjectURL(file);
    var im = new Image();
    im.onload = function () {
      var sc = Math.min(S.w / im.width, S.h / im.height);
      var dw = Math.max(1, Math.round(im.width * sc));
      var dh = Math.max(1, Math.round(im.height * sc));
      var l = mkLayer((file.name || 'Image').replace(/\.[^.]+$/, '').slice(0, 18) || 'Image');
      l.ctx.imageSmoothingEnabled = false;
      l.ctx.drawImage(im, 0, 0, im.width, im.height,
        Math.round((S.w - dw) / 2), Math.round((S.h - dh) / 2), dw, dh);
      S.layers.splice(S.active + 1, 0, l);
      S.active++;
      URL.revokeObjectURL(url);
      pushHistory(); render(); renderLayers(); updateStatus();
      if (S.importMode === 'photo') {
        S.importMode = null;
        var nw = Math.min(2048, im.width), nh = Math.min(2048, im.height);
        if (nw !== S.w || nh !== S.h) resizeDoc(nw, nh);
        openTab('photo');
        toast('Photo opened — ' + S.w + '×' + S.h);
      } else if (S.importMode === 'pixel') {
        S.importMode = null;
        openTab('photo');
        setTimeout(function () { pixelize(false); }, 60);
        toast('Pixel art ready — tune Block and palette in the Photo tab');
      } else {
        toast('Imported — try Photo → Make pixel art');
      }
    };
    im.onerror = function () { toast('Could not read that image'); URL.revokeObjectURL(url); };
    im.src = url;
  }

  /* -------------------------------------------------------------------- tabs */

  function openTab(name) {
    S.tab = name;
    $$('#tabs .tab').forEach(function (b) { b.classList.toggle('active', b.dataset.tab === name); });
    $$('.pane').forEach(function (p) { p.classList.toggle('active', p.dataset.pane === name); });
    byId('side').classList.add('open');
  }

  function toggleTab(name) {
    var side = byId('side');
    var isMobile = window.matchMedia('(max-width: 880px)').matches;
    if (isMobile && S.tab === name && side.classList.contains('open')) {
      side.classList.remove('open');
      return;
    }
    openTab(name);
  }

  /* ------------------------------------------------------------------ wiring */

  function bindUI() {
    screen = byId('screen');
    screenCtx = screen.getContext('2d');
    stage = byId('stage');
    stageWrap = byId('stage-wrap');

    /* Two-finger pinch to zoom and drag to pan; one finger always draws. */
    var pointers = {};
    var pinchStart = null;
    function pointerList() {
      return Object.keys(pointers).map(function (k) { return pointers[k]; });
    }
    function beginPinch() {
      var pts = pointerList();
      if (pts.length < 2) return;
      pinchStart = {
        dist: Math.max(1, Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)),
        zoom: effZoom(),
        cx: (pts[0].x + pts[1].x) / 2,
        cy: (pts[0].y + pts[1].y) / 2,
        sl: stageWrap.scrollLeft,
        st: stageWrap.scrollTop
      };
      S.drag = null;
      S.preview = null;
    }
    function updatePinch() {
      var pts = pointerList();
      if (!pinchStart || pts.length < 2) return;
      var dist = Math.max(1, Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y));
      setZoom(pinchStart.zoom * (dist / pinchStart.dist));
      var cx = (pts[0].x + pts[1].x) / 2;
      var cy = (pts[0].y + pts[1].y) / 2;
      stageWrap.scrollLeft = pinchStart.sl - (cx - pinchStart.cx);
      stageWrap.scrollTop = pinchStart.st - (cy - pinchStart.cy);
    }
    screen.addEventListener('pointerdown', function (e) {
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (Object.keys(pointers).length > 1) { beginPinch(); return; }
      onDown(e);
    });
    screen.addEventListener('pointermove', function (e) {
      if (!pointers[e.pointerId]) return;
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (pinchStart) { updatePinch(); return; }
    });
    function endPointer(e) {
      delete pointers[e.pointerId];
      if (Object.keys(pointers).length < 2) pinchStart = null;
    }
    screen.addEventListener('pointerup', endPointer);
    screen.addEventListener('pointercancel', endPointer);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    screen.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    $$('.tool[data-tool]').forEach(function (b) {
      b.onclick = function () {
        S.tool = b.dataset.tool;
        $$('.tool[data-tool]').forEach(function (x) { x.classList.toggle('active', x === b); });
        stage.style.cursor = S.tool === 'hand' ? 'grab' : (S.tool === 'text' ? 'text' : 'crosshair');
      };
    });

    on('btn-undo', 'click', undo);
    on('btn-redo', 'click', redo);
    on('btn-menu', 'click', function (e) {
      e.stopPropagation();
      var pop = byId('menu-pop');
      pop.hidden = !pop.hidden;
    });
    document.addEventListener('click', function (e) {
      var pop = byId('menu-pop');
      if (!pop.hidden && !pop.contains(e.target) && e.target.id !== 'btn-menu') pop.hidden = true;
    });
    on('btn-zen', 'click', function () {
      var app = byId('app');
      var zen = app.classList.toggle('zen');
      byId('btn-zen').classList.toggle('on', zen);
      if (zen && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(function () {});
      } else if (!zen && document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(function () {});
      }
      setTimeout(fitZoom, 120);
    });
    on('doc-chip', 'click', canvasDialog);

    on('m-new', 'click', function () { byId('menu-pop').hidden = true; newDocDialog(); });
    on('m-open', 'click', function () { byId('menu-pop').hidden = true; byId('file-open').click(); });
    on('m-save', 'click', function () {
      byId('menu-pop').hidden = true;
      saveBlob(new Blob([JSON.stringify(projectObject())], { type: 'application/json' }), 'pixelstudioedit-project.json');
      toast('Project saved');
    });
    on('m-import', 'click', function () { byId('menu-pop').hidden = true; byId('file-import').click(); });
    on('m-export', 'click', function () { byId('menu-pop').hidden = true; exportDialog(); });
    on('m-canvas', 'click', function () { byId('menu-pop').hidden = true; canvasDialog(); });
    on('m-restore', 'click', function () {
      byId('menu-pop').hidden = true;
      var raw = localStorage.getItem(AUTOSAVE_KEY);
      if (!raw) { toast('No autosave found'); return; }
      try { loadProject(JSON.parse(raw)); } catch (err) { toast('Autosave is unreadable'); }
    });
    on('m-help', 'click', function () {
      byId('menu-pop').hidden = true;
      modal('Keyboard shortcuts',
        '<div class="hint" style="line-height:1.9;font-size:12px">' +
        '<b>B</b> pencil · <b>E</b> eraser · <b>G</b> fill · <b>I</b> eyedropper<br>' +
        '<b>L</b> line · <b>R</b> rectangle · <b>O</b> ellipse<br>' +
        '<b>M</b> select · <b>T</b> text · <b>H</b> pan · <b>X</b> swap colours<br>' +
        '<b>[</b> <b>]</b> brush size · <b>+</b> <b>−</b> zoom · <b>0</b> fit<br>' +
        '<b>Ctrl+Z</b> undo · <b>Ctrl+Shift+Z</b> redo · <b>Ctrl+A</b> select all<br>' +
        '<b>Delete</b> clear selection · <b>Esc</b> deselect<br><br>' +
        'Right-click draws with the secondary colour.</div>', function () {}, 'Close');
    });

    $$('#tabs .tab').forEach(function (b) { b.onclick = function () { toggleTab(b.dataset.tab); }; });

    on('q-brush', 'input', function () {
      S.brush = +this.value;
      byId('q-brush-val').textContent = this.value;
    });
    on('q-opacity', 'input', function () {
      S.opacity = +this.value / 100;
      byId('q-opacity-val').textContent = this.value;
    });
    on('q-mirror-x', 'click', function () { S.symX = !S.symX; this.classList.toggle('on', S.symX); });
    on('q-mirror-y', 'click', function () { S.symY = !S.symY; this.classList.toggle('on', S.symY); });
    on('q-grid', 'click', function () { S.showGrid = !S.showGrid; this.classList.toggle('on', S.showGrid); render(); });
    on('q-checker', 'click', function () { S.showChecker = !S.showChecker; this.classList.toggle('on', S.showChecker); render(); });
    on('zoom-in', 'click', function () { setZoom(effZoom() + 1); });
    on('zoom-out', 'click', function () { setZoom(effZoom() - 1); });
    on('zoom-fit', 'click', fitZoom);
    stageWrap.addEventListener('wheel', function (e) {
      if (!e.ctrlKey && !e.metaKey && Math.abs(e.deltaY) < 4) return;
      e.preventDefault();
      setZoom(effZoom() + (e.deltaY < 0 ? 1 : -1));
    }, { passive: false });

    // colour
    on('hex-input', 'change', function () { setColor(this.value); });
    on('color-input', 'input', function () { setColor(this.value); });
    on('swap-colors', 'click', swapColours);
    on('rail-colours', 'click', swapColours);
    on('palette-select', 'change', function () { loadPalette(this.value); });
    on('add-swatch', 'click', function () {
      if (S.palette.indexOf(S.color) === -1) { S.palette.push(S.color); renderPalette(); toast('Added to palette'); }
    });
    on('reset-palette', 'click', function () { loadPalette(byId('palette-select').value); });
    on('bg-colour', 'click', function () { fillBackground('colour'); });
    on('bg-gradient', 'click', function () { fillBackground('gradient'); });

    // layers
    on('layer-add', 'click', addLayer);
    on('layer-dup', 'click', duplicateLayer);
    on('layer-del', 'click', deleteLayer);
    on('layer-up', 'click', function () { moveLayer(1); });
    on('layer-down', 'click', function () { moveLayer(-1); });
    on('layer-merge', 'click', mergeDown);
    on('layer-clear', 'click', clearLayer);
    on('layer-opacity', 'input', function () {
      var l = activeLayer();
      if (!l) return;
      l.opacity = +this.value / 100;
      byId('layer-opacity-val').textContent = this.value;
      render();
    });
    on('layer-opacity', 'change', function () { pushHistory(); renderLayers(); });

    // text styling
    on('text-bold', 'click', function () { S.text.bold = !S.text.bold; this.classList.toggle('on', S.text.bold); });
    on('text-italic', 'click', function () { S.text.italic = !S.text.italic; this.classList.toggle('on', S.text.italic); });
    on('text-fill', 'click', function () {
      S.text.gradient = !S.text.gradient;
      this.classList.toggle('on', S.text.gradient);
      byId('grad-row').hidden = !S.text.gradient;
    });
    on('text-reflection', 'click', function () { S.text.reflection = !S.text.reflection; this.classList.toggle('on', S.text.reflection); });
    on('text-emboss', 'click', function () { S.text.emboss = !S.text.emboss; this.classList.toggle('on', S.text.emboss); });
    on('text-add', 'click', addText);
    $$('[data-style]').forEach(function (b) { b.onclick = function () { applyStylePreset(b.dataset.style); }; });

    [['text-size', 'text-size-val'], ['text-stroke', 'text-stroke-val'], ['text-shadow', 'text-shadow-val'],
     ['text-curve', 'text-curve-val'], ['text-depth', 'text-depth-val'], ['sticker-size', 'sticker-size-val'],
     ['fx-levels', 'fx-levels-val'], ['fx-blur', 'fx-blur-val'], ['fx-noise', 'fx-noise-val'],
     ['outline-width', 'outline-width-val'], ['shadow-dx', 'shadow-dx-val'], ['shadow-dy', 'shadow-dy-val'],
     ['bg-tolerance', 'bg-tolerance-val'], ['td-depth', 'td-depth-val'], ['td-angle', 'td-angle-val'],
     ['td-rotate-y', 'td-rotate-y-val'], ['td-tilt-x', 'td-tilt-x-val'], ['td-extrude', 'td-extrude-val'],
     ['td-img-angle', 'td-img-angle-val']].forEach(function (pair) {
      var el = byId(pair[0]);
      if (!el) return;
      el.addEventListener('input', function () { byId(pair[1]).textContent = el.value; });
    });
    on('text-stroke', 'input', function () { S.text.stroke = +this.value; });
    on('text-shadow', 'input', function () { S.text.shadow = +this.value; });
    on('text-curve', 'input', function () { S.text.curve = +this.value; });
    on('text-depth', 'input', function () { S.text.depth = +this.value; });
    on('text-stroke-color', 'input', function () { S.text.strokeColor = this.value; });
    on('text-shadow-color', 'input', function () { S.text.shadowColor = this.value; });
    on('text-depth-color', 'input', function () { S.text.depthColor = this.value; });

    // adjust sliders
    ['fx-brightness', 'fx-contrast', 'fx-saturation', 'fx-hue'].forEach(function (id) {
      var el = byId(id);
      if (!el) return;
      el.addEventListener('input', function () {
        byId(id + '-val').textContent = el.value;
        applyAdjust(true);
      });
      el.addEventListener('change', function () { applyAdjust(false); S.fxBase = null; });
    });
    on('fx-apply', 'click', function () {
      if (S.fxBase) { pushHistory(); S.fxBase = null; toast('Adjustments applied'); }
      else toast('Move a slider first');
    });
    on('fx-reset', 'click', function () { resetAdjust(); });

    $$('[data-fx]').forEach(function (b) { b.onclick = function () { runEffect(b.dataset.fx); }; });
    on('do-quantize', 'click', function () { applyPaletteToLayer('quantize'); });
    on('do-dither-fs', 'click', function () { applyPaletteToLayer('fs'); });
    on('do-dither-bayer', 'click', function () { applyPaletteToLayer('bayer'); });
    on('bg-remove-colour', 'click', function () { removeBackground(false); });
    on('bg-remove-white', 'click', function () { removeBackground(true); });

    // start screen
    function hideStart() {
      var st = byId('start');
      if (st) st.hidden = true;
    }
    on('start-design', 'click', function () { hideStart(); newDocDialog(); });
    on('start-photo', 'click', function () { hideStart(); S.importMode = 'photo'; byId('file-import').click(); });
    on('start-pixel', 'click', function () { hideStart(); S.importMode = 'pixel'; byId('file-import').click(); });
    on('start-open', 'click', function () { hideStart(); byId('file-open').click(); });
    on('start-skip', 'click', function () {
      hideStart();
      var raw = localStorage.getItem(AUTOSAVE_KEY);
      if (!raw) { toast('No previous project yet — start with Create a design'); return; }
      try { loadProject(JSON.parse(raw)); } catch (err) { toast('Autosave is unreadable'); }
    });

    // inline text editor
    on('text-overlay-ok', 'click', function () { closeTextOverlay(true); });
    on('text-overlay-cancel', 'click', function () { closeTextOverlay(false); });
    on('text-overlay-input', 'input', function () {
      byId('text-content').value = this.value;
    });
    on('text-overlay-input', 'keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); closeTextOverlay(true); }
      if (e.key === 'Escape') { e.preventDefault(); closeTextOverlay(false); }
    });

    // fonts: own font upload + availability check
    on('font-upload-btn', 'click', function () { byId('font-upload').click(); });
    on('font-upload', 'change', function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var name = (file.name || 'Custom').replace(/\.[^.]+$/, '').replace(/[^\w ]+/g, '');
      var reader = new FileReader();
      reader.onload = function () {
        var face = new FontFace('PS-' + name, reader.result);
        face.load().then(function (loaded) {
          document.fonts.add(loaded);
          FONTS.unshift({ name: name, css: "'PS-" + name + "', sans-serif", own: true });
          S.text.font = "'PS-" + name + "', sans-serif";
          renderFontList();
          toast('Font added: ' + name);
        }).catch(function () { toast('That font file could not be read'); });
      };
      reader.readAsArrayBuffer(file);
      e.target.value = '';
    });

    // photo
    on('px-make', 'click', function () { pixelize(false); });
    on('px-dither', 'click', function () { pixelize(true); });
    $$('[data-scale]').forEach(function (b) {
      b.onclick = function () { scaleImage(parseFloat(b.dataset.scale)); };
    });
    on('photo-crop', 'click', cropToSelection);
    on('bg-auto', 'click', autoRemoveBg);
    on('bg-white2', 'click', function () { removeBackground(true); });
    on('photo-palette', 'click', extractPalette);

    // stickers
    on('sticker-place', 'click', function () { placeSticker(true); });
    on('sticker-clear', 'click', function () { S.textAnchor = null; toast('Anchor cleared — stickers go to the centre'); });

    // 3D
    $$('#mode-3d .seg').forEach(function (b) { b.onclick = function () { set3DMode(b.dataset.mode); }; });
    on('td-shade', 'click', function () { this.classList.toggle('on'); });
    on('td-add', 'click', add3DText);
    on('td-apply', 'click', apply3DImage);
    on('td-reset', 'click', function () {
      [['td-rotate-y', 0], ['td-tilt-x', 0], ['td-extrude', 0], ['td-img-angle', 225]].forEach(function (p) {
        byId(p[0]).value = p[1];
        byId(p[0] + '-val').textContent = p[1];
      });
    });
    $$('[data-3d]').forEach(function (b) {
      b.onclick = function () {
        var preset = b.dataset['3d'];
        var depth = preset === 'deep' ? 14 : (preset === 'iso' ? 10 : 6);
        var angle = preset === 'deep' ? 235 : (preset === 'iso' ? 205 : 225);
        byId('td-depth').value = depth;
        byId('td-depth-val').textContent = depth;
        byId('td-angle').value = angle;
        byId('td-angle-val').textContent = angle;
        toast('Preset: ' + preset);
      };
    });

    on('file-import', 'change', function (e) {
      var f = e.target.files[0];
      if (f) importImage(f);
      e.target.value = '';
    });
    on('file-open', 'change', function (e) {
      var f = e.target.files[0];
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        try { loadProject(JSON.parse(fr.result)); } catch (err) { toast('That file is not a project'); }
      };
      fr.readAsText(f);
      e.target.value = '';
    });

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', function (e) { if (e.code === 'Space') S.spaceDown = false; });
    window.addEventListener('resize', function () { render(); });
  }

  function swapColours() {
    var t = S.color;
    S.color = S.color2;
    S.color2 = t;
    setColor(S.color);
    setColor(S.color2, true);
  }

  var TEMPLATES = [
    { label: 'Square 64', w: 64, h: 64 },
    { label: 'Sprite 32', w: 32, h: 32 },
    { label: 'Square 512', w: 512, h: 512 },
    { label: 'Instagram 1080', w: 1080, h: 1080 },
    { label: 'Story 1080×1920', w: 1080, h: 1920 },
    { label: 'YouTube 1280×720', w: 1280, h: 720 },
    { label: 'Banner 1500×500', w: 1500, h: 500 },
    { label: 'Meme 800×600', w: 800, h: 600 },
    { label: 'Poster 1080×1350', w: 1080, h: 1350 }
  ];

  function newDocDialog() {
    modal('New document',
      '<div class="row"><label>Width</label><input type="number" id="dlg-w" min="1" max="2048" value="' + S.w + '"></div>' +
      '<div class="row"><label>Height</label><input type="number" id="dlg-h" min="1" max="2048" value="' + S.h + '"></div>' +
      '<div class="presets-row" id="dlg-presets">' +
      TEMPLATES.map(function (t, i) { return '<button class="btn" data-t="' + i + '">' + t.label + '</button>'; }).join('') +
      '</div><p class="hint">Pick a template for banners and social posts, or type your own size.</p>',
      function (ov) {
        var w = Math.max(1, Math.min(2048, +$('#dlg-w', ov).value || 64));
        var h = Math.max(1, Math.min(2048, +$('#dlg-h', ov).value || 64));
        newDoc(w, h);
        toast('New ' + w + '×' + h + ' document');
      }, 'Create');
    $$('#dlg-presets button').forEach(function (b) {
      b.onclick = function () {
        var t = TEMPLATES[+b.dataset.t];
        if (!t) return;
        $('#dlg-w').value = t.w;
        $('#dlg-h').value = t.h;
      };
    });
  }

  function canvasDialog() {
    modal('Canvas',
      '<div class="row"><label>Width</label><input type="number" id="dlg-w" min="1" max="1024" value="' + S.w + '"></div>' +
      '<div class="row"><label>Height</label><input type="number" id="dlg-h" min="1" max="1024" value="' + S.h + '"></div>' +
      '<div class="presets-row" id="dlg-presets">' +
      [16, 32, 48, 64, 128, 256, 512].map(function (v) { return '<button class="btn" data-p="' + v + '">' + v + '²</button>'; }).join('') +
      '</div>' +
      '<div class="grid2"><button class="btn" id="dlg-fliph">Flip H</button><button class="btn" id="dlg-flipv">Flip V</button>' +
      '<button class="btn" id="dlg-rot-cw">Rotate ⟳</button><button class="btn" id="dlg-rot-ccw">Rotate ⟲</button></div>' +
      '<p class="hint">Resize scales every layer with nearest-neighbour sampling.</p>',
      function (ov) {
        var w = Math.max(1, Math.min(2048, +$('#dlg-w', ov).value || S.w));
        var h = Math.max(1, Math.min(2048, +$('#dlg-h', ov).value || S.h));
        resizeDoc(w, h);
        toast('Canvas ' + S.w + '×' + S.h);
      }, 'Resize');
    $$('#dlg-presets button').forEach(function (b) {
      b.onclick = function () { $('#dlg-w').value = b.dataset.p; $('#dlg-h').value = b.dataset.p; };
    });
    $('#dlg-fliph').onclick = function () { transformDoc('flip-h'); };
    $('#dlg-flipv').onclick = function () { transformDoc('flip-v'); };
    $('#dlg-rot-cw').onclick = function () { transformDoc('rot-cw'); };
    $('#dlg-rot-ccw').onclick = function () { transformDoc('rot-ccw'); };
  }

  function exportDialog() {
    modal('Export image',
      '<div class="row"><label>Format</label><select id="dlg-format">' +
      '<option value="image/png">PNG — keeps transparency</option>' +
      '<option value="image/jpeg">JPEG — smaller, no transparency</option>' +
      '<option value="image/webp">WebP — smallest</option>' +
      '</select></div>' +
      '<div class="row"><label>Scale</label><select id="dlg-scale">' +
      [1, 2, 4, 8, 10, 16, 20].map(function (s) {
        return '<option value="' + s + '"' + (s === 1 ? ' selected' : '') + '>' + s + '× (' + (S.w * s) + '×' + (S.h * s) + ')</option>';
      }).join('') + '</select></div>' +
      '<div class="row"><label>Quality</label><input type="range" id="dlg-quality" min="40" max="100" value="92"><b id="dlg-quality-val">92</b></div>' +
      '<div class="row"><label>Name</label><input type="text" id="dlg-name" value="pixelstudioedit"></div>' +
      '<p class="hint">Nearest-neighbour scaling keeps pixels sharp. Quality applies to JPEG and WebP.</p>',
      function (ov) {
        var scale = +$('#dlg-scale', ov).value || 1;
        var format = $('#dlg-format', ov).value;
        var quality = (+$('#dlg-quality', ov).value || 92) / 100;
        var ext = format === 'image/jpeg' ? '.jpg' : (format === 'image/webp' ? '.webp' : '.png');
        var name = ($('#dlg-name', ov).value || 'pixelstudioedit').replace(/[^\w\-]+/g, '-');
        exportImage(scale, name + ext, format, quality);
      }, 'Download');
    var q = byId('dlg-quality');
    if (q) q.addEventListener('input', function () { byId('dlg-quality-val').textContent = q.value; });
  }

  /* ---------------------------------------------------------------- keyboard */

  var TOOL_KEYS = {
    b: 'pencil', p: 'pencil', e: 'eraser', g: 'bucket', l: 'line',
    r: 'rect', o: 'ellipse', i: 'picker', m: 'select', t: 'text', h: 'hand', c: 'crop'
  };

  function onKeyDown(e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    var k = e.key.toLowerCase();

    if (e.ctrlKey || e.metaKey) {
      if (k === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
      if (k === 'y') { e.preventDefault(); redo(); return; }
      if (k === 's') {
        e.preventDefault();
        saveBlob(new Blob([JSON.stringify(projectObject())], { type: 'application/json' }), 'pixelstudioedit-project.json');
        return;
      }
      if (k === 'a') { e.preventDefault(); S.sel = { x: 0, y: 0, w: S.w, h: S.h }; render(); return; }
      return;
    }

    if (e.code === 'Space') { S.spaceDown = true; e.preventDefault(); return; }
    if (TOOL_KEYS[k]) {
      S.tool = TOOL_KEYS[k];
      $$('.tool[data-tool]').forEach(function (x) { x.classList.toggle('active', x.dataset.tool === S.tool); });
      return;
    }
    if (k === 'x') { swapColours(); return; }
    if (k === '[') { S.brush = Math.max(1, S.brush - 1); byId('q-brush').value = S.brush; byId('q-brush-val').textContent = S.brush; return; }
    if (k === ']') { S.brush = Math.min(24, S.brush + 1); byId('q-brush').value = S.brush; byId('q-brush-val').textContent = S.brush; return; }
    if (k === '+' || k === '=') { setZoom(effZoom() + 1); return; }
    if (k === '-') { setZoom(effZoom() - 1); return; }
    if (k === '0') { fitZoom(); return; }
    if (k === 'escape') { S.sel = null; S.floating = null; render(); return; }
    if (k === 'delete' || k === 'backspace') { e.preventDefault(); clearSelection(); return; }
  }

  /* -------------------------------------------------------------------- boot */

  function boot() {
    fillPaletteSelects();
    loadPalette('db16');
    bindUI();
    setColor('#1b1b1f');
    setColor('#ffffff', true);
    set3DMode('text');
    renderStickerGrid();
    renderFontList();
    syncTextControls();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(markFontAvailability);
    }
    setTimeout(markFontAvailability, 2500);
    newDoc(64, 64);
    S.ready = true;
    if (window.matchMedia('(min-width: 881px)').matches) openTab('text');
  }

  /* Small read-only hook so the automated UI tests can inspect pixels. */
  window.PS = {
    get state() { return S; },
    composite: composite,
    activeLayer: activeLayer,
    render: render,
    buildTextCanvas: buildTextCanvas
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
