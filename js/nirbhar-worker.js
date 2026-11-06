/* Pixel Studio Edit — Nirbhar worker.
 *
 * The heavy tools (background removal, enhancement, upscaling, tone) are pure
 * maths over a pixel buffer, so they can run off the main thread and the editor
 * stays responsive on a large canvas. The engine is the same file the page uses;
 * nothing is duplicated here except the small dispatch table.
 *
 * Message in : { id, op, img: { width, height, data: ArrayBuffer }, args }
 * Message out: { id, width, height, buffer, note } | { id, error }
 */
importScripts('nirbhar.js');

var N = self.PSNirbhar;

function run(op, img, args) {
  args = args || {};
  switch (op) {
    case 'cut': {
      var cut = N.cutout(img, {
        mode: args.mode, color: args.color, tolerance: args.tolerance,
        feather: args.feather, despill: args.despill
      });
      var out = cut.img;
      if (args.refine) {
        out = N.refineCut(out, { minArea: args.minArea, fillHoles: args.fillHoles });
      }
      if (args.backdrop) {
        out = N.backdrop(out, args.backdrop);
      }
      return { img: out, note: Math.round(cut.removed * 100) + '% of the frame cleared · key ' + cut.key };
    }
    case 'clear': {
      if (args.auto) {
        var res = N.autoEnhance(img);
        return {
          img: res.img,
          note: 'Auto: levels ' + (res.recipe.levels ? 'on' : 'off') +
            ', sharpen ' + res.recipe.sharpen + '%, clarity ' + res.recipe.clarity + '%'
        };
      }
      return {
        img: N.enhance(img, {
          whiteBalance: args.wb, levels: args.levels, denoise: args.denoise,
          dehaze: args.dehaze, clarity: args.clarity, sharpen: args.sharpen
        }),
        note: 'Manual recipe'
      };
    }
    case 'zoom': {
      var big = N.upscale(img, args.factor, args.kernel);
      if (args.sharpen > 0) N.unsharp(big, args.sharpen, 1);
      return { img: big, note: img.width + '×' + img.height + ' → ' + big.width + '×' + big.height };
    }
    case 'tone': {
      if (args.style === 'halftone') {
        return { img: N.halftone(img, { cell: args.cell, angle: args.angle, ink: args.ink, paper: args.paper, mono: true }) };
      }
      if (args.style === 'duotone') return { img: N.duotone(img, args.ink, args.paper) };
      if (args.style === 'gradmap') {
        return { img: N.gradientMap(img, [{ t: 0, color: args.ink }, { t: 0.55, color: '#8a6fb0' }, { t: 1, color: args.paper }]) };
      }
      if (args.style === 'sketch') return { img: N.sketch(img, { ink: args.ink, paper: args.paper, strength: 1.2 }) };
      return { img: N.colorBlind(img, args.cvd), note: 'Simulated ' + args.cvd };
    }
    case 'tile':
      return { img: N.makeSeamless(img, args.band > 0 ? args.band : null), note: 'Tile it in any direction — the edges now match' };
    default:
      throw new Error('unknown op: ' + op);
  }
}

self.onmessage = function (e) {
  var msg = e.data || {};
  try {
    var img = {
      width: msg.img.width,
      height: msg.img.height,
      data: new Uint8ClampedArray(msg.img.data)
    };
    var result = run(msg.op, img, msg.args);
    var out = result.img;
    self.postMessage({
      id: msg.id,
      width: out.width,
      height: out.height,
      buffer: out.data.buffer,
      note: result.note || ''
    }, [out.data.buffer]);
  } catch (err) {
    self.postMessage({ id: msg.id, error: (err && err.message) || String(err) });
  }
};
