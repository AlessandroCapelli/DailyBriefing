var CACHE = "db-v10";

self.addEventListener("install", function (e) {
	// Pre-cache chart.min.js best-effort, relative to SW scope.
	// Using scope makes this work on GitHub Pages (/DailyBriefing/) AND on
	// localhost / custom deployments without hardcoded paths.
	e.waitUntil(
		caches.open(CACHE).then(function (c) {
			var scope = self.registration.scope;
			return c.add(scope + "chart.min.js").catch(function () {
				// Precache failure must not block install
			});
		}),
	);
	self.skipWaiting();
});

self.addEventListener("activate", function (e) {
	e.waitUntil(
		caches.keys().then(function (keys) {
			return Promise.all(
				keys
					.filter(function (k) {
						return k !== CACHE;
					})
					.map(function (k) {
						return caches.delete(k);
					}),
			);
		}),
	);
	self.clients.claim();
});

self.addEventListener("fetch", function (e) {
	var url = new URL(e.request.url);

	// Cache-first ONLY for chart.min.js (208KB, never changes)
	if (url.pathname.indexOf("chart.min.js") >= 0) {
		e.respondWith(
			caches.match(e.request).then(function (r) {
				return (
					r ||
					fetch(e.request).then(function (resp) {
						var clone = resp.clone();
						caches.open(CACHE).then(function (c) {
							c.put(e.request, clone);
						});
						return resp;
					})
				);
			}),
		);
		return;
	}

	// Network-first for everything else (HTML, JS, JSON, SVG)
	// Always get fresh version, cache as fallback for offline
	e.respondWith(
		fetch(e.request)
			.then(function (r) {
				var clone = r.clone();
				caches.open(CACHE).then(function (c) {
					c.put(e.request, clone);
				});
				return r;
			})
			.catch(function () {
				return caches.match(e.request);
			}),
	);
});
