# The Nirbhar manual

*निर्भर — "self-reliant". The offline toolkit built into Pixel Studio Edit.*

This is the same manual the editor shows in **Nirbhar → Manual**, which switches language in one tap. It is written here in English and Hindi; inside the app it also reads in Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam and Punjabi.

---

## English

### What Nirbhar is

Nirbhar means self-reliant. It is the offline toolbox built into Pixel Studio Edit: fourteen tools that remove a background, put a new one behind it, lift photo quality, upscale, make a PDF, build an app icon, lay out a photo grid, draw generative art and more. Everything is computed by this page on your own device. There is no upload, no account, no API key, no model download and no internet connection involved.

### Start in four steps

1. Open the Nirbhar tab on the right (on a phone, tap the bottom sheet).
2. Pick a tool. A dialog opens with a preview and its own settings.
3. Change the settings until the preview looks right; the preview is a scaled copy, the real work happens at full size.
4. Press Add as new layer. Your original stays exactly as it was, and the result becomes a new layer you can keep editing.

### The fourteen tools

### ✂ Nirbhar Cut — Background remover

Removes the background from a photo, logo or scan and keeps the subject.

*Choose Auto to sample the four corners, or pick a colour to knock out. Raise Tolerance when leftovers remain, and lower it when the subject is being eaten. Edge soften keeps hair and antialiased edges clean, and Clean colour fringes removes the coloured halo. Remove specks and fill holes tidies the result by dropping stray dots and painting over gaps inside the subject. Set New background to a colour or a gradient, and switch on Soft shadow for a product-photo look.*

### ◐ Nirbhar Clear — Photo quality

Improves a photo: white balance, levels, noise, haze, clarity and sharpening.

*Leave Automatic recipe on for a one-press fix that reads the photo and chooses the strength itself. Turn it off to set each step by hand. Use Clarity for punch and Sharpen last.*

### ⤢ Nirbhar Zoom — Upscaler

Enlarges the design two, three, four or eight times without blurring the edges.

*Use Lanczos for photos, Bicubic for smooth graphics and EPX for pixel art, because EPX keeps diagonal steps sharp. Sharpen after adds a little crispness to the enlarged result.*

### ◑ Nirbhar Tone — Print & graphic looks

Gives the artwork a printed or graphic look: halftone dots, duotone, gradient map, pencil sketch, and a colour-blindness check.

*Halftone turns the picture into dots for posters and zines. Duotone and gradient map recolour it with two colours. Pencil sketch draws the edges. The colour-blindness check shows how the palette reads to a colour-blind viewer.*

### ▦ Nirbhar Tile — Seamless texture

Makes the image seamless, so it repeats without a visible join.

*Leave Seam blend at zero for automatic strength. Apply the result, then use it as a pattern background, a game texture or a wallpaper.*

### ◈ Nirbhar Pal — Palette studio

Extracts the colours of an image and builds matching colour harmonies.

*Set how many colours to pull out and the tool reads the picture. Pick a base colour and a harmony to get a ready set. Tap any swatch to make it the primary colour, or replace the palette with the harmony in one press.*

### ▤ Nirbhar Paper — PDF maker

Builds a real PDF file, with no library and no print dialog.

*Choose the page size, orientation and margin, and add extra images as more pages. Press Download and the PDF is written on your device. Text and images stay sharp because the page is embedded as a high-quality JPEG.*

### ❒ Nirbhar Sheet — Icons & sprite sheets

Exports an app icon set as a single .ico file, or a sprite sheet built from your visible layers.

*The icon mode writes 16, 32, 48, 64, 128 and 256 pixel images into one favicon.ico. The sprite mode lays every visible layer side by side on one PNG, ready for a game engine.*

### ◇ Nirbhar Vector — SVG export

Exports the design as SVG, so text and shapes stay editable vectors.

*Keep Include painted layers on to place the pixel work as a background image inside the SVG, or turn it off for a pure vector file. Open the SVG in any browser, Inkscape or Illustrator.*

### ✦ Nirbhar Art — Generative art

