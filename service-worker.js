//TODO: gå över till workbox (för att slippa skumma effekter, ex updpatering av cache-str)

//This file must live in the application root because the scope for service workers is defined by the directory in which the file resides.

// var cacheName = 'weatherPWA-step-6-1-9';
// /*
// Be sure to include all permutations of file names, for example our app is
// served from index.html, but it may also be requested as / since the server
// sends index.html when a root folder is requested. You could deal with this in
// the fetch method, but it would require special casing which may become complex.
// */
// var filesToCache = [
//   '/',
//   '/index.html',
//   '/scripts/app.js',
//   '/styles/inline.css',
//   '/images/clear.png',
//   '/images/cloudy-scattered-showers.png',
//   '/images/cloudy.png',
//   '/images/fog.png',
//   '/images/ic_add_white_24px.svg',
//   '/images/ic_refresh_white_24px.svg',
//   '/images/partly-cloudy.png',
//   '/images/rain.png',
//   '/images/scattered-showers.png',
//   '/images/sleet.png',
//   '/images/snow.png',
//   '/images/thunderstorm.png',
//   '/images/wind.png'
// ];

//-- workbox related
//importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js'); //testar att ladda med skripttag..
importScripts('scripts/workbox-sw.js');
/*
Warning: Importing workbox-sw.js will create a workbox object inside of your
service worker, and that instance is responsible for importing other helper
libraries, based on the features you use. Due to restrictions in the service
worker specification, these imports need to happen either inside of an install
event handler, or synchronously in the top-level code for your service worker.
More details, along with workarounds, can be found in the
workbox-sw documentation.
*/
if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
/*
we want our JavaScript files to come from the network whenever possible, but
fallback to the cached version if the network fails, we can use the
“network first” strategy to achieve this.
*/
workbox.routing.registerRoute(
  new RegExp('.*\.js'),
  workbox.strategies.networkFirst()
);

//örk, det finns nog smartare sätt för de båda nedan, ex mha precaching? men om precache så måste man göra ngt bygge tror jag för att få versioner som hashar
workbox.routing.registerRoute(
  new RegExp('.*\.html'),
  workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
  new RegExp(''),
  workbox.strategies.networkFirst()
);

// workbox.routing.registerRoute(
//   new RegExp('query\.yahooapis\.com/v1/public/yql'),
//   workbox.strategies.networkFirst()
// );


/*Workbox provides a few caching strategies that you can use. For example, your
CSS could be served from the cache first and updated in the background or your
images could be cached and used until it’s a week old, after which it’ll
need updating.*/
workbox.routing.registerRoute(
  // Cache CSS files
  /.*\.css/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: 'css-cache',
  })
);

workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images
        maxEntries: 20,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);
//---- end workbox related

// self.addEventListener('install', function(e) {
//   console.log('[ServiceWorker] Install');
//   e.waitUntil(
//     caches.open(cacheName).then(function(cache) {
//       console.log('[ServiceWorker] Caching app shell');
//       return cache.addAll(filesToCache);
//     })
//   );
// });
//
// self.addEventListener('activate', function(e) {
//   console.log('[ServiceWorker] Activate');
//   e.waitUntil(
//     caches.keys().then(function(keyList) {
//       return Promise.all(keyList.map(function(key) {
//         if (key !== cacheName) {
//           console.log('[ServiceWorker] Removing old cache', key);
//           return caches.delete(key);
//         }
//       }));
//     })
//   );
//
//
//   /*
//   When the app is complete, self.clients.claim() fixes a corner case in which
//   the app wasn't returning the latest data. You can reproduce the corner case
//   by commenting out the line below and then doing the following steps:
//   1) load app for first time so that the initial New York City data is shown
//   2) press the refresh button on the app
//   3) go offline
//   4) reload the app.
//   You expect to see the newer NYC data, but you actually see the initial
//   data. This happens because the service worker is not yet
//   activated. self.clients.claim() essentially lets you activate the
//   service worker faster.
//   */
//   return self.clients.claim();
// });
// /*
// Stepping from inside, out, caches.match() evaluates the web request that
// triggered the fetch event, and checks to see if it's available in the cache. It
// then either responds with the cached version, or uses fetch to get a copy from
// the network. The response is passed back to the web page with e.respondWith().
// */
//
//
// /*
// handle requests to the data API separately from other requests.
// */
// self.addEventListener('fetch', function(e) {
//   console.log('[Service Worker] Fetch', e.request.url);
//   var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
//   if (e.request.url.indexOf(dataUrl) > -1) {
//     /*
//      * When the request URL contains dataUrl, the app is asking for fresh
//      * weather data. In this case, the service worker always goes to the
//      * network and then caches the response. This is called the "Cache then
//      * network" strategy:
//      * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
//      */
//     e.respondWith(
//       caches.open(cacheName).then(function(cache) {
//         return fetch(e.request).then(
//           function(response){
//             cache.put(e.request.url, response.clone());
//             return response;
//           }
//         );
//       })
//     );
//   } else {
//     /*
//      * The app is asking for app shell files. In this scenario the app uses the
//      * "Cache, falling back to the network" offline strategy:
//      * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
//      */
//     e.respondWith(
//       caches.match(e.request).then(function(response) {
//         return response || fetch(e.request);
//       })
//     );
//   }
// });
