// Service worker: la app funciona sin internet después de la primera visita.
const CACHE = 'calendario-uc-v5';
const SHELL = [
  './', 'index.html', 'events.json', 'ics-core.js', 'fonts.css', 'manifest.webmanifest',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
  'icons/icon-maskable-512.png', 'icons/apple-touch-icon-180.png',
  'fonts/fraunces-var-latin.woff2', 'fonts/fraunces-var-latin-ext.woff2',
  'fonts/inter-var-latin.woff2', 'fonts/inter-var-latin-ext.woff2',
  'fonts/ibm-plex-mono-400-latin.woff2', 'fonts/ibm-plex-mono-400-latin-ext.woff2',
  'fonts/ibm-plex-mono-500-latin.woff2', 'fonts/ibm-plex-mono-500-latin-ext.woff2',
  'fonts/ibm-plex-mono-600-latin.woff2', 'fonts/ibm-plex-mono-600-latin-ext.woff2',
  'fonts/ibm-plex-mono-700-latin.woff2', 'fonts/ibm-plex-mono-700-latin-ext.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function fromNetwork(req) {
  const res = await fetch(req);
  if (res.ok) (await caches.open(CACHE)).put(req, res.clone());
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  // La página y los datos: primero la red (para recibir actualizaciones), si no hay, caché.
  if (req.mode === 'navigate' || url.pathname.endsWith('events.json')) {
    e.respondWith(
      fromNetwork(req).catch(async () =>
        (await caches.match(req, { ignoreSearch: true })) || caches.match('index.html'))
    );
    return;
  }
  // Lo demás (fuentes, íconos, js, css): caché al instante y se refresca en segundo plano.
  e.respondWith(
    caches.match(req).then(hit => {
      const refresh = fromNetwork(req).catch(() => hit);
      return hit || refresh;
    })
  );
});
