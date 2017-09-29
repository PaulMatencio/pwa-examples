## Service  worker, Fetch API, Cache  Storage and IndexedDB API

## Getting started

Clone the repository  https://github.com/PaulMatencio/fetch-sw-cache

1. Start a local web server at the app base directory.

2. Open your browser and navigate to the appropriate local host port (for example, http://localhost:808X/). The Service worker  is installed and activated when you load the page for the first time.but it will not intercept any HTTP request until you load it for the second time ( to avoid flooding the first time you visit the site)

3. Reload the page for the second time. Static content will be cached. The Fetch event listener will intercept every HTTP request.

4.  FetchJSON button =>  the "fetch" event  of the Service worker  is triggered. The first time thee is no data is in the Cache storage, it will fetch the network to return the response to the application, then cache it. For every subsequent click, the service worker will read the cache, return the response to the application, fetch the network, refresh the cache with the response and optionally return it to the application to refresh the user screen

5. FetchImage button. Same as for FetchJSON

6. Fetch text , no cache, only network response

7. HAED request , no cache

8. Reset the images and JSON off the page

## For  Chrome, use Developper tools
1. Console => to check where response is coming from
2. Application => Service workers and Cache Storage
3. If static pages are updated, you need to unregister the service worker before you reload the page.
