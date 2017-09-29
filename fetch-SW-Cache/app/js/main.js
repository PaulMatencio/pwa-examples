var app = (function() {
  'use strict';

  function logResult(result) {
    console.log(result);
  }

  function logError(error) {
    console.log('Looks like there was a problem: \n', error);
  }


  if (!('fetch' in window)) {
    console.log('Fetch API not found, try including the polyfill');
    return;
  }

  function fetchJSON() {
    var backend = false;
    // fetch data from the backend
    var url = 'examples/animals.json';
    var backendResponse= fetch(url)
    .then(validateResponse)
    .then(function(response){
      backend = true;
      return response.json();
    })
    .then(showAnimals)
    .catch(logError);
     /* retrieve data from cache */
     caches.match(url)
     .then(function(response) {
        if (!response) throw Error(`No cache data for ${url}`);
        return response.json();
     })
     .then(function(data){
       if (!backend) {
         showAnimals(data);
       }
     })
     .catch(function(){
         return backendResponse;
     })
     .catch(logError);
  }

  function validateResponse(response) {
    if (!response.ok) {
      throw(response.statusText);
    } else return response;
  }


  function readResponseAsJSON(response) {
    return response.json();
  }

  function clearAnimals() {
    var images = document.getElementById('animals');
    while (images.hasChildNodes()) {
      images.removeChild(images.lastChild);
    }
  }

  function showAnimals(data) {
     var htmlContent = "";
     var animals =  document.getElementById('animals');
     htmlContent = `<div class="item"> <h2>${data.type}</h2><p>`   ;
     for ( var animal in data.animals ) {
       var li =  `${animal} = ${data.animals[animal]}</br>`;
       htmlContent += li;
     }
     htmlContent += "</p></div>";
     if (animals) {
       animals.insertAdjacentHTML('afterbegin',htmlContent);
     }
   }

  function clearImages() {
    var images = document.getElementById('images');
    while (images.hasChildNodes()) {
      images.removeChild(images.lastChild);
    }
  }

  function showImage(blob) {
    var images = document.getElementById('images');
    var imgElem = document.createElement('img');
    imgElem.classList.add('item')
    images.appendChild(imgElem);
    var imgUrl = URL.createObjectURL(blob);
    imgElem.src = imgUrl;
  }

  function readResponseAsBlob(response) {
    return response.blob();
  }

  function fetchImage() {
    var backend = false;
    var url = 'examples/hd_animals.jpg';
    // fetch data from backend
    var backendResponse =
      fetch(url)
      .then(validateResponse)
      .then(function(response){
        backend = true;
        return response.blob();
      })
      .then(showImage)
      .catch(logError) ;
     // fetch  data from cache
    caches.match(url)
    .then(function(response) {
       if (!response) throw Error(`No cache data for ${url}`);
       return response.blob();
    })
    .then(function(data){
      if (!backend) {
        console.log(`Show image ${data} from cache`);
        showImage(data);
      }
    })
    .catch(function(){
        return backendResponse;
    })
    .catch(logError);
  }

  function showText(responseAsText) {
    var message = document.getElementById('message');
    console.log(responseAsText);
    message.textContent = responseAsText;
  }

  function readResponseAsText(response) {
    console.log(response);
    return response.text();
  }

  function fetchText() {
    fetch('examples/words.txt')
    .then(validateResponse)
    .then(readResponseAsText)
    .then(showText)
    .catch(logError)
  }

  function resetItems() {
    clearImages();
    clearAnimals();
  }

  function readHeaderContentLength(response) {
    return response.headers.get('Content-Length') ;
  }

  function headRequest() {
    fetch('examples/words.txt',{
      'method': 'HEAD'
    })
    .then(validateResponse)
    .then(getSize)
    .then(logResult)
    .catch(logError)
  }

  function getSize(response) {
    return response.headers.get('Content-Length') ;
  }

  /* NOTE: Never send unencrypted user credentials in production! */
  function postRequest() {
    var formData = new FormData(document.getElementById('myForm'));
    for (var pair of  formData.entries()){
      console.log(pair[0] + ':' + pair[1]);
    }
    var headers = new Headers();
    var init = {
      method : 'POST',
      mode: 'cors',
      body: formData,
      headers: customHeaders
    }
    fetch('http://localhost:5000/', init)
    .then(validateResponse)
    .then(readResponseAsText)
    .then(logResult)
    .catch(logError)
  }


  var customHeaders = new Headers({
    'Content-Type': 'text/plain',
    'X-Custom': 'hello world',
    'X-Usermd': 'some user metadata'
  });


  /* open the dynamic cache */
  caches.open('mysite-dynamic').then(function(cache) {
    console.log(cache);
  });

  return {
    readResponseAsJSON: (readResponseAsJSON),
    readResponseAsBlob: (readResponseAsBlob),
    readResponseAsText: (readResponseAsText),
    validateResponse: (validateResponse),
    fetchJSON: (fetchJSON),
    fetchImage: (fetchImage),
    fetchText: (fetchText),
    resetItems : (resetItems),
    headRequest: (headRequest),
    postRequest: (postRequest)
  };

})();
