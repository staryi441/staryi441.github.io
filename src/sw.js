/**
 * Service Worker for Staryi Dev Hub
 * Provides offline caching for static assets and pages
 */

const CACHE_NAME = 'staryi-hub-v1';
const STATIC_ASSETS = [
  '/',
  '/assets/css/main.css',
  '/manifest.json',
  '/favicon.svg',
  '/favicon-192.png',
  '/favicon-512.png',
  '/apple-touch-icon.png',
];

const CACHE_STRATEGIES = {
  // Cache First - for static assets (CSS, JS, images)
  cacheFirst: ['/assets/', '/favicon', '/manifest.json'],
  // Network First - for HTML pages (always fresh content)
  networkFirst: ['/'],
  // Stale While Revalidate - for API calls if any
  staleWhileRevalidate: [],
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (fonts, analytics, etc.)
  if (url.origin !== location.origin) return;

  // Determine strategy
  let strategy = 'networkFirst';
  for (const [key, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some((pattern) => url.pathname.startsWith(pattern))) {
      strategy = key;
      break;
    }
  }

  switch (strategy) {
    case 'cacheFirst':
      event.respondWith(cacheFirst(request));
      break;
    case 'staleWhileRevalidate':
      event.respondWith(staleWhileRevalidate(request));
      break;
    case 'networkFirst':
    default:
      event.respondWith(networkFirst(request));
      break;
  }
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    // Fallback for HTML pages
    if (request.headers.get('accept').includes('text/html')) {
      return cache.match('/');
    }
    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });

  return cached || fetchPromise;
}

// Background sync for future enhancement
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

async function syncForms() {
  // Placeholder for future form submission sync
  console.log('Background sync triggered');
}