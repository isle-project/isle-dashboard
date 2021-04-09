'use strict';

// MODULES //

const path = require('path');
const fs = require('fs');
const { servedPath } = require( './server.json' );


// VARIABLES //

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync( process.cwd() );
const resolveApp = relativePath => path.resolve( appDirectory, relativePath );


// EXPORTS //

module.exports = {
	'dotenv': resolveApp('.env'),
	'appPath': resolveApp('.'),
	'appBuild': resolveApp('build'),
	'appPublic': resolveApp('public'),
	'appHtml': resolveApp('public/index.html'),
	'appIndexJs': resolveApp('src/index.js'),
	'appPackageJson': resolveApp('package.json'),
	'appSrc': resolveApp('src'),
	'testsSetup': resolveApp('src/setupTests.js'),
	'proxySetup': resolveApp('src/setupProxy.js'),
	'appNodeModules': resolveApp('node_modules'),
	'servedPath': servedPath
};
