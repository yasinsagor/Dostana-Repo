// Dostana Manager — Service Worker v3
// Network first, cache as fallback — always serves fresh content
const CACHE = 'dostana-v3';

self.addEventListener('install', function(e){
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  // Clear ALL old caches
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  var url = e.request.url;

  // Never intercept API calls
  if(url.includes('supabase.co')) return;
  if(url.includes('script.google.com')) return;
  if(url.includes('api.anthropic.com')) return;

  // For app files: network first, cache as fallback
  e.respondWith(
    fetch(e.request)
      .then(function(resp){
        // Cache successful responses
        if(e.request.method === 'GET' && resp.status === 200){
          var clone = resp.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        }
        return resp;
      })
      .catch(function(){
        // Offline: serve from cache
        return caches.match(e.request).then(function(cached){
          if(cached) return cached;
          if(e.request.mode === 'navigate'){
            return caches.match('/Dostana-Repo/index.html');
          }
        });
      })
  );
});