Generates original artwork from a written description.

*Type what you want and pick a style: colour mesh, waves, Bauhaus shapes, rings or a grain gradient. Change Variation for a different picture from the same words. This is procedural composition made from your words, not a downloaded AI model.*

### ▣ Nirbhar ID — Passport photo sheet

Crops a photo to passport size and lays many copies on one print sheet.

*Pick the size your country asks for, the print DPI and how many copies fit on the sheet. Download the PNG and print it at the stated DPI for a correctly sized photo.*

### ▥ Nirbhar Collage — Photo grid

Lays several photos on one grid, cropped to the same cells.

*Add the photos, choose how many columns, the cell size and the gap, then pick Fill the cell for a tidy grid or Whole photo to keep every edge. The result opens as a new document, ready to export or to turn into a PDF with Nirbhar Paper.*

### Ⓝ Nirbhar Seal — Watermark & stamp

Adds a tiled watermark or stamp across the artwork.

*Type your name or brand, then set the size, angle, spacing and opacity. Keep the opacity low so the picture stays readable. Apply it to a copy of the design, not the only copy.*

### ⇉ Nirbhar Batch — Convert & resize

Converts and resizes many images at once, all on this device.

*Choose the files, set the longest side, the format and the quality, then press Add as new layer. Each converted file is saved separately, so a whole folder can be prepared in one go.*


### What each tool is built from

Nothing here calls a server, a model file or an API. Each tool is plain maths over
the pixels, written for this project:

| Tool | How it works | Honest limit |
| --- | --- | --- |
| Cut | colour-aware flood fill from the frame edge, alpha feather, despill, then connected-region clean-up (specks dropped, holes filled) and an optional new background with a soft shadow | a busy, low-contrast background needs a hand-made selection or a colour key |
| Clear | grey-world white balance, per-channel histogram stretch, bilateral denoise, unsharp mask on luminance | it cannot invent detail that is not in the photo |
| Zoom | separable Lanczos-3 / bicubic, plus EPX (Scale2x) for pixel art | 8× from a tiny source stays soft; it does not hallucinate texture |
| Tone | rotated halftone screen, luminance→gradient lookup, Sobel edges, Brettel colour matrices | — |
| Tile | half-roll plus mirrored seam cross-fade | heavy directional light still shows a soft seam |
| Pal | median-cut quantisation, HSV harmonies, WCAG relative luminance | — |
| Paper | a hand-written PDF writer (catalog, pages, DCTDecode JPEG streams, xref) | text in the PDF is an image, not selectable text |
| Sheet | PNG payloads inside an ICO directory, plus a ZIP of every size; grid compositor for sprites | — |
| Vector | the object model is already vector data, so it is serialised to SVG | 3D depth and curved text only exist in the bitmap export |
| Art | seeded procedural composition (mesh, waves, geometry, rings, grain) | it composes shapes and colour; it is not a diffusion model |
| ID | aspect-cover crop at a chosen DPI, tiled onto a print sheet, with the crop position adjustable | face detection is not included, so check the crop before printing |
| Collage | cover or contain crop into a fixed grid, with gaps and a background colour | no drag-and-drop reordering; photos land in the order you add them |
| Seal | text rasterised by the browser, then rotated and tiled with alpha | — |
| Batch | Lanczos resize plus the browser's own JPEG/PNG/WebP encoder, packed with a hand-written store-only ZIP writer | — |

### What was studied to build it

The feature set was chosen by looking at what people actually use the popular
browser tools for, then implementing that work locally:

- **Background removers** (Photoroom, remove.bg) — one-press cutout, tolerance, edge softening, no account, no upload queue.
- **Upscalers** (Upscale.media and friends) — 2×/4×/8× presets, a choice of kernel, sharpening after scaling.
- **Photo enhancers** — an automatic recipe first, sliders second, so the common case needs no decisions.
- **Design apps** (Adobe Express, Canva) — templates, social sizes, sticker/text objects, palette tools, export presets.
- **Pixel and raster editors** (Photopea, Aseprite) — sprite sheets, palettes, dithering, nearest-neighbour scaling.
- **PDF and utility sites** — page sizes, margins, multi-page output, favicon packs, batch conversion.

