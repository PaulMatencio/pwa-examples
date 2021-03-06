(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const imageContainer = document.querySelector('#image-container');
    const articleContainer = document.querySelector('#article-container');
    const errorContainer = document.querySelector('#error-container');
    const getFresh  = document.querySelector('#fresh-data');
    const dynamicCache = 'mysite-dynamic';
    let type ;
    let connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      type = connection.type;
      console.log("connection type",type);
    }

    function validateResponse(response) {
      if (!response.ok) {
        throw(response.statusText);
      } else return response;
    }

    /*
    *     TODO OFFLINE => IndexedDB
    */

    function updateConnectionStatus() {
      console.log("Connection type is change from " + type + " to " + connection.type);
    }

    if (connection) {
      connection.addEventListener('typechange', updateConnectionStatus);
    }


    form.addEventListener('submit', function (e) {
        e.preventDefault();

        imageContainer.innerHTML = '';
        articleContainer.innerHTML='';
        errorContainer.innerHTML = '';

        var articles = false;
        var unsplash = false;
        var freshData = getFresh.checked;
        searchedForText = searchField.value;
        let requestHeaders = new Headers();
        //  get  images
        requestHeaders.append('Authorization','Client-ID 7ea30f97ca6d7ede1ff375ac191cf045dbd918f206f6cdabfcf8c214d85f993e');
        let url = `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`;

        getJson(url,requestHeaders)
          .then(json => {
             if (!unsplash || freshData)  {
                unsplash = true;
                let origine = 'Backend';
                logGet(url,origine);
                imageContainer.innerHTML = '';
                addImage(json,origine);
             }
           })
          .catch( error => {
            requestError(error,'images');
          })

          /* Read images from the cache */
        caches.match(url).then(response => {
          if (!response )  throw Error(`No cache data for ${url}`);
            return response.json();
          })
          .then(json => {
            if (!unsplash) {
                let origine = 'Cache Storage';
                logGet(url,origine);
                unsplash = true;
                addImage(json,origine);
              }
            })
          .catch( error => noCache(error,'images'))

        //  get  articles
        const nytSearchKey = "72f579b41d55f0fac5b79ab556ba913f:1:73683129";
        let url1 = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${nytSearchKey}`  ;
        getJson(url1,{})
        .then (json => {
            if (!articles || freshData) {
              articles = true;
              let origine = 'Backend';
              logGet(url1,origine);
              articleContainer.innerHTML='';
              addArticles(json,origine);
            }
          })
        .catch( error => requestError(error,'articles'))

        caches.match(url1).then(response => {
          if (!response )  throw Error(`No cache data for ${url1}`);
            return response.json();
          })
          .then(json => {
            if (!articles) {
              let origine = 'Cache Storage';
              logGet(url1,origine);
              articles = true;
              addArticles(json,origine);
            }
           })
          .catch( error => noCache(error,'articles'))

    });

    // fetch is a promise function
    function getJson(url,requestHeaders) {
      return fetch(url,{
        headers: requestHeaders
      })
      .then(response => validateResponse(response))
      .then(response => {
          return response.json();
       })
    }

    function addImage(data,origine) {
       data.results.forEach(function(image) {
       //const image = data.results[0];
       let htmlContent =
        `<figure class="item"> <img src="${image.urls.regular}" alt="${searchedForText}">
          <figcaption>${searchedForText} by ${image.user.name} - ${origine}</figcaption>
        </figure>`;
       imageContainer.insertAdjacentHTML('beforeend',htmlContent);
     })
    }

    function addArticles(data,origine) {
      let htmlContent = "";
      if ( data.response && data.response.docs && data.response.docs.length > 1) {
          htmlContent = '<ul>' + data.response.docs.map(article =>
            `<li class="article">
                <h2> <a href="${article.web_url}"> ${article.headline.main} - ${origine}</a></h2>
                <p> ${article.snippet}</p>
            </li>`).join('') + '</ul>';

      } else {
          htmlContent = '<div class="error-no-articles"> No articles available</div>';
      }
      articleContainer.insertAdjacentHTML('beforeend',htmlContent);
    }

   function requestError(error, part) {
        let htmlContent = `<p class="network-earning-error item">${error} ${part} </p>`
        errorContainer.insertAdjacentHTML('beforeend',htmlContent);
   }

   function logGet(url, origine) {
     console.log(`Get ${url} from ${origine}`);
   }
   function noCache(error,part) {
     //* do nothing
   }
})();
