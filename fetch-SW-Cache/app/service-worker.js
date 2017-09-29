(function() {
  'use strict';

  var filesToCache = [
    '.',
    'index.html',
    'pages/404.html',
    'js/register.js',
    'js/main.js',
    'css/styles.css',
  ];

  function LogeError(error){
    console.log(error);
  }

  var staticCacheName = 'pages-cache-v1';

  self.addEventListener('install', function(event) {
    console.log('Service worker below installing...');
    /*
    *   Build Cache  and initial resource
    */
    event.waitUntil(
    caches.open(staticCacheName)
    .then(function(cache) {
      return cache.addAll(filesToCache);
    })

  );
    self.skipWaiting();
  });
  /*
  *   Only one service worker can be active at a time for a given scope
  *   newly installed service worker isn't activated until
  */
  self.addEventListener('activate', function(event) {
    console.log('Service worker below activating...');
    console.log("rebuild");
    /*
    *   Update Cache are  done  when service worker is activated
    */
  });

  self.addEventListener('fetch', function(event) {
  if (event.request.method !==  'GET') {return;}  ;
  var url = new URL(event.request.url);
  /* dynamic content */
  if (url.pathname.indexOf('/examples/',0) > 0 ) {
      event.respondWith(
        caches.open('mysite-dynamic').then(function(cache) {
          return fetch(event.request).then(function(response) {
            console.log(`Put ${url} in cache and return the data to the caller`);
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
  } else {
    event.respondWith(
      // Try the cache
      caches.match(event.request).then(function(response) {
        var url  = event.request.url;
        if (response) {
          console.log(`get ${url} from cache`);
          return response;
        }
        return fetch(event.request).then(function(response) {
          if (response.status === 404) {
            return caches.match('pages/404.html');
          }
          console.log(`get ${url} from the backend`);
          return response
        });
      }).catch(function() {
        // If both fail, show a generic fallback:
        return caches.match('/offline.html');
      })
    );
  }
});

})();