The names, the code and the assets here are new and MIT licensed. No commercial
app, model or service is bundled, called or copied.

### Tips

- Every tool adds a new layer, so you can compare it with the original by hiding the layer.
- The preview is a scaled copy for speed; the result you apply is always full resolution.
- Cut, Clear, Zoom and ID can produce a different size. Use Open as new document for those.
- If a tool feels slow on a huge canvas, run it on the active layer instead of the whole design; the heavy tools also run in a background thread so the editor stays usable.
- Everything here works with the internet switched off, including the manual.

### Offline by design

Nothing in this panel uses the internet. Fonts, icons, tools and the manual are all stored with the app, so it keeps working on a train, in a village or during an outage.

### Language support

The manual ships in ten languages. The language is remembered per device and can
be changed at any time from the buttons at the top of the manual:

| Code | Language | Manual |
| --- | --- | --- |
| en | English | this page |
| hi | हिन्दी | नीचे |
| bn | বাংলা | in app |
| ta | தமிழ் | in app |
| te | తెలుగు | in app |
| mr | मराठी | in app |
| gu | ગુજરાતી | in app |
| kn | ಕನ್ನಡ | in app |
| ml | മലയാളം | in app |
| pa | ਪੰਜਾਬੀ | in app |

To add a language, copy one entry in `js/nirbhar-i18n.js`, keep the `@@SECTION`
markers, and translate the text between them. Nothing else has to change.

---

## हिन्दी

### Nirbhar क्या है

निर्भर का मतलब है आत्मनिर्भर। यह पिक्सेल स्टूडियो में बना एक ऑफलाइन टूलबॉक्स है: इसमें तेरह टूल्स हैं जो बैकग्राउंड हटाते हैं, फोटो की क्वालिटी सुधारते हैं, अपस्केल करते हैं, PDF बनाते हैं, ऐप आइकन बनाते हैं, जेनेरेटिव आर्ट ड्रॉ करते हैं और भी बहुत कुछ। सब कुछ आपके अपने डिवाइस पर इसी पेज द्वारा प्रोसेस होता है। इसमें कोई अपलोड, कोई अकाउंट, कोई API की, कोई मॉडल डाउनलोड और कोई इंटरनेट कनेक्शन शामिल नहीं है।

### चार स्टेप्स में शुरू करें

1. दाईं ओर निर्भर टैब खोलें (फोन पर, नीचे की शीट पर टैप करें)।
2. एक टूल चुनें। एक डायलॉग खुलेगा जिसमें प्रीव्यू और उसकी अपनी सेटिंग्स होंगी।
3. सेटिंग्स तब तक बदलें जब तक प्रीव्यू सही न दिखने लगे; प्रीव्यू एक स्केल की गई कॉपी है, असली काम फुल साइज़ में होता है।
4. Add as new layer दबाएं। आपकी ओरिजिनल लेयर बिल्कुल वैसी ही रहेगी, और रिज़ल्ट एक नया लेयर बन जाएगा जिसे आप एडिट करते रह सकते हैं।

### तेरह टूल्स

### ✂ Nirbhar Cut — Background remover

फोटो, लोगो या स्कैन से बैकग्राउंड हटाता है और सब्जेक्ट को सुरक्षित रखता है।

*चारों कोनों को सैंपल करने के लिए Auto चुनें, या हटाने के लिए कोई रंग चुनें। जब कुछ हिस्सा रह जाए तो Tolerance बढ़ाएं, और जब सब्जेक्ट कटने लगे तो इसे कम करें। Edge soften बालों और एंटीअलियास्ड किनारों को साफ रखता है, और Clean colour fringes रंगीन घेरे को हटाता है।*

### ◐ Nirbhar Clear — Photo quality

फोटो को सुधारता है: व्हाइट बैलेंस, लेवल्स, नॉइज़, हेज़, क्लैरिटी और शार्पनिंग।

