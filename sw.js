// Service Worker для Aurora 38
// Версия кэша - изменяйте при обновлении ресурсов
const CACHE_VERSION = 'aurora-v1';
const CACHE_NAME = `${CACHE_VERSION}::static`;

// Критические ресурсы для кэширования
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/analytics.js',
  '/cookie-consent.js',
  '/cookie-consent.css',
  '/images/logo/logo.png',
  '/images/favicon.svg'
];

// Устанавливаем Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching critical assets');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Активируем Service Worker и удаляем старые кэши
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Обрабатываем запросы
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Пропускаем внешние запросы (аналитика, формы)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Пропускаем запросы к API
  if (url.pathname.includes('/api/')) {
    return;
  }

  // Стратегия: Cache First для статических ресурсов
  event.respondWith(
    caches.match(request)
      .then((cached) => {
        // Если есть в кэше - возвращаем
        if (cached) {
          console.log('[SW] Serving from cache:', request.url);
          return cached;
        }

        // Иначе загружаем из сети и кэшируем
        return fetch(request)
          .then((response) => {
            // Проверяем что ответ валидный
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Клонируем ответ (можно использовать только 1 раз)
            const responseToCache = response.clone();

            // Кэшируем только GET запросы для HTML, CSS, JS, изображений
            if (request.method === 'GET' && 
                (request.url.endsWith('.html') || 
                 request.url.endsWith('.css') || 
                 request.url.endsWith('.js') ||
                 request.url.includes('/images/'))) {
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                  console.log('[SW] Cached new resource:', request.url);
                });
            }

            return response;
          })
          .catch((error) => {
            console.error('[SW] Fetch failed:', error);
            
            // Возвращаем базовую offline страницу если есть
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});
