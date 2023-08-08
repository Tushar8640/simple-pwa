importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.3.0/workbox-sw.js");

const CACHE_NAME = "my-cache";
const urlsToCache = [ "/nature.webp", "index.html"];

workbox.routing.registerRoute(
  ({ request }) => urlsToCache.includes(request.url),
  new workbox.strategies.CacheFirst({
    cacheName: CACHE_NAME,
  })
);

workbox.routing.registerRoute(
  ({ request }) => true,
  new workbox.strategies.NetworkFirst()
);

self.addEventListener("activate", (event) => {
  const cacheAllowlist = [CACHE_NAME]; // Cache names to keep

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheAllowlist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
