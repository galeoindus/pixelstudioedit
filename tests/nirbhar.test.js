// Unit tests for the Nirbhar engine: js/nirbhar.js
// Run with: node --test tests/nirbhar.test.js
const test = require('node:test');
const assert = require('node:assert');
const N = require('../js/nirbhar.js');

function img(w, h, fn) {
  const out = { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = fn(x, y);
      const i = (y * w + x) * 4;
      out.data[i] = c[0]; out.data[i + 1] = c[1]; out.data[i + 2] = c[2];
      out.data[i + 3] = c.length > 3 ? c[3] : 255;
    }
  }
  return out;
}

const px = (im, x, y) => {
  const i = (y * im.width + x) * 4;
  return [im.data[i], im.data[i + 1], im.data[i + 2], im.data[i + 3]];
};

// white frame with a red square in the middle
const subject = () => img(40, 40, (x, y) => (x > 12 && x < 28 && y > 12 && y < 28 ? [220, 30, 40] : [250, 250, 250]));

test('colour helpers round-trip', () => {
  assert.deepStrictEqual(N.hexToRgb('#6ee7b7'), [110, 231, 183]);
  assert.strictEqual(N.rgbToHex(110, 231, 183), '#6ee7b7');
  assert.strictEqual(N.rgbToHex(300, -5, 0), '#ff0000');
});

test('cutout keeps the subject and clears the background', () => {
  const out = N.cutout(subject(), { mode: 'corners', tolerance: 20, feather: 1 });
  assert.strictEqual(px(out.img, 20, 20)[3], 255, 'subject stays opaque');
  assert.strictEqual(px(out.img, 1, 1)[3], 0, 'corner background is cleared');
  assert.ok(out.removed > 0.6, 'most of the frame is background');
  assert.strictEqual(out.key, '#fafafa');
});

test('cutout on a colour key removes that colour only', () => {
  const im = img(10, 10, (x) => (x < 5 ? [0, 120, 255] : [255, 255, 255]));
  const out = N.cutout(im, { mode: 'color', color: '#0078ff', tolerance: 10, feather: 0 });
  assert.strictEqual(px(out.img, 1, 5)[3], 0);
  assert.strictEqual(px(out.img, 8, 5)[3], 255);
});

test('stats and autoEnhance report a recipe', () => {
  const s = N.stats(subject());
  assert.ok(s.mean > 100 && s.mean < 255);
  assert.ok(s.colorfulness > 0);
  const res = N.autoEnhance(subject());
  assert.strictEqual(res.img.width, 40);
  assert.ok(res.recipe && typeof res.recipe.sharpen === 'number');
});

test('autoLevels stretches a low-contrast image', () => {
  const flat = img(8, 8, () => [120, 120, 120]);
  const before = N.stats(flat).contrast;
  N.autoLevels(flat);
  assert.ok(N.stats(flat).contrast >= before);
});

test('unsharp and clarity run without changing the size', () => {
  const im = subject();
  assert.strictEqual(N.unsharp(im, 80, 1).width, 40);
  assert.strictEqual(N.clarity(im, 40).width, 40);
  assert.strictEqual(N.denoise(im, 40).width, 40);
  assert.strictEqual(N.dehaze(im, 40).width, 40);
});

test('upscale honours the factor and the pixel-art kernel', () => {
  const im = subject();
  assert.strictEqual(N.upscale(im, 2, 'epx').width, 80);
  assert.strictEqual(N.upscale(im, 3, 'lanczos3').width, 120);
  assert.strictEqual(N.upscale(im, 4, 'nearest').height, 160);
  const epx = N.upscale(im, 2, 'epx');
  assert.strictEqual(px(epx, 40, 40)[3], 255, 'EPX keeps the subject solid');
});

test('resize keeps a 1px black dot black with nearest', () => {
  const dot = img(2, 2, (x, y) => (x === 0 && y === 0 ? [0, 0, 0] : [255, 255, 255]));
  const up = N.resize(dot, 4, 4, 'nearest');
  assert.strictEqual(px(up, 0, 0)[0], 0);
  assert.strictEqual(px(up, 3, 3)[0], 255);
});

