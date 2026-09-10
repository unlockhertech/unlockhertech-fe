// Unlock Her Tech Service Worker - Cleanup & Self-Unregistration
// Disables service worker interceptors to prevent Chrome cross-world modulepreload mismatches.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        if ('caches' in self) {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
        }
      } catch (err) {
        console.debug('[SW] Cache clearance error:', err);
      }
      try {
        await self.registration.unregister();
      } catch (err) {
        console.debug('[SW] Unregister error:', err);
      }
    })()
  );
});
