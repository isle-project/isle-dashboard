/**
* MIT License
*
* Copyright (c) 2013-present, Facebook, Inc.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

/* eslint-disable no-process-env, no-console */

const isLocalhost = Boolean(
	window.location.hostname === 'localhost' ||
		// [::1] is the IPv6 localhost address.
		window.location.hostname === '[::1]' ||
		// 127.0.0.0/8 are considered localhost for IPv4.
		window.location.hostname.match(
			/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
		)
);

export function register( config ) {
	if ( process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator ) {
		// The URL constructor is available in all browsers that support SW.
		window.addEventListener('load', () => {
			const swUrl = `${window.location.origin}/dashboard/service-worker.js`;
			if ( isLocalhost ) {
				// This is running on localhost. Let's check if a service worker still exists or not.
				checkValidServiceWorker( swUrl, config );

				// Add some additional logging to localhost, pointing developers to the service worker/PWA documentation.
				navigator.serviceWorker.ready.then(() => {
					console.log(
						'This web app is being served cache-first by a service ' +
							'worker. To learn more, visit https://bit.ly/CRA-PWA'
					);
				});
			} else {
				// Is not localhost. Just register service worker
				registerValidSW( swUrl, config );
			}
		});
	}
}

function registerValidSW( swUrl, config ) {
	navigator.serviceWorker
		.register(swUrl)
		.then(registration => {
			registration.onupdatefound = () => {
				const installingWorker = registration.installing;
				if ( installingWorker === null ) {
					return;
				}
				installingWorker.onstatechange = () => {
					if ( installingWorker.state === 'installed' ) {
						if (navigator.serviceWorker.controller) {
							/*
								At this point, the updated precached content has been fetched,
								but the previous service worker will still serve the older
								content until all client tabs are closed.
							*/
							console.log(
								'New content is available and will be used when all ' +
									'tabs for this page are closed. See https://bit.ly/CRA-PWA.'
							);

							// Execute callback
							if (config && config.onUpdate) {
								config.onUpdate(registration);
							}
						} else {
							/*
								At this point, everything has been precached.
								It's the perfect time to display a
								"Content is cached for offline use." message.
							*/
							console.log('Content is cached for offline use.');
							// Execute callback
							if (config && config.onSuccess) {
								config.onSuccess(registration);
							}
						}
					}
				};
			};
		})
		.catch(error => {
			console.error( 'Error during service worker registration:', error );
		});
}

function checkValidServiceWorker(swUrl, config) {
	// Check if the service worker can be found. If it can't reload the page.
	fetch(swUrl, {
		headers: { 'Service-Worker': 'script' }
	})
		.then(response => {
			// Ensure service worker exists, and that we really are getting a JS file.
			const contentType = response.headers.get('content-type');
			if (
				response.status === 404 ||
				(contentType !== null && contentType.indexOf('javascript') === -1)
			) {
				// No service worker found. Probably a different app. Reload the page.
				navigator.serviceWorker.ready.then(registration => {
					registration.unregister().then(() => {
						window.location.reload();
					});
				});
			} else {
				// Service worker found. Proceed as normal.
				registerValidSW(swUrl, config);
			}
		})
		.catch(() => {
			console.log(
				'No internet connection found. App is running in offline mode.'
			);
		});
}

export function unregister() {
	if ( 'serviceWorker' in navigator ) {
		navigator.serviceWorker.ready.then(registration => {
			registration.unregister();
		});
	}
}
