# pixelstudio

A free, open-source pixel art editor that runs entirely in your browser. No install, no account, no uploads — every pixel stays on your machine.

**Live editor:** [galeoindus.github.io/pixelstudio](https://galeoindus.github.io/pixelstudio/)

![pixelstudio screenshot](docs/preview.png)

## Why it exists

Most pixel editors are either desktop-only or locked behind a subscription. pixelstudio is a single static site: open `index.html` and start drawing. It was built as an original implementation after studying how popular mobile pixel-art tools structure their workflow — the interface is familiar, the code and assets are new and MIT licensed.

## Interface

Everything is organised around one canvas:

- **Left rail** — the ten tools, each with its keyboard letter. The colour chip at the bottom swaps primary/secondary.
- **Quick bar** — brush size, opacity, mirror X/Y and the pixel grid, always within reach while drawing.
- **Right panel** (bottom sheet on phones) — six tabs: **Colour, Layers, Effects, Text, 3D, Canvas**. Only one panel is open at a time, so nothing is buried in a collapsed accordion.
- **Full-screen canvas** — the ⛶ button hides every panel for distraction-free drawing (and asks the browser for real full screen).
- **File menu** — New, Open, Save, Import image, Export PNG, Restore autosave, Keyboard shortcuts.

## Features

**Drawing**
- Pencil, eraser, fill bucket, line, rectangle, ellipse, eyedropper, rectangular select + move, text, pan
- Brush size 1–24 px, opacity, fill tolerance, filled or outlined shapes
- Mirror on X, Y, or both — for sprites and tiles
- Pixel grid overlay, transparency checkerboard, right-click draws with the secondary colour

**Layers**
- Unlimited layers: visibility, lock, rename, reorder, duplicate, delete, merge down, clear
- Per-layer opacity and live thumbnails

**Colour**
- Primary/secondary colours, hex field, native picker
- Palettes: DawnBringer 16, PICO-8, Sweetie 16, Game Boy, NES, Grayscale 8, Sepia 8 — or build your own

**Adjustments and effects**
- Live brightness, contrast, saturation and hue with apply/reset
- Invert, grayscale, posterize, threshold, blur, noise
- Outline and drop shadow
- Palette reduction plus two dithering modes (Floyd–Steinberg and ordered/Bayer) — the quickest way to turn a photo into pixel art

**3D**
- **3D text** — extrudes the text from the Text tab into a solid block, with depth, angle, side colour and auto shading, plus Block / Deep / Isometric presets
- **3D image** — turns and tilts the active layer with a perspective projection, and can extrude it for depth

**Canvas and files**
- Presets from 16² to 512², or any size up to 1024²; resize, flip, rotate 90°
- Export PNG at 1×–20× with nearest-neighbour upscaling
- Save/open projects as `.json` (layers preserved), import images onto a new layer
- Autosave to local storage, restorable at any time

## Getting started

Open `index.html` in a browser — no build step, no dependencies.

To run it locally with a server (recommended, so autosave and file APIs behave predictably):

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
index.html          markup: rail, quick bar, canvas, tabbed panels
css/style.css       the whole UI, including the mobile bottom sheet
js/core.js          pure image routines: colour maths, effects, dithering, 3D (no DOM)
js/app.js           editor: tools, layers, history, panels, file IO
tests/core.test.js  unit tests for js/core.js
tests/ui.js         headless browser test: boots the app and drives every control
docs/preview.png    screenshot used above
```

`js/core.js` has no DOM dependency, so the image maths runs in Node:

```bash
node tests/core.test.js
```

The UI test drives a real Chromium through puppeteer and checks that every tool, panel and button actually does something:

```bash
npm i puppeteer-core          # or use an existing install
CHROME_PATH=/usr/bin/chromium node tests/ui.js
```

## Contributing

Issues and pull requests are welcome. Keep `js/core.js` free of DOM access so the tests stay runnable, and add a test for any new effect. Image routines must copy into `ImageData.data` rather than reassign it — browsers make that property read-only.

## Licence

MIT — see [LICENSE](LICENSE).

pixelstudio is an independent project. It is not affiliated with, endorsed by, or derived from the source code or assets of any commercial pixel-art app.
