(function() {
  'use strict';
  let cacheStorage = 'pages-cache-v3';
  let filesToCache = [
    '.',
    'index.html',
    'pages/404.html',
    'pages/offline.html',
    'images/icon-article.png',
    'images/icon-articles-images.jpg',
    'js/register.js',
    'js/main.js',
    'css/styles.css',
  ];

  let ignoreUrlParametersMatching = [/^utm_/];
  let  connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  let type;
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

  var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };

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
    console.log('Service worker activating...');
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
