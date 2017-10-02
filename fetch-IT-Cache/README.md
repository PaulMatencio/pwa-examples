## Fetch API , Service  worker  and  Cache  Storage

## Getting started

Clone the repository  https://github.com/PaulMatencio/fetch-IT-cache

1. Start a local web server at the app base directory.

2. Open your browser and navigate to the appropriate local host port (for example, http://localhost:808X/). The Service worker  is installed and activated when you load the page for the first time.but it will not intercept any HTTP request until you load it for the second time

3. Reload the page a second time to activate the service worker

4. From now on, the service worker is activated and acts as proxy for every network request. Every network request is intercepted by the service worker. The service worker fetches data, caches it in Cache Storage then returns it to the application.

5. How  data  is updated ?

5.1  HTML Resources (js, css, html, pages, etc..)    =>  #### Cache or Network strategy 
  5.1.1  Selected resources are statically stored in Cache storage by the Service Worker at the activation time
  5.1.2  Other resources are added if they are not in the Cache Storage

5.2  Application data   =>  #### Cache then Network  strategy
  5.2.1  The application concurrently fetch data and read data from cache storage ]
  5.2.2  Service Worker fetches the network, caches the response in Cache Storage  then returns it to the application
  5.2.3  Application get (previous) response from cache then  updates the page if it exists otherwise wait for the network response issued by the service worker ( i.e 5.2.2)
  5.2.4  When network response is returned by the service worker,  the application updates the page if it was not yet updated by previous response (i.e 5.2.3)  or  "Get-fresh-data" check box is selected.      
