

  var CACHE_NAME = 'my-site-cache-v1';
  var urlsToCache = [
  '/',
  'index.html',
  'bootstrap/css/bootstrap-grid.css',
  'bootstrap/css/bootstrap-grid.css.map',
  'bootstrap/css/bootstrap-grid.min.css',
  'bootstrap/css/bootstrap-grid.min.css.map',
  'bootstrap/css/bootstrap-reboot.css',
  'bootstrap/css/bootstrap-reboot.css.map',
  'bootstrap/css/bootstrap-reboot.min.css',
  'bootstrap/css/bootstrap-reboot.min.css.map',
  'bootstrap/css/bootstrap.css',
  'bootstrap/css/bootstrap.css.map',
  'bootstrap/css/bootstrap.min.css',
  'bootstrap/css/bootstrap.min.css.map',
  'bootstrap/js/bootstrap.bundle.js',
  'bootstrap/js/bootstrap.bundle.js.map',
  'bootstrap/js/bootstrap.bundle.min.js',
  'bootstrap/js/bootstrap.bundle.min.js.map',
  'bootstrap/js/bootstrap.js',
  'bootstrap/js/bootstrap.js.map',
  'bootstrap/js/bootstrap.min.js',
  'bootstrap/js/bootstrap.min.js.map',
  'css/main.css',
  'images/icons/icon-72x72.png',
  'images/icons/icon-96x96.png',
  'images/icons/icon-128x128.png',
  'images/icons/icon-144x144.png',
  'images/icons/icon-152x152.png',
  'images/icons/icon-192x192.png',
  'images/icons/icon-384x384.png',
  'images/icons/icon-512x512.png',
  'images/centang.png',
  'images/times.png',
  'images/ugm.png',
  'js/jquery.min.js',
  'js/main.js',
  'manifest.json',
  'serviceworker.js'
  ];
  
  self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  });
  
  self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
  });