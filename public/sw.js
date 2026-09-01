// Unlock Her Tech Service Worker
const CACHE_NAME = 'uht-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE_URLS);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

function shouldBypassRequest(url) {
  const isDevHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const isDevInternal = url.pathname.startsWith('/@') || url.pathname.includes('node_modules');
  const isCrossOrigin = url.origin !== self.location.origin;

  return isDevHost || isDevInternal || isCrossOrigin;
}

async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse?.status === 200) {
      const copy = networkResponse.clone();
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, copy);
    }
    return networkResponse;
  } catch (err) {
    console.debug('[SW] Navigation fetch failed, serving cached fallback:', err);
    const cached = await caches.match(request);
    return cached || (await caches.match('/'));
  }
}

async function handleAssetRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  if (networkResponse?.status === 200 && networkResponse.type === 'basic') {
    const copy = networkResponse.clone();
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, copy);
  }
  return networkResponse;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (shouldBypassRequest(url)) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  event.respondWith(handleAssetRequest(request));
});
