const CACHE_NAME = "remax-avaliacao-v11";
const ASSETS = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "calculator.js",
  "manifest.json",
  "assets/logo-horizontal.png",
  "assets/logo-vertical.png",
  "assets/icons/favicon.png",
  "assets/icons/apple-touch-icon.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(async (response) => {
          if (!response.ok) {
            return (await caches.match("./")) || response;
          }

          const cache = await caches.open(CACHE_NAME);
          await cache.put("./", response.clone());
          return response;
        })
        .catch(async () => (await caches.match("./")) || Response.error()),
    );
    return;
  }

  const update = fetch(event.request)
    .then(async (response) => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, response.clone());
        }
        return response;
    })
    .catch(() => undefined);

  event.waitUntil(update.then(() => undefined));
  event.respondWith(
    caches
      .match(event.request)
      .then((cached) => cached || update)
      .then((response) => response || Response.error()),
  );
});