*एक-प्रेस फिक्स के लिए Automatic recipe को चालू छोड़ दें जो फोटो को पढ़ता है और खुद ताकत चुनता है। हर स्टेप को हाथ से सेट करने के लिए इसे बंद कर दें। पंच के लिए Clarity का इस्तेमाल करें और अंत में Sharpen का।*

### ⤢ Nirbhar Zoom — Upscaler

किनारों को धुंधला किए बिना डिज़ाइन को दो, तीन, चार या आठ गुना बड़ा करता है।

*फोटो के लिए Lanczos, स्मूथ ग्राफिक्स के लिए Bicubic और पिक्सेल आर्ट के लिए EPX का इस्तेमाल करें, क्योंकि EPX डायगोनल स्टेप्स को शार्प रखता है। Sharpen after बड़े किए गए रिज़ल्ट में थोड़ी क्रिस्पनेस जोड़ता है।*

### ◑ Nirbhar Tone — Print & graphic looks

आर्टवर्क को प्रिंटेड या ग्राफिक लुक देता है: हाफटोन डॉट्स, डुओटोन, ग्रेडिएंट मैप, पेंसिल स्केच, और कलर-ब्लाइंडनेस चेक।

*Halftone पोस्टर और ज़ीन्स के लिए तस्वीर को डॉट्स में बदल देता है। Duotone और gradient map इसे दो रंगों से रीकलर करते हैं। Pencil sketch किनारे ड्रॉ करता है। कलर-ब्लाइंडनेस चेक दिखाता है कि पैलट एक कलर-ब्लाइंड देखने वाले को कैसा दिखता है।*

### ▦ Nirbhar Tile — Seamless texture

इमेज को सीमलेस बनाता है, ताकि यह बिना किसी दिखने वाले जोड़ के रिपीट हो।

*ऑटोमैटिक ताकत के लिए Seam blend को ज़ीरो पर छोड़ दें। रिज़ल्ट अप्लाई करें, फिर इसे पैटर्न बैकग्राउंड, गेम टेक्सचर या वॉलपेपर के रूप में इस्तेमाल करें।*

### ◈ Nirbhar Pal — Palette studio

किसी इमेज के रंग निकालता है और मैचिंग कलर हार्मनी बनाता है।

*सेट करें कि कितने रंग निकालने हैं और टूल तस्वीर को पढ़ता है। एक रेडी सेट पाने के लिए एक बेस कलर और एक हार्मनी चुनें। किसी भी स्वैच पर टैप करके उसे प्राइमरी कलर बनाएं, या एक प्रेस में पैलट को हार्मनी से रिप्लेस करें।*

### ▤ Nirbhar Paper — PDF maker

बिना किसी लाइब्रेरी और प्रिंट डायलॉग के एक असली PDF फाइल बनाता है।

*पेज का साइज़, ओरिएंटेशन और मार्जिन चुनें, और ज़्यादा पेजों के रूप में अतिरिक्त इमेज जोड़ें। Download दबाएं और PDF आपके डिवाइस पर सेव हो जाएगी। टेक्स्ट और इमेज शार्प रहते हैं क्योंकि पेज को हाई-क्वालिटी JPEG के रूप में एम्बेड किया जाता है।*

### ❒ Nirbhar Sheet — Icons & sprite sheets

एक ऐप आइकन सेट को सिंगल .ico फाइल के रूप में एक्सपोर्ट करता है, या आपकी दिखने वाली लेयर्स से बनी एक स्प्राइट शीट बनाता है।

*आइकन मोड 16, 32, 48, 64, 128 और 256 पिक्सेल इमेज को एक favicon.ico में लिखता है। स्प्राइट मोड हर दिखने वाली लेयर को एक PNG पर अगल-बगल रखता है, जो गेम इंजन के लिए तैयार है।*

### ◇ Nirbhar Vector — SVG export

डिज़ाइन को SVG के रूप में एक्सपोर्ट करता है, ताकि टेक्स्ट और शेप्स एडिट करने लायक वेक्टर्स बने रहें।

