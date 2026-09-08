/* Cache only public assets. Never cache authenticated HTML, RSC, API or sales. */
const CACHE = 'urban-street-static-v1';
const ASSETS = ['/offline.html', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('urban-street-static-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () =>
      (await caches.match('/offline.html')) || new Response('Offline', { status: 503 })
    ));
    return;
  }
  if (!ASSETS.includes(url.pathname) && !url.pathname.startsWith('/_next/static/')) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
      await cache.put(request, response.clone());
      const keys = await cache.keys();
      const runtime = keys.filter(key => new URL(key.url).pathname.startsWith('/_next/static/'));
      for (const key of runtime.slice(0, Math.max(0, runtime.length - 100))) await cache.delete(key);
    }
    return response;
  })());
});
