const CACHE_NAME = 'gedra-v1';
// Lista de archivos que se guardarán en el celular
const ASSETS = [
  'index.html',
  'manifest.json',
  'sw.js',
  'GEDRA.jpg',
  'https://cdn.tailwindcss.com'
];

// Instalación: Guarda los archivos en el caché del navegador
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('GEDRA: Archivos guardados para uso offline');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activación: Limpia versiones antiguas si haces cambios futuros
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia de carga: Intenta cargar desde el caché primero, si no hay, busca en internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      // Si falla todo (estás offline y no hay caché), carga el index
      return caches.match('index.html');
    })
  );
});