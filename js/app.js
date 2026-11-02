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
    objects: [], selectedObj: null, objSeq: 1,
    groups: [], groupSeq: 1,
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
  var bgCanvas, bgCtx, overlayCanvas, overlayCtx;
  var maskTmp = document.createElement('canvas');
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
      groupId: null, mask: null,
      canvas: cv, ctx: cv.getContext('2d', { willReadFrequently: true })
    };
  }

  /* ------------------------------------------------------------ groups/masks */

  function groupById(id) {
    for (var i = 0; i < S.groups.length; i++) if (S.groups[i].id === id) return S.groups[i];
    return null;
  }

  function layerVisible(l) {
    if (!l.visible) return false;
    if (l.groupId) {
      var g = groupById(l.groupId);
      if (g && !g.visible) return false;
    }
    return true;
  }

  function addGroup() {
    var g = { id: 'g' + (S.groupSeq++), name: 'Group ' + S.groups.length + 1, visible: true, collapsed: false };
    S.groups.push(g);
    var l = activeLayer();
    if (l) l.groupId = g.id;
    pushHistory(); renderLayers(); render();
    toast('Group created — the active layer is inside it');
  }

  function ungroupActive() {
    var l = activeLayer();
    if (!l || !l.groupId) { toast('Active layer is not in a group'); return; }
    var id = l.groupId;
    S.layers.forEach(function (x) { if (x.groupId === id) x.groupId = null; });
    S.groups = S.groups.filter(function (g) { return g.id !== id; });
    pushHistory(); renderLayers(); render();
  }

  function toggleCollapseActive() {
    var l = activeLayer();
    if (!l || !l.groupId) { toast('Active layer is not in a group'); return; }
    var g = groupById(l.groupId);
    if (!g) return;
    g.collapsed = !g.collapsed;
    renderLayers();
  }

  function makeMaskFromSelection() {
    var l = guardLayer();
    if (!l) return;
    var mask = document.createElement('canvas');
    mask.width = S.w; mask.height = S.h;
    var mc = mask.getContext('2d');
    if (S.sel) {
      mc.fillStyle = '#ffffff';
      mc.fillRect(S.sel.x, S.sel.y, S.sel.w, S.sel.h);
    } else {
      mc.fillStyle = '#ffffff';
      mc.fillRect(0, 0, S.w, S.h);
      toast('No selection — the mask starts fully visible');
    }
    l.mask = { canvas: mask, enabled: true };
    pushHistory(); render(); renderLayers();
    toast('Mask created');
  }

  function toggleMask() {
    var l = activeLayer();
    if (!l || !l.mask) { toast('This layer has no mask'); return; }
    l.mask.enabled = !l.mask.enabled;
    pushHistory(); render(); renderLayers();
    toast(l.mask.enabled ? 'Mask on' : 'Mask off');
  }

  function removeMask() {
    var l = activeLayer();
    if (!l || !l.mask) { toast('This layer has no mask'); return; }
    l.mask = null;
    pushHistory(); render(); renderLayers();
    toast('Mask removed');
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

  /* Compares two pixel buffers quickly so unchanged layers can be shared. */
  function sameData(a, b) {
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i += 4) {
      if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2] || a[i + 3] !== b[i + 3]) return false;
    }
    return true;
  }

  /* Snapshot with copy-on-write: a layer whose pixels did not change keeps the
     previous buffer by reference, so history only stores what actually changed. */
  function snapshot(previous) {
    var prevLayers = previous && previous.layers ? previous.layers : [];
    var prevByName = {};
    prevLayers.forEach(function (pl) { prevByName[pl.name + ':' + pl.visible] = pl; });

    return {
      w: S.w, h: S.h, active: S.active,
      objects: JSON.parse(JSON.stringify(S.objects.map(function (o) {
        var c = {}; Object.keys(o).forEach(function (k) { if (k.charAt(0) !== '_') c[k] = o[k]; });
        return c;
      }))),
      selectedObj: S.selectedObj,
      groups: JSON.parse(JSON.stringify(S.groups)),
      layers: S.layers.map(function (l) {
        var data = l.ctx.getImageData(0, 0, S.w, S.h);
        var reuse = null;
        prevLayers.forEach(function (pl) {
          if (reuse) return;
          if (pl.name === l.name && pl.data && sameData(pl.data.data, data.data)) reuse = pl.data;
        });
        return {
          name: l.name, visible: l.visible, opacity: l.opacity, locked: l.locked,
          groupId: l.groupId,
          mask: l.mask ? {
            enabled: l.mask.enabled,
            data: l.mask.canvas.getContext('2d').getImageData(0, 0, S.w, S.h)
          } : null,
          data: reuse || data
        };
      })
    };
  }

  function restore(snap) {
    S.w = snap.w; S.h = snap.h;
    S.layers = snap.layers.map(function (o) {
      var l = mkLayer(o.name);
      l.visible = o.visible; l.opacity = o.opacity; l.locked = o.locked;
      /* copy so later painting never mutates a buffer the history still holds */
      l.ctx.putImageData(new ImageData(new Uint8ClampedArray(o.data.data), o.data.width, o.data.height), 0, 0);
      return l;
    });
    S.active = Math.min(snap.active, S.layers.length - 1);
    S.groups = snap.groups ? JSON.parse(JSON.stringify(snap.groups)) : [];
    (snap.layers || []).forEach(function (o, i) {
      var l = S.layers[i];
      if (!l) return;
      l.groupId = o.groupId || null;
      if (o.mask) {
        var mc = document.createElement('canvas');
        mc.width = S.w; mc.height = S.h;
        mc.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(o.mask.data.data), S.w, S.h), 0, 0);
        l.mask = { canvas: mc, enabled: o.mask.enabled };
      }
    });
    S.objects = (snap.objects || []).map(function (o) { return Object.assign({}, o); });
    S.selectedObj = snap.selectedObj || null;
    S.sel = null; S.floating = null; S.preview = null;
    render(); renderObjects(); renderLayers(); updateStatus();
  }

  function setSaveStatus(text) {
    var el = byId('save-status');
    if (el) { el.textContent = text; el.classList.toggle('dirty', text !== 'Saved'); }
  }

  function pushHistory() {
    setSaveStatus('Unsaved');
    S.history = S.history.slice(0, S.hpos + 1);
    S.history.push(snapshot(S.history[S.history.length - 1]));
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
    var max = Math.sqrt(MAX_BACKING / Math.max(1, S.w * S.h));
    /* fractional scales are allowed so a large artboard can always fit the screen */
    return Math.max(0.05, Math.min(S.zoom, Math.max(0.05, max)));
  }

  function composite() {
    if (compCv.width !== S.w || compCv.height !== S.h) { compCv.width = S.w; compCv.height = S.h; }
    compCtx.clearRect(0, 0, S.w, S.h);
    for (var i = 0; i < S.layers.length; i++) {
      var l = S.layers[i];
      if (!layerVisible(l) || l.opacity <= 0) continue;
      compCtx.globalAlpha = l.opacity;
      if (l.mask && l.mask.enabled) {
        if (maskTmp.width !== S.w || maskTmp.height !== S.h) { maskTmp.width = S.w; maskTmp.height = S.h; }
        var mt = maskTmp.getContext('2d');
        mt.clearRect(0, 0, S.w, S.h);
        mt.globalCompositeOperation = 'source-over';
        mt.drawImage(l.canvas, 0, 0);
        mt.globalCompositeOperation = 'destination-in';
        mt.drawImage(l.mask.canvas, 0, 0);
        mt.globalCompositeOperation = 'source-over';
        compCtx.drawImage(maskTmp, 0, 0);
      } else {
        compCtx.drawImage(l.canvas, 0, 0);
      }
    }
    compCtx.globalAlpha = 1;
    for (var j = 0; j < S.objects.length; j++) {
      var o = S.objects[j];
      if (!o.visible) continue;
      var cv = objectCanvas(o);
      if (cv) compCtx.drawImage(cv, 0, 0);
    }
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
    var W = Math.max(1, Math.round(S.w * z)), H = Math.max(1, Math.round(S.h * z));
    /* Device pixel ratio: the backing store is denser than the CSS box, so text and
       edges stay sharp on retina screens without changing document coordinates. */
    var dpr = Math.min(3, Math.max(1, window.devicePixelRatio || 1));
    var bw = Math.round(W * dpr), bh = Math.round(H * dpr);

    [screen, bgCanvas, overlayCanvas].forEach(function (cv) {
      if (cv.width !== bw || cv.height !== bh) { cv.width = bw; cv.height = bh; }
      cv.style.width = W + 'px';
      cv.style.height = H + 'px';
    });
    stage.style.width = W + 'px';
    stage.style.height = H + 'px';

    /* --- layer 1: background, checkerboard and grid (only on viewport change) */
    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bgCtx.imageSmoothingEnabled = false;
    bgCtx.clearRect(0, 0, W, H);
    if (S.showChecker) drawChecker(bgCtx, W, H);
    if (S.showGrid && z >= 6 && z <= 20) {
      bgCtx.save();
      bgCtx.strokeStyle = 'rgba(255,255,255,0.055)';
      bgCtx.lineWidth = 1;
      bgCtx.beginPath();
      for (var gx = 1; gx < S.w; gx++) { bgCtx.moveTo(gx * z + 0.5, 0); bgCtx.lineTo(gx * z + 0.5, H); }
      for (var gy = 1; gy < S.h; gy++) { bgCtx.moveTo(0, gy * z + 0.5); bgCtx.lineTo(W, gy * z + 0.5); }
      bgCtx.stroke();
      bgCtx.restore();
    }

    /* --- layer 2: document content ------------------------------------------ */
    screenCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    screenCtx.clearRect(0, 0, W, H);
    screenCtx.imageSmoothingEnabled = false;
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

    overlayCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    overlayCtx.clearRect(0, 0, W, H);

    var selObj = selectedObject();
    if (selObj && selObj.visible) {
      var b = objectBounds(selObj);
      overlayCtx.save();
      overlayCtx.strokeStyle = '#60a5fa';
      overlayCtx.lineWidth = 1.5;
      overlayCtx.setLineDash([5, 3]);
      overlayCtx.strokeRect(b.x * z - 1, b.y * z - 1, b.w * z + 2, b.h * z + 2);
      overlayCtx.restore();

      var hs = handlesFor(selObj);
      var hs2 = 8;
      overlayCtx.save();
      overlayCtx.fillStyle = '#0e1116';
      overlayCtx.strokeStyle = '#60a5fa';
      overlayCtx.lineWidth = 1.5;
      ['nw', 'ne', 'sw', 'se'].forEach(function (k) {
        overlayCtx.beginPath();
        overlayCtx.rect(hs[k].x * z - hs2 / 2, hs[k].y * z - hs2 / 2, hs2, hs2);
        overlayCtx.fill();
        overlayCtx.stroke();
      });
      overlayCtx.beginPath();
      overlayCtx.arc(hs.rot.x * z, hs.rot.y * z, hs2 / 2 + 1, 0, Math.PI * 2);
      overlayCtx.fillStyle = '#60a5fa';
      overlayCtx.fill();
      overlayCtx.restore();
    }

    var selRect = S.sel;
    if (S.drag && (S.drag.type === 'sel' || S.drag.type === 'crop') && S.drag.cur) {
      selRect = normalizeRect(S.drag.start, S.drag.cur);
    }
    if (selRect && selRect.w > 0 && selRect.h > 0) {
      overlayCtx.save();
      overlayCtx.strokeStyle = '#6ee7b7';
      overlayCtx.lineWidth = 1;
      overlayCtx.setLineDash([4, 3]);
      overlayCtx.strokeRect(selRect.x * z + 0.5, selRect.y * z + 0.5, selRect.w * z - 1, selRect.h * z - 1);
      overlayCtx.restore();
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
    var pad = 24;
    var vw = Math.max(80, stageWrap.clientWidth - pad);
    var vh = Math.max(80, stageWrap.clientHeight - pad);
    var z = Math.min(vw / S.w, vh / S.h);
    /* keep pixels crisp when we can, but never overflow the viewport */
    if (z >= 1) z = Math.floor(z);
    S.zoom = Math.max(0.05, Math.min(16, z));
    render();
  }

  function setZoom(z) {
    S.zoom = Math.max(0.05, Math.min(64, z));
    if (S.zoom >= 1) S.zoom = Math.round(S.zoom);
    render();
  }

  /* -------------------------------------------------------------- objects UI */

  function renderObjects() {
    var box = byId('objects');
    if (!box) return;
    box.innerHTML = '';
    if (!S.objects.length) {
      var empty = document.createElement('div');
      empty.className = 'obj-empty';
      empty.textContent = 'No objects yet — add text or a shape.';
      box.appendChild(empty);
      return;
    }
    S.objects.slice().reverse().forEach(function (o) {
      var row = document.createElement('div');
      row.className = 'object-row' + (o.id === S.selectedObj ? ' active' : '');
      var label = o.type === 'text'
        ? (o.text || '').split('\n')[0].slice(0, 18) || 'Text'
        : (o.shape || 'shape');
      var name = document.createElement('span');
      name.className = 'obj-name';
      name.textContent = (o.type === 'text' ? 'T · ' : '▢ · ') + label;

      var eye = document.createElement('button');
      eye.className = 'eye' + (o.visible ? ' on' : '');
      eye.textContent = o.visible ? '●' : '○';
      eye.onclick = function (e) { e.stopPropagation(); o.visible = !o.visible; render(); renderObjects(); };

      var flat = document.createElement('button');
      flat.className = 'obj-btn';
      flat.textContent = '⤓';
      flat.title = 'Flatten into layer';
      flat.onclick = function (e) { e.stopPropagation(); flattenObject(o.id); };

      row.appendChild(eye);
      row.appendChild(name);
      row.appendChild(flat);
      row.onclick = function () {
        S.selectedObj = o.id;
        if (o.type === 'text') loadTextObjectIntoPanel(o);
        render(); renderObjects();
      };
      box.appendChild(row);
    });
  }

  /* Loads a text object's properties into the Text tab so it can be edited. */
  function loadTextObjectIntoPanel(o) {
    byId('text-content').value = o.text || '';
    byId('text-size').value = o.size || 12;
    byId('text-size-val').textContent = o.size || 12;
    byId('text-grad2').value = o.grad2 || '#38bdf8';
    S.text.font = o.font || S.text.font;
    S.text.bold = !!o.bold;
    S.text.italic = !!o.italic;
    S.text.gradient = !!o.gradient;
    S.text.stroke = o.stroke || 0;
    S.text.strokeColor = o.strokeColor || '#000000';
    S.text.shadow = o.shadow || 0;
    S.text.shadowColor = o.shadowColor || '#000000';
    S.text.curve = o.curve || 0;
    S.text.depth = o.depth || 0;
    S.text.depthColor = o.depthColor || '#2b2b3a';
    S.text.reflection = !!o.reflection;
    S.text.emboss = !!o.emboss;
    setColor(o.color || S.color);
    syncTextControls();
    renderFontList();
    openTab('text');
  }

  /* --------------------------------------------------------------- layers UI */

  function renderLayers() {
    var box = byId('layers');
    box.innerHTML = '';
    for (var i = S.layers.length - 1; i >= 0; i--) {
      (function (i) {
        var l = S.layers[i];
        var grp = l.groupId ? groupById(l.groupId) : null;
        if (grp) {
          var isFirstOfGroup = true;
          for (var k = i + 1; k < S.layers.length; k++) {
            if (S.layers[k].groupId === grp.id) { isFirstOfGroup = false; break; }
          }
          if (isFirstOfGroup && !grp.collapsed) {
            var head = document.createElement('div');
            head.className = 'group-row';
            var gEye = document.createElement('button');
            gEye.className = 'eye' + (grp.visible ? ' on' : '');
            gEye.textContent = grp.visible ? '●' : '○';
            gEye.onclick = function (e) { e.stopPropagation(); grp.visible = !grp.visible; render(); renderLayers(); };
            var gName = document.createElement('span');
            gName.className = 'group-name';
            gName.textContent = '▸ ' + grp.name;
            gName.onclick = function (e) { e.stopPropagation(); grp.collapsed = true; renderLayers(); };
            head.appendChild(gEye);
            head.appendChild(gName);
            box.appendChild(head);
          }
          if (grp.collapsed) return;
        }

        var el = document.createElement('div');
        el.className = 'layer' + (i === S.active ? ' active' : '') + (grp ? ' in-group' : '');

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
        name.textContent = l.name + (l.mask ? (l.mask.enabled ? ' ⬚' : ' ⬚̸') : '');
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
      var selNow = selectedObject();
      if (selNow && selNow.visible) {
        var hh = handlesFor(selNow);
        var tolD = 12 / Math.max(0.2, effZoom());
        var grabbed = null;
        Object.keys(hh).forEach(function (k) {
          if (grabbed) return;
          if (Math.abs(p.x - hh[k].x) <= tolD && Math.abs(p.y - hh[k].y) <= tolD) grabbed = k;
        });
        if (grabbed) {
          var bb = objectBounds(selNow);
          S.drag = {
            type: grabbed === 'rot' ? 'rotate' : 'resize',
            handle: grabbed,
            obj: selNow,
            start: p,
            startBounds: { x: bb.x, y: bb.y, w: bb.w, h: bb.h },
            startSize: selNow.size || 12,
            startRotation: selNow.rotation || 0,
            changed: false
          };
          render();
          return;
        }
      }
      var hit = objectAt(p);
      if (hit) {
        S.selectedObj = hit.id;
        S.drag = { type: 'objmove', obj: hit, start: p, ox: hit.x || 0, oy: hit.y || 0, moved: false };
        renderObjects();
        render();
        return;
      }
      S.selectedObj = null;
      renderObjects();
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

  /* Topmost object whose bounds contain the point. */
  function objectAt(p) {
    for (var i = S.objects.length - 1; i >= 0; i--) {
      var o = S.objects[i];
      if (!o.visible) continue;
      var b = objectBounds(o);
      if (p.x >= b.x - 2 && p.x <= b.x + b.w + 2 && p.y >= b.y - 2 && p.y <= b.y + b.h + 2) return o;
    }
    return null;
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
    } else if (S.drag.type === 'resize') {
      var ob = S.drag.obj, sb = S.drag.startBounds, hdl = S.drag.handle;
      var dx = p.x - S.drag.start.x, dy = p.y - S.drag.start.y;
      var nx = sb.x, ny = sb.y, nw = sb.w, nh = sb.h;
      if (hdl === 'se') { nw = sb.w + dx; nh = sb.h + dy; }
      else if (hdl === 'sw') { nx = sb.x + dx; nw = sb.w - dx; nh = sb.h + dy; }
      else if (hdl === 'ne') { ny = sb.y + dy; nw = sb.w + dx; nh = sb.h - dy; }
      else if (hdl === 'nw') { nx = sb.x + dx; ny = sb.y + dy; nw = sb.w - dx; nh = sb.h - dy; }
      nw = Math.max(4, nw); nh = Math.max(4, nh);
      if (ob.type === 'shape') {
        ob.x = Math.round(nx); ob.y = Math.round(ny);
        ob.w = Math.round(nw); ob.h = Math.round(nh);
        ob._bounds = null;
      } else {
        var scale = Math.max(0.2, nw / Math.max(1, sb.w));
        ob.size = Math.max(6, Math.round(S.drag.startSize * scale));
        ob._cache = null;
      }
      S.drag.changed = true;
      render();
    } else if (S.drag.type === 'rotate') {
      var o2 = S.drag.obj, b2 = objectBounds(o2);
      var cx2 = b2.x + b2.w / 2, cy2 = b2.y + b2.h / 2;
      var ang = Math.atan2(p.y - cy2, p.x - cx2) * 180 / Math.PI + 90;
      o2.rotation = Math.round(ang);
      o2._cache = null;
      S.drag.changed = true;
      render();
    } else if (S.drag.type === 'objmove') {
      var o = S.drag.obj;
      o.x = S.drag.ox + (p.x - S.drag.start.x);
      o.y = S.drag.oy + (p.y - S.drag.start.y);
      o._cache = null;
      S.drag.moved = true;
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
    } else if (d.type === 'resize' || d.type === 'rotate') {
      if (d.changed) { pushHistory(); renderObjects(); }
    } else if (d.type === 'objmove') {
      if (d.moved) { pushHistory(); renderObjects(); }
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

  /* ------------------------------------------------- image worker (blueprint §5) */

  var effectWorker = null, effectSeq = 0, effectPending = {};

  function ensureEffectWorker() {
    if (effectWorker !== null) return effectWorker;
    try {
      effectWorker = new Worker('js/effects-worker.js');
      effectWorker.onmessage = function (e) {
        var d = e.data || {};
        var pending = effectPending[d.id];
        if (!pending) return;
        delete effectPending[d.id];
        if (d.error) { pending.reject(new Error(d.error)); return; }
        pending.resolve({ width: d.w, height: d.h, data: new Uint8ClampedArray(d.buffer) });
      };
      effectWorker.onerror = function () {
        Object.keys(effectPending).forEach(function (k) {
          effectPending[k].reject(new Error('worker failed'));
          delete effectPending[k];
        });
        effectWorker = false;
      };
    } catch (err) {
      effectWorker = false;
    }
    return effectWorker;
  }

  function workerEffect(op, img, params) {
    return new Promise(function (resolve, reject) {
      var w = ensureEffectWorker();
      if (!w) { reject(new Error('no worker')); return; }
      var id = ++effectSeq;
      effectPending[id] = { resolve: resolve, reject: reject };
      var buf = img.data.slice().buffer;
      w.postMessage({ id: id, op: op, buffer: buf, w: S.w, h: S.h, params: params || {} }, [buf]);
    });
  }

  function effectParams(name) {
    switch (name) {
      case 'posterize': return { levels: +byId('fx-levels').value };
      case 'threshold': return { level: 128 };
      case 'blur': return { radius: +byId('fx-blur').value };
      case 'noise': return { amount: +byId('fx-noise').value, seed: Date.now() % 99991 };
      case 'vignette': return { strength: 0.7 };
      case 'stripes': return { period: 4, alpha: 0.18 };
      case 'outline': return { color: byId('outline-color').value, width: +byId('outline-width').value };
      case 'shadow': return { dx: +byId('shadow-dx').value, dy: +byId('shadow-dy').value, color: byId('shadow-color').value, alpha: 1 };
      default: return {};
    }
  }

  /* Runs an effect in the worker when possible, on the main thread otherwise. */
  function runEffect(name) {
    var got = readLayer();
    if (!got) return;
    var params = effectParams(name);
    workerEffect(name, got.img, params).then(function (out) {
      got.layer.ctx.putImageData(new ImageData(new Uint8ClampedArray(out.data), S.w, S.h), 0, 0);
      pushHistory(); render(); renderLayers();
    }).catch(function () {
      applyEffectSync(name, got);
    });
  }

  function applyEffectSync(name, got) {
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
    var op = mode === 'quantize' ? 'quantize' : (mode === 'fs' ? 'ditherFS' : 'ditherBayer');
    workerEffect(op, got.img, { palette: pal, strength: 32 }).then(function (out) {
      got.layer.ctx.putImageData(new ImageData(new Uint8ClampedArray(out.data), S.w, S.h), 0, 0);
      pushHistory(); render(); renderLayers();
    }).catch(function () {
      if (mode === 'quantize') C.quantize(got.img, pal);
      else if (mode === 'fs') C.ditherFloydSteinberg(got.img, pal);
      else C.ditherBayer(got.img, pal, 32);
      commitLayer(got.layer, got.img);
    });
  }

  function fillBackground(mode) {
    var l = guardLayer();
    if (!l) return;
    var ctx = l.ctx;
    ctx.save();
    if (mode === 'radial') {
      var rg = ctx.createRadialGradient(S.w / 2, S.h / 2, 1, S.w / 2, S.h / 2, Math.max(S.w, S.h) / 1.4);
      rg.addColorStop(0, S.color);
      rg.addColorStop(1, S.color2);
      ctx.fillStyle = rg;
    } else if (mode === 'gradient') {
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
    toast(mode === 'gradient' ? 'Gradient background' : (mode === 'radial' ? 'Radial background' : 'Background filled'));
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
        if (updateSelectedText()) pushHistory();
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
  function drawTextLine(ctx, line, x, y, size, curve, strokeWidth) {
    if (!curve) {
      ctx.fillText(line, x, y);
      if (strokeWidth > 0) ctx.strokeText(line, x, y);
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
      if (strokeWidth > 0) ctx.strokeText(chars[i], x + acc, y + dy);
      acc += widths[i];
    }
  }

  /* ------------------------------------------------------- editable objects */

  function newObjectId() { return 'o' + (S.objSeq++); }

  function currentTextProps() {
    return {
      text: byId('text-content').value,
      font: S.text.font,
      size: +byId('text-size').value || 12,
      bold: S.text.bold,
      italic: S.text.italic,
      gradient: S.text.gradient,
      grad2: byId('text-grad2').value,
      stroke: S.text.stroke,
      strokeColor: S.text.strokeColor,
      shadow: S.text.shadow,
      shadowColor: S.text.shadowColor,
      curve: S.text.curve,
      depth: S.text.depth,
      depthColor: S.text.depthColor,
      angle: +byId('td-angle').value,
      reflection: S.text.reflection,
      emboss: S.text.emboss,
      color: S.color
    };
  }

  /* Renders a text object onto a document-sized canvas (cached by props). */
  function textObjectCanvas(o) {
    if (!o || !o.text || !o.text.trim()) return null;
    var key = JSON.stringify([o.text, o.font, o.size, o.bold, o.italic, o.gradient, o.grad2,
      o.stroke, o.strokeColor, o.shadow, o.shadowColor, o.curve, o.depth, o.depthColor,
      o.angle, o.reflection, o.emboss, o.color, o.x, o.y, S.w, S.h]);
    if (o._cache && o._cache.key === key) return o._cache.canvas;

    var size = Math.max(4, o.size);
    var fontStr = (o.bold ? 'bold ' : '') + (o.italic ? 'italic ' : '') + size + 'px ' + o.font;
    var lines = o.text.split('\n');
    var lineH = Math.round(size * 1.25);

    var mask = offscreen(S.w, S.h);
    var mc = mask.getContext('2d');
    mc.font = fontStr;
    mc.textBaseline = 'top';
    mc.fillStyle = '#ffffff';
    if (o.stroke > 0) { mc.strokeStyle = '#ffffff'; mc.lineWidth = o.stroke; mc.lineJoin = 'round'; }

    var maxW = 0;
    for (var i = 0; i < lines.length; i++) {
      maxW = Math.max(maxW, mc.measureText(lines[i]).width);
      drawTextLine(mc, lines[i], o.x, o.y + i * lineH, size, o.curve, o.stroke);
    }
    o._bounds = { x: o.x, y: o.y, w: Math.max(6, maxW + o.stroke * 2), h: Math.max(6, lines.length * lineH + o.stroke * 2) };

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

    if (o.shadow > 0) {
      c.save();
      c.globalAlpha = 0.75;
      c.drawImage(tinted(o.shadowColor), o.shadow, o.shadow);
      c.restore();
    }
    if (o.reflection) {
      c.save();
      c.globalAlpha = 0.32;
      c.translate(0, S.h);
      c.scale(1, -1);
      c.drawImage(tinted(o.color), 0, -(S.h - Math.round(size * 1.1)));
      c.restore();
    }
    if (o.depth > 0) {
      var ang = (o.angle || 225) * Math.PI / 180;
      var img = mask.getContext('2d').getImageData(0, 0, S.w, S.h);
      C.extrude(img, Math.cos(ang), Math.sin(ang), o.depth, C.parseColor(o.depthColor), null);
      var dep = offscreen(S.w, S.h);
      dep.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(img.data), S.w, S.h), 0, 0);
      c.drawImage(dep, 0, 0);
    }
    if (o.emboss) {
      c.save();
      c.globalAlpha = 0.85;
      c.drawImage(tinted('#ffffff'), -1, -1);
      c.drawImage(tinted('#000000'), 1, 1);
      c.restore();
    }

    c.save();
    c.font = fontStr;
    c.textBaseline = 'top';
    c.lineJoin = 'round';
    var fill = o.color;
    if (o.gradient) {
      var g = c.createLinearGradient(o.x, o.y, o.x + Math.max(2, maxW), o.y + Math.max(2, lines.length * lineH));
      g.addColorStop(0, o.color);
      g.addColorStop(1, o.grad2);
      fill = g;
    }
    c.fillStyle = fill;
    if (o.stroke > 0) { c.strokeStyle = o.strokeColor; c.lineWidth = o.stroke; }
    for (var j = 0; j < lines.length; j++) {
      drawTextLine(c, lines[j], o.x, o.y + j * lineH, size, o.curve, o.stroke);
    }
    c.restore();

    o._cache = { key: key, canvas: out };
    return out;
  }

  function shapeObjectCanvas(o) {
    var cv = offscreen(S.w, S.h);
    var c = cv.getContext('2d');
    c.save();
    c.strokeStyle = o.strokeColor;
    c.fillStyle = o.color;
    c.lineWidth = Math.max(1, o.strokeWidth || 1);
    var x = o.x, y = o.y, w = o.w, h = o.h;
    if (o.shape === 'rect') {
      if (o.filled) c.fillRect(x, y, w, h); else c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    } else if (o.shape === 'ellipse') {
      c.beginPath();
      c.ellipse(x + w / 2, y + h / 2, Math.max(1, w / 2), Math.max(1, h / 2), 0, 0, Math.PI * 2);
      if (o.filled) c.fill(); else c.stroke();
    } else if (o.shape === 'line') {
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + w, y + h);
      c.stroke();
    }
    c.restore();
    o._bounds = { x: x, y: y, w: Math.abs(w) || 1, h: Math.abs(h) || 1 };
    return cv;
  }

  /* Rotates a document-sized canvas around a point (used for object rotation). */
  function rotateAbout(src, angleDeg, cx, cy) {
    if (!angleDeg) return src;
    var out = offscreen(S.w, S.h);
    var c = out.getContext('2d');
    c.translate(cx, cy);
    c.rotate(angleDeg * Math.PI / 180);
    c.translate(-cx, -cy);
    c.drawImage(src, 0, 0);
    return out;
  }

  function objectCanvas(o) {
    var cv = o.type === 'text' ? textObjectCanvas(o) : shapeObjectCanvas(o);
    if (cv && o.rotation) {
      var b = o._bounds || { x: o.x, y: o.y, w: 1, h: 1 };
      cv = rotateAbout(cv, o.rotation, b.x + b.w / 2, b.y + b.h / 2);
    }
    return cv;
  }

  /* Handle positions in document coordinates. */
  function handlesFor(o) {
    var b = objectBounds(o);
    var tol = 10 / Math.max(0.2, effZoom());
    return {
      nw: { x: b.x, y: b.y },
      ne: { x: b.x + b.w, y: b.y },
      sw: { x: b.x, y: b.y + b.h },
      se: { x: b.x + b.w, y: b.y + b.h },
      rot: { x: b.x + b.w / 2, y: b.y - tol * 1.6 }
    };
  }

  function objectBounds(o) {
    if (!o._bounds) objectCanvas(o);
    return o._bounds || { x: o.x || 0, y: o.y || 0, w: 1, h: 1 };
  }

  function selectedObject() {
    for (var i = 0; i < S.objects.length; i++) if (S.objects[i].id === S.selectedObj) return S.objects[i];
    return null;
  }

  function addTextObject(props, anchor) {
    var o = Object.assign({ id: newObjectId(), type: 'text', visible: true }, props);
    o.x = anchor ? anchor.x : (S.textAnchor ? S.textAnchor.x : 2);
    o.y = anchor ? anchor.y : (S.textAnchor ? S.textAnchor.y : 2);
    S.objects.push(o);
    S.selectedObj = o.id;
    pushHistory(); render(); renderObjects(); renderLayers();
    toast('Text object added — edit it any time');
    return o;
  }

  function addShapeObject(shape) {
    var w = Math.round(S.w * 0.4), h = Math.round(S.h * 0.4);
    var o = {
      id: newObjectId(), type: 'shape', shape: shape, visible: true,
      x: Math.round((S.w - w) / 2), y: Math.round((S.h - h) / 2),
      w: w, h: h, filled: S.fillShapes, color: S.color,
      strokeColor: S.color2, strokeWidth: Math.max(1, S.brush)
    };
    S.objects.push(o);
    S.selectedObj = o.id;
    pushHistory(); render(); renderObjects();
    toast(shape + ' added');
  }

  function deleteObject(id) {
    S.objects = S.objects.filter(function (o) { return o.id !== id; });
    if (S.selectedObj === id) S.selectedObj = null;
    pushHistory(); render(); renderObjects(); renderLayers();
  }

  /* Bakes the selected object into the active layer. */
  function flattenObject(id) {
    var o = null;
    S.objects.forEach(function (x) { if (x.id === id) o = x; });
    var l = guardLayer();
    if (!o || !l) return;
    var cv = objectCanvas(o);
    if (cv) l.ctx.drawImage(cv, 0, 0);
    S.objects = S.objects.filter(function (x) { return x.id !== id; });
    if (S.selectedObj === id) S.selectedObj = null;
    pushHistory(); render(); renderObjects(); renderLayers();
    toast('Flattened into ' + l.name);
  }

  function updateSelectedText() {
    var o = selectedObject();
    if (!o || o.type !== 'text') return false;
    Object.assign(o, currentTextProps());
    o._cache = null;
    render();
    return true;
  }

  /* Renders the current Text-tab settings at the tap anchor, without creating an object. */
  function buildTextCanvas() {
    var props = currentTextProps();
    var tmp = Object.assign({ id: 'preview', type: 'text', visible: true }, props);
    tmp.x = S.textAnchor ? S.textAnchor.x : 2;
    tmp.y = S.textAnchor ? S.textAnchor.y : 2;
    return textObjectCanvas(tmp);
  }

  function addText() {
    if (!byId('text-content').value.trim()) { toast('Type some text first'); return; }
    if (updateSelectedText()) {
      pushHistory(); renderObjects();
      toast('Text updated');
      return;
    }
    addTextObject(currentTextProps());
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

  /* Small live previews for each text style preset. */
  function renderStyleThumbs() {
    $$('[data-style]').forEach(function (btn) {
      var preset = btn.dataset.style;
      var cv = document.createElement('canvas');
      cv.width = 96; cv.height = 40;
      var c = cv.getContext('2d');
      c.clearRect(0, 0, 96, 40);
      c.font = 'bold 22px ' + (S.text.font || 'sans-serif');
      c.textBaseline = 'middle';
      var styles = {
        plain: { stroke: 0, shadow: 0, depth: 0 },
        poster: { stroke: 2, shadow: 0, depth: 4 },
        neon: { stroke: 1, shadow: 4, depth: 0 }
      };
      var st = styles[preset] || styles.plain;
      c.save();
      if (st.shadow) {
        c.globalAlpha = 0.6;
        c.fillStyle = S.text.shadowColor || '#000000';
        c.fillText('Aa', 8 + st.shadow, 20 + st.shadow);
        c.globalAlpha = 1;
      }
      if (st.depth) {
        c.fillStyle = S.text.depthColor || '#2b2b3a';
        for (var d = st.depth; d > 0; d--) c.fillText('Aa', 8 + d, 20 + d);
      }
      if (st.stroke) {
        c.strokeStyle = S.text.strokeColor || '#000000';
        c.lineWidth = st.stroke;
        c.strokeText('Aa', 8, 20);
      }
      c.fillStyle = S.color;
      c.fillText('Aa', 8, 20);
      c.restore();
      btn.innerHTML = '';
      btn.appendChild(cv);
      var label = document.createElement('span');
      label.textContent = preset.charAt(0).toUpperCase() + preset.slice(1);
      btn.appendChild(label);
      btn.classList.add('style-thumb');
    });
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

  /* ------------------------------------------------------------------ AI cut-out
   * Optional, fully client-side segmentation (transformers.js + WebGPU/WASM).
   * If the model cannot be fetched, the colour-based remover takes over so the
   * button always does something useful.
   */
  var aiPipe = null;

  function aiStatus(text) {
    var note = byId('bg-ai-note');
    if (note) note.textContent = text;
  }

  async function aiRemoveBackground() {
    var got = readLayer();
    if (!got) return;
    var btn = byId('bg-ai');
    if (btn) { btn.disabled = true; btn.textContent = 'Loading model…'; }
    try {
      if (!aiPipe) {
        aiStatus('Downloading the segmentation model (one time only)…');
        var mod = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0');
        var pipeline = mod.pipeline;
        var device = (navigator.gpu ? 'webgpu' : 'wasm');
        aiPipe = await pipeline('image-segmentation', 'briaai/RMBG-1.4', { device: device });
      }
      aiStatus('Removing the background…');
      var src = document.createElement('canvas');
      src.width = S.w; src.height = S.h;
      src.getContext('2d').putImageData(got.img, 0, 0);
      var out = await aiPipe(src.toDataURL('image/png'));
      var maskItem = Array.isArray(out) ? out[0] : out;
      var maskCanvas = null;
      if (maskItem && maskItem.mask) {
        maskCanvas = maskItem.mask.toCanvas ? maskItem.mask.toCanvas() : null;
        if (!maskCanvas && maskItem.mask.data) {
          var mw = maskItem.mask.width, mh = maskItem.mask.height;
          maskCanvas = document.createElement('canvas');
          maskCanvas.width = mw; maskCanvas.height = mh;
          var mctx = maskCanvas.getContext('2d');
          var id = mctx.createImageData(mw, mh);
          for (var i = 0; i < mw * mh; i++) {
            var v = maskItem.mask.data[i];
            id.data[i * 4] = 255; id.data[i * 4 + 1] = 255; id.data[i * 4 + 2] = 255;
            id.data[i * 4 + 3] = v;
          }
          mctx.putImageData(id, 0, 0);
        }
      }
      if (!maskCanvas) throw new Error('no mask');
      var scaled = document.createElement('canvas');
      scaled.width = S.w; scaled.height = S.h;
      scaled.getContext('2d').drawImage(maskCanvas, 0, 0, S.w, S.h);

      var l = got.layer;
      var cut = document.createElement('canvas');
      cut.width = S.w; cut.height = S.h;
      var cc = cut.getContext('2d');
      cc.putImageData(got.img, 0, 0);
      cc.globalCompositeOperation = 'destination-in';
      cc.drawImage(scaled, 0, 0);
      l.ctx.clearRect(0, 0, S.w, S.h);
      l.ctx.drawImage(cut, 0, 0);
      pushHistory(); render(); renderLayers();
      aiStatus('AI cut-out applied. Model cached for this session.');
      toast('AI background removed');
    } catch (err) {
      aiStatus('AI model unavailable here — used the colour-based remover instead.');
      toast('AI model could not load; using colour-based removal');
      autoRemoveBg();
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'AI remove background (beta)'; }
    }
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
    S.objects = []; S.selectedObj = null;
    S.sel = null; S.floating = null; S.preview = null; S.fxBase = null;
    S.history = []; S.hpos = -1;
    fitZoom(); render(); renderLayers(); updateStatus();
    pushHistory();
  }

  function projectObject() {
    return {
      app: 'pixelstudioedit', version: 4,
      w: S.w, h: S.h,
      palette: S.palette.slice(),
      groups: JSON.parse(JSON.stringify(S.groups)),
      objects: S.objects.map(function (o) {
        var c = {}; Object.keys(o).forEach(function (k) { if (k.charAt(0) !== '_') c[k] = o[k]; });
        return c;
      }),
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
    S.objects = (obj.objects || []).map(function (o) { return Object.assign({}, o); });
    S.selectedObj = null;
    if (Array.isArray(obj.palette) && obj.palette.length) { S.palette = obj.palette.slice(); renderPalette(); }
    renderObjects();
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

  /* Imports an image.
   * Photo and pixel-art modes resize the document to the image FIRST and then draw
   * it 1:1 — drawing into a small canvas and upscaling afterwards produced the
   * blocky, banded photo that users reported. */
  function importImage(file) {
    var url = URL.createObjectURL(file);
    var im = new Image();
    im.onload = function () {
      var mode = S.importMode;
      S.importMode = null;
      var name = (file.name || 'Image').replace(/\.[^.]+$/, '').slice(0, 18) || 'Image';

      var layer = mkLayer(name);
      layer.ctx.imageSmoothingEnabled = false;

      if (mode === 'photo' || mode === 'pixel') {
        /* fit the photo into a sane memory budget, keeping its aspect ratio */
        var maxPixels = 4.2e6;
        var scale = 1;
        if (im.width * im.height > maxPixels) scale = Math.sqrt(maxPixels / (im.width * im.height));
        var docW = Math.max(1, Math.min(2048, Math.round(im.width * scale)));
        var docH = Math.max(1, Math.min(2048, Math.round(im.height * scale)));

        newDoc(docW, docH);
        layer = S.layers[0];
        layer.name = name;
        /* smooth only when the photo had to be downscaled — 1:1 stays untouched */
        layer.ctx.imageSmoothingEnabled = scale < 1;
        layer.ctx.imageSmoothingQuality = 'high';
        layer.ctx.drawImage(im, 0, 0, docW, docH);
        layer.ctx.imageSmoothingEnabled = false;

        pushHistory(); fitZoom(); render(); renderLayers(); updateStatus();
        openTab('photo');
        if (mode === 'pixel') {
          setTimeout(function () { pixelize(false); }, 60);
          toast('Pixel art ready — tune Block and palette in the Photo tab');
        } else {
          toast('Photo opened at ' + S.w + '×' + S.h);
        }
      } else {
        /* no mode chosen: place the image inside the current canvas */
        var sc = Math.min(S.w / im.width, S.h / im.height);
        var dw = Math.max(1, Math.round(im.width * sc));
        var dh = Math.max(1, Math.round(im.height * sc));
        layer.ctx.imageSmoothingEnabled = sc < 1;
        layer.ctx.drawImage(im, 0, 0, im.width, im.height,
          Math.round((S.w - dw) / 2), Math.round((S.h - dh) / 2), dw, dh);
        layer.ctx.imageSmoothingEnabled = false;
        S.layers.splice(S.active + 1, 0, layer);
        S.active++;
        pushHistory(); render(); renderLayers(); updateStatus();
        toast('Imported — try Photo → Make pixel art');
      }
      URL.revokeObjectURL(url);
    };
    im.onerror = function () { toast('Could not read that image'); URL.revokeObjectURL(url); };
    im.src = url;
  }

  /* -------------------------------------------------------------------- tabs */

  function openTab(name) {
    S.tab = name;
    setTimeout(fitZoom, 260);
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
    bgCanvas = byId('bg-layer');
    bgCtx = bgCanvas.getContext('2d');
    overlayCanvas = byId('overlay');
    overlayCtx = overlayCanvas.getContext('2d');
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
    on('m-templates', 'click', function () { byId('menu-pop').hidden = true; templatesDialog(); });
    on('m-canvas', 'click', function () { byId('menu-pop').hidden = true; canvasDialog(); });
    on('m-restore', 'click', function () {
      byId('menu-pop').hidden = true;
      var raw = localStorage.getItem(AUTOSAVE_KEY);
      if (!raw) { toast('No autosave found'); return; }
      try { loadProject(JSON.parse(raw)); } catch (err) { toast('Autosave is unreadable'); }
    });
    on('m-help', 'click', function () {
      byId('menu-pop').hidden = true;
      modal('Quick guide',
        '<div class="guide">' +
        '<h4>1 · Start</h4><p class="hint">Pick Create a design, Edit a photo or Make pixel art on the start screen. Templates give you a finished layout with editable text.</p>' +
        '<h4>2 · Text</h4><p class="hint">Choose the Text tool (T), tap the canvas and a small box opens right there. Type, press Enter. Tap the text again with Select (M) to change its words, font or style.</p>' +
        '<h4>3 · Objects</h4><p class="hint">Every text and shape stays editable. Select it to drag, resize with the corner handles, or rotate with the round handle. Flatten when you are done.</p>' +
        '<h4>4 · Photo &amp; pixel art</h4><p class="hint">The Photo tab resizes, crops, removes backgrounds and turns a photo into pixel art with a palette and dithering.</p>' +
        '<h4>5 · Export</h4><p class="hint">Export PNG (transparency), JPEG or WebP at 1×–20×. Projects save as JSON and reopen with layers and text intact.</p>' +
        '<h4>Shortcuts</h4><div class="hint" style="line-height:1.9">' +
        '<b>B</b> pencil · <b>E</b> eraser · <b>G</b> fill · <b>I</b> eyedropper<br>' +
        '<b>L</b> line · <b>R</b> rectangle · <b>O</b> ellipse<br>' +
        '<b>M</b> select · <b>T</b> text · <b>H</b> pan · <b>X</b> swap colours<br>' +
        '<b>[</b> <b>]</b> brush size · <b>+</b> <b>−</b> zoom · <b>0</b> fit<br>' +
        '<b>Ctrl+Z</b> undo · <b>Ctrl+Shift+Z</b> redo · <b>Ctrl+A</b> select all<br>' +
        '<b>Delete</b> clear selection · <b>Esc</b> deselect<br><br>' +
        'Right-click draws with the secondary colour.</div></div>', function () {}, 'Got it');
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
    on('zoom-in', 'click', function () { setZoom(effZoom() < 1 ? effZoom() * 1.5 : effZoom() + 1); });
    on('zoom-out', 'click', function () { setZoom(effZoom() <= 1 ? effZoom() / 1.5 : effZoom() - 1); });
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
    on('bg-radial', 'click', function () { fillBackground('radial'); });

    // groups and masks
    on('group-add', 'click', addGroup);
    on('group-toggle', 'click', toggleCollapseActive);
    on('group-del', 'click', ungroupActive);
    on('mask-from-selection', 'click', makeMaskFromSelection);
    on('mask-toggle', 'click', toggleMask);
    on('mask-remove', 'click', removeMask);

    // objects
    $$('[data-add-shape]').forEach(function (b) {
      b.onclick = function () { addShapeObject(b.dataset.addShape); };
    });
    on('obj-flatten', 'click', function () {
      if (!S.selectedObj) { toast('Select an object first'); return; }
      flattenObject(S.selectedObj);
    });
    on('obj-delete', 'click', function () {
      if (!S.selectedObj) { toast('Select an object first'); return; }
      deleteObject(S.selectedObj);
    });

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
    ['text-size', 'text-stroke', 'text-shadow', 'text-curve', 'text-depth', 'text-stroke-color',
     'text-shadow-color', 'text-depth-color', 'text-grad2'].forEach(function (id) {
      var el = byId(id);
      if (!el) return;
      el.addEventListener('change', function () { if (updateSelectedText()) pushHistory(); });
    });
    $$('[data-style]').forEach(function (b) {
      b.onclick = function () { applyStylePreset(b.dataset.style); renderStyleThumbs(); };
    });
    renderStyleThumbs();

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
    on('bg-ai', 'click', function () { aiRemoveBackground(); });
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
    window.addEventListener('resize', function () { fitZoom(); });

    /* On-screen keyboard: shrink the shell instead of letting it overflow. */
    function syncViewport() {
      var kb = 0;
      if (window.visualViewport) {
        kb = Math.max(0, window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop);
      }
      document.documentElement.style.setProperty('--kb', Math.round(kb) + 'px');
    }
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', function () { syncViewport(); fitZoom(); });
      window.visualViewport.addEventListener('scroll', syncViewport);
    }
    syncViewport();
    on('sheet-grab', 'click', function () {
      byId('side').classList.toggle('open');
      setTimeout(fitZoom, 260);
    });
  }

  function swapColours() {
    var t = S.color;
    S.color = S.color2;
    S.color2 = t;
    setColor(S.color);
    setColor(S.color2, true);
  }


  /* ------------------------------------------------------ designed templates */

  var TEMPLATE_LAYOUTS = [
    {
      id: 'poster', name: 'Poster', w: 1080, h: 1350, bg: '#0f172a', bg2: '#1e3a5f',
      texts: [
        { text: 'YOUR TITLE', size: 0.085, y: 0.36, color: '#ffffff', bold: true, depth: 8 },
        { text: 'A short subtitle that explains the idea', size: 0.032, y: 0.48, color: '#9fb3c8', bold: false }
      ]
    },
    {
      id: 'quote', name: 'Quote card', w: 1080, h: 1080, bg: '#111827', bg2: '#1f2937',
      texts: [
        { text: '“Make something small today.”', size: 0.05, y: 0.36, color: '#f8fafc', bold: true, curve: 0 },
        { text: '— your name', size: 0.028, y: 0.62, color: '#94a3b8', bold: false }
      ]
    },
    {
      id: 'meme', name: 'Meme', w: 800, h: 600, bg: '#ffffff',
      texts: [
        { text: 'TOP TEXT', size: 0.1, y: 0.03, color: '#000000', bold: true, stroke: 2, strokeColor: '#ffffff' },
        { text: 'BOTTOM TEXT', size: 0.1, y: 0.8, color: '#000000', bold: true, stroke: 2, strokeColor: '#ffffff' }
      ]
    },
    {
      id: 'sale', name: 'Sale banner', w: 1500, h: 500, bg: '#7c2d12', bg2: '#f97316',
      texts: [
        { text: 'BIG SALE', size: 0.3, y: 0.2, color: '#ffffff', bold: true, depth: 10 },
        { text: '50% OFF THIS WEEK', size: 0.09, y: 0.62, color: '#fff7ed', bold: false }
      ]
    },
    {
      id: 'thumb', name: 'YouTube thumbnail', w: 1280, h: 720, bg: '#0b1220', bg2: '#1e293b',
      texts: [
        { text: 'TITLE HERE', size: 0.15, y: 0.3, color: '#facc15', bold: true, stroke: 3, strokeColor: '#000000' },
        { text: 'episode 01', size: 0.055, y: 0.62, color: '#e2e8f0', bold: false }
      ]
    },
    {
      id: 'story', name: 'Story', w: 1080, h: 1920, bg: '#1e1b4b', bg2: '#4c1d95',
      texts: [
        { text: 'NEW DROP', size: 0.075, y: 0.34, color: '#ffffff', bold: true, depth: 12 },
        { text: 'swipe up', size: 0.032, y: 0.82, color: '#c4b5fd', bold: false }
      ]
    }
  ];

  /* Shrinks a text object until it fits the given width — templates must never overflow. */
  function fitTextObject(o, maxW) {
    for (var i = 0; i < 14; i++) {
      o._cache = null;
      textObjectCanvas(o);
      var b = o._bounds || { w: 0 };
      if (!b.w || b.w <= maxW) break;
      o.size = Math.max(6, Math.round(o.size * (maxW / b.w) * 0.97));
    }
    o._cache = null;
    textObjectCanvas(o);
  }

  /* Templates must still fit after a web font finishes loading. */
  function refitTemplateObjects() {
    var changed = false;
    S.objects.forEach(function (o) {
      if (!o.fitMax || o.type !== 'text') return;
      var before = o.size;
      fitTextObject(o, o.fitMax);
      if (o.size !== before) changed = true;
    });
    if (changed) { render(); renderObjects(); }
    return changed;
  }

  function templateById(id) {
    for (var i = 0; i < TEMPLATE_LAYOUTS.length; i++) if (TEMPLATE_LAYOUTS[i].id === id) return TEMPLATE_LAYOUTS[i];
    return null;
  }

  function applyTemplate(id) {
    var t = templateById(id);
    if (!t) return;
    newDoc(t.w, t.h);
    var base = S.layers[0];
    base.ctx.save();
    if (t.bg2) {
      var g = base.ctx.createLinearGradient(0, 0, t.w, t.h);
      g.addColorStop(0, t.bg);
      g.addColorStop(1, t.bg2);
      base.ctx.fillStyle = g;
    } else {
      base.ctx.fillStyle = t.bg;
    }
    base.ctx.fillRect(0, 0, t.w, t.h);
    base.ctx.restore();

    t.texts.forEach(function (tx) {
      var obj = ({
        id: newObjectId(), type: 'text', visible: true,
        text: tx.text,
        font: tx.font || "'Press Start 2P', monospace",
        size: Math.max(6, Math.round((tx.size || 0.06) * t.h)),
        bold: tx.bold !== false, italic: false,
        gradient: false, grad2: '#38bdf8',
        stroke: tx.stroke || 0, strokeColor: tx.strokeColor || '#000000',
        shadow: 0, shadowColor: '#000000',
        curve: tx.curve || 0, depth: tx.depth || 0, depthColor: '#2b2b3a', angle: 225,
        reflection: false, emboss: false,
        color: tx.color || '#ffffff',
        x: Math.round((tx.x == null ? 0.06 : tx.x) * t.w),
        y: Math.round(tx.y * t.h)
      });
      obj.fitMax = t.w * 0.88;
      S.objects.push(obj);
      fitTextObject(obj, obj.fitMax);
    });

    pushHistory(); fitZoom(); render(); renderObjects(); renderLayers(); updateStatus();
    openTab('text');
    setTimeout(function () { refitTemplateObjects(); pushHistory(); }, 350);
    toast(t.name + ' template ready — tap a text to edit it');
  }

  function renderTemplateRow() {
    var box = byId('template-row');
    if (!box) return;
    box.innerHTML = '';
    TEMPLATE_LAYOUTS.forEach(function (t) {
      var b = document.createElement('button');
      b.className = 'template-card';
      b.innerHTML = '<b>' + t.name + '</b><small>' + t.w + '×' + t.h + '</small>';
      b.style.background = 'linear-gradient(135deg, ' + t.bg + ', ' + (t.bg2 || t.bg) + ')';
      b.onclick = function () {
        var st = byId('start');
        if (st) st.hidden = true;
        applyTemplate(t.id);
      };
      box.appendChild(b);
    });
  }

  function templatesDialog() {
    modal('Templates',
      '<div class="template-row" id="dlg-templates">' +
      TEMPLATE_LAYOUTS.map(function (t) {
        return '<button class="template-card" data-tpl="' + t.id + '" style="background:linear-gradient(135deg,' + t.bg + ',' + (t.bg2 || t.bg) + ')">' +
          '<b>' + t.name + '</b><small>' + t.w + '×' + t.h + '</small></button>';
      }).join('') +
      '</div><p class="hint">A template opens a fresh document with a background and editable text objects.</p>',
      function () {}, 'Close');
    $$('#dlg-templates .template-card').forEach(function (b) {
      b.onclick = function () {
        var ov = b.closest('.overlay');
        if (ov) ov.remove();
        applyTemplate(b.dataset.tpl);
      };
    });
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
    renderTemplateRow();
    renderObjects();
    renderFontList();
    syncTextControls();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { markFontAvailability(); refitTemplateObjects(); });
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

  /* Installable / offline: register the app-shell service worker where allowed. */
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline shell is optional */ });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