test('tone treatments produce images of the same size', () => {
  const im = subject();
  assert.strictEqual(N.halftone(im, { cell: 4 }).width, 40);
  assert.strictEqual(N.duotone(im, '#000000', '#ffffff').width, 40);
  assert.strictEqual(N.gradientMap(im, [{ t: 0, color: '#000000' }, { t: 1, color: '#ffffff' }]).width, 40);
  assert.strictEqual(N.sketch(im, {}).width, 40);
  assert.strictEqual(N.colorBlind(im, 'deuteranopia').width, 40);
});

test('duotone maps black to the dark stop', () => {
  const black = img(2, 2, () => [0, 0, 0]);
  const out = N.duotone(black, '#102030', '#ffffff');
  assert.deepStrictEqual(px(out, 0, 0).slice(0, 3), [16, 32, 48]);
});

test('seamless tiling leaves the size alone', () => {
  const out = N.makeSeamless(subject(), 4);
  assert.strictEqual(out.width, 40);
  assert.strictEqual(out.height, 40);
});

test('palette extraction finds the two real colours', () => {
  const pal = N.extractPalette(subject(), 2);
  assert.strictEqual(pal.length, 2);
  const set = pal.map((h) => h.toLowerCase());
  assert.ok(set.includes('#fafafa'), 'white background found: ' + set.join(','));
});

test('harmonies and contrast are correct', () => {
  const triad = N.harmony('#3366cc', 'triad');
  assert.strictEqual(triad.length, 3);
  assert.ok(Math.abs(N.contrastRatio('#ffffff', '#000000') - 21) < 0.01);
  assert.strictEqual(N.bestTextColor('#ffffff'), '#141418');
  assert.strictEqual(N.bestTextColor('#111111'), '#ffffff');
});

test('buildPdf writes a valid multi-page file', () => {
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
  const bytes = N.buildPdf([
    { jpeg, width: 100, height: 100 },
    { jpeg, width: 200, height: 100 }
  ], { pageSize: 'a4', margin: 20 });
  const text = Buffer.from(bytes).toString('latin1');
  assert.ok(text.startsWith('%PDF-1.4'));
  assert.ok(text.trimEnd().endsWith('%%EOF'));
  assert.strictEqual((text.match(/\/Type \/Page[^s]/g) || []).length, 2, 'two page objects');
  assert.ok(/startxref\n\d+/.test(text), 'startxref present');
  assert.ok(text.includes('/Filter /DCTDecode'));
});

test('buildPdf honours landscape and page size', () => {
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
  const bytes = N.buildPdf([{ jpeg, width: 10, height: 10 }], { pageSize: 'a4', landscape: true });
  const text = Buffer.from(bytes).toString('latin1');
  assert.ok(text.includes('/MediaBox [0 0 841.89 595.28]'), 'landscape A4 media box');
});

test('buildIco writes a container header and offsets', () => {
  const png1 = new Uint8Array([1, 2, 3, 4]);
  const png2 = new Uint8Array([5, 6]);
  const ico = N.buildIco([
    { png: png1, width: 16, height: 16 },
    { png: png2, width: 256, height: 256 }
  ]);
  assert.strictEqual(ico.length, 6 + 32 + 6);
  assert.strictEqual(ico[2], 1, 'type is icon');
  assert.strictEqual(ico[4], 2, 'two images');
  assert.strictEqual(ico[6], 16, 'first entry is 16px');
  assert.strictEqual(ico[6 + 16], 0, '256px is written as 0');
  const offset = ico[6 + 12] | (ico[6 + 13] << 8);
  assert.strictEqual(offset, 6 + 32, 'first payload starts after the directory');
});

test('objectsToSvg keeps text and shapes editable', () => {
  const svg = N.objectsToSvg([
    { type: 'text', text: 'Hi\nthere', x: 4, y: 20, size: 12, color: '#ffffff', font: 'Bungee', bold: true },
    { type: 'shape', shape: 'rect', x: 2, y: 2, w: 10, h: 10, filled: true, color: '#ff0000' }
  ], { width: 64, height: 64, background: '#000000' });
  assert.ok(svg.startsWith('<?xml'));
  assert.ok(svg.includes('<svg'));
  assert.ok(svg.includes('<text'));
  assert.ok(svg.includes('<tspan'));
  assert.ok(svg.includes('<rect'));
  assert.ok(svg.includes('font-family:Bungee'));
  assert.ok(svg.trimEnd().endsWith('</svg>'));
});

