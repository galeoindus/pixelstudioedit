/* Pixel Studio Edit — Nirbhar toolkit UI.
 *
 * The panel, the tool dialogs and the multilingual manual. Every tool here
 * calls js/nirbhar.js, so nothing in this file talks to a network, a model or
 * a third-party service. If the engine or the editor hook is missing the whole
 * panel simply does not appear.
 */
(function () {
  'use strict';

  var N = window.PSNirbhar;
  if (!N) { console.warn('pixelstudioedit: Nirbhar engine missing'); return; }

  var I18N = window.PSNirbharI18N || { order: ['en'], names: { en: 'English' }, langs: { en: {} } };
  var LANG_KEY = 'pixelstudioedit.nirbhar.lang';

  function app() { return window.PSApp || null; }
  function byId(id) { return document.getElementById(id); }

  /* ---------------------------------------------------------------- language */

  function currentLang() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved && I18N.langs[saved]) return saved;
    } catch (e) { /* private mode */ }
    var nav = (navigator.language || 'en').slice(0, 2);
    return I18N.langs[nav] ? nav : 'en';
  }

  var lang = currentLang();

  function setLang(code) {
    if (!I18N.langs[code]) code = 'en';
    lang = code;
    try { localStorage.setItem(LANG_KEY, code); } catch (e) { /* ignore */ }
  }

  /* T('ui.manual') → the string for the current language, English as fallback */
  function T(path, fallback) {
    var cur = (I18N.langs[lang] || {});
    var en = (I18N.langs.en || {});
    var get = function (obj) {
      var parts = path.split('.');
      var v = obj;
      for (var i = 0; i < parts.length; i++) {
        if (!v) return null;
        v = v[parts[i]];
      }
      return typeof v === 'string' ? v : null;
    };
    return get(cur) || get(en) || fallback || path;
  }

  function toolText(id, field, fallback) {
    return T('tools.' + id + '.' + field, fallback);
  }

  /* ------------------------------------------------------------ image bridge */

  function toCanvas(img) {
    var cv = document.createElement('canvas');
    cv.width = img.width; cv.height = img.height;
    /* the engine returns plain buffers; putImageData only accepts a real
       ImageData, so wrap the bytes rather than passing the object through */
    var data = new ImageData(new Uint8ClampedArray(img.data), img.width, img.height);
    cv.getContext('2d').putImageData(data, 0, 0);
    return cv;
  }

  function toImageData(cv) {
    return cv.getContext('2d').getImageData(0, 0, cv.width, cv.height);
  }

  function sourceData(which) {
    var a = app();
    if (!a) return null;
    if (which === 'layer') return a.layerImageData() || a.designImageData();
    return a.designImageData();
  }

  function thumb(img, maxSide) {
    var scale = Math.min(1, (maxSide || 420) / Math.max(img.width, img.height));
    if (scale >= 1) return img;
    return N.resize(img, Math.max(1, Math.round(img.width * scale)), Math.max(1, Math.round(img.height * scale)), 'bilinear');
  }

  function blobBytes(blob) {
    if (!blob) return Promise.resolve(new Uint8Array(0));
    if (blob.arrayBuffer) return blob.arrayBuffer().then(function (b) { return new Uint8Array(b); });
    return new Promise(function (resolve) {
      var fr = new FileReader();
      fr.onload = function () { resolve(new Uint8Array(fr.result)); };
      fr.readAsArrayBuffer(blob);
    });
  }

  function canvasToJpeg(img, quality) {
    return new Promise(function (resolve) {
      var cv = toCanvas(img);
      if (cv.toBlob) {
        cv.toBlob(function (b) {
          blobBytes(b).then(function (bytes) { resolve(bytes); });
        }, 'image/jpeg', quality == null ? 0.92 : quality);
      } else {
        var url = cv.toDataURL('image/jpeg', quality == null ? 0.92 : quality);
        var raw = atob(url.split(',')[1]);
        var bytes = new Uint8Array(raw.length);
        for (var i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
        resolve(bytes);
      }
    });
  }

  function canvasToPng(img) {
    return new Promise(function (resolve) {
      var cv = toCanvas(img);
      cv.toBlob(function (b) { blobBytes(b).then(resolve); }, 'image/png');
    });
  }

  function download(blob, name) {
    var a = app();
    if (a) { a.saveBlob(blob, name); return; }
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url; link.download = name;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  /* Draws text into an image buffer — used by the watermark tool, because text
     rendering belongs to the browser, not to the maths module. */
  function textStamp(text, opts) {
    opts = opts || {};
    var size = Math.max(8, opts.size || 48);
    var cv = document.createElement('canvas');
    var ctx = cv.getContext('2d');
    var font = (opts.bold === false ? '' : '700 ') + size + 'px ' + (opts.font || 'system-ui, sans-serif');
    ctx.font = font;
    var lines = String(text || 'Nirbhar').split('\n');
    var widest = 0;
    lines.forEach(function (l) { widest = Math.max(widest, ctx.measureText(l).width); });
    cv.width = Math.ceil(widest + size);
    cv.height = Math.ceil(lines.length * size * 1.3 + size * 0.6);
    ctx = cv.getContext('2d');
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = opts.color || '#ffffff';
    ctx.globalAlpha = 1;
    lines.forEach(function (l, i) {
      ctx.fillText(l, size * 0.5, size * 0.8 + i * size * 1.3);
    });
    return toImageData(cv);
  }

  /* --------------------------------------------------------------- tool list */

  var TOOLS = [
    {
      id: 'cut', icon: '✂', name: 'Nirbhar Cut', tag: 'Background remover',
      source: 'design',
      fields: [
        { k: 'mode', t: 'select', def: 'corners', label: 'Method', opts: [['corners', 'Auto — sample the corners'], ['white', 'Remove white'], ['color', 'Remove a colour']] },
        { k: 'color', t: 'color', def: '#ffffff', label: 'Colour to remove' },
        { k: 'tolerance', t: 'range', def: 26, min: 2, max: 90, step: 1, label: 'Tolerance' },
        { k: 'feather', t: 'range', def: 1, min: 0, max: 6, step: 1, label: 'Edge soften' },
        { k: 'despill', t: 'check', def: true, label: 'Clean colour fringes' }
      ],
      run: function (img, v) {
        var out = N.cutout(img, {
          mode: v.mode, color: v.color, tolerance: v.tolerance,
          feather: v.feather, despill: v.despill
        });
        return { img: out.img, note: Math.round(out.removed * 100) + '% of the frame cleared · key ' + out.key };
      }
    },
    {
      id: 'clear', icon: '◐', name: 'Nirbhar Clear', tag: 'Photo quality',
      source: 'design',
      fields: [
        { k: 'auto', t: 'check', def: true, label: 'Automatic recipe' },
        { k: 'wb', t: 'check', def: true, label: 'White balance' },
        { k: 'levels', t: 'check', def: true, label: 'Auto levels' },
        { k: 'denoise', t: 'range', def: 0, min: 0, max: 100, step: 5, label: 'Denoise' },
        { k: 'dehaze', t: 'range', def: 0, min: 0, max: 100, step: 5, label: 'Dehaze' },
        { k: 'clarity', t: 'range', def: 25, min: 0, max: 100, step: 5, label: 'Clarity' },
        { k: 'sharpen', t: 'range', def: 45, min: 0, max: 200, step: 5, label: 'Sharpen' }
      ],
      run: function (img, v) {
        if (v.auto) {
          var res = N.autoEnhance(img);
          return { img: res.img, note: 'Auto: levels ' + (res.recipe.levels ? 'on' : 'off') +
            ', sharpen ' + res.recipe.sharpen + '%, clarity ' + res.recipe.clarity + '%' };
        }
        return { img: N.enhance(img, {
          whiteBalance: v.wb, levels: v.levels, denoise: v.denoise,
          dehaze: v.dehaze, clarity: v.clarity, sharpen: v.sharpen
        }), note: 'Manual recipe' };
      }
    },
    {
      id: 'zoom', icon: '⤢', name: 'Nirbhar Zoom', tag: 'Upscaler',
      source: 'design', newDoc: true,
      fields: [
        { k: 'factor', t: 'select', def: '2', label: 'Scale', opts: [['2', '2×'], ['3', '3×'], ['4', '4×'], ['8', '8×']] },
        { k: 'kernel', t: 'select', def: 'lanczos3', label: 'Kernel', opts: [['lanczos3', 'Lanczos — photos'], ['bicubic', 'Bicubic — smooth'], ['epx', 'EPX — pixel art edges'], ['nearest', 'Nearest — hard pixels']] },
        { k: 'sharpen', t: 'range', def: 25, min: 0, max: 150, step: 5, label: 'Sharpen after' }
      ],
      run: function (img, v) {
        var big = N.upscale(img, parseInt(v.factor, 10), v.kernel);
        if (v.sharpen > 0) N.unsharp(big, v.sharpen, 1);
        return { img: big, note: img.width + '×' + img.height + ' → ' + big.width + '×' + big.height };
      }
    },
    {
      id: 'tone', icon: '◑', name: 'Nirbhar Tone', tag: 'Print & graphic looks',
      source: 'design',
      fields: [
        { k: 'style', t: 'select', def: 'halftone', label: 'Treatment', opts: [['halftone', 'Halftone dots'], ['duotone', 'Duotone'], ['gradmap', 'Gradient map'], ['sketch', 'Pencil sketch'], ['cvd', 'Colour-blindness check']] },
        { k: 'cell', t: 'range', def: 6, min: 2, max: 24, step: 1, label: 'Dot size' },
        { k: 'angle', t: 'range', def: 45, min: 0, max: 90, step: 5, label: 'Screen angle' },
        { k: 'ink', t: 'color', def: '#111111', label: 'Ink' },
        { k: 'paper', t: 'color', def: '#ffffff', label: 'Paper' },
        { k: 'cvd', t: 'select', def: 'deuteranopia', label: 'Vision type', opts: [['deuteranopia', 'Deuteranopia'], ['protanopia', 'Protanopia'], ['tritanopia', 'Tritanopia'], ['achromatopsia', 'No colour']] }
      ],
      run: function (img, v) {
        if (v.style === 'halftone') return { img: N.halftone(img, { cell: v.cell, angle: v.angle, ink: v.ink, paper: v.paper, mono: true }) };
        if (v.style === 'duotone') return { img: N.duotone(img, v.ink, v.paper) };
        if (v.style === 'gradmap') return { img: N.gradientMap(img, [{ t: 0, color: v.ink }, { t: 0.55, color: '#8a6fb0' }, { t: 1, color: v.paper }]) };
        if (v.style === 'sketch') return { img: N.sketch(img, { ink: v.ink, paper: v.paper, strength: 1.2 }) };
        return { img: N.colorBlind(img, v.cvd), note: 'Simulated ' + v.cvd };
      }
    },
    {
      id: 'tile', icon: '▦', name: 'Nirbhar Tile', tag: 'Seamless texture',
      source: 'design',
      fields: [
        { k: 'band', t: 'range', def: 0, min: 0, max: 120, step: 2, label: 'Seam blend (0 = auto)' }
      ],
      run: function (img, v) {
        var band = v.band > 0 ? v.band : null;
        return { img: N.makeSeamless(img, band), note: 'Tile it in any direction — the edges now match' };
      }
    },
    {
      id: 'pal', icon: '◈', name: 'Nirbhar Pal', tag: 'Palette studio',
      source: 'design', kind: 'palette',
      fields: [
        { k: 'count', t: 'range', def: 6, min: 2, max: 16, step: 1, label: 'Colours to extract' },
        { k: 'base', t: 'color', def: '#3366cc', label: 'Base colour' },
        { k: 'scheme', t: 'select', def: 'triad', label: 'Harmony', opts: [['triad', 'Triad'], ['complement', 'Complementary'], ['analogous', 'Analogous'], ['split', 'Split complement'], ['tetrad', 'Tetrad'], ['mono', 'Monochromatic']] }
      ],
      run: function (img, v) {
        var extracted = N.extractPalette(img, v.count);
        var set = N.harmony(v.base, v.scheme);
        return { palette: extracted, harmony: set, img: null };
      }
    },
    {
      id: 'paper', icon: '▤', name: 'Nirbhar Paper', tag: 'PDF maker',
      source: 'design', kind: 'file',
      fields: [
        { k: 'pageSize', t: 'select', def: 'a4', label: 'Page', opts: [['a4', 'A4'], ['a5', 'A5'], ['a3', 'A3'], ['letter', 'Letter'], ['legal', 'Legal'], ['square', 'Square']] },
        { k: 'landscape', t: 'check', def: false, label: 'Landscape' },
        { k: 'fit', t: 'select', def: 'fit', label: 'Image fit', opts: [['fit', 'Fit — whole design'], ['fill', 'Fill — crop edges']] },
        { k: 'margin', t: 'range', def: 24, min: 0, max: 120, step: 2, label: 'Margin (pt)' },
        { k: 'quality', t: 'range', def: 92, min: 50, max: 100, step: 2, label: 'JPEG quality' },
        { k: 'extra', t: 'file', def: '', label: 'Extra pages (images, optional)', multiple: true }
      ],
      run: function (img, v) {
        var pages = [];
        var jobs = [];
        var designJpeg = canvasToJpeg(img, v.quality / 100).then(function (bytes) {
          pages[0] = { jpeg: bytes, width: img.width, height: img.height };
        });
        jobs.push(designJpeg);
        return Promise.all(jobs).then(function () {
          return (v.extra && v.extra.length ? loadFiles(v.extra) : Promise.resolve([]));
        }).then(function (extras) {
          var chain = Promise.resolve();
          extras.forEach(function (im) {
            chain = chain.then(function () {
              return canvasToJpeg(im, v.quality / 100).then(function (bytes) {
                pages.push({ jpeg: bytes, width: im.width, height: im.height });
              });
            });
          });
          return chain.then(function () {
            var bytes = N.buildPdf(pages.filter(Boolean), {
              pageSize: v.pageSize, landscape: v.landscape, fit: v.fit, margin: v.margin
            });
            return {
              blob: new Blob([bytes], { type: 'application/pdf' }),
              filename: 'pixelstudioedit.pdf',
              note: pages.length + ' page' + (pages.length === 1 ? '' : 's') + ' · ' + Math.round(bytes.length / 1024) + ' KB'
            };
          });
        });
      }
    },
    {
      id: 'sheet', icon: '❒', name: 'Nirbhar Sheet', tag: 'Icons & sprite sheets',
      source: 'design', kind: 'file',
      fields: [
        { k: 'mode', t: 'select', def: 'icons', label: 'What to build', opts: [['icons', 'App icon + .ico pack'], ['sprite', 'Sprite sheet from layers']] },
        { k: 'gap', t: 'range', def: 0, min: 0, max: 32, step: 1, label: 'Gap (sprite sheet)' }
      ],
      run: function (img, v) {
        if (v.mode === 'sprite') {
          var layers = (app().state.layers || []).filter(function (l) { return l.visible; });
          var tiles = layers.map(function (l) {
            var data = l.ctx.getImageData(0, 0, img.width, img.height);
            return data;
          });
          if (!tiles.length) tiles = [img];
          var sheetImg = N.contactSheet(tiles, { cols: tiles.length, gap: v.gap, cellW: img.width, cellH: img.height });
          return canvasToPng(sheetImg).then(function (bytes) {
            return { blob: new Blob([bytes], { type: 'image/png' }), filename: 'sprite-sheet.png', note: tiles.length + ' frames' };
          });
        }
        var sizes = [16, 32, 48, 64, 128, 256];
        var ico = [];
        var chain = Promise.resolve();
        sizes.forEach(function (s) {
          chain = chain.then(function () {
            var scaled = N.resize(img, s, s, 'bicubic');
            return canvasToPng(scaled).then(function (png) {
              ico.push({ png: png, width: s, height: s });
            });
          });
        });
        return chain.then(function () {
          var bytes = N.buildIco(ico);
          return {
            blob: new Blob([bytes], { type: 'image/x-icon' }),
            filename: 'favicon.ico',
            note: '16–256 px inside one .ico'
          };
        });
      }
    },
    {
      id: 'vector', icon: '◇', name: 'Nirbhar Vector', tag: 'SVG export',
      source: 'design', kind: 'file',
      fields: [
        { k: 'base', t: 'check', def: true, label: 'Include the painted layers as a background image' },
        { k: 'bg', t: 'color', def: '#ffffff', label: 'Background colour' },
        { k: 'transparent', t: 'check', def: false, label: 'Transparent background' }
      ],
      run: function (img, v) {
        var a = app();
        var svg = N.objectsToSvg(a.objects(), {
          width: img.width, height: img.height,
          background: v.transparent ? null : v.bg,
          baseImage: v.base ? toCanvas(img).toDataURL('image/png') : null
        });
        var blob = new Blob([svg], { type: 'image/svg+xml' });
        return {
          blob: blob,
          filename: 'design.svg',
          note: (a.objects().length) + ' editable objects · ' + Math.round(blob.size / 1024) + ' KB'
        };
      }
    },
    {
      id: 'art', icon: '✦', name: 'Nirbhar Art', tag: 'Generative art',
      source: 'design', newDoc: true, replaceOk: true,
      fields: [
        { k: 'prompt', t: 'text', def: 'sunset over a Goan beach', label: 'Describe the picture' },
        { k: 'style', t: 'select', def: 'mesh', label: 'Style', opts: [['mesh', 'Colour mesh'], ['waves', 'Waves'], ['geo', 'Bauhaus shapes'], ['rings', 'Rings'], ['grain', 'Grain gradient']] },
        { k: 'seed', t: 'range', def: 7, min: 0, max: 200, step: 1, label: 'Variation' },
        { k: 'posterize', t: 'range', def: 0, min: 0, max: 12, step: 1, label: 'Posterize (0 = off)' },
        { k: 'size', t: 'select', def: 'same', label: 'Size', opts: [['same', 'Same as document'], ['1024', '1024 × 1024'], ['1080x1080', '1080 × 1080'], ['1920x1080', '1920 × 1080']] }
      ],
      run: function (img, v) {
        var w = img.width, h = img.height;
        if (v.size !== 'same') {
          var p = v.size.split('x');
          w = parseInt(p[0], 10); h = parseInt(p[1] || p[0], 10);
        }
        var res = N.artFromPrompt(v.prompt, {
          width: w, height: h, style: v.style,
          seed: N.hashString(v.prompt) + v.seed * 7919,
          posterize: v.posterize > 0 ? v.posterize : 0
        });
        return { img: res.img, note: 'Palette: ' + res.palette.join('  ') };
      }
    },
    {
      id: 'id', icon: '▣', name: 'Nirbhar ID', tag: 'Passport photo sheet',
      source: 'design', newDoc: true,
      fields: [
        { k: 'preset', t: 'select', def: 'in35x45', label: 'Photo size', opts: [['in35x45', 'India 35 × 45 mm'], ['us2x2', 'US 2 × 2 in'], ['eu35x45', 'EU 35 × 45 mm'], ['square', 'Square']] },
        { k: 'dpi', t: 'select', def: '300', label: 'Print DPI', opts: [['150', '150'], ['300', '300'], ['600', '600']] },
        { k: 'cols', t: 'range', def: 3, min: 1, max: 6, step: 1, label: 'Columns' },
        { k: 'rows', t: 'range', def: 3, min: 1, max: 6, step: 1, label: 'Rows' },
        { k: 'gap', t: 'range', def: 10, min: 0, max: 40, step: 1, label: 'Gap (px)' },
        { k: 'bg', t: 'color', def: '#ffffff', label: 'Sheet colour' }
      ],
      run: function (img, v) {
        var dpi = parseInt(v.dpi, 10) / 25.4;
        var wmm = 35, hmm = 45;
        if (v.preset === 'us2x2') { wmm = 50.8; hmm = 50.8; }
        else if (v.preset === 'square') { wmm = 40; hmm = 40; }
        var pw = Math.round(wmm * dpi), ph = Math.round(hmm * dpi);
        var out = N.idSheet(img, { photoW: pw, photoH: ph, cols: v.cols, rows: v.rows, gap: v.gap, bg: v.bg });
        return { img: out, note: v.cols * v.rows + ' photos · ' + pw + '×' + ph + ' px each at ' + v.dpi + ' DPI' };
      }
    },
    {
      id: 'seal', icon: 'Ⓝ', name: 'Nirbhar Seal', tag: 'Watermark & stamp',
      source: 'design',
      fields: [
        { k: 'text', t: 'text', def: 'Nirbhar', label: 'Watermark text' },
        { k: 'size', t: 'range', def: 40, min: 10, max: 160, step: 2, label: 'Text size' },
        { k: 'angle', t: 'range', def: -30, min: -90, max: 90, step: 5, label: 'Angle' },
        { k: 'gapX', t: 'range', def: 220, min: 40, max: 600, step: 10, label: 'Spacing across' },
        { k: 'gapY', t: 'range', def: 220, min: 40, max: 600, step: 10, label: 'Spacing down' },
        { k: 'opacity', t: 'range', def: 22, min: 4, max: 100, step: 2, label: 'Opacity %' },
        { k: 'color', t: 'color', def: '#ffffff', label: 'Colour' }
      ],
      run: function (img, v) {
        var stamp = textStamp(v.text, { size: v.size, color: v.color });
        var out = N.tileStamp(img, stamp, {
          gapX: v.gapX, gapY: v.gapY, angle: v.angle, opacity: v.opacity / 100
        });
        return { img: out, note: 'Watermark tiled across ' + img.width + '×' + img.height };
      }
    },
    {
      id: 'batch', icon: '⇉', name: 'Nirbhar Batch', tag: 'Convert & resize',
      source: 'design', kind: 'file',
      fields: [
        { k: 'files', t: 'file', def: '', label: 'Images to convert', multiple: true, required: true },
        { k: 'maxSide', t: 'range', def: 1600, min: 200, max: 4000, step: 100, label: 'Longest side (px)' },
        { k: 'format', t: 'select', def: 'image/jpeg', label: 'Format', opts: [['image/jpeg', 'JPEG'], ['image/png', 'PNG'], ['image/webp', 'WebP']] },
        { k: 'quality', t: 'range', def: 88, min: 40, max: 100, step: 2, label: 'Quality' }
      ],
      run: function (img, v) {
        if (!v.files || !v.files.length) {
          return Promise.reject(new Error(T('ui.pickFiles', 'Choose at least one image first')));
        }
        return loadFiles(v.files).then(function (images) {
          var chain = Promise.resolve();
          var count = 0;
          images.forEach(function (im, i) {
            chain = chain.then(function () {
              var scale = Math.min(1, v.maxSide / Math.max(im.width, im.height));
              var out = scale < 1
                ? N.resize(im, Math.round(im.width * scale), Math.round(im.height * scale), 'lanczos3')
                : im;
              var cv = toCanvas(out);
              return new Promise(function (resolve) {
                cv.toBlob(function (blob) {
                  var ext = v.format.split('/')[1].replace('jpeg', 'jpg');
                  download(blob, 'nirbhar-' + (i + 1) + '.' + ext);
                  count++;
                  setTimeout(resolve, 350);
                }, v.format, v.quality / 100);
              });
            });
          });
          return chain.then(function () {
            return { done: true, note: count + ' file' + (count === 1 ? '' : 's') + ' converted and saved' };
          });
        });
      }
    }
  ];

  /* Reads File objects into ImageData, in order. */
  function loadFiles(files) {
    var list = Array.prototype.slice.call(files || []);
    var out = [];
    var chain = Promise.resolve();
    list.forEach(function (file) {
      chain = chain.then(function () {
        return new Promise(function (resolve) {
          var url = URL.createObjectURL(file);
          var im = new Image();
          im.onload = function () {
            var cv = document.createElement('canvas');
            cv.width = im.naturalWidth || im.width;
            cv.height = im.naturalHeight || im.height;
            var ctx = cv.getContext('2d');
            ctx.drawImage(im, 0, 0);
            out.push(toImageData(cv));
            URL.revokeObjectURL(url);
            resolve();
          };
          im.onerror = function () { URL.revokeObjectURL(url); resolve(); };
          im.src = url;
        });
      });
    });
    return chain.then(function () { return out; });
  }

  /* -------------------------------------------------------------------- hub */

  function buildHub() {
    var host = byId('nirbhar-hub');
    if (!host) return;
    var html = '';
    html += '<div class="nb-head">';
    html += '<div class="nb-headline"><b>' + T('ui.title', 'Nirbhar tools') + '</b>';
    html += '<small>' + T('ui.subtitle', 'Offline tools — no upload, no account, no network') + '</small></div>';
    html += '<button class="nb-lang" id="nb-manual">' + T('ui.manual', 'Manual') + '</button>';
    html += '</div>';
    html += '<div class="nb-grid">';
    TOOLS.forEach(function (tool) {
      html += '<button class="nb-card" data-nb-tool="' + tool.id + '">' +
        '<i class="nb-ico">' + tool.icon + '</i>' +
        '<b>' + tool.name + '</b>' +
        '<small>' + toolText(tool.id, 'desc', tool.tag) + '</small>' +
        '</button>';
    });
    html += '</div>';
    html += '<p class="nb-foot">' + T('ui.footnote',
      'Every tool runs inside this page. Results are added as a new layer, so your original stays untouched.') + '</p>';
    host.innerHTML = html;

    host.querySelectorAll('[data-nb-tool]').forEach(function (btn) {
      btn.onclick = function () { openTool(btn.getAttribute('data-nb-tool')); };
    });
    var manualBtn = byId('nb-manual');
    if (manualBtn) manualBtn.onclick = openManual;
  }

  /* ----------------------------------------------------------------- fields */

  function renderFields(host, fields, values, onChange) {
    host.innerHTML = '';
    fields.forEach(function (f) {
      var row = document.createElement('label');
      row.className = 'nb-row';
      var label = document.createElement('span');
      label.className = 'nb-label';
      label.textContent = f.label;
      row.appendChild(label);

      if (f.t === 'range') {
        var input = document.createElement('input');
        input.type = 'range';
        input.min = f.min; input.max = f.max; input.step = f.step || 1;
        input.value = values[f.k];
        var out = document.createElement('b');
        out.textContent = values[f.k];
        input.oninput = function () {
          values[f.k] = parseFloat(input.value);
          out.textContent = input.value;
          onChange();
        };
        row.appendChild(input);
        row.appendChild(out);
      } else if (f.t === 'select') {
        var sel = document.createElement('select');
        f.opts.forEach(function (o) {
          var op = document.createElement('option');
          op.value = o[0]; op.textContent = o[1];
          if (String(values[f.k]) === String(o[0])) op.selected = true;
          sel.appendChild(op);
        });
        sel.onchange = function () { values[f.k] = sel.value; onChange(); };
        row.appendChild(sel);
      } else if (f.t === 'check') {
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = !!values[f.k];
        cb.onchange = function () { values[f.k] = cb.checked; onChange(); };
        row.appendChild(cb);
      } else if (f.t === 'color') {
        var col = document.createElement('input');
        col.type = 'color';
        col.value = values[f.k];
        col.oninput = function () { values[f.k] = col.value; onChange(); };
        row.appendChild(col);
      } else if (f.t === 'text') {
        var tx = document.createElement('input');
        tx.type = 'text';
        tx.value = values[f.k];
        tx.oninput = function () { values[f.k] = tx.value; onChange(); };
        row.appendChild(tx);
      } else if (f.t === 'file') {
        var fl = document.createElement('input');
        fl.type = 'file';
        fl.accept = 'image/*';
        if (f.multiple) fl.multiple = true;
        fl.onchange = function () { values[f.k] = fl.files; onChange(); };
        row.appendChild(fl);
      }
      host.appendChild(row);
    });
  }

  /* ----------------------------------------------------------------- dialog */

  var activeOverlay = null;

  function closeDialog() {
    if (activeOverlay) { activeOverlay.remove(); activeOverlay = null; }
    document.removeEventListener('keydown', escKey, true);
  }

  function escKey(e) {
    if (e.key === 'Escape') { e.stopPropagation(); closeDialog(); }
  }

  function openTool(id) {
    var tool = null;
    TOOLS.forEach(function (t) { if (t.id === id) tool = t; });
    if (!tool) return;
    closeDialog();

    var values = {};
    tool.fields.forEach(function (f) { values[f.k] = f.def; });

    var overlay = document.createElement('div');
    overlay.className = 'overlay nb-overlay';
    overlay.innerHTML =
      '<div class="modal nb-modal">' +
      '<h3><i class="nb-ico">' + tool.icon + '</i> ' + tool.name +
      ' <small class="nb-tag">' + toolText(tool.id, 'tag', tool.tag) + '</small></h3>' +
      '<div class="content nb-body">' +
      '<div class="nb-stage"><div class="nb-canvas-wrap"><canvas id="nb-preview" width="320" height="320"></canvas></div>' +
      '<p class="nb-note" id="nb-note">' + toolText(tool.id, 'desc', '') + '</p></div>' +
      '<div class="nb-controls">' +
      '<div class="nb-source" id="nb-source-row">' +
      '<span class="nb-label">' + T('ui.source', 'Source') + '</span>' +
      '<select id="nb-source"><option value="design">' + T('ui.design', 'Whole design') + '</option>' +
      '<option value="layer">' + T('ui.layer', 'Active layer') + '</option></select>' +
      '</div>' +
      '<div id="nb-fields"></div>' +
      '<div class="nb-swatches" id="nb-swatches"></div>' +
      '</div></div>' +
      '<div class="actions">' +
      '<button class="btn" data-close>' + T('ui.close', 'Close') + '</button>' +
      '<button class="btn" data-newdoc hidden>' + T('ui.newdoc', 'Open as new document') + '</button>' +
      '<button class="btn" data-download hidden>' + T('ui.download', 'Download') + '</button>' +
      '<button class="btn primary" data-apply>' + T('ui.apply', 'Add as new layer') + '</button>' +
      '</div></div>';
    document.body.appendChild(overlay);
    activeOverlay = overlay;
    document.addEventListener('keydown', escKey, true);
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) closeDialog(); });

    var cv = byId('nb-preview');
    var note = byId('nb-note');
    var applyBtn = overlay.querySelector('[data-apply]');
    var downloadBtn = overlay.querySelector('[data-download]');
    var newdocBtn = overlay.querySelector('[data-newdoc]');
    var swatches = byId('nb-swatches');

    var lastResult = null;
    var lastFile = null;
    var timer = null;

    if (tool.kind === 'palette') { applyBtn.textContent = T('ui.usePalette', 'Use as palette'); }

    function drawPreview(img) {
      var ctx = cv.getContext('2d');
      var box = 320;
      var scale = Math.min(box / img.width, box / img.height, 4);
      cv.width = Math.max(1, Math.round(img.width * scale));
      cv.height = Math.max(1, Math.round(img.height * scale));
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.imageSmoothingEnabled = scale < 1;
      ctx.drawImage(toCanvas(img), 0, 0, cv.width, cv.height);
    }

    function refresh() {
      var src = sourceData(byId('nb-source').value);
      if (!src) { note.textContent = T('ui.noSource', 'Nothing to work with yet — draw something first'); return; }
      var small = thumb(src, 460);
      var result;
      try {
        result = tool.run(small, values);
      } catch (err) {
        note.textContent = 'Error: ' + (err && err.message ? err.message : err);
        return;
      }
      Promise.resolve(result).then(function (res) {
        lastResult = res;
        if (res && res.img) {
          drawPreview(res.img);
          applyBtn.hidden = false;
          downloadBtn.hidden = true;
          newdocBtn.hidden = !tool.newDoc || (res.img.width === src.width && res.img.height === src.height);
        } else if (res && res.blob) {
          lastFile = res;
          cv.width = 320; cv.height = 180;
          var c2 = cv.getContext('2d');
          c2.clearRect(0, 0, 320, 180);
          c2.fillStyle = '#0f1116';
          c2.fillRect(0, 0, 320, 180);
          c2.fillStyle = '#6ee7b7';
          c2.font = '600 16px system-ui, sans-serif';
          c2.textAlign = 'center';
          c2.fillText(res.filename, 160, 90);
          applyBtn.hidden = true;
          downloadBtn.hidden = false;
          newdocBtn.hidden = true;
        } else if (res && res.palette) {
          renderSwatches(res.palette, res.harmony);
          cv.width = 320; cv.height = 120;
          var c3 = cv.getContext('2d');
          c3.clearRect(0, 0, 320, 120);
          c3.fillStyle = '#0f1116';
          c3.fillRect(0, 0, 320, 120);
          applyBtn.hidden = false;
          downloadBtn.hidden = true;
          newdocBtn.hidden = true;
        }
        if (res && res.note) note.textContent = res.note;
        else if (res && res.done) note.textContent = res.note || '';
      }).catch(function (err) {
        note.textContent = (err && err.message) ? err.message : 'That did not work';
      });
    }

    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(refresh, 180);
    }

    function renderSwatches(list, harm) {
      swatches.innerHTML = '';
      var add = function (colors, label) {
        if (!colors || !colors.length) return;
        var head = document.createElement('div');
        head.className = 'nb-swatch-head';
        head.textContent = label;
        swatches.appendChild(head);
        var row = document.createElement('div');
        row.className = 'nb-swatch-row';
        colors.forEach(function (hex) {
          var b = document.createElement('button');
          b.className = 'nb-swatch';
          b.style.background = hex;
          b.title = hex + ' · contrast ' + N.contrastRatio(hex, '#ffffff').toFixed(1) + ':1 on white';
          b.onclick = function () {
            if (app()) app().setColour(hex);
            note.textContent = hex + ' set as the primary colour';
          };
          row.appendChild(b);
        });
        swatches.appendChild(row);
      };
      add(list, T('ui.fromImage', 'From the image'));
      add(harm, T('ui.harmony', 'Harmony'));
      if (harm && harm.length) {
        var use = document.createElement('button');
        use.className = 'btn';
        use.textContent = T('ui.useHarmony', 'Use the harmony as palette');
        use.onclick = function () { if (app()) app().usePalette(harm); note.textContent = T('ui.paletteSet', 'Palette replaced'); };
        swatches.appendChild(use);
      }
    }

    renderFields(byId('nb-fields'), tool.fields, values, schedule);

    var srcSel = byId('nb-source');
    srcSel.onchange = schedule;
    if (tool.source === 'design') srcSel.value = 'design';

    overlay.querySelector('[data-close]').onclick = closeDialog;
    downloadBtn.onclick = function () {
      if (!lastFile) return;
      download(lastFile.blob, lastFile.filename);
      if (app()) app().toast('Saved ' + lastFile.filename);
    };
    newdocBtn.onclick = function () {
      if (!lastResult || !lastResult.img) return;
      if (app()) { app().newDocumentFrom(lastResult.img); closeDialog(); }
    };
    applyBtn.onclick = function () {
      var a = app();
      if (!a) return;
      if (tool.kind === 'palette') {
        /* the extracted colours become the palette; the harmony has its own button */
        if (lastResult && lastResult.palette) a.usePalette(lastResult.palette);
        a.showColourTab();
        a.toast('Palette updated');
        closeDialog();
        return;
      }
      /* apply always works at full resolution, not on the preview */
      var full = sourceData(srcSel.value);
      if (!full) return;
      var result;
      try {
        result = tool.run(full, values);
      } catch (err) {
        a.toast('Tool failed: ' + (err && err.message ? err.message : err));
        return;
      }
      Promise.resolve(result).then(function (res) {
        if (!res || !res.img) return;
        if (res.img.width !== full.width || res.img.height !== full.height) {
          a.newDocumentFrom(res.img);
          a.toast(tool.name + ' opened as a new document');
        } else {
          a.addImageLayer(res.img, tool.name.replace('Nirbhar ', '') + ' · ' + tool.tag);
          a.toast(tool.name + ' added as a new layer');
        }
        closeDialog();
      }).catch(function (err) {
        a.toast('Tool failed: ' + (err && err.message ? err.message : err));
      });
    };

    refresh();
  }

  /* ------------------------------------------------------------------ manual */

  function parseManual(text) {
    /* sections are marked with @@KEY lines so one translation keeps structure */
    var out = {};
    var key = null;
    String(text || '').split('\n').forEach(function (line) {
      var m = /^@@([A-Z_]+)\s*$/.exec(line.trim());
      if (m) { key = m[1]; out[key] = []; return; }
      if (key) out[key].push(line);
    });
    Object.keys(out).forEach(function (k) {
      out[k] = out[k].join('\n').replace(/^\n+|\n+$/g, '');
    });
    return out;
  }

  function manualHtml() {
    var bundle = I18N.langs[lang] || I18N.langs.en || {};
    var m = parseManual(bundle.manual || '');
    var en = parseManual((I18N.langs.en || {}).manual || '');
    var get = function (k) { return m[k] || en[k] || ''; };

    var html = '<div class="nb-manual">';
    html += '<div class="nb-manual-langs">';
    I18N.order.forEach(function (code) {
      html += '<button class="nb-langbtn' + (code === lang ? ' on' : '') + '" data-nb-lang="' + code + '">' +
        (I18N.names[code] || code) + '</button>';
    });
    html += '</div>';
    html += '<h4>' + (get('TITLE') || 'Nirbhar manual') + '</h4>';
    html += '<p>' + escHtml(get('INTRO')) + '</p>';
    html += '<h5>' + escHtml(get('START_H') || 'Start') + '</h5>';
    html += '<ol>' + (get('START') || '').split('\n').filter(Boolean).map(function (l) {
      return '<li>' + escHtml(l.replace(/^[-*]\s*/, '')) + '</li>';
    }).join('') + '</ol>';
    html += '<h5>' + escHtml(get('TOOLS_H') || 'The tools') + '</h5>';
    html += '<div class="nb-manual-tools">';
    TOOLS.forEach(function (tool) {
      html += '<div class="nb-manual-tool"><b>' + tool.icon + ' ' + tool.name + '</b>' +
        '<span>' + escHtml(get('TOOL_' + tool.id.toUpperCase()) || toolText(tool.id, 'desc', tool.tag)) + '</span>' +
        '<small>' + escHtml(get('HOW_' + tool.id.toUpperCase()) || '') + '</small></div>';
    });
    html += '</div>';
    html += '<h5>' + escHtml(get('TIPS_H') || 'Tips') + '</h5>';
    html += '<ul>' + (get('TIPS') || '').split('\n').filter(Boolean).map(function (l) {
      return '<li>' + escHtml(l.replace(/^[-*]\s*/, '')) + '</li>';
    }).join('') + '</ul>';
    html += '<p class="nb-manual-foot">' + escHtml(get('OFFLINE') || '') + '</p>';
    html += '</div>';
    return html;
  }

  function escHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function openManual() {
    closeDialog();
    var overlay = document.createElement('div');
    overlay.className = 'overlay nb-overlay';
    overlay.innerHTML = '<div class="modal nb-modal nb-modal-wide">' +
      '<h3>' + T('ui.manualTitle', 'Nirbhar manual') + '</h3>' +
      '<div class="content nb-manual-wrap">' + manualHtml() + '</div>' +
      '<div class="actions"><button class="btn primary" data-close>' + T('ui.close', 'Close') + '</button></div></div>';
    document.body.appendChild(overlay);
    activeOverlay = overlay;
    document.addEventListener('keydown', escKey, true);
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) closeDialog(); });
    overlay.querySelector('[data-close]').onclick = closeDialog;
    overlay.querySelectorAll('[data-nb-lang]').forEach(function (b) {
      b.onclick = function () {
        setLang(b.getAttribute('data-nb-lang'));
        overlay.querySelector('.nb-manual-wrap').innerHTML = manualHtml();
        openManualBound(overlay);
      };
    });
    openManualBound(overlay);
  }

  function openManualBound(overlay) {
    overlay.querySelectorAll('[data-nb-lang]').forEach(function (b) {
      b.onclick = function () {
        setLang(b.getAttribute('data-nb-lang'));
        overlay.querySelector('.nb-manual-wrap').innerHTML = manualHtml();
        openManualBound(overlay);
      };
    });
    overlay.querySelector('[data-close]').onclick = closeDialog;
  }

  /* -------------------------------------------------------------------- boot */

  function boot() {
    buildHub();
    var card = byId('start-nirbhar');
    if (card) card.onclick = function () {
      var a = app();
      if (a) a.openTab('nirbhar');
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.PSNirbharUI = {
    openTool: openTool,
    openManual: openManual,
    tools: TOOLS,
    setLanguage: setLang,
    get language() { return lang; }
  };
})();
