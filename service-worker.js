self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("gedra").then(cache => cache.add("/"))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match("/"))
  );
});