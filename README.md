# Pixel Studio Edit

A free, open-source pixel art **and text** editor that runs entirely in your browser. No install, no account, no uploads — every pixel stays on your machine.

**Live editor:** [galeoindus.github.io/pixelstudioedit](https://galeoindus.github.io/pixelstudioedit/)

**Nirbhar toolkit:** thirteen offline tools inside the editor — background remover, photo enhancer, upscaler, PDF maker, icon pack, SVG export, generative art and more. No upload, no account, no model download. See the [manual](docs/NIRBHAR_MANUAL.md).

![Pixel Studio Edit screenshot](docs/preview.png)

## Why it exists

Most pixel editors are desktop-only or locked behind a subscription, and most "text on photo" apps are ad-supported. Pixel Studio Edit is a single static site: open `index.html` and start drawing or typing. The feature set follows what people expect from a mobile pixel-art editor — layers, 3D text, stickers, gradients, palettes, background removal — but the code and assets are new and MIT licensed.

## Interface

The app opens on a **start screen** with the three jobs it is built for — Create a design, Edit a photo, Make pixel art — so a first-time visitor knows where to begin. All three land in the same editor, on the same artboard, with the same layers, history and export.

Everything is organised around one canvas:

- **Left rail** — eleven named tools (Pen, Erase, Fill, Pick, Line, Rect, Oval, Select, Crop, Text, Pan), each with its keyboard shortcut. The colour chip at the bottom swaps primary/secondary.
- **Quick bar** — brush size, opacity, mirror X/Y, the pixel grid, a **pixel-art mode** toggle and the transparency grid, always within reach while drawing.
- **Right panel** (bottom sheet on phones) — seven tabs: **Text, Sticker, Photo, Colour, Layers, FX, 3D**. One panel at a time, so nothing is buried in a collapsed accordion.
- **Save status** in the top bar tells you whether the project is saved, unsaved or autosaved.
- **Canvas chip** in the top bar — size, resize, flip and rotate. A new document opens at a design-sized artboard (1080 px), and **New document** offers banner and social templates (Instagram 1080, Story 1080×1920, YouTube 1280×720, Banner 1500×500, Meme 800×600, Poster 1080×1350).
- **Full-screen canvas** — the ⛶ button hides every panel for distraction-free drawing (and asks the browser for real full screen).
- **File menu** — New, Open, Save, Import image, Export, Templates, Canvas, Restore autosave, and a **Quick guide** that walks through start, text, objects, photo tools and export.

## Two kinds of canvas, one editor

The artboard renders **smooth by default** — photos, gradients and text are anti-aliased, brush strokes are drawn as continuous round-capped lines, and zoom is continuous — so editing a photo never looks like a grid of blocks. Turn on **pixel-art mode** (the ▩ button in the quick bar) for the opposite behaviour: crisp nearest-neighbour pixels, whole-number zoom steps and an optional pixel grid, which is what a 32×32 sprite needs.

The modes follow the job you picked on the start screen: *Create a design* and *Edit a photo* stay smooth, *Make pixel art* switches to crisp automatically. Each new document also picks a sensible brush size for its scale, so a 1080 px poster does not start with a 1 px brush.

## Features

**Templates**
- Six ready-made layouts — Poster, Quote card, Meme, Sale banner, YouTube thumbnail, Story — that open a correctly sized canvas with a background and **editable text objects** already in place (text auto-fits the canvas, even after a web font loads)
- Available on the start screen and from the file menu

**Handles and rotation**
- Select any object and it shows corner handles to resize and a round handle above it to rotate — shapes change size, text scales its font size

**Installable, offline-capable**
- Ships a web app manifest and a service worker, so the editor can be installed to the home screen and opens without a network connection (after the first visit)
- **No font CDN** — the twelve web fonts are served from `fonts/` in this repository, so the typefaces work with the network switched off too

**Editable objects** (text and shapes stay live, not baked pixels)
- Text is created as an **object**: tap it in the Layers panel to select, change the words, font, size, gradient, stroke, shadow, curve or 3D depth at any time — the object updates in place
- Drag a selected object anywhere on the canvas with the Select tool
- Add **shape objects** (rectangle, ellipse, line) with your current colours; they stay editable too
- **Flatten** any object into the active layer when you are finished with it, or hide/delete it
- Objects are saved in the project file, so a reopened project keeps its text editable

**Text**
- **Tap the canvas with the Text tool and a floating text box opens right there** — type, press Enter, done
- **Use your own font**: drop in any `.ttf`, `.otf`, `.woff` or `.woff2` file and it appears in the font list
- Multiple lines, **16 fonts shown in their own typeface** (open-licence web fonts: Press Start 2P, Bungee, Lobster, Pacifico, Anton, Righteous, Monoton, Orbitron, Bebas Neue, Caveat, Fredoka, Cinzel plus system classics)
- Fill with a solid colour **or a linear gradient** between two colours
- Stroke (outline), drop shadow, curved text, emboss and reflection
- **3D text**: extruded depth with adjustable angle, side colour and auto shading
- Style presets: Plain, Poster, Neon

**Photo tools** — one tap, no upload
- **Make pixel art**: shrink into blocks and snap to the chosen palette, with optional dithering
- **Scale** 25% / 50% / 200% / 400% and **crop to selection**
- **Auto background removal** (samples the corners), remove white, or remove the primary colour
- **B&W, sepia, sharpen**, and **use image colours as palette** (extracts the dominant colours)

**Stickers**
- 40 built-in shapes and emoji, adjustable size, placed at the tap anchor or centred

**Drawing**
- Pencil, eraser, fill bucket, line, rectangle, ellipse, eyedropper, rectangular select + move, text, pan
- **Smooth anti-aliased strokes** with round caps in design/photo mode, and hard pixel-perfect stamps in pixel-art mode
- Strokes are painted into their own buffer and composited once, so a semi-transparent line never darkens where it overlaps itself
- Brush size 1–24 px (default scales with the document), opacity, fill tolerance, filled or outlined shapes
- Mirror on X, Y, or both; pixel grid; transparency checkerboard; right-click draws with the secondary colour
- **Ctrl/⌘ + wheel** zooms; a plain wheel scrolls the pasteboard; **Space** or the middle button pans

**Layers, groups and masks**
- Unlimited layers: visibility, lock, rename, reorder, duplicate, delete, merge down, clear
- **Groups**: put a layer in a group, collapse it, hide the whole group, or ungroup again
- **Masks**: build a mask from the current selection, switch it on and off, or remove it — the mask hides pixels without destroying them
- Per-layer opacity and live thumbnails

**Colour and background**
- Primary/secondary colours, hex field, native picker
- Palettes: DawnBringer 16, PICO-8, Sweetie 16, Game Boy, NES, Grayscale 8, Sepia 8 — or build your own
- Background fill in a solid colour, a linear gradient or a radial gradient

**Effects**
- Live brightness, contrast, saturation and hue with apply/reset
- Invert, grayscale, posterize, threshold, blur, noise, **vignette, stripes**, outline, drop shadow
- **Remove background** by colour or by white, with a tolerance slider
- Palette reduction plus Floyd–Steinberg and ordered/Bayer dithering

**3D image**
- Turn, tilt (perspective projection) and extrude the active layer

**Files**
- Export **PNG, JPEG or WebP** at 1×–20× with nearest-neighbour upscaling and a quality slider
- Save/open projects as `.json` (layers preserved)
- **Import a photo at its native size** — "Edit a photo" resizes the document to the image first and draws it 1:1, so photos stay sharp instead of being downsampled and blown back up
- Autosave to local storage, restorable at any time

## Nirbhar — the offline toolkit

**Nirbhar** (निर्भर, "self-reliant") is a panel of thirteen tools that do the jobs
people normally leave the browser for — remove a background, upscale a photo,
make a PDF, build a favicon — and does them here, on your machine, with no
upload, no account, no API key and no model download. Open it from the
**Nirbhar** tab, or from the Nirbhar button on the start screen.

| Tool | What it does |
| --- | --- |
| ✂ **Nirbhar Cut** | Background remover — colour-aware flood fill from the frame edge, then edge softening and despill |
| ◐ **Nirbhar Clear** | Photo quality — white balance, auto levels, denoise, dehaze, clarity, sharpen, or one automatic recipe |
| ⤢ **Nirbhar Zoom** | Upscaler — 2×/3×/4×/8× with Lanczos, bicubic, EPX (pixel art) or nearest |
| ◑ **Nirbhar Tone** | Halftone dots, duotone, gradient map, pencil sketch, colour-blindness check |
| ▦ **Nirbhar Tile** | Seamless textures — roll and cross-fade the seams |
| ◈ **Nirbhar Pal** | Palette studio — median-cut extraction, harmonies, WCAG contrast |
| ▤ **Nirbhar Paper** | PDF maker — a real multi-page PDF, written byte by byte, no library |
| ❒ **Nirbhar Sheet** | One `.ico` with 16–256 px icons, or a sprite sheet from your layers |
| ◇ **Nirbhar Vector** | SVG export — text and shapes stay editable vectors |
| ✦ **Nirbhar Art** | Generative art composed from a written prompt, deterministic per seed |
| ▣ **Nirbhar ID** | Passport / ID photo cropped at your country's size and tiled onto a print sheet |
| Ⓝ **Nirbhar Seal** | Tiled, angled watermark across the artwork |
| ⇉ **Nirbhar Batch** | Convert and resize many images at once |

Every tool shows a live preview, and **Add as new layer** puts the result on a new
layer, so the original is never destroyed. Results that change the canvas size
(zoom, ID sheet, art) offer **Open as new document** instead.

**The manual** ships with the app in ten languages — English, हिन्दी, বাংলা, தமிழ்,
తెలుగు, मराठी, ગુજરાતી, ಕನ್ನಡ, മലയാളം and ਪੰਜਾਬੀ — and works offline like everything
else. The same text is in [`docs/NIRBHAR_MANUAL.md`](docs/NIRBHAR_MANUAL.md)
(English + Hindi), including an honest table of how each tool works and where its
limits are.

The whole toolkit is two files, both plain JavaScript with no dependency:
`js/nirbhar.js` (the maths, runnable in Node) and `js/nirbhar-ui.js` (the panel
and dialogs). The translations live in `js/nirbhar-i18n.js`.

## Getting started

Open `index.html` in a browser — no build step, no dependencies.

To run it locally with a server (recommended, so autosave and file APIs behave predictably):

```bash
git clone https://github.com/galeoindus/pixelstudioedit.git
cd pixelstudioedit
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
| `C` | Crop | `Esc` | Deselect |
| `+` `-` | Zoom | `0` | Fit to screen |
| `Ctrl+Z` | Undo | `Ctrl+Shift+Z` | Redo |
| `Ctrl+A` | Select all | `Delete` | Clear selection |

## Project layout

```
index.html          markup: rail, quick bar, canvas, tabbed panels
css/style.css       the whole UI, including the mobile bottom sheet
js/core.js          pure image routines: colour maths, effects, dithering, 3D, photo tools (no DOM)
js/nirbhar.js       the Nirbhar engine: cutout, enhance, upscale, PDF, ICO, SVG, generative art (no DOM)
js/nirbhar-ui.js    Nirbhar panel, tool dialogs and the manual
js/nirbhar-i18n.js  the manual in ten languages
js/app.js           editor: tools, layers, text styling, stickers, history, file IO
fonts/              the twelve web fonts, self-hosted (no font CDN)
tests/core.test.js  unit tests for js/core.js
tests/nirbhar.test.js  unit tests for js/nirbhar.js
tests/ui.js         headless browser test: boots the app and drives every control
manifest.json       PWA manifest (installable app)
sw.js               service worker caching the app shell for offline use
js/effects-worker.js  web worker that runs filters, palette and dithering off the main thread
icons/              app icons (192 and 512 px)
docs/preview.png    screenshot used above
docs/NIRBHAR_MANUAL.md  the Nirbhar manual, English + Hindi
```

`js/core.js` and `js/nirbhar.js` have no DOM dependency, so the image maths runs in Node:

```bash
node tests/core.test.js
node --test tests/nirbhar.test.js
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

Pixel Studio Edit is an independent project. It is not affiliated with, endorsed by, or derived from the source code or assets of any commercial pixel-art app.
