'use strict';

const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const resolve = require('path').resolve;
const config = require('./webpack.config.dev');
const paths = require('./paths');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';
	
module.exports = function(proxy, allowedHost) {
	return {
		disableHostCheck:
			!proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
		// Enable gzip compression of generated files.
		compress: true,
		// Silence WebpackDevServer's own logs since they're generally not useful.
		// It will still show compile warnings and errors with this setting.
		clientLogLevel: 'none',
		contentBase: paths.appPublic,
		// By default files from `contentBase` will not trigger a page reload.
		watchContentBase: true,
		// Enable hot reloading server. It will provide /sockjs-node/ endpoint
		// for the WebpackDevServer client so it can learn when the files were
		// updated. The WebpackDevServer client is included as an entry point
		// in the Webpack development configuration. Note that only changes
		// to CSS are currently hot reloaded. JS changes will refresh the browser.
		hot: true,
		// It is important to tell WebpackDevServer to use the same "root" path
		// as we specified in the config. In development, we always serve from /.
		publicPath: config.output.publicPath,
		// WebpackDevServer is noisy by default so we emit custom message instead
		// by listening to the compiler events with `compiler.plugin` calls above.
		quiet: true,
		// Reportedly, this avoids CPU overload on some systems.
		// https://github.com/facebookincubator/create-react-app/issues/293
		// src/node_modules is not ignored to support absolute imports
		// https://github.com/facebookincubator/create-react-app/issues/1065
		watchOptions: {
			ignored: [
				ignoredFiles(paths.appSrc),
				/^[\s\S]+\/node_modules\/@stdlib\/.+/
			]
		},
		// Enable HTTPS if the HTTPS environment variable is set to 'true'
		https: protocol === 'https',
		host: host,
		overlay: false,
		historyApiFallback: {
			disableDotRule: true,
		},
		public: allowedHost,
		proxy,
		before(app) {
			app.use(errorOverlayMiddleware());
			app.use(noopServiceWorkerMiddleware());
		},
	};
};
