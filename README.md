# pixelstudio

A free, open-source pixel art editor that runs entirely in your browser. No install, no account, no uploads — every pixel stays on your machine.

**[Open the editor →](https://galeoindus.github.io/pixelstudio/)** *(update this link after enabling Pages)*

![tools](docs/preview.svg)

## Why it exists

Most pixel editors are either desktop-only or locked behind a subscription. pixelstudio is a single static site: open `index.html` and start drawing. It was built as an original implementation after studying how popular mobile pixel-art tools work — the feature set is familiar, the code and assets are new and MIT licensed.

## Features

**Drawing**
- Pencil, eraser, fill bucket, line, rectangle, ellipse, eyedropper, rectangular select + move, text, and pan
- Adjustable brush size (1–24 px), opacity, and fill tolerance
- Mirror mode on X, Y, or both — handy for sprites and tiles
- Filled or outlined shapes; right-click draws with the secondary colour
- Pixel grid overlay and transparency checkerboard

**Layers**
- Unlimited layers with visibility, lock, rename, reorder, duplicate, delete, merge down, clear
- Per-layer opacity and live thumbnails

**Colour**
- Primary/secondary colours, hex input, native colour picker
- Built-in palettes: DawnBringer 16, PICO-8, Sweetie 16, Game Boy, NES, Grayscale 8, Sepia 8
- Build your own palette; shift-click sets the secondary colour, right-click removes a swatch

**Adjustments and effects**
- Live brightness, contrast, saturation and hue sliders
- Invert, grayscale, posterize, threshold, blur, noise
- Outline, drop shadow
- Palette reduction and two dithering modes (Floyd–Steinberg and ordered/Bayer) — the fastest way to turn a photo into pixel art

**Canvas**
- Presets from 16² to 512², or any size up to 1024²
- Flip horizontal/vertical, rotate 90°, resize

**Files**
- Export PNG at 1×–20× scale with nearest-neighbour upscaling
- Save and open projects as `.json` (layers preserved)
- Import an image onto a new layer
- Autosave to local storage, restorable any time

## Getting started

Just open `index.html` in a browser — no build step, no dependencies.

To run it locally with a server (recommended so autosave and file APIs behave predictably):

```bash
git clone https://github.com/galeoindus/pixelstudio.git
cd pixelstudio
python3 -m http.server 8000
# then open http://localhost:8000
```

## Keyboard shortcuts

| Key | Action | Key | Action |
| --- | --- | --- | --- |
| `B` | Pencil | `I` | Eyedropper |
| `E` | Eraser | `M` | Select & move |
| `G` | Fill bucket | `T` | Text |
| `L` | Line | `H` | Pan |
| `R` | Rectangle | `X` | Swap colours |
| `O` | Ellipse | `[` `]` | Brush size |
| `+` `-` | Zoom | `0` | Fit to screen |
| `Ctrl+Z` | Undo | `Ctrl+Shift+Z` | Redo |
| `Ctrl+A` | Select all | `Delete` | Clear selection |

## Project layout

```
index.html        markup and panels
css/style.css     the whole UI
js/core.js        pure image routines: colour maths, effects, dithering, fill (no DOM)
js/app.js         editor: tools, layers, history, file IO
tests/core.test.js  unit tests for js/core.js (node tests/core.test.js)
```

`js/core.js` deliberately has no DOM dependency, so the image maths can be tested in Node:

```bash
node tests/core.test.js
```

## Contributing

Issues and pull requests are welcome. Keep `js/core.js` free of DOM access so the tests stay runnable, and add a test for any new effect.

## Licence

MIT — see [LICENSE](LICENSE).

pixelstudio is an independent project. It is not affiliated with, endorsed by, or derived from the source code or assets of any commercial pixel-art app.