test('objectsToSvg escapes user text', () => {
  const svg = N.objectsToSvg([{ type: 'text', text: '<script>', x: 0, y: 10, size: 8 }], { width: 10, height: 10 });
  assert.ok(svg.includes('&lt;script&gt;'));
  assert.ok(!svg.includes('<script>'));
});

test('generative art is deterministic per prompt and seed', () => {
  const a = N.artFromPrompt('sunset over goa', { width: 32, height: 32, style: 'mesh' });
  const b = N.artFromPrompt('sunset over goa', { width: 32, height: 32, style: 'mesh' });
  assert.strictEqual(a.seed, b.seed);
  assert.deepStrictEqual(Array.from(a.img.data.slice(0, 64)), Array.from(b.img.data.slice(0, 64)));
  assert.ok(a.palette.length >= 3);
  for (const style of N.ART_STYLES) {
    const out = N.artFromPrompt('test', { width: 16, height: 16, style });
    assert.strictEqual(out.img.width, 16, style);
    assert.strictEqual(out.style, style);
  }
});

test('passport sheet has the requested grid', () => {
  const sheet = N.idSheet(subject(), { photoW: 20, photoH: 26, cols: 2, rows: 3, gap: 4 });
  assert.strictEqual(sheet.width, 2 * 20 + 3 * 4);
  assert.strictEqual(sheet.height, 3 * 26 + 4 * 4);
  assert.strictEqual(px(sheet, 1, 1)[3], 255, 'sheet background is opaque');
});

test('coverCrop fills the frame at the requested aspect', () => {
  const out = N.coverCrop(subject(), 10, 20);
  assert.strictEqual(out.width, 10);
  assert.strictEqual(out.height, 20);
});

test('watermark tiling and rotation keep the canvas size', () => {
  const stamp = img(10, 4, () => [255, 255, 255, 255]);
  const out = N.tileStamp(subject(), N.rotate(stamp, 30, { expand: true }), { gapX: 12, gapY: 12, opacity: 0.5 });
  assert.strictEqual(out.width, 40);
  assert.strictEqual(out.height, 40);
});

test('overlay blends with the given opacity', () => {
  const base = img(2, 2, () => [0, 0, 0, 255]);
  const top = img(2, 2, () => [255, 255, 255, 255]);
  const out = N.overlay(base, top, { opacity: 0.5 });
  assert.ok(px(out, 0, 0)[0] > 120 && px(out, 0, 0)[0] < 135);
});

test('contact sheet lays images in a grid', () => {
  const a = img(4, 4, () => [255, 0, 0]);
  const sheet = N.contactSheet([a, a, a], { cols: 2, gap: 2, cellW: 4, cellH: 4 });
  assert.strictEqual(sheet.width, 10);
  assert.strictEqual(sheet.height, 10);
});

test('fitBox never returns a zero dimension', () => {
  const box = N.fitBox({ width: 100, height: 50 }, 10, 10, 'fit');
  assert.strictEqual(box.width, 10);
  assert.strictEqual(box.height, 5);
});

/* ---------------------------------------------- cut refinement and background */

test('refineCut drops specks and fills holes inside the subject', () => {
  const messy = img(60, 60, (x, y) => {
    if (x === 2 && y === 2) return [220, 30, 40];                 // stray speck
    const body = x > 15 && x < 45 && y > 15 && y < 45;
    const hole = x > 27 && x < 33 && y > 27 && y < 33;
    if (body && !hole) return [220, 30, 40];
    return [250, 250, 250, 0];                                     // transparent bg
  });
  const out = N.refineCut(messy, { minArea: 0.002, fillHoles: true });
  assert.strictEqual(px(out, 2, 2)[3], 0, 'speck removed');
  assert.strictEqual(px(out, 30, 30)[3], 255, 'hole filled');
  assert.strictEqual(px(out, 20, 20)[3], 255, 'subject kept');
  assert.strictEqual(px(out, 30, 30)[0], 220, 'hole takes the colour around it');
});

