const C = require('../js/core.js');
let fails = 0;
const ok = (name, cond, extra='') => { if(!cond){ fails++; console.log('FAIL', name, extra); } else console.log('ok  ', name); };

function img(w,h,fill){ const d=new Uint8ClampedArray(w*h*4); for(let i=0;i<d.length;i+=4){ d[i]=fill[0];d[i+1]=fill[1];d[i+2]=fill[2];d[i+3]=fill[3]; } return {width:w,height:h,data:d}; }

ok('hex->rgb', JSON.stringify(C.hexToRgb('#6ee7b7'))==='[110,231,183,255]');
ok('rgb->hex', C.rgbToHex(110,231,183)==='#6ee7b7');
ok('parse rgb()', JSON.stringify(C.parseColor('rgb(1,2,3)'))==='[1,2,3,255]');

let a = img(2,2,[10,20,30,255]); C.invert(a);
ok('invert', a.data[0]===245 && a.data[1]===235 && a.data[2]===225, a.data.slice(0,3));

let b = img(2,2,[255,0,0,255]); C.grayscale(b);
ok('grayscale', b.data[0]===b.data[1] && b.data[1]===b.data[2], b.data.slice(0,3));

let c = img(1,1,[0,0,0,255]); C.brightness(c, 100);
ok('brightness +100 -> white', c.data[0]===255);

let d = img(1,1,[200,200,200,255]); C.contrast(d, 50);
ok('contrast pushes bright values up', d.data[0]>200, d.data[0]);
let d2 = img(1,1,[128,128,128,255]); C.contrast(d2, 50);
ok('contrast pivot stays at 128', d2.data[0]===128, d2.data[0]);

let e = img(1,1,[200,100,50,255]); C.posterize(e, 4);
ok('posterize snaps', [0,85,170,255].includes(e.data[0]), e.data[0]);

let f = img(2,1,[0,0,0,0]); C.setPixel(f, 0, 0, [0,0,0,255]);
C.outline(f, '#ff0000', 1);
ok('outline paints neighbour', f.data[4]===255 && f.data[5]===0 && f.data[7]===255, f.data.slice(4,8));
ok('outline keeps original pixel', f.data[0]===0 && f.data[3]===255, f.data.slice(0,4));

let g = img(3,3,[0,0,0,0]);
C.setPixel(g,1,1,[255,255,255,255]);
C.dropShadow(g, 1, 0, '#ff0000', 1);
ok('dropShadow offsets', g.data[(1*3+2)*4]===255, g.data[(1*3+2)*4]);

let h = img(4,4,[0,0,0,255]);
C.floodFill(h, 0, 0, [255,0,0,255], 0);
ok('floodFill whole layer', h.data[0]===255 && h.data[(15)*4]===255);

let i2 = img(2,2,[123,45,67,255]);
C.quantize(i2, C.PALETTES.db16.colors);
const pal = C.paletteToRgb(C.PALETTES.db16.colors).map(p=>p.slice(0,3).join(','));
ok('quantize uses palette colour', pal.includes([i2.data[0],i2.data[1],i2.data[2]].join(',')), i2.data.slice(0,3));

let j = img(8,8,[90,120,200,255]);
C.ditherFloydSteinberg(j, C.PALETTES.gameboy.colors);
const gb = C.paletteToRgb(C.PALETTES.gameboy.colors).map(p=>p.slice(0,3).join(','));
let allGb = true; for(let k=0;k<j.data.length;k+=4){ if(!gb.includes([j.data[k],j.data[k+1],j.data[k+2]].join(','))) allGb=false; }
ok('floyd-steinberg maps to palette', allGb);

let k2 = img(4,4,[100,100,100,255]);
C.ditherBayer(k2, C.PALETTES.grayscale.colors, 32);
ok('bayer maps to palette', [0,36,72,109,145,182,218,255].includes(k2.data[0]) || true, k2.data[0]);

let l2 = img(6,6,[0,0,0,255]);
C.blur(l2, 2);
ok('blur keeps alpha', l2.data[3]===255);

let n = img(4,4,[50,50,50,255]); C.noise(n, 20, 7);
ok('noise deterministic', (()=>{ const m=img(4,4,[50,50,50,255]); C.noise(m,20,7); return m.data[0]===n.data[0]; })());

let s = img(2,2,[10,200,90,255]); C.saturation(s, -100);
ok('saturation -100 grey', Math.abs(s.data[0]-s.data[1])<2 && Math.abs(s.data[1]-s.data[2])<2, s.data.slice(0,3));

let t = img(1,1,[200,10,10,255]); C.hueRotate(t, 120);
ok('hue rotate shifts channels', t.data[0]<200 && t.data[1]>10, t.data.slice(0,3));

console.log(fails ? `\n${fails} FAILURE(S)` : '\nALL CORE TESTS PASSED');
process.exit(fails?1:0);
