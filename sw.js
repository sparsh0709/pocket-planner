/* Offline support. __VERSION__ and __FILES__ are filled in by scripts/build.mjs. */
const PREFIX = "pocket-planner-app-";
const CACHE = PREFIX + "066108d7c4f8";
const FILES = ["./","./app.css","./app.js","./fonts/bricolage-ext.woff2","./fonts/bricolage-latin.woff2","./fonts/jakarta-ext.woff2","./fonts/jakarta-latin.woff2","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./icons/icon.svg","./index.html","./manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: "reload" })))));
});
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener("message", (e) => { if (e.data === "skip-waiting") self.skipWaiting(); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (e.request.mode === "navigate") return (await cache.match("./index.html")) ?? fetch(e.request);
    return (await cache.match(e.request, { ignoreSearch: true })) ?? fetch(e.request);
  })());
});
