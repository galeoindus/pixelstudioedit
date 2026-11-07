/* pixelstudio — core colour and raster routines.
 * Pure functions over ImageData-like objects ({data, width, height}).
 * No DOM access, so the same file runs in the browser and under Node tests.
 * Original implementation, MIT licensed.
 */
(function (root) {
  'use strict';

  var clamp = function (v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; };

  /* ------------------------------------------------------------------ colour */

  function hexToRgb(hex) {
    var h = String(hex).trim().replace(/^#/, '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (h.length === 8) h = h.slice(0, 6);
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return [0, 0, 0, 255];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 255];
  }

  function rgbToHex(r, g, b) {
    var t = function (v) { var s = clamp(Math.round(v), 0, 255).toString(16); return s.length === 1 ? '0' + s : s; };
    return '#' + t(r) + t(g) + t(b);
  }

  function parseColor(str) {
    if (Array.isArray(str)) return str.slice(0, 4);
    var s = String(str).trim();
    var m = /^rgba?\(([^)]+)\)$/i.exec(s);
    if (m) {
      var p = m[1].split(',').map(function (x) { return parseFloat(x); });
      return [p[0] | 0, p[1] | 0, p[2] | 0, p.length > 3 ? Math.round(p[3] * 255) : 255];
    }
    return hexToRgb(s);
  }

  function luminance(r, g, b) { return 0.2126 * r + 0.7152 * g + 0.0722 * b; }

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, h = 0;
    if (d !== 0) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60; if (h < 0) h += 360;
    }
    return [h, max === 0 ? 0 : d / max, max];
  }

  function hsvToRgb(h, s, v) {
    h = ((h % 360) + 360) % 360;
    var c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c, r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
  }

  /* ---------------------------------------------------------------- palettes */

  var PALETTES = {
    'db16': { name: 'DawnBringer 16', colors: ['#140c1c', '#442434', '#30346d', '#4e4a4e', '#854c30', '#346524', '#d04648', '#757161', '#597dce', '#d27d2c', '#8595a1', '#6daa2c', '#d2aa99', '#6dc2ca', '#dad45e', '#deeed6'] },
    'pico8': { name: 'PICO-8', colors: ['#000000', '#1d2b53', '#7e2553', '#008751', '#ab5236', '#5f574f', '#c2c3c7', '#fff1e8', '#ff004d', '#ffa300', '#ffec27', '#00e436', '#29adff', '#83769c', '#ff77a8', '#ffccaa'] },
    'gameboy': { name: 'Game Boy', colors: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'] },
    'nes': { name: 'NES', colors: ['#000000', '#fcfcfc', '#f8f8f8', '#bcbcbc', '#7c7c7c', '#a4e4fc', '#3cbcfc', '#0078f8', '#0000fc', '#b8b8f8', '#6888fc', '#0058f8', '#0000bc', '#f8b8f8', '#f878f8', '#d800cc', '#6844fc', '#4428bc', '#f8a4c0', '#f85898', '#e40058', '#a80020', '#f0d0b0', '#f87858', '#f83800', '#a81000', '#fce0a8', '#fca044', '#e45c10', '#881400', '#f8d878', '#f8b800', '#ac7c00', '#503000', '#d8f878', '#b8f818', '#00b800', '#006800', '#b8f8b8', '#58d854', '#00a800', '#005800', '#b8f8d8', '#58f898', '#00e8d8', '#007878', '#f8d8f8', '#787878', '#f8f8f8', '#bcbcbc', '#000000'] },
    'grayscale': { name: 'Grayscale 8', colors: ['#000000', '#242424', '#484848', '#6d6d6d', '#919191', '#b6b6b6', '#dadada', '#ffffff'] },
    'sepia': { name: 'Sepia 8', colors: ['#1a120b', '#2f2116', '#4a3423', '#6b4b32', '#8f6843', '#b58a5c', '#d8b183', '#f2dcb6'] },
    'sweetie': { name: 'Sweetie 16', colors: ['#1a1c2c', '#5d275d', '#b13e53', '#ef7d57', '#ffcd75', '#a7f070', '#38b764', '#257179', '#29366f', '#3b5dc9', '#41a6f6', '#73eff7', '#f4f4f4', '#94b0c2', '#566c86', '#333c57'] }
  };

  function paletteToRgb(hexes) { return hexes.map(function (h) { return hexToRgb(h); }); }

  function nearestColor(r, g, b, pal) {
    var best = 0, bestD = Infinity;
    for (var i = 0; i < pal.length; i++) {
      var p = pal[i];
      var dr = r - p[0], dg = g - p[1], db = b - p[2];
      var d = dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11;
      if (d < bestD) { bestD = d; best = i; }
    }
    return pal[best];
  }

  /* --------------------------------------------------------------- utilities */

  function clone(img) {
    return { width: img.width, height: img.height, data: new Uint8ClampedArray(img.data) };
  }

  function blank(w, h) {
    return { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) };
  }

  function getPixel(img, x, y) {
    if (x < 0 || y < 0 || x >= img.width || y >= img.height) return [0, 0, 0, 0];
    var i = (y * img.width + x) * 4;
    return [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]];
  }

  function setPixel(img, x, y, rgba) {
    if (x < 0 || y < 0 || x >= img.width || y >= img.height) return;
    var i = (y * img.width + x) * 4;
    img.data[i] = rgba[0]; img.data[i + 1] = rgba[1]; img.data[i + 2] = rgba[2];
    img.data[i + 3] = rgba.length > 3 ? rgba[3] : 255;
  }

  function applyMatrix(img, m) {
    var d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      var a = d[i + 3];
      if (a === 0) continue;
      var r = d[i], g = d[i + 1], b = d[i + 2];
      d[i] = clamp(m[0] * r + m[1] * g + m[2] * b + m[3] * a + m[4], 0, 255);
      d[i + 1] = clamp(m[5] * r + m[6] * g + m[7] * b + m[8] * a + m[9], 0, 255);
      d[i + 2] = clamp(m[10] * r + m[11] * g + m[12] * b + m[13] * a + m[14], 0, 255);
    }
    return img;
  }

  /* ---------------------------------------------------------------- effects */

  function brightness(img, amount) { // -100 .. 100
    var k = amount * 2.55;
    return applyMatrix(img, [1, 0, 0, 0, k, 0, 1, 0, 0, k, 0, 0, 1, 0, k]);
  }

  function contrast(img, amount) { // -100 .. 100
    var c = amount * 2.55;
    var f = (259 * (c + 255)) / (255 * (259 - c));
    var o = 128 * (1 - f);
    return applyMatrix(img, [f, 0, 0, 0, o, 0, f, 0, 0, o, 0, 0, f, 0, o]);
  }

  function saturation(img, amount) { // -100 .. 100
    var s = 1 + amount / 100;
    var lr = 0.2126, lg = 0.7152, lb = 0.0722;
    var sr = (1 - s) * lr, sg = (1 - s) * lg, sb = (1 - s) * lb;
    return applyMatrix(img, [
      sr + s, sg, sb, 0, 0,
      sr, sg + s, sb, 0, 0,
      sr, sg, sb + s, 0, 0
    ]);
  }

  function hueRotate(img, deg) {
    var rad = deg * Math.PI / 180, c = Math.cos(rad), s = Math.sin(rad);
    var lr = 0.213, lg = 0.715, lb = 0.072;
    return applyMatrix(img, [
      lr + c * (1 - lr) + s * (-lr), lg + c * (-lg) + s * (-lg), lb + c * (-lb) + s * (1 - lb), 0, 0,
      lr + c * (-lr) + s * 0.143, lg + c * (1 - lg) + s * 0.140, lb + c * (-lb) + s * -0.283, 0, 0,
      lr + c * (-lr) + s * -(1 - lr), lg + c * (-lg) + s * lg, lb + c * (1 - lb) + s * lb, 0, 0
    ]);
  }

  function invert(img) {
    var d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      d[i] = 255 - d[i]; d[i + 1] = 255 - d[i + 1]; d[i + 2] = 255 - d[i + 2];
    }
    return img;
  }

  function grayscale(img) {
    var d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      var v = luminance(d[i], d[i + 1], d[i + 2]);
      d[i] = d[i + 1] = d[i + 2] = v;
    }
    return img;
  }

  function posterize(img, levels) {
    var steps = Math.max(2, levels | 0) - 1, d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      d[i] = Math.round(Math.round(d[i] / 255 * steps) / steps * 255);
      d[i + 1] = Math.round(Math.round(d[i + 1] / 255 * steps) / steps * 255);
      d[i + 2] = Math.round(Math.round(d[i + 2] / 255 * steps) / steps * 255);
    }
    return img;
  }

  function threshold(img, level) {
    var d = img.data, t = level == null ? 128 : level;
    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      var v = luminance(d[i], d[i + 1], d[i + 2]) >= t ? 255 : 0;
      d[i] = d[i + 1] = d[i + 2] = v;
    }
    return img;
  }

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function noise(img, amount, seed) {
    var rnd = mulberry32(seed == null ? 1 : seed), d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      var n = (rnd() * 2 - 1) * amount;
      d[i] = clamp(d[i] + n, 0, 255);
      d[i + 1] = clamp(d[i + 1] + n, 0, 255);
      d[i + 2] = clamp(d[i + 2] + n, 0, 255);
    }
    return img;
  }

  function boxBlurPass(src, w, h, radius, horizontal) {
    var out = new Uint8ClampedArray(src.length);
    var outer = horizontal ? h : w, inner = horizontal ? w : h;
    var span = radius * 2 + 1;
    for (var o = 0; o < outer; o++) {
      for (var c = 0; c < 4; c++) {
        var acc = 0, count = 0;
        for (var i = -radius; i <= radius; i++) {
          var k = i < 0 ? 0 : (i >= inner ? inner - 1 : i);
          var idx = horizontal ? (o * w + k) * 4 + c : (k * w + o) * 4 + c;
          acc += src[idx]; count++;
        }
        for (var j = 0; j < inner; j++) {
          var oidx = horizontal ? (o * w + j) * 4 + c : (j * w + o) * 4 + c;
          out[oidx] = acc / count;
          var addK = j + radius + 1, subK = j - radius;
          if (addK >= inner) addK = inner - 1;
          if (subK < 0) subK = 0;
          var addIdx = horizontal ? (o * w + addK) * 4 + c : (addK * w + o) * 4 + c;
          var subIdx = horizontal ? (o * w + subK) * 4 + c : (subK * w + o) * 4 + c;
          acc += src[addIdx] - src[subIdx];
        }
      }
    }
    return out;
  }

  function blur(img, radius) {
    var r = Math.max(1, radius | 0);
    var w = img.width, h = img.height;
    img.data.set(boxBlurPass(img.data, w, h, r, true));
    img.data.set(boxBlurPass(img.data, w, h, r, false));
    return img;
  }

  /* Adds a solid outline around every opaque region. */
  function outline(img, color, thickness) {
    var t = Math.max(1, thickness | 0), w = img.width, h = img.height;
    var src = clone(img), rgb = parseColor(color), d = img.data, s = src.data;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4;
        if (s[i + 3] !== 0) continue;
        var hit = false;
        for (var dy = -t; dy <= t && !hit; dy++) {
          for (var dx = -t; dx <= t; dx++) {
            var nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            if (s[(ny * w + nx) * 4 + 3] > 24) { hit = true; break; }
          }
        }
        if (hit) { d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; d[i + 3] = 255; }
      }
    }
    return img;
  }

  /* Hard drop shadow drawn beneath the existing pixels. */
  function dropShadow(img, dx, dy, color, alpha) {
    var w = img.width, h = img.height;
    var src = clone(img), rgb = parseColor(color);
    var a = alpha == null ? 1 : clamp(alpha, 0, 1);
    var d = img.data, s = src.data;
    d.fill(0);
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var si = (y * w + x) * 4;
        if (s[si + 3] === 0) continue;
        var tx = x + dx, ty = y + dy;
        if (tx < 0 || ty < 0 || tx >= w || ty >= h) continue;
        var ti = (ty * w + tx) * 4;
        d[ti] = rgb[0]; d[ti + 1] = rgb[1]; d[ti + 2] = rgb[2];
        d[ti + 3] = Math.max(d[ti + 3], Math.round(255 * a));
      }
    }
    for (var y2 = 0; y2 < h; y2++) {
      for (var x2 = 0; x2 < w; x2++) {
        var oi = (y2 * w + x2) * 4;
        var sa = s[oi + 3];
        if (sa === 0) continue;
        var ia = d[oi + 3] / 255;
        var oa = sa / 255 + ia * (1 - sa / 255);
        if (oa <= 0) continue;
        d[oi] = (s[oi] * (sa / 255) + d[oi] * ia * (1 - sa / 255)) / oa;
        d[oi + 1] = (s[oi + 1] * (sa / 255) + d[oi + 1] * ia * (1 - sa / 255)) / oa;
        d[oi + 2] = (s[oi + 2] * (sa / 255) + d[oi + 2] * ia * (1 - sa / 255)) / oa;
        d[oi + 3] = Math.round(oa * 255);
      }
    }
    return img;
  }

  /* ------------------------------------------------------------- quantising */

  function quantize(img, paletteHexes) {
    var pal = paletteToRgb(paletteHexes), d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 8) { d[i + 3] = 0; continue; }
      var c = nearestColor(d[i], d[i + 1], d[i + 2], pal);
      d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2];
      d[i + 3] = 255;
    }
    return img;
  }

  function ditherFloydSteinberg(img, paletteHexes) {
    var pal = paletteToRgb(paletteHexes), w = img.width, h = img.height, d = img.data;
    var buf = new Float32Array(w * h * 3);
    for (var i = 0, j = 0; i < d.length; i += 4, j += 3) {
      buf[j] = d[i]; buf[j + 1] = d[i + 1]; buf[j + 2] = d[i + 2];
    }
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var oi = (y * w + x) * 4;
        if (d[oi + 3] < 8) { d[oi + 3] = 0; continue; }
        var b = (y * w + x) * 3;
        var r = buf[b], g = buf[b + 1], bl = buf[b + 2];
        var c = nearestColor(r, g, bl, pal);
        var er = r - c[0], eg = g - c[1], eb = bl - c[2];
        d[oi] = c[0]; d[oi + 1] = c[1]; d[oi + 2] = c[2]; d[oi + 3] = 255;
        var spread = function (dx, dy, f) {
          var nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) return;
          var nb = (ny * w + nx) * 3;
          buf[nb] += er * f; buf[nb + 1] += eg * f; buf[nb + 2] += eb * f;
        };
        spread(1, 0, 7 / 16);
        spread(-1, 1, 3 / 16);
        spread(0, 1, 5 / 16);
        spread(1, 1, 1 / 16);
      }
    }
    return img;
  }

  var BAYER4 = [
    0, 8, 2, 10,
    12, 4, 14, 6,
    3, 11, 1, 9,
    15, 7, 13, 5
  ];

  function ditherBayer(img, paletteHexes, strength) {
    var pal = paletteToRgb(paletteHexes), w = img.width, h = img.height, d = img.data;
    var amp = (strength == null ? 32 : strength);
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var oi = (y * w + x) * 4;
        if (d[oi + 3] < 8) { d[oi + 3] = 0; continue; }
        var t = (BAYER4[(y % 4) * 4 + (x % 4)] / 16 - 0.5) * amp;
        var c = nearestColor(d[oi] + t, d[oi + 1] + t, d[oi + 2] + t, pal);
        d[oi] = c[0]; d[oi + 1] = c[1]; d[oi + 2] = c[2]; d[oi + 3] = 255;
      }
    }
    return img;
  }

  /* ------------------------------------------------------------------- fill */

  function colorClose(d, i, target, tol) {
    var dr = d[i] - target[0], dg = d[i + 1] - target[1], db = d[i + 2] - target[2], da = d[i + 3] - target[3];
    return Math.abs(dr) <= tol && Math.abs(dg) <= tol && Math.abs(db) <= tol && Math.abs(da) <= tol;
  }

  function floodFill(img, sx, sy, rgba, tolerance) {
    var w = img.width, h = img.height, d = img.data;
    if (sx < 0 || sy < 0 || sx >= w || sy >= h) return img;
    var tol = tolerance == null ? 0 : tolerance;
    var si = (sy * w + sx) * 4;
    var target = [d[si], d[si + 1], d[si + 2], d[si + 3]];
    if (target[0] === rgba[0] && target[1] === rgba[1] && target[2] === rgba[2] && target[3] === (rgba[3] == null ? 255 : rgba[3])) return img;
    var seen = new Uint8Array(w * h);
    var stack = [sx, sy];
    while (stack.length) {
      var y = stack.pop(), x = stack.pop();
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      var p = y * w + x;
      if (seen[p]) continue;
      var i = p * 4;
      if (!colorClose(d, i, target, tol)) continue;
      seen[p] = 1;
      d[i] = rgba[0]; d[i + 1] = rgba[1]; d[i + 2] = rgba[2]; d[i + 3] = rgba[3] == null ? 255 : rgba[3];
      stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
    }
    return img;
  }

  /* Replace one exact colour across the layer (magic wand without tolerance). */
  function replaceColor(img, from, to, tolerance) {
    var d = img.data, tol = tolerance == null ? 0 : tolerance;
    for (var i = 0; i < d.length; i += 4) {
      if (colorClose(d, i, from, tol)) {
        d[i] = to[0]; d[i + 1] = to[1]; d[i + 2] = to[2]; d[i + 3] = to[3] == null ? 255 : to[3];
      }
    }
    return img;
  }

  /* ------------------------------------------------------------- 3D helpers */

  /* Extrudes the opaque pixels of an image along (dx, dy) for `steps` pixels,
   * painting the sides with sideRgb and the front face with faceRgb. */
  function extrude(img, dx, dy, steps, sideRgb, faceRgb) {
    var w = img.width, h = img.height;
    var src = clone(img), s = src.data;
    var out = blank(w, h), d = out.data;
    var n = Math.max(1, steps | 0);
    var side = sideRgb || [0, 0, 0];
    for (var k = n; k >= 1; k--) {
      var ox = Math.round(dx * k), oy = Math.round(dy * k);
      var f = 0.35 + 0.65 * (1 - k / (n + 1));
      var r = side[0] * f, g = side[1] * f, b = side[2] * f;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var i = (y * w + x) * 4;
          if (s[i + 3] < 8) continue;
          var tx = x + ox, ty = y + oy;
          if (tx < 0 || ty < 0 || tx >= w || ty >= h) continue;
          var j = (ty * w + tx) * 4;
          d[j] = r; d[j + 1] = g; d[j + 2] = b; d[j + 3] = 255;
        }
      }
    }
    for (var p = 0; p < s.length; p += 4) {
      var a = s[p + 3];
      if (a < 8) continue;
      if (faceRgb) {
        d[p] = faceRgb[0]; d[p + 1] = faceRgb[1]; d[p + 2] = faceRgb[2]; d[p + 3] = a;
      } else {
        d[p] = s[p]; d[p + 1] = s[p + 1]; d[p + 2] = s[p + 2]; d[p + 3] = a;
      }
    }
    img.data.set(d);
    return img;
  }

  /* Fake 3D: yaw (rotateY, degrees) around the vertical axis and pitch
   * (tiltX, degrees) around the horizontal axis, with a simple perspective. */
  function perspective(img, opts) {
    opts = opts || {};
    var yaw = (opts.rotateY || 0) * Math.PI / 180;
    var pitch = (opts.tiltX || 0) * Math.PI / 180;
    if (!yaw && !pitch) return img;
    var w = img.width, h = img.height;
    var src = clone(img), s = src.data;
    var out = blank(w, h), d = out.data;
    var cx = (w - 1) / 2, cy = (h - 1) / 2;
    var f = Math.max(w, h) * 1.7;
    var ca = Math.cos(yaw), sa = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var p = x - cx, v = y - cy;
        var denX = f * ca - p * sa;
        var denY = f * cp - v * sp;
        if (Math.abs(denX) < 1e-6 || Math.abs(denY) < 1e-6) continue;
        var sx = Math.round(cx + p * f / denX);
        var sy = Math.round(cy + v * f / denY);
        if (sx < 0 || sy < 0 || sx >= w || sy >= h) continue;
        var si = (sy * w + sx) * 4, di = (y * w + x) * 4;
        d[di] = s[si]; d[di + 1] = s[si + 1]; d[di + 2] = s[si + 2]; d[di + 3] = s[si + 3];
      }
    }
    img.data.set(d);
    return img;
  }

  /* Scales an RGB colour towards black/white by factor f (0.2 .. 1.8). */
  function shade(rgb, f) {
    return [clamp(rgb[0] * f, 0, 255), clamp(rgb[1] * f, 0, 255), clamp(rgb[2] * f, 0, 255)];
  }

  /* ------------------------------------------------------- photo-style extras */

  /* Darkens the edges of the image (vignette). strength 0..1 */
  function vignette(img, strength) {
    var w = img.width, h = img.height, d = img.data;
    var s = strength == null ? 0.6 : clamp(strength, 0, 1);
    var cx = (w - 1) / 2, cy = (h - 1) / 2;
    var maxD = Math.sqrt(cx * cx + cy * cy) || 1;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4;
        if (d[i + 3] === 0) continue;
        var dx = x - cx, dy = y - cy;
        var t = Math.sqrt(dx * dx + dy * dy) / maxD;
        var f = 1 - s * t * t;
        d[i] *= f; d[i + 1] *= f; d[i + 2] *= f;
      }
    }
    return img;
  }

  /* Diagonal stripes overlay. period in pixels, alpha 0..1 */
  function stripes(img, period, alpha, light) {
    var w = img.width, h = img.height, d = img.data;
    var per = Math.max(2, period | 0);
    var a = alpha == null ? 0.18 : clamp(alpha, 0, 1);
    var base = light === false ? 0 : 255;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4;
        if (d[i + 3] === 0) continue;
        if (Math.floor((x + y) / per) % 2 !== 0) continue;
        d[i] = d[i] * (1 - a) + base * a;
        d[i + 1] = d[i + 1] * (1 - a) + base * a;
        d[i + 2] = d[i + 2] * (1 - a) + base * a;
      }
    }
    return img;
  }

  /* Makes every pixel close to `target` transparent (background removal). */
  function chromaKey(img, target, tolerance) {
    var d = img.data, tol = tolerance == null ? 24 : tolerance;
    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      if (Math.abs(d[i] - target[0]) <= tol &&
          Math.abs(d[i + 1] - target[1]) <= tol &&
          Math.abs(d[i + 2] - target[2]) <= tol) {
        d[i + 3] = 0;
      }
    }
    return img;
  }

  /* --------------------------------------------------------- photo utilities */

  /* Unsharp mask: sharpens edges. amount 0..100 */
  function sharpen(img, amount) {
    var w = img.width, h = img.height;
    var src = clone(img), s = src.data, d = img.data;
    var a = clamp((amount == null ? 40 : amount) / 100, 0, 1.5);
    var k = [0, -a, 0, -a, 1 + 4 * a, -a, 0, -a, 0];
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4;
        if (s[i + 3] === 0) continue;
        var acc = [0, 0, 0];
        for (var oy = -1; oy <= 1; oy++) {
          for (var ox = -1; ox <= 1; ox++) {
            var nx = clamp(x + ox, 0, w - 1), ny = clamp(y + oy, 0, h - 1);
            var wgt = k[(oy + 1) * 3 + (ox + 1)];
            var j = (ny * w + nx) * 4;
            acc[0] += s[j] * wgt; acc[1] += s[j + 1] * wgt; acc[2] += s[j + 2] * wgt;
          }
        }
        d[i] = clamp(acc[0], 0, 255);
        d[i + 1] = clamp(acc[1], 0, 255);
        d[i + 2] = clamp(acc[2], 0, 255);
      }
    }
    return img;
  }

  /* Warm brown monochrome. */
  function sepia(img) {
    var d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      var r = d[i], g = d[i + 1], b = d[i + 2];
      d[i] = clamp(0.393 * r + 0.769 * g + 0.189 * b, 0, 255);
      d[i + 1] = clamp(0.349 * r + 0.686 * g + 0.168 * b, 0, 255);
      d[i + 2] = clamp(0.272 * r + 0.534 * g + 0.131 * b, 0, 255);
    }
    return img;
  }

  /* Most common colours, ignoring near-transparent pixels. Returns hex list. */
  function dominantColors(img, count) {
    var d = img.data, n = count || 8;
    var buckets = {};
    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 32) continue;
      var key = (d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4);
      if (!buckets[key]) buckets[key] = { n: 0, r: 0, g: 0, b: 0 };
      var b = buckets[key];
      b.n++; b.r += d[i]; b.g += d[i + 1]; b.b += d[i + 2];
    }
    return Object.keys(buckets)
      .map(function (k) {
        var b = buckets[k];
        return { hex: rgbToHex(b.r / b.n, b.g / b.n, b.b / b.n), n: b.n };
      })
      .sort(function (a, b) { return b.n - a.n; })
      .slice(0, n)
      .map(function (o) { return o.hex; });
  }

  /* Guesses the background colour from the four corners, then keys it out. */
  function autoKey(img, tolerance) {
    var w = img.width, h = img.height;
    var corners = [
      getPixel(img, 0, 0), getPixel(img, w - 1, 0),
      getPixel(img, 0, h - 1), getPixel(img, w - 1, h - 1)
    ].filter(function (c) { return c[3] > 0; });
    if (!corners.length) return img;
    var avg = [0, 0, 0];
    corners.forEach(function (c) { avg[0] += c[0]; avg[1] += c[1]; avg[2] += c[2]; });
    avg = avg.map(function (v) { return v / corners.length; });
    return chromaKey(img, avg, tolerance == null ? 28 : tolerance);
  }

  /* Nearest-neighbour resample of an ImageData-like object. */
  function resample(img, nw, nh) {
    var out = blank(nw, nh);
    for (var y = 0; y < nh; y++) {
      var sy = Math.min(img.height - 1, Math.floor(y * img.height / nh));
      for (var x = 0; x < nw; x++) {
        var sx = Math.min(img.width - 1, Math.floor(x * img.width / nw));
        var si = (sy * img.width + sx) * 4, di = (y * nw + x) * 4;
        out.data[di] = img.data[si];
        out.data[di + 1] = img.data[si + 1];
        out.data[di + 2] = img.data[si + 2];
        out.data[di + 3] = img.data[si + 3];
      }
    }
    return out;
  }

  var api = {
    clamp: clamp,
    extrude: extrude,
    perspective: perspective,
    vignette: vignette,
    sharpen: sharpen,
    sepia: sepia,
    dominantColors: dominantColors,
    autoKey: autoKey,
    resample: resample,
    stripes: stripes,
    chromaKey: chromaKey,
    shade: shade,
    hexToRgb: hexToRgb,
    rgbToHex: rgbToHex,
    parseColor: parseColor,
    luminance: luminance,
    rgbToHsv: rgbToHsv,
    hsvToRgb: hsvToRgb,
    PALETTES: PALETTES,
    paletteToRgb: paletteToRgb,
    nearestColor: nearestColor,
    clone: clone,
    blank: blank,
    getPixel: getPixel,
    setPixel: setPixel,
    brightness: brightness,
    contrast: contrast,
    saturation: saturation,
    hueRotate: hueRotate,
    invert: invert,
    grayscale: grayscale,
    posterize: posterize,
    threshold: threshold,
    noise: noise,
    blur: blur,
    outline: outline,
    dropShadow: dropShadow,
    quantize: quantize,
    ditherFloydSteinberg: ditherFloydSteinberg,
    ditherBayer: ditherBayer,
    floodFill: floodFill,
    replaceColor: replaceColor,
    mulberry32: mulberry32
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PSCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