test('refineCut keeps a large second subject', () => {
  const two = img(80, 40, (x) => {
    if (x > 5 && x < 30) return [10, 200, 10];
    if (x > 50 && x < 75) return [10, 10, 200];
    return [255, 255, 255, 0];
  });
  const out = N.refineCut(two, { minArea: 0.02, fillHoles: false });
  assert.strictEqual(px(out, 15, 20)[3], 255, 'first subject kept');
  assert.strictEqual(px(out, 60, 20)[3], 255, 'second subject kept');
});

test('backdrop paints a solid background behind a cutout', () => {
  const cut = img(20, 20, (x, y) => (x > 5 && x < 15 && y > 5 && y < 15 ? [255, 0, 0, 255] : [0, 0, 0, 0]));
  const out = N.backdrop(cut, { mode: 'color', color: '#0a3d62' });
  assert.deepStrictEqual(px(out, 1, 1).slice(0, 4), [10, 61, 98, 255]);
  assert.deepStrictEqual(px(out, 10, 10).slice(0, 3), [255, 0, 0]);
});

test('backdrop draws a shadow outside the subject', () => {
  const cut = img(30, 30, (x, y) => (x > 10 && x < 20 && y > 10 && y < 20 ? [255, 255, 255, 255] : [0, 0, 0, 0]));
  const plain = N.backdrop(cut, { mode: 'color', color: '#ffffff' });
  const shaded = N.backdrop(cut, { mode: 'color', color: '#ffffff', shadow: { blur: 4, dy: 5, opacity: 0.6 } });
  assert.strictEqual(px(plain, 15, 24)[0], 255, 'plain background is white below the subject');
  assert.ok(px(shaded, 15, 24)[0] < 240, 'shadow darkens below the subject');
});

test('backdrop keeps transparency when the mode is none', () => {
  const cut = img(10, 10, (x) => (x < 5 ? [9, 9, 9, 255] : [0, 0, 0, 0]));
  const out = N.backdrop(cut, { mode: 'none' });
  assert.strictEqual(px(out, 8, 5)[3], 0);
});

/* ------------------------------------------------------------------ zip pack */

test('zip writes a readable archive with a CRC for each file', () => {
  const files = [
    { name: 'a.txt', data: new Uint8Array([104, 105]) },
    { name: 'b.bin', data: new Uint8Array([1, 2, 3, 4, 5]) }
  ];
  const bytes = N.zip(files);
  const text = Buffer.from(bytes).toString('latin1');
  assert.strictEqual(bytes[0], 0x50);
  assert.strictEqual(bytes[1], 0x4b);
  assert.strictEqual((text.match(/PK\x03\x04/g) || []).length, 2, 'two local headers');
  assert.strictEqual((text.match(/PK\x01\x02/g) || []).length, 2, 'two central entries');
  assert.ok(text.includes('PK\x05\x06'), 'end of central directory');
  assert.ok(text.includes('a.txt') && text.includes('b.bin'));
  assert.strictEqual(N.crc32(new Uint8Array([104, 105])), 0xd8932aac, "CRC-32 matches zlib for \"hi\"");
});

/* -------------------------------------------------------------------- collage */

test('collage lays photos on a grid with gaps', () => {
  const a = img(20, 10, () => [255, 0, 0]);
  const b = img(10, 20, () => [0, 0, 255]);
  const out = N.collage([a, b, a, b], { cols: 2, cellW: 20, cellH: 20, gap: 4, bg: '#101010' });
  assert.strictEqual(out.width, 2 * 20 + 3 * 4);
  assert.strictEqual(out.height, 2 * 20 + 3 * 4);
  assert.strictEqual(px(out, 2, 2)[3], 255, 'background is opaque');
  assert.deepStrictEqual(px(out, 12, 12).slice(0, 3), [255, 0, 0], 'first cell holds the first photo');
});

test('collage survives a single image and an empty list', () => {
  const one = img(8, 8, () => [1, 2, 3]);
  assert.strictEqual(N.collage([one], { cols: 1, cellW: 8, cellH: 8, gap: 0 }).width, 8);
  assert.strictEqual(N.collage([], {}).width, 1);
});
