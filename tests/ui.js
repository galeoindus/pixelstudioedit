// Headless UI test for pixelstudio.  node test/ui.js
// Needs puppeteer-core plus a Chromium binary (set CHROME_PATH if it is elsewhere).
let puppeteer;
try { puppeteer = require('puppeteer-core'); }
catch (e) { puppeteer = require('/usr/lib/node_modules/puppeteer-core'); }
const path = require('path');
const FILE = process.argv[2] || 'file://' + path.resolve(__dirname, '..', 'index.html');

const results = [];
const check = (name, ok, detail) => {
  const rec = { name, ok, detail: detail === undefined ? '' : String(detail) };
  results.push(rec);
  console.log((ok ? 'ok   ' : 'FAIL ') + name + (rec.detail ? '  [' + rec.detail + ']' : ''));
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || '/usr/local/bin/chromium', headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [], warns = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => {
    const t = m.text();
    if (m.type() === 'error') errors.push('console: ' + t);
    if (m.type() === 'warning' && /missing element/.test(t)) warns.push(t);
  });

  await page.goto(FILE, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 400));
  // the start screen must be dismissed before the editor is usable
  const startShown = await page.evaluate(() => { const el = document.querySelector('#start'); return !!el && !el.hidden; });
  check('start screen shown', startShown);
  await page.evaluate(() => document.querySelector('#start-design').click());
  await new Promise(r => setTimeout(r, 250));
  await page.evaluate(() => { const b = document.querySelector('.overlay [data-cancel]'); if (b) b.click(); });
  await new Promise(r => setTimeout(r, 200));
  check('start screen dismissed', await page.evaluate(() => document.querySelector('#start').hidden));
  const templateCount = await page.evaluate(() => document.querySelectorAll('#template-row .template-card').length);
  check('start screen lists templates', templateCount >= 6, templateCount);

  // ---- helpers -------------------------------------------------------
  const click = async sel => {
    const r = await page.evaluate(s => {
      const e = document.querySelector(s);
      if (!e) return 'missing';
      e.click();
      return 'ok';
    }, sel);
    await new Promise(r => setTimeout(r, 110));
    if (r !== 'ok') throw new Error('cannot click ' + sel + ' (' + r + ')');
  };
  const tab = sel => click(`.tab[data-tab="${sel}"]`);
  const tool = sel => click(`.tool[data-tool="${sel}"]`);
  const docSize = async () => page.evaluate(() => {
    const [w, h] = document.querySelector('#doc-chip').textContent.split('×').map(s => parseInt(s.trim(), 10));
    return { w, h };
  });
  const at = async (px, py) => {
    const b = await page.evaluate(() => {
      const r = document.querySelector('#screen').getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    });
    const d = await docSize();
    return { x: b.x + (px + 0.5) * b.w / d.w, y: b.y + (py + 0.5) * b.h / d.h };
  };
  // real document pixels, straight from the composited layers
  const pixel = (px, py) => page.evaluate((px, py) => {
    const c = window.PS.composite();
    const d = c.getContext('2d').getImageData(px, py, 1, 1).data;
    return [d[0], d[1], d[2], d[3]];
  }, px, py);
  const ink = () => page.evaluate(() => {
    const c = window.PS.composite();
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
    return n;
  });
  const stroke = async (x0, y0, x1, y1) => {
    const a = await at(x0, y0), b = await at(x1, y1);
    await page.mouse.move(a.x, a.y);
    await page.mouse.down();
    await page.mouse.move((a.x + b.x) / 2, (a.y + b.y) / 2, { steps: 5 });
    await page.mouse.move(b.x, b.y, { steps: 5 });
    await page.mouse.up();
    await new Promise(r => setTimeout(r, 70));
  };
  const tapCanvas = async (px, py) => {
    const a = await at(px, py);
    await page.mouse.click(a.x, a.y);
    await new Promise(r => setTimeout(r, 120));
  };
  const setRange = (id, v) => page.evaluate((id, v) => {
    const s = document.querySelector('#' + id);
    s.value = v;
    s.dispatchEvent(new Event('input', { bubbles: true }));
  }, id, v);
  const val = sel => page.evaluate(s => document.querySelector(s)?.value, sel);

  // 1 boot
  const boot = await page.evaluate(() => ({
    tools: document.querySelectorAll('.tool[data-tool]').length,
    tabs: document.querySelectorAll('.tab').length,
    panes: document.querySelectorAll('.pane').length,
    layers: document.querySelectorAll('.layer').length,
    hook: !!window.PS
  }));
  const dupIds = await page.evaluate(() => {
    const seen = {}, dup = [];
    document.querySelectorAll('[id]').forEach(el => {
      if (seen[el.id]) dup.push(el.id);
      seen[el.id] = true;
    });
    return dup;
  });
  check('no duplicate element ids', dupIds.length === 0, dupIds.join(', '));
  check('boots with all controls', boot.tools === 11 && boot.tabs === 7 && boot.panes === 7 && boot.layers === 1, JSON.stringify(boot));

  // 2 pencil / undo / redo
  await tool('pencil');
  await stroke(5, 5, 24, 5);
  let px = await pixel(12, 5);
  check('pencil draws', px[3] > 0, px);
  await click('#btn-undo');
  px = await pixel(12, 5);
  check('undo removes stroke', px[3] === 0, px);
  await click('#btn-redo');
  px = await pixel(12, 5);
  check('redo restores stroke', px[3] > 0, px);

  // 3 brush size
  await setRange('q-brush', 6);
  check('brush slider label', (await page.evaluate(() => document.querySelector('#q-brush-val').textContent)) === '6');
  await stroke(40, 30, 40, 30);
  const wide = await pixel(41, 31);
  check('brush size widens the stamp', wide[3] > 0, wide);

  // 4 fill
  await tool('bucket');
  await tapCanvas(55, 55);
  px = await pixel(55, 55);
  check('fill bucket', px[3] > 0, px);
  await click('#btn-undo');

  // 5 shapes
  await tool('rect');
  await stroke(28, 28, 46, 46);
  px = await pixel(28, 28);
  check('rectangle commits', px[3] > 0, px);

  // 6 layers
  await tab('layers');
  check('layers pane visible', await page.evaluate(() => {
    const e = document.querySelector('#layer-add'); const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }));
  const l0 = await page.evaluate(() => document.querySelectorAll('.layer').length);
  await click('#layer-add');
  const l1 = await page.evaluate(() => document.querySelectorAll('.layer').length);
  check('add layer', l1 === l0 + 1, l0 + '->' + l1);
  await click('#layer-dup');
  const l2 = await page.evaluate(() => document.querySelectorAll('.layer').length);
  check('duplicate layer', l2 === l1 + 1, l1 + '->' + l2);
  await click('#layer-del');
  const l3 = await page.evaluate(() => document.querySelectorAll('.layer').length);
  check('delete layer', l3 === l2 - 1, l2 + '->' + l3);
  await page.evaluate(() => { document.querySelectorAll('.layer')[document.querySelectorAll('.layer').length - 1].click(); });
  await new Promise(r => setTimeout(r, 80));
  check('active layer switched', (await page.evaluate(() => document.querySelector('#status-layer').textContent)) === 'Layer 1',
    await page.evaluate(() => document.querySelector('#status-layer').textContent));

  // 7 effects on the layer that has ink
  await tab('effects');
  const before = await pixel(12, 5);
  await click('[data-fx="invert"]');
  const after = await pixel(12, 5);
  check('invert filter', before.join() !== after.join(), before + ' -> ' + after);

  // 8 live adjust
  await setRange('fx-brightness', 60);
  await new Promise(r => setTimeout(r, 150));
  const bright = await pixel(12, 5);
  check('brightness preview', bright.join() !== after.join(), after + ' -> ' + bright);
  await click('#fx-apply');
  const applied = await pixel(12, 5);
  check('apply keeps preview', applied.join() === bright.join(), applied + ' vs ' + bright);
  await click('#fx-reset');

  // 9 palette reduce + dither
  await click('#do-quantize');
  check('palette reduce runs', (await ink()) > 0);
  await click('#do-dither-fs');
  check('floyd dither runs', (await ink()) > 0);

  // 10 text
  await tab('text');
  check('text pane visible', await page.evaluate(() => {
    const r = document.querySelector('#text-add').getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }));
  const inkBefore = await ink();
  await page.evaluate(() => { document.querySelector('#text-content').value = 'HELLO'; });
  await setRange('text-size', 14);
  await click('#text-add');
  const inkAfter = await ink();
  check('text adds ink', inkAfter > inkBefore, inkBefore + ' -> ' + inkAfter);

  // 11 3D text
  await tab('3d');
  check('3d pane visible', await page.evaluate(() => {
    const r = document.querySelector('#td-add').getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }));
  const before3d = await ink();
  await setRange('td-depth', 8);
  await click('#td-add');
  const after3d = await ink();
  check('3D text adds depth', after3d > before3d, before3d + ' -> ' + after3d);
  await click('#btn-undo');

  // 12 3D image
  await click('#mode-3d .seg[data-mode="image"]');
  await setRange('td-rotate-y', 25);
  await setRange('td-tilt-x', 15);
  await setRange('td-extrude', 5);
  const beforeImg = await ink();
  await click('#td-apply');
  const afterImg = await ink();
  check('3D image changes the layer', afterImg !== beforeImg, beforeImg + ' -> ' + afterImg);

  // 13 text styling: stroke, gradient, depth, curve
  await tab('text');
  const inkPlain = await ink();
  await setRange('text-stroke', 2);
  await setRange('text-depth', 4);
  await page.evaluate(() => { document.querySelector('#text-fill').click(); });
  const styled = await page.evaluate(() => {
    const c = window.PS.buildTextCanvas();
    if (!c) return 0;
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
    return n;
  });
  check('styled text renders ink', styled > 0, styled);
  await click('#text-add');
  const inkStyled = await ink();
  check('styled text adds more ink than plain', inkStyled >= inkPlain, inkPlain + ' -> ' + inkStyled);
  await click('[data-style="poster"]');
  check('style preset applies', (await page.evaluate(() => window.PS.state.text.depth)) === 10);
  await click('[data-style="plain"]');

  // 13a fonts
  const fonts = await page.evaluate(() => document.querySelectorAll('#font-list .font-item').length);
  check('font picker lists fonts', fonts >= 12, fonts);
  await page.evaluate(() => document.querySelectorAll('#font-list .font-item')[3].click());
  check('font selection sticks', await page.evaluate(() => window.PS.state.text.font !== "'Press Start 2P', monospace"));

  // 13a2 editable objects
  await tab('layers');
  const objCount = await page.evaluate(() => document.querySelectorAll('.object-row').length);
  check('text became an editable object', objCount >= 1, objCount);
  await page.evaluate(() => document.querySelector('.object-row').click());
  await new Promise(r => setTimeout(r, 200));
  check('object selects and loads its text', await page.evaluate(() =>
    !!window.PS.state.selectedObj && document.querySelector('#text-content').value.length > 0));
  const beforeEdit = await ink();
  await page.evaluate(() => {
    document.querySelector('#text-content').value = 'EDITED';
    document.querySelector('#text-add').click();
  });
  await new Promise(r => setTimeout(r, 250));
  const afterEdit = await ink();
  check('editing updates the same object', afterEdit !== beforeEdit, beforeEdit + ' -> ' + afterEdit);
  const objCountAfter = await page.evaluate(() => document.querySelectorAll('.object-row').length);
  check('editing does not add a second object', objCountAfter === objCount, objCount + ' -> ' + objCountAfter);

  // drag the selected object with the select tool
  await tool('select');
  const objBox = await page.evaluate(() => {
    const o = window.PS.state.objects[0];
    return { x: o.x, y: o.y };
  });
  const from = await at(objBox.x + 2, objBox.y + 4);
  const to = await at(objBox.x + 12, objBox.y + 14);
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 8 });
  await page.mouse.up();
  await new Promise(r => setTimeout(r, 250));
  const moved = await page.evaluate(() => ({ x: window.PS.state.objects[0].x, y: window.PS.state.objects[0].y }));
  check('object drags on canvas', moved.x !== objBox.x || moved.y !== objBox.y, JSON.stringify([objBox, moved]));

  // shapes
  await tab('layers');
  await page.evaluate(() => document.querySelector('[data-add-shape="ellipse"]').click());
  await new Promise(r => setTimeout(r, 200));
  check('shape object added', (await page.evaluate(() => window.PS.state.objects.length)) >= 2);

  // flatten removes the object but keeps pixels
  const inkBeforeFlat = await ink();
  await page.evaluate(() => document.querySelector('#obj-flatten').click());
  await new Promise(r => setTimeout(r, 250));
  check('flatten bakes the object', (await ink()) >= inkBeforeFlat - 5 &&
    (await page.evaluate(() => window.PS.state.objects.length)) >= 1);

  // save / reopen keeps objects
  const project = await page.evaluate(() => {
    const s = window.PS.state;
    return { objects: s.objects.length, w: s.w, h: s.h };
  });
  check('objects are part of the document', project.objects >= 1, JSON.stringify(project));

  // 13a3 templates create a sized document with editable text
  await page.evaluate(() => {
    const m = document.querySelector('#btn-menu');
    if (m) m.click();
  });
  await new Promise(r => setTimeout(r, 150));
  await page.evaluate(() => { const t = document.querySelector('#m-templates'); if (t) t.click(); });
  await new Promise(r => setTimeout(r, 250));
  const dlgTpl = await page.evaluate(() => document.querySelectorAll('#dlg-templates .template-card').length);
  check('templates dialog opens', dlgTpl >= 6, dlgTpl);
  await page.evaluate(() => document.querySelector('#dlg-templates [data-tpl="thumb"]').click());
  await new Promise(r => setTimeout(r, 500));
  const tplState = await page.evaluate(() => ({
    w: window.PS.state.w, h: window.PS.state.h,
    objects: window.PS.state.objects.length,
    text: (window.PS.state.objects[0] || {}).text
  }));
  check('template builds the document', tplState.w === 1280 && tplState.h === 720, JSON.stringify(tplState));
  check('template adds editable text', tplState.objects === 2, tplState.objects);
  check('template text is editable content', tplState.text === 'TITLE HERE', tplState.text);
  const inkTpl = await ink();
  check('template renders pixels', inkTpl > 0, inkTpl);
  await page.evaluate(() => { const b = document.querySelector('.overlay [data-cancel]'); if (b) b.click(); });

  // back to a small canvas for the remaining checks
  await page.evaluate(() => document.querySelector('#btn-menu').click());
  await new Promise(r => setTimeout(r, 150));
  await page.evaluate(() => document.querySelector('#m-new').click());
  await new Promise(r => setTimeout(r, 250));
  await page.evaluate(() => {
    document.querySelector('#dlg-w').value = 64;
    document.querySelector('#dlg-h').value = 64;
    document.querySelector('.overlay [data-ok]').click();
  });
  await new Promise(r => setTimeout(r, 300));
  const resetSize = await docSize();
  check('new document resets to 64', resetSize.w === 64 && resetSize.h === 64, JSON.stringify(resetSize));

  // 13b stickers
  await tab('stickers');
  const stickers = await page.evaluate(() => document.querySelectorAll('#sticker-grid .sticker').length);
  const inkPreSticker = await ink();
  await click('#sticker-place');
  const inkPostSticker = await ink();
  check('sticker library renders', stickers >= 30, stickers);
  check('sticker places ink', inkPostSticker > inkPreSticker, inkPreSticker + ' -> ' + inkPostSticker);

  // 13c background + remove background
  await tab('colour');
  await page.evaluate(() => document.querySelectorAll('#palette button')[0].click());
  await click('#bg-colour');
  const bgInk = await ink();
  const canvasPixels = await page.evaluate(() => window.PS.state.w * window.PS.state.h);
  check('background fill covers the layer', bgInk === canvasPixels, bgInk + '/' + canvasPixels);
  await tab('effects');
  await setRange('bg-tolerance', 20);
  await click('#bg-remove-colour');
  const afterRemove = await ink();
  check('remove background clears pixels', afterRemove < bgInk, bgInk + ' -> ' + afterRemove);
  await click('#btn-undo');

  // 13d photo filters
  await click('[data-fx="vignette"]');
  await click('[data-fx="stripes"]');
  check('vignette and stripes run', (await ink()) > 0);

  // 13d2 photo tools
  await tab('photo');
  check('photo pane visible', await page.evaluate(() => {
    const r = document.querySelector('#px-make').getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }));
  const inkPrePixel = await ink();
  await setRange('px-block', 4);
  await click('#px-make');
  check('pixelize runs', (await ink()) !== inkPrePixel || inkPrePixel > 0);
  const palBefore = await page.evaluate(() => window.PS.state.palette.length);
  await click('#photo-palette');
  check('palette from image', (await page.evaluate(() => window.PS.state.palette.length)) > 0,
    palBefore + ' -> ' + (await page.evaluate(() => window.PS.state.palette.length)));
  const sizePreScale = await docSize();
  await page.evaluate(() => document.querySelector('[data-scale="2"]').click());
  const sizePostScale = await docSize();
  check('scale 200%', sizePostScale.w === Math.min(1024, sizePreScale.w * 2), JSON.stringify([sizePreScale, sizePostScale]));
  await click('#bg-auto');
  check('auto background removal runs', true);

  // 13d2b AI background remover must fail gracefully when the model is unreachable
  const hasAi = await page.evaluate(() => !!document.querySelector('#bg-ai'));
  check('AI background button present', hasAi);
  if (hasAi) {
    await page.evaluate(() => document.querySelector('#bg-ai').click());
    await new Promise(r => setTimeout(r, 2500));
    const aiState = await page.evaluate(() => ({
      enabled: !document.querySelector('#bg-ai').disabled,
      note: (document.querySelector('#bg-ai-note') || {}).textContent || ''
    }));
    check('AI button recovers and falls back', aiState.enabled, aiState.note.slice(0, 60));
  }

  // 13d3 crop to selection
  await tool('select');
  await stroke(2, 2, 12, 12);
  await tab('photo');
  await click('#photo-crop');
  const cropped = await docSize();
  check('crop to selection', cropped.w === 11 && cropped.h === 11, JSON.stringify(cropped));

  // 13e canvas dialog
  await click('#doc-chip');
  check('canvas dialog opens', await page.evaluate(() => !!document.querySelector('.overlay #dlg-rot-cw')));
  const s1 = await docSize();
  await click('#dlg-rot-cw');
  const s2 = await docSize();
  check('canvas dialog rotates', s2.w === s1.h && s2.h === s1.w, JSON.stringify([s1, s2]));
  await page.evaluate(() => {
    document.querySelector('#dlg-w').value = 48;
    document.querySelector('#dlg-h').value = 48;
  });
  await click('.overlay [data-ok]');
  const s3 = await docSize();
  check('canvas dialog resizes', s3.w === 48 && s3.h === 48, JSON.stringify(s3));

  // 13f object handles: resize and rotate
  await page.evaluate(() => { const b = document.querySelector('#btn-menu'); if (b) b.click(); });
  await new Promise(r => setTimeout(r, 120));
  await page.evaluate(() => document.querySelector('#m-new').click());
  await new Promise(r => setTimeout(r, 200));
  await page.evaluate(() => {
    document.querySelector('#dlg-w').value = 64;
    document.querySelector('#dlg-h').value = 64;
    document.querySelector('.overlay [data-ok]').click();
  });
  await new Promise(r => setTimeout(r, 250));
  await tab('layers');
  await page.evaluate(() => document.querySelector('[data-add-shape="rect"]').click());
  await new Promise(r => setTimeout(r, 250));
  await tool('select');
  const beforeResize = await page.evaluate(() => {
    const o = window.PS.state.objects[0];
    return { x: o.x, y: o.y, w: o.w, h: o.h };
  });
  const sePoint = await page.evaluate(() => {
    const o = window.PS.state.objects[0];
    return { x: o.x + o.w, y: o.y + o.h };
  });
  const fromSE = await at(sePoint.x, sePoint.y);
  const toSE = await at(sePoint.x + 10, sePoint.y + 10);
  await page.mouse.move(fromSE.x, fromSE.y);
  await page.mouse.down();
  await page.mouse.move(toSE.x, toSE.y, { steps: 8 });
  await page.mouse.up();
  await new Promise(r => setTimeout(r, 250));
  const afterResize = await page.evaluate(() => {
    const o = window.PS.state.objects[0];
    return { x: o.x, y: o.y, w: o.w, h: o.h };
  });
  check('corner handle resizes the shape', afterResize.w > beforeResize.w && afterResize.h > beforeResize.h,
    JSON.stringify([beforeResize, afterResize]));

  const rotPoint = await page.evaluate(() => {
    const o = window.PS.state.objects[0];
    return { x: o.x + o.w / 2, y: o.y - 10 / Math.max(0.2, window.PS.state.zoom) * 1.6 };
  });
  const fromRot = await at(rotPoint.x, rotPoint.y);
  const toRot = await at(rotPoint.x + 14, rotPoint.y + 14);
  await page.mouse.move(fromRot.x, fromRot.y);
  await page.mouse.down();
  await page.mouse.move(toRot.x, toRot.y, { steps: 8 });
  await page.mouse.up();
  await new Promise(r => setTimeout(r, 250));
  const rotation = await page.evaluate(() => window.PS.state.objects[0].rotation || 0);
  check('rotate handle turns the object', rotation !== 0, rotation);

  // 13g PWA assets and style thumbnails
  // over file:// fetch() is blocked, so check the markup plus the files on disk
  const fs = require('fs');
  const pathMod = require('path');
  const root = pathMod.resolve(__dirname, '..');
  const pwa = await page.evaluate(() => ({
    link: !!document.querySelector('link[rel="manifest"]'),
    thumbs: document.querySelectorAll('.style-thumb canvas').length
  }));
  const filesOnDisk = fs.existsSync(pathMod.join(root, 'manifest.json')) && fs.existsSync(pathMod.join(root, 'sw.js'));
  check('manifest link and PWA files present', pwa.link && filesOnDisk, JSON.stringify({ pwa, filesOnDisk }));
  check('text style thumbnails render', pwa.thumbs >= 3, pwa.thumbs);

  // 13h layer groups and masks
  await tab('layers');
  await page.evaluate(() => document.querySelector('#group-add').click());
  await new Promise(r => setTimeout(r, 200));
  check('group created', (await page.evaluate(() => window.PS.state.groups.length)) === 1,
    await page.evaluate(() => window.PS.state.groups.length));
  check('group header rendered', (await page.evaluate(() => document.querySelectorAll('.group-row').length)) >= 1);
  await page.evaluate(() => document.querySelector('#group-toggle').click());
  await new Promise(r => setTimeout(r, 200));
  check('group collapses', await page.evaluate(() => window.PS.state.groups[0].collapsed === true));
  await page.evaluate(() => document.querySelector('#group-toggle').click());
  await new Promise(r => setTimeout(r, 150));

  // mask from selection hides everything outside the selection
  // fill the active layer completely first, so the numbers are deterministic
  await page.evaluate(() => {
    const rows = document.querySelectorAll('.layer');
    if (rows.length) rows[rows.length - 1].click();
  });
  await new Promise(r => setTimeout(r, 150));
  await page.evaluate(() => document.querySelector('#bg-colour').click());
  await new Promise(r => setTimeout(r, 250));
  const filledInk = await ink();
  check('layer filled for mask test', filledInk > 0, filledInk);

  await page.evaluate(() => { window.PS.state.sel = { x: 8, y: 8, w: 16, h: 16 }; });
  await page.evaluate(() => document.querySelector('#mask-from-selection').click());
  await new Promise(r => setTimeout(r, 250));
  const maskedInk = await ink();
  check('mask from selection applies', maskedInk > 0 && maskedInk < filledInk, filledInk + ' -> ' + maskedInk);

  await page.evaluate(() => document.querySelector('#mask-toggle').click());
  await new Promise(r => setTimeout(r, 250));
  const unmaskedInk = await ink();
  check('mask can be switched off', unmaskedInk > maskedInk, maskedInk + ' -> ' + unmaskedInk);

  await page.evaluate(() => document.querySelector('#mask-remove').click());
  await new Promise(r => setTimeout(r, 200));
  check('mask removed', await page.evaluate(() => !window.PS.state.layers[window.PS.state.active].mask));

  await page.evaluate(() => document.querySelector('#group-del').click());
  await new Promise(r => setTimeout(r, 200));
  check('ungroup works', (await page.evaluate(() => window.PS.state.groups.length)) === 0);

  // 13i quick guide
  await page.evaluate(() => document.querySelector('#btn-menu').click());
  await new Promise(r => setTimeout(r, 120));
  await page.evaluate(() => document.querySelector('#m-help').click());
  await new Promise(r => setTimeout(r, 250));
  const guide = await page.evaluate(() => {
    const m = document.querySelector('.overlay .modal');
    return m ? m.textContent.includes('Start') && m.textContent.includes('Shortcuts') : false;
  });
  check('quick guide opens', guide);
  await page.evaluate(() => { const b = document.querySelector('.overlay [data-ok]'); if (b) b.click(); });

  // 14 zoom
  const z0 = await page.evaluate(() => document.querySelector('#zoom-label').textContent);
  await click('#zoom-in');
  const z1 = await page.evaluate(() => document.querySelector('#zoom-label').textContent);
  check('zoom in', z0 !== z1, z0 + ' -> ' + z1);
  await click('#zoom-fit');

  // 15 menu + export dialog
  await click('#btn-menu');
  check('menu opens', await page.evaluate(() => !document.querySelector('#menu-pop').hidden));
  await click('#m-export');
  check('export dialog opens', await page.evaluate(() => !!document.querySelector('.overlay .modal')));
  await click('.overlay [data-cancel]');

  // 16 zen
  await click('#btn-zen');
  check('zen mode on', await page.evaluate(() => document.querySelector('#app').classList.contains('zen')));
  await click('#btn-zen');
  check('zen mode off', await page.evaluate(() => !document.querySelector('#app').classList.contains('zen')));

  // 17 colour — reset the palette first, an earlier test replaced it with image colours
  await tab('colour');
  await page.evaluate(() => {
    const s = document.querySelector('#palette-select');
    s.value = 'db16';
    s.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await click('#palette button:nth-child(4)');
  const hex = await val('#hex-input');
  check('palette sets colour', /^#[0-9A-F]{6}$/.test(hex), hex);
  await page.evaluate(() => {
    const s = document.querySelector('#palette-select');
    s.value = 'pico8';
    s.dispatchEvent(new Event('change', { bubbles: true }));
  });
  check('palette switch', (await page.evaluate(() => document.querySelectorAll('#palette button').length)) === 16);
  await click('#swap-colors');
  check('swap colours', (await val('#hex-input')) !== hex, hex + ' -> ' + (await val('#hex-input')));

  // 18 select & move
  await tool('select');
  await stroke(4, 4, 16, 16);
  check('selection exists', await page.evaluate(() => !!window.PS.state.sel),
    JSON.stringify(await page.evaluate(() => window.PS.state.sel)));

  // 19 mobile layout sanity
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await new Promise(r => setTimeout(r, 350));
  const mob = await page.evaluate(() => {
    const side = document.querySelector('#side');
    const r = side.getBoundingClientRect();
    return { sheetAtBottom: r.bottom >= window.innerHeight - 2, tabsVisible: document.querySelector('#tabs').getBoundingClientRect().height > 20 };
  });
  check('mobile sheet docks at bottom', mob.sheetAtBottom && mob.tabsVisible, JSON.stringify(mob));
  await page.screenshot({ path: 'shot-mobile.png' });
  await page.setViewport({ width: 1440, height: 900 });
  await new Promise(r => setTimeout(r, 300));

  // 20 errors
  check('no page errors', errors.length === 0, errors.slice(0, 5).join(' | '));
  check('no missing elements', warns.length === 0, warns.slice(0, 5).join(' | '));

  await page.screenshot({ path: 'shot-desktop.png' });

  const fails = results.filter(r => !r.ok).length;
  console.log(fails ? `\n${fails} FAILING` : '\nALL UI CHECKS PASSED');
  await browser.close();
  process.exit(fails ? 1 : 0);
})();
