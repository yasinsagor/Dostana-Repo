// Emergency: unregister service worker so app loads fresh
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    }).then(function(){
      return self.registration.unregister();
    })
  );
  self.clients.claim();
  self.clients.matchAll().then(function(clients){
    clients.forEach(function(c){ c.navigate(c.url); });
  });
});
