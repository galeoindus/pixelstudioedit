/* Pixel Studio Edit — Nirbhar manual, translated.
 * Each language keeps the same @@SECTION markers as the English source, so the
 * panel can render any of them with one code path. Generated with the Sarvam
 * translation model; edit the English strings in docs/NIRBHAR_MANUAL.md and
 * re-run the section list if you add a tool.
 */
window.PSNirbharI18N = {
  order: ["en", "hi", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa"],
  names: {"en": "English", "hi": "हिन्दी", "bn": "বাংলা", "ta": "தமிழ்", "te": "తెలుగు", "mr": "मराठी", "gu": "ગુજરાતી", "kn": "ಕನ್ನಡ", "ml": "മലയാളം", "pa": "ਪੰਜਾਬੀ"},
  langs: {
    "en": {
      ui: {
              "title": "Nirbhar tools",
              "subtitle": "Offline tools — no upload, no account, no network",
              "manual": "Manual",
              "manualtitle": "Nirbhar manual",
              "footnote": "Every tool runs inside this page. Results are added as a new layer, so your original stays untouched.",
              "source": "Source",
              "design": "Whole design",
              "layer": "Active layer",
              "close": "Close",
              "newdoc": "Open as new document",
              "download": "Download",
              "apply": "Add as new layer",
              "usepalette": "Use as palette",
              "fromimage": "From the image",
              "harmony": "Harmony",
              "useharmony": "Use the harmony as palette",
              "paletteset": "Palette replaced",
              "nosource": "Nothing to work with yet — draw something first",
              "pickfiles": "Choose at least one image first"
      },
      tools: {
              "cut": {
                      "desc": "Removes the background from a photo, logo or scan and keeps the subject.",
                      "how": "Choose Auto to sample the four corners, or pick a colour to knock out. Raise Tolerance when leftovers remain, and lower it when the subject is being eaten. Edge soften keeps hair and antialiased edges clean, and Clean colour fringes removes the coloured halo."
              },
              "clear": {
                      "desc": "Improves a photo: white balance, levels, noise, haze, clarity and sharpening.",
                      "how": "Leave Automatic recipe on for a one-press fix that reads the photo and chooses the strength itself. Turn it off to set each step by hand. Use Clarity for punch and Sharpen last."
              },
              "zoom": {
                      "desc": "Enlarges the design two, three, four or eight times without blurring the edges.",
                      "how": "Use Lanczos for photos, Bicubic for smooth graphics and EPX for pixel art, because EPX keeps diagonal steps sharp. Sharpen after adds a little crispness to the enlarged result."
              },
              "tone": {
                      "desc": "Gives the artwork a printed or graphic look: halftone dots, duotone, gradient map, pencil sketch, and a colour-blindness check.",
                      "how": "Halftone turns the picture into dots for posters and zines. Duotone and gradient map recolour it with two colours. Pencil sketch draws the edges. The colour-blindness check shows how the palette reads to a colour-blind viewer."
              },
              "tile": {
                      "desc": "Makes the image seamless, so it repeats without a visible join.",
                      "how": "Leave Seam blend at zero for automatic strength. Apply the result, then use it as a pattern background, a game texture or a wallpaper."
              },
              "pal": {
                      "desc": "Extracts the colours of an image and builds matching colour harmonies.",
                      "how": "Set how many colours to pull out and the tool reads the picture. Pick a base colour and a harmony to get a ready set. Tap any swatch to make it the primary colour, or replace the palette with the harmony in one press."
              },
              "paper": {
                      "desc": "Builds a real PDF file, with no library and no print dialog.",
                      "how": "Choose the page size, orientation and margin, and add extra images as more pages. Press Download and the PDF is written on your device. Text and images stay sharp because the page is embedded as a high-quality JPEG."
              },
              "sheet": {
                      "desc": "Exports an app icon set as a single .ico file, or a sprite sheet built from your visible layers.",
                      "how": "The icon mode writes 16, 32, 48, 64, 128 and 256 pixel images into one favicon.ico. The sprite mode lays every visible layer side by side on one PNG, ready for a game engine."
              },
              "vector": {
                      "desc": "Exports the design as SVG, so text and shapes stay editable vectors.",
                      "how": "Keep Include painted layers on to place the pixel work as a background image inside the SVG, or turn it off for a pure vector file. Open the SVG in any browser, Inkscape or Illustrator."
              },
              "art": {
                      "desc": "Generates original artwork from a written description.",
                      "how": "Type what you want and pick a style: colour mesh, waves, Bauhaus shapes, rings or a grain gradient. Change Variation for a different picture from the same words. This is procedural composition made from your words, not a downloaded AI model."
              },
              "id": {
                      "desc": "Crops a photo to passport size and lays many copies on one print sheet.",
                      "how": "Pick the size your country asks for, the print DPI and how many copies fit on the sheet. Download the PNG and print it at the stated DPI for a correctly sized photo."
              },
              "seal": {
                      "desc": "Adds a tiled watermark or stamp across the artwork.",
                      "how": "Type your name or brand, then set the size, angle, spacing and opacity. Keep the opacity low so the picture stays readable. Apply it to a copy of the design, not the only copy."
              },
              "batch": {
                      "desc": "Converts and resizes many images at once, all on this device.",
                      "how": "Choose the files, set the longest side, the format and the quality, then press Add as new layer. Each converted file is saved separately, so a whole folder can be prepared in one go."
              }
      },
      manual: "@@TITLE\nNirbhar manual\n@@INTRO\nNirbhar means self-reliant. It is the offline toolbox built into Pixel Studio Edit: thirteen tools that remove a background, lift photo quality, upscale, make a PDF, build an app icon, draw generative art and more. Everything is computed by this page on your own device. There is no upload, no account, no API key, no model download and no internet connection involved.\n@@START_H\nStart in four steps\n@@START\n- Open the Nirbhar tab on the right (on a phone, tap the bottom sheet).\n- Pick a tool. A dialog opens with a preview and its own settings.\n- Change the settings until the preview looks right; the preview is a scaled copy, the real work happens at full size.\n- Press Add as new layer. Your original stays exactly as it was, and the result becomes a new layer you can keep editing.\n@@TOOLS_H\nThe thirteen tools\n@@TOOL_CUT\nRemoves the background from a photo, logo or scan and keeps the subject.\n@@HOW_CUT\nChoose Auto to sample the four corners, or pick a colour to knock out. Raise Tolerance when leftovers remain, and lower it when the subject is being eaten. Edge soften keeps hair and antialiased edges clean, and Clean colour fringes removes the coloured halo.\n@@TOOL_CLEAR\nImproves a photo: white balance, levels, noise, haze, clarity and sharpening.\n@@HOW_CLEAR\nLeave Automatic recipe on for a one-press fix that reads the photo and chooses the strength itself. Turn it off to set each step by hand. Use Clarity for punch and Sharpen last.\n@@TOOL_ZOOM\nEnlarges the design two, three, four or eight times without blurring the edges.\n@@HOW_ZOOM\nUse Lanczos for photos, Bicubic for smooth graphics and EPX for pixel art, because EPX keeps diagonal steps sharp. Sharpen after adds a little crispness to the enlarged result.\n@@TOOL_TONE\nGives the artwork a printed or graphic look: halftone dots, duotone, gradient map, pencil sketch, and a colour-blindness check.\n@@HOW_TONE\nHalftone turns the picture into dots for posters and zines. Duotone and gradient map recolour it with two colours. Pencil sketch draws the edges. The colour-blindness check shows how the palette reads to a colour-blind viewer.\n@@TOOL_TILE\nMakes the image seamless, so it repeats without a visible join.\n@@HOW_TILE\nLeave Seam blend at zero for automatic strength. Apply the result, then use it as a pattern background, a game texture or a wallpaper.\n@@TOOL_PAL\nExtracts the colours of an image and builds matching colour harmonies.\n@@HOW_PAL\nSet how many colours to pull out and the tool reads the picture. Pick a base colour and a harmony to get a ready set. Tap any swatch to make it the primary colour, or replace the palette with the harmony in one press.\n@@TOOL_PAPER\nBuilds a real PDF file, with no library and no print dialog.\n@@HOW_PAPER\nChoose the page size, orientation and margin, and add extra images as more pages. Press Download and the PDF is written on your device. Text and images stay sharp because the page is embedded as a high-quality JPEG.\n@@TOOL_SHEET\nExports an app icon set as a single .ico file, or a sprite sheet built from your visible layers.\n@@HOW_SHEET\nThe icon mode writes 16, 32, 48, 64, 128 and 256 pixel images into one favicon.ico. The sprite mode lays every visible layer side by side on one PNG, ready for a game engine.\n@@TOOL_VECTOR\nExports the design as SVG, so text and shapes stay editable vectors.\n@@HOW_VECTOR\nKeep Include painted layers on to place the pixel work as a background image inside the SVG, or turn it off for a pure vector file. Open the SVG in any browser, Inkscape or Illustrator.\n@@TOOL_ART\nGenerates original artwork from a written description.\n@@HOW_ART\nType what you want and pick a style: colour mesh, waves, Bauhaus shapes, rings or a grain gradient. Change Variation for a different picture from the same words. This is procedural composition made from your words, not a downloaded AI model.\n@@TOOL_ID\nCrops a photo to passport size and lays many copies on one print sheet.\n@@HOW_ID\nPick the size your country asks for, the print DPI and how many copies fit on the sheet. Download the PNG and print it at the stated DPI for a correctly sized photo.\n@@TOOL_SEAL\nAdds a tiled watermark or stamp across the artwork.\n@@HOW_SEAL\nType your name or brand, then set the size, angle, spacing and opacity. Keep the opacity low so the picture stays readable. Apply it to a copy of the design, not the only copy.\n@@TOOL_BATCH\nConverts and resizes many images at once, all on this device.\n@@HOW_BATCH\nChoose the files, set the longest side, the format and the quality, then press Add as new layer. Each converted file is saved separately, so a whole folder can be prepared in one go.\n@@TIPS_H\nTips\n@@TIPS\n- Every tool adds a new layer, so you can compare it with the original by hiding the layer.\n- The preview is a scaled copy for speed; the result you apply is always full resolution.\n- Cut, Clear, Zoom and ID can produce a different size. Use Open as new document for those.\n- If a tool feels slow on a huge canvas, run it on the active layer instead of the whole design.\n- Everything here works with the internet switched off, including the manual.\n@@OFFLINE\nNothing in this panel uses the internet. Fonts, icons, tools and the manual are all stored with the app, so it keeps working on a train, in a village or during an outage."
    },
    "hi": {
      ui: {
              "title": "Nirbhar टूल्स",
              "subtitle": "ऑफलाइन टूल्स — कोई अपलोड नहीं, कोई अकाउंट नहीं, कोई नेटवर्क नहीं",
              "manual": "मैनुअल",
              "manualtitle": "Nirbhar मैनुअल",
              "footnote": "हर टूल इसी पेज के अंदर चलता है। रिज़ल्ट्स को एक नए लेयर के रूप में जोड़ा जाता है, इसलिए आपकी ओरिजिनल लेयर सुरक्षित रहती है।",
              "source": "सोर्स",
              "design": "पूरा डिज़ाइन",
              "layer": "एक्टिव लेयर",
              "close": "बंद करें",
              "newdoc": "नई डॉक्यूमेंट के रूप में खोलें",
              "download": "डाउनलोड करें",
              "apply": "नए लेयर के रूप में जोड़ें",
              "usepalette": "पैलट के रूप में इस्तेमाल करें",
              "fromimage": "इमेज से",
              "harmony": "हार्मनी",
              "useharmony": "हार्मनी को पैलट के रूप में इस्तेमाल करें",
              "paletteset": "पैलट रिप्लेस हो गया",
              "nosource": "अभी काम करने के लिए कुछ नहीं है — पहले कुछ ड्रॉ करें",
              "pickfiles": "पहले कम से कम एक इमेज चुनें"
      },
      tools: {
              "cut": {
                      "desc": "फोटो, लोगो या स्कैन से बैकग्राउंड हटाता है और सब्जेक्ट को सुरक्षित रखता है।",
                      "how": "चारों कोनों को सैंपल करने के लिए Auto चुनें, या हटाने के लिए कोई रंग चुनें। जब कुछ हिस्सा रह जाए तो Tolerance बढ़ाएं, और जब सब्जेक्ट कटने लगे तो इसे कम करें। Edge soften बालों और एंटीअलियास्ड किनारों को साफ रखता है, और Clean colour fringes रंगीन घेरे को हटाता है।"
              },
              "clear": {
                      "desc": "फोटो को सुधारता है: व्हाइट बैलेंस, लेवल्स, नॉइज़, हेज़, क्लैरिटी और शार्पनिंग।",
                      "how": "एक-प्रेस फिक्स के लिए Automatic recipe को चालू छोड़ दें जो फोटो को पढ़ता है और खुद ताकत चुनता है। हर स्टेप को हाथ से सेट करने के लिए इसे बंद कर दें। पंच के लिए Clarity का इस्तेमाल करें और अंत में Sharpen का।"
              },
              "zoom": {
                      "desc": "किनारों को धुंधला किए बिना डिज़ाइन को दो, तीन, चार या आठ गुना बड़ा करता है।",
                      "how": "फोटो के लिए Lanczos, स्मूथ ग्राफिक्स के लिए Bicubic और पिक्सेल आर्ट के लिए EPX का इस्तेमाल करें, क्योंकि EPX डायगोनल स्टेप्स को शार्प रखता है। Sharpen after बड़े किए गए रिज़ल्ट में थोड़ी क्रिस्पनेस जोड़ता है।"
              },
              "tone": {
                      "desc": "आर्टवर्क को प्रिंटेड या ग्राफिक लुक देता है: हाफटोन डॉट्स, डुओटोन, ग्रेडिएंट मैप, पेंसिल स्केच, और कलर-ब्लाइंडनेस चेक।",
                      "how": "Halftone पोस्टर और ज़ीन्स के लिए तस्वीर को डॉट्स में बदल देता है। Duotone और gradient map इसे दो रंगों से रीकलर करते हैं। Pencil sketch किनारे ड्रॉ करता है। कलर-ब्लाइंडनेस चेक दिखाता है कि पैलट एक कलर-ब्लाइंड देखने वाले को कैसा दिखता है।"
              },
              "tile": {
                      "desc": "इमेज को सीमलेस बनाता है, ताकि यह बिना किसी दिखने वाले जोड़ के रिपीट हो।",
                      "how": "ऑटोमैटिक ताकत के लिए Seam blend को ज़ीरो पर छोड़ दें। रिज़ल्ट अप्लाई करें, फिर इसे पैटर्न बैकग्राउंड, गेम टेक्सचर या वॉलपेपर के रूप में इस्तेमाल करें।"
              },
              "pal": {
                      "desc": "किसी इमेज के रंग निकालता है और मैचिंग कलर हार्मनी बनाता है।",
                      "how": "सेट करें कि कितने रंग निकालने हैं और टूल तस्वीर को पढ़ता है। एक रेडी सेट पाने के लिए एक बेस कलर और एक हार्मनी चुनें। किसी भी स्वैच पर टैप करके उसे प्राइमरी कलर बनाएं, या एक प्रेस में पैलट को हार्मनी से रिप्लेस करें।"
              },
              "paper": {
                      "desc": "बिना किसी लाइब्रेरी और प्रिंट डायलॉग के एक असली PDF फाइल बनाता है।",
                      "how": "पेज का साइज़, ओरिएंटेशन और मार्जिन चुनें, और ज़्यादा पेजों के रूप में अतिरिक्त इमेज जोड़ें। Download दबाएं और PDF आपके डिवाइस पर सेव हो जाएगी। टेक्स्ट और इमेज शार्प रहते हैं क्योंकि पेज को हाई-क्वालिटी JPEG के रूप में एम्बेड किया जाता है।"
              },
              "sheet": {
                      "desc": "एक ऐप आइकन सेट को सिंगल .ico फाइल के रूप में एक्सपोर्ट करता है, या आपकी दिखने वाली लेयर्स से बनी एक स्प्राइट शीट बनाता है।",
                      "how": "आइकन मोड 16, 32, 48, 64, 128 और 256 पिक्सेल इमेज को एक favicon.ico में लिखता है। स्प्राइट मोड हर दिखने वाली लेयर को एक PNG पर अगल-बगल रखता है, जो गेम इंजन के लिए तैयार है।"
              },
              "vector": {
                      "desc": "डिज़ाइन को SVG के रूप में एक्सपोर्ट करता है, ताकि टेक्स्ट और शेप्स एडिट करने लायक वेक्टर्स बने रहें।",
                      "how": "SVG के अंदर पिक्सेल वर्क को बैकग्राउंड इमेज के रूप में रखने के लिए Include painted layers को चालू रखें, या प्योर वेक्टर फाइल के लिए इसे बंद कर दें। SVG को किसी भी ब्राउज़र, Inkscape या Illustrator में खोलें।"
              },
              "art": {
                      "desc": "लिखे गए डिस्क्रिप्शन से ओरिजिनल आर्टवर्क जनरेट करता है।",
                      "how": "जो आप चाहते हैं उसे टाइप करें और एक स्टाइल चुनें: कलर मेश, वेव्स, बाउहॉस शेप्स, रिंग्स या ग्रेन ग्रेडिएंट। उन्हीं शब्दों से एक अलग तस्वीर पाने के लिए Variation बदलें। यह आपके शब्दों से बनी प्रोसीजरल कंपोज़िशन है, कोई डाउनलोड किया हुआ AI मॉडल नहीं।"
              },
              "id": {
                      "desc": "फोटो को पासपोर्ट साइज़ में क्रॉप करता है और एक प्रिंट शीट पर कई कॉपियां रखता है।",
                      "how": "अपने देश द्वारा मांगे गए साइज़, प्रिंट DPI और शीट पर कितनी कॉपियां फिट होंगी, यह चुनें। PNG डाउनलोड करें और सही साइज़ की फोटो के लिए बताए गए DPI पर इसे प्रिंट करें।"
              },
              "seal": {
                      "desc": "आर्टवर्क पर एक टाइल्ड वॉटरमार्क या स्टैम्प जोड़ता है।",
                      "how": "अपना नाम या ब्रांड टाइप करें, फिर साइज़, एंगल, स्पेसिंग और ओपेसिटी सेट करें। ओपेसिटी को कम रखें ताकि तस्वीर पढ़ी जा सके। इसे डिज़ाइन की एक कॉपी पर अप्लाई करें, न कि इकलौती कॉपी पर।"
              },
              "batch": {
                      "desc": "एक साथ कई इमेजेस को कन्वर्ट और रीसाइज़ करता है, वो भी इसी डिवाइस पर।",
                      "how": "फाइलें चुनें, सबसे लंबा साइड, फॉर्मेट और क्वालिटी सेट करें, फिर Add as new layer दबाएं। हर कन्वर्ट की गई फाइल अलग से सेव होती है, इसलिए एक पूरे फोल्डर को एक ही बार में तैयार किया जा सकता है।"
              }
      },
      manual: "@@TITLE\nNirbhar मैनुअल\n@@INTRO\nNirbhar का मतलब है आत्मNirbhar। यह पिक्सेल स्टूडियो में बना एक ऑफलाइन टूलबॉक्स है: इसमें तेरह टूल्स हैं जो बैकग्राउंड हटाते हैं, फोटो की क्वालिटी सुधारते हैं, अपस्केल करते हैं, PDF बनाते हैं, ऐप आइकन बनाते हैं, जेनेरेटिव आर्ट ड्रॉ करते हैं और भी बहुत कुछ। सब कुछ आपके अपने डिवाइस पर इसी पेज द्वारा प्रोसेस होता है। इसमें कोई अपलोड, कोई अकाउंट, कोई API की, कोई मॉडल डाउनलोड और कोई इंटरनेट कनेक्शन शामिल नहीं है।\n@@START_H\nचार स्टेप्स में शुरू करें\n@@START\n- दाईं ओर Nirbhar टैब खोलें (फोन पर, नीचे की शीट पर टैप करें)।\n- एक टूल चुनें। एक डायलॉग खुलेगा जिसमें प्रीव्यू और उसकी अपनी सेटिंग्स होंगी।\n- सेटिंग्स तब तक बदलें जब तक प्रीव्यू सही न दिखने लगे; प्रीव्यू एक स्केल की गई कॉपी है, असली काम फुल साइज़ में होता है।\n- Add as new layer दबाएं। आपकी ओरिजिनल लेयर बिल्कुल वैसी ही रहेगी, और रिज़ल्ट एक नया लेयर बन जाएगा जिसे आप एडिट करते रह सकते हैं।\n@@TOOLS_H\nतेरह टूल्स\n@@TOOL_CUT\nफोटो, लोगो या स्कैन से बैकग्राउंड हटाता है और सब्जेक्ट को सुरक्षित रखता है।\n@@HOW_CUT\nचारों कोनों को सैंपल करने के लिए Auto चुनें, या हटाने के लिए कोई रंग चुनें। जब कुछ हिस्सा रह जाए तो Tolerance बढ़ाएं, और जब सब्जेक्ट कटने लगे तो इसे कम करें। Edge soften बालों और एंटीअलियास्ड किनारों को साफ रखता है, और Clean colour fringes रंगीन घेरे को हटाता है।\n@@TOOL_CLEAR\nफोटो को सुधारता है: व्हाइट बैलेंस, लेवल्स, नॉइज़, हेज़, क्लैरिटी और शार्पनिंग।\n@@HOW_CLEAR\nएक-प्रेस फिक्स के लिए Automatic recipe को चालू छोड़ दें जो फोटो को पढ़ता है और खुद ताकत चुनता है। हर स्टेप को हाथ से सेट करने के लिए इसे बंद कर दें। पंच के लिए Clarity का इस्तेमाल करें और अंत में Sharpen का।\n@@TOOL_ZOOM\nकिनारों को धुंधला किए बिना डिज़ाइन को दो, तीन, चार या आठ गुना बड़ा करता है।\n@@HOW_ZOOM\nफोटो के लिए Lanczos, स्मूथ ग्राफिक्स के लिए Bicubic और पिक्सेल आर्ट के लिए EPX का इस्तेमाल करें, क्योंकि EPX डायगोनल स्टेप्स को शार्प रखता है। Sharpen after बड़े किए गए रिज़ल्ट में थोड़ी क्रिस्पनेस जोड़ता है।\n@@TOOL_TONE\nआर्टवर्क को प्रिंटेड या ग्राफिक लुक देता है: हाफटोन डॉट्स, डुओटोन, ग्रेडिएंट मैप, पेंसिल स्केच, और कलर-ब्लाइंडनेस चेक।\n@@HOW_TONE\nHalftone पोस्टर और ज़ीन्स के लिए तस्वीर को डॉट्स में बदल देता है। Duotone और gradient map इसे दो रंगों से रीकलर करते हैं। Pencil sketch किनारे ड्रॉ करता है। कलर-ब्लाइंडनेस चेक दिखाता है कि पैलट एक कलर-ब्लाइंड देखने वाले को कैसा दिखता है।\n@@TOOL_TILE\nइमेज को सीमलेस बनाता है, ताकि यह बिना किसी दिखने वाले जोड़ के रिपीट हो।\n@@HOW_TILE\nऑटोमैटिक ताकत के लिए Seam blend को ज़ीरो पर छोड़ दें। रिज़ल्ट अप्लाई करें, फिर इसे पैटर्न बैकग्राउंड, गेम टेक्सचर या वॉलपेपर के रूप में इस्तेमाल करें।\n@@TOOL_PAL\nकिसी इमेज के रंग निकालता है और मैचिंग कलर हार्मनी बनाता है।\n@@HOW_PAL\nसेट करें कि कितने रंग निकालने हैं और टूल तस्वीर को पढ़ता है। एक रेडी सेट पाने के लिए एक बेस कलर और एक हार्मनी चुनें। किसी भी स्वैच पर टैप करके उसे प्राइमरी कलर बनाएं, या एक प्रेस में पैलट को हार्मनी से रिप्लेस करें।\n@@TOOL_PAPER\nबिना किसी लाइब्रेरी और प्रिंट डायलॉग के एक असली PDF फाइल बनाता है।\n@@HOW_PAPER\nपेज का साइज़, ओरिएंटेशन और मार्जिन चुनें, और ज़्यादा पेजों के रूप में अतिरिक्त इमेज जोड़ें। Download दबाएं और PDF आपके डिवाइस पर सेव हो जाएगी। टेक्स्ट और इमेज शार्प रहते हैं क्योंकि पेज को हाई-क्वालिटी JPEG के रूप में एम्बेड किया जाता है।\n@@TOOL_SHEET\nएक ऐप आइकन सेट को सिंगल .ico फाइल के रूप में एक्सपोर्ट करता है, या आपकी दिखने वाली लेयर्स से बनी एक स्प्राइट शीट बनाता है।\n@@HOW_SHEET\nआइकन मोड 16, 32, 48, 64, 128 और 256 पिक्सेल इमेज को एक favicon.ico में लिखता है। स्प्राइट मोड हर दिखने वाली लेयर को एक PNG पर अगल-बगल रखता है, जो गेम इंजन के लिए तैयार है।\n@@TOOL_VECTOR\nडिज़ाइन को SVG के रूप में एक्सपोर्ट करता है, ताकि टेक्स्ट और शेप्स एडिट करने लायक वेक्टर्स बने रहें।\n@@HOW_VECTOR\nSVG के अंदर पिक्सेल वर्क को बैकग्राउंड इमेज के रूप में रखने के लिए Include painted layers को चालू रखें, या प्योर वेक्टर फाइल के लिए इसे बंद कर दें। SVG को किसी भी ब्राउज़र, Inkscape या Illustrator में खोलें।\n@@TOOL_ART\nलिखे गए डिस्क्रिप्शन से ओरिजिनल आर्टवर्क जनरेट करता है।\n@@HOW_ART\nजो आप चाहते हैं उसे टाइप करें और एक स्टाइल चुनें: कलर मेश, वेव्स, बाउहॉस शेप्स, रिंग्स या ग्रेन ग्रेडिएंट। उन्हीं शब्दों से एक अलग तस्वीर पाने के लिए Variation बदलें। यह आपके शब्दों से बनी प्रोसीजरल कंपोज़िशन है, कोई डाउनलोड किया हुआ AI मॉडल नहीं।\n@@TOOL_ID\nफोटो को पासपोर्ट साइज़ में क्रॉप करता है और एक प्रिंट शीट पर कई कॉपियां रखता है।\n@@HOW_ID\nअपने देश द्वारा मांगे गए साइज़, प्रिंट DPI और शीट पर कितनी कॉपियां फिट होंगी, यह चुनें। PNG डाउनलोड करें और सही साइज़ की फोटो के लिए बताए गए DPI पर इसे प्रिंट करें।\n@@TOOL_SEAL\nआर्टवर्क पर एक टाइल्ड वॉटरमार्क या स्टैम्प जोड़ता है।\n@@HOW_SEAL\nअपना नाम या ब्रांड टाइप करें, फिर साइज़, एंगल, स्पेसिंग और ओपेसिटी सेट करें। ओपेसिटी को कम रखें ताकि तस्वीर पढ़ी जा सके। इसे डिज़ाइन की एक कॉपी पर अप्लाई करें, न कि इकलौती कॉपी पर।\n@@TOOL_BATCH\nएक साथ कई इमेजेस को कन्वर्ट और रीसाइज़ करता है, वो भी इसी डिवाइस पर।\n@@HOW_BATCH\nफाइलें चुनें, सबसे लंबा साइड, फॉर्मेट और क्वालिटी सेट करें, फिर Add as new layer दबाएं। हर कन्वर्ट की गई फाइल अलग से सेव होती है, इसलिए एक पूरे फोल्डर को एक ही बार में तैयार किया जा सकता है।\n@@TIPS_H\nटिप्स\n@@TIPS\n- हर टूल एक नया लेयर जोड़ता है, इसलिए आप लेयर को छिपाकर इसे ओरिजिनल से कंपेयर कर सकते हैं।\n- प्रीव्यू स्पीड के लिए एक स्केल की गई कॉपी है; जो रिज़ल्ट आप अप्लाई करते हैं वह हमेशा फुल रेज़ोल्यूशन का होता है।\n- Cut, Clear, Zoom और ID एक अलग साइज़ बना सकते हैं। उनके लिए Open as new document का इस्तेमाल करें।\n- अगर कोई टूल बहुत बड़े कैनवास पर धीमा लगता है, तो इसे पूरे डिज़ाइन के बजाय एक्टिव लेयर पर चलाएं।\n- यहाँ सब कुछ इंटरनेट बंद होने पर भी काम करता है, जिसमें मैनुअल भी शामिल है।\n@@OFFLINE\nइस पैनल में कुछ भी इंटरनेट का इस्तेमाल नहीं करता है। फोंट्स, आइकन, टूल्स और मैनुअल सभी ऐप के साथ स्टोर होते हैं, इसलिए यह ट्रेन में, गाँव में या आउटेज के दौरान भी काम करता रहता है।"
    },
    "bn": {
      ui: {
              "title": "Nirbhar টুলস",
              "subtitle": "অফলাইন টুলস — কোনো আপলোড নয়, কোনো অ্যাকাউন্ট নয়, কোনো নেটওয়ার্ক নেই",
              "manual": "ম্যানুয়াল",
              "manualtitle": "Nirbhar ম্যানুয়াল",
              "footnote": "প্রতিটি টুল এই পেজের ভেতরেই চলে। ফলাফলগুলো একটি নতুন লেয়ার হিসেবে যোগ হয়, তাই আপনার আসল ছবিটি অক্ষতই থাকে।",
              "source": "সোর্স",
              "design": "পুরো ডিজাইন",
              "layer": "অ্যাক্টিভ লেয়ার",
              "close": "বন্ধ করুন",
              "newdoc": "নতুন ডকুমেন্ট হিসেবে খুলুন",
              "download": "ডাউনলোড",
              "apply": "নতুন লেয়ার হিসেবে যোগ করুন",
              "usepalette": "প্যালেট হিসেবে ব্যবহার করুন",
              "fromimage": "ছবি থেকে",
              "harmony": "হারমনি",
              "useharmony": "হারমনিকে প্যালেট হিসেবে ব্যবহার করুন",
              "paletteset": "প্যালেট প্রতিস্থাপিত হয়েছে",
              "nosource": "এখনো কাজ করার মতো কিছু নেই — আগে কিছু আঁকুন",
              "pickfiles": "প্রথমে অন্তত একটি ছবি বেছে নিন"
      },
      tools: {
              "cut": {
                      "desc": "ছবি, লোগো বা স্ক্যান থেকে ব্যাকগ্রাউন্ড মুছে ফেলে এবং মূল বিষয়বস্তু ঠিক রাখে।",
                      "how": "চারটি কোণ স্যাম্পল করার জন্য অটো বেছে নিন, অথবা বাদ দেওয়ার জন্য একটি রঙ বেছে নিন। যদি কিছু অংশ থেকে যায় তবে টলারেন্স বাড়ান, আর যদি মূল বিষয়বস্তু কেটে যায় তবে এটি কমান। এজ সফটেন চুল এবং অ্যান্টি-এলিয়াসড প্রান্তগুলোকে পরিষ্কার রাখে, আর ক্লিন কালার ফ্রিঞ্জেস রঙিন আভা দূর করে।"
              },
              "clear": {
                      "desc": "একটি ছবির উন্নতি করে: হোয়াইট ব্যালেন্স, লেভেল, নয়েজ, হেজ, ক্ল্যারিটি এবং শার্পেনিং।",
                      "how": "এক-ক্লিকে সমাধানের জন্য অটোমেটিক রেসিপি চালু রাখুন যা ছবিটি পড়ে নিজে থেকেই শক্তি বেছে নেয়। প্রতিটি ধাপ নিজে সেট করতে এটি বন্ধ করুন। পাঞ্চের জন্য ক্ল্যারিটি এবং শেষে শার্পেন ব্যবহার করুন।"
              },
              "zoom": {
                      "desc": "প্রান্তগুলো ঝাপসা না করেই ডিজাইনকে দুই, তিন, চার বা আট গুণ বড় করে।",
                      "how": "ছবির জন্য ল্যান্সজোস, মসৃণ গ্রাফিক্সের জন্য বাইকিউবিক এবং পিক্সেল আর্টের জন্য ইপেক্স ব্যবহার করুন, কারণ ইপেক্স ডায়াগোনাল ধাপগুলোকে তীক্ষ্ণ রাখে। শার্পেন আফটার বড় করা ফলাফলে কিছুটা ক্রিস্পনেস যোগ করে।"
              },
              "tone": {
                      "desc": "আর্টওয়ার্ককে একটি প্রিন্টেড বা গ্রাফিক লুক দেয়: হাফটোন ডট, ডুওটোন, গ্রেডিয়েন্ট ম্যাপ, পেন্সিল স্কেচ এবং কালার-ব্লাইন্ডনেস চেক।",
                      "how": "হাফটোন পোস্টার এবং জাইনের জন্য ছবিটিকে ডটে পরিণত করে। ডুওটোন এবং গ্রেডিয়েন্ট ম্যাপ এটিকে দুটি রঙে রিক্যালার করে। পেন্সিল স্কেচ প্রান্তগুলো আঁকে। কালার-ব্লাইন্ডনেস চেক দেখায় যে একজন কালার-ব্লাইন্ড দর্শকের কাছে প্যালেটটি কেমন দেখায়।"
              },
              "tile": {
                      "desc": "ছবিটিকে সিমলেস করে, যাতে এটি কোনো দৃশ্যমান জোড় ছাড়াই পুনরাবৃত্তি হয়।",
                      "how": "অটোমেটিক শক্তির জন্য সিম ব্লেন্ড শূন্যে রাখুন। ফলাফলটি অ্যাপ্লাই করুন, তারপর এটিকে প্যাটার্ন ব্যাকগ্রাউন্ড, গেম টেক্সচার বা ওয়ালপেপার হিসেবে ব্যবহার করুন।"
              },
              "pal": {
                      "desc": "একটি ছবির রঙগুলো বের করে এবং মানানসই কালার হারমনি তৈরি করে।",
                      "how": "কতগুলো রঙ বের করতে হবে তা সেট করুন এবং টুলটি ছবিটি পড়ে। একটি রেডি সেট পেতে একটি বেস রঙ এবং একটি হারমনি বেছে নিন। যেকোনো সোয়াচে ট্যাপ করে এটিকে প্রাইমারি রঙ করুন, অথবা এক ক্লিকেই হারমনি দিয়ে প্যালেটটি প্রতিস্থাপন করুন।"
              },
              "paper": {
                      "desc": "কোনো লাইব্রেরি এবং কোনো প্রিন্ট ডায়ালগ ছাড়াই একটি আসল পিডিএফ ফাইল তৈরি করে।",
                      "how": "পৃষ্ঠার আকার, ওরিয়েন্টেশন এবং মার্জিন বেছে নিন, এবং অতিরিক্ত ছবিগুলোকে আরও পৃষ্ঠা হিসেবে যোগ করুন। ডাউনলোড-এ চাপ দিন এবং পিডিএফটি আপনার ডিভাইসে লেখা হবে। টেক্সট এবং ছবিগুলো তীক্ষ্ণ থাকে কারণ পৃষ্ঠাটি একটি উচ্চ-মানের JPEG হিসেবে এম্বেড করা থাকে।"
              },
              "sheet": {
                      "desc": "একটি অ্যাপ আইকন সেটকে একটি সিঙ্গেল .ico ফাইল হিসেবে এক্সপোর্ট করে, অথবা আপনার দৃশ্যমান লেয়ারগুলো থেকে তৈরি একটি স্প্রাইট শিট।",
                      "how": "আইকন মোড 16, 32, 48, 64, 128 এবং 256 পিক্সেলের ছবিগুলোকে একটি favicon.ico-তে লেখে। স্প্রাইট মোড প্রতিটি দৃশ্যমান লেয়ারকে একটি PNG-তে পাশাপাশি রাখে, যা একটি গেম ইঞ্জিনের জন্য প্রস্তুত।"
              },
              "vector": {
                      "desc": "ডিজাইনটিকে SVG হিসেবে এক্সপোর্ট করে, যাতে টেক্সট এবং আকারগুলো এডিটেবল ভেক্টর হিসেবে থাকে।",
                      "how": "SVG-এর ভেতরে পিক্সেল কাজটিকে ব্যাকগ্রাউন্ড ইমেজ হিসেবে রাখার জন্য Include painted layers চালু রাখুন, অথবা একটি পিওর ভেক্টর ফাইলের জন্য এটি বন্ধ করুন। যেকোনো ব্রাউজার, Inkscape বা Illustrator-এ SVG খুলুন।"
              },
              "art": {
                      "desc": "একটি লিখিত বর্ণনা থেকে আসল আর্টওয়ার্ক তৈরি করে।",
                      "how": "আপনি যা চান তা টাইপ করুন এবং একটি স্টাইল বেছে নিন: কালার মেশ, ওয়েভস, বাউহাউস শেপস, রিং বা গ্রেইন গ্রেডিয়েন্ট। একই শব্দ থেকে ভিন্ন ছবি পেতে ভ্যারিয়েশন পরিবর্তন করুন। এটি আপনার শব্দ থেকে তৈরি প্রসিডিউরাল কম্পোজিশন, কোনো ডাউনলোড করা AI মডেল নয়।"
              },
              "id": {
                      "desc": "একটি ছবিকে পাসপোর্ট সাইজে ক্রপ করে এবং একটি প্রিন্ট শিটে অনেক কপি সাজায়।",
                      "how": "আপনার দেশের চাওয়া সাইজ, প্রিন্ট DPI এবং শিটে কতগুলো কপি ধরবে তা বেছে নিন। PNG ডাউনলোড করুন এবং সঠিকভাবে সাইজের ছবির জন্য বলা DPI-তে এটি প্রিন্ট করুন।"
              },
              "seal": {
                      "desc": "আর্টওয়ার্কের ওপর একটি টাইলড ওয়াটারমার্ক বা স্ট্যাম্প যোগ করে।",
                      "how": "আপনার নাম বা ব্র্যান্ড টাইপ করুন, তারপর সাইজ, অ্যাঙ্গেল, স্পেসিং এবং অপাসিটি সেট করুন। অপাসিটি কম রাখুন যাতে ছবিটি পড়া যায়। এটি ডিজাইনের একটি কপিতে অ্যাপ্লাই করুন, একমাত্র কপিতে নয়।"
              },
              "batch": {
                      "desc": "একসাথে অনেক ছবি কনভার্ট এবং রিসাইজ করে, সবই এই ডিভাইসে।",
                      "how": "ফাইলগুলো বেছে নিন, সবচেয়ে লম্বা সাইড, ফরম্যাট এবং কোয়ালিটি সেট করুন, তারপর নতুন লেয়ার হিসেবে যোগ করুন-এ চাপ দিন। প্রতিটি কনভার্ট করা ফাইল আলাদাভাবে সেভ হয়, তাই একবারে পুরো একটি ফোল্ডার প্রস্তুত করা যায়।"
              }
      },
      manual: "@@TITLE\nNirbhar ম্যানুয়াল\n@@INTRO\nNirbhar মানে স্বNirbhar। এটি পিক্সেল স্টুডিওর ভেতরে থাকা অফলাইন টুলবক্স: তেরোটি টুল যা ব্যাকগ্রাউন্ড মুছে ফেলে, ছবির মান বাড়ায়, আপস্কেল করে, পিডিএফ তৈরি করে, অ্যাপ আইকন বানায়, জেনারেটিভ আর্ট আঁকে এবং আরও অনেক কিছু করে। সবকিছু আপনার নিজের ডিভাইসেই এই পেজ দ্বারা প্রসেস করা হয়। এখানে কোনো আপলোড, কোনো অ্যাকাউন্ট, কোনো API key, কোনো মডেল ডাউনলোড এবং কোনো ইন্টারনেট কানেকশনের দরকার হয় না।\n@@START_H\nচার ধাপে শুরু করুন\n@@START\n- ডানদিকে Nirbhar ট্যাবটি খুলুন (ফোনে, নিচের শিটটিতে ট্যাপ করুন)।\n- একটি টুল বেছে নিন। একটি প্রিভিউ এবং এর নিজস্ব সেটিংসসহ একটি ডায়ালগ খুলবে।\n- প্রিভিউ ঠিক না হওয়া পর্যন্ত সেটিংস পরিবর্তন করুন; প্রিভিউটি একটি স্কেল করা কপি, আসল কাজ ফুল সাইজে হয়।\n- নতুন লেয়ার হিসেবে যোগ করুন-এ চাপ দিন। আপনার আসল ছবিটি ঠিক যেমন ছিল তেমনই থাকবে, আর ফলাফলটি একটি নতুন লেয়ার হয়ে যাবে যা আপনি এডিট করতে পারবেন।\n@@TOOLS_H\nতেরোটি টুল\n@@TOOL_CUT\nছবি, লোগো বা স্ক্যান থেকে ব্যাকগ্রাউন্ড মুছে ফেলে এবং মূল বিষয়বস্তু ঠিক রাখে।\n@@HOW_CUT\nচারটি কোণ স্যাম্পল করার জন্য অটো বেছে নিন, অথবা বাদ দেওয়ার জন্য একটি রঙ বেছে নিন। যদি কিছু অংশ থেকে যায় তবে টলারেন্স বাড়ান, আর যদি মূল বিষয়বস্তু কেটে যায় তবে এটি কমান। এজ সফটেন চুল এবং অ্যান্টি-এলিয়াসড প্রান্তগুলোকে পরিষ্কার রাখে, আর ক্লিন কালার ফ্রিঞ্জেস রঙিন আভা দূর করে।\n@@TOOL_CLEAR\nএকটি ছবির উন্নতি করে: হোয়াইট ব্যালেন্স, লেভেল, নয়েজ, হেজ, ক্ল্যারিটি এবং শার্পেনিং।\n@@HOW_CLEAR\nএক-ক্লিকে সমাধানের জন্য অটোমেটিক রেসিপি চালু রাখুন যা ছবিটি পড়ে নিজে থেকেই শক্তি বেছে নেয়। প্রতিটি ধাপ নিজে সেট করতে এটি বন্ধ করুন। পাঞ্চের জন্য ক্ল্যারিটি এবং শেষে শার্পেন ব্যবহার করুন।\n@@TOOL_ZOOM\nপ্রান্তগুলো ঝাপসা না করেই ডিজাইনকে দুই, তিন, চার বা আট গুণ বড় করে।\n@@HOW_ZOOM\nছবির জন্য ল্যান্সজোস, মসৃণ গ্রাফিক্সের জন্য বাইকিউবিক এবং পিক্সেল আর্টের জন্য ইপেক্স ব্যবহার করুন, কারণ ইপেক্স ডায়াগোনাল ধাপগুলোকে তীক্ষ্ণ রাখে। শার্পেন আফটার বড় করা ফলাফলে কিছুটা ক্রিস্পনেস যোগ করে।\n@@TOOL_TONE\nআর্টওয়ার্ককে একটি প্রিন্টেড বা গ্রাফিক লুক দেয়: হাফটোন ডট, ডুওটোন, গ্রেডিয়েন্ট ম্যাপ, পেন্সিল স্কেচ এবং কালার-ব্লাইন্ডনেস চেক।\n@@HOW_TONE\nহাফটোন পোস্টার এবং জাইনের জন্য ছবিটিকে ডটে পরিণত করে। ডুওটোন এবং গ্রেডিয়েন্ট ম্যাপ এটিকে দুটি রঙে রিক্যালার করে। পেন্সিল স্কেচ প্রান্তগুলো আঁকে। কালার-ব্লাইন্ডনেস চেক দেখায় যে একজন কালার-ব্লাইন্ড দর্শকের কাছে প্যালেটটি কেমন দেখায়।\n@@TOOL_TILE\nছবিটিকে সিমলেস করে, যাতে এটি কোনো দৃশ্যমান জোড় ছাড়াই পুনরাবৃত্তি হয়।\n@@HOW_TILE\nঅটোমেটিক শক্তির জন্য সিম ব্লেন্ড শূন্যে রাখুন। ফলাফলটি অ্যাপ্লাই করুন, তারপর এটিকে প্যাটার্ন ব্যাকগ্রাউন্ড, গেম টেক্সচার বা ওয়ালপেপার হিসেবে ব্যবহার করুন।\n@@TOOL_PAL\nএকটি ছবির রঙগুলো বের করে এবং মানানসই কালার হারমনি তৈরি করে।\n@@HOW_PAL\nকতগুলো রঙ বের করতে হবে তা সেট করুন এবং টুলটি ছবিটি পড়ে। একটি রেডি সেট পেতে একটি বেস রঙ এবং একটি হারমনি বেছে নিন। যেকোনো সোয়াচে ট্যাপ করে এটিকে প্রাইমারি রঙ করুন, অথবা এক ক্লিকেই হারমনি দিয়ে প্যালেটটি প্রতিস্থাপন করুন।\n@@TOOL_PAPER\nকোনো লাইব্রেরি এবং কোনো প্রিন্ট ডায়ালগ ছাড়াই একটি আসল পিডিএফ ফাইল তৈরি করে।\n@@HOW_PAPER\nপৃষ্ঠার আকার, ওরিয়েন্টেশন এবং মার্জিন বেছে নিন, এবং অতিরিক্ত ছবিগুলোকে আরও পৃষ্ঠা হিসেবে যোগ করুন। ডাউনলোড-এ চাপ দিন এবং পিডিএফটি আপনার ডিভাইসে লেখা হবে। টেক্সট এবং ছবিগুলো তীক্ষ্ণ থাকে কারণ পৃষ্ঠাটি একটি উচ্চ-মানের JPEG হিসেবে এম্বেড করা থাকে।\n@@TOOL_SHEET\nএকটি অ্যাপ আইকন সেটকে একটি সিঙ্গেল .ico ফাইল হিসেবে এক্সপোর্ট করে, অথবা আপনার দৃশ্যমান লেয়ারগুলো থেকে তৈরি একটি স্প্রাইট শিট।\n@@HOW_SHEET\nআইকন মোড 16, 32, 48, 64, 128 এবং 256 পিক্সেলের ছবিগুলোকে একটি favicon.ico-তে লেখে। স্প্রাইট মোড প্রতিটি দৃশ্যমান লেয়ারকে একটি PNG-তে পাশাপাশি রাখে, যা একটি গেম ইঞ্জিনের জন্য প্রস্তুত।\n@@TOOL_VECTOR\nডিজাইনটিকে SVG হিসেবে এক্সপোর্ট করে, যাতে টেক্সট এবং আকারগুলো এডিটেবল ভেক্টর হিসেবে থাকে।\n@@HOW_VECTOR\nSVG-এর ভেতরে পিক্সেল কাজটিকে ব্যাকগ্রাউন্ড ইমেজ হিসেবে রাখার জন্য Include painted layers চালু রাখুন, অথবা একটি পিওর ভেক্টর ফাইলের জন্য এটি বন্ধ করুন। যেকোনো ব্রাউজার, Inkscape বা Illustrator-এ SVG খুলুন।\n@@TOOL_ART\nএকটি লিখিত বর্ণনা থেকে আসল আর্টওয়ার্ক তৈরি করে।\n@@HOW_ART\nআপনি যা চান তা টাইপ করুন এবং একটি স্টাইল বেছে নিন: কালার মেশ, ওয়েভস, বাউহাউস শেপস, রিং বা গ্রেইন গ্রেডিয়েন্ট। একই শব্দ থেকে ভিন্ন ছবি পেতে ভ্যারিয়েশন পরিবর্তন করুন। এটি আপনার শব্দ থেকে তৈরি প্রসিডিউরাল কম্পোজিশন, কোনো ডাউনলোড করা AI মডেল নয়।\n@@TOOL_ID\nএকটি ছবিকে পাসপোর্ট সাইজে ক্রপ করে এবং একটি প্রিন্ট শিটে অনেক কপি সাজায়।\n@@HOW_ID\nআপনার দেশের চাওয়া সাইজ, প্রিন্ট DPI এবং শিটে কতগুলো কপি ধরবে তা বেছে নিন। PNG ডাউনলোড করুন এবং সঠিকভাবে সাইজের ছবির জন্য বলা DPI-তে এটি প্রিন্ট করুন।\n@@TOOL_SEAL\nআর্টওয়ার্কের ওপর একটি টাইলড ওয়াটারমার্ক বা স্ট্যাম্প যোগ করে।\n@@HOW_SEAL\nআপনার নাম বা ব্র্যান্ড টাইপ করুন, তারপর সাইজ, অ্যাঙ্গেল, স্পেসিং এবং অপাসিটি সেট করুন। অপাসিটি কম রাখুন যাতে ছবিটি পড়া যায়। এটি ডিজাইনের একটি কপিতে অ্যাপ্লাই করুন, একমাত্র কপিতে নয়।\n@@TOOL_BATCH\nএকসাথে অনেক ছবি কনভার্ট এবং রিসাইজ করে, সবই এই ডিভাইসে।\n@@HOW_BATCH\nফাইলগুলো বেছে নিন, সবচেয়ে লম্বা সাইড, ফরম্যাট এবং কোয়ালিটি সেট করুন, তারপর নতুন লেয়ার হিসেবে যোগ করুন-এ চাপ দিন। প্রতিটি কনভার্ট করা ফাইল আলাদাভাবে সেভ হয়, তাই একবারে পুরো একটি ফোল্ডার প্রস্তুত করা যায়।\n@@TIPS_H\nটিপস\n@@TIPS\n- প্রতিটি টুল একটি নতুন লেয়ার যোগ করে, তাই আপনি লেয়ারটি লুকিয়ে আসলটির সাথে তুলনা করতে পারেন।\n- প্রিভিউটি গতির জন্য একটি স্কেল করা কপি; আপনি যে ফলাফলটি অ্যাপ্লাই করেন তা সবসময় ফুল রেজোলিউশনের হয়।\n- কাট, ক্লিয়ার, জুম এবং আইডি ভিন্ন সাইজ তৈরি করতে পারে। সেগুলোর জন্য নতুন ডকুমেন্ট হিসেবে খুলুন ব্যবহার করুন।\n- যদি একটি বিশাল ক্যানভাসে কোনো টুল ধীর মনে হয়, তবে পুরো ডিজাইনের বদলে অ্যাক্টিভ লেয়ারে এটি চালান।\n- ম্যানুয়ালসহ এখানকার সবকিছু ইন্টারনেট বন্ধ থাকলেও কাজ করে।\n@@OFFLINE\nএই প্যানেলের কোনোটিই ইন্টারনেট ব্যবহার করে না। ফন্ট, আইকন, টুল এবং ম্যানুয়াল সবই অ্যাপের সাথে স্টোর করা থাকে, তাই এটি ট্রেনে, গ্রামে বা ইন্টারনেট না থাকলেও কাজ করতে থাকে।"
    },
    "ta": {
      ui: {
              "title": "Nirbhar டூல்ஸ்",
              "subtitle": "ஆஃப்லைன் டூல்ஸ் — அப்லோட் இல்லை, அக்கவுண்ட் இல்லை, நெட்வொர்க் இல்லை",
              "manual": "மேனுவல்",
              "manualtitle": "Nirbhar மேனுவல்",
              "footnote": "ஒவ்வொரு டூலும் இந்தப் பக்கத்திற்குள்ளேயே வேலை செய்யும். முடிவுகள் ஒரு புதிய லேயராக சேர்க்கப்படும், எனவே உங்கள் ஒரிஜினல் அப்படியே இருக்கும்.",
              "source": "சோர்ஸ்",
              "design": "முழு டிசைன்",
              "layer": "ஆக்டிவ் லேயர்",
              "close": "மூடு",
              "newdoc": "புதிய டாக்குமெண்டாக திற",
              "download": "டவுன்லோட்",
              "apply": "புதிய லேயராக சேர்",
              "usepalette": "பேலட்டாக பயன்படுத்து",
              "fromimage": "படத்திலிருந்து",
              "harmony": "ஹார்மனி",
              "useharmony": "ஹார்மனியை பேலட்டாக பயன்படுத்து",
              "paletteset": "பேலட் மாற்றப்பட்டது",
              "nosource": "இன்னும் வேலை செய்ய எதுவும் இல்லை — முதலில் ஏதாவது வரையவும்",
              "pickfiles": "முதலில் குறைந்தது ஒரு படத்தையாவது தேர்ந்தெடுக்கவும்"
      },
      tools: {
              "cut": {
                      "desc": "புகைப்படம், லோகோ அல்லது ஸ்கேனில் இருந்து பின்னணியை நீக்கி, மையப் பகுதியை அப்படியே வைத்திருக்கும்.",
                      "how": "நான்கு மூலைகளையும் சாம்பிள் செய்ய ஆட்டோவைத் தேர்ந்தெடுக்கவும், அல்லது நீக்க வேண்டிய நிறத்தைத் தேர்ந்தெடுக்கவும். மீதமுள்ளவை இருக்கும்போது டாலரன்ஸை அதிகரிக்கவும், மையப் பகுதி வெட்டப்படும்போது அதைக் குறைக்கவும். எட்ஜ் சாஃப்டன் முடியும் முடிகளையும் ஆன்டி-அலியாஸ்டு விளிம்புகளையும் சுத்தமாக வைத்திருக்கும், மற்றும் க்ளீன் கலர் ஃபிரிஞ்சஸ் நிறமுள்ள வளையத்தை நீக்கும்."
              },
              "clear": {
                      "desc": "புகைப்படத்தை மேம்படுத்துகிறது: ஒயிட் பேலன்ஸ், லெவல்ஸ், நாய்ஸ், ஹேஸ், கிளாரிட்டி மற்றும் ஷார்பனிங்.",
                      "how": "புகைப்படத்தைப் படித்து தானாகவே ஸ்ட்ரெந்தை தேர்ந்தெடுக்கும் ஒன்-பிரஸ் ஃபிக்ஸிற்கு ஆட்டோமேட்டிக் ரெசிபியை ஆன்-லேயே வைக்கவும். ஒவ்வொரு படியையும் நீங்களே அமைக்க அதை ஆஃப் செய்யவும். பஞ்ச்-க்கு கிளாரிட்டியையும், கடைசியாக ஷார்பனையும் பயன்படுத்தவும்."
              },
              "zoom": {
                      "desc": "விளிம்புகளை மங்கலாக்காமல் டிசைனை இரண்டு, மூன்று, நான்கு அல்லது எட்டு மடங்கு பெரிதாக்குகிறது.",
                      "how": "புகைப்படங்களுக்கு Lanczos, மென்மையான கிராஃபிக்ஸுக்கு Bicubic மற்றும் பிக்சல் ஆர்ட்டுக்கு EPX-ஐ பயன்படுத்தவும், ஏனெனில் EPX மூலைவிட்ட படிகளை கூர்மையாக வைத்திருக்கும். ஷார்பன் ஆஃப்டர் பெரிதாக்கப்பட்ட முடிவில் கொஞ்சம் கிரிஸ்பினெஸை சேர்க்கும்."
              },
              "tone": {
                      "desc": "ஆர்ட்வொர்க்கிற்கு பிரிண்ட் செய்யப்பட்ட அல்லது கிராஃபிக் தோற்றத்தை அளிக்கிறது: ஹாஃப்டோன் டாட்ஸ், டுடோன், கிரேடியன்ட் மேப், பென்சில் ஸ்கெட்ச் மற்றும் கலர்-பிளைண்ட்னஸ் செக்.",
                      "how": "ஹாஃப்டோன் போஸ்டர்கள் மற்றும் ஜைன்களுக்காக படத்தை டாட்ஸாக மாற்றுகிறது. டுடோன் மற்றும் கிரேடியன்ட் மேப் அதை இரண்டு நிறங்களில் ரீகலர் செய்கிறது. பென்சில் ஸ்கெட்ச் விளிம்புகளை வரைகிறது. கலர்-பிளைண்ட்னஸ் செக், ஒரு கலர்-பிளைண்ட் பார்வையாளருக்கு பேலட் எப்படித் தெரிகிறது என்பதைக் காட்டுகிறது."
              },
              "tile": {
                      "desc": "படத்தை தடையின்றி மாற்றுகிறது, எனவே அது கண்ணுக்குத் தெரியும் இணைப்பு இல்லாமல் திரும்பத் திரும்ப வரும்.",
                      "how": "ஆட்டோமேட்டிக் ஸ்ட்ரெந்திற்கு சீம் பிளெண்டை பூஜ்யத்தில் வைக்கவும். முடிவை அப்ளை செய்து, பின்னர் அதை ஒரு பேட்டர்ன் பேக்ரவுண்ட், கேம் டெக்ஸ்சர் அல்லது வால்பேப்பர் ஆகப் பயன்படுத்தவும்."
              },
              "pal": {
                      "desc": "ஒரு படத்தின் நிறங்களை எடுத்து, அதற்கேற்ற கலர் ஹார்மனிகளை உருவாக்குகிறது.",
                      "how": "எத்தனை நிறங்களை எடுக்க வேண்டும் என்பதை அமைத்து, டூல் படத்தை படிக்கும். ஒரு ரெடி செட்டைப் பெற ஒரு பேஸ் கலர் மற்றும் ஒரு ஹார்மனியைத் தேர்ந்தெடுக்கவும். எந்த ஸ்வாட்சையும் தட்டி அதை பிரைமரி கலராக மாற்றவும், அல்லது ஒரே பிரஸில் ஹார்மனியைக் கொண்டு பேலட்டை மாற்றவும்."
              },
              "paper": {
                      "desc": "எந்த லைப்ரரியும் பிரிண்ட் டயலாக்கும் இல்லாமல், ஒரு உண்மையான PDF ஃபைலை உருவாக்குகிறது.",
                      "how": "பக்கத்தின் அளவு, ஓரியண்டேஷன் மற்றும் மார்ஜினைத் தேர்ந்தெடுத்து, கூடுதல் படங்களை கூடுதல் பக்கங்களாகச் சேர்க்கவும். டவுன்லோட் என்பதை அழுத்தவும், PDF உங்கள் டிவைஸில் எழுதப்படும். பக்கம் உயர்தர JPEG ஆக உட்பொதிக்கப்படுவதால் உரை மற்றும் படங்கள் கூர்மையாக இருக்கும்."
              },
              "sheet": {
                      "desc": "ஒரு ஆப் ஐகான் செட்டை ஒற்றை .ico ஃபைலாக எக்ஸ்போர்ட் செய்கிறது, அல்லது உங்கள் விசிபிள் லேயர்களில் இருந்து உருவாக்கப்பட்ட ஸ்ப்ரைட் ஷீட்டை எக்ஸ்போர்ட் செய்கிறது.",
                      "how": "ஐகான் மோட் 16, 32, 48, 64, 128 மற்றும் 256 பிக்சல் படங்களை ஒரு favicon.ico-வில் எழுதுகிறது. ஸ்ப்ரைட் மோட் ஒவ்வொரு விசிபிள் லேயரையும் ஒரு PNG-யில் அருகருகே வைத்து, கேம் என்ஜினுக்கு தயார் செய்கிறது."
              },
              "vector": {
                      "desc": "டிசைனை SVG ஆக எக்ஸ்போர்ட் செய்கிறது, எனவே உரையும் வடிவங்களும் எடிட் செய்யக்கூடிய வெக்டர்களாக இருக்கும்.",
                      "how": "SVG-க்கு உள்ளே பிக்சல் வேலையை பேக்ரவுண்ட் இமேஜாக வைக்க Include painted layers என்பதை ஆன்-லேயே வைக்கவும், அல்லது சுத்தமான வெக்டர் ஃபைலுக்கு அதை ஆஃப் செய்யவும். எந்த பிரவுசர், Inkscape அல்லது Illustrator-லும் SVG-ஐ திறக்கவும்."
              },
              "art": {
                      "desc": "எழுதப்பட்ட விளக்கத்திலிருந்து ஒரிஜினல் ஆர்ட்வொர்க்கை உருவாக்குகிறது.",
                      "how": "நீங்கள் விரும்புவதை டைப் செய்து ஒரு ஸ்டைலைத் தேர்ந்தெடுக்கவும்: கலர் மெஷ், அலைகள், பௌஹாஸ் வடிவங்கள், வளையங்கள் அல்லது கிரெய்ன் கிரேடியன்ட். அதே வார்த்தைகளிலிருந்து வேறுபட்ட படத்திற்கு வேரியேஷனை மாற்றவும். இது உங்கள் வார்த்தைகளிலிருந்து உருவாக்கப்பட்ட ப்ரொசீஜரல் காம்போசிஷன், டவுன்லோட் செய்யப்பட்ட AI மாடல் அல்ல."
              },
              "id": {
                      "desc": "ஒரு புகைப்படத்தை பாஸ்போர்ட் அளவிற்கு கட் செய்து, பல காப்பிகளை ஒரு பிரிண்ட் ஷீட்டில் வைக்கிறது.",
                      "how": "உங்கள் நாடு கேட்கும் அளவை, பிரிண்ட் DPI மற்றும் ஷீட்டில் எத்தனை காப்பிகள் பொருந்தும் என்பதைத் தேர்ந்தெடுக்கவும். சரியான அளவிலான புகைப்படத்திற்கு குறிப்பிட்ட DPI-யில் PNG-ஐ டவுன்லோட் செய்து பிரிண்ட் செய்யவும்."
              },
              "seal": {
                      "desc": "ஆர்ட்வொர்க் முழுவதும் ஒரு டைல்டு வாட்டர்மார்க் அல்லது ஸ்டாம்பை சேர்க்கிறது.",
                      "how": "உங்கள் பெயர் அல்லது பிராண்டை டைப் செய்து, பின்னர் அளவு, கோணம், இடைவெளி மற்றும் ஓபசிட்டியை அமைக்கவும். படம் படிக்கும்படி இருக்க ஓபசிட்டியை குறைவாக வைக்கவும். இதை டிசைனின் ஒரு காப்பியில் அப்ளை செய்யவும், ஒரே காப்பியில் அல்ல."
              },
              "batch": {
                      "desc": "பல படங்களை ஒரே நேரத்தில் கன்வெர்ட் செய்து ரீசைஸ் செய்கிறது, எல்லாமே இந்த டிவைஸிலேயே நடக்கும்.",
                      "how": "ஃபைல்களைத் தேர்ந்தெடுத்து, நீண்ட பக்கம், ஃபார்மேட் மற்றும் தரத்தை அமைத்து, பின்னர் புதிய லேயராக சேர் என்பதை அழுத்தவும். ஒவ்வொரு கன்வெர்ட் செய்யப்பட்ட ஃபைலும் தனித்தனியாக சேவ் செய்யப்படும், எனவே ஒரு முழு ஃபோல்டரையும் ஒரே முறையில் தயார் செய்யலாம்."
              }
      },
      manual: "@@TITLE\nNirbhar மேனுவல்\n@@INTRO\nNirbhar என்றால் தற்சார்பு. இது Pixel Studio-வில் உள்ள ஆஃப்லைன் டூல்பாக்ஸ்: பின்னணியை நீக்க, புகைப்படத்தின் தரத்தை மேம்படுத்த, பெரிதாக்க, PDF உருவாக்க, ஆப் ஐகான் உருவாக்க, ஜெனரேட்டிவ் ஆர்ட் வரைய என பதின்மூன்று டூல்ஸ் இதில் உள்ளன. எல்லாமே உங்கள் சொந்த டிவைசிலேயே இந்தப் பக்கத்தால் கணக்கிடப்படுகிறது. இதில் அப்லோட், அக்கவுண்ட், API key, மாடல் டவுன்லோட் மற்றும் இன்டர்நெட் கனெக்‌ஷன் எதுவும் தேவையில்லை.\n@@START_H\nநான்கு படிகளில் தொடங்குங்கள்\n@@START\n- வலதுபுறம் உள்ள Nirbhar டேப்பை திறக்கவும் (போனில், கீழ் தட்டினை தட்டவும்).\n- ஒரு டூலை தேர்ந்தெடுக்கவும். ப்ரிவியூ மற்றும் அதற்கான செட்டிங்ஸுடன் ஒரு டயலாக் திறக்கும்.\n- ப்ரிவியூ சரியாகத் தெரியும் வரை செட்டிங்ஸை மாற்றவும்; ப்ரிவியூ என்பது அளவிடப்பட்ட காப்பி மட்டுமே, உண்மையான வேலை முழு அளவில் நடக்கும்.\n- புதிய லேயராக சேர் என்பதை அழுத்தவும். உங்கள் ஒரிஜினல் அப்படியே இருக்கும், மற்றும் முடிவு நீங்கள் தொடர்ந்து எடிட் செய்யக்கூடிய புதிய லேயராக மாறும்.\n@@TOOLS_H\nபதின்மூன்று டூல்ஸ்\n@@TOOL_CUT\nபுகைப்படம், லோகோ அல்லது ஸ்கேனில் இருந்து பின்னணியை நீக்கி, மையப் பகுதியை அப்படியே வைத்திருக்கும்.\n@@HOW_CUT\nநான்கு மூலைகளையும் சாம்பிள் செய்ய ஆட்டோவைத் தேர்ந்தெடுக்கவும், அல்லது நீக்க வேண்டிய நிறத்தைத் தேர்ந்தெடுக்கவும். மீதமுள்ளவை இருக்கும்போது டாலரன்ஸை அதிகரிக்கவும், மையப் பகுதி வெட்டப்படும்போது அதைக் குறைக்கவும். எட்ஜ் சாஃப்டன் முடியும் முடிகளையும் ஆன்டி-அலியாஸ்டு விளிம்புகளையும் சுத்தமாக வைத்திருக்கும், மற்றும் க்ளீன் கலர் ஃபிரிஞ்சஸ் நிறமுள்ள வளையத்தை நீக்கும்.\n@@TOOL_CLEAR\nபுகைப்படத்தை மேம்படுத்துகிறது: ஒயிட் பேலன்ஸ், லெவல்ஸ், நாய்ஸ், ஹேஸ், கிளாரிட்டி மற்றும் ஷார்பனிங்.\n@@HOW_CLEAR\nபுகைப்படத்தைப் படித்து தானாகவே ஸ்ட்ரெந்தை தேர்ந்தெடுக்கும் ஒன்-பிரஸ் ஃபிக்ஸிற்கு ஆட்டோமேட்டிக் ரெசிபியை ஆன்-லேயே வைக்கவும். ஒவ்வொரு படியையும் நீங்களே அமைக்க அதை ஆஃப் செய்யவும். பஞ்ச்-க்கு கிளாரிட்டியையும், கடைசியாக ஷார்பனையும் பயன்படுத்தவும்.\n@@TOOL_ZOOM\nவிளிம்புகளை மங்கலாக்காமல் டிசைனை இரண்டு, மூன்று, நான்கு அல்லது எட்டு மடங்கு பெரிதாக்குகிறது.\n@@HOW_ZOOM\nபுகைப்படங்களுக்கு Lanczos, மென்மையான கிராஃபிக்ஸுக்கு Bicubic மற்றும் பிக்சல் ஆர்ட்டுக்கு EPX-ஐ பயன்படுத்தவும், ஏனெனில் EPX மூலைவிட்ட படிகளை கூர்மையாக வைத்திருக்கும். ஷார்பன் ஆஃப்டர் பெரிதாக்கப்பட்ட முடிவில் கொஞ்சம் கிரிஸ்பினெஸை சேர்க்கும்.\n@@TOOL_TONE\nஆர்ட்வொர்க்கிற்கு பிரிண்ட் செய்யப்பட்ட அல்லது கிராஃபிக் தோற்றத்தை அளிக்கிறது: ஹாஃப்டோன் டாட்ஸ், டுடோன், கிரேடியன்ட் மேப், பென்சில் ஸ்கெட்ச் மற்றும் கலர்-பிளைண்ட்னஸ் செக்.\n@@HOW_TONE\nஹாஃப்டோன் போஸ்டர்கள் மற்றும் ஜைன்களுக்காக படத்தை டாட்ஸாக மாற்றுகிறது. டுடோன் மற்றும் கிரேடியன்ட் மேப் அதை இரண்டு நிறங்களில் ரீகலர் செய்கிறது. பென்சில் ஸ்கெட்ச் விளிம்புகளை வரைகிறது. கலர்-பிளைண்ட்னஸ் செக், ஒரு கலர்-பிளைண்ட் பார்வையாளருக்கு பேலட் எப்படித் தெரிகிறது என்பதைக் காட்டுகிறது.\n@@TOOL_TILE\nபடத்தை தடையின்றி மாற்றுகிறது, எனவே அது கண்ணுக்குத் தெரியும் இணைப்பு இல்லாமல் திரும்பத் திரும்ப வரும்.\n@@HOW_TILE\nஆட்டோமேட்டிக் ஸ்ட்ரெந்திற்கு சீம் பிளெண்டை பூஜ்யத்தில் வைக்கவும். முடிவை அப்ளை செய்து, பின்னர் அதை ஒரு பேட்டர்ன் பேக்ரவுண்ட், கேம் டெக்ஸ்சர் அல்லது வால்பேப்பர் ஆகப் பயன்படுத்தவும்.\n@@TOOL_PAL\nஒரு படத்தின் நிறங்களை எடுத்து, அதற்கேற்ற கலர் ஹார்மனிகளை உருவாக்குகிறது.\n@@HOW_PAL\nஎத்தனை நிறங்களை எடுக்க வேண்டும் என்பதை அமைத்து, டூல் படத்தை படிக்கும். ஒரு ரெடி செட்டைப் பெற ஒரு பேஸ் கலர் மற்றும் ஒரு ஹார்மனியைத் தேர்ந்தெடுக்கவும். எந்த ஸ்வாட்சையும் தட்டி அதை பிரைமரி கலராக மாற்றவும், அல்லது ஒரே பிரஸில் ஹார்மனியைக் கொண்டு பேலட்டை மாற்றவும்.\n@@TOOL_PAPER\nஎந்த லைப்ரரியும் பிரிண்ட் டயலாக்கும் இல்லாமல், ஒரு உண்மையான PDF ஃபைலை உருவாக்குகிறது.\n@@HOW_PAPER\nபக்கத்தின் அளவு, ஓரியண்டேஷன் மற்றும் மார்ஜினைத் தேர்ந்தெடுத்து, கூடுதல் படங்களை கூடுதல் பக்கங்களாகச் சேர்க்கவும். டவுன்லோட் என்பதை அழுத்தவும், PDF உங்கள் டிவைஸில் எழுதப்படும். பக்கம் உயர்தர JPEG ஆக உட்பொதிக்கப்படுவதால் உரை மற்றும் படங்கள் கூர்மையாக இருக்கும்.\n@@TOOL_SHEET\nஒரு ஆப் ஐகான் செட்டை ஒற்றை .ico ஃபைலாக எக்ஸ்போர்ட் செய்கிறது, அல்லது உங்கள் விசிபிள் லேயர்களில் இருந்து உருவாக்கப்பட்ட ஸ்ப்ரைட் ஷீட்டை எக்ஸ்போர்ட் செய்கிறது.\n@@HOW_SHEET\nஐகான் மோட் 16, 32, 48, 64, 128 மற்றும் 256 பிக்சல் படங்களை ஒரு favicon.ico-வில் எழுதுகிறது. ஸ்ப்ரைட் மோட் ஒவ்வொரு விசிபிள் லேயரையும் ஒரு PNG-யில் அருகருகே வைத்து, கேம் என்ஜினுக்கு தயார் செய்கிறது.\n@@TOOL_VECTOR\nடிசைனை SVG ஆக எக்ஸ்போர்ட் செய்கிறது, எனவே உரையும் வடிவங்களும் எடிட் செய்யக்கூடிய வெக்டர்களாக இருக்கும்.\n@@HOW_VECTOR\nSVG-க்கு உள்ளே பிக்சல் வேலையை பேக்ரவுண்ட் இமேஜாக வைக்க Include painted layers என்பதை ஆன்-லேயே வைக்கவும், அல்லது சுத்தமான வெக்டர் ஃபைலுக்கு அதை ஆஃப் செய்யவும். எந்த பிரவுசர், Inkscape அல்லது Illustrator-லும் SVG-ஐ திறக்கவும்.\n@@TOOL_ART\nஎழுதப்பட்ட விளக்கத்திலிருந்து ஒரிஜினல் ஆர்ட்வொர்க்கை உருவாக்குகிறது.\n@@HOW_ART\nநீங்கள் விரும்புவதை டைப் செய்து ஒரு ஸ்டைலைத் தேர்ந்தெடுக்கவும்: கலர் மெஷ், அலைகள், பௌஹாஸ் வடிவங்கள், வளையங்கள் அல்லது கிரெய்ன் கிரேடியன்ட். அதே வார்த்தைகளிலிருந்து வேறுபட்ட படத்திற்கு வேரியேஷனை மாற்றவும். இது உங்கள் வார்த்தைகளிலிருந்து உருவாக்கப்பட்ட ப்ரொசீஜரல் காம்போசிஷன், டவுன்லோட் செய்யப்பட்ட AI மாடல் அல்ல.\n@@TOOL_ID\nஒரு புகைப்படத்தை பாஸ்போர்ட் அளவிற்கு கட் செய்து, பல காப்பிகளை ஒரு பிரிண்ட் ஷீட்டில் வைக்கிறது.\n@@HOW_ID\nஉங்கள் நாடு கேட்கும் அளவை, பிரிண்ட் DPI மற்றும் ஷீட்டில் எத்தனை காப்பிகள் பொருந்தும் என்பதைத் தேர்ந்தெடுக்கவும். சரியான அளவிலான புகைப்படத்திற்கு குறிப்பிட்ட DPI-யில் PNG-ஐ டவுன்லோட் செய்து பிரிண்ட் செய்யவும்.\n@@TOOL_SEAL\nஆர்ட்வொர்க் முழுவதும் ஒரு டைல்டு வாட்டர்மார்க் அல்லது ஸ்டாம்பை சேர்க்கிறது.\n@@HOW_SEAL\nஉங்கள் பெயர் அல்லது பிராண்டை டைப் செய்து, பின்னர் அளவு, கோணம், இடைவெளி மற்றும் ஓபசிட்டியை அமைக்கவும். படம் படிக்கும்படி இருக்க ஓபசிட்டியை குறைவாக வைக்கவும். இதை டிசைனின் ஒரு காப்பியில் அப்ளை செய்யவும், ஒரே காப்பியில் அல்ல.\n@@TOOL_BATCH\nபல படங்களை ஒரே நேரத்தில் கன்வெர்ட் செய்து ரீசைஸ் செய்கிறது, எல்லாமே இந்த டிவைஸிலேயே நடக்கும்.\n@@HOW_BATCH\nஃபைல்களைத் தேர்ந்தெடுத்து, நீண்ட பக்கம், ஃபார்மேட் மற்றும் தரத்தை அமைத்து, பின்னர் புதிய லேயராக சேர் என்பதை அழுத்தவும். ஒவ்வொரு கன்வெர்ட் செய்யப்பட்ட ஃபைலும் தனித்தனியாக சேவ் செய்யப்படும், எனவே ஒரு முழு ஃபோல்டரையும் ஒரே முறையில் தயார் செய்யலாம்.\n@@TIPS_H\nடிப்ஸ்\n@@TIPS\n- ஒவ்வொரு டூலும் ஒரு புதிய லேயரை சேர்க்கும், எனவே லேயரை மறைப்பதன் மூலம் ஒரிஜினலுடன் ஒப்பிடலாம்.\n- வேகம் கருதி ப்ரிவியூ என்பது அளவிடப்பட்ட காப்பி மட்டுமே; நீங்கள் அப்ளை செய்யும் முடிவு எப்போதும் முழு ரெசல்யூஷனில்தான் இருக்கும்.\n- கட், கிளியர், ஜூம் மற்றும் ID ஆகியவை வேறு அளவை உருவாக்கலாம். அவற்றுக்கு Open as new document-ஐப் பயன்படுத்தவும்.\n- ஒரு பெரிய கேன்வாஸில் ஒரு டூல் மெதுவாக வேலை செய்வது போல் தெரிந்தால், முழு டிசைனுக்குப் பதிலாக ஆக்டிவ் லேயரில் அதை ரன் செய்யவும்.\n- மேனுவல் உட்பட இங்குள்ள அனைத்தும் இன்டர்நெட் ஆஃப் செய்து வேலை செய்யும்.\n@@OFFLINE\nஇந்த பேனலில் எதுவும் இன்டர்நெட்டைப் பயன்படுத்தாது. ஃபான்ட்கள், ஐகான்கள், டூல்ஸ் மற்றும் மேனுவல் அனைத்தும் ஆப்பிலேயே ஸ்டோர் செய்யப்பட்டுள்ளன, எனவே இது ரயிலில், கிராமத்தில் அல்லது நெட்வொர்க் இல்லாத நேரத்திலும் வேலை செய்யும்."
    },
    "te": {
      ui: {
              "title": "Nirbhar టూల్స్",
              "subtitle": "ఆఫ్‌లైన్ టూల్స్ — అప్‌లోడ్ లేదు, అకౌంట్ లేదు, నెట్‌వర్క్ అవసరం లేదు",
              "manual": "మాన్యువల్",
              "manualtitle": "Nirbhar మాన్యువల్",
              "footnote": "ప్రతి టూల్ ఈ పేజీలోనే రన్ అవుతుంది. రిజల్ట్స్ ఒక కొత్త లేయర్‌గా యాడ్ అవుతాయి, కాబట్టి మీ ఒరిజినల్ అలాగే ఉంటుంది.",
              "source": "సోర్స్",
              "design": "మొత్తం డిజైన్",
              "layer": "యాక్టివ్ లేయర్",
              "close": "మూసివేయండి",
              "newdoc": "కొత్త డాక్యుమెంట్‌గా ఓపెన్ చేయండి",
              "download": "డౌన్‌లోడ్",
              "apply": "కొత్త లేయర్‌గా యాడ్ చేయండి",
              "usepalette": "ప్యాలెట్‌గా వాడండి",
              "fromimage": "ఇమేజ్ నుండి",
              "harmony": "హార్మొనీ",
              "useharmony": "హార్మొనీని ప్యాలెట్‌గా వాడండి",
              "paletteset": "ప్యాలెట్ రీప్లేస్ చేయబడింది",
              "nosource": "ఇంకా పనిచేయడానికి ఏమీ లేదు — ముందుగా ఏదైనా గీయండి",
              "pickfiles": "ముందుగా కనీసం ఒక ఇమేజ్‌ని ఎంచుకోండి"
      },
      tools: {
              "cut": {
                      "desc": "ఫోటో, లోగో లేదా స్కాన్ నుండి బ్యాక్‌గ్రౌండ్‌ను తీసేసి, సబ్జెక్ట్‌ను ఉంచుతుంది.",
                      "how": "నాలుగు మూలలను శాంపిల్ చేయడానికి Auto ని ఎంచుకోండి, లేదా తీసేయాల్సిన రంగును ఎంచుకోండి. మిగిలిపోయినవి ఉంటే Tolerance పెంచండి, సబ్జెక్ట్ కట్ అవుతుంటే దాన్ని తగ్గించండి. Edge soften అనేది జుట్టును మరియు యాంటీఅలియాస్డ్ అంచులను క్లీన్‌గా ఉంచుతుంది, మరియు Clean colour fringes అనేది రంగుల వలయాన్ని తొలగిస్తుంది."
              },
              "clear": {
                      "desc": "ఫోటోను మెరుగుపరుస్తుంది: వైట్ బ్యాలెన్స్, లెవెల్స్, నాయిస్, హేజ్, క్లారిటీ మరియు షార్పెనింగ్.",
                      "how": "ఫోటోను చదివి దానంతట అదే బలాన్ని ఎంచుకునే వన్-ప్రెస్ ఫిక్స్ కోసం Automatic recipe ని ఆన్ ఉంచండి. ప్రతి స్టెప్‌ను మీరే సెట్ చేయడానికి దాన్ని ఆఫ్ చేయండి. పంచ్‌ కోసం Clarity ని మరియు చివరగా Sharpen ని వాడండి."
              },
              "zoom": {
                      "desc": "అంచులు బ్లర్ అవ్వకుండా డిజైన్‌ను రెండు, మూడు, నాలుగు లేదా ఎనిమిది రెట్లు పెద్దది చేస్తుంది.",
                      "how": "ఫోటోల కోసం Lanczos ని, స్మూత్ గ్రాఫిక్స్ కోసం Bicubic ని మరియు పిక్సెల్ ఆర్ట్ కోసం EPX ని వాడండి, ఎందుకంటే EPX డయాగోనల్ స్టెప్స్‌ను షార్ప్ గా ఉంచుతుంది. Sharpen after అనేది పెద్దది చేసిన రిజల్ట్‌కు కొంచెం క్రిస్ప్‌నెస్‌ను జోడిస్తుంది."
              },
              "tone": {
                      "desc": "ఆర్ట్‌వర్క్‌కు ప్రింటెడ్ లేదా గ్రాఫిక్ లుక్‌ను ఇస్తుంది: హాఫ్‌టోన్ డాట్స్, డ్యూటోన్, గ్రేడియంట్ మ్యాప్, పెన్సిల్ స్కెచ్ మరియు కలర్-బ్లైండ్‌నెస్ చెక్.",
                      "how": "హాఫ్‌టోన్ పోస్టర్లు మరియు జైన్స్ కోసం చిత్రాన్ని డాట్స్‌గా మారుస్తుంది. డ్యూటోన్ మరియు గ్రేడియంట్ మ్యాప్ దాన్ని రెండు రంగులతో రీకలర్ చేస్తాయి. పెన్సిల్ స్కెచ్ అంచులను గీస్తుంది. కలర్-బ్లైండ్‌నెస్ చెక్ అనేది కలర్-బ్లైండ్ వ్యక్తికి ప్యాలెట్ ఎలా కనిపిస్తుందో చూపిస్తుంది."
              },
              "tile": {
                      "desc": "ఇమేజ్‌ను సీమ్‌లెస్ గా చేస్తుంది, కాబట్టి అది కనిపించే జాయింట్ లేకుండా రిపీట్ అవుతుంది.",
                      "how": "ఆటోమేటిక్ బలం కోసం Seam blend ని సున్నా వద్ద ఉంచండి. రిజల్ట్‌ను అప్లై చేయండి, ఆపై దాన్ని ప్యాటర్న్ బ్యాక్‌గ్రౌండ్, గేమ్ టెక్స్చర్ లేదా వాల్‌పేపర్‌గా వాడండి."
              },
              "pal": {
                      "desc": "ఇమేజ్ రంగులను ఎక్స్‌ట్రాక్ట్ చేసి, దానికి సరిపోయే కలర్ హార్మొనీలను తయారు చేస్తుంది.",
                      "how": "ఎన్ని రంగులను బయటకు తీయాలో సెట్ చేయండి మరియు టూల్ చిత్రాన్ని చదువుతుంది. రెడీ సెట్‌ను పొందడానికి బేస్ కలర్ మరియు హార్మొనీని ఎంచుకోండి. ఏదైనా స్వాచ్‌ను ప్రైమరీ కలర్‌గా చేయడానికి ట్యాప్ చేయండి, లేదా ఒకే ప్రెస్‌తో హార్మొనీతో ప్యాలెట్‌ను రీప్లేస్ చేయండి."
              },
              "paper": {
                      "desc": "ఏ లైబ్రరీ మరియు ప్రింట్ డైలాగ్ లేకుండా, నిజమైన PDF ఫైల్‌ను తయారు చేస్తుంది.",
                      "how": "పేజీ సైజు, ఓరియంటేషన్ మరియు మార్జిన్‌ను ఎంచుకోండి, మరియు అదనపు ఇమేజ్‌లను మరిన్ని పేజీలుగా యాడ్ చేయండి. Download నొక్కండి మరియు PDF మీ డివైజ్‌లో సేవ్ అవుతుంది. పేజీ హై-క్వాలిటీ JPEG గా ఎంబెడ్ చేయబడినందున టెక్స్ట్ మరియు ఇమేజ్‌లు షార్ప్‌గా ఉంటాయి."
              },
              "sheet": {
                      "desc": "యాప్ ఐకాన్ సెట్‌ను ఒకే .ico ఫైల్‌గా ఎక్స్‌పోర్ట్ చేస్తుంది, లేదా మీ విజిబుల్ లేయర్ల నుండి తయారు చేసిన స్ప్రైట్ షీట్‌ను ఎక్స్‌పోర్ట్ చేస్తుంది.",
                      "how": "ఐకాన్ మోడ్ 16, 32, 48, 64, 128 మరియు 256 పిక్సెల్ ఇమేజ్‌లను ఒకే favicon.ico లోకి రాస్తుంది. స్ప్రైట్ మోడ్ ప్రతి విజిబుల్ లేయర్‌ను ఒకదాని పక్కన ఒకటి ఒకే PNG పై ఉంచుతుంది, ఇది గేమ్ ఇంజిన్ కోసం రెడీగా ఉంటుంది."
              },
              "vector": {
                      "desc": "డిజైన్‌ను SVG గా ఎక్స్‌పోర్ట్ చేస్తుంది, కాబట్టి టెక్స్ట్ మరియు షేప్స్ ఎడిట్ చేయగల వెక్టర్స్‌గా ఉంటాయి.",
                      "how": "SVG లోపల పిక్సెల్ వర్క్‌ను బ్యాక్‌గ్రౌండ్ ఇమేజ్‌గా ఉంచడానికి Include painted layers ని ఆన్ ఉంచండి, లేదా ప్యూర్ వెక్టర్ ఫైల్ కోసం దాన్ని ఆఫ్ చేయండి. SVG ని ఏదైనా బ్రౌజర్, Inkscape లేదా Illustrator లో ఓపెన్ చేయండి."
              },
              "art": {
                      "desc": "రాసిన వివరణ నుండి ఒరిజినల్ ఆర్ట్‌వర్క్‌ను జనరేట్ చేస్తుంది.",
                      "how": "మీకు కావాల్సినదాన్ని టైప్ చేసి, ఒక స్టైల్‌ను ఎంచుకోండి: కలర్ మెష్, వేవ్స్, బౌహాస్ షేప్స్, రింగ్స్ లేదా గ్రెయిన్ గ్రేడియంట్. అదే పదాల నుండి వేరే చిత్రం కోసం Variation ని మార్చండి. ఇది మీ పదాల నుండి తయారు చేయబడిన ప్రొసీజరల్ కంపోజిషన్, డౌన్‌లోడ్ చేసిన AI మోడల్ కాదు."
              },
              "id": {
                      "desc": "పాస్‌పోర్ట్ సైజుకు ఫోటోను క్రాప్ చేసి, ఒక ప్రింట్ షీట్‌పై అనేక కాపీలను ఉంచుతుంది.",
                      "how": "మీ దేశం అడిగే సైజును, ప్రింట్ DPI ని మరియు షీట్‌పై ఎన్ని కాపీలు సరిపోతాయో ఎంచుకోండి. సరైన సైజులో ఫోటో కోసం PNG ని డౌన్‌లోడ్ చేసి, చెప్పిన DPI వద్ద ప్రింట్ చేయండి."
              },
              "seal": {
                      "desc": "ఆర్ట్‌వర్క్ అంతటా టైల్డ్ వాటర్‌మార్క్ లేదా స్టాంప్‌ను యాడ్ చేస్తుంది.",
                      "how": "మీ పేరు లేదా బ్రాండ్‌ను టైప్ చేయండి, ఆపై సైజు, యాంగిల్, స్పేసింగ్ మరియు ఓపాసిటీని సెట్ చేయండి. చిత్రం చదవడానికి వీలుగా ఉండేలా ఓపాసిటీని తక్కువగా ఉంచండి. డిజైన్‌పై ఉన్న ఒకే కాపీకి కాకుండా, దాని కాపీకి దీన్ని అప్లై చేయండి."
              },
              "batch": {
                      "desc": "ఒకేసారి అనేక ఇమేజ్‌లను కన్వర్ట్ చేసి రీసైజ్ చేస్తుంది, అన్నీ ఈ డివైజ్‌లోనే జరుగుతాయి.",
                      "how": "ఫైల్‌లను ఎంచుకోండి, పొడవైన వైపు, ఫార్మాట్ మరియు క్వాలిటీని సెట్ చేయండి, ఆపై Add as new layer నొక్కండి. ప్రతి కన్వర్ట్ చేయబడిన ఫైల్ విడిగా సేవ్ అవుతుంది, కాబట్టి ఒకేసారి ఒక ఫోల్డర్‌ను తయారు చేయవచ్చు."
              }
      },
      manual: "@@TITLE\nNirbhar మాన్యువల్\n@@INTRO\nNirbhar అంటే స్వయం సమృద్ధి. ఇది పిక్సెల్ స్టూడియోలో ఉన్న ఆఫ్‌లైన్ టూల్‌బాక్స్: బ్యాక్‌గ్రౌండ్‌ని తీసేయడం, ఫోటో క్వాలిటీని పెంచడం, అప్‌స్కేల్ చేయడం, PDF ని తయారు చేయడం, యాప్ ఐకాన్‌ని తయారు చేయడం, జనరేటివ్ ఆర్ట్‌ని గీయడం లాంటి పదమూడు టూల్స్ ఇందులో ఉన్నాయి. అన్నీ మీ డివైజ్‌లోనే ఈ పేజీ ద్వారా క్యాలిక్యులేట్ అవుతాయి. ఇందులో అప్‌లోడ్, అకౌంట్, API కీ, మోడల్ డౌన్‌లోడ్ లేదా ఇంటర్నెట్ కనెక్షన్ ఏమీ అవసరం లేదు.\n@@START_H\nనాలుగు దశల్లో స్టార్ట్ చేయండి\n@@START\n- కుడివైపున ఉన్న Nirbhar ట్యాబ్‌ను ఓపెన్ చేయండి (ఫోన్‌లో, కింద ఉన్న షీట్‌పై ట్యాప్ చేయండి).\n- ఒక టూల్‌ని ఎంచుకోండి. ప్రివ్యూ మరియు దాని స్వంత సెట్టింగ్‌లతో ఒక డైలాగ్ ఓపెన్ అవుతుంది.\n- ప్రివ్యూ సరిగ్గా కనిపించే వరకు సెట్టింగ్‌లను మార్చండి; ప్రివ్యూ అనేది కేవలం ఒక స్కేల్డ్ కాపీ మాత్రమే, అసలు పని పూర్తి సైజులో జరుగుతుంది.\n- Add as new layer నొక్కండి. మీ ఒరిజినల్ అలాగే ఉంటుంది, మరియు రిజల్ట్ మీరు ఎడిట్ చేస్తూ ఉండటానికి ఒక కొత్త లేయర్‌గా మారుతుంది.\n@@TOOLS_H\nఆ పదమూడు టూల్స్\n@@TOOL_CUT\nఫోటో, లోగో లేదా స్కాన్ నుండి బ్యాక్‌గ్రౌండ్‌ను తీసేసి, సబ్జెక్ట్‌ను ఉంచుతుంది.\n@@HOW_CUT\nనాలుగు మూలలను శాంపిల్ చేయడానికి Auto ని ఎంచుకోండి, లేదా తీసేయాల్సిన రంగును ఎంచుకోండి. మిగిలిపోయినవి ఉంటే Tolerance పెంచండి, సబ్జెక్ట్ కట్ అవుతుంటే దాన్ని తగ్గించండి. Edge soften అనేది జుట్టును మరియు యాంటీఅలియాస్డ్ అంచులను క్లీన్‌గా ఉంచుతుంది, మరియు Clean colour fringes అనేది రంగుల వలయాన్ని తొలగిస్తుంది.\n@@TOOL_CLEAR\nఫోటోను మెరుగుపరుస్తుంది: వైట్ బ్యాలెన్స్, లెవెల్స్, నాయిస్, హేజ్, క్లారిటీ మరియు షార్పెనింగ్.\n@@HOW_CLEAR\nఫోటోను చదివి దానంతట అదే బలాన్ని ఎంచుకునే వన్-ప్రెస్ ఫిక్స్ కోసం Automatic recipe ని ఆన్ ఉంచండి. ప్రతి స్టెప్‌ను మీరే సెట్ చేయడానికి దాన్ని ఆఫ్ చేయండి. పంచ్‌ కోసం Clarity ని మరియు చివరగా Sharpen ని వాడండి.\n@@TOOL_ZOOM\nఅంచులు బ్లర్ అవ్వకుండా డిజైన్‌ను రెండు, మూడు, నాలుగు లేదా ఎనిమిది రెట్లు పెద్దది చేస్తుంది.\n@@HOW_ZOOM\nఫోటోల కోసం Lanczos ని, స్మూత్ గ్రాఫిక్స్ కోసం Bicubic ని మరియు పిక్సెల్ ఆర్ట్ కోసం EPX ని వాడండి, ఎందుకంటే EPX డయాగోనల్ స్టెప్స్‌ను షార్ప్ గా ఉంచుతుంది. Sharpen after అనేది పెద్దది చేసిన రిజల్ట్‌కు కొంచెం క్రిస్ప్‌నెస్‌ను జోడిస్తుంది.\n@@TOOL_TONE\nఆర్ట్‌వర్క్‌కు ప్రింటెడ్ లేదా గ్రాఫిక్ లుక్‌ను ఇస్తుంది: హాఫ్‌టోన్ డాట్స్, డ్యూటోన్, గ్రేడియంట్ మ్యాప్, పెన్సిల్ స్కెచ్ మరియు కలర్-బ్లైండ్‌నెస్ చెక్.\n@@HOW_TONE\nహాఫ్‌టోన్ పోస్టర్లు మరియు జైన్స్ కోసం చిత్రాన్ని డాట్స్‌గా మారుస్తుంది. డ్యూటోన్ మరియు గ్రేడియంట్ మ్యాప్ దాన్ని రెండు రంగులతో రీకలర్ చేస్తాయి. పెన్సిల్ స్కెచ్ అంచులను గీస్తుంది. కలర్-బ్లైండ్‌నెస్ చెక్ అనేది కలర్-బ్లైండ్ వ్యక్తికి ప్యాలెట్ ఎలా కనిపిస్తుందో చూపిస్తుంది.\n@@TOOL_TILE\nఇమేజ్‌ను సీమ్‌లెస్ గా చేస్తుంది, కాబట్టి అది కనిపించే జాయింట్ లేకుండా రిపీట్ అవుతుంది.\n@@HOW_TILE\nఆటోమేటిక్ బలం కోసం Seam blend ని సున్నా వద్ద ఉంచండి. రిజల్ట్‌ను అప్లై చేయండి, ఆపై దాన్ని ప్యాటర్న్ బ్యాక్‌గ్రౌండ్, గేమ్ టెక్స్చర్ లేదా వాల్‌పేపర్‌గా వాడండి.\n@@TOOL_PAL\nఇమేజ్ రంగులను ఎక్స్‌ట్రాక్ట్ చేసి, దానికి సరిపోయే కలర్ హార్మొనీలను తయారు చేస్తుంది.\n@@HOW_PAL\nఎన్ని రంగులను బయటకు తీయాలో సెట్ చేయండి మరియు టూల్ చిత్రాన్ని చదువుతుంది. రెడీ సెట్‌ను పొందడానికి బేస్ కలర్ మరియు హార్మొనీని ఎంచుకోండి. ఏదైనా స్వాచ్‌ను ప్రైమరీ కలర్‌గా చేయడానికి ట్యాప్ చేయండి, లేదా ఒకే ప్రెస్‌తో హార్మొనీతో ప్యాలెట్‌ను రీప్లేస్ చేయండి.\n@@TOOL_PAPER\nఏ లైబ్రరీ మరియు ప్రింట్ డైలాగ్ లేకుండా, నిజమైన PDF ఫైల్‌ను తయారు చేస్తుంది.\n@@HOW_PAPER\nపేజీ సైజు, ఓరియంటేషన్ మరియు మార్జిన్‌ను ఎంచుకోండి, మరియు అదనపు ఇమేజ్‌లను మరిన్ని పేజీలుగా యాడ్ చేయండి. Download నొక్కండి మరియు PDF మీ డివైజ్‌లో సేవ్ అవుతుంది. పేజీ హై-క్వాలిటీ JPEG గా ఎంబెడ్ చేయబడినందున టెక్స్ట్ మరియు ఇమేజ్‌లు షార్ప్‌గా ఉంటాయి.\n@@TOOL_SHEET\nయాప్ ఐకాన్ సెట్‌ను ఒకే .ico ఫైల్‌గా ఎక్స్‌పోర్ట్ చేస్తుంది, లేదా మీ విజిబుల్ లేయర్ల నుండి తయారు చేసిన స్ప్రైట్ షీట్‌ను ఎక్స్‌పోర్ట్ చేస్తుంది.\n@@HOW_SHEET\nఐకాన్ మోడ్ 16, 32, 48, 64, 128 మరియు 256 పిక్సెల్ ఇమేజ్‌లను ఒకే favicon.ico లోకి రాస్తుంది. స్ప్రైట్ మోడ్ ప్రతి విజిబుల్ లేయర్‌ను ఒకదాని పక్కన ఒకటి ఒకే PNG పై ఉంచుతుంది, ఇది గేమ్ ఇంజిన్ కోసం రెడీగా ఉంటుంది.\n@@TOOL_VECTOR\nడిజైన్‌ను SVG గా ఎక్స్‌పోర్ట్ చేస్తుంది, కాబట్టి టెక్స్ట్ మరియు షేప్స్ ఎడిట్ చేయగల వెక్టర్స్‌గా ఉంటాయి.\n@@HOW_VECTOR\nSVG లోపల పిక్సెల్ వర్క్‌ను బ్యాక్‌గ్రౌండ్ ఇమేజ్‌గా ఉంచడానికి Include painted layers ని ఆన్ ఉంచండి, లేదా ప్యూర్ వెక్టర్ ఫైల్ కోసం దాన్ని ఆఫ్ చేయండి. SVG ని ఏదైనా బ్రౌజర్, Inkscape లేదా Illustrator లో ఓపెన్ చేయండి.\n@@TOOL_ART\nరాసిన వివరణ నుండి ఒరిజినల్ ఆర్ట్‌వర్క్‌ను జనరేట్ చేస్తుంది.\n@@HOW_ART\nమీకు కావాల్సినదాన్ని టైప్ చేసి, ఒక స్టైల్‌ను ఎంచుకోండి: కలర్ మెష్, వేవ్స్, బౌహాస్ షేప్స్, రింగ్స్ లేదా గ్రెయిన్ గ్రేడియంట్. అదే పదాల నుండి వేరే చిత్రం కోసం Variation ని మార్చండి. ఇది మీ పదాల నుండి తయారు చేయబడిన ప్రొసీజరల్ కంపోజిషన్, డౌన్‌లోడ్ చేసిన AI మోడల్ కాదు.\n@@TOOL_ID\nపాస్‌పోర్ట్ సైజుకు ఫోటోను క్రాప్ చేసి, ఒక ప్రింట్ షీట్‌పై అనేక కాపీలను ఉంచుతుంది.\n@@HOW_ID\nమీ దేశం అడిగే సైజును, ప్రింట్ DPI ని మరియు షీట్‌పై ఎన్ని కాపీలు సరిపోతాయో ఎంచుకోండి. సరైన సైజులో ఫోటో కోసం PNG ని డౌన్‌లోడ్ చేసి, చెప్పిన DPI వద్ద ప్రింట్ చేయండి.\n@@TOOL_SEAL\nఆర్ట్‌వర్క్ అంతటా టైల్డ్ వాటర్‌మార్క్ లేదా స్టాంప్‌ను యాడ్ చేస్తుంది.\n@@HOW_SEAL\nమీ పేరు లేదా బ్రాండ్‌ను టైప్ చేయండి, ఆపై సైజు, యాంగిల్, స్పేసింగ్ మరియు ఓపాసిటీని సెట్ చేయండి. చిత్రం చదవడానికి వీలుగా ఉండేలా ఓపాసిటీని తక్కువగా ఉంచండి. డిజైన్‌పై ఉన్న ఒకే కాపీకి కాకుండా, దాని కాపీకి దీన్ని అప్లై చేయండి.\n@@TOOL_BATCH\nఒకేసారి అనేక ఇమేజ్‌లను కన్వర్ట్ చేసి రీసైజ్ చేస్తుంది, అన్నీ ఈ డివైజ్‌లోనే జరుగుతాయి.\n@@HOW_BATCH\nఫైల్‌లను ఎంచుకోండి, పొడవైన వైపు, ఫార్మాట్ మరియు క్వాలిటీని సెట్ చేయండి, ఆపై Add as new layer నొక్కండి. ప్రతి కన్వర్ట్ చేయబడిన ఫైల్ విడిగా సేవ్ అవుతుంది, కాబట్టి ఒకేసారి ఒక ఫోల్డర్‌ను తయారు చేయవచ్చు.\n@@TIPS_H\nచిట్కాలు\n@@TIPS\n- ప్రతి టూల్ ఒక కొత్త లేయర్‌ను యాడ్ చేస్తుంది, కాబట్టి లేయర్‌ను హైడ్ చేయడం ద్వారా మీరు దాన్ని ఒరిజినల్‌తో పోల్చి చూడవచ్చు.\n- స్పీడ్ కోసం ప్రివ్యూ అనేది ఒక స్కేల్డ్ కాపీ; మీరు అప్లై చేసే రిజల్ట్ ఎప్పుడూ ఫుల్ రిజల్యూషన్‌లో ఉంటుంది.\n- Cut, Clear, Zoom మరియు ID వేరే సైజును ప్రొడ్యూస్ చేయగలవు. వాటి కోసం Open as new document ని వాడండి.\n- పెద్ద కాన్వాస్‌పై ఒక టూల్ స్లోగా అనిపిస్తే, మొత్తం డిజైన్‌కు బదులుగా యాక్టివ్ లేయర్‌పై దాన్ని రన్ చేయండి.\n- మాన్యువల్‌తో సహా ఇక్కడ ప్రతిదీ ఇంటర్నెట్ ఆఫ్ చేసి కూడా పనిచేస్తుంది.\n@@OFFLINE\nఈ ప్యానెల్‌లో ఏదీ ఇంటర్నెట్‌ను వాడదు. ఫాంట్‌లు, ఐకాన్‌లు, టూల్స్ మరియు మాన్యువల్ అన్నీ యాప్‌తో పాటే స్టోర్ చేయబడతాయి, కాబట్టి ఇది రైలులో, గ్రామంలో లేదా ఇంటర్నెట్ లేనప్పుడు కూడా పనిచేస్తుంది."
    },
    "mr": {
      ui: {
              "title": "Nirbhar टूल्स",
              "subtitle": "ऑफलाइन टूल्स — अपलोड नाही, अकाउंट नाही, नेटवर्क नाही",
              "manual": "मॅन्युअल",
              "manualtitle": "Nirbhar मॅन्युअल",
              "footnote": "प्रत्येक टूल या पेजमध्येच चालते. निकाल एक नवीन लेयर म्हणून जोडले जातात, त्यामुळे तुमचा मूळ फोटो तसाच राहतो.",
              "source": "सोर्स",
              "design": "संपूर्ण डिझाईन",
              "layer": "अॅक्टिव्ह लेयर",
              "close": "बंद करा",
              "newdoc": "नवीन डॉक्युमेंट म्हणून उघडा",
              "download": "डाउनलोड",
              "apply": "नवीन लेयर म्हणून जोडा",
              "usepalette": "पॅलेट म्हणून वापरा",
              "fromimage": "इमेजमधून",
              "harmony": "हार्मनी",
              "useharmony": "हार्मनी पॅलेट म्हणून वापरा",
              "paletteset": "पॅलेट बदलले",
              "nosource": "अजून काम करण्यासाठी काही नाही — आधी काहीतरी काढा",
              "pickfiles": "आधी किमान एक इमेज निवडा"
      },
      tools: {
              "cut": {
                      "desc": "फोटो, लोगो किंवा स्कॅनमधून बॅकग्राउंड काढते आणि मुख्य विषय तसाच ठेवते.",
                      "how": "चार कोपरे सॅम्पल करण्यासाठी Auto निवडा, किंवा काढण्यासाठी एखादा रंग निवडा. जर काही उरले असेल तर Tolerance वाढवा, आणि जर मुख्य विषय कट होत असेल तर ते कमी करा. Edge soften मुळे केस आणि गुळगुळीत कडा स्वच्छ राहतात, आणि Clean colour fringes मुळे रंगाची छटा निघून जाते."
              },
              "clear": {
                      "desc": "फोटो सुधारते: व्हाईट बॅलन्स, लेव्हल्स, नॉईज, हेझ, क्लॅरिटी आणि शार्पनिंग.",
                      "how": "एक-दाब फिक्ससाठी Automatic recipe चालू ठेवा जे फोटो वाचते आणि स्वतःच ताकद निवडते. प्रत्येक पायरी हाताने सेट करण्यासाठी ते बंद करा. प्रभावासाठी Clarity वापरा आणि सर्वात शेवटी Sharpen वापरा."
              },
              "zoom": {
                      "desc": "कडा अस्पष्ट न करता डिझाईन दोन, तीन, चार किंवा आठ पट मोठी करते.",
                      "how": "फोटोसाठी Lanczos, गुळगुळीत ग्राफिक्ससाठी Bicubic आणि पिक्सेल आर्टसाठी EPX वापरा, कारण EPX तिरप्या पायऱ्या स्पष्ट ठेवते. Sharpen after मुळे मोठ्या केलेल्या निकालात थोडा कुरकुरीतपणा येतो."
              },
              "tone": {
                      "desc": "आर्टवर्कला प्रिंटेड किंवा ग्राफिक लूक देते: हाफटोन डॉट्स, ड्युओटोन, ग्रेडियंट मॅप, पेन्सिल स्केच आणि कलर-ब्लाइंडनेस चेक.",
                      "how": "हाफटोन पोस्टर आणि झीन्ससाठी चित्राला डॉट्समध्ये बदलते. ड्युओटोन आणि ग्रेडियंट मॅप त्याला दोन रंगांनी पुन्हा रंगवतात. पेन्सिल स्केच कडा काढते. कलर-ब्लाइंडनेस चेक दाखवतो की पॅलेट कलर-ब्लाइंड व्यक्तीला कसे दिसते."
              },
              "tile": {
                      "desc": "इमेज सीमलेस बनवते, जेणेकरून ती जोडलेला भाग न दिसता पुन्हा पुन्हा येते.",
                      "how": "ऑटोमॅटिक ताकदीसाठी Seam blend शून्यावर ठेवा. निकाल लागू करा, आणि मग त्याचा पॅटर्न बॅकग्राउंड, गेम टेक्सचर किंवा वॉलपेपर म्हणून वापर करा."
              },
              "pal": {
                      "desc": "इमेजमधील रंग काढते आणि जुळणारे कलर हार्मनी तयार करते.",
                      "how": "किती रंग काढायचे ते सेट करा आणि टूल चित्र वाचते. तयार सेट मिळवण्यासाठी बेस कलर आणि हार्मनी निवडा. कोणताही स्वॅच टॅप करून तो प्राथमिक रंग बनवा, किंवा एका दाबात पॅलेटच्या जागी हार्मनी वापरा."
              },
              "paper": {
                      "desc": "कोणतीही लायब्ररी आणि प्रिंट डायलॉगशिवाय एक खरी PDF फाईल बनवते.",
                      "how": "पेजचा आकार, ओरिएंटेशन आणि मार्जिन निवडा, आणि अतिरिक्त इमेजेस अधिक पेजेस म्हणून जोडा. Download वर दाबा आणि PDF तुमच्या डिव्हाइसवर सेव्ह होते. मजकूर आणि इमेजेस स्पष्ट राहतात कारण पेज हाय-क्वालिटी JPEG म्हणून एम्बेड केलेले असते."
              },
              "sheet": {
                      "desc": "ॲप आयकॉन सेट एकाच .ico फाईलमध्ये एक्सपोर्ट करते, किंवा तुमच्या दिसणाऱ्या लेयर्समधून बनवलेली स्प्राइट शीट.",
                      "how": "आयकॉन मोड एका favicon.ico मध्ये 16, 32, 48, 64, 128 आणि 256 पिक्सेल इमेजेस लिहितो. स्प्राइट मोड प्रत्येक दिसणारा लेयर एका PNG वर शेजारी-शेजारी ठेवतो, जो गेम इंजिनसाठी तयार असतो."
              },
              "vector": {
                      "desc": "डिझाईन SVG म्हणून एक्सपोर्ट करते, जेणेकरून मजकूर आणि आकार एडिट करण्यायोग्य वेक्टर्स राहतात.",
                      "how": "SVG च्या आत पिक्सेल वर्क बॅकग्राउंड इमेज म्हणून ठेवण्यासाठी Include painted layers चालू ठेवा, किंवा शुद्ध वेक्टर फाईलसाठी ते बंद करा. SVG कोणत्याही ब्राउझर, Inkscape किंवा Illustrator मध्ये उघडा."
              },
              "art": {
                      "desc": "लिखित वर्णनावरून मूळ आर्टवर्क तयार करते.",
                      "how": "तुम्हाला जे हवे ते टाईप करा आणि एक स्टाईल निवडा: कलर मेश, वेव्हज, बाऊहॉस आकार, रिंग्ज किंवा ग्रेन ग्रेडियंट. त्याच शब्दांमधून वेगळे चित्र मिळवण्यासाठी Variation बदला. हे तुमच्या शब्दांमधून बनवलेले प्रोसिजरल कंपोझिशन आहे, डाउनलोड केलेले AI मॉडेल नाही."
              },
              "id": {
                      "desc": "फोटो पासपोर्ट साईझमध्ये क्रॉप करते आणि एका प्रिंट शीटवर अनेक कॉपीज ठेवते.",
                      "how": "तुमच्या देशाने मागितलेला आकार, प्रिंट DPI आणि शीटवर किती कॉपीज बसतील ते निवडा. PNG डाउनलोड करा आणि योग्य आकाराच्या फोटोसाठी सांगितलेल्या DPI वर प्रिंट करा."
              },
              "seal": {
                      "desc": "आर्टवर्कवर टायल्ड वॉटरमार्क किंवा स्टॅम्प जोडते.",
                      "how": "तुमचे नाव किंवा ब्रँड टाईप करा, मग आकार, कोन, अंतर आणि ओपॅसिटी सेट करा. ओपॅसिटी कमी ठेवा जेणेकरून चित्र वाचता येईल. ते डिझाईनच्या कॉपीवर लागू करा, फक्त एकाच कॉपीवर नाही."
              },
              "batch": {
                      "desc": "एकाच वेळी अनेक इमेजेस कन्व्हर्ट आणि रिसाईझ करते, तेही या डिव्हाइसवर.",
                      "how": "फाईल्स निवडा, सर्वात लांब बाजू, फॉरमॅट आणि क्वालिटी सेट करा, आणि मग Add as new layer वर दाबा. प्रत्येक कन्व्हर्ट केलेली फाईल वेगळी सेव्ह होते, त्यामुळे संपूर्ण फोल्डर एकाच वेळी तयार करता येते."
              }
      },
      manual: "@@TITLE\nNirbhar मॅन्युअल\n@@INTRO\nNirbhar म्हणजे स्वयंपूर्ण. हे Pixel Studio मध्ये असलेले ऑफलाइन टूलबॉक्स आहे: तेरा टूल्स जे बॅकग्राउंड काढतात, फोटोची क्वालिटी वाढवतात, अपस्केल करतात, PDF बनवतात, ॲप आयकॉन तयार करतात, जनरेटिव्ह आर्ट काढतात आणि बरेच काही. सर्व काही तुमच्या स्वतःच्या डिव्हाइसवर या पेजद्वारे प्रोसेस केले जाते. यात कोणतेही अपलोड, अकाउंट, API की, मॉडेल डाउनलोड आणि इंटरनेट कनेक्शन नसते.\n@@START_H\nचार टप्प्यांत सुरुवात करा\n@@START\n- उजवीकडे Nirbhar टॅब उघडा (फोनवर, तळाची शीट टॅप करा).\n- एक टूल निवडा. एक डायलॉग उघडेल ज्यामध्ये प्रिव्ह्यू आणि स्वतःच्या सेटिंग्स असतील.\n- प्रिव्ह्यू बरोबर दिसेपर्यंत सेटिंग्स बदला; प्रिव्ह्यू ही एक छोटी कॉपी असते, खरे काम पूर्ण आकारात होते.\n- Add as new layer वर दाबा. तुमचा मूळ फोटो तसाच राहतो, आणि निकाल एक नवीन लेयर बनतो ज्यावर तुम्ही संपादन करत राहू शकता.\n@@TOOLS_H\nतेरा टूल्स\n@@TOOL_CUT\nफोटो, लोगो किंवा स्कॅनमधून बॅकग्राउंड काढते आणि मुख्य विषय तसाच ठेवते.\n@@HOW_CUT\nचार कोपरे सॅम्पल करण्यासाठी Auto निवडा, किंवा काढण्यासाठी एखादा रंग निवडा. जर काही उरले असेल तर Tolerance वाढवा, आणि जर मुख्य विषय कट होत असेल तर ते कमी करा. Edge soften मुळे केस आणि गुळगुळीत कडा स्वच्छ राहतात, आणि Clean colour fringes मुळे रंगाची छटा निघून जाते.\n@@TOOL_CLEAR\nफोटो सुधारते: व्हाईट बॅलन्स, लेव्हल्स, नॉईज, हेझ, क्लॅरिटी आणि शार्पनिंग.\n@@HOW_CLEAR\nएक-दाब फिक्ससाठी Automatic recipe चालू ठेवा जे फोटो वाचते आणि स्वतःच ताकद निवडते. प्रत्येक पायरी हाताने सेट करण्यासाठी ते बंद करा. प्रभावासाठी Clarity वापरा आणि सर्वात शेवटी Sharpen वापरा.\n@@TOOL_ZOOM\nकडा अस्पष्ट न करता डिझाईन दोन, तीन, चार किंवा आठ पट मोठी करते.\n@@HOW_ZOOM\nफोटोसाठी Lanczos, गुळगुळीत ग्राफिक्ससाठी Bicubic आणि पिक्सेल आर्टसाठी EPX वापरा, कारण EPX तिरप्या पायऱ्या स्पष्ट ठेवते. Sharpen after मुळे मोठ्या केलेल्या निकालात थोडा कुरकुरीतपणा येतो.\n@@TOOL_TONE\nआर्टवर्कला प्रिंटेड किंवा ग्राफिक लूक देते: हाफटोन डॉट्स, ड्युओटोन, ग्रेडियंट मॅप, पेन्सिल स्केच आणि कलर-ब्लाइंडनेस चेक.\n@@HOW_TONE\nहाफटोन पोस्टर आणि झीन्ससाठी चित्राला डॉट्समध्ये बदलते. ड्युओटोन आणि ग्रेडियंट मॅप त्याला दोन रंगांनी पुन्हा रंगवतात. पेन्सिल स्केच कडा काढते. कलर-ब्लाइंडनेस चेक दाखवतो की पॅलेट कलर-ब्लाइंड व्यक्तीला कसे दिसते.\n@@TOOL_TILE\nइमेज सीमलेस बनवते, जेणेकरून ती जोडलेला भाग न दिसता पुन्हा पुन्हा येते.\n@@HOW_TILE\nऑटोमॅटिक ताकदीसाठी Seam blend शून्यावर ठेवा. निकाल लागू करा, आणि मग त्याचा पॅटर्न बॅकग्राउंड, गेम टेक्सचर किंवा वॉलपेपर म्हणून वापर करा.\n@@TOOL_PAL\nइमेजमधील रंग काढते आणि जुळणारे कलर हार्मनी तयार करते.\n@@HOW_PAL\nकिती रंग काढायचे ते सेट करा आणि टूल चित्र वाचते. तयार सेट मिळवण्यासाठी बेस कलर आणि हार्मनी निवडा. कोणताही स्वॅच टॅप करून तो प्राथमिक रंग बनवा, किंवा एका दाबात पॅलेटच्या जागी हार्मनी वापरा.\n@@TOOL_PAPER\nकोणतीही लायब्ररी आणि प्रिंट डायलॉगशिवाय एक खरी PDF फाईल बनवते.\n@@HOW_PAPER\nपेजचा आकार, ओरिएंटेशन आणि मार्जिन निवडा, आणि अतिरिक्त इमेजेस अधिक पेजेस म्हणून जोडा. Download वर दाबा आणि PDF तुमच्या डिव्हाइसवर सेव्ह होते. मजकूर आणि इमेजेस स्पष्ट राहतात कारण पेज हाय-क्वालिटी JPEG म्हणून एम्बेड केलेले असते.\n@@TOOL_SHEET\nॲप आयकॉन सेट एकाच .ico फाईलमध्ये एक्सपोर्ट करते, किंवा तुमच्या दिसणाऱ्या लेयर्समधून बनवलेली स्प्राइट शीट.\n@@HOW_SHEET\nआयकॉन मोड एका favicon.ico मध्ये 16, 32, 48, 64, 128 आणि 256 पिक्सेल इमेजेस लिहितो. स्प्राइट मोड प्रत्येक दिसणारा लेयर एका PNG वर शेजारी-शेजारी ठेवतो, जो गेम इंजिनसाठी तयार असतो.\n@@TOOL_VECTOR\nडिझाईन SVG म्हणून एक्सपोर्ट करते, जेणेकरून मजकूर आणि आकार एडिट करण्यायोग्य वेक्टर्स राहतात.\n@@HOW_VECTOR\nSVG च्या आत पिक्सेल वर्क बॅकग्राउंड इमेज म्हणून ठेवण्यासाठी Include painted layers चालू ठेवा, किंवा शुद्ध वेक्टर फाईलसाठी ते बंद करा. SVG कोणत्याही ब्राउझर, Inkscape किंवा Illustrator मध्ये उघडा.\n@@TOOL_ART\nलिखित वर्णनावरून मूळ आर्टवर्क तयार करते.\n@@HOW_ART\nतुम्हाला जे हवे ते टाईप करा आणि एक स्टाईल निवडा: कलर मेश, वेव्हज, बाऊहॉस आकार, रिंग्ज किंवा ग्रेन ग्रेडियंट. त्याच शब्दांमधून वेगळे चित्र मिळवण्यासाठी Variation बदला. हे तुमच्या शब्दांमधून बनवलेले प्रोसिजरल कंपोझिशन आहे, डाउनलोड केलेले AI मॉडेल नाही.\n@@TOOL_ID\nफोटो पासपोर्ट साईझमध्ये क्रॉप करते आणि एका प्रिंट शीटवर अनेक कॉपीज ठेवते.\n@@HOW_ID\nतुमच्या देशाने मागितलेला आकार, प्रिंट DPI आणि शीटवर किती कॉपीज बसतील ते निवडा. PNG डाउनलोड करा आणि योग्य आकाराच्या फोटोसाठी सांगितलेल्या DPI वर प्रिंट करा.\n@@TOOL_SEAL\nआर्टवर्कवर टायल्ड वॉटरमार्क किंवा स्टॅम्प जोडते.\n@@HOW_SEAL\nतुमचे नाव किंवा ब्रँड टाईप करा, मग आकार, कोन, अंतर आणि ओपॅसिटी सेट करा. ओपॅसिटी कमी ठेवा जेणेकरून चित्र वाचता येईल. ते डिझाईनच्या कॉपीवर लागू करा, फक्त एकाच कॉपीवर नाही.\n@@TOOL_BATCH\nएकाच वेळी अनेक इमेजेस कन्व्हर्ट आणि रिसाईझ करते, तेही या डिव्हाइसवर.\n@@HOW_BATCH\nफाईल्स निवडा, सर्वात लांब बाजू, फॉरमॅट आणि क्वालिटी सेट करा, आणि मग Add as new layer वर दाबा. प्रत्येक कन्व्हर्ट केलेली फाईल वेगळी सेव्ह होते, त्यामुळे संपूर्ण फोल्डर एकाच वेळी तयार करता येते.\n@@TIPS_H\nटिप्स\n@@TIPS\n- प्रत्येक टूल एक नवीन लेयर जोडते, त्यामुळे तुम्ही लेयर लपवून मूळ फोटोशी तुलना करू शकता.\n- प्रिव्ह्यू वेगासाठी एक छोटी कॉपी असते; तुम्ही लागू केलेला निकाल नेहमी पूर्ण रिझोल्यूशन असतो.\n- Cut, Clear, Zoom आणि ID वेगळा आकार देऊ शकतात. त्यासाठी Open as new document वापरा.\n- जर एखादे टूल मोठ्या कॅनव्हासवर संथ वाटत असेल, तर ते संपूर्ण डिझाईनऐवजी अॅक्टिव्ह लेयरवर चालवा.\n- मॅन्युअलसह येथील सर्व काही इंटरनेट बंद ठेवून चालते.\n@@OFFLINE\nया पॅनेलमध्ये कशासाठीही इंटरनेट वापरले जात नाही. फॉन्ट्स, आयकॉन्स, टूल्स आणि मॅन्युअल हे सर्व ॲपमध्ये स्टोअर केलेले आहेत, त्यामुळे ते ट्रेनमध्ये, गावात किंवा नेटवर्क नसतानाही काम करत राहते."
    },
    "gu": {
      ui: {
              "title": "Nirbhar ટૂલ્સ",
              "subtitle": "ઓફલાઇન ટૂલ્સ — કોઈ અપલોડ નહીં, કોઈ એકાઉન્ટ નહીં, કોઈ નેટવર્ક નહીં",
              "manual": "મેન્યુઅલ",
              "manualtitle": "Nirbhar મેન્યુઅલ",
              "footnote": "દરેક ટૂલ આ પેજની અંદર જ ચાલે છે. પરિણામો એક નવા લેયર તરીકે ઉમેરાય છે, જેથી તમારું મૂળ કામ અકબંધ રહે છે.",
              "source": "સોર્સ",
              "design": "આખું ડિઝાઇન",
              "layer": "એક્ટિવ લેયર",
              "close": "બંધ કરો",
              "newdoc": "નવા ડોક્યુમેન્ટ તરીકે ખોલો",
              "download": "ડાઉનલોડ",
              "apply": "નવા લેયર તરીકે ઉમેરો",
              "usepalette": "પેલેટ તરીકે વાપરો",
              "fromimage": "ઇમેજમાંથી",
              "harmony": "હાર્મની",
              "useharmony": "હાર્મનીને પેલેટ તરીકે વાપરો",
              "paletteset": "પેલેટ બદલાઈ ગઈ",
              "nosource": "હજુ કામ કરવા માટે કંઈ નથી — પહેલાં કંઈક દોરો",
              "pickfiles": "પહેલાં ઓછામાં ઓછી એક ઇમેજ પસંદ કરો"
      },
      tools: {
              "cut": {
                      "desc": "ફોટા, લોગો કે સ્કેનમાંથી બેકગ્રાઉન્ડ દૂર કરે છે અને મુખ્ય વિષયને જાળવી રાખે છે.",
                      "how": "ચાર ખૂણાઓનું સેમ્પલ લેવા માટે Auto પસંદ કરો, અથવા દૂર કરવા માટે કોઈ રંગ પસંદ કરો. જ્યારે થોડો ભાગ રહી જાય ત્યારે Tolerance વધારો, અને જ્યારે મુખ્ય વિષય કપાઈ રહ્યો હોય ત્યારે તેને ઓછું કરો. Edge soften વાળા વાળ અને સ્મૂથ કિનારીઓને ક્લીન રાખે છે, અને Clean colour fringes રંગીન આભામંડળને દૂર કરે છે."
              },
              "clear": {
                      "desc": "ફોટામાં સુધારો કરે છે: વ્હાઇટ બેલેન્સ, લેવલ્સ, નોઇઝ, ધુમ્મસ, ક્લેરિટી અને શાર્પનિંગ.",
                      "how": "ફોટાને વાંચીને જાતે જ સેટિંગ્સ પસંદ કરતા વન-પ્રેસ ફિક્સ માટે Automatic recipe ચાલુ રાખો. દરેક સ્ટેપ જાતે સેટ કરવા માટે તેને બંધ કરો. સારા રિઝલ્ટ માટે Clarity અને છેલ્લે Sharpen નો ઉપયોગ કરો."
              },
              "zoom": {
                      "desc": "કિનારીઓને ધૂંધળી કર્યા વિના ડિઝાઇનને બે, ત્રણ, ચાર કે આઠ ગણી મોટી કરે છે.",
                      "how": "ફોટા માટે Lanczos, સ્મૂથ ગ્રાફિક્સ માટે Bicubic અને પિક્સેલ આર્ટ માટે EPX નો ઉપયોગ કરો, કારણ કે EPX ત્રાંસી કિનારીઓને શાર્પ રાખે છે. Sharpen after મોટા કરેલા પરિણામમાં થોડી ક્રિસ્પનેસ ઉમેરે છે."
              },
              "tone": {
                      "desc": "આર્ટવર્કને પ્રિન્ટેડ અથવા ગ્રાફિક લુક આપે છે: હાફટોન ડોટ્સ, ડ્યુઓટોન, ગ્રેડિયન્ટ મેપ, પેન્સિલ સ્કેચ અને કલર-બ્લાઇન્ડનેસ ચેક.",
                      "how": "હાફટોન પોસ્ટર્સ અને ઝીન્સ માટે ચિત્રને ડોટ્સમાં ફેરવે છે. ડ્યુઓટોન અને ગ્રેડિયન્ટ મેપ તેને બે રંગોથી રંગીન કરે છે. પેન્સિલ સ્કેચ કિનારીઓ દોરે છે. કલર-બ્લાઇન્ડનેસ ચેક બતાવે છે કે પેલેટ કલર-બ્લાઇન્ડ વ્યક્તિને કેવી દેખાશે."
              },
              "tile": {
                      "desc": "ઇમેજને સીમલેસ બનાવે છે, જેથી તે જોડાણ વિના રિપીટ થાય છે.",
                      "how": "ઓટોમેટિક સેટિંગ્સ માટે Seam blend ને શૂન્ય પર રાખો. પરિણામ લાગુ કરો, પછી તેને પેટર્ન બેકગ્રાઉન્ડ, ગેમ ટેક્સચર અથવા વોલપેપર તરીકે વાપરો."
              },
              "pal": {
                      "desc": "ઇમેજના રંગો કાઢે છે અને મેચિંગ કલર હાર્મની બનાવે છે.",
                      "how": "કેટલા રંગો કાઢવા તે સેટ કરો અને ટૂલ ચિત્રને વાંચે છે. તૈયાર સેટ મેળવવા માટે બેઝ કલર અને હાર્મની પસંદ કરો. કોઈપણ સ્વોચ પર ટેપ કરીને તેને પ્રાઇમરી કલર બનાવો, અથવા એક જ દબાણમાં હાર્મની સાથે પેલેટ બદલો."
              },
              "paper": {
                      "desc": "કોઈ લાઇબ્રેરી કે પ્રિન્ટ ડાયલોગ વિના, એક અસલી PDF ફાઇલ બનાવે છે.",
                      "how": "પેજની સાઇઝ, ઓરિએન્ટેશન અને માર્જિન પસંદ કરો, અને વધુ પેજ તરીકે વધારાની ઇમેજ ઉમેરો. Download પર દબાવો અને PDF તમારા ડિવાઇસ પર સેવ થઈ જશે. ટેક્સ્ટ અને ઇમેજ શાર્પ રહે છે કારણ કે પેજ હાઇ-ક્વોલિટી JPEG તરીકે એમ્બેડ થાય છે."
              },
              "sheet": {
                      "desc": "એપ આઇકોન સેટને સિંગલ .ico ફાઇલ તરીકે એક્સપોર્ટ કરે છે, અથવા તમારા દેખાતા લેયર્સમાંથી બનેલી સ્પ્રાઈટ શીટ.",
                      "how": "આઇકોન મોડ 16, 32, 48, 64, 128 અને 256 પિક્સેલની ઇમેજને એક favicon.ico માં લખે છે. સ્પ્રાઈટ મોડ દરેક દેખાતા લેયરને એક PNG પર બાજુ-બાજુમાં ગોઠવે છે, જે ગેમ એન્જિન માટે તૈયાર હોય છે."
              },
              "vector": {
                      "desc": "ડિઝાઇનને SVG તરીકે એક્સપોર્ટ કરે છે, જેથી ટેક્સ્ટ અને આકારો એડિટ કરી શકાય તેવા વેક્ટર્સ રહે છે.",
                      "how": "SVG ની અંદર પિક્સેલ વર્કને બેકગ્રાઉન્ડ ઇમેજ તરીકે મૂકવા માટે Include painted layers ચાલુ રાખો, અથવા પ્યોર વેક્ટર ફાઇલ માટે તેને બંધ કરો. કોઈપણ બ્રાઉઝર, Inkscape અથવા Illustrator માં SVG ખોલો."
              },
              "art": {
                      "desc": "લખેલા વર્ણન પરથી મૂળ આર્ટવર્ક બનાવે છે.",
                      "how": "તમારે જે જોઈએ તે ટાઇપ કરો અને એક સ્ટાઇલ પસંદ કરો: કલર મેશ, વેવ્સ, બાઉહૌસ શેપ્સ, રિંગ્સ અથવા ગ્રેઇન ગ્રેડિયન્ટ. સમાન શબ્દોમાંથી અલગ ચિત્ર મેળવવા માટે Variation બદલો. આ તમારા શબ્દોમાંથી બનેલી પ્રોસિજરલ કમ્પોઝિશન છે, ડાઉનલોડ કરેલું AI મોડલ નથી."
              },
              "id": {
                      "desc": "ફોટાને પાસપોર્ટ સાઇઝમાં ક્રોપ કરે છે અને એક પ્રિન્ટ શીટ પર ઘણી કોપીઓ ગોઠવે છે.",
                      "how": "તમારો દેશ માંગે છે તે સાઇઝ, પ્રિન્ટ DPI અને શીટ પર કેટલી કોપીઓ ફિટ થશે તે પસંદ કરો. સાચી સાઇઝના ફોટા માટે PNG ડાઉનલોડ કરો અને જણાવેલ DPI પર પ્રિન્ટ કરો."
              },
              "seal": {
                      "desc": "આર્ટવર્ક પર ટાઇલવાળું વોટરમાર્ક અથવા સ્ટેમ્પ ઉમેરે છે.",
                      "how": "તમારું નામ અથવા બ્રાન્ડ ટાઇપ કરો, પછી સાઇઝ, એંગલ, સ્પેસિંગ અને ઓપેસિટી સેટ કરો. ઓપેસિટી ઓછી રાખો જેથી ચિત્ર વાંચી શકાય તેવું રહે. તેને ડિઝાઇનની કોપી પર લાગુ કરો, માત્ર એક કોપી પર નહીં."
              },
              "batch": {
                      "desc": "એકસાથે ઘણા ઇમેજને કન્વર્ટ અને રિસાઇઝ કરે છે, તે પણ આ ડિવાઇસ પર.",
                      "how": "ફાઇલો પસંદ કરો, સૌથી લાંબી બાજુ, ફોર્મેટ અને ક્વોલિટી સેટ કરો, પછી Add as new layer પર દબાવો. દરેક કન્વર્ટ કરેલી ફાઇલ અલગથી સેવ થાય છે, જેથી આખું ફોલ્ડર એકસાથે તૈયાર કરી શકાય છે."
              }
      },
      manual: "@@TITLE\nNirbhar મેન્યુઅલ\n@@INTRO\nNirbhar એટલે આત્મNirbhar. આ પિક્સેલ સ્ટુડિયો (Pixel Studio) માં બનાવેલી ઓફલાઇન ટૂલબોક્સ છે: તેર ટૂલ્સ જે બેકગ્રાઉન્ડ દૂર કરે છે, ફોટાની ક્વોલિટી વધારે છે, અપસ્કેલ કરે છે, PDF બનાવે છે, એપ આઇકોન બનાવે છે, જનરેટિવ આર્ટ દોરે છે અને બીજું ઘણું બધું. બધું જ તમારા પોતાના ડિવાઇસ પર આ પેજ દ્વારા પ્રોસેસ થાય છે. આમાં કોઈ અપલોડ, એકાઉન્ટ, API કી, મોડલ ડાઉનલોડ કે ઇન્ટરનેટ કનેક્શનની જરૂર પડતી નથી.\n@@START_H\nચાર સ્ટેપ્સમાં શરૂઆત કરો\n@@START\n- જમણી બાજુએ Nirbhar ટેબ ખોલો (ફોનમાં, નીચેની શીટ પર ટેપ કરો).\n- એક ટૂલ પસંદ કરો. એક ડાયલોગ ખુલશે જેમાં પ્રિવ્યૂ અને તેની પોતાની સેટિંગ્સ હશે.\n- જ્યાં સુધી પ્રિવ્યૂ બરાબર ન દેખાય ત્યાં સુધી સેટિંગ્સ બદલો; પ્રિવ્યૂ એ નાની કોપી છે, અસલી કામ પૂરા સાઇઝ પર થાય છે.\n- Add as new layer પર દબાવો. તમારું મૂળ કામ એ જ રીતે રહેશે, અને પરિણામ એક નવું લેયર બની જશે જેને તમે એડિટ કરવાનું ચાલુ રાખી શકો છો.\n@@TOOLS_H\nતેર ટૂલ્સ\n@@TOOL_CUT\nફોટા, લોગો કે સ્કેનમાંથી બેકગ્રાઉન્ડ દૂર કરે છે અને મુખ્ય વિષયને જાળવી રાખે છે.\n@@HOW_CUT\nચાર ખૂણાઓનું સેમ્પલ લેવા માટે Auto પસંદ કરો, અથવા દૂર કરવા માટે કોઈ રંગ પસંદ કરો. જ્યારે થોડો ભાગ રહી જાય ત્યારે Tolerance વધારો, અને જ્યારે મુખ્ય વિષય કપાઈ રહ્યો હોય ત્યારે તેને ઓછું કરો. Edge soften વાળા વાળ અને સ્મૂથ કિનારીઓને ક્લીન રાખે છે, અને Clean colour fringes રંગીન આભામંડળને દૂર કરે છે.\n@@TOOL_CLEAR\nફોટામાં સુધારો કરે છે: વ્હાઇટ બેલેન્સ, લેવલ્સ, નોઇઝ, ધુમ્મસ, ક્લેરિટી અને શાર્પનિંગ.\n@@HOW_CLEAR\nફોટાને વાંચીને જાતે જ સેટિંગ્સ પસંદ કરતા વન-પ્રેસ ફિક્સ માટે Automatic recipe ચાલુ રાખો. દરેક સ્ટેપ જાતે સેટ કરવા માટે તેને બંધ કરો. સારા રિઝલ્ટ માટે Clarity અને છેલ્લે Sharpen નો ઉપયોગ કરો.\n@@TOOL_ZOOM\nકિનારીઓને ધૂંધળી કર્યા વિના ડિઝાઇનને બે, ત્રણ, ચાર કે આઠ ગણી મોટી કરે છે.\n@@HOW_ZOOM\nફોટા માટે Lanczos, સ્મૂથ ગ્રાફિક્સ માટે Bicubic અને પિક્સેલ આર્ટ માટે EPX નો ઉપયોગ કરો, કારણ કે EPX ત્રાંસી કિનારીઓને શાર્પ રાખે છે. Sharpen after મોટા કરેલા પરિણામમાં થોડી ક્રિસ્પનેસ ઉમેરે છે.\n@@TOOL_TONE\nઆર્ટવર્કને પ્રિન્ટેડ અથવા ગ્રાફિક લુક આપે છે: હાફટોન ડોટ્સ, ડ્યુઓટોન, ગ્રેડિયન્ટ મેપ, પેન્સિલ સ્કેચ અને કલર-બ્લાઇન્ડનેસ ચેક.\n@@HOW_TONE\nહાફટોન પોસ્ટર્સ અને ઝીન્સ માટે ચિત્રને ડોટ્સમાં ફેરવે છે. ડ્યુઓટોન અને ગ્રેડિયન્ટ મેપ તેને બે રંગોથી રંગીન કરે છે. પેન્સિલ સ્કેચ કિનારીઓ દોરે છે. કલર-બ્લાઇન્ડનેસ ચેક બતાવે છે કે પેલેટ કલર-બ્લાઇન્ડ વ્યક્તિને કેવી દેખાશે.\n@@TOOL_TILE\nઇમેજને સીમલેસ બનાવે છે, જેથી તે જોડાણ વિના રિપીટ થાય છે.\n@@HOW_TILE\nઓટોમેટિક સેટિંગ્સ માટે Seam blend ને શૂન્ય પર રાખો. પરિણામ લાગુ કરો, પછી તેને પેટર્ન બેકગ્રાઉન્ડ, ગેમ ટેક્સચર અથવા વોલપેપર તરીકે વાપરો.\n@@TOOL_PAL\nઇમેજના રંગો કાઢે છે અને મેચિંગ કલર હાર્મની બનાવે છે.\n@@HOW_PAL\nકેટલા રંગો કાઢવા તે સેટ કરો અને ટૂલ ચિત્રને વાંચે છે. તૈયાર સેટ મેળવવા માટે બેઝ કલર અને હાર્મની પસંદ કરો. કોઈપણ સ્વોચ પર ટેપ કરીને તેને પ્રાઇમરી કલર બનાવો, અથવા એક જ દબાણમાં હાર્મની સાથે પેલેટ બદલો.\n@@TOOL_PAPER\nકોઈ લાઇબ્રેરી કે પ્રિન્ટ ડાયલોગ વિના, એક અસલી PDF ફાઇલ બનાવે છે.\n@@HOW_PAPER\nપેજની સાઇઝ, ઓરિએન્ટેશન અને માર્જિન પસંદ કરો, અને વધુ પેજ તરીકે વધારાની ઇમેજ ઉમેરો. Download પર દબાવો અને PDF તમારા ડિવાઇસ પર સેવ થઈ જશે. ટેક્સ્ટ અને ઇમેજ શાર્પ રહે છે કારણ કે પેજ હાઇ-ક્વોલિટી JPEG તરીકે એમ્બેડ થાય છે.\n@@TOOL_SHEET\nએપ આઇકોન સેટને સિંગલ .ico ફાઇલ તરીકે એક્સપોર્ટ કરે છે, અથવા તમારા દેખાતા લેયર્સમાંથી બનેલી સ્પ્રાઈટ શીટ.\n@@HOW_SHEET\nઆઇકોન મોડ 16, 32, 48, 64, 128 અને 256 પિક્સેલની ઇમેજને એક favicon.ico માં લખે છે. સ્પ્રાઈટ મોડ દરેક દેખાતા લેયરને એક PNG પર બાજુ-બાજુમાં ગોઠવે છે, જે ગેમ એન્જિન માટે તૈયાર હોય છે.\n@@TOOL_VECTOR\nડિઝાઇનને SVG તરીકે એક્સપોર્ટ કરે છે, જેથી ટેક્સ્ટ અને આકારો એડિટ કરી શકાય તેવા વેક્ટર્સ રહે છે.\n@@HOW_VECTOR\nSVG ની અંદર પિક્સેલ વર્કને બેકગ્રાઉન્ડ ઇમેજ તરીકે મૂકવા માટે Include painted layers ચાલુ રાખો, અથવા પ્યોર વેક્ટર ફાઇલ માટે તેને બંધ કરો. કોઈપણ બ્રાઉઝર, Inkscape અથવા Illustrator માં SVG ખોલો.\n@@TOOL_ART\nલખેલા વર્ણન પરથી મૂળ આર્ટવર્ક બનાવે છે.\n@@HOW_ART\nતમારે જે જોઈએ તે ટાઇપ કરો અને એક સ્ટાઇલ પસંદ કરો: કલર મેશ, વેવ્સ, બાઉહૌસ શેપ્સ, રિંગ્સ અથવા ગ્રેઇન ગ્રેડિયન્ટ. સમાન શબ્દોમાંથી અલગ ચિત્ર મેળવવા માટે Variation બદલો. આ તમારા શબ્દોમાંથી બનેલી પ્રોસિજરલ કમ્પોઝિશન છે, ડાઉનલોડ કરેલું AI મોડલ નથી.\n@@TOOL_ID\nફોટાને પાસપોર્ટ સાઇઝમાં ક્રોપ કરે છે અને એક પ્રિન્ટ શીટ પર ઘણી કોપીઓ ગોઠવે છે.\n@@HOW_ID\nતમારો દેશ માંગે છે તે સાઇઝ, પ્રિન્ટ DPI અને શીટ પર કેટલી કોપીઓ ફિટ થશે તે પસંદ કરો. સાચી સાઇઝના ફોટા માટે PNG ડાઉનલોડ કરો અને જણાવેલ DPI પર પ્રિન્ટ કરો.\n@@TOOL_SEAL\nઆર્ટવર્ક પર ટાઇલવાળું વોટરમાર્ક અથવા સ્ટેમ્પ ઉમેરે છે.\n@@HOW_SEAL\nતમારું નામ અથવા બ્રાન્ડ ટાઇપ કરો, પછી સાઇઝ, એંગલ, સ્પેસિંગ અને ઓપેસિટી સેટ કરો. ઓપેસિટી ઓછી રાખો જેથી ચિત્ર વાંચી શકાય તેવું રહે. તેને ડિઝાઇનની કોપી પર લાગુ કરો, માત્ર એક કોપી પર નહીં.\n@@TOOL_BATCH\nએકસાથે ઘણા ઇમેજને કન્વર્ટ અને રિસાઇઝ કરે છે, તે પણ આ ડિવાઇસ પર.\n@@HOW_BATCH\nફાઇલો પસંદ કરો, સૌથી લાંબી બાજુ, ફોર્મેટ અને ક્વોલિટી સેટ કરો, પછી Add as new layer પર દબાવો. દરેક કન્વર્ટ કરેલી ફાઇલ અલગથી સેવ થાય છે, જેથી આખું ફોલ્ડર એકસાથે તૈયાર કરી શકાય છે.\n@@TIPS_H\nટિપ્સ\n@@TIPS\n- દરેક ટૂલ એક નવું લેયર ઉમેરે છે, જેથી તમે લેયરને છુપાવીને તેને મૂળ કામ સાથે સરખાવી શકો છો.\n- સ્પીડ માટે પ્રિવ્યૂ એક નાની કોપી છે; તમે જે પરિણામ લાગુ કરો છો તે હંમેશા ફુલ રિઝોલ્યુશન હોય છે.\n- Cut, Clear, Zoom અને ID અલગ સાઇઝ બનાવી શકે છે. તેના માટે Open as new document નો ઉપયોગ કરો.\n- જો કોઈ મોટું કેનવાસ હોય અને ટૂલ ધીમું લાગતું હોય, તો તેને આખી ડિઝાઇનને બદલે એક્ટિવ લેયર પર ચલાવો.\n- અહીં બધું જ ઇન્ટરનેટ બંધ રાખીને કામ કરે છે, જેમાં મેન્યુઅલનો પણ સમાવેશ થાય છે.\n@@OFFLINE\nઆ પેનલમાં કંઈપણ ઇન્ટરનેટનો ઉપયોગ કરતું નથી. ફોન્ટ્સ, આઇકોન્સ, ટૂલ્સ અને મેન્યુઅલ બધું જ એપ સાથે સ્ટોર થાય છે, તેથી તે ટ્રેનમાં, ગામમાં અથવા ઇન્ટરનેટ ન હોય ત્યારે પણ કામ કરતું રહે છે."
    },
    "kn": {
      ui: {
              "title": "Nirbhar ಟೂಲ್ಸ್",
              "subtitle": "ಆಫ್‌ಲೈನ್ ಟೂಲ್ಸ್ — ಅಪ್‌ಲೋಡ್ ಇಲ್ಲ, ಅಕೌಂಟ್ ಇಲ್ಲ, ನೆಟ್‌ವರ್ಕ್ ಇಲ್ಲ",
              "manual": "ಮ್ಯಾನುವಲ್",
              "manualtitle": "Nirbhar ಮ್ಯಾನುವಲ್",
              "footnote": "ಪ್ರತಿಯೊಂದು ಟೂಲ್ ಕೂಡ ಈ ಪೇಜ್‌ನ ಒಳಗೆಯೇ ರನ್ ಆಗುತ್ತದೆ. ರಿಸಲ್ಟ್‌ಗಳನ್ನು ಹೊಸ ಲೇಯರ್ ಆಗಿ ಸೇರಿಸಲಾಗುತ್ತದೆ, ಹಾಗಾಗಿ ನಿಮ್ಮ ಒರಿಜಿನಲ್ ಹಾಗೆಯೇ ಇರುತ್ತದೆ.",
              "source": "ಸೋರ್ಸ್",
              "design": "ಸಂಪೂರ್ಣ ಡಿಸೈನ್",
              "layer": "ಆಕ್ಟಿವ್ ಲೇಯರ್",
              "close": "ಮುಚ್ಚಿ",
              "newdoc": "ಹೊಸ ಡಾಕ್ಯುಮೆಂಟ್ ಆಗಿ ಓಪನ್ ಮಾಡಿ",
              "download": "ಡೌನ್‌ಲೋಡ್",
              "apply": "ಹೊಸ ಲೇಯರ್ ಆಗಿ ಸೇರಿಸಿ",
              "usepalette": "ಪ್ಯಾಲೆಟ್ ಆಗಿ ಬಳಸಿ",
              "fromimage": "ಇಮೇಜ್‌ನಿಂದ",
              "harmony": "ಹಾರ್ಮನಿ",
              "useharmony": "ಹಾರ್ಮನಿಯನ್ನು ಪ್ಯಾಲೆಟ್ ಆಗಿ ಬಳಸಿ",
              "paletteset": "ಪ್ಯಾಲೆಟ್ ಬದಲಾಯಿಸಲಾಗಿದೆ",
              "nosource": "ಇನ್ನೂ ಕೆಲಸ ಮಾಡಲು ಏನೂ ಇಲ್ಲ — ಮೊದಲು ಏನಾದರೂ ಡ್ರಾ ಮಾಡಿ",
              "pickfiles": "ಮೊದಲು ಕನಿಷ್ಠ ಒಂದು ಇಮೇಜ್ ಆಯ್ಕೆ ಮಾಡಿ"
      },
      tools: {
              "cut": {
                      "desc": "ಫೋಟೋ, ಲೋಗೋ ಅಥವಾ ಸ್ಕ್ಯಾನ್‌ನಿಂದ ಬ್ಯಾಕ್‌ಗ್ರೌಂಡ್ ತೆಗೆದು, ಸಬ್ಜೆಕ್ಟ್ ಅನ್ನು ಹಾಗೆಯೇ ಉಳಿಸುತ್ತದೆ.",
                      "how": "ನಾಲ್ಕು ಮೂಲೆಗಳನ್ನು ಸ್ಯಾಂಪಲ್ ಮಾಡಲು Auto ಆಯ್ಕೆ ಮಾಡಿ, ಅಥವಾ ತೆಗೆಯಬೇಕಾದ ಬಣ್ಣವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. ಉಳಿದ ಭಾಗಗಳಿದ್ದರೆ Tolerance ಹೆಚ್ಚಿಸಿ, ಮತ್ತು ಸಬ್ಜೆಕ್ಟ್ ಕಟ್ ಆಗುತ್ತಿದ್ದರೆ ಅದನ್ನು ಕಡಿಮೆ ಮಾಡಿ. Edge soften ಕೂದಲು ಮತ್ತು ಆಂಟಿ-ಅಲಿಯಾಸ್ಡ್ ಅಂಚುಗಳನ್ನು ಕ್ಲೀನ್ ಆಗಿಡುತ್ತದೆ, ಮತ್ತು Clean colour fringes ಬಣ್ಣದ ಪ್ರಭಾವಲಯವನ್ನು ತೆಗೆಯುತ್ತದೆ."
              },
              "clear": {
                      "desc": "ಫೋಟೋವನ್ನು ಸುಧಾರಿಸುತ್ತದೆ: ವೈಟ್ ಬ್ಯಾಲೆನ್ಸ್, ಲೆವೆಲ್ಸ್, ನಾಯ್ಸ್, ಹೇಜ್, ಕ್ಲಾರಿಟಿ ಮತ್ತು ಶಾರ್ಪನಿಂಗ್.",
                      "how": "ಫೋಟೋವನ್ನು ಓದಿ ತಾನೇ ಸ್ಟ್ರೆಂತ್ ಆಯ್ಕೆ ಮಾಡುವ ಒನ್-ಪ್ರೆಸ್ ಫಿಕ್ಸ್‌ಗಾಗಿ Automatic recipe ಆನ್ ಆಗಿರಲಿ. ಪ್ರತಿಯೊಂದು ಹಂತವನ್ನು ನೀವೇ ಸೆಟ್ ಮಾಡಲು ಅದನ್ನು ಆಫ್ ಮಾಡಿ. ಪಂಚ್‌ಗಾಗಿ Clarity ಬಳಸಿ ಮತ್ತು ಕೊನೆಗೆ Sharpen ಬಳಸಿ."
              },
              "zoom": {
                      "desc": "ಅಂಚುಗಳು ಬ್ಲರ್ ಆಗದಂತೆ ಡಿಸೈನ್ ಅನ್ನು ಎರಡು, ಮೂರು, ನಾಲ್ಕು ಅಥವಾ ಎಂಟು ಪಟ್ಟು ದೊಡ್ಡದು ಮಾಡುತ್ತದೆ.",
                      "how": "ಫೋಟೋಗಳಿಗೆ Lanczos, ಸ್ಮೂತ್ ಗ್ರಾಫಿಕ್ಸ್ ಗೆ Bicubic ಮತ್ತು ಪಿಕ್ಸೆಲ್ ಆರ್ಟ್‌ಗೆ EPX ಬಳಸಿ, ಏಕೆಂದರೆ EPX ಡಯಾಗನಲ್ ಸ್ಟೆಪ್‌ಗಳನ್ನು ಶಾರ್ಪ್ ಆಗಿಡುತ್ತದೆ. Sharpen after ದೊಡ್ಡದಾದ ರಿಸಲ್ಟ್‌ಗೆ ಸ್ವಲ್ಪ ಕ್ರಿಸ್ಪ್‌ನೆಸ್ ಸೇರಿಸುತ್ತದೆ."
              },
              "tone": {
                      "desc": "ಆರ್ಟ್‌ವರ್ಕ್‌ಗೆ ಪ್ರಿಂಟೆಡ್ ಅಥವಾ ಗ್ರಾಫಿಕ್ ಲುಕ್ ನೀಡುತ್ತದೆ: ಹಾಫ್‌ಟೋನ್ ಡಾಟ್ಸ್, ಡ್ಯುಯೋಟೋನ್, ಗ್ರೇಡಿಯಂಟ್ ಮ್ಯಾಪ್, ಪೆನ್ಸಿಲ್ ಸ್ಕೆಚ್ ಮತ್ತು ಕಲರ್-ಬ್ಲೈಂಡ್‌ನೆಸ್ ಚೆಕ್.",
                      "how": "ಹಾಫ್‌ಟೋನ್ ಪೋಸ್ಟರ್‌ಗಳು ಮತ್ತು ಝೈನ್‌ಗಳಿಗಾಗಿ ಚಿತ್ರವನ್ನು ಡಾಟ್ಸ್‌ಗಳಾಗಿ ಬದಲಾಯಿಸುತ್ತದೆ. ಡ್ಯುಯೋಟೋನ್ ಮತ್ತು ಗ್ರೇಡಿಯಂಟ್ ಮ್ಯಾಪ್ ಅದನ್ನು ಎರಡು ಬಣ್ಣಗಳಿಂದ ರೀಕಲರ್ ಮಾಡುತ್ತದೆ. ಪೆನ್ಸಿಲ್ ಸ್ಕೆಚ್ ಅಂಚುಗಳನ್ನು ಡ್ರಾ ಮಾಡುತ್ತದೆ. ಕಲರ್-ಬ್ಲೈಂಡ್‌ನೆಸ್ ಚೆಕ್ ಕಲರ್-ಬ್ಲೈಂಡ್ ವ್ಯಕ್ತಿಗೆ ಪ್ಯಾಲೆಟ್ ಹೇಗೆ ಕಾಣುತ್ತದೆ ಎಂಬುದನ್ನು ತೋರಿಸುತ್ತದೆ."
              },
              "tile": {
                      "desc": "ಇಮೇಜ್ ಅನ್ನು ಸೀಮ್‌ಲೆಸ್ ಮಾಡುತ್ತದೆ, ಇದರಿಂದ ಅದು ಕಾಣುವಂತಹ ಜಾಯಿಂಟ್ ಇಲ್ಲದೆ ರಿಪೀಟ್ ಆಗುತ್ತದೆ.",
                      "how": "ಆಟೋಮ್ಯಾಟಿಕ್ ಸ್ಟ್ರೆಂತ್‌ಗಾಗಿ Seam blend ಅನ್ನು ಸೊನ್ನೆಯಲ್ಲಿ ಬಿಡಿ. ರಿಸಲ್ಟ್ ಅನ್ನು ಅಪ್ಲೈ ಮಾಡಿ, ನಂತರ ಅದನ್ನು ಪ್ಯಾಟರ್ನ್ ಬ್ಯಾಕ್‌ಗ್ರೌಂಡ್, ಗೇಮ್ ಟೆಕ್ಸ್ಚರ್ ಅಥವಾ ವಾಲ್‌ಪೇಪರ್ ಆಗಿ ಬಳಸಿ."
              },
              "pal": {
                      "desc": "ಇಮೇಜ್‌ನ ಬಣ್ಣಗಳನ್ನು ಎಕ್ಸ್‌ಟ್ರಾಕ್ಟ್ ಮಾಡುತ್ತದೆ ಮತ್ತು ಮ್ಯಾಚಿಂಗ್ ಕಲರ್ ಹಾರ್ಮನಿಯನ್ನು ಮಾಡುತ್ತದೆ.",
                      "how": "ಎಷ್ಟು ಬಣ್ಣಗಳನ್ನು ತೆಗೆಯಬೇಕು ಎಂದು ಸೆಟ್ ಮಾಡಿ ಮತ್ತು ಟೂಲ್ ಚಿತ್ರವನ್ನು ಓದುತ್ತದೆ. ರೆಡಿ ಸೆಟ್ ಪಡೆಯಲು ಬೇಸ್ ಕಲರ್ ಮತ್ತು ಹಾರ್ಮನಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. ಯಾವುದೇ ಸ್ವಾಚ್ ಅನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ ಅದನ್ನು ಪ್ರೈಮರಿ ಕಲರ್ ಮಾಡಿ, ಅಥವಾ ಒಂದೇ ಪ್ರೆಸ್‌ನಲ್ಲಿ ಪ್ಯಾಲೆಟ್ ಅನ್ನು ಹಾರ್ಮನಿಯೊಂದಿಗೆ ಬದಲಾಯಿಸಿ."
              },
              "paper": {
                      "desc": "ಯಾವುದೇ ಲೈಬ್ರರಿ ಮತ್ತು ಪ್ರಿಂಟ್ ಡೈಲಾಗ್ ಇಲ್ಲದೆ, ನಿಜವಾದ PDF ಫೈಲ್ ಅನ್ನು ಮಾಡುತ್ತದೆ.",
                      "how": "ಪೇಜ್ ಸೈಜ್, ಓರಿಯಂಟೇಶನ್ ಮತ್ತು ಮಾರ್ಜಿನ್ ಆಯ್ಕೆ ಮಾಡಿ, ಮತ್ತು ಹೆಚ್ಚುವರಿ ಇಮೇಜ್‌ಗಳನ್ನು ಹೆಚ್ಚು ಪೇಜ್‌ಗಳಾಗಿ ಸೇರಿಸಿ. Download ಒತ್ತಿ ಮತ್ತು PDF ನಿಮ್ಮ ಡಿವೈಸ್‌ನಲ್ಲಿ ಸೇವ್ ಆಗುತ್ತದೆ. ಪೇಜ್ ಅನ್ನು ಹೈ-ಕ್ವಾಲಿಟಿ JPEG ಆಗಿ ಎಂಬೆಡ್ ಮಾಡಿರುವುದರಿಂದ ಟೆಕ್ಸ್ಟ್ ಮತ್ತು ಇಮೇಜ್‌ಗಳು ಶಾರ್ಪ್ ಆಗಿರುತ್ತವೆ."
              },
              "sheet": {
                      "desc": "ಆಪ್ ಐಕಾನ್ ಸೆಟ್ ಅನ್ನು ಒಂದೇ .ico ಫೈಲ್ ಆಗಿ ಎಕ್ಸ್‌ಪೋರ್ಟ್ ಮಾಡುತ್ತದೆ, ಅಥವಾ ನಿಮ್ಮ ಕಾಣುವ ಲೇಯರ್‌ಗಳಿಂದ ಮಾಡಿದ ಸ್ಪ್ರೈಟ್ ಶೀಟ್.",
                      "how": "ಐಕಾನ್ ಮೋಡ್ 16, 32, 48, 64, 128 ಮತ್ತು 256 ಪಿಕ್ಸೆಲ್ ಇಮೇಜ್‌ಗಳನ್ನು ಒಂದೇ favicon.ico ಗೆ ಬರೆಯುತ್ತದೆ. ಸ್ಪ್ರೈಟ್ ಮೋಡ್ ಪ್ರತಿಯೊಂದು ಕಾಣುವ ಲೇಯರ್ ಅನ್ನು ಒಂದೇ PNG ಮೇಲೆ ಅಕ್ಕಪಕ್ಕದಲ್ಲಿ ಇಡುತ್ತದೆ, ಗೇಮ್ ಎಂಜಿನ್‌ಗೆ ರೆಡಿಯಾಗಿರುತ್ತದೆ."
              },
              "vector": {
                      "desc": "ಡಿಸೈನ್ ಅನ್ನು SVG ಆಗಿ ಎಕ್ಸ್‌ಪೋರ್ಟ್ ಮಾಡುತ್ತದೆ, ಇದರಿಂದ ಟೆಕ್ಸ್ಟ್ ಮತ್ತು ಶೇಪ್‌ಗಳು ಎಡಿಟಬಲ್ ವೆಕ್ಟರ್‌ಗಳಾಗಿ ಉಳಿಯುತ್ತವೆ.",
                      "how": "SVG ಒಳಗೆ ಪಿಕ್ಸೆಲ್ ಕೆಲಸವನ್ನು ಬ್ಯಾಕ್‌ಗ್ರೌಂಡ್ ಇಮೇಜ್ ಆಗಿ ಇಡಲು Include painted layers ಆನ್ ಆಗಿರಲಿ, ಅಥವಾ ಪ್ಯೂರ್ ವೆಕ್ಟರ್ ಫೈಲ್‌ಗಾಗಿ ಅದನ್ನು ಆಫ್ ಮಾಡಿ. SVG ಅನ್ನು ಯಾವುದೇ ಬ್ರೌಸರ್, Inkscape ಅಥವಾ Illustrator ನಲ್ಲಿ ಓಪನ್ ಮಾಡಿ."
              },
              "art": {
                      "desc": "ಬರೆದ ವಿವರಣೆಯಿಂದ ಒರಿಜಿನಲ್ ಆರ್ಟ್‌ವರ್ಕ್ ಅನ್ನು ಜನರೇಟ್ ಮಾಡುತ್ತದೆ.",
                      "how": "ನಿಮಗೆ ಬೇಕಾದುದನ್ನು ಟೈಪ್ ಮಾಡಿ ಮತ್ತು ಸ್ಟೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ: ಕಲರ್ ಮೆಶ್, ವೇವ್ಸ್, ಬೌಸ್ (Bauhaus) ಶೇಪ್ಸ್, ರಿಂಗ್ಸ್ ಅಥವಾ ಗ್ರೇನ್ ಗ್ರೇಡಿಯಂಟ್. ಅದೇ ಪದಗಳಿಂದ ಬೇರೊಂದು ಚಿತ್ರಕ್ಕಾಗಿ Variation ಬದಲಾಯಿಸಿ. ಇದು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿದ AI ಮಾಡೆಲ್ ಅಲ್ಲ, ನಿಮ್ಮ ಪದಗಳಿಂದ ಮಾಡಿದ ಪ್ರೊಸೀಜರಲ್ ಕಾಂಪೋಸಿಷನ್."
              },
              "id": {
                      "desc": "ಫೋಟೋವನ್ನು ಪಾಸ್‌ಪೋರ್ಟ್ ಸೈಜ್‌ಗೆ ಕ್ರಾಪ್ ಮಾಡುತ್ತದೆ ಮತ್ತು ಒಂದೇ ಪ್ರಿಂಟ್ ಶೀಟ್‌ನಲ್ಲಿ ಹಲವು ಕಾಪಿಗಳನ್ನು ಇಡುತ್ತದೆ.",
                      "how": "ನಿಮ್ಮ ದೇಶ ಕೇಳುವ ಸೈಜ್, ಪ್ರಿಂಟ್ DPI ಮತ್ತು ಶೀಟ್‌ನಲ್ಲಿ ಎಷ್ಟು ಕಾಪಿಗಳು ಹೊಂದಿಕೊಳ್ಳುತ್ತವೆ ಎಂಬುದನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. PNG ಅನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಸರಿಯಾದ ಸೈಜ್‌ನ ಫೋಟೋಗಾಗಿ ಹೇಳಿದ DPI ನಲ್ಲಿ ಪ್ರಿಂಟ್ ಮಾಡಿ."
              },
              "seal": {
                      "desc": "ಆರ್ಟ್‌ವರ್ಕ್‌ನಾದ್ಯಂತ ಟೈಲ್ಡ್ ವಾಟರ್‌ಮಾರ್ಕ್ ಅಥವಾ ಸ್ಟ್ಯಾಂಪ್ ಅನ್ನು ಸೇರಿಸುತ್ತದೆ.",
                      "how": "ನಿಮ್ಮ ಹೆಸರು ಅಥವಾ ಬ್ರ್ಯಾಂಡ್ ಟೈಪ್ ಮಾಡಿ, ನಂತರ ಸೈಜ್, ಆಂಗಲ್, ಸ್ಪೇಸಿಂಗ್ ಮತ್ತು ಓಪಾಸಿಟಿಯನ್ನು ಸೆಟ್ ಮಾಡಿ. ಚಿತ್ರ ಓದಲು ಸಾಧ್ಯವಾಗುವಂತೆ ಓಪಾಸಿಟಿಯನ್ನು ಕಡಿಮೆ ಇಡಿ. ಇದನ್ನು ಡಿಸೈನ್‌ನ ಕಾಪಿಗೆ ಅಪ್ಲೈ ಮಾಡಿ, ಕೇವಲ ಒಂದೇ ಕಾಪಿಗೆ ಅಲ್ಲ."
              },
              "batch": {
                      "desc": "ಒಂದೇ ಬಾರಿಗೆ ಹಲವು ಇಮೇಜ್‌ಗಳನ್ನು ಕನ್ವರ್ಟ್ ಮಾಡುತ್ತದೆ ಮತ್ತು ರಿಸೈಜ್ ಮಾಡುತ್ತದೆ, ಎಲ್ಲವೂ ಈ ಡಿವೈಸ್‌ನಲ್ಲೇ.",
                      "how": "ಫೈಲ್‌ಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ, ಉದ್ದನೆಯ ಸೈಡ್, ಫಾರ್ಮ್ಯಾಟ್ ಮತ್ತು ಕ್ವಾಲಿಟಿಯನ್ನು ಸೆಟ್ ಮಾಡಿ, ನಂತರ Add as new layer ಒತ್ತಿ. ಪ್ರತಿಯೊಂದು ಕನ್ವರ್ಟ್ ಆದ ಫೈಲ್ ಅನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ಸೇವ್ ಮಾಡಲಾಗುತ್ತದೆ, ಹಾಗಾಗಿ ಇಡೀ ಫೋಲ್ಡರ್ ಅನ್ನು ಒಂದೇ ಬಾರಿಗೆ ರೆಡಿ ಮಾಡಬಹುದು."
              }
      },
      manual: "@@TITLE\nNirbhar ಮ್ಯಾನುವಲ್\n@@INTRO\nNirbhar ಎಂದರೆ ಸ್ವಾವಲಂಬಿ. ಇದು ಪಿಕ್ಸೆಲ್ ಸ್ಟುಡಿಯೋದಲ್ಲಿ (Pixel Studio) ಇರುವ ಆಫ್‌ಲೈನ್ ಟೂಲ್‌ಬಾಕ್ಸ್: ಹದಿಮೂರು ಟೂಲ್‌ಗಳು, ಇವು ಬ್ಯಾಕ್‌ಗ್ರೌಂಡ್ ತೆಗೆಯುತ್ತವೆ, ಫೋಟೋ ಕ್ವಾಲಿಟಿ ಹೆಚ್ಚಿಸುತ್ತವೆ, ಅಪ್‌ಸ್ಕೇಲ್ ಮಾಡುತ್ತವೆ, PDF ಮಾಡುತ್ತವೆ, ಆಪ್ ಐಕಾನ್ ಮಾಡುತ್ತವೆ, ಜನರೇಟಿವ್ ಆರ್ಟ್ ಡ್ರಾ ಮಾಡುತ್ತವೆ ಮತ್ತು ಇನ್ನೂ ಹಲವು ಕೆಲಸ ಮಾಡುತ್ತವೆ. ಎಲ್ಲವನ್ನೂ ನಿಮ್ಮ ಡಿವೈಸ್‌ನಲ್ಲೇ ಈ ಪೇಜ್ ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ. ಇದರಲ್ಲಿ ಯಾವುದೇ ಅಪ್‌ಲೋಡ್, ಅಕೌಂಟ್, API ಕೀ, ಮಾಡೆಲ್ ಡೌನ್‌ಲೋಡ್ ಅಥವಾ ಇಂಟರ್ನೆಟ್ ಕನೆಕ್ಷನ್ ಇರುವುದಿಲ್ಲ.\n@@START_H\nನಾಲ್ಕು ಹಂತಗಳಲ್ಲಿ ಸ್ಟಾರ್ಟ್ ಮಾಡಿ\n@@START\n- ಬಲಭಾಗದಲ್ಲಿರುವ Nirbhar ಟ್ಯಾಬ್ ಓಪನ್ ಮಾಡಿ (ಫೋನ್‌ನಲ್ಲಿ, ಕೆಳಗಿನ ಶೀಟ್ ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ).\n- ಒಂದು ಟೂಲ್ ಆಯ್ಕೆ ಮಾಡಿ. ಪ್ರಿವ್ಯೂ ಮತ್ತು ಅದರದೇ ಆದ ಸೆಟ್ಟಿಂಗ್ಸ್ ಇರುವ ಡೈಲಾಗ್ ಓಪನ್ ಆಗುತ್ತದೆ.\n- ಪ್ರಿವ್ಯೂ ಸರಿಯಾಗಿ ಕಾಣುವವರೆಗೆ ಸೆಟ್ಟಿಂಗ್ಸ್ ಬದಲಾಯಿಸಿ; ಪ್ರಿವ್ಯೂ ಕೇವಲ ಒಂದು ಸ್ಕೇಲ್ ಮಾಡಿದ ಕಾಪಿ, ನಿಜವಾದ ಕೆಲಸ ಫುಲ್ ಸೈಜ್‌ನಲ್ಲಿ ನಡೆಯುತ್ತದೆ.\n- Add as new layer ಒತ್ತಿ. ನಿಮ್ಮ ಒರಿಜಿನಲ್ ಹಾಗೆಯೇ ಇರುತ್ತದೆ, ಮತ್ತು ರಿಸಲ್ಟ್ ಹೊಸ ಲೇಯರ್ ಆಗುತ್ತದೆ, ಅದನ್ನು ನೀವು ಎಡಿಟ್ ಮಾಡಬಹುದು.\n@@TOOLS_H\nಹದಿಮೂರು ಟೂಲ್‌ಗಳು\n@@TOOL_CUT\nಫೋಟೋ, ಲೋಗೋ ಅಥವಾ ಸ್ಕ್ಯಾನ್‌ನಿಂದ ಬ್ಯಾಕ್‌ಗ್ರೌಂಡ್ ತೆಗೆದು, ಸಬ್ಜೆಕ್ಟ್ ಅನ್ನು ಹಾಗೆಯೇ ಉಳಿಸುತ್ತದೆ.\n@@HOW_CUT\nನಾಲ್ಕು ಮೂಲೆಗಳನ್ನು ಸ್ಯಾಂಪಲ್ ಮಾಡಲು Auto ಆಯ್ಕೆ ಮಾಡಿ, ಅಥವಾ ತೆಗೆಯಬೇಕಾದ ಬಣ್ಣವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. ಉಳಿದ ಭಾಗಗಳಿದ್ದರೆ Tolerance ಹೆಚ್ಚಿಸಿ, ಮತ್ತು ಸಬ್ಜೆಕ್ಟ್ ಕಟ್ ಆಗುತ್ತಿದ್ದರೆ ಅದನ್ನು ಕಡಿಮೆ ಮಾಡಿ. Edge soften ಕೂದಲು ಮತ್ತು ಆಂಟಿ-ಅಲಿಯಾಸ್ಡ್ ಅಂಚುಗಳನ್ನು ಕ್ಲೀನ್ ಆಗಿಡುತ್ತದೆ, ಮತ್ತು Clean colour fringes ಬಣ್ಣದ ಪ್ರಭಾವಲಯವನ್ನು ತೆಗೆಯುತ್ತದೆ.\n@@TOOL_CLEAR\nಫೋಟೋವನ್ನು ಸುಧಾರಿಸುತ್ತದೆ: ವೈಟ್ ಬ್ಯಾಲೆನ್ಸ್, ಲೆವೆಲ್ಸ್, ನಾಯ್ಸ್, ಹೇಜ್, ಕ್ಲಾರಿಟಿ ಮತ್ತು ಶಾರ್ಪನಿಂಗ್.\n@@HOW_CLEAR\nಫೋಟೋವನ್ನು ಓದಿ ತಾನೇ ಸ್ಟ್ರೆಂತ್ ಆಯ್ಕೆ ಮಾಡುವ ಒನ್-ಪ್ರೆಸ್ ಫಿಕ್ಸ್‌ಗಾಗಿ Automatic recipe ಆನ್ ಆಗಿರಲಿ. ಪ್ರತಿಯೊಂದು ಹಂತವನ್ನು ನೀವೇ ಸೆಟ್ ಮಾಡಲು ಅದನ್ನು ಆಫ್ ಮಾಡಿ. ಪಂಚ್‌ಗಾಗಿ Clarity ಬಳಸಿ ಮತ್ತು ಕೊನೆಗೆ Sharpen ಬಳಸಿ.\n@@TOOL_ZOOM\nಅಂಚುಗಳು ಬ್ಲರ್ ಆಗದಂತೆ ಡಿಸೈನ್ ಅನ್ನು ಎರಡು, ಮೂರು, ನಾಲ್ಕು ಅಥವಾ ಎಂಟು ಪಟ್ಟು ದೊಡ್ಡದು ಮಾಡುತ್ತದೆ.\n@@HOW_ZOOM\nಫೋಟೋಗಳಿಗೆ Lanczos, ಸ್ಮೂತ್ ಗ್ರಾಫಿಕ್ಸ್ ಗೆ Bicubic ಮತ್ತು ಪಿಕ್ಸೆಲ್ ಆರ್ಟ್‌ಗೆ EPX ಬಳಸಿ, ಏಕೆಂದರೆ EPX ಡಯಾಗನಲ್ ಸ್ಟೆಪ್‌ಗಳನ್ನು ಶಾರ್ಪ್ ಆಗಿಡುತ್ತದೆ. Sharpen after ದೊಡ್ಡದಾದ ರಿಸಲ್ಟ್‌ಗೆ ಸ್ವಲ್ಪ ಕ್ರಿಸ್ಪ್‌ನೆಸ್ ಸೇರಿಸುತ್ತದೆ.\n@@TOOL_TONE\nಆರ್ಟ್‌ವರ್ಕ್‌ಗೆ ಪ್ರಿಂಟೆಡ್ ಅಥವಾ ಗ್ರಾಫಿಕ್ ಲುಕ್ ನೀಡುತ್ತದೆ: ಹಾಫ್‌ಟೋನ್ ಡಾಟ್ಸ್, ಡ್ಯುಯೋಟೋನ್, ಗ್ರೇಡಿಯಂಟ್ ಮ್ಯಾಪ್, ಪೆನ್ಸಿಲ್ ಸ್ಕೆಚ್ ಮತ್ತು ಕಲರ್-ಬ್ಲೈಂಡ್‌ನೆಸ್ ಚೆಕ್.\n@@HOW_TONE\nಹಾಫ್‌ಟೋನ್ ಪೋಸ್ಟರ್‌ಗಳು ಮತ್ತು ಝೈನ್‌ಗಳಿಗಾಗಿ ಚಿತ್ರವನ್ನು ಡಾಟ್ಸ್‌ಗಳಾಗಿ ಬದಲಾಯಿಸುತ್ತದೆ. ಡ್ಯುಯೋಟೋನ್ ಮತ್ತು ಗ್ರೇಡಿಯಂಟ್ ಮ್ಯಾಪ್ ಅದನ್ನು ಎರಡು ಬಣ್ಣಗಳಿಂದ ರೀಕಲರ್ ಮಾಡುತ್ತದೆ. ಪೆನ್ಸಿಲ್ ಸ್ಕೆಚ್ ಅಂಚುಗಳನ್ನು ಡ್ರಾ ಮಾಡುತ್ತದೆ. ಕಲರ್-ಬ್ಲೈಂಡ್‌ನೆಸ್ ಚೆಕ್ ಕಲರ್-ಬ್ಲೈಂಡ್ ವ್ಯಕ್ತಿಗೆ ಪ್ಯಾಲೆಟ್ ಹೇಗೆ ಕಾಣುತ್ತದೆ ಎಂಬುದನ್ನು ತೋರಿಸುತ್ತದೆ.\n@@TOOL_TILE\nಇಮೇಜ್ ಅನ್ನು ಸೀಮ್‌ಲೆಸ್ ಮಾಡುತ್ತದೆ, ಇದರಿಂದ ಅದು ಕಾಣುವಂತಹ ಜಾಯಿಂಟ್ ಇಲ್ಲದೆ ರಿಪೀಟ್ ಆಗುತ್ತದೆ.\n@@HOW_TILE\nಆಟೋಮ್ಯಾಟಿಕ್ ಸ್ಟ್ರೆಂತ್‌ಗಾಗಿ Seam blend ಅನ್ನು ಸೊನ್ನೆಯಲ್ಲಿ ಬಿಡಿ. ರಿಸಲ್ಟ್ ಅನ್ನು ಅಪ್ಲೈ ಮಾಡಿ, ನಂತರ ಅದನ್ನು ಪ್ಯಾಟರ್ನ್ ಬ್ಯಾಕ್‌ಗ್ರೌಂಡ್, ಗೇಮ್ ಟೆಕ್ಸ್ಚರ್ ಅಥವಾ ವಾಲ್‌ಪೇಪರ್ ಆಗಿ ಬಳಸಿ.\n@@TOOL_PAL\nಇಮೇಜ್‌ನ ಬಣ್ಣಗಳನ್ನು ಎಕ್ಸ್‌ಟ್ರಾಕ್ಟ್ ಮಾಡುತ್ತದೆ ಮತ್ತು ಮ್ಯಾಚಿಂಗ್ ಕಲರ್ ಹಾರ್ಮನಿಯನ್ನು ಮಾಡುತ್ತದೆ.\n@@HOW_PAL\nಎಷ್ಟು ಬಣ್ಣಗಳನ್ನು ತೆಗೆಯಬೇಕು ಎಂದು ಸೆಟ್ ಮಾಡಿ ಮತ್ತು ಟೂಲ್ ಚಿತ್ರವನ್ನು ಓದುತ್ತದೆ. ರೆಡಿ ಸೆಟ್ ಪಡೆಯಲು ಬೇಸ್ ಕಲರ್ ಮತ್ತು ಹಾರ್ಮನಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. ಯಾವುದೇ ಸ್ವಾಚ್ ಅನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ ಅದನ್ನು ಪ್ರೈಮರಿ ಕಲರ್ ಮಾಡಿ, ಅಥವಾ ಒಂದೇ ಪ್ರೆಸ್‌ನಲ್ಲಿ ಪ್ಯಾಲೆಟ್ ಅನ್ನು ಹಾರ್ಮನಿಯೊಂದಿಗೆ ಬದಲಾಯಿಸಿ.\n@@TOOL_PAPER\nಯಾವುದೇ ಲೈಬ್ರರಿ ಮತ್ತು ಪ್ರಿಂಟ್ ಡೈಲಾಗ್ ಇಲ್ಲದೆ, ನಿಜವಾದ PDF ಫೈಲ್ ಅನ್ನು ಮಾಡುತ್ತದೆ.\n@@HOW_PAPER\nಪೇಜ್ ಸೈಜ್, ಓರಿಯಂಟೇಶನ್ ಮತ್ತು ಮಾರ್ಜಿನ್ ಆಯ್ಕೆ ಮಾಡಿ, ಮತ್ತು ಹೆಚ್ಚುವರಿ ಇಮೇಜ್‌ಗಳನ್ನು ಹೆಚ್ಚು ಪೇಜ್‌ಗಳಾಗಿ ಸೇರಿಸಿ. Download ಒತ್ತಿ ಮತ್ತು PDF ನಿಮ್ಮ ಡಿವೈಸ್‌ನಲ್ಲಿ ಸೇವ್ ಆಗುತ್ತದೆ. ಪೇಜ್ ಅನ್ನು ಹೈ-ಕ್ವಾಲಿಟಿ JPEG ಆಗಿ ಎಂಬೆಡ್ ಮಾಡಿರುವುದರಿಂದ ಟೆಕ್ಸ್ಟ್ ಮತ್ತು ಇಮೇಜ್‌ಗಳು ಶಾರ್ಪ್ ಆಗಿರುತ್ತವೆ.\n@@TOOL_SHEET\nಆಪ್ ಐಕಾನ್ ಸೆಟ್ ಅನ್ನು ಒಂದೇ .ico ಫೈಲ್ ಆಗಿ ಎಕ್ಸ್‌ಪೋರ್ಟ್ ಮಾಡುತ್ತದೆ, ಅಥವಾ ನಿಮ್ಮ ಕಾಣುವ ಲೇಯರ್‌ಗಳಿಂದ ಮಾಡಿದ ಸ್ಪ್ರೈಟ್ ಶೀಟ್.\n@@HOW_SHEET\nಐಕಾನ್ ಮೋಡ್ 16, 32, 48, 64, 128 ಮತ್ತು 256 ಪಿಕ್ಸೆಲ್ ಇಮೇಜ್‌ಗಳನ್ನು ಒಂದೇ favicon.ico ಗೆ ಬರೆಯುತ್ತದೆ. ಸ್ಪ್ರೈಟ್ ಮೋಡ್ ಪ್ರತಿಯೊಂದು ಕಾಣುವ ಲೇಯರ್ ಅನ್ನು ಒಂದೇ PNG ಮೇಲೆ ಅಕ್ಕಪಕ್ಕದಲ್ಲಿ ಇಡುತ್ತದೆ, ಗೇಮ್ ಎಂಜಿನ್‌ಗೆ ರೆಡಿಯಾಗಿರುತ್ತದೆ.\n@@TOOL_VECTOR\nಡಿಸೈನ್ ಅನ್ನು SVG ಆಗಿ ಎಕ್ಸ್‌ಪೋರ್ಟ್ ಮಾಡುತ್ತದೆ, ಇದರಿಂದ ಟೆಕ್ಸ್ಟ್ ಮತ್ತು ಶೇಪ್‌ಗಳು ಎಡಿಟಬಲ್ ವೆಕ್ಟರ್‌ಗಳಾಗಿ ಉಳಿಯುತ್ತವೆ.\n@@HOW_VECTOR\nSVG ಒಳಗೆ ಪಿಕ್ಸೆಲ್ ಕೆಲಸವನ್ನು ಬ್ಯಾಕ್‌ಗ್ರೌಂಡ್ ಇಮೇಜ್ ಆಗಿ ಇಡಲು Include painted layers ಆನ್ ಆಗಿರಲಿ, ಅಥವಾ ಪ್ಯೂರ್ ವೆಕ್ಟರ್ ಫೈಲ್‌ಗಾಗಿ ಅದನ್ನು ಆಫ್ ಮಾಡಿ. SVG ಅನ್ನು ಯಾವುದೇ ಬ್ರೌಸರ್, Inkscape ಅಥವಾ Illustrator ನಲ್ಲಿ ಓಪನ್ ಮಾಡಿ.\n@@TOOL_ART\nಬರೆದ ವಿವರಣೆಯಿಂದ ಒರಿಜಿನಲ್ ಆರ್ಟ್‌ವರ್ಕ್ ಅನ್ನು ಜನರೇಟ್ ಮಾಡುತ್ತದೆ.\n@@HOW_ART\nನಿಮಗೆ ಬೇಕಾದುದನ್ನು ಟೈಪ್ ಮಾಡಿ ಮತ್ತು ಸ್ಟೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ: ಕಲರ್ ಮೆಶ್, ವೇವ್ಸ್, ಬೌಸ್ (Bauhaus) ಶೇಪ್ಸ್, ರಿಂಗ್ಸ್ ಅಥವಾ ಗ್ರೇನ್ ಗ್ರೇಡಿಯಂಟ್. ಅದೇ ಪದಗಳಿಂದ ಬೇರೊಂದು ಚಿತ್ರಕ್ಕಾಗಿ Variation ಬದಲಾಯಿಸಿ. ಇದು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿದ AI ಮಾಡೆಲ್ ಅಲ್ಲ, ನಿಮ್ಮ ಪದಗಳಿಂದ ಮಾಡಿದ ಪ್ರೊಸೀಜರಲ್ ಕಾಂಪೋಸಿಷನ್.\n@@TOOL_ID\nಫೋಟೋವನ್ನು ಪಾಸ್‌ಪೋರ್ಟ್ ಸೈಜ್‌ಗೆ ಕ್ರಾಪ್ ಮಾಡುತ್ತದೆ ಮತ್ತು ಒಂದೇ ಪ್ರಿಂಟ್ ಶೀಟ್‌ನಲ್ಲಿ ಹಲವು ಕಾಪಿಗಳನ್ನು ಇಡುತ್ತದೆ.\n@@HOW_ID\nನಿಮ್ಮ ದೇಶ ಕೇಳುವ ಸೈಜ್, ಪ್ರಿಂಟ್ DPI ಮತ್ತು ಶೀಟ್‌ನಲ್ಲಿ ಎಷ್ಟು ಕಾಪಿಗಳು ಹೊಂದಿಕೊಳ್ಳುತ್ತವೆ ಎಂಬುದನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. PNG ಅನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಸರಿಯಾದ ಸೈಜ್‌ನ ಫೋಟೋಗಾಗಿ ಹೇಳಿದ DPI ನಲ್ಲಿ ಪ್ರಿಂಟ್ ಮಾಡಿ.\n@@TOOL_SEAL\nಆರ್ಟ್‌ವರ್ಕ್‌ನಾದ್ಯಂತ ಟೈಲ್ಡ್ ವಾಟರ್‌ಮಾರ್ಕ್ ಅಥವಾ ಸ್ಟ್ಯಾಂಪ್ ಅನ್ನು ಸೇರಿಸುತ್ತದೆ.\n@@HOW_SEAL\nನಿಮ್ಮ ಹೆಸರು ಅಥವಾ ಬ್ರ್ಯಾಂಡ್ ಟೈಪ್ ಮಾಡಿ, ನಂತರ ಸೈಜ್, ಆಂಗಲ್, ಸ್ಪೇಸಿಂಗ್ ಮತ್ತು ಓಪಾಸಿಟಿಯನ್ನು ಸೆಟ್ ಮಾಡಿ. ಚಿತ್ರ ಓದಲು ಸಾಧ್ಯವಾಗುವಂತೆ ಓಪಾಸಿಟಿಯನ್ನು ಕಡಿಮೆ ಇಡಿ. ಇದನ್ನು ಡಿಸೈನ್‌ನ ಕಾಪಿಗೆ ಅಪ್ಲೈ ಮಾಡಿ, ಕೇವಲ ಒಂದೇ ಕಾಪಿಗೆ ಅಲ್ಲ.\n@@TOOL_BATCH\nಒಂದೇ ಬಾರಿಗೆ ಹಲವು ಇಮೇಜ್‌ಗಳನ್ನು ಕನ್ವರ್ಟ್ ಮಾಡುತ್ತದೆ ಮತ್ತು ರಿಸೈಜ್ ಮಾಡುತ್ತದೆ, ಎಲ್ಲವೂ ಈ ಡಿವೈಸ್‌ನಲ್ಲೇ.\n@@HOW_BATCH\nಫೈಲ್‌ಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ, ಉದ್ದನೆಯ ಸೈಡ್, ಫಾರ್ಮ್ಯಾಟ್ ಮತ್ತು ಕ್ವಾಲಿಟಿಯನ್ನು ಸೆಟ್ ಮಾಡಿ, ನಂತರ Add as new layer ಒತ್ತಿ. ಪ್ರತಿಯೊಂದು ಕನ್ವರ್ಟ್ ಆದ ಫೈಲ್ ಅನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ಸೇವ್ ಮಾಡಲಾಗುತ್ತದೆ, ಹಾಗಾಗಿ ಇಡೀ ಫೋಲ್ಡರ್ ಅನ್ನು ಒಂದೇ ಬಾರಿಗೆ ರೆಡಿ ಮಾಡಬಹುದು.\n@@TIPS_H\nಟಿಪ್ಸ್\n@@TIPS\n- ಪ್ರತಿಯೊಂದು ಟೂಲ್ ಹೊಸ ಲೇಯರ್ ಅನ್ನು ಸೇರಿಸುತ್ತದೆ, ಹಾಗಾಗಿ ಲೇಯರ್ ಅನ್ನು ಹೈಡ್ ಮಾಡುವ ಮೂಲಕ ನೀವು ಅದನ್ನು ಒರಿಜಿನಲ್ ಜೊತೆ ಹೋಲಿಸಬಹುದು.\n- ಪ್ರಿವ್ಯೂ ಸ್ಪೀಡ್‌ಗಾಗಿ ಒಂದು ಸ್ಕೇಲ್ ಮಾಡಿದ ಕಾಪಿ; ನೀವು ಅಪ್ಲೈ ಮಾಡುವ ರಿಸಲ್ಟ್ ಯಾವಾಗಲೂ ಫುಲ್ ರೆಸಲ್ಯೂಶನ್ ಆಗಿರುತ್ತದೆ.\n- Cut, Clear, Zoom ಮತ್ತು ID ಬೇರೆ ಸೈಜ್ ಅನ್ನು ಪ್ರೊಡ್ಯೂಸ್ ಮಾಡಬಹುದು. ಅವಕ್ಕಾಗಿ Open as new document ಬಳಸಿ.\n- ದೊಡ್ಡ ಕ್ಯಾನ್ವಾಸ್‌ನಲ್ಲಿ ಟೂಲ್ ಸ್ಲೋ ಅನಿಸಿದರೆ, ಇಡೀ ಡಿಸೈನ್ ಬದಲಿಗೆ ಆಕ್ಟಿವ್ ಲೇಯರ್ ಮೇಲೆ ರನ್ ಮಾಡಿ.\n- ಮ್ಯಾನುವಲ್ ಸೇರಿದಂತೆ ಇಲ್ಲಿ ಎಲ್ಲವೂ ಇಂಟರ್ನೆಟ್ ಆಫ್ ಆಗಿದ್ದರೂ ಕೆಲಸ ಮಾಡುತ್ತದೆ.\n@@OFFLINE\nಈ ಪ್ಯಾನಲ್‌ನಲ್ಲಿ ಯಾವುದೂ ಇಂಟರ್ನೆಟ್ ಬಳಸುವುದಿಲ್ಲ. ಫಾಂಟ್‌ಗಳು, ಐಕಾನ್‌ಗಳು, ಟೂಲ್‌ಗಳು ಮತ್ತು ಮ್ಯಾನುವಲ್ ಎಲ್ಲವೂ ಆಪ್‌ನೊಂದಿಗೆ ಸ್ಟೋರ್ ಆಗಿರುತ್ತವೆ, ಹಾಗಾಗಿ ಇದು ರೈಲಿನಲ್ಲಿ, ಹಳ್ಳಿಯಲ್ಲಿ ಅಥವಾ ನೆಟ್‌ವರ್ಕ್ ಇಲ್ಲದಿದ್ದರೂ ಕೆಲಸ ಮಾಡುತ್ತದೆ."
    },
    "ml": {
      ui: {
              "title": "Nirbhar ടൂളുകൾ",
              "subtitle": "ഓഫ്‌ലൈൻ ടൂളുകൾ — അപ്‌ലോഡ് വേണ്ട, അക്കൗണ്ട് വേണ്ട, നെറ്റ്‌വർക്ക് വേണ്ട",
              "manual": "മാനുവൽ",
              "manualtitle": "Nirbhar മാനുവൽ",
              "footnote": "എല്ലാ ടൂളുകളും ഈ പേജിനുള്ളിലാണ് പ്രവർത്തിക്കുന്നത്. റിസൾട്ടുകൾ ഒരു പുതിയ ലെയറായി ചേർക്കപ്പെടുന്നു, അതിനാൽ നിങ്ങളുടെ ഒറിജിനൽ ചിത്രത്തിന് മാറ്റമൊന്നും സംഭവിക്കില്ല.",
              "source": "സോഴ്സ്",
              "design": "മുഴുവൻ ഡിസൈൻ",
              "layer": "ആക്ടീവ് ലെയർ",
              "close": "അടയ്ക്കുക",
              "newdoc": "പുതിയ ഡോക്യുമെന്റായി തുറക്കുക",
              "download": "ഡൗൺലോഡ് ചെയ്യുക",
              "apply": "പുതിയ ലെയറായി ചേർക്കുക",
              "usepalette": "പാലറ്റായി ഉപയോഗിക്കുക",
              "fromimage": "ചിത്രത്തിൽ നിന്ന്",
              "harmony": "ഹാർമണി",
              "useharmony": "ഹാർമണി പാലറ്റായി ഉപയോഗിക്കുക",
              "paletteset": "പാലറ്റ് മാറ്റി",
              "nosource": "ഇതുവരെ വർക്ക് ചെയ്യാൻ ഒന്നുമില്ല — ആദ്യം എന്തെങ്കിലും വരയ്ക്കുക",
              "pickfiles": "ആദ്യം കുറഞ്ഞത് ഒരു ചിത്രമെങ്കിലും തിരഞ്ഞെടുക്കുക"
      },
      tools: {
              "cut": {
                      "desc": "ഫോട്ടോ, ലോഗോ അല്ലെങ്കിൽ സ്കാൻ എന്നിവയിൽ നിന്ന് ബാക്ക്ഗ്രൗണ്ട് നീക്കം ചെയ്യുകയും സബ്ജക്റ്റ് നിലനിർത്തുകയും ചെയ്യുന്നു.",
                      "how": "നാല് മൂലകളും സാമ്പിൾ ചെയ്യാൻ ഓട്ടോ (Auto) തിരഞ്ഞെടുക്കുക, അല്ലെങ്കിൽ കളർ നോക്കി ഔട്ട് ചെയ്യാൻ ഒരു നിറം തിരഞ്ഞെടുക്കുക. ബാക്കി അവശേഷിക്കുന്നുണ്ടെങ്കിൽ ടോളറൻസ് (Tolerance) കൂട്ടുക, സബ്ജക്റ്റ് നഷ്ടപ്പെടുന്നുണ്ടെങ്കിൽ അത് കുറയ്ക്കുക. എഡ്ജ് സോഫ്റ്റൻ (Edge soften) മുടിയും ആന്റി-ഏലിയാസ്ഡ് എഡ്ജുകളും ക്ലീൻ ആക്കി നിർത്തുന്നു, കൂടാതെ ക്ലീൻ കളർ ഫ്രിഞ്ചസ് (Clean colour fringes) കളർ ഹാലോ നീക്കം ചെയ്യുന്നു."
              },
              "clear": {
                      "desc": "ഒരു ഫോട്ടോ മെച്ചപ്പെടുത്തുന്നു: വൈറ്റ് ബാലൻസ്, ലെവലുകൾ, നോയ്സ്, ഹെയ്സ്, ക്ലാരിറ്റി, ഷാർപ്പനിംഗ്.",
                      "how": "ഫോട്ടോ വായിച്ച് അതിൻ്റെ സ്ട്രെങ്ത് സ്വയം തിരഞ്ഞെടുക്കുന്ന ഒരു വൺ-പ്രസ്സ് ഫിക്സിനായി ഓട്ടോമാറ്റിക് റെസിപ്പി ഓൺ ആക്കി വെക്കുക. ഓരോ സ്റ്റെപ്പും സ്വയം സെറ്റ് ചെയ്യാൻ ഇത് ഓഫ് ചെയ്യുക. പഞ്ചിന് ക്ലാരിറ്റിയും (Clarity) അവസാനം ഷാർപ്പൻ (Sharpen) ചെയ്യുക."
              },
              "zoom": {
                      "desc": "എഡ്ജുകൾ ബ്ലർ ചെയ്യാതെ ഡിസൈൻ രണ്ടോ മൂന്നോ നാലോ എട്ടോ ഇരട്ടി വലുതാക്കുന്നു.",
                      "how": "ഫോട്ടോകൾക്ക് ലാൻക്സോസ് (Lanczos), സ്മൂത്ത് ഗ്രാഫിക്സിന് ബൈക്യൂബിക് (Bicubic), പിക്സൽ ആർട്ടിന് EPX എന്നിവ ഉപയോഗിക്കുക, കാരണം EPX ഡയഗണൽ സ്റ്റെപ്പുകൾ ഷാർപ്പ് ആക്കി നിർത്തുന്നു. ഷാർപ്പൻ ആഫ്റ്റർ (Sharpen after) വലുതാക്കിയ റിസൾട്ടിന് ചെറിയൊരു ക്രിസ്പ്നെസ്സ് നൽകുന്നു."
              },
              "tone": {
                      "desc": "ആർട്ട്‌വർക്കിന് പ്രിൻ്റഡ് അല്ലെങ്കിൽ ഗ്രാഫിക് ലുക്ക് നൽകുന്നു: ഹാഫ്‌ടോൺ ഡോട്ട്സ്, ഡ്യൂട്ടോൺ, ഗ്രേഡിയൻ്റ് മാപ്പ്, പെൻസിൽ സ്കെച്ച്, കളർ-ബ്ലൈൻഡ്നെസ് ചെക്ക്.",
                      "how": "ഹാഫ്‌ടോൺ പോസ്റ്റർകൾക്കും സൈനുകൾക്കുമായി ചിത്രത്തെ ഡോട്ട്സ് ആക്കി മാറ്റുന്നു. ഡ്യൂട്ടോണും ഗ്രേഡിയൻ്റ് മാപ്പും രണ്ട് നിറങ്ങൾ ഉപയോഗിച്ച് ഇതിന് നിറം നൽകുന്നു. പെൻസിൽ സ്കെച്ച് എഡ്ജുകൾ വരയ്ക്കുന്നു. കളർ-ബ്ലൈൻഡ്നെസ് ചെക്ക് പാലറ്റ് ഒരു കളർ-ബ്ലൈൻഡ് വ്യൂവറിന് എങ്ങനെ തോന്നുന്നു എന്ന് കാണിക്കുന്നു."
              },
              "tile": {
                      "desc": "ചിത്രം സീംലെസ്സ് ആക്കുന്നു, അതിനാൽ കാണാൻ കഴിയുന്ന ജോയിൻ ഇല്ലാതെ അത് ആവർത്തിക്കുന്നു.",
                      "how": "ഓട്ടോമാറ്റിക് സ്ട്രെങ്ത്തിനായി സീം ബ്ലെൻഡ് (Seam blend) പൂജ്യത്തിൽ വെക്കുക. റിസൾട്ട് അപ്ലൈ ചെയ്യുക, തുടർന്ന് ഒരു പാറ്റേൺ ബാക്ക്ഗ്രൗണ്ട്, ഗെയിം ടെക്സ്ചർ അല്ലെങ്കിൽ വാൾപേപ്പർ ആയി ഉപയോഗിക്കുക."
              },
              "pal": {
                      "desc": "ഒരു ചിത്രത്തിലെ നിറങ്ങൾ വേർതിരിച്ചെടുക്കുകയും മാച്ച് ചെയ്യുന്ന കളർ ഹാർമണികൾ നിർമ്മിക്കുകയും ചെയ്യുന്നു.",
                      "how": "എത്ര നിറങ്ങൾ എടുക്കണമെന്ന് സെറ്റ് ചെയ്യുക, ടൂൾ ചിത്രം വായിക്കുന്നു. ഒരു റെഡി സെറ്റ് ലഭിക്കാൻ ഒരു ബേസ് കളറും ഹാർമണിയും തിരഞ്ഞെടുക്കുക. ഏതെങ്കിലും സ്വാച്ചിൽ ടാപ്പ് ചെയ്ത് അത് പ്രൈമറി കളർ ആക്കുക, അല്ലെങ്കിൽ ഒറ്റ പ്രസ്സിൽ ഹാർമണി ഉപയോഗിച്ച് പാലറ്റ് മാറ്റുക."
              },
              "paper": {
                      "desc": "ലൈബ്രറിയോ പ്രിൻ്റ് ഡയലോഗോ ഇല്ലാതെ ഒരു യഥാർത്ഥ PDF ഫയൽ നിർമ്മിക്കുന്നു.",
                      "how": "പേജ് സൈസ്, ഓറിയൻ്റേഷൻ, മാർജിൻ എന്നിവ തിരഞ്ഞെടുക്കുക, കൂടുതൽ പേജുകളായി അധിക ചിത്രങ്ങൾ ചേർക്കുക. ഡൗൺലോഡ് അമർത്തുക, PDF നിങ്ങളുടെ ഡിവൈസിലേക്ക് സേവ് ആകും. പേജ് ഉയർന്ന നിലവാരമുള്ള JPEG ആയി ഉൾപ്പെടുത്തിയിട്ടുള്ളതിനാൽ ടെക്സ്റ്റും ചിത്രങ്ങളും ഷാർപ്പ് ആയി നിൽക്കും."
              },
              "sheet": {
                      "desc": "ഒരു ആപ്പ് ഐക്കൺ സെറ്റ് ഒരു .ico ഫയലായി എക്സ്പോർട്ട് ചെയ്യുന്നു, അല്ലെങ്കിൽ നിങ്ങളുടെ വിസിബിൾ ലെയറുകളിൽ നിന്ന് നിർമ്മിച്ച ഒരു സ്പ്രൈറ്റ് ഷീറ്റ്.",
                      "how": "ഐക്കൺ മോഡ് 16, 32, 48, 64, 128, 256 പിക്സൽ ചിത്രങ്ങൾ ഒരു favicon.ico-ലേക്ക് എഴുതുന്നു. സ്പ്രൈറ്റ് മോഡ് ഓരോ വിസിബിൾ ലെയറും ഒരു PNG-ൽ അടുത്തടുത്ത് വെക്കുന്നു, ഇത് ഒരു ഗെയിം എഞ്ചിനായി തയ്യാറാണ്."
              },
              "vector": {
                      "desc": "ഡിസൈൻ SVG ആയി എക്സ്പോർട്ട് ചെയ്യുന്നു, അതിനാൽ ടെക്സ്റ്റും ഷേപ്പുകളും എഡിറ്റ് ചെയ്യാവുന്ന വെക്റ്ററുകളായി തുടരുന്നു.",
                      "how": "SVG-ക്കുള്ളിൽ പിക്സൽ വർക്ക് ഒരു ബാക്ക്ഗ്രൗണ്ട് ഇമേജായി വെക്കാൻ ഇൻക്ലൂഡ് പെയിൻ്റഡ് ലെയേഴ്സ് (Include painted layers) ഓൺ ആക്കി വെക്കുക, അല്ലെങ്കിൽ പ്യുവർ വെക്റ്റർ ഫയലിനായി ഇത് ഓഫ് ചെയ്യുക. ഏത് ബ്രൗസറിലോ Inkscape-ലോ Illustrator-ലോ SVG തുറക്കുക."
              },
              "art": {
                      "desc": "എഴുതിയ വിവരണത്തിൽ നിന്ന് ഒറിജിനൽ ആർട്ട്‌വർക്ക് നിർമ്മിക്കുന്നു.",
                      "how": "നിങ്ങൾക്ക് വേണ്ടത് ടൈപ്പ് ചെയ്ത് ഒരു സ്റ്റൈൽ തിരഞ്ഞെടുക്കുക: കളർ മെഷ്, വേവ്സ്, ബൗഹൗസ് ഷേപ്പുകൾ, റിംഗ്സ് അല്ലെങ്കിൽ ഗ്രെയിൻ ഗ്രേഡിയൻ്റ്. ഒരേ വാക്കുകളിൽ നിന്ന് വ്യത്യസ്തമായ ചിത്രം ലഭിക്കാൻ വേരിയേഷൻ (Variation) മാറ്റുക. ഇത് ഡൗൺലോഡ് ചെയ്ത ഒരു AI മോഡലല്ല, മറിച്ച് നിങ്ങളുടെ വാക്കുകളിൽ നിന്ന് നിർമ്മിച്ച പ്രൊസീജറൽ കോമ്പോസിഷനാണ്."
              },
              "id": {
                      "desc": "ഒരു ഫോട്ടോ പാസ്‌പോർട്ട് സൈസിലേക്ക് ക്രോപ്പ് ചെയ്യുകയും ഒരു പ്രിൻ്റ് ഷീറ്റിൽ പല കോപ്പികൾ വെക്കുകയും ചെയ്യുന്നു.",
                      "how": "നിങ്ങളുടെ രാജ്യം ആവശ്യപ്പെടുന്ന സൈസ്, പ്രിൻ്റ് DPI, ഷീറ്റിൽ എത്ര കോപ്പികൾ കൊള്ളും എന്നിവ തിരഞ്ഞെടുക്കുക. PNG ഡൗൺലോഡ് ചെയ്ത് ശരിയായ സൈസിലുള്ള ഫോട്ടോ ലഭിക്കാൻ പറഞ്ഞിരിക്കുന്ന DPI-ൽ പ്രിൻ്റ് ചെയ്യുക."
              },
              "seal": {
                      "desc": "ആർട്ട്‌വർക്കിലുടനീളം ഒരു ടൈൽഡ് വാട്ടർമാർക്ക് അല്ലെങ്കിൽ സ്റ്റാമ്പ് ചേർക്കുന്നു.",
                      "how": "നിങ്ങളുടെ പേരോ ബ്രാൻഡോ ടൈപ്പ് ചെയ്യുക, തുടർന്ന് സൈസ്, ആംഗിൾ, സ്പേസിംഗ്, ഒപ്പാസിറ്റി എന്നിവ സെറ്റ് ചെയ്യുക. ചിത്രം വായിക്കാൻ കഴിയുന്ന രീതിയിൽ ഒപ്പാസിറ്റി കുറയ്ക്കുക. ഡിസൈനിൻ്റെ ഒരേയൊരു കോപ്പിയിലല്ല, ഒരു കോപ്പിയിൽ ഇത് അപ്ലൈ ചെയ്യുക."
              },
              "batch": {
                      "desc": "ഒരേസമയം പല ചിത്രങ്ങളും കൺവേർട്ട് ചെയ്യുകയും റീസൈസ് ചെയ്യുകയും ചെയ്യുന്നു, അതും ഈ ഡിവൈസിൽ തന്നെ.",
                      "how": "ഫയലുകൾ തിരഞ്ഞെടുക്കുക, ഏറ്റവും വലിയ സൈഡ്, ഫോർമാറ്റ്, ക്വാളിറ്റി എന്നിവ സെറ്റ് ചെയ്യുക, തുടർന്ന് പുതിയ ലെയറായി ചേർക്കുക (Add as new layer) അമർത്തുക. ഓരോ കൺവേർട്ട് ചെയ്ത ഫയലും വെവ്വേറെ സേവ് ചെയ്യപ്പെടുന്നു, അതിനാൽ ഒരു മുഴുവൻ ഫോൾഡറും ഒറ്റയടിക്ക് തയ്യാറാക്കാം."
              }
      },
      manual: "@@TITLE\nNirbhar മാനുവൽ\n@@INTRO\nNirbhar എന്നാൽ സ്വയംപര്യാപ്തം എന്നാണ് അർത്ഥമാക്കുന്നത്. പിക്സൽ സ്റ്റുഡിയോയിൽ ഉൾപ്പെടുത്തിയിട്ടുള്ള ഓഫ്‌ലൈൻ ടൂൾബോക്സാണിത്: ബാക്ക്ഗ്രൗണ്ട് നീക്കം ചെയ്യാനും, ഫോട്ടോയുടെ ക്വാളിറ്റി കൂട്ടാനും, വലുപ്പം കൂട്ടാനും, PDF ഉണ്ടാക്കാനും, ആപ്പ് ഐക്കൺ നിർമ്മിക്കാനും, ജനറേറ്റീവ് ആർട്ട് വരയ്ക്കാനും മറ്റുമായി പതിമൂന്ന് ടൂളുകൾ ഇതിലുണ്ട്. എല്ലാം നിങ്ങളുടെ സ്വന്തം ഡിവൈസിലാണ് ഈ പേജ് കണക്കുകൂട്ടുന്നത്. ഇതിൽ അപ്‌ലോഡ് ചെയ്യലോ, അക്കൗണ്ടോ, API കീയോ, മോഡൽ ഡൗൺലോഡോ, ഇന്റർനെറ്റ് കണക്ഷനോ ഒന്നുമില്ല.\n@@START_H\nനാല് ഘട്ടങ്ങളിലായി തുടങ്ങാം\n@@START\n- വലതുവശത്തുള്ള Nirbhar ടാബ് തുറക്കുക (ഫോണിലാണെങ്കിൽ, താഴെയുള്ള ഷീറ്റിൽ ടാപ്പ് ചെയ്യുക).\n- ഒരു ടൂൾ തിരഞ്ഞെടുക്കുക. പ്രിവ്യൂവും അതിൻ്റെ സ്വന്തം സെറ്റിംഗ്സും അടങ്ങിയ ഒരു ഡയലോഗ് തുറന്നുവരും.\n- പ്രിവ്യൂ ശരിയാണെന്ന് തോന്നുന്നത് വരെ സെറ്റിംഗ്സ് മാറ്റുക; പ്രിവ്യൂ ഒരു ചെറിയ കോപ്പിയാണ്, യഥാർത്ഥ വർക്ക് നടക്കുന്നത് മുഴുവൻ സൈസിലാണ്.\n- പുതിയ ലെയറായി ചേർക്കുക (Add as new layer) അമർത്തുക. നിങ്ങളുടെ ഒറിജിനൽ ചിത്രത്തിന് മാറ്റമൊന്നും സംഭവിക്കില്ല, റിസൾട്ട് നിങ്ങൾക്ക് എഡിറ്റ് ചെയ്യാൻ കഴിയുന്ന ഒരു പുതിയ ലെയറായി മാറും.\n@@TOOLS_H\nപതിമൂന്ന് ടൂളുകൾ\n@@TOOL_CUT\nഫോട്ടോ, ലോഗോ അല്ലെങ്കിൽ സ്കാൻ എന്നിവയിൽ നിന്ന് ബാക്ക്ഗ്രൗണ്ട് നീക്കം ചെയ്യുകയും സബ്ജക്റ്റ് നിലനിർത്തുകയും ചെയ്യുന്നു.\n@@HOW_CUT\nനാല് മൂലകളും സാമ്പിൾ ചെയ്യാൻ ഓട്ടോ (Auto) തിരഞ്ഞെടുക്കുക, അല്ലെങ്കിൽ കളർ നോക്കി ഔട്ട് ചെയ്യാൻ ഒരു നിറം തിരഞ്ഞെടുക്കുക. ബാക്കി അവശേഷിക്കുന്നുണ്ടെങ്കിൽ ടോളറൻസ് (Tolerance) കൂട്ടുക, സബ്ജക്റ്റ് നഷ്ടപ്പെടുന്നുണ്ടെങ്കിൽ അത് കുറയ്ക്കുക. എഡ്ജ് സോഫ്റ്റൻ (Edge soften) മുടിയും ആന്റി-ഏലിയാസ്ഡ് എഡ്ജുകളും ക്ലീൻ ആക്കി നിർത്തുന്നു, കൂടാതെ ക്ലീൻ കളർ ഫ്രിഞ്ചസ് (Clean colour fringes) കളർ ഹാലോ നീക്കം ചെയ്യുന്നു.\n@@TOOL_CLEAR\nഒരു ഫോട്ടോ മെച്ചപ്പെടുത്തുന്നു: വൈറ്റ് ബാലൻസ്, ലെവലുകൾ, നോയ്സ്, ഹെയ്സ്, ക്ലാരിറ്റി, ഷാർപ്പനിംഗ്.\n@@HOW_CLEAR\nഫോട്ടോ വായിച്ച് അതിൻ്റെ സ്ട്രെങ്ത് സ്വയം തിരഞ്ഞെടുക്കുന്ന ഒരു വൺ-പ്രസ്സ് ഫിക്സിനായി ഓട്ടോമാറ്റിക് റെസിപ്പി ഓൺ ആക്കി വെക്കുക. ഓരോ സ്റ്റെപ്പും സ്വയം സെറ്റ് ചെയ്യാൻ ഇത് ഓഫ് ചെയ്യുക. പഞ്ചിന് ക്ലാരിറ്റിയും (Clarity) അവസാനം ഷാർപ്പൻ (Sharpen) ചെയ്യുക.\n@@TOOL_ZOOM\nഎഡ്ജുകൾ ബ്ലർ ചെയ്യാതെ ഡിസൈൻ രണ്ടോ മൂന്നോ നാലോ എട്ടോ ഇരട്ടി വലുതാക്കുന്നു.\n@@HOW_ZOOM\nഫോട്ടോകൾക്ക് ലാൻക്സോസ് (Lanczos), സ്മൂത്ത് ഗ്രാഫിക്സിന് ബൈക്യൂബിക് (Bicubic), പിക്സൽ ആർട്ടിന് EPX എന്നിവ ഉപയോഗിക്കുക, കാരണം EPX ഡയഗണൽ സ്റ്റെപ്പുകൾ ഷാർപ്പ് ആക്കി നിർത്തുന്നു. ഷാർപ്പൻ ആഫ്റ്റർ (Sharpen after) വലുതാക്കിയ റിസൾട്ടിന് ചെറിയൊരു ക്രിസ്പ്നെസ്സ് നൽകുന്നു.\n@@TOOL_TONE\nആർട്ട്‌വർക്കിന് പ്രിൻ്റഡ് അല്ലെങ്കിൽ ഗ്രാഫിക് ലുക്ക് നൽകുന്നു: ഹാഫ്‌ടോൺ ഡോട്ട്സ്, ഡ്യൂട്ടോൺ, ഗ്രേഡിയൻ്റ് മാപ്പ്, പെൻസിൽ സ്കെച്ച്, കളർ-ബ്ലൈൻഡ്നെസ് ചെക്ക്.\n@@HOW_TONE\nഹാഫ്‌ടോൺ പോസ്റ്റർകൾക്കും സൈനുകൾക്കുമായി ചിത്രത്തെ ഡോട്ട്സ് ആക്കി മാറ്റുന്നു. ഡ്യൂട്ടോണും ഗ്രേഡിയൻ്റ് മാപ്പും രണ്ട് നിറങ്ങൾ ഉപയോഗിച്ച് ഇതിന് നിറം നൽകുന്നു. പെൻസിൽ സ്കെച്ച് എഡ്ജുകൾ വരയ്ക്കുന്നു. കളർ-ബ്ലൈൻഡ്നെസ് ചെക്ക് പാലറ്റ് ഒരു കളർ-ബ്ലൈൻഡ് വ്യൂവറിന് എങ്ങനെ തോന്നുന്നു എന്ന് കാണിക്കുന്നു.\n@@TOOL_TILE\nചിത്രം സീംലെസ്സ് ആക്കുന്നു, അതിനാൽ കാണാൻ കഴിയുന്ന ജോയിൻ ഇല്ലാതെ അത് ആവർത്തിക്കുന്നു.\n@@HOW_TILE\nഓട്ടോമാറ്റിക് സ്ട്രെങ്ത്തിനായി സീം ബ്ലെൻഡ് (Seam blend) പൂജ്യത്തിൽ വെക്കുക. റിസൾട്ട് അപ്ലൈ ചെയ്യുക, തുടർന്ന് ഒരു പാറ്റേൺ ബാക്ക്ഗ്രൗണ്ട്, ഗെയിം ടെക്സ്ചർ അല്ലെങ്കിൽ വാൾപേപ്പർ ആയി ഉപയോഗിക്കുക.\n@@TOOL_PAL\nഒരു ചിത്രത്തിലെ നിറങ്ങൾ വേർതിരിച്ചെടുക്കുകയും മാച്ച് ചെയ്യുന്ന കളർ ഹാർമണികൾ നിർമ്മിക്കുകയും ചെയ്യുന്നു.\n@@HOW_PAL\nഎത്ര നിറങ്ങൾ എടുക്കണമെന്ന് സെറ്റ് ചെയ്യുക, ടൂൾ ചിത്രം വായിക്കുന്നു. ഒരു റെഡി സെറ്റ് ലഭിക്കാൻ ഒരു ബേസ് കളറും ഹാർമണിയും തിരഞ്ഞെടുക്കുക. ഏതെങ്കിലും സ്വാച്ചിൽ ടാപ്പ് ചെയ്ത് അത് പ്രൈമറി കളർ ആക്കുക, അല്ലെങ്കിൽ ഒറ്റ പ്രസ്സിൽ ഹാർമണി ഉപയോഗിച്ച് പാലറ്റ് മാറ്റുക.\n@@TOOL_PAPER\nലൈബ്രറിയോ പ്രിൻ്റ് ഡയലോഗോ ഇല്ലാതെ ഒരു യഥാർത്ഥ PDF ഫയൽ നിർമ്മിക്കുന്നു.\n@@HOW_PAPER\nപേജ് സൈസ്, ഓറിയൻ്റേഷൻ, മാർജിൻ എന്നിവ തിരഞ്ഞെടുക്കുക, കൂടുതൽ പേജുകളായി അധിക ചിത്രങ്ങൾ ചേർക്കുക. ഡൗൺലോഡ് അമർത്തുക, PDF നിങ്ങളുടെ ഡിവൈസിലേക്ക് സേവ് ആകും. പേജ് ഉയർന്ന നിലവാരമുള്ള JPEG ആയി ഉൾപ്പെടുത്തിയിട്ടുള്ളതിനാൽ ടെക്സ്റ്റും ചിത്രങ്ങളും ഷാർപ്പ് ആയി നിൽക്കും.\n@@TOOL_SHEET\nഒരു ആപ്പ് ഐക്കൺ സെറ്റ് ഒരു .ico ഫയലായി എക്സ്പോർട്ട് ചെയ്യുന്നു, അല്ലെങ്കിൽ നിങ്ങളുടെ വിസിബിൾ ലെയറുകളിൽ നിന്ന് നിർമ്മിച്ച ഒരു സ്പ്രൈറ്റ് ഷീറ്റ്.\n@@HOW_SHEET\nഐക്കൺ മോഡ് 16, 32, 48, 64, 128, 256 പിക്സൽ ചിത്രങ്ങൾ ഒരു favicon.ico-ലേക്ക് എഴുതുന്നു. സ്പ്രൈറ്റ് മോഡ് ഓരോ വിസിബിൾ ലെയറും ഒരു PNG-ൽ അടുത്തടുത്ത് വെക്കുന്നു, ഇത് ഒരു ഗെയിം എഞ്ചിനായി തയ്യാറാണ്.\n@@TOOL_VECTOR\nഡിസൈൻ SVG ആയി എക്സ്പോർട്ട് ചെയ്യുന്നു, അതിനാൽ ടെക്സ്റ്റും ഷേപ്പുകളും എഡിറ്റ് ചെയ്യാവുന്ന വെക്റ്ററുകളായി തുടരുന്നു.\n@@HOW_VECTOR\nSVG-ക്കുള്ളിൽ പിക്സൽ വർക്ക് ഒരു ബാക്ക്ഗ്രൗണ്ട് ഇമേജായി വെക്കാൻ ഇൻക്ലൂഡ് പെയിൻ്റഡ് ലെയേഴ്സ് (Include painted layers) ഓൺ ആക്കി വെക്കുക, അല്ലെങ്കിൽ പ്യുവർ വെക്റ്റർ ഫയലിനായി ഇത് ഓഫ് ചെയ്യുക. ഏത് ബ്രൗസറിലോ Inkscape-ലോ Illustrator-ലോ SVG തുറക്കുക.\n@@TOOL_ART\nഎഴുതിയ വിവരണത്തിൽ നിന്ന് ഒറിജിനൽ ആർട്ട്‌വർക്ക് നിർമ്മിക്കുന്നു.\n@@HOW_ART\nനിങ്ങൾക്ക് വേണ്ടത് ടൈപ്പ് ചെയ്ത് ഒരു സ്റ്റൈൽ തിരഞ്ഞെടുക്കുക: കളർ മെഷ്, വേവ്സ്, ബൗഹൗസ് ഷേപ്പുകൾ, റിംഗ്സ് അല്ലെങ്കിൽ ഗ്രെയിൻ ഗ്രേഡിയൻ്റ്. ഒരേ വാക്കുകളിൽ നിന്ന് വ്യത്യസ്തമായ ചിത്രം ലഭിക്കാൻ വേരിയേഷൻ (Variation) മാറ്റുക. ഇത് ഡൗൺലോഡ് ചെയ്ത ഒരു AI മോഡലല്ല, മറിച്ച് നിങ്ങളുടെ വാക്കുകളിൽ നിന്ന് നിർമ്മിച്ച പ്രൊസീജറൽ കോമ്പോസിഷനാണ്.\n@@TOOL_ID\nഒരു ഫോട്ടോ പാസ്‌പോർട്ട് സൈസിലേക്ക് ക്രോപ്പ് ചെയ്യുകയും ഒരു പ്രിൻ്റ് ഷീറ്റിൽ പല കോപ്പികൾ വെക്കുകയും ചെയ്യുന്നു.\n@@HOW_ID\nനിങ്ങളുടെ രാജ്യം ആവശ്യപ്പെടുന്ന സൈസ്, പ്രിൻ്റ് DPI, ഷീറ്റിൽ എത്ര കോപ്പികൾ കൊള്ളും എന്നിവ തിരഞ്ഞെടുക്കുക. PNG ഡൗൺലോഡ് ചെയ്ത് ശരിയായ സൈസിലുള്ള ഫോട്ടോ ലഭിക്കാൻ പറഞ്ഞിരിക്കുന്ന DPI-ൽ പ്രിൻ്റ് ചെയ്യുക.\n@@TOOL_SEAL\nആർട്ട്‌വർക്കിലുടനീളം ഒരു ടൈൽഡ് വാട്ടർമാർക്ക് അല്ലെങ്കിൽ സ്റ്റാമ്പ് ചേർക്കുന്നു.\n@@HOW_SEAL\nനിങ്ങളുടെ പേരോ ബ്രാൻഡോ ടൈപ്പ് ചെയ്യുക, തുടർന്ന് സൈസ്, ആംഗിൾ, സ്പേസിംഗ്, ഒപ്പാസിറ്റി എന്നിവ സെറ്റ് ചെയ്യുക. ചിത്രം വായിക്കാൻ കഴിയുന്ന രീതിയിൽ ഒപ്പാസിറ്റി കുറയ്ക്കുക. ഡിസൈനിൻ്റെ ഒരേയൊരു കോപ്പിയിലല്ല, ഒരു കോപ്പിയിൽ ഇത് അപ്ലൈ ചെയ്യുക.\n@@TOOL_BATCH\nഒരേസമയം പല ചിത്രങ്ങളും കൺവേർട്ട് ചെയ്യുകയും റീസൈസ് ചെയ്യുകയും ചെയ്യുന്നു, അതും ഈ ഡിവൈസിൽ തന്നെ.\n@@HOW_BATCH\nഫയലുകൾ തിരഞ്ഞെടുക്കുക, ഏറ്റവും വലിയ സൈഡ്, ഫോർമാറ്റ്, ക്വാളിറ്റി എന്നിവ സെറ്റ് ചെയ്യുക, തുടർന്ന് പുതിയ ലെയറായി ചേർക്കുക (Add as new layer) അമർത്തുക. ഓരോ കൺവേർട്ട് ചെയ്ത ഫയലും വെവ്വേറെ സേവ് ചെയ്യപ്പെടുന്നു, അതിനാൽ ഒരു മുഴുവൻ ഫോൾഡറും ഒറ്റയടിക്ക് തയ്യാറാക്കാം.\n@@TIPS_H\nടിപ്സ്\n@@TIPS\n- എല്ലാ ടൂളുകളും ഒരു പുതിയ ലെയർ ചേർക്കുന്നു, അതിനാൽ ലെയർ മറച്ചുവെച്ച് നിങ്ങൾക്ക് ഒറിജിനലുമായി താരതമ്യം ചെയ്യാം.\n- വേഗതയ്ക്കായി പ്രിവ്യൂ ഒരു ചെറിയ കോപ്പിയാണ്; നിങ്ങൾ അപ്ലൈ ചെയ്യുന്ന റിസൾട്ട് എപ്പോഴും മുഴുവൻ റെസല്യൂഷനിലുള്ളതായിരിക്കും.\n- Cut, Clear, Zoom, ID എന്നിവയ്ക്ക് വ്യത്യസ്ത സൈസ് ഉണ്ടാക്കാൻ കഴിയും. അവയ്ക്കായി പുതിയ ഡോക്യുമെൻ്റായി തുറക്കുക (Open as new document) ഉപയോഗിക്കുക.\n- വലിയ ക്യാൻവാസിൽ ഒരു ടൂൾ സ്ലോ ആണെന്ന് തോന്നുകയാണെങ്കിൽ, മുഴുവൻ ഡിസൈനിനും പകരം ആക്ടീവ് ലെയറിൽ അത് റൺ ചെയ്യുക.\n- മാനുവൽ ഉൾപ്പെടെ ഇവിടെ എല്ലാം ഇന്റർനെറ്റ് ഓഫ് ആക്കിയും വർക്ക് ചെയ്യും.\n@@OFFLINE\nഈ പാനലിലെ ഒന്നും ഇന്റർനെറ്റ് ഉപയോഗിക്കുന്നില്ല. ഫോണ്ടുകൾ, ഐക്കണുകൾ, ടൂളുകൾ, മാനുവൽ എന്നിവയെല്ലാം ആപ്പിനൊപ്പം സ്റ്റോർ ചെയ്തിട്ടുണ്ട്, അതിനാൽ ട്രെയിനിലോ ഗ്രാമത്തിലോ പവർ കട്ടായ സമയത്തോ ഇത് വർക്ക് ചെയ്തുകൊണ്ടിരിക്കും."
    },
    "pa": {
      ui: {
              "title": "Nirbhar ਟੂਲ",
              "subtitle": "ਆਫਲਾਈਨ ਟੂਲ — ਕੋਈ ਅਪਲੋਡ ਨਹੀਂ, ਕੋਈ ਖਾਤਾ ਨਹੀਂ, ਕੋਈ ਨੈੱਟਵਰਕ ਨਹੀਂ",
              "manual": "ਮੈਨੂਅਲ",
              "manualtitle": "Nirbhar ਮੈਨੂਅਲ",
              "footnote": "ਹਰ ਟੂਲ ਇਸ ਪੇਜ ਦੇ ਅੰਦਰ ਚੱਲਦਾ ਹੈ। ਨਤੀਜੇ ਇੱਕ ਨਵੀਂ ਲੇਅਰ ਵਜੋਂ ਜੋੜੇ ਜਾਂਦੇ ਹਨ, ਇਸ ਲਈ ਤੁਹਾਡਾ ਅਸਲੀ ਕੰਮ ਉਵੇਂ ਹੀ ਰਹਿੰਦਾ ਹੈ।",
              "source": "ਸੋਰਸ",
              "design": "ਪੂਰਾ ਡਿਜ਼ਾਈਨ",
              "layer": "ਐਕਟਿਵ ਲੇਅਰ",
              "close": "ਬੰਦ ਕਰੋ",
              "newdoc": "ਨਵੇਂ ਡਾਕੂਮੈਂਟ ਵਜੋਂ ਖੋਲ੍ਹੋ",
              "download": "ਡਾਊਨਲੋਡ ਕਰੋ",
              "apply": "ਨਵੀਂ ਲੇਅਰ ਵਜੋਂ ਸ਼ਾਮਲ ਕਰੋ",
              "usepalette": "ਪੈਲੇਟ ਵਜੋਂ ਵਰਤੋ",
              "fromimage": "ਤਸਵੀਰ ਤੋਂ",
              "harmony": "ਹਾਰਮਨੀ",
              "useharmony": "ਹਾਰਮਨੀ ਨੂੰ ਪੈਲੇਟ ਵਜੋਂ ਵਰਤੋ",
              "paletteset": "ਪੈਲੇਟ ਬਦਲਿਆ ਗਿਆ",
              "nosource": "ਅਜੇ ਕੰਮ ਕਰਨ ਲਈ ਕੁਝ ਨਹੀਂ ਹੈ — ਪਹਿਲਾਂ ਕੁਝ ਬਣਾਓ",
              "pickfiles": "ਪਹਿਲਾਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਤਸਵੀਰ ਚੁਣੋ"
      },
      tools: {
              "cut": {
                      "desc": "ਫੋਟੋ, ਲੋਗੋ ਜਾਂ ਸਕੈਨ ਵਿੱਚੋਂ ਬੈਕਗ੍ਰਾਊਂਡ ਹਟਾਉਂਦਾ ਹੈ ਅਤੇ ਮੁੱਖ ਵਿਸ਼ੇ ਨੂੰ ਰੱਖਦਾ ਹੈ।",
                      "how": "ਚਾਰ ਕੋਨਿਆਂ ਨੂੰ ਸੈਂਪਲ ਕਰਨ ਲਈ Auto ਚੁਣੋ, ਜਾਂ ਹਟਾਉਣ ਲਈ ਕੋਈ ਰੰਗ ਚੁਣੋ। ਜਦੋਂ ਕੁਝ ਬਚਿਆ ਰਹਿ ਜਾਵੇ ਤਾਂ Tolerance ਵਧਾਓ, ਅਤੇ ਜਦੋਂ ਮੁੱਖ ਵਿਸ਼ਾ ਕੱਟਿਆ ਜਾ ਰਿਹਾ ਹੋਵੇ ਤਾਂ ਇਸਨੂੰ ਘਟਾਓ। Edge soften ਵਾਲਾਂ ਅਤੇ ਸਾਫ਼ ਕਿਨਾਰਿਆਂ ਨੂੰ ਸਾਫ਼ ਰੱਖਦਾ ਹੈ, ਅਤੇ Clean colour fringes ਰੰਗੀਨ ਪ੍ਰਭਾਵ ਨੂੰ ਹਟਾਉਂਦਾ ਹੈ।"
              },
              "clear": {
                      "desc": "ਫੋਟੋ ਨੂੰ ਸੁਧਾਰਦਾ ਹੈ: ਵ੍ਹਾਈਟ ਬੈਲੇਂਸ, ਲੈਵਲ, ਨੌਇਜ਼, ਧੁੰਦ, ਕਲੈਰਿਟੀ ਅਤੇ ਸ਼ਾਰਪਨਿੰਗ।",
                      "how": "ਇੱਕ-ਪ੍ਰੈੱਸ ਵਾਲੇ ਫਿਕਸ ਲਈ Automatic recipe ਨੂੰ ਚਾਲੂ ਛੱਡੋ ਜੋ ਫੋਟੋ ਨੂੰ ਪੜ੍ਹਦਾ ਹੈ ਅਤੇ ਖੁਦ ਤਾਕਤ ਚੁਣਦਾ ਹੈ। ਹਰ ਸਟੈਪ ਨੂੰ ਹੱਥ ਨਾਲ ਸੈੱਟ ਕਰਨ ਲਈ ਇਸਨੂੰ ਬੰਦ ਕਰ ਦਿਓ। ਪ੍ਰਭਾਵ ਲਈ Clarity ਅਤੇ ਅੰਤ ਵਿੱਚ Sharpen ਵਰਤੋ।"
              },
              "zoom": {
                      "desc": "ਕਿਨਾਰਿਆਂ ਨੂੰ ਧੁੰਦਲਾ ਕੀਤੇ ਬਿਨਾਂ ਡਿਜ਼ਾਈਨ ਨੂੰ ਦੋ, ਤਿੰਨ, ਚਾਰ ਜਾਂ ਅੱਠ ਗੁਣਾ ਵੱਡਾ ਕਰਦਾ ਹੈ।",
                      "how": "ਫੋਟੋਆਂ ਲਈ Lanczos, ਸਮੂਥ ਗ੍ਰਾਫਿਕਸ ਲਈ Bicubic ਅਤੇ ਪਿਕਸਲ ਆਰਟ ਲਈ EPX ਵਰਤੋ, ਕਿਉਂਕਿ EPX ਤਿਰਛੇ ਸਟੈਪਸ ਨੂੰ ਤਿੱਖਾ ਰੱਖਦਾ ਹੈ। Sharpen after ਵੱਡੇ ਕੀਤੇ ਨਤੀਜੇ ਵਿੱਚ ਥੋੜ੍ਹੀ ਕਰਿਸਪਨੈੱਸ ਜੋੜਦਾ ਹੈ।"
              },
              "tone": {
                      "desc": "ਆਰਟਵਰਕ ਨੂੰ ਪ੍ਰਿੰਟਿਡ ਜਾਂ ਗ੍ਰਾਫਿਕ ਲੁੱਕ ਦਿੰਦਾ ਹੈ: ਹਾਫਟੋਨੇ ਡੌਟਸ, ਡਿਊਓਟੋਨੇ, ਗ੍ਰੇਡੀਐਂਟ ਮੈਪ, ਪੈਨਸਿਲ ਸਕੈਚ, ਅਤੇ ਕਲਰ-ਬਲਾਈਂਡਨੈੱਸ ਚੈੱਕ।",
                      "how": "Halftone ਪੋਸਟਰਾਂ ਅਤੇ ਜ਼ੀਨਜ਼ ਲਈ ਤਸਵੀਰ ਨੂੰ ਬਿੰਦੀਆਂ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹੈ। Duotone ਅਤੇ gradient map ਇਸਨੂੰ ਦੋ ਰੰਗਾਂ ਨਾਲ ਦੁਬਾਰਾ ਰੰਗਦੇ ਹਨ। Pencil sketch ਕਿਨਾਰਿਆਂ ਨੂੰ ਬਣਾਉਂਦਾ ਹੈ। ਕਲਰ-ਬਲਾਈਂਡਨੈੱਸ ਚੈੱਕ ਦਿਖਾਉਂਦਾ ਹੈ ਕਿ ਪੈਲੇਟ ਇੱਕ ਕਲਰ-ਬਲਾਈਂਡ ਦੇਖਣ ਵਾਲੇ ਨੂੰ ਕਿਵੇਂ ਦਿਖਾਈ ਦਿੰਦਾ ਹੈ।"
              },
              "tile": {
                      "desc": "ਤਸਵੀਰ ਨੂੰ ਬਿਨਾਂ ਜੋੜ ਦੇ ਬਣਾਉਂਦਾ ਹੈ, ਤਾਂ ਜੋ ਇਹ ਦਿਖਾਈ ਦੇਣ ਵਾਲੇ ਜੋੜ ਤੋਂ ਬਿਨਾਂ ਦੁਹਰਾਈ ਜਾਵੇ।",
                      "how": "ਆਟੋਮੈਟਿਕ ਤਾਕਤ ਲਈ Seam blend ਨੂੰ ਜ਼ੀਰੋ 'ਤੇ ਛੱਡ ਦਿਓ। ਨਤੀਜਾ ਲਾਗੂ ਕਰੋ, ਫਿਰ ਇਸਨੂੰ ਪੈਟਰਨ ਬੈਕਗ੍ਰਾਊਂਡ, ਗੇਮ ਟੈਕਸਚਰ ਜਾਂ ਵਾਲਪੇਪਰ ਵਜੋਂ ਵਰਤੋ।"
              },
              "pal": {
                      "desc": "ਤਸਵੀਰ ਦੇ ਰੰਗ ਕੱਢਦਾ ਹੈ ਅਤੇ ਮੇਲ ਖਾਂਦੀਆਂ ਕਲਰ ਹਾਰਮਨੀਆਂ ਬਣਾਉਂਦਾ ਹੈ।",
                      "how": "ਸੈੱਟ ਕਰੋ ਕਿ ਕਿੰਨੇ ਰੰਗ ਕੱਢਣੇ ਹਨ ਅਤੇ ਟੂਲ ਤਸਵੀਰ ਨੂੰ ਪੜ੍ਹਦਾ ਹੈ। ਇੱਕ ਤਿਆਰ ਸੈੱਟ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਇੱਕ ਬੇਸ ਰੰਗ ਅਤੇ ਇੱਕ ਹਾਰਮਨੀ ਚੁਣੋ। ਕਿਸੇ ਵੀ ਸਵੈਚ 'ਤੇ ਟੈਪ ਕਰੋ ਤਾਂ ਜੋ ਇਹ ਪ੍ਰਾਇਮਰੀ ਰੰਗ ਬਣ ਜਾਵੇ, ਜਾਂ ਇੱਕ ਪ੍ਰੈੱਸ ਨਾਲ ਪੈਲੇਟ ਨੂੰ ਹਾਰਮਨੀ ਨਾਲ ਬਦਲ ਦਿਓ।"
              },
              "paper": {
                      "desc": "ਇੱਕ ਅਸਲੀ PDF ਫਾਈਲ ਬਣਾਉਂਦਾ ਹੈ, ਬਿਨਾਂ ਕਿਸੇ ਲਾਇਬ੍ਰੇਰੀ ਅਤੇ ਬਿਨਾਂ ਕਿਸੇ ਪ੍ਰਿੰਟ ਡਾਇਲਾਗ ਦੇ।",
                      "how": "ਪੇਜ ਦਾ ਸਾਈਜ਼, ਓਰੀਐਂਟੇਸ਼ਨ ਅਤੇ ਮਾਰਜਿਨ ਚੁਣੋ, ਅਤੇ ਹੋਰ ਪੇਜਾਂ ਵਜੋਂ ਵਾਧੂ ਤਸਵੀਰਾਂ ਸ਼ਾਮਲ ਕਰੋ। Download ਦਬਾਓ ਅਤੇ PDF ਤੁਹਾਡੇ ਡਿਵਾਈਸ 'ਤੇ ਸੇਵ ਹੋ ਜਾਂਦੀ ਹੈ। ਟੈਕਸਟ ਅਤੇ ਤਸਵੀਰਾਂ ਸਾਫ਼ ਰਹਿੰਦੀਆਂ ਹਨ ਕਿਉਂਕਿ ਪੇਜ ਇੱਕ ਹਾਈ-ਕੁਆਲਿਟੀ JPEG ਵਜੋਂ ਐਮਬੈੱਡ ਕੀਤਾ ਗਿਆ ਹੈ।"
              },
              "sheet": {
                      "desc": "ਇੱਕ ਐਪ ਆਈਕਨ ਸੈੱਟ ਨੂੰ ਇੱਕ ਸਿੰਗਲ .ico ਫਾਈਲ ਵਜੋਂ ਐਕਸਪੋਰਟ ਕਰਦਾ ਹੈ, ਜਾਂ ਤੁਹਾਡੀਆਂ ਦਿਖਾਈ ਦੇਣ ਵਾਲੀਆਂ ਲੇਅਰਾਂ ਤੋਂ ਬਣੀ ਇੱਕ ਸਪ੍ਰਾਈਟ ਸ਼ੀਟ।",
                      "how": "ਆਈਕਨ ਮੋਡ 16, 32, 48, 64, 128 ਅਤੇ 256 ਪਿਕਸਲ ਦੀਆਂ ਤਸਵੀਰਾਂ ਨੂੰ ਇੱਕ favicon.ico ਵਿੱਚ ਲਿਖਦਾ ਹੈ। ਸਪ੍ਰਾਈਟ ਮੋਡ ਹਰ ਦਿਖਾਈ ਦੇਣ ਵਾਲੀ ਲੇਅਰ ਨੂੰ ਇੱਕ PNG 'ਤੇ ਨਾਲ-ਨਾਲ ਰੱਖਦਾ ਹੈ, ਜੋ ਗੇਮ ਇੰਜਣ ਲਈ ਤਿਆਰ ਹੈ।"
              },
              "vector": {
                      "desc": "ਡਿਜ਼ਾਈਨ ਨੂੰ SVG ਵਜੋਂ ਐਕਸਪੋਰਟ ਕਰਦਾ ਹੈ, ਤਾਂ ਜੋ ਟੈਕਸਟ ਅਤੇ ਆਕਾਰ ਐਡਿਟ ਕਰਨ ਯੋਗ ਵੈਕਟਰ ਬਣੇ ਰਹਿਣ।",
                      "how": "ਪਿਕਸਲ ਦੇ ਕੰਮ ਨੂੰ SVG ਦੇ ਅੰਦਰ ਬੈਕਗ੍ਰਾਊਂਡ ਤਸਵੀਰ ਵਜੋਂ ਰੱਖਣ ਲਈ Include painted layers ਨੂੰ ਚਾਲੂ ਰੱਖੋ, ਜਾਂ ਸ਼ੁੱਧ ਵੈਕਟਰ ਫਾਈਲ ਲਈ ਇਸਨੂੰ ਬੰਦ ਕਰ ਦਿਓ। SVG ਨੂੰ ਕਿਸੇ ਵੀ ਬ੍ਰਾਊਜ਼ਰ, Inkscape ਜਾਂ Illustrator ਵਿੱਚ ਖੋਲ੍ਹੋ।"
              },
              "art": {
                      "desc": "ਲਿਖੇ ਹੋਏ ਵੇਰਵੇ ਤੋਂ ਅਸਲੀ ਆਰਟਵਰਕ ਬਣਾਉਂਦਾ ਹੈ।",
                      "how": "ਜੋ ਤੁਸੀਂ ਚਾਹੁੰਦੇ ਹੋ ਉਹ ਟਾਈਪ ਕਰੋ ਅਤੇ ਇੱਕ ਸਟਾਈਲ ਚੁਣੋ: ਕਲਰ ਮੈਸ਼, ਵੇਵਜ਼, ਬਾਊਹਾਊਸ ਆਕਾਰ, ਰਿੰਗਜ਼ ਜਾਂ ਗ੍ਰੇਨ ਗ੍ਰੇਡੀਐਂਟ। ਉਹੀ ਸ਼ਬਦਾਂ ਤੋਂ ਵੱਖਰੀ ਤਸਵੀਰ ਲਈ Variation ਬਦਲੋ। ਇਹ ਤੁਹਾਡੇ ਸ਼ਬਦਾਂ ਤੋਂ ਬਣਿਆ ਪ੍ਰੋਸੀਜਰਲ ਕੰਪੋਜ਼ੀਸ਼ਨ ਹੈ, ਨਾ ਕਿ ਕੋਈ ਡਾਊਨਲੋਡ ਕੀਤਾ ਗਿਆ AI ਮਾਡਲ।"
              },
              "id": {
                      "desc": "ਇੱਕ ਫੋਟੋ ਨੂੰ ਪਾਸਪੋਰਟ ਸਾਈਜ਼ ਵਿੱਚ ਕ੍ਰੌਪ ਕਰਦਾ ਹੈ ਅਤੇ ਇੱਕ ਪ੍ਰਿੰਟ ਸ਼ੀਟ 'ਤੇ ਕਈ ਕਾਪੀਆਂ ਲਗਾਉਂਦਾ ਹੈ।",
                      "how": "ਆਪਣੇ ਦੇਸ਼ ਵੱਲੋਂ ਮੰਗੇ ਗਏ ਸਾਈਜ਼, ਪ੍ਰਿੰਟ DPI ਅਤੇ ਸ਼ੀਟ 'ਤੇ ਕਿੰਨੀਆਂ ਕਾਪੀਆਂ ਫਿੱਟ ਹੁੰਦੀਆਂ ਹਨ, ਚੁਣੋ। PNG ਡਾਊਨਲੋਡ ਕਰੋ ਅਤੇ ਸਹੀ ਸਾਈਜ਼ ਦੀ ਫੋਟੋ ਲਈ ਦੱਸੇ ਗਏ DPI 'ਤੇ ਪ੍ਰਿੰਟ ਕਰੋ।"
              },
              "seal": {
                      "desc": "ਆਰਟਵਰਕ 'ਤੇ ਇੱਕ ਟਾਈਲਡ ਵਾਟਰਮਾਰਕ ਜਾਂ ਸਟੈਂਪ ਜੋੜਦਾ ਹੈ।",
                      "how": "ਆਪਣਾ ਨਾਮ ਜਾਂ ਬ੍ਰਾਂਡ ਟਾਈਪ ਕਰੋ, ਫਿਰ ਸਾਈਜ਼, ਐਂਗਲ, ਸਪੇਸਿੰਗ ਅਤੇ ਓਪੈਸਿਟੀ ਸੈੱਟ ਕਰੋ। ਓਪੈਸਿਟੀ ਨੂੰ ਘੱਟ ਰੱਖੋ ਤਾਂ ਜੋ ਤਸਵੀਰ ਪੜ੍ਹਨਯੋਗ ਰਹੇ। ਇਸਨੂੰ ਡਿਜ਼ਾਈਨ ਦੀ ਕਾਪੀ 'ਤੇ ਲਾਗੂ ਕਰੋ, ਨਾ ਕਿ ਸਿਰਫ਼ ਇੱਕ ਕਾਪੀ 'ਤੇ।"
              },
              "batch": {
                      "desc": "ਇੱਕੋ ਸਮੇਂ ਕਈ ਤਸਵੀਰਾਂ ਨੂੰ ਕਨਵਰਟ ਅਤੇ ਰੀਸਾਈਜ਼ ਕਰਦਾ ਹੈ, ਉਹ ਵੀ ਇਸ ਡਿਵਾਈਸ 'ਤੇ।",
                      "how": "ਫਾਈਲਾਂ ਚੁਣੋ, ਸਭ ਤੋਂ ਲੰਬਾ ਪਾਸਾ, ਫਾਰਮੈਟ ਅਤੇ ਕੁਆਲਿਟੀ ਸੈੱਟ ਕਰੋ, ਫਿਰ Add as new layer ਦਬਾਓ। ਹਰ ਕਨਵਰਟ ਕੀਤੀ ਫਾਈਲ ਵੱਖਰੇ ਤੌਰ 'ਤੇ ਸੇਵ ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ ਇੱਕ ਪੂਰਾ ਫੋਲਡਰ ਇੱਕੋ ਵਾਰ ਵਿੱਚ ਤਿਆਰ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।"
              }
      },
      manual: "@@TITLE\nNirbhar ਮੈਨੂਅਲ\n@@INTRO\nNirbhar ਦਾ ਮਤਲਬ ਹੈ ਆਤਮ-Nirbhar। ਇਹ ਪਿਕਸਲ ਸਟੂਡੀਓ ਵਿੱਚ ਬਣਿਆ ਆਫਲਾਈਨ ਟੂਲਬਾਕਸ ਹੈ: ਤੇਰ੍ਹਾਂ ਟੂਲ ਜੋ ਬੈਕਗ੍ਰਾਊਂਡ ਹਟਾਉਂਦੇ ਹਨ, ਫੋਟੋ ਦੀ ਕੁਆਲਿਟੀ ਸੁਧਾਰਦੇ ਹਨ, ਸਾਈਜ਼ ਵਧਾਉਂਦੇ ਹਨ, PDF ਬਣਾਉਂਦੇ ਹਨ, ਐਪ ਆਈਕਨ ਬਣਾਉਂਦੇ ਹਨ, ਜਨਰੇਟਿਵ ਆਰਟ ਬਣਾਉਂਦੇ ਹਨ ਅਤੇ ਹੋਰ ਬਹੁਤ ਕੁਝ। ਸਭ ਕੁਝ ਤੁਹਾਡੇ ਆਪਣੇ ਡਿਵਾਈਸ 'ਤੇ ਇਸ ਪੇਜ ਦੁਆਰਾ ਕੈਲਕੁਲੇਟ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਇਸ ਵਿੱਚ ਕੋਈ ਅਪਲੋਡ, ਕੋਈ ਖਾਤਾ, ਕੋਈ API key, ਕੋਈ ਮਾਡਲ ਡਾਊਨਲੋਡ ਅਤੇ ਕੋਈ ਇੰਟਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਸ਼ਾਮਲ ਨਹੀਂ ਹੈ।\n@@START_H\nਚਾਰ ਕਦਮਾਂ ਵਿੱਚ ਸ਼ੁਰੂ ਕਰੋ\n@@START\n- ਸੱਜੇ ਪਾਸੇ Nirbhar ਟੈਬ ਖੋਲ੍ਹੋ (ਫੋਨ 'ਤੇ, ਹੇਠਾਂ ਵਾਲੀ ਸ਼ੀਟ 'ਤੇ ਟੈਪ ਕਰੋ)।\n- ਇੱਕ ਟੂਲ ਚੁਣੋ। ਇੱਕ ਪ੍ਰੀਵਿਊ ਅਤੇ ਆਪਣੀਆਂ ਸੈਟਿੰਗਾਂ ਵਾਲਾ ਇੱਕ ਡਾਇਲਾਗ ਖੁੱਲ੍ਹਦਾ ਹੈ।\n- ਜਦੋਂ ਤੱਕ ਪ੍ਰੀਵਿਊ ਸਹੀ ਨਹੀਂ ਲੱਗਦਾ, ਸੈਟਿੰਗਾਂ ਬਦਲੋ; ਪ੍ਰੀਵਿਊ ਇੱਕ ਛੋਟਾ ਰੂਪ ਹੈ, ਅਸਲੀ ਕੰਮ ਪੂਰੇ ਸਾਈਜ਼ 'ਤੇ ਹੁੰਦਾ ਹੈ।\n- Add as new layer ਦਬਾਓ। ਤੁਹਾਡਾ ਅਸਲੀ ਕੰਮ ਬਿਲਕੁਲ ਉਵੇਂ ਹੀ ਰਹਿੰਦਾ ਹੈ, ਅਤੇ ਨਤੀਜਾ ਇੱਕ ਨਵੀਂ ਲੇਅਰ ਬਣ ਜਾਂਦਾ ਹੈ ਜਿਸਨੂੰ ਤੁਸੀਂ ਐਡਿਟ ਕਰਨਾ ਜਾਰੀ ਰੱਖ ਸਕਦੇ ਹੋ।\n@@TOOLS_H\nਤੇਰ੍ਹਾਂ ਟੂਲ\n@@TOOL_CUT\nਫੋਟੋ, ਲੋਗੋ ਜਾਂ ਸਕੈਨ ਵਿੱਚੋਂ ਬੈਕਗ੍ਰਾਊਂਡ ਹਟਾਉਂਦਾ ਹੈ ਅਤੇ ਮੁੱਖ ਵਿਸ਼ੇ ਨੂੰ ਰੱਖਦਾ ਹੈ।\n@@HOW_CUT\nਚਾਰ ਕੋਨਿਆਂ ਨੂੰ ਸੈਂਪਲ ਕਰਨ ਲਈ Auto ਚੁਣੋ, ਜਾਂ ਹਟਾਉਣ ਲਈ ਕੋਈ ਰੰਗ ਚੁਣੋ। ਜਦੋਂ ਕੁਝ ਬਚਿਆ ਰਹਿ ਜਾਵੇ ਤਾਂ Tolerance ਵਧਾਓ, ਅਤੇ ਜਦੋਂ ਮੁੱਖ ਵਿਸ਼ਾ ਕੱਟਿਆ ਜਾ ਰਿਹਾ ਹੋਵੇ ਤਾਂ ਇਸਨੂੰ ਘਟਾਓ। Edge soften ਵਾਲਾਂ ਅਤੇ ਸਾਫ਼ ਕਿਨਾਰਿਆਂ ਨੂੰ ਸਾਫ਼ ਰੱਖਦਾ ਹੈ, ਅਤੇ Clean colour fringes ਰੰਗੀਨ ਪ੍ਰਭਾਵ ਨੂੰ ਹਟਾਉਂਦਾ ਹੈ।\n@@TOOL_CLEAR\nਫੋਟੋ ਨੂੰ ਸੁਧਾਰਦਾ ਹੈ: ਵ੍ਹਾਈਟ ਬੈਲੇਂਸ, ਲੈਵਲ, ਨੌਇਜ਼, ਧੁੰਦ, ਕਲੈਰਿਟੀ ਅਤੇ ਸ਼ਾਰਪਨਿੰਗ।\n@@HOW_CLEAR\nਇੱਕ-ਪ੍ਰੈੱਸ ਵਾਲੇ ਫਿਕਸ ਲਈ Automatic recipe ਨੂੰ ਚਾਲੂ ਛੱਡੋ ਜੋ ਫੋਟੋ ਨੂੰ ਪੜ੍ਹਦਾ ਹੈ ਅਤੇ ਖੁਦ ਤਾਕਤ ਚੁਣਦਾ ਹੈ। ਹਰ ਸਟੈਪ ਨੂੰ ਹੱਥ ਨਾਲ ਸੈੱਟ ਕਰਨ ਲਈ ਇਸਨੂੰ ਬੰਦ ਕਰ ਦਿਓ। ਪ੍ਰਭਾਵ ਲਈ Clarity ਅਤੇ ਅੰਤ ਵਿੱਚ Sharpen ਵਰਤੋ।\n@@TOOL_ZOOM\nਕਿਨਾਰਿਆਂ ਨੂੰ ਧੁੰਦਲਾ ਕੀਤੇ ਬਿਨਾਂ ਡਿਜ਼ਾਈਨ ਨੂੰ ਦੋ, ਤਿੰਨ, ਚਾਰ ਜਾਂ ਅੱਠ ਗੁਣਾ ਵੱਡਾ ਕਰਦਾ ਹੈ।\n@@HOW_ZOOM\nਫੋਟੋਆਂ ਲਈ Lanczos, ਸਮੂਥ ਗ੍ਰਾਫਿਕਸ ਲਈ Bicubic ਅਤੇ ਪਿਕਸਲ ਆਰਟ ਲਈ EPX ਵਰਤੋ, ਕਿਉਂਕਿ EPX ਤਿਰਛੇ ਸਟੈਪਸ ਨੂੰ ਤਿੱਖਾ ਰੱਖਦਾ ਹੈ। Sharpen after ਵੱਡੇ ਕੀਤੇ ਨਤੀਜੇ ਵਿੱਚ ਥੋੜ੍ਹੀ ਕਰਿਸਪਨੈੱਸ ਜੋੜਦਾ ਹੈ।\n@@TOOL_TONE\nਆਰਟਵਰਕ ਨੂੰ ਪ੍ਰਿੰਟਿਡ ਜਾਂ ਗ੍ਰਾਫਿਕ ਲੁੱਕ ਦਿੰਦਾ ਹੈ: ਹਾਫਟੋਨੇ ਡੌਟਸ, ਡਿਊਓਟੋਨੇ, ਗ੍ਰੇਡੀਐਂਟ ਮੈਪ, ਪੈਨਸਿਲ ਸਕੈਚ, ਅਤੇ ਕਲਰ-ਬਲਾਈਂਡਨੈੱਸ ਚੈੱਕ।\n@@HOW_TONE\nHalftone ਪੋਸਟਰਾਂ ਅਤੇ ਜ਼ੀਨਜ਼ ਲਈ ਤਸਵੀਰ ਨੂੰ ਬਿੰਦੀਆਂ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹੈ। Duotone ਅਤੇ gradient map ਇਸਨੂੰ ਦੋ ਰੰਗਾਂ ਨਾਲ ਦੁਬਾਰਾ ਰੰਗਦੇ ਹਨ। Pencil sketch ਕਿਨਾਰਿਆਂ ਨੂੰ ਬਣਾਉਂਦਾ ਹੈ। ਕਲਰ-ਬਲਾਈਂਡਨੈੱਸ ਚੈੱਕ ਦਿਖਾਉਂਦਾ ਹੈ ਕਿ ਪੈਲੇਟ ਇੱਕ ਕਲਰ-ਬਲਾਈਂਡ ਦੇਖਣ ਵਾਲੇ ਨੂੰ ਕਿਵੇਂ ਦਿਖਾਈ ਦਿੰਦਾ ਹੈ।\n@@TOOL_TILE\nਤਸਵੀਰ ਨੂੰ ਬਿਨਾਂ ਜੋੜ ਦੇ ਬਣਾਉਂਦਾ ਹੈ, ਤਾਂ ਜੋ ਇਹ ਦਿਖਾਈ ਦੇਣ ਵਾਲੇ ਜੋੜ ਤੋਂ ਬਿਨਾਂ ਦੁਹਰਾਈ ਜਾਵੇ।\n@@HOW_TILE\nਆਟੋਮੈਟਿਕ ਤਾਕਤ ਲਈ Seam blend ਨੂੰ ਜ਼ੀਰੋ 'ਤੇ ਛੱਡ ਦਿਓ। ਨਤੀਜਾ ਲਾਗੂ ਕਰੋ, ਫਿਰ ਇਸਨੂੰ ਪੈਟਰਨ ਬੈਕਗ੍ਰਾਊਂਡ, ਗੇਮ ਟੈਕਸਚਰ ਜਾਂ ਵਾਲਪੇਪਰ ਵਜੋਂ ਵਰਤੋ।\n@@TOOL_PAL\nਤਸਵੀਰ ਦੇ ਰੰਗ ਕੱਢਦਾ ਹੈ ਅਤੇ ਮੇਲ ਖਾਂਦੀਆਂ ਕਲਰ ਹਾਰਮਨੀਆਂ ਬਣਾਉਂਦਾ ਹੈ।\n@@HOW_PAL\nਸੈੱਟ ਕਰੋ ਕਿ ਕਿੰਨੇ ਰੰਗ ਕੱਢਣੇ ਹਨ ਅਤੇ ਟੂਲ ਤਸਵੀਰ ਨੂੰ ਪੜ੍ਹਦਾ ਹੈ। ਇੱਕ ਤਿਆਰ ਸੈੱਟ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਇੱਕ ਬੇਸ ਰੰਗ ਅਤੇ ਇੱਕ ਹਾਰਮਨੀ ਚੁਣੋ। ਕਿਸੇ ਵੀ ਸਵੈਚ 'ਤੇ ਟੈਪ ਕਰੋ ਤਾਂ ਜੋ ਇਹ ਪ੍ਰਾਇਮਰੀ ਰੰਗ ਬਣ ਜਾਵੇ, ਜਾਂ ਇੱਕ ਪ੍ਰੈੱਸ ਨਾਲ ਪੈਲੇਟ ਨੂੰ ਹਾਰਮਨੀ ਨਾਲ ਬਦਲ ਦਿਓ।\n@@TOOL_PAPER\nਇੱਕ ਅਸਲੀ PDF ਫਾਈਲ ਬਣਾਉਂਦਾ ਹੈ, ਬਿਨਾਂ ਕਿਸੇ ਲਾਇਬ੍ਰੇਰੀ ਅਤੇ ਬਿਨਾਂ ਕਿਸੇ ਪ੍ਰਿੰਟ ਡਾਇਲਾਗ ਦੇ।\n@@HOW_PAPER\nਪੇਜ ਦਾ ਸਾਈਜ਼, ਓਰੀਐਂਟੇਸ਼ਨ ਅਤੇ ਮਾਰਜਿਨ ਚੁਣੋ, ਅਤੇ ਹੋਰ ਪੇਜਾਂ ਵਜੋਂ ਵਾਧੂ ਤਸਵੀਰਾਂ ਸ਼ਾਮਲ ਕਰੋ। Download ਦਬਾਓ ਅਤੇ PDF ਤੁਹਾਡੇ ਡਿਵਾਈਸ 'ਤੇ ਸੇਵ ਹੋ ਜਾਂਦੀ ਹੈ। ਟੈਕਸਟ ਅਤੇ ਤਸਵੀਰਾਂ ਸਾਫ਼ ਰਹਿੰਦੀਆਂ ਹਨ ਕਿਉਂਕਿ ਪੇਜ ਇੱਕ ਹਾਈ-ਕੁਆਲਿਟੀ JPEG ਵਜੋਂ ਐਮਬੈੱਡ ਕੀਤਾ ਗਿਆ ਹੈ।\n@@TOOL_SHEET\nਇੱਕ ਐਪ ਆਈਕਨ ਸੈੱਟ ਨੂੰ ਇੱਕ ਸਿੰਗਲ .ico ਫਾਈਲ ਵਜੋਂ ਐਕਸਪੋਰਟ ਕਰਦਾ ਹੈ, ਜਾਂ ਤੁਹਾਡੀਆਂ ਦਿਖਾਈ ਦੇਣ ਵਾਲੀਆਂ ਲੇਅਰਾਂ ਤੋਂ ਬਣੀ ਇੱਕ ਸਪ੍ਰਾਈਟ ਸ਼ੀਟ।\n@@HOW_SHEET\nਆਈਕਨ ਮੋਡ 16, 32, 48, 64, 128 ਅਤੇ 256 ਪਿਕਸਲ ਦੀਆਂ ਤਸਵੀਰਾਂ ਨੂੰ ਇੱਕ favicon.ico ਵਿੱਚ ਲਿਖਦਾ ਹੈ। ਸਪ੍ਰਾਈਟ ਮੋਡ ਹਰ ਦਿਖਾਈ ਦੇਣ ਵਾਲੀ ਲੇਅਰ ਨੂੰ ਇੱਕ PNG 'ਤੇ ਨਾਲ-ਨਾਲ ਰੱਖਦਾ ਹੈ, ਜੋ ਗੇਮ ਇੰਜਣ ਲਈ ਤਿਆਰ ਹੈ।\n@@TOOL_VECTOR\nਡਿਜ਼ਾਈਨ ਨੂੰ SVG ਵਜੋਂ ਐਕਸਪੋਰਟ ਕਰਦਾ ਹੈ, ਤਾਂ ਜੋ ਟੈਕਸਟ ਅਤੇ ਆਕਾਰ ਐਡਿਟ ਕਰਨ ਯੋਗ ਵੈਕਟਰ ਬਣੇ ਰਹਿਣ।\n@@HOW_VECTOR\nਪਿਕਸਲ ਦੇ ਕੰਮ ਨੂੰ SVG ਦੇ ਅੰਦਰ ਬੈਕਗ੍ਰਾਊਂਡ ਤਸਵੀਰ ਵਜੋਂ ਰੱਖਣ ਲਈ Include painted layers ਨੂੰ ਚਾਲੂ ਰੱਖੋ, ਜਾਂ ਸ਼ੁੱਧ ਵੈਕਟਰ ਫਾਈਲ ਲਈ ਇਸਨੂੰ ਬੰਦ ਕਰ ਦਿਓ। SVG ਨੂੰ ਕਿਸੇ ਵੀ ਬ੍ਰਾਊਜ਼ਰ, Inkscape ਜਾਂ Illustrator ਵਿੱਚ ਖੋਲ੍ਹੋ।\n@@TOOL_ART\nਲਿਖੇ ਹੋਏ ਵੇਰਵੇ ਤੋਂ ਅਸਲੀ ਆਰਟਵਰਕ ਬਣਾਉਂਦਾ ਹੈ।\n@@HOW_ART\nਜੋ ਤੁਸੀਂ ਚਾਹੁੰਦੇ ਹੋ ਉਹ ਟਾਈਪ ਕਰੋ ਅਤੇ ਇੱਕ ਸਟਾਈਲ ਚੁਣੋ: ਕਲਰ ਮੈਸ਼, ਵੇਵਜ਼, ਬਾਊਹਾਊਸ ਆਕਾਰ, ਰਿੰਗਜ਼ ਜਾਂ ਗ੍ਰੇਨ ਗ੍ਰੇਡੀਐਂਟ। ਉਹੀ ਸ਼ਬਦਾਂ ਤੋਂ ਵੱਖਰੀ ਤਸਵੀਰ ਲਈ Variation ਬਦਲੋ। ਇਹ ਤੁਹਾਡੇ ਸ਼ਬਦਾਂ ਤੋਂ ਬਣਿਆ ਪ੍ਰੋਸੀਜਰਲ ਕੰਪੋਜ਼ੀਸ਼ਨ ਹੈ, ਨਾ ਕਿ ਕੋਈ ਡਾਊਨਲੋਡ ਕੀਤਾ ਗਿਆ AI ਮਾਡਲ।\n@@TOOL_ID\nਇੱਕ ਫੋਟੋ ਨੂੰ ਪਾਸਪੋਰਟ ਸਾਈਜ਼ ਵਿੱਚ ਕ੍ਰੌਪ ਕਰਦਾ ਹੈ ਅਤੇ ਇੱਕ ਪ੍ਰਿੰਟ ਸ਼ੀਟ 'ਤੇ ਕਈ ਕਾਪੀਆਂ ਲਗਾਉਂਦਾ ਹੈ।\n@@HOW_ID\nਆਪਣੇ ਦੇਸ਼ ਵੱਲੋਂ ਮੰਗੇ ਗਏ ਸਾਈਜ਼, ਪ੍ਰਿੰਟ DPI ਅਤੇ ਸ਼ੀਟ 'ਤੇ ਕਿੰਨੀਆਂ ਕਾਪੀਆਂ ਫਿੱਟ ਹੁੰਦੀਆਂ ਹਨ, ਚੁਣੋ। PNG ਡਾਊਨਲੋਡ ਕਰੋ ਅਤੇ ਸਹੀ ਸਾਈਜ਼ ਦੀ ਫੋਟੋ ਲਈ ਦੱਸੇ ਗਏ DPI 'ਤੇ ਪ੍ਰਿੰਟ ਕਰੋ।\n@@TOOL_SEAL\nਆਰਟਵਰਕ 'ਤੇ ਇੱਕ ਟਾਈਲਡ ਵਾਟਰਮਾਰਕ ਜਾਂ ਸਟੈਂਪ ਜੋੜਦਾ ਹੈ।\n@@HOW_SEAL\nਆਪਣਾ ਨਾਮ ਜਾਂ ਬ੍ਰਾਂਡ ਟਾਈਪ ਕਰੋ, ਫਿਰ ਸਾਈਜ਼, ਐਂਗਲ, ਸਪੇਸਿੰਗ ਅਤੇ ਓਪੈਸਿਟੀ ਸੈੱਟ ਕਰੋ। ਓਪੈਸਿਟੀ ਨੂੰ ਘੱਟ ਰੱਖੋ ਤਾਂ ਜੋ ਤਸਵੀਰ ਪੜ੍ਹਨਯੋਗ ਰਹੇ। ਇਸਨੂੰ ਡਿਜ਼ਾਈਨ ਦੀ ਕਾਪੀ 'ਤੇ ਲਾਗੂ ਕਰੋ, ਨਾ ਕਿ ਸਿਰਫ਼ ਇੱਕ ਕਾਪੀ 'ਤੇ।\n@@TOOL_BATCH\nਇੱਕੋ ਸਮੇਂ ਕਈ ਤਸਵੀਰਾਂ ਨੂੰ ਕਨਵਰਟ ਅਤੇ ਰੀਸਾਈਜ਼ ਕਰਦਾ ਹੈ, ਉਹ ਵੀ ਇਸ ਡਿਵਾਈਸ 'ਤੇ।\n@@HOW_BATCH\nਫਾਈਲਾਂ ਚੁਣੋ, ਸਭ ਤੋਂ ਲੰਬਾ ਪਾਸਾ, ਫਾਰਮੈਟ ਅਤੇ ਕੁਆਲਿਟੀ ਸੈੱਟ ਕਰੋ, ਫਿਰ Add as new layer ਦਬਾਓ। ਹਰ ਕਨਵਰਟ ਕੀਤੀ ਫਾਈਲ ਵੱਖਰੇ ਤੌਰ 'ਤੇ ਸੇਵ ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ ਇੱਕ ਪੂਰਾ ਫੋਲਡਰ ਇੱਕੋ ਵਾਰ ਵਿੱਚ ਤਿਆਰ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।\n@@TIPS_H\nਟਿਪਸ\n@@TIPS\n- ਹਰ ਟੂਲ ਇੱਕ ਨਵੀਂ ਲੇਅਰ ਜੋੜਦਾ ਹੈ, ਇਸ ਲਈ ਤੁਸੀਂ ਲੇਅਰ ਨੂੰ ਲੁਕਾ ਕੇ ਇਸਦੀ ਅਸਲੀ ਨਾਲ ਤੁਲਨਾ ਕਰ ਸਕਦੇ ਹੋ।\n- ਸਪੀਡ ਲਈ ਪ੍ਰੀਵਿਊ ਇੱਕ ਛੋਟਾ ਰੂਪ ਹੈ; ਤੁਸੀਂ ਜੋ ਨਤੀਜਾ ਲਾਗੂ ਕਰਦੇ ਹੋ ਉਹ ਹਮੇਸ਼ਾ ਪੂਰੇ ਰੈਜ਼ੋਲਿਊਸ਼ਨ ਦਾ ਹੁੰਦਾ ਹੈ।\n- Cut, Clear, Zoom ਅਤੇ ID ਵੱਖਰਾ ਸਾਈਜ਼ ਬਣਾ ਸਕਦੇ ਹਨ। ਉਹਨਾਂ ਲਈ Open as new document ਵਰਤੋ।\n- ਜੇਕਰ ਕੋਈ ਟੂਲ ਬਹੁਤ ਵੱਡੇ ਕੈਨਵਸ 'ਤੇ ਹੌਲੀ ਲੱਗਦਾ ਹੈ, ਤਾਂ ਇਸਨੂੰ ਪੂਰੇ ਡਿਜ਼ਾਈਨ ਦੀ ਬਜਾਏ ਐਕਟਿਵ ਲੇਅਰ 'ਤੇ ਚਲਾਓ।\n- ਇੱਥੇ ਸਭ ਕੁਝ ਇੰਟਰਨੈੱਟ ਬੰਦ ਹੋਣ 'ਤੇ ਵੀ ਕੰਮ ਕਰਦਾ ਹੈ, ਜਿਸ ਵਿੱਚ ਮੈਨੂਅਲ ਵੀ ਸ਼ਾਮਲ ਹੈ।\n@@OFFLINE\nਇਸ ਪੈਨਲ ਵਿੱਚ ਕੁਝ ਵੀ ਇੰਟਰਨੈੱਟ ਦੀ ਵਰਤੋਂ ਨਹੀਂ ਕਰਦਾ। ਫੌਂਟ, ਆਈਕਨ, ਟੂਲ ਅਤੇ ਮੈਨੂਅਲ ਸਾਰੇ ਐਪ ਦੇ ਨਾਲ ਸਟੋਰ ਕੀਤੇ ਗਏ ਹਨ, ਇਸ ਲਈ ਇਹ ਟ੍ਰੇਨ ਵਿੱਚ, ਪਿੰਡ ਵਿੱਚ ਜਾਂ ਨੈੱਟਵਰਕ ਬੰਦ ਹੋਣ ਦੌਰਾਨ ਵੀ ਕੰਮ ਕਰਦਾ ਰਹਿੰਦਾ ਹੈ।"
    }
  }
};
