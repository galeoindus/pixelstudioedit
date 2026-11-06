# Bundled fonts

Pixel Studio Edit ships its typefaces instead of loading them from a font CDN,
so the editor looks the same with the network switched off. Each file here is the
Latin subset of the family, taken from the publisher's own release and served
under the SIL Open Font License 1.1.

| File | Family | Weight | Licence |
| --- | --- | --- | --- |
| `press-start-2p-400.woff2` | Press Start 2P | 400 | SIL OFL 1.1 |
| `bungee-400.woff2` | Bungee | 400 | SIL OFL 1.1 |
| `lobster-400.woff2` | Lobster | 400 | SIL OFL 1.1 |
| `pacifico-400.woff2` | Pacifico | 400 | SIL OFL 1.1 |
| `anton-400.woff2` | Anton | 400 | SIL OFL 1.1 |
| `righteous-400.woff2` | Righteous | 400 | SIL OFL 1.1 |
| `monoton-400.woff2` | Monoton | 400 | SIL OFL 1.1 |
| `orbitron-700.woff2` | Orbitron | 700 | SIL OFL 1.1 |
| `bebas-neue-400.woff2` | Bebas Neue | 400 | SIL OFL 1.1 |
| `caveat-700.woff2` | Caveat | 700 | SIL OFL 1.1 |
| `fredoka-600.woff2` | Fredoka | 600 | SIL OFL 1.1 |
| `cinzel-700.woff2` | Cinzel | 700 | SIL OFL 1.1 |

`fonts.css` declares them with `font-display: swap`. System faces (Impact,
Georgia, Courier, Arial) are used as the fallbacks, so a missing file degrades to
a system font rather than to invisible text.

The OFL allows bundling and redistribution, including in commercial work; it
requires that the fonts are not sold on their own and that derivative font files
are not renamed while keeping the original name. Keep this file with the fonts if
you copy them elsewhere.
