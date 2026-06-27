// TrainerDex Service Worker
// Strategy:
//   - Static assets (sprites, icons, fonts): cache-first
//   - App pages:                              network-first with offline fallback
//   - API routes / external URLs:             network-only

const CACHE_VERSION = "v1";
const STATIC_CACHE = `trainerdex-static-${CACHE_VERSION}`;
const PAGE_CACHE   = `trainerdex-pages-${CACHE_VERSION}`;

// Pages to pre-cache on install so the app works offline immediately
const PRECACHE_PAGES = ["/", "/events", "/raids", "/pokemon", "/news"];

// Static asset path prefixes that should be cached aggressively
const STATIC_PREFIXES = ["/sprites/", "/icons/", "/graphics/"];
const STATIC_EXTENSIONS = /\.(png|jpg|jpeg|gif|webp|svg|ico|woff2|woff|ttf|css|js)$/;

// ── Install ─────────────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(["/apple-touch-icon.png", "/icons/icon-192.png", "/icons/icon-512.png"])
    )
  );
});

// ── Activate ─────────────────────────────────────────────────────────────────

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== PAGE_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ────────────────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only intercept GET requests to same origin or our CDN
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Network-only: API routes and external origins
  if (url.pathname.startsWith("/api/") || url.origin !== self.location.origin) {
    return;
  }

  // Next.js internals — let the browser handle
  if (url.pathname.startsWith("/_next/webpack-hmr") || url.pathname.startsWith("/_next/on-demand-entries-ping")) {
    return;
  }

  // Cache-first: static assets (sprites, icons, _next/static)
  const isStatic =
    STATIC_PREFIXES.some((p) => url.pathname.startsWith(p)) ||
    STATIC_EXTENSIONS.test(url.pathname) ||
    url.pathname.startsWith("/_next/static/");

  if (isStatic) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Network-first: everything else (pages)
  event.respondWith(networkFirst(request, PAGE_CACHE));
});

// ── Strategies ───────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Offline fallback: return the cached home page
    const fallback = await caches.match("/");
    if (fallback) return fallback;

    // Last resort: minimal offline page
    return new Response(
      `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>TrainerDex — Offline</title>
      <style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0f172a;color:#e2e8f0}div{text-align:center;padding:2rem}h1{font-size:1.5rem;margin-bottom:.5rem}p{color:#94a3b8;font-size:.9rem}</style>
      </head><body><div><h1>⚡ TrainerDex</h1><p>You're offline. Connect to the internet to see live event data.</p></div></body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}
