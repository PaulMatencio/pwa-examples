(function() {
  'use strict';
  var cacheStorage = 'pages-cache-v3';
  var filesToCache = [
    '.',
    'index.html',
    'pages/404.html',
    'pages/offline.html',
    'images/icon-article.png',
    'images/icon-no-articles.png',
    'images/icon-no-image.png',
    'images/icon-articles-images.jpg',
    'js/register.js',
    'js/main.js',
    'css/styles.css',
  ];
  var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var type;
  if (connection) {
    type = connection.type;
    console.log("connection type",type);
  }

  function LogeError(error){
    console.log(error);
  }

  function myFetch(request) {
    let url = new URL(request.url);
    return  fetch(request)
     .then(function(response) {
        console.log(`Get ${url} straight from network`);
        cache.put(request, response.clone());
        return response;
     })
     .catch(function(){
       console.log(`Fetch ${url} failed`);
     })
  }


  self.addEventListener('install', function(event) {
    console.log('Service worker below installing...');
    event.waitUntil(
      caches.open(cacheStorage)
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
    let url = new URL(event.request.url);
    if (event.request.method !==  'GET') return ;
    event.respondWith(
      caches.open(cacheStorage).then(function(cache) {
        // console.log(url.pathname);
        if (url.pathname.indexOf('/search/',0) < 0)  {
          /*
          *  return the response from cache storage first otherwise return from fetch
          *  fetch will save save the response to the Cache storage
          */
          return cache.match(event.request).then(function (response) {
            if (response) {
                console.log(`Get ${url} from cache`);
            }
            /* if response is undefined fetch and cache */
            return response ||
              fetch(event.request)
               .then(function(response) {
                  console.log(`Get ${url} from network`);
                  cache.put(event.request, response.clone());
                  return response;
                })
                .catch(function(){
                  console.log(`Fetch ${url} failed`);
                })
          });
       }  else {
            // return myFetch(event.request);

            /* for search, always fetch from the netwaork
            *  then cache  the response
            *  clone the respnse and  return it to the requester
            *  it is up to the requestor to use or not the response
            */

            return  fetch(event.request)
             .then(function(response) {
                console.log(`Get ${url} straight from network`);
                /*
                *  the response is cloned because the request is a stream that can
                *  only be consumed once.
                *  clone a copy to serve later on
                */
                cache.put(event.request, response.clone());
                return response;
             })
             .catch(function(){
               console.log(`Fetch ${url} failed`);
             })

        }
      }) // caches.open
    ); // response With
  }); // Fetch eventListener

})();
