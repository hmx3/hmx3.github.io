const CURRENT_CACHE = `main-${20}`;
const cacheFiles = [
      '/',
      '/index.html',
  ];

self.addEventListener('activate', evt=>evt.waitUntil(caches.keys().then(cacheNames=>{
  return Promise.all(cacheNames.map(cacheName=>{
    if (cacheName !== CURRENT_CACHE) {
      return caches.delete(cacheName)
    }}));
})));

self.addEventListener('install', evt=>evt.waitUntil(caches.open(CURRENT_CACHE).then(cache=>{
  return cache.addAll(cacheFiles);
})));

const fromNetwork = (request)=>new Promise((fulfill,reject)=>{
  fetch(request).then(response=>{
    fulfill(response);
    update(request);
  }
  , reject);
})

const fromCache = request=>caches.open(CURRENT_CACHE).then(cache=>cache.match(request).then(matching=>matching || cache.match('/offline/')));
const update = request=>caches.open(CURRENT_CACHE).then(cache=>fetch(request).then(response=>cache.put(request, response)));

self.addEventListener('fetch', evt=>{
  evt.respondWith(fromNetwork(evt.request).catch(()=>fromCache(evt.request)));
  evt.waitUntil(update(evt.request));
})
