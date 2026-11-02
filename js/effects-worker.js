/* Pixel Studio Edit — image-effect worker.
 * Heavy pixel work runs here so drawing and gestures stay on the main thread.
 */
importScripts('core.js');

self.onmessage = function (e) {
  var msg = e.data || {};
  var C = self.PSCore;
  var w = msg.w, h = msg.h;
  var img = { width: w, height: h, data: new Uint8ClampedArray(msg.buffer) };
  var p = msg.params || {};

  try {
    switch (msg.op) {
      case 'invert': C.invert(img); break;
      case 'grayscale': C.grayscale(img); break;
      case 'posterize': C.posterize(img, p.levels); break;
      case 'threshold': C.threshold(img, p.level); break;
      case 'blur': C.blur(img, p.radius); break;
      case 'noise': C.noise(img, p.amount, p.seed); break;
      case 'vignette': C.vignette(img, p.strength); break;
      case 'stripes': C.stripes(img, p.period, p.alpha); break;
      case 'outline': C.outline(img, p.color, p.width); break;
      case 'shadow': C.dropShadow(img, p.dx, p.dy, p.color, p.alpha); break;
      case 'quantize': C.quantize(img, p.palette); break;
      case 'ditherFS': C.ditherFloydSteinberg(img, p.palette); break;
      case 'ditherBayer': C.ditherBayer(img, p.palette, p.strength); break;
      case 'sharpen': C.sharpen(img, p.amount); break;
      case 'sepia': C.sepia(img); break;
      default: break;
    }
    self.postMessage({ id: msg.id, buffer: img.data.buffer, w: w, h: h }, [img.data.buffer]);
  } catch (err) {
    self.postMessage({ id: msg.id, error: String(err && err.message || err) });
  }
};