*SVG के अंदर पिक्सेल वर्क को बैकग्राउंड इमेज के रूप में रखने के लिए Include painted layers को चालू रखें, या प्योर वेक्टर फाइल के लिए इसे बंद कर दें। SVG को किसी भी ब्राउज़र, Inkscape या Illustrator में खोलें।*

### ✦ Nirbhar Art — Generative art

लिखे गए डिस्क्रिप्शन से ओरिजिनल आर्टवर्क जनरेट करता है।

*जो आप चाहते हैं उसे टाइप करें और एक स्टाइल चुनें: कलर मेश, वेव्स, बाउहॉस शेप्स, रिंग्स या ग्रेन ग्रेडिएंट। उन्हीं शब्दों से एक अलग तस्वीर पाने के लिए Variation बदलें। यह आपके शब्दों से बनी प्रोसीजरल कंपोज़िशन है, कोई डाउनलोड किया हुआ AI मॉडल नहीं।*

### ▣ Nirbhar ID — Passport photo sheet

फोटो को पासपोर्ट साइज़ में क्रॉप करता है और एक प्रिंट शीट पर कई कॉपियां रखता है।

*अपने देश द्वारा मांगे गए साइज़, प्रिंट DPI और शीट पर कितनी कॉपियां फिट होंगी, यह चुनें। PNG डाउनलोड करें और सही साइज़ की फोटो के लिए बताए गए DPI पर इसे प्रिंट करें।*

### ▥ Nirbhar Collage — Photo grid



**

### Ⓝ Nirbhar Seal — Watermark & stamp

आर्टवर्क पर एक टाइल्ड वॉटरमार्क या स्टैम्प जोड़ता है।

*अपना नाम या ब्रांड टाइप करें, फिर साइज़, एंगल, स्पेसिंग और ओपेसिटी सेट करें। ओपेसिटी को कम रखें ताकि तस्वीर पढ़ी जा सके। इसे डिज़ाइन की एक कॉपी पर अप्लाई करें, न कि इकलौती कॉपी पर।*

### ⇉ Nirbhar Batch — Convert & resize

एक साथ कई इमेजेस को कन्वर्ट और रीसाइज़ करता है, वो भी इसी डिवाइस पर।

*फाइलें चुनें, सबसे लंबा साइड, फॉर्मेट और क्वालिटी सेट करें, फिर Add as new layer दबाएं। हर कन्वर्ट की गई फाइल अलग से सेव होती है, इसलिए एक पूरे फोल्डर को एक ही बार में तैयार किया जा सकता है।*


### टिप्स

- हर टूल एक नया लेयर जोड़ता है, इसलिए आप लेयर को छिपाकर इसे ओरिजिनल से कंपेयर कर सकते हैं।
- प्रीव्यू स्पीड के लिए एक स्केल की गई कॉपी है; जो रिज़ल्ट आप अप्लाई करते हैं वह हमेशा फुल रेज़ोल्यूशन का होता है।
- Cut, Clear, Zoom और ID एक अलग साइज़ बना सकते हैं। उनके लिए Open as new document का इस्तेमाल करें।
- अगर कोई टूल बहुत बड़े कैनवास पर धीमा लगता है, तो इसे पूरे डिज़ाइन के बजाय एक्टिव लेयर पर चलाएं।
- यहाँ सब कुछ इंटरनेट बंद होने पर भी काम करता है, जिसमें मैनुअल भी शामिल है।

### ऑफलाइन, हमेशा

इस पैनल में कुछ भी इंटरनेट का इस्तेमाल नहीं करता है। फोंट्स, आइकन, टूल्स और मैनुअल सभी ऐप के साथ स्टोर होते हैं, इसलिए यह ट्रेन में, गाँव में या आउटेज के दौरान भी काम करता रहता है।

---

*Pixel Studio Edit · Nirbhar toolkit · MIT licence. Every tool in this manual runs
in your browser; nothing is uploaded, and the manual itself works offline.*
