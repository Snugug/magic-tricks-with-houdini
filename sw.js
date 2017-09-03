/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/css/style.css","0c30cd0b79d61ca8eec73f1a08925972"],["/custom/animation/basic-2/index.html","89e96888a5df50262a4d15d88a2951ce"],["/custom/animation/explain/index.html","1ad93354d70d6cac844eda26000ff8c7"],["/custom/animation/hidey-bar/index.html","2c50093f32f12ef6d02abe8071806af4"],["/custom/animation/intro/index.html","ee5bdce550219cfb5c21d5bbf1951caf"],["/custom/animation/twitter-browser/index.html","c22714a11a840418dbd4585bd1edb9f3"],["/custom/animation/twitter-markup/index.html","0490b7c6bcbe955ec8e72c6c06b293b0"],["/custom/animation/twitter-worklet/index.html","e6500898cc3906da538facb68876b1a4"],["/custom/animation/twitter/index.html","de053649daa0018772d3c0bc773854be"],["/custom/animation/worklet/index.html","3abbffa1afc90d68ff697186dcc8028e"],["/custom/at-rules/basic/index.html","8cc04f2ab0374098f56c625e7117a0c8"],["/custom/at-rules/explain/index.html","ec60df727e33e2e68faf2baf3068c579"],["/custom/at-rules/intro/index.html","1ed0b6c0c16dab7776d9ac9919b6bc04"],["/custom/at-rules/warning/index.html","9c75c9e9ba19c295f071890138849307"],["/custom/fuzzy/index.html","832727c8abcbdfbef9be19ba29c56d72"],["/custom/intro/index.html","a9d10b18e9e78592b2cdfb0dca5ae93e"],["/custom/layout/basic/index.html","79e4f0ba1c5f0ad0d48d37304f1236c6"],["/custom/layout/block-like-1/index.html","39b075047df7f731bdcf92d298e2ec67"],["/custom/layout/block-like-2/index.html","b96aa2d04c960ff18013066d41fc3ef5"],["/custom/layout/block-like-3/index.html","b092501084848c9ec8d74f487ad99497"],["/custom/layout/child-example/index.html","def740f15e34e51eae7c45aeea267844"],["/custom/layout/child/index.html","35c0483b3683c7e5cd7c599478ab6596"],["/custom/layout/constraint/index.html","80797f106a16bc2930fd34671d24dcc7"],["/custom/layout/edges-example/index.html","b7138f72e169766c92554e2136eede41"],["/custom/layout/edges/index.html","03c76cf55035ca80c1e5551ca6b990be"],["/custom/layout/explain/index.html","41ba99045174b8aba81168d5dce929b0"],["/custom/layout/fragment-example-1/index.html","28dfb6546614026cfc57e313826852dd"],["/custom/layout/fragment-example-2/index.html","1d178548a04e43022dba794d7a149293"],["/custom/layout/fragment/index.html","8ac8513364e76334a46c71040f4e7f54"],["/custom/layout/intro/index.html","ee4a4dd847bbe1122c93796c56bd543a"],["/custom/layout/terminology/index.html","ab853f3690b5298ae4fb3d2f8ba14c4b"],["/custom/layout/utilities/index.html","df465773aa25baff57030ec2102cdc59"],["/custom/layout/worklet/index.html","efa58dac72ed7ea1b9dd0b9b691a5b97"],["/custom/other/index.html","154e5a38c10c916fb492fd446ef12a0c"],["/custom/paint/basic/index.html","ca93c78f0770776c8a67aba1bb302dbf"],["/custom/paint/demo/index.html","731b9e807274d6f8d4c307dbb3740402"],["/custom/paint/explain/index.html","3f098cdff46374f69c850ef01e017d16"],["/custom/paint/intro/index.html","ffbf90106ac1851bae6e54150f08952a"],["/custom/paint/polyfill/index.html","34f6e20544e11fc5ab6d4c3f2a4504d8"],["/custom/paint/worklet/index.html","741f4453b903c8d7f008866c8c4be9c2"],["/custom/parser/basic/index.html","cf03e615d174db9200fe9675583828e5"],["/custom/parser/explain/index.html","6d56d7e44e6ebcd533d3d0019ef3abc0"],["/custom/parser/intro/index.html","7b35ae0859b608f9fabba6518e4bbb03"],["/custom/properties/advanced/index.html","23d63bc8f91d1ef6168de7fa587ce845"],["/custom/properties/basic/index.html","14de978263a5135d6408af63dd4e1d6e"],["/custom/properties/combiners/index.html","c00f9f6c718734bbe32d0a6b29667d34"],["/custom/properties/intro/index.html","9dc4f45cf4037c1463956299d9e23f34"],["/custom/properties/overview/index.html","2bb9335f69eaf7ce2d391f47d18bb844"],["/custom/properties/syntaxes/index.html","5ba6c897c849a17fa48269edb8fbe61a"],["/custom/superfuzzy/index.html","832727c8abcbdfbef9be19ba29c56d72"],["/custom/windowCSS/index.html","64a5098a7da033be6e4d28a405ea2d2f"],["/images/excited.gif","2526c2abf6262844f86ae3ccd128e5ed"],["/images/icon.svg","c5761929ba9f3a5f3cf4337c58271f85"],["/images/magic-gob.gif","f02f5af7d4c23fa24a8a647a65826e37"],["/images/magic.gif","9634c520c9a3cd4e7f23190bb2c96500"],["/images/nuggets.gif","72f1ee87f605b109b677e2fc8bd5e127"],["/images/rad.gif","322063515128c6aa36d5b0c696634a41"],["/images/tennent-sauce.gif","70e8d6fb21f5be6d991b6729c42149c6"],["/index.html","40deab977bbf2b5e8db25b49d0697399"],["/intro/cool/index.html","7e6fc19bcd5e3787bdda67ef33e976dc"],["/intro/desc/index.html","aadaf488e9b3c5b43628b85179532c81"],["/intro/extend/index.html","3a0070e1ba49fa06cb8119cb4ce26e85"],["/intro/index.html","40e5ea8c98c62128feac1a783ee9daa8"],["/intro/magic/index.html","4d61333795d5cfcea1d2228f4e40a84b"],["/intro/not-quite/index.html","2e627bcd5bff954645092b1e5f8b8ded"],["/intro/practical/index.html","82961e2068cb3db359c6c3e860981f04"],["/intro/ready/index.html","e6d76033f4e1997aa2273e44de140d3c"],["/intro/sw/index.html","c1316edaaf87efc3c3ca001be73827ab"],["/intro/thanks/index.html","9672b89ffad895138db2e0dc90481dc1"],["/intro/wait/index.html","67cd1a26f1f2f1b825fb5ef3e8b54fdc"],["/intro/warning/index.html","5c5418ea875c945bd6aef567f5feb1ba"],["/intro/what/index.html","ed36d9e44a6fa1117a8c2c911f9f5138"],["/js/border-colors.not.min.js","1e6311ca5be8f38f947ab5994dffa314"],["/js/circle.not.min.js","535a09a87652954be00d54b58d0fdcc0"],["/js/face.not.min.js","5267cb4730153f1e229a1e85a5df21e7"],["/js/hidey-bar-animator.not.min.js","7ebb41fad45a6b6c1074c4d478991438"],["/js/main.js","cf9cb6a00a3a88e3d762d5f256341e73"],["/js/parallax.not.min.js","5574b7dd8b4f6b5e3402ce89e2ace4cc"],["/js/twitter-header-animator.not.min.js","7add91ce3c2dd9e4279a10cc166b7e90"],["/outro/excited/index.html","d10b9f53d643a883ccd4530e2fc8fac6"],["/outro/future/index.html","54240dffbae01486fc677d8eeda4da88"],["/outro/magic/index.html","d0354567a21442765d2075c5253b24a8"],["/thanks/index.html","84f20142387f9d2fca92400ff7fccacb"],["/typedom/happy-nuggets/index.html","5dc10f2e50186b91bf75387be41e28cf"],["/typedom/parser/index.html","b7b2783a00e0d4951da510e9cc8fafce"],["/typedom/rad/index.html","af7df5451c3223225f2f65a1b490dd1f"],["/typedom/typedom-example/index.html","8fa28daca650e979acadd13aef88afce"],["/typedom/typedom/index.html","ca1c30b5cca48804c2eb0057d52136eb"],["/typedom/underlying/index.html","a47a0bfdab9bac8903e7878c019622bc"],["/typedom/value/index.html","1192bab447d61e8a6021d8362b49b878"],["/typedom/what-to-do/index.html","35b2afccb8ef5136be40b300142a09eb"],["/worklet/inside/index.html","f793376726bc32a9918c7073ff2a8201"],["/worklet/intro/index.html","60e1c29d64c1f2bf5b3cc1aad3ffd16c"],["/worklet/loading/index.html","ac56219f75bbb716f2173d84d8b85527"],["/worklet/nuggets/index.html","7827af660052912414a4e9eafb088818"],["/worklet/overview/index.html","42f254f38d5526c91329bed0774c88dc"],["/worklet/secret/index.html","673f119c03d6a21df6932de03f9bbfc4"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

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


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







