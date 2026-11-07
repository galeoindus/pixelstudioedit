/* Pixel Studio Edit — offline shell.
   Cache-first for the app shell, network-first for everything else.
   The Nirbhar toolkit and the self-hosted fonts are part of the shell, so the
   editor keeps working with the network switched off. */
const VERSION = 'pse-v5';
const SHELL = [
  './',
  'index.html',
  'css/style.css',
  'js/core.js',
  'js/nirbhar.js',
  'js/nirbhar-i18n.js',
  'js/nirbhar-ui.js',
  'js/nirbhar-worker.js',
  'js/app.js',
  'js/effects-worker.js',
  'fonts/fonts.css',
  'fonts/press-start-2p-400.woff2',
  'fonts/bungee-400.woff2',
  'fonts/lobster-400.woff2',
  'fonts/pacifico-400.woff2',
  'fonts/anton-400.woff2',
  'fonts/righteous-400.woff2',
  'fonts/monoton-400.woff2',
  'fonts/orbitron-700.woff2',
  'fonts/bebas-neue-400.woff2',
  'fonts/caveat-700.woff2',
  'fonts/fredoka-600.woff2',
  'fonts/cinzel-700.woff2',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* The shell, as absolute URLs, so a request can be matched against it. */
const SHELL_URLS = new Set(SHELL.map((path) => new URL(path, self.location.href).href));

function store(req, res) {
  const copy = res.clone();
  caches.open(VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
  return res;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  /* A page navigation is never answered from the cache first: index.html is in
     the shell, and serving the cached copy would keep an old editor on screen
     after a deploy until the cache name changed. */
  const navigation = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  /* The rest of the shell is cache-first: it is the copy that has to be there
     offline. */
  if (!navigation && SHELL_URLS.has(url.href)) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => store(req, res)).catch(() => caches.match('index.html')))
    );
    return;
  }

  /* Everything else is network-first, so a redeploy is picked up on the next
     visit instead of being masked by a cached copy. A navigation falls back to
     the cached shell, then to index.html, so offline still opens the editor. */
  event.respondWith(
    fetch(req)
      .then((res) => store(req, res))
      .catch(() => caches.match(req).then((hit) => hit || caches.match('index.html')))
  );
});
