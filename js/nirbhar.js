/* Pixel Studio Edit — Nirbhar engine.
 *
 * "Nirbhar" (निर्भर → self-reliant) is the offline toolkit: every routine in this
 * file runs on your own device, uses no network, no model download, no API key
 * and no third-party library. Each function is pure maths over pixel buffers, so
 * the whole module also runs in Node for the test suite.
 *
 * Image buffers are ImageData-shaped: { width, height, data: Uint8ClampedArray }.
 * Nothing here touches the DOM.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PSNirbhar = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  /* ------------------------------------------------------------------ basics */

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { return t * t * (3 - 2 * t); }

  function hexToRgb(hex) {
    var h = String(hex || '#000000').trim().replace(/^#/, '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    if (!isFinite(n)) n = 0;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function rgbToHex(r, g, b) {
    var t = function (v) {
      var s = clamp(Math.round(v), 0, 255).toString(16);
      return s.length === 1 ? '0' + s : s;
    };
    return '#' + t(r) + t(g) + t(b);
  }

  function luminance(r, g, b) { return 0.2126 * r + 0.7152 * g + 0.0722 * b; }

  function rgbToHsv(r, g, b) {
    var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, h = 0;
    if (d) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return [h, max ? d / max : 0, max / 255];
  }

  function hsvToRgb(h, s, v) {
    h = ((h % 360) + 360) % 360;
    var c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
    var r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
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

  function hashString(str) {
    var h = 2166136261 >>> 0;
    str = String(str || '');
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function blank(w, h) {
    return { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) };
  }

  function clone(img) {
    return { width: img.width, height: img.height, data: new Uint8ClampedArray(img.data) };
  }

  function getPixel(img, x, y) {
    var i = (y * img.width + x) * 4;
    return [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]];
  }

  function setPixel(img, x, y, rgba) {
    var i = (y * img.width + x) * 4;
    img.data[i] = rgba[0]; img.data[i + 1] = rgba[1];
    img.data[i + 2] = rgba[2]; img.data[i + 3] = rgba.length > 3 ? rgba[3] : 255;
  }

  /* Bilinear sample with edge clamp — used by rotation, warps and effects. */
  function sample(img, x, y, out) {
    var w = img.width, h = img.height, d = img.data;
    x = clamp(x, 0, w - 1); y = clamp(y, 0, h - 1);
    var x0 = Math.floor(x), y0 = Math.floor(y);
    var x1 = Math.min(w - 1, x0 + 1), y1 = Math.min(h - 1, y0 + 1);
    var fx = x - x0, fy = y - y0;
    for (var c = 0; c < 4; c++) {
      var a = d[(y0 * w + x0) * 4 + c], b = d[(y0 * w + x1) * 4 + c];
      var cc = d[(y1 * w + x0) * 4 + c], dd = d[(y1 * w + x1) * 4 + c];
      out[c] = (a * (1 - fx) + b * fx) * (1 - fy) + (cc * (1 - fx) + dd * fx) * fy;
    }
    return out;
  }

  /* ------------------------------------------------------- 1. Nirbhar Cut
   * Background removal without a model: a colour-aware flood fill from the
   * frame edge (or a chosen key colour), then an alpha feather and a despill
   * pass so the subject keeps clean edges instead of a coloured halo.
   */
  function cutout(img, opts) {
    opts = opts || {};
    var mode = opts.mode || 'auto';           // auto | corners | color | white
    var tolerance = opts.tolerance == null ? 26 : opts.tolerance;
    var feather = opts.feather == null ? 1 : opts.feather;
    var despill = opts.despill !== false;
    var w = img.width, h = img.height, d = img.data;
    var out = clone(img);
    var n = w * h;
    var alpha = new Uint8Array(n);
    for (var i = 0; i < n; i++) alpha[i] = d[i * 4 + 3];

    /* The maximum RGB distance is sqrt(3)*255 ≈ 441; map 0..100 onto it. */
    var thr = Math.pow((tolerance / 100) * 441, 2);
    var key = hexToRgb(opts.color || '#ffffff');
    var visited = new Uint8Array(n);
    var queue = new Int32Array(n);
    var qh = 0, qt = 0;

    function dist2(idx, r, g, b) {
      var j = idx * 4;
      var dr = d[j] - r, dg = d[j + 1] - g, db = d[j + 2] - b;
      return dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11;
    }

    function push(idx) {
      if (idx < 0 || idx >= n || visited[idx]) return;
      visited[idx] = 1;
      queue[qt++] = idx;
    }

    if (mode === 'color' || mode === 'white') {
      if (mode === 'white') key = [255, 255, 255];
      for (var p = 0; p < n; p++) {
        if (dist2(p, key[0], key[1], key[2]) <= thr) push(p);
      }
    } else {
      /* corners: average the four corner patches, then flood from the border */
      var patch = Math.max(1, Math.round(Math.min(w, h) * 0.02));
      var sr = 0, sg = 0, sb = 0, cnt = 0;
      var corners = [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]];
      corners.forEach(function (c) {
        for (var y = 0; y < patch; y++) {
          for (var x = 0; x < patch; x++) {
            var px = clamp(c[0] + (c[0] ? -x : x), 0, w - 1);
            var py = clamp(c[1] + (c[1] ? -y : y), 0, h - 1);
            var j = (py * w + px) * 4;
            sr += d[j]; sg += d[j + 1]; sb += d[j + 2]; cnt++;
          }
        }
      });
      if (cnt) { key = [sr / cnt, sg / cnt, sb / cnt]; }
      for (var x2 = 0; x2 < w; x2++) { push(x2); push((h - 1) * w + x2); }
      for (var y2 = 0; y2 < h; y2++) { push(y2 * w); push(y2 * w + w - 1); }
    }

    /* flood fill: a pixel joins the background when it is close to the key
       colour *and* close to the neighbour that reached it, so a gradient sky
       is removed while a same-coloured detail inside the subject is kept */
    while (qh < qt) {
      var idx = queue[qh++];
      var ix = idx % w, iy = (idx - ix) / w;
      var jj = idx * 4;
      alpha[idx] = 0;
      var r0 = d[jj], g0 = d[jj + 1], b0 = d[jj + 2];
      var nb = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (var k = 0; k < 4; k++) {
        var nx = ix + nb[k][0], ny = iy + nb[k][1];
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        var ni = ny * w + nx;
        if (visited[ni]) continue;
        var nj = ni * 4;
        var dk = dist2(ni, key[0], key[1], key[2]);
        if (dk > thr) continue;
        var dn = dist2(ni, r0, g0, b0);
        if (dn > Math.max(thr, 900)) continue;
        push(ni);
      }
    }

    /* soft alpha: one box-blur pass over the mask keeps hair and edges calm */
    if (feather > 0) {
      var r = Math.max(1, Math.round(feather));
      var tmp = new Float32Array(n), res = new Float32Array(n);
      for (var a1 = 0; a1 < n; a1++) tmp[a1] = alpha[a1];
      var span = r * 2 + 1;
      for (var yy = 0; yy < h; yy++) {
        var acc = 0;
        for (var xx = -r; xx <= r; xx++) acc += tmp[yy * w + clamp(xx, 0, w - 1)];
        for (var xx2 = 0; xx2 < w; xx2++) {
          res[yy * w + xx2] = acc / span;
          acc += tmp[yy * w + clamp(xx2 + r + 1, 0, w - 1)];
          acc -= tmp[yy * w + clamp(xx2 - r, 0, w - 1)];
        }
      }
      for (var xx3 = 0; xx3 < w; xx3++) {
        var acc2 = 0;
        for (var yy2 = -r; yy2 <= r; yy2++) acc2 += res[clamp(yy2, 0, h - 1) * w + xx3];
        for (var yy3 = 0; yy3 < h; yy3++) {
          alpha[yy3 * w + xx3] = acc2 / span;
          acc2 += res[clamp(yy3 + r + 1, 0, h - 1) * w + xx3];
          acc2 -= res[clamp(yy3 - r, 0, h - 1) * w + xx3];
        }
      }
    }

    var removed = 0;
    for (var q = 0; q < n; q++) {
      var qi = q * 4;
      var a = clamp(alpha[q], 0, 255);
      out.data[qi + 3] = a;
      if (a < 128) removed++;
      /* despill: un-mix the key colour from semi-transparent edge pixels */
      if (despill && a > 0 && a < 250) {
        var f = a / 255;
        for (var c = 0; c < 3; c++) {
          var v = (out.data[qi + c] - key[c] * (1 - f)) / Math.max(0.08, f);
          out.data[qi + c] = clamp(v, 0, 255);
        }
      }
    }
    return { img: out, removed: removed / n, key: rgbToHex(key[0], key[1], key[2]) };
  }

  /* ----------------------------------------------------- 2. Nirbhar Clear
   * Photo quality analysis and correction, in the order a retoucher would use:
   * white balance → tonal stretch → local contrast → denoise → sharpen.
   */

  function stats(img) {
    var d = img.data, n = img.width * img.height;
    var sum = 0, sum2 = 0, chroma = 0;
    var histR = new Uint32Array(256), histG = new Uint32Array(256), histB = new Uint32Array(256);
    var sr = 0, sg = 0, sb = 0, count = 0;
    for (var i = 0; i < n; i++) {
      var j = i * 4;
      if (d[j + 3] < 8) continue;
      var r = d[j], g = d[j + 1], b = d[j + 2];
      var l = luminance(r, g, b);
      sum += l; sum2 += l * l;
      chroma += Math.max(r, g, b) - Math.min(r, g, b);
      histR[r]++; histG[g]++; histB[b]++;
      sr += r; sg += g; sb += b; count++;
    }
    if (!count) return { mean: 0, contrast: 0, colorfulness: 0, sharpness: 0, wb: [1, 1, 1], hist: [histR, histG, histB] };
    var mean = sum / count;
    var varr = Math.max(0, sum2 / count - mean * mean);
    return {
      mean: mean,
      contrast: Math.sqrt(varr),
      colorfulness: chroma / count,
      sharpness: sharpnessOf(img),
      wb: [sr / count, sg / count, sb / count],
      hist: [histR, histG, histB]
    };
  }

  /* Mean absolute Laplacian on luminance — a cheap "is this blurry?" score. */
  function sharpnessOf(img) {
    var w = img.width, h = img.height, d = img.data;
    var total = 0, count = 0;
    for (var y = 1; y < h - 1; y++) {
      for (var x = 1; x < w - 1; x++) {
        var i = (y * w + x) * 4;
        var c = luminance(d[i], d[i + 1], d[i + 2]);
        var l = luminance(d[i - 4], d[i - 3], d[i - 2]);
        var r = luminance(d[i + 4], d[i + 5], d[i + 6]);
        var u = luminance(d[i - w * 4], d[i - w * 4 + 1], d[i - w * 4 + 2]);
        var dn = luminance(d[i + w * 4], d[i + w * 4 + 1], d[i + w * 4 + 2]);
        total += Math.abs(4 * c - l - r - u - dn);
        count++;
      }
    }
    return count ? total / count : 0;
  }

  /* Grey-world white balance: scale each channel toward the average, then put
     the luminance back where it was so the photo does not get brighter. */
  function whiteBalance(img, strength) {
    strength = strength == null ? 1 : clamp(strength, 0, 1);
    var st = stats(img);
    if (!st.wb) return img;
    var avg = (st.wb[0] + st.wb[1] + st.wb[2]) / 3;
    if (avg <= 0) return img;
    var gain = st.wb.map(function (v) { return 1 + ((avg / Math.max(1, v)) - 1) * strength; });
    var d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      d[i] = clamp(d[i] * gain[0], 0, 255);
      d[i + 1] = clamp(d[i + 1] * gain[1], 0, 255);
      d[i + 2] = clamp(d[i + 2] * gain[2], 0, 255);
    }
    return img;
  }

  /* Per-channel histogram stretch with a clip percentage at both ends. */
  function autoLevels(img, clipPct) {
    clipPct = clipPct == null ? 0.4 : clipPct;
    var d = img.data, n = img.width * img.height;
    var hists = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
    var count = 0;
    for (var i = 0; i < n; i++) {
      var j = i * 4;
      if (d[j + 3] < 8) continue;
      hists[0][d[j]]++; hists[1][d[j + 1]]++; hists[2][d[j + 2]]++;
      count++;
    }
    if (!count) return img;
    var cut = Math.max(1, Math.round(count * (clipPct / 100)));
    var lo = [], hi = [];
    for (var c = 0; c < 3; c++) {
      var acc = 0, l = 0, h2 = 255;
      for (var v = 0; v < 256; v++) { acc += hists[c][v]; if (acc > cut) { l = v; break; } }
      acc = 0;
      for (var v2 = 255; v2 >= 0; v2--) { acc += hists[c][v2]; if (acc > cut) { h2 = v2; break; } }
      lo.push(l); hi.push(h2 > l ? h2 : l + 1);
    }
    for (var p = 0; p < n; p++) {
      var q = p * 4;
      for (var c2 = 0; c2 < 3; c2++) {
        d[q + c2] = clamp((d[q + c2] - lo[c2]) * 255 / (hi[c2] - lo[c2]), 0, 255);
      }
    }
    return img;
  }

  /* Edge-preserving 3×3 bilateral filter. strength 0..100. */
  function denoise(img, strength) {
    var s = clamp(strength == null ? 30 : strength, 0, 100) / 100;
    if (s <= 0) return img;
    var w = img.width, h = img.height, src = new Uint8ClampedArray(img.data), d = img.data;
    var sigmaColor = 8 + s * 55;
    var inv = 1 / (2 * sigmaColor * sigmaColor);
    var space = [1, 0.7, 0.45];
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4;
        var r0 = src[i], g0 = src[i + 1], b0 = src[i + 2];
        var wr = 0, wg = 0, wb = 0, wsum = 0;
        for (var dy = -1; dy <= 1; dy++) {
          var ny = y + dy;
          if (ny < 0 || ny >= h) continue;
          for (var dx = -1; dx <= 1; dx++) {
            var nx = x + dx;
            if (nx < 0 || nx >= w) continue;
            var k = (ny * w + nx) * 4;
            var dr = src[k] - r0, dg = src[k + 1] - g0, db = src[k + 2] - b0;
            var dist2 = dr * dr + dg * dg + db * db;
            var wt = space[Math.abs(dx)] * space[Math.abs(dy)] * Math.exp(-dist2 * inv);
            wr += src[k] * wt; wg += src[k + 1] * wt; wb += src[k + 2] * wt;
            wsum += wt;
          }
        }
        if (wsum > 0) {
          d[i] = clamp(r0 + (wr / wsum - r0) * s, 0, 255);
          d[i + 1] = clamp(g0 + (wg / wsum - g0) * s, 0, 255);
          d[i + 2] = clamp(b0 + (wb / wsum - b0) * s, 0, 255);
        }
      }
    }
    return img;
  }

  function boxBlurAlpha(src, w, h, radius) {
    var out = new Float32Array(src.length);
    var tmp = new Float32Array(src.length);
    var span = radius * 2 + 1;
    for (var y = 0; y < h; y++) {
      var acc = 0;
      for (var x = -radius; x <= radius; x++) acc += src[y * w + clamp(x, 0, w - 1)];
      for (var x2 = 0; x2 < w; x2++) {
        tmp[y * w + x2] = acc / span;
        acc += src[y * w + clamp(x2 + radius + 1, 0, w - 1)];
        acc -= src[y * w + clamp(x2 - radius, 0, w - 1)];
      }
    }
    for (var x3 = 0; x3 < w; x3++) {
      var acc2 = 0;
      for (var y2 = -radius; y2 <= radius; y2++) acc2 += tmp[clamp(y2, 0, h - 1) * w + x3];
      for (var y3 = 0; y3 < h; y3++) {
        out[y3 * w + x3] = acc2 / span;
        acc2 += tmp[clamp(y3 + radius + 1, 0, h - 1) * w + x3];
        acc2 -= tmp[clamp(y3 - radius, 0, h - 1) * w + x3];
      }
    }
    return out;
  }

  /* Unsharp mask on luminance only, so colour fringes never appear. */
  function unsharp(img, amount, radius) {
    amount = clamp(amount == null ? 60 : amount, 0, 300) / 100;
    radius = Math.max(1, Math.round(radius == null ? 1 : radius));
    if (amount <= 0) return img;
    var w = img.width, h = img.height, d = img.data;
    var lum = new Float32Array(w * h);
    for (var i = 0; i < w * h; i++) lum[i] = luminance(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]);
    var blurred = boxBlurAlpha(lum, w, h, radius);
    for (var p = 0; p < w * h; p++) {
      var diff = (lum[p] - blurred[p]) * amount;
      var j = p * 4;
      d[j] = clamp(d[j] + diff, 0, 255);
      d[j + 1] = clamp(d[j + 1] + diff, 0, 255);
      d[j + 2] = clamp(d[j + 2] + diff, 0, 255);
    }
    return img;
  }

  /* Clarity: big-radius local contrast, masked to the midtones. */
  function clarity(img, amount) {
    amount = clamp(amount == null ? 35 : amount, 0, 200) / 100;
    if (amount <= 0) return img;
    var w = img.width, h = img.height, d = img.data;
    var radius = Math.max(2, Math.round(Math.min(w, h) / 40));
    var lum = new Float32Array(w * h);
    for (var i = 0; i < w * h; i++) lum[i] = luminance(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]);
    var blurred = boxBlurAlpha(lum, w, h, radius);
    for (var p = 0; p < w * h; p++) {
      var mid = 1 - Math.abs(lum[p] / 255 - 0.5) * 1.4;
      var diff = (lum[p] - blurred[p]) * amount * clamp(mid, 0, 1);
      var j = p * 4;
      d[j] = clamp(d[j] + diff, 0, 255);
      d[j + 1] = clamp(d[j + 1] + diff, 0, 255);
      d[j + 2] = clamp(d[j + 2] + diff, 0, 255);
    }
    return img;
  }

  /* Dehaze: lift the black point and add saturation — the honest, model-free
     version of what "dehaze" sliders do. */
  function dehaze(img, amount) {
    var a = clamp(amount == null ? 40 : amount, 0, 100) / 100;
    if (a <= 0) return img;
    var st = stats(img);
    var floor = Math.min(120, st.mean * 0.55 + 12);
    var d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      var r = d[i], g = d[i + 1], b = d[i + 2];
      r = clamp((r - floor) * 255 / Math.max(1, 255 - floor), 0, 255);
      g = clamp((g - floor) * 255 / Math.max(1, 255 - floor), 0, 255);
      b = clamp((b - floor) * 255 / Math.max(1, 255 - floor), 0, 255);
      var l = luminance(r, g, b);
      d[i] = clamp(l + (r - l) * (1 + a * 0.45), 0, 255);
      d[i + 1] = clamp(l + (g - l) * (1 + a * 0.45), 0, 255);
      d[i + 2] = clamp(l + (b - l) * (1 + a * 0.45), 0, 255);
    }
    return img;
  }

  /* One-call photo fix. Every step is optional; autoEnhance() picks them. */
  function enhance(img, o) {
    o = o || {};
    var out = clone(img);
    if (o.whiteBalance) whiteBalance(out, o.wbStrength == null ? 0.8 : o.wbStrength);
    if (o.levels) autoLevels(out, o.clip == null ? 0.4 : o.clip);
    if (o.denoise) denoise(out, o.denoise);
    if (o.dehaze) dehaze(out, o.dehaze);
    if (o.clarity) clarity(out, o.clarity);
    if (o.sharpen) unsharp(out, o.sharpen, o.sharpenRadius == null ? 1 : o.sharpenRadius);
    return out;
  }

  /* Reads the photo and chooses a recipe — no sliders required. */
  function autoEnhance(img) {
    var st = stats(img);
    var blurry = st.sharpness < 6;
    var flat = st.contrast < 45;
    var recipe = {
      whiteBalance: st.colorfulness > 6,
      wbStrength: 0.75,
      levels: flat || st.mean < 90 || st.mean > 175,
      clip: 0.4,
      denoise: st.sharpness < 3 ? 45 : 0,
      dehaze: st.contrast < 32 ? 35 : 0,
      clarity: 25,
      sharpen: blurry ? 85 : 35,
      sharpenRadius: 1
    };
    return { img: enhance(img, recipe), recipe: recipe, stats: st };
  }

  /* ------------------------------------------------------ 3. Nirbhar Zoom
   * Upscaling with four honest kernels. "eagle"/"epx" are edge-aware 2×
   * algorithms that keep pixel-art corners crisp; lanczos is for photos.
   */

  function sinc(x) {
    if (x === 0) return 1;
    var px = Math.PI * x;
    return Math.sin(px) / px;
  }

  function weightFn(kernel, t) {
    t = Math.abs(t);
    if (kernel === 'nearest') return t < 0.5 ? 1 : 0;
    if (kernel === 'bilinear') return t < 1 ? 1 - t : 0;
    if (kernel === 'bicubic') {
      var a = -0.5;
      if (t < 1) return (a + 2) * t * t * t - (a + 3) * t * t + 1;
      if (t < 2) return a * t * t * t - 5 * a * t * t + 8 * a * t - 4 * a;
      return 0;
    }
    if (t < 3) return sinc(t) * sinc(t / 3);   // lanczos3
    return 0;
  }

  function resizeKernel(img, nw, nh, kernel) {
    kernel = kernel || 'lanczos3';
    var sw = img.width, sh = img.height;
    if (kernel === 'nearest') {
      var outN = blank(nw, nh);
      for (var y = 0; y < nh; y++) {
        var sy = Math.min(sh - 1, Math.floor(y * sh / nh));
        for (var x = 0; x < nw; x++) {
          var sx = Math.min(sw - 1, Math.floor(x * sw / nw));
          var si = (sy * sw + sx) * 4, di = (y * nw + x) * 4;
          outN.data[di] = img.data[si];
          outN.data[di + 1] = img.data[si + 1];
          outN.data[di + 2] = img.data[si + 2];
          outN.data[di + 3] = img.data[si + 3];
        }
      }
      return outN;
    }
    var support = kernel === 'bicubic' ? 2 : kernel === 'bilinear' ? 1 : 3;
    var tmp = new Float32Array(nw * sh * 4);
    var xRatio = sw / nw, yRatio = sh / nh;

    for (var ty = 0; ty < sh; ty++) {
      for (var tx = 0; tx < nw; tx++) {
        var cx = (tx + 0.5) * xRatio - 0.5;
        var x0 = Math.ceil(cx - support), x1 = Math.floor(cx + support);
        var sum = [0, 0, 0, 0], wsum = 0;
        for (var ix = x0; ix <= x1; ix++) {
          var wt = weightFn(kernel, (ix - cx) / 1);
          if (!wt) continue;
          var px = clamp(ix, 0, sw - 1) * 4 + ty * sw * 4;
          sum[0] += img.data[px] * wt; sum[1] += img.data[px + 1] * wt;
          sum[2] += img.data[px + 2] * wt; sum[3] += img.data[px + 3] * wt;
          wsum += wt;
        }
        var o = (ty * nw + tx) * 4;
        if (wsum) for (var c = 0; c < 4; c++) tmp[o + c] = sum[c] / wsum;
      }
    }
    var out = blank(nw, nh);
    for (var oy = 0; oy < nh; oy++) {
      var cy = (oy + 0.5) * yRatio - 0.5;
      var yy0 = Math.ceil(cy - support), yy1 = Math.floor(cy + support);
      for (var ox = 0; ox < nw; ox++) {
        var sum2 = [0, 0, 0, 0], wsum2 = 0;
        for (var iy = yy0; iy <= yy1; iy++) {
          var wt2 = weightFn(kernel, iy - cy);
          if (!wt2) continue;
          var py = (clamp(iy, 0, sh - 1) * nw + ox) * 4;
          sum2[0] += tmp[py] * wt2; sum2[1] += tmp[py + 1] * wt2;
          sum2[2] += tmp[py + 2] * wt2; sum2[3] += tmp[py + 3] * wt2;
          wsum2 += wt2;
        }
        var oi = (oy * nw + ox) * 4;
        for (var c2 = 0; c2 < 4; c2++) {
          out.data[oi + c2] = clamp(wsum2 ? sum2[c2] / wsum2 : 0, 0, 255);
        }
      }
    }
    return out;
  }

  function dist2(a, b) {
    var dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2];
    return dr * dr + dg * dg + db * db;
  }

  /* EPX / Scale2x: for each pixel, compare the four diagonal neighbours and
     fill a 2×2 block — keeps diagonal pixel-art lines from turning to mush. */
  function epx2(img) {
    var w = img.width, h = img.height, out = blank(w * 2, h * 2);
    var px = function (x, y) {
      x = clamp(x, 0, w - 1); y = clamp(y, 0, h - 1);
      var i = (y * w + x) * 4;
      return [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]];
    };
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var P = px(x, y), A = px(x, y - 1), B = px(x + 1, y), C = px(x - 1, y), D = px(x, y + 1);
        var e0 = P, e1 = P, e2 = P, e3 = P;
        if (dist2(C, A) > dist2(A, B) && dist2(C, D) > dist2(D, B)) e1 = C;
        if (dist2(A, B) > dist2(A, C) && dist2(A, D) > dist2(D, C)) e0 = B;
        if (dist2(D, C) > dist2(D, B) && dist2(D, A) > dist2(A, B)) e3 = C;
        if (dist2(B, D) > dist2(B, A) && dist2(B, C) > dist2(C, A)) e2 = D;
        setPixel(out, x * 2, y * 2, e0);
        setPixel(out, x * 2 + 1, y * 2, e1);
        setPixel(out, x * 2, y * 2 + 1, e3);
        setPixel(out, x * 2 + 1, y * 2 + 1, e2);
      }
    }
    return out;
  }

  function upscale(img, factor, kernel) {
    factor = Math.max(1, Math.round(factor || 2));
    if (kernel === 'epx' || kernel === 'eagle') {
      var out = clone(img);
      var f = 1;
      while (f < factor) { out = epx2(out); f *= 2; }
      if (f > factor) out = resizeKernel(out, img.width * factor, img.height * factor, 'bicubic');
      return out;
    }
    return resizeKernel(img, img.width * factor, img.height * factor, kernel || 'lanczos3');
  }

  /* ------------------------------------------------------- 4. Nirbhar Tone
   * Print-style and graphic treatments: halftone, duotone, gradient map,
   * pencil sketch, colour-blindness preview.
   */

  function halftone(img, opts) {
    opts = opts || {};
    var cell = Math.max(2, Math.round(opts.cell || 6));
    var angle = (opts.angle == null ? 45 : opts.angle) * Math.PI / 180;
    var mono = opts.mono !== false;
    var ink = hexToRgb(opts.ink || '#111111');
    var paper = hexToRgb(opts.paper || '#ffffff');
    var w = img.width, h = img.height;
    var out = blank(w, h);
    var src = img.data;
    var ca = Math.cos(angle), sa = Math.sin(angle);
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        /* rotate into screen space, find the nearest cell centre, then draw a
           disc whose radius follows the local darkness */
        var rx = x * ca + y * sa, ry = -x * sa + y * ca;
        var cxr = Math.round(rx / cell) * cell, cyr = Math.round(ry / cell) * cell;
        var cx = cxr * ca - cyr * sa, cy = cxr * sa + cyr * ca;
        var si = (clamp(Math.round(cy), 0, h - 1) * w + clamp(Math.round(cx), 0, w - 1)) * 4;
        var dark = 1 - luminance(src[si], src[si + 1], src[si + 2]) / 255;
        var d = Math.sqrt((rx - cxr) * (rx - cxr) + (ry - cyr) * (ry - cyr));
        var radius = Math.sqrt(dark) * cell * 0.62;
        var inside = d <= radius;
        var oi = (y * w + x) * 4;
        if (mono) {
          var c = inside ? ink : paper;
          out.data[oi] = c[0]; out.data[oi + 1] = c[1]; out.data[oi + 2] = c[2];
        } else {
          var t = inside ? 1 : 0;
          out.data[oi] = inside ? src[si] : 255;
          out.data[oi + 1] = inside ? src[si + 1] : 255;
          out.data[oi + 2] = inside ? src[si + 2] : 255;
          if (!t) { out.data[oi] = 255; }
        }
        out.data[oi + 3] = 255;
      }
    }
    return out;
  }

  function duotone(img, darkHex, lightHex) {
    var a = hexToRgb(darkHex || '#1b2a4a'), b = hexToRgb(lightHex || '#ffd27f');
    var out = clone(img), d = out.data;
    for (var i = 0; i < d.length; i += 4) {
      var t = luminance(d[i], d[i + 1], d[i + 2]) / 255;
      d[i] = lerp(a[0], b[0], t);
      d[i + 1] = lerp(a[1], b[1], t);
      d[i + 2] = lerp(a[2], b[2], t);
    }
    return out;
  }

  /* Gradient map: stops = [{t:0..1, color:'#hex'}, ...] */
  function gradientMap(img, stops) {
    stops = (stops || []).slice().sort(function (p, q) { return p.t - q.t; });
    if (!stops.length) return clone(img);
    var out = clone(img), d = out.data;
    var lut = new Uint8ClampedArray(256 * 3);
    for (var v = 0; v < 256; v++) {
      var t = v / 255;
      var i0 = 0;
      while (i0 < stops.length - 1 && stops[i0 + 1].t < t) i0++;
      var s0 = stops[i0], s1 = stops[Math.min(stops.length - 1, i0 + 1)];
      var span = Math.max(1e-6, s1.t - s0.t);
      var f = clamp((t - s0.t) / span, 0, 1);
      var c0 = hexToRgb(s0.color), c1 = hexToRgb(s1.color);
      lut[v * 3] = lerp(c0[0], c1[0], f);
      lut[v * 3 + 1] = lerp(c0[1], c1[1], f);
      lut[v * 3 + 2] = lerp(c0[2], c1[2], f);
    }
    for (var i = 0; i < d.length; i += 4) {
      var l = clamp(Math.round(luminance(d[i], d[i + 1], d[i + 2])), 0, 255);
      d[i] = lut[l * 3]; d[i + 1] = lut[l * 3 + 1]; d[i + 2] = lut[l * 3 + 2];
    }
    return out;
  }

  /* Sobel edges over a blurred luminance — a pencil outline, no model. */
  function sketch(img, opts) {
    opts = opts || {};
    var strength = clamp(opts.strength == null ? 1 : opts.strength, 0, 3);
    var w = img.width, h = img.height, d = img.data;
    var lum = new Float32Array(w * h);
    for (var i = 0; i < w * h; i++) lum[i] = luminance(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]);
    var sm = boxBlurAlpha(lum, w, h, 1);
    var out = blank(w, h);
    var paper = hexToRgb(opts.paper || '#fdfaf3');
    var ink = hexToRgb(opts.ink || '#1d1d22');
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var p = y * w + x;
        var gx = 0, gy = 0;
        for (var dy = -1; dy <= 1; dy++) {
          for (var dx = -1; dx <= 1; dx++) {
            var nx = clamp(x + dx, 0, w - 1), ny = clamp(y + dy, 0, h - 1);
            var v = sm[ny * w + nx];
            gx += v * dx; gy += v * dy;
          }
        }
        var mag = Math.min(255, Math.sqrt(gx * gx + gy * gy) * strength * 0.5);
        var t = 1 - mag / 255;                      /* 1 = paper, 0 = ink */
        var oi = p * 4;
        out.data[oi] = lerp(ink[0], paper[0], t);
        out.data[oi + 1] = lerp(ink[1], paper[1], t);
        out.data[oi + 2] = lerp(ink[2], paper[2], t);
        out.data[oi + 3] = 255;
      }
    }
    return out;
  }

  /* Brettel-style colour-vision simulation, so a palette can be checked for
     accessibility before it ships. */
  var CVD = {
    protanopia: [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]],
    deuteranopia: [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]],
    tritanopia: [[0.95, 0.05, 0], [0, 0.433, 0.567], [0, 0.475, 0.525]],
    achromatopsia: [[0.299, 0.587, 0.114], [0.299, 0.587, 0.114], [0.299, 0.587, 0.114]]
  };

  function colorBlind(img, type) {
    var m = CVD[type] || CVD.deuteranopia;
    var out = clone(img), d = out.data;
    for (var i = 0; i < d.length; i += 4) {
      var r = d[i], g = d[i + 1], b = d[i + 2];
      d[i] = clamp(m[0][0] * r + m[0][1] * g + m[0][2] * b, 0, 255);
      d[i + 1] = clamp(m[1][0] * r + m[1][1] * g + m[1][2] * b, 0, 255);
      d[i + 2] = clamp(m[2][0] * r + m[2][1] * g + m[2][2] * b, 0, 255);
    }
    return out;
  }

  /* ------------------------------------------------------- 5. Nirbhar Tile
   * Turn any image into a seamless, tileable texture: roll by half, then
   * cross-fade each seam with its own mirrored edge.
   */

  function makeSeamless(img, band) {
    var w = img.width, h = img.height;
    var b = clamp(Math.round(band == null ? Math.min(w, h) / 5 : band), 1, Math.floor(Math.min(w, h) / 2));
    var out = blank(w, h);
    /* roll by half so the old seam sits in the middle of the new image */
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var sx = (x + (w >> 1)) % w, sy = (y + (h >> 1)) % h;
        var si = (sy * w + sx) * 4, di = (y * w + x) * 4;
        out.data[di] = img.data[si];
        out.data[di + 1] = img.data[si + 1];
        out.data[di + 2] = img.data[si + 2];
        out.data[di + 3] = img.data[si + 3];
      }
    }
    /* blend each border band with the opposite border, mirrored */
    var res = clone(out);
    for (var yy = 0; yy < h; yy++) {
      for (var xx = 0; xx < w; xx++) {
        var t = 0, mixA = null;
        var dLeft = xx, dRight = w - 1 - xx, dTop = yy, dBot = h - 1 - yy;
        var best = Math.min(dLeft, dRight, dTop, dBot);
        if (best < b) {
          t = smooth(1 - best / b);
          if (best === dLeft) mixA = [(w - 1 - xx), yy];
          else if (best === dRight) mixA = [(w - 1 - xx), yy];
          else if (best === dTop) mixA = [xx, (h - 1 - yy)];
          else mixA = [xx, (h - 1 - yy)];
        }
        if (!mixA) continue;
        var oi = (yy * w + xx) * 4, mi = (mixA[1] * w + mixA[0]) * 4;
        for (var c = 0; c < 4; c++) {
          res.data[oi + c] = lerp(out.data[oi + c], out.data[mi + c], t * 0.5);
        }
      }
    }
    return res;
  }

  /* -------------------------------------------------------- 6. Nirbhar Pal
   * Palette extraction (median cut), harmonies and WCAG contrast — the colour
   * work a design app needs, with no library.
   */

  function extractPalette(img, count) {
    count = clamp(count || 6, 2, 24);
    var d = img.data, n = img.width * img.height;
    var step = Math.max(1, Math.floor(n / 20000));    /* sample big photos */
    var pixels = [];
    for (var i = 0; i < n; i += step) {
      var j = i * 4;
      if (d[j + 3] < 128) continue;
      pixels.push([d[j], d[j + 1], d[j + 2]]);
    }
    if (!pixels.length) return ['#000000'];
    var boxes = [pixels];
    while (boxes.length < count) {
      /* split the box with the largest channel spread */
      var bestIdx = -1, bestSpread = -1, bestChannel = 0;
      for (var bi = 0; bi < boxes.length; bi++) {
        var box = boxes[bi];
        if (box.length < 2) continue;
        for (var ch = 0; ch < 3; ch++) {
          var mn = 255, mx = 0;
          for (var k = 0; k < box.length; k++) {
            if (box[k][ch] < mn) mn = box[k][ch];
            if (box[k][ch] > mx) mx = box[k][ch];
          }
          if (mx - mn > bestSpread) { bestSpread = mx - mn; bestIdx = bi; bestChannel = ch; }
        }
      }
      if (bestIdx < 0 || bestSpread <= 2) break;
      var target = boxes[bestIdx].slice().sort(function (a, b) { return a[bestChannel] - b[bestChannel]; });
      var mid = target.length >> 1;
      boxes.splice(bestIdx, 1, target.slice(0, mid), target.slice(mid));
    }
    return boxes.map(function (box) {
      var r = 0, g = 0, b = 0;
      for (var k = 0; k < box.length; k++) { r += box[k][0]; g += box[k][1]; b += box[k][2]; }
      var len = Math.max(1, box.length);
      return rgbToHex(r / len, g / len, b / len);
    });
  }

  function harmony(hex, scheme) {
    var hsv = rgbToHsv.apply(null, hexToRgb(hex));
    var h = hsv[0], s = hsv[1], v = hsv[2];
    var mk = function (dh, ds, dv) {
      return rgbToHex.apply(null, hsvToRgb(h + dh, clamp(s + (ds || 0), 0, 1), clamp(v + (dv || 0), 0.02, 1)));
    };
    switch (scheme) {
      case 'complement': return [mk(0), mk(180)];
      case 'analogous': return [mk(-30), mk(0), mk(30)];
      case 'triad': return [mk(0), mk(120), mk(240)];
      case 'tetrad': return [mk(0), mk(90), mk(180), mk(270)];
      case 'split': return [mk(0), mk(150), mk(210)];
      case 'mono': return [mk(0, 0, -0.3), mk(0, 0, -0.12), mk(0), mk(0, 0, 0.22), mk(0, -0.25, 0.35)];
      default: return [hex];
    }
  }

  function relLuminance(hex) {
    var c = hexToRgb(hex).map(function (v) {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  function contrastRatio(a, b) {
    var l1 = relLuminance(a), l2 = relLuminance(b);
    var hi = Math.max(l1, l2), lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  function bestTextColor(bg) {
    var dark = '#141418', light = '#ffffff';
    return contrastRatio(bg, dark) >= contrastRatio(bg, light) ? dark : light;
  }

  /* ------------------------------------------------------ 7. Nirbhar Paper
   * A PDF writer in ~150 lines: pages, JPEG images, correct xref. No library,
   * no upload, no print dialog — the bytes are built right here.
   */

  var PAGE_SIZES = {
    a4: [595.28, 841.89],
    a5: [419.53, 595.28],
    a3: [841.89, 1190.55],
    letter: [612, 792],
    legal: [612, 1008],
    square: [595.28, 595.28],
    story: [595.28, 1058.27]
  };

  function utf8Bytes(str) {
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(str);
    var out = [];
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c < 128) out.push(c);
      else if (c < 2048) out.push(192 | (c >> 6), 128 | (c & 63));
      else out.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
    }
    return new Uint8Array(out);
  }

  function concatBytes(chunks) {
    var len = 0;
    chunks.forEach(function (c) { len += c.length; });
    var out = new Uint8Array(len), off = 0;
    chunks.forEach(function (c) { out.set(c, off); off += c.length; });
    return out;
  }

  /* pages: [{ jpeg: Uint8Array, width, height }] (JPEG bytes, pixel size) */
  function buildPdf(pages, opts) {
    opts = opts || {};
    var size = PAGE_SIZES[opts.pageSize] || PAGE_SIZES.a4;
    var landscape = !!opts.landscape;
    var pw = landscape ? size[1] : size[0];
    var ph = landscape ? size[0] : size[1];
    var margin = opts.margin == null ? 0 : clamp(opts.margin, 0, 200);
    var fill = opts.fit === 'fill';
    var availW = Math.max(1, pw - margin * 2), availH = Math.max(1, ph - margin * 2);

    var chunks = [];
    var offsets = [0];
    var len = 0;
    function push(bytes) {
      chunks.push(bytes);
      len += bytes.length;
    }
    function str(s) { push(utf8Bytes(s)); }

    str('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

    var objects = [];              /* object number -> written? we write sequentially */
    var pageObjNums = [];
    var n = pages.length;
    var firstPageObj = 3;          /* 1 catalog, 2 pages tree */

    /* Reserve numbering: page i uses objects 3+3i, contents 4+3i, image 5+3i */
    for (var i = 0; i < n; i++) pageObjNums.push(firstPageObj + i * 3);

    var total = 2 + n * 3;
    objects.length = total + 1;

    function obj(num, body, streamBytes) {
      offsets[num] = len;
      str(num + ' 0 obj\n' + body + '\n');
      if (streamBytes) {
        str('stream\n');
        push(streamBytes);
        str('\nendstream\n');
      }
      str('endobj\n');
    }

    obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    var kids = pageObjNums.map(function (p) { return p + ' 0 R'; }).join(' ');
    obj(2, '<< /Type /Pages /Kids [' + kids + '] /Count ' + n + ' >>');

    for (var p = 0; p < n; p++) {
      var page = pages[p];
      var pnum = pageObjNums[p];
      var cnum = pnum + 1, imnum = pnum + 2;
      var imgW = Math.max(1, page.width | 0), imgH = Math.max(1, page.height | 0);
      var scale = fill
        ? Math.max(availW / imgW, availH / imgH)
        : Math.min(availW / imgW, availH / imgH);
      var dw = imgW * scale, dh = imgH * scale;
      var x = (pw - dw) / 2, y = (ph - dh) / 2;

      var content = 'q\n' + dw.toFixed(2) + ' 0 0 ' + dh.toFixed(2) + ' ' +
        x.toFixed(2) + ' ' + y.toFixed(2) + ' cm\n/Im0 Do\nQ\n';
      var contentBytes = utf8Bytes(content);

      obj(pnum, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + pw.toFixed(2) + ' ' + ph.toFixed(2) +
        '] /Resources << /XObject << /Im0 ' + imnum + ' 0 R >> >> /Contents ' + cnum + ' 0 R >>');
      obj(cnum, '<< /Length ' + contentBytes.length + ' >>', contentBytes);
      obj(imnum, '<< /Type /XObject /Subtype /Image /Width ' + imgW + ' /Height ' + imgH +
        ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + page.jpeg.length + ' >>',
        page.jpeg);
    }

    var xrefStart = len;
    var xref = 'xref\n0 ' + (total + 1) + '\n0000000000 65535 f \n';
    for (var o = 1; o <= total; o++) {
      var off = offsets[o] || 0;
      xref += ('0000000000' + off).slice(-10) + ' 00000 n \n';
    }
    str(xref);
    str('trailer\n<< /Size ' + (total + 1) + ' /Root 1 0 R >>\nstartxref\n' + xrefStart + '\n%%EOF\n');

    return concatBytes(chunks);
  }

  /* -------------------------------------------------------- 8. Nirbhar Sheet
   * ICO / favicon packs. Windows accepts PNG payloads inside an ICO container,
   * so the pack is built from the PNGs the canvas already produces.
   */
  function buildIco(images) {
    var count = images.length;
    var header = new Uint8Array(6 + count * 16);
    header[2] = 1; header[3] = 0;
    header[4] = count & 255; header[5] = (count >> 8) & 255;
    var offset = header.length;
    var blobs = [];
    images.forEach(function (im, i) {
      var p = 6 + i * 16;
      header[p] = im.width >= 256 ? 0 : im.width;
      header[p + 1] = im.height >= 256 ? 0 : im.height;
      header[p + 2] = 0; header[p + 3] = 0;
      header[p + 4] = 1; header[p + 5] = 0;                 /* planes */
      header[p + 6] = 32; header[p + 7] = 0;                /* bpp */
      var sz = im.png.length;
      header[p + 8] = sz & 255; header[p + 9] = (sz >> 8) & 255;
      header[p + 10] = (sz >> 16) & 255; header[p + 11] = (sz >> 24) & 255;
      header[p + 12] = offset & 255; header[p + 13] = (offset >> 8) & 255;
      header[p + 14] = (offset >> 16) & 255; header[p + 15] = (offset >> 24) & 255;
      offset += sz;
      blobs.push(im.png);
    });
    return concatBytes([header].concat(blobs));
  }

  /* ------------------------------------------------------ 9. Nirbhar Vector
   * The editable objects (text and shapes) are already vector data, so the
   * design can leave as real SVG instead of a flat bitmap.
   */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function objectsToSvg(objects, opts) {
    opts = opts || {};
    var w = opts.width || 512, h = opts.height || 512;
    var out = [];
    out.push('<?xml version="1.0" encoding="UTF-8"?>');
    out.push('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
      'width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">');
    out.push('<!-- Made with Pixel Studio Edit · Nirbhar Vector -->');
    if (opts.background && opts.background !== 'none') {
      out.push('<rect width="' + w + '" height="' + h + '" fill="' + esc(opts.background) + '"/>');
    }
    if (opts.baseImage) {
      out.push('<image x="0" y="0" width="' + w + '" height="' + h + '" xlink:href="' + opts.baseImage + '"/>');
    }
    var defs = [];
    (objects || []).forEach(function (o, idx) {
      if (!o || o.visible === false) return;
      var rot = o.rotation ? ' transform="rotate(' + o.rotation.toFixed(2) + ' ' +
        (o.x + (o.w || 0) / 2).toFixed(2) + ' ' + (o.y + (o.h || 0) / 2).toFixed(2) + ')"' : '';
      if (o.type === 'text') {
        var fill = o.color || '#000000';
        if (o.gradient) {
          var gid = 'g' + idx;
          defs.push('<linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="0">' +
            '<stop offset="0" stop-color="' + esc(fill) + '"/>' +
            '<stop offset="1" stop-color="' + esc(o.grad2 || '#38bdf8') + '"/></linearGradient>');
          fill = 'url(#' + gid + ')';
        }
        var style = 'font-family:' + esc(String(o.font || 'sans-serif').replace(/"/g, "'")) +
          ';font-size:' + (o.size || 16) + 'px;font-weight:' + (o.bold ? 700 : 400) +
          ';font-style:' + (o.italic ? 'italic' : 'normal');
        var extra = '';
        if (o.stroke) extra += ' stroke="' + esc(o.strokeColor || '#000000') + '" stroke-width="' + o.stroke + '"';
        if (o.shadow) extra += ' filter="url(#sh' + idx + ')"';
        if (o.shadow) {
          defs.push('<filter id="sh' + idx + '"><feDropShadow dx="' + o.shadow + '" dy="' + o.shadow +
            '" stdDeviation="' + Math.max(0.5, o.shadow / 2) + '" flood-color="' + esc(o.shadowColor || '#000000') + '"/></filter>');
        }
        var lines = String(o.text || '').split('\n');
        var size = o.size || 16;
        var tspans = lines.map(function (line, li) {
          return '<tspan x="' + (o.x || 0) + '" dy="' + (li === 0 ? size : size * 1.2) + '">' + esc(line) + '</tspan>';
        }).join('');
        out.push('<text x="' + (o.x || 0) + '" y="' + ((o.y || 0)) + '" fill="' + fill +
          '" style="' + style + '"' + extra + rot + '>' + tspans + '</text>');
        if (o.depth || o.curve) {
          out.push('<!-- note: 3D depth and curved text are flattened in the bitmap export, not in SVG -->');
        }
      } else if (o.type === 'shape') {
        var common = 'fill="' + (o.filled ? esc(o.color || '#000000') : 'none') + '" stroke="' +
          esc(o.strokeColor || o.color || '#000000') + '" stroke-width="' + (o.strokeWidth || 1) + '"' + rot;
        if (o.shape === 'ellipse') {
          out.push('<ellipse cx="' + ((o.x || 0) + (o.w || 0) / 2) + '" cy="' + ((o.y || 0) + (o.h || 0) / 2) +
            '" rx="' + ((o.w || 0) / 2) + '" ry="' + ((o.h || 0) / 2) + '" ' + common + '/>');
        } else if (o.shape === 'line') {
          out.push('<line x1="' + (o.x || 0) + '" y1="' + (o.y || 0) + '" x2="' + ((o.x || 0) + (o.w || 0)) +
            '" y2="' + ((o.y || 0) + (o.h || 0)) + '" ' + common + '/>');
        } else {
          out.push('<rect x="' + (o.x || 0) + '" y="' + (o.y || 0) + '" width="' + (o.w || 0) +
            '" height="' + (o.h || 0) + '" ' + common + '/>');
        }
      }
    });
    if (defs.length) out.splice(2, 0, '<defs>' + defs.join('') + '</defs>');
    out.push('</svg>');
    return out.join('\n');
  }

  /* --------------------------------------------------------- 10. Nirbhar Art
   * Generative art from a prompt, computed on the device. This is procedural
   * composition, not a diffusion model — the same prompt and seed always give
   * the same picture, and nothing is downloaded.
   */

  var ART_STYLES = ['mesh', 'waves', 'geo', 'rings', 'grain'];

  function artPalette(prompt, style) {
    var seed = hashString(prompt + '|' + style);
    var rnd = mulberry32(seed);
    var baseHue = rnd() * 360;
    var scheme = ['analogous', 'triad', 'complement', 'split'][Math.floor(rnd() * 4)];
    var base = rgbToHex.apply(null, hsvToRgb(baseHue, 0.55 + rnd() * 0.35, 0.55 + rnd() * 0.3));
    var cols = harmony(base, scheme);
    cols.push(rgbToHex.apply(null, hsvToRgb(baseHue + 20, 0.12, 0.96)));
    cols.push(rgbToHex.apply(null, hsvToRgb(baseHue + 200, 0.2, 0.12)));
    return cols;
  }

  function artFromPrompt(prompt, opts) {
    opts = opts || {};
    var w = Math.max(8, opts.width || 512), h = Math.max(8, opts.height || 512);
    var style = opts.style && ART_STYLES.indexOf(opts.style) >= 0 ? opts.style : 'mesh';
    var seed = opts.seed == null ? hashString(prompt || 'nirbhar') : (opts.seed >>> 0);
    var rnd = mulberry32(seed);
    var pal = artPalette(prompt || 'nirbhar', style).map(hexToRgb);
    var out = blank(w, h);
    var d = out.data;
    var i, j;

    if (style === 'mesh') {
      var blobs = [];
      for (i = 0; i < 5; i++) {
        blobs.push({
          x: rnd() * w, y: rnd() * h,
          r: (0.25 + rnd() * 0.5) * Math.max(w, h),
          c: pal[i % pal.length]
        });
      }
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var r0 = 0, g0 = 0, b0 = 0, ws = 0;
          for (i = 0; i < blobs.length; i++) {
            var bl = blobs[i];
            var dx = (x - bl.x) / bl.r, dy = (y - bl.y) / bl.r;
            var wt = Math.exp(-(dx * dx + dy * dy) * 3);
            r0 += bl.c[0] * wt; g0 += bl.c[1] * wt; b0 += bl.c[2] * wt; ws += wt;
          }
          var oi = (y * w + x) * 4;
          d[oi] = ws ? r0 / ws : 0;
          d[oi + 1] = ws ? g0 / ws : 0;
          d[oi + 2] = ws ? b0 / ws : 0;
          d[oi + 3] = 255;
        }
      }
    } else if (style === 'waves') {
      var waves = [];
      for (i = 0; i < 4; i++) {
        waves.push({ amp: (0.03 + rnd() * 0.12) * h, freq: 1 + rnd() * 4, phase: rnd() * 6.28, c: pal[i % pal.length] });
      }
      for (var y2 = 0; y2 < h; y2++) {
        for (var x2 = 0; x2 < w; x2++) {
          var r1 = 0, g1 = 0, b1 = 0, cnt = 0;
          for (i = 0; i < waves.length; i++) {
            var wv = waves[i];
            var edge = h / 2 + Math.sin((x2 / w) * Math.PI * 2 * wv.freq + wv.phase) * wv.amp + (i - waves.length / 2) * h * 0.12;
            if (y2 > edge) { r1 += wv.c[0]; g1 += wv.c[1]; b1 += wv.c[2]; cnt++; }
          }
          var oi2 = (y2 * w + x2) * 4;
          var base = pal[pal.length - 1];
          d[oi2] = cnt ? r1 / cnt : base[0];
          d[oi2 + 1] = cnt ? g1 / cnt : base[1];
          d[oi2 + 2] = cnt ? b1 / cnt : base[2];
          d[oi2 + 3] = 255;
        }
      }
    } else if (style === 'geo') {
      var bg = pal[pal.length - 2];
      for (var yy = 0; yy < h; yy++) {
        for (var xx = 0; xx < w; xx++) {
          var qi = (yy * w + xx) * 4;
          d[qi] = bg[0]; d[qi + 1] = bg[1]; d[qi + 2] = bg[2]; d[qi + 3] = 255;
        }
      }
      for (i = 0; i < 9; i++) {
        var col = pal[i % pal.length];
        var kind = rnd() < 0.45 ? 'circle' : (rnd() < 0.6 ? 'rect' : 'tri');
        var cx = rnd() * w, cy = rnd() * h;
        var rw = (0.08 + rnd() * 0.3) * w, rh = (0.08 + rnd() * 0.3) * h;
        for (var y3 = 0; y3 < h; y3++) {
          for (var x3 = 0; x3 < w; x3++) {
            var inside = false;
            if (kind === 'circle') {
              var ddx = (x3 - cx) / (rw / 2), ddy = (y3 - cy) / (rh / 2);
              inside = ddx * ddx + ddy * ddy <= 1;
            } else if (kind === 'rect') {
              inside = Math.abs(x3 - cx) <= rw / 2 && Math.abs(y3 - cy) <= rh / 2;
            } else {
              var top = cy - rh / 2, bot = cy + rh / 2;
              var frac = (y3 - top) / Math.max(1, bot - top);
              var halfW = (rw / 2) * frac;
              inside = y3 >= top && y3 <= bot && Math.abs(x3 - cx) <= halfW;
            }
            if (inside) {
              var oi3 = (y3 * w + x3) * 4;
              d[oi3] = col[0]; d[oi3 + 1] = col[1]; d[oi3 + 2] = col[2]; d[oi3 + 3] = 255;
            }
          }
        }
      }
    } else if (style === 'rings') {
      var cxs = w * (0.35 + rnd() * 0.3), cys = h * (0.35 + rnd() * 0.3);
      var maxR = Math.hypot(w, h) * 0.7;
      for (var y4 = 0; y4 < h; y4++) {
        for (var x4 = 0; x4 < w; x4++) {
          var rr = Math.hypot(x4 - cxs, y4 - cys) / maxR;
          var band = (Math.sin(rr * 28) * 0.5 + 0.5);
          var cIdx = Math.floor(band * (pal.length - 1));
          var c0 = pal[cIdx], c1 = pal[Math.min(pal.length - 1, cIdx + 1)];
          var f = band * (pal.length - 1) - cIdx;
          var oi4 = (y4 * w + x4) * 4;
          d[oi4] = lerp(c0[0], c1[0], f);
          d[oi4 + 1] = lerp(c0[1], c1[1], f);
          d[oi4 + 2] = lerp(c0[2], c1[2], f);
          d[oi4 + 3] = 255;
        }
      }
    } else {                                   /* grain */
      var c2 = pal[0], c3 = pal[2] || pal[1];
      for (var y5 = 0; y5 < h; y5++) {
        for (var x5 = 0; x5 < w; x5++) {
          var t = (x5 / w) * 0.6 + (y5 / h) * 0.4;
          var n = (rnd() - 0.5) * 26;
          var oi5 = (y5 * w + x5) * 4;
          d[oi5] = clamp(lerp(c2[0], c3[0], t) + n, 0, 255);
          d[oi5 + 1] = clamp(lerp(c2[1], c3[1], t) + n, 0, 255);
          d[oi5 + 2] = clamp(lerp(c2[2], c3[2], t) + n, 0, 255);
          d[oi5 + 3] = 255;
        }
      }
    }

    if (opts.posterize) {
      var steps = clamp(opts.posterize, 2, 16);
      for (var q2 = 0; q2 < d.length; q2 += 4) {
        for (var ch = 0; ch < 3; ch++) {
          d[q2 + ch] = Math.round(d[q2 + ch] / 255 * (steps - 1)) / (steps - 1) * 255;
        }
      }
    }
    return { img: out, palette: pal.map(function (c) { return rgbToHex(c[0], c[1], c[2]); }), seed: seed, style: style };
  }

  /* -------------------------------------------------------- 11. Nirbhar ID
   * Passport / ID photo sheets and any centre-crop work: pure geometry, so the
   * print comes out at the exact millimetre size.
   */

  function coverCrop(img, outW, outH, cx, cy) {
    var targetAspect = outW / outH;
    var srcAspect = img.width / img.height;
    var sx, sy, sw, sh;
    if (srcAspect > targetAspect) {
      sh = img.height; sw = sh * targetAspect;
      sx = clamp((cx == null ? 0.5 : cx) * img.width - sw / 2, 0, img.width - sw);
      sy = 0;
    } else {
      sw = img.width; sh = sw / targetAspect;
      sy = clamp((cy == null ? 0.42 : cy) * img.height - sh / 2, 0, img.height - sh);
      sx = 0;
    }
    var out = blank(outW, outH);
    for (var y = 0; y < outH; y++) {
      for (var x = 0; x < outW; x++) {
        var u = (sx + (x + 0.5) * sw / outW), v = (sy + (y + 0.5) * sh / outH);
        var x0 = clamp(Math.floor(u), 0, img.width - 1), y0 = clamp(Math.floor(v), 0, img.height - 1);
        var si = (y0 * img.width + x0) * 4, di = (y * outW + x) * 4;
        out.data[di] = img.data[si];
        out.data[di + 1] = img.data[si + 1];
        out.data[di + 2] = img.data[si + 2];
        out.data[di + 3] = img.data[si + 3];
      }
    }
    return out;
  }

  /* Lay a photo out on a print sheet (photo size in pixels at the chosen DPI). */
  function idSheet(img, opts) {
    opts = opts || {};
    var pw = Math.max(8, opts.photoW || 300), ph = Math.max(8, opts.photoH || 400);
    var cols = clamp(opts.cols || 3, 1, 12), rows = clamp(opts.rows || 3, 1, 12);
    var gap = clamp(opts.gap == null ? 8 : opts.gap, 0, 100);
    var bg = hexToRgb(opts.bg || '#ffffff');
    var W = cols * pw + (cols + 1) * gap, H = rows * ph + (rows + 1) * gap;
    var out = blank(W, H);
    for (var i = 0; i < out.data.length; i += 4) {
      out.data[i] = bg[0]; out.data[i + 1] = bg[1]; out.data[i + 2] = bg[2]; out.data[i + 3] = 255;
    }
    var one = coverCrop(img, pw, ph, opts.cx, opts.cy);
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var ox = gap + c * (pw + gap), oy = gap + r * (ph + gap);
        for (var y = 0; y < ph; y++) {
          for (var x = 0; x < pw; x++) {
            var si = (y * pw + x) * 4, di = ((oy + y) * W + (ox + x)) * 4;
            out.data[di] = one.data[si];
            out.data[di + 1] = one.data[si + 1];
            out.data[di + 2] = one.data[si + 2];
            out.data[di + 3] = 255;
          }
        }
      }
    }
    return out;
  }

  /* ------------------------------------------------------- 12. Nirbhar Seal
   * Watermarks, stamps and logos: rotate, tile at an angle, overlay.
   */

  function rotate(img, deg, opts) {
    opts = opts || {};
    var rad = deg * Math.PI / 180;
    var ca = Math.cos(rad), sa = Math.sin(rad);
    var w = img.width, h = img.height;
    var ow = w, oh = h;
    if (opts.expand) {
      ow = Math.ceil(Math.abs(w * ca) + Math.abs(h * sa));
      oh = Math.ceil(Math.abs(w * sa) + Math.abs(h * ca));
    }
    var out = blank(ow, oh);
    var cx = w / 2, cy = h / 2, ncx = ow / 2, ncy = oh / 2;
    var tmp = [0, 0, 0, 0];
    for (var y = 0; y < oh; y++) {
      for (var x = 0; x < ow; x++) {
        var dx = x - ncx, dy = y - ncy;
        var sx = dx * ca + dy * sa + cx;
        var sy = -dx * sa + dy * ca + cy;
        var oi = (y * ow + x) * 4;
        if (sx < 0 || sy < 0 || sx >= w || sy >= h) continue;
        sample(img, sx, sy, tmp);
        out.data[oi] = tmp[0]; out.data[oi + 1] = tmp[1];
        out.data[oi + 2] = tmp[2]; out.data[oi + 3] = tmp[3];
      }
    }
    return out;
  }

  function overlay(base, top, opts) {
    opts = opts || {};
    var x0 = Math.round(opts.x || 0), y0 = Math.round(opts.y || 0);
    var alpha = clamp(opts.opacity == null ? 1 : opts.opacity, 0, 1);
    var out = clone(base);
    for (var y = 0; y < top.height; y++) {
      var by = y + y0;
      if (by < 0 || by >= base.height) continue;
      for (var x = 0; x < top.width; x++) {
        var bx = x + x0;
        if (bx < 0 || bx >= base.width) continue;
        var si = (y * top.width + x) * 4, di = (by * base.width + bx) * 4;
        var a = (top.data[si + 3] / 255) * alpha;
        if (a <= 0) continue;
        for (var c = 0; c < 3; c++) {
          out.data[di + c] = top.data[si + c] * a + out.data[di + c] * (1 - a);
        }
        out.data[di + 3] = clamp(out.data[di + 3] * (1 - a) + 255 * a, 0, 255);
      }
    }
    return out;
  }

  function tileStamp(base, stamp, opts) {
    opts = opts || {};
    var gapX = Math.max(1, opts.gapX || 160), gapY = Math.max(1, opts.gapY || 160);
    var angle = opts.angle == null ? -30 : opts.angle;
    var opacity = opts.opacity == null ? 0.25 : opts.opacity;
    var rot = angle ? rotate(stamp, angle, { expand: true }) : stamp;
    var out = clone(base);
    var offY = 0;
    for (var y = -rot.height; y < base.height + rot.height; y += gapY) {
      var row = Math.round(offY / gapY);
      var offsetX = (row % 2) ? Math.round(gapX / 2) : 0;
      for (var x = -rot.width; x < base.width + rot.width; x += gapX) {
        out = overlay(out, rot, { x: x + offsetX, y: y, opacity: opacity });
      }
      offY += gapY;
    }
    return out;
  }

  /* ------------------------------------------------------- 13. Nirbhar Batch
   * Geometry helpers used by the batch converter and the sheet layouts.
   */
  function fitBox(img, boxW, boxH, mode) {
    var scale = mode === 'fill'
      ? Math.max(boxW / img.width, boxH / img.height)
      : Math.min(boxW / img.width, boxH / img.height);
    var w = Math.max(1, Math.round(img.width * scale));
    var h = Math.max(1, Math.round(img.height * scale));
    return { width: w, height: h, scale: scale };
  }

  /* Contact sheet: images laid out on a grid, useful for sprites and proofs. */
  function contactSheet(images, opts) {
    opts = opts || {};
    if (!images.length) return blank(1, 1);
    var cols = clamp(opts.cols || Math.ceil(Math.sqrt(images.length)), 1, 20);
    var rows = Math.ceil(images.length / cols);
    var cellW = opts.cellW || Math.max.apply(null, images.map(function (im) { return im.width; }));
    var cellH = opts.cellH || Math.max.apply(null, images.map(function (im) { return im.height; }));
    var gap = opts.gap == null ? 0 : opts.gap;
    var bg = hexToRgb(opts.bg || '#00000000');
    var W = cols * cellW + (cols - 1) * gap;
    var H = rows * cellH + (rows - 1) * gap;
    var out = blank(W, H);
    for (var i = 0; i < out.data.length; i += 4) {
      out.data[i] = bg[0]; out.data[i + 1] = bg[1];
      out.data[i + 2] = bg[2]; out.data[i + 3] = opts.bg ? 255 : 0;
    }
    images.forEach(function (im, idx) {
      var r = Math.floor(idx / cols), c = idx % cols;
      var ox = c * (cellW + gap) + Math.round((cellW - im.width) / 2);
      var oy = r * (cellH + gap) + Math.round((cellH - im.height) / 2);
      for (var y = 0; y < im.height; y++) {
        var by = oy + y;
        if (by < 0 || by >= H) continue;
        for (var x = 0; x < im.width; x++) {
          var bx = ox + x;
          if (bx < 0 || bx >= W) continue;
          var si = (y * im.width + x) * 4, di = (by * W + bx) * 4;
          var a = im.data[si + 3] / 255;
          if (a <= 0) continue;
          for (var c2 = 0; c2 < 3; c2++) {
            out.data[di + c2] = im.data[si + c2] * a + out.data[di + c2] * (1 - a);
          }
          out.data[di + 3] = clamp(out.data[di + 3] + a * 255, 0, 255);
        }
      }
    });
    return out;
  }

  /* ------------------------------------------------------------------ exports */

  return {
    version: '1.0.0',
    clamp: clamp,
    hexToRgb: hexToRgb,
    rgbToHex: rgbToHex,
    luminance: luminance,
    rgbToHsv: rgbToHsv,
    hsvToRgb: hsvToRgb,
    mulberry32: mulberry32,
    hashString: hashString,
    blank: blank,
    clone: clone,
    sample: sample,
    /* Cut */
    cutout: cutout,
    /* Clear */
    stats: stats,
    sharpness: sharpnessOf,
    whiteBalance: whiteBalance,
    autoLevels: autoLevels,
    denoise: denoise,
    unsharp: unsharp,
    clarity: clarity,
    dehaze: dehaze,
    enhance: enhance,
    autoEnhance: autoEnhance,
    /* Zoom */
    resize: resizeKernel,
    upscale: upscale,
    epx2: epx2,
    /* Tone */
    halftone: halftone,
    duotone: duotone,
    gradientMap: gradientMap,
    sketch: sketch,
    colorBlind: colorBlind,
    CVD: CVD,
    /* Tile */
    makeSeamless: makeSeamless,
    /* Pal */
    extractPalette: extractPalette,
    harmony: harmony,
    contrastRatio: contrastRatio,
    bestTextColor: bestTextColor,
    /* Paper */
    PAGE_SIZES: PAGE_SIZES,
    buildPdf: buildPdf,
    /* Sheet */
    buildIco: buildIco,
    contactSheet: contactSheet,
    /* Vector */
    objectsToSvg: objectsToSvg,
    /* Art */
    ART_STYLES: ART_STYLES,
    artFromPrompt: artFromPrompt,
    artPalette: artPalette,
    /* ID */
    coverCrop: coverCrop,
    idSheet: idSheet,
    /* Seal */
    rotate: rotate,
    overlay: overlay,
    tileStamp: tileStamp,
    /* Batch */
    fitBox: fitBox
  };
});
