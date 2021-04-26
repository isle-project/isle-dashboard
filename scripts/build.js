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

'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on( 'unhandledRejection', err => {
	throw err;
});

// Ensure environment variables are read.
require('../config/env');

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const bfj = require('bfj');
const config = require('../config/webpack.config.prod');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');

const measureFileSizesBeforeBuild =
	FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
	process.exit(1);
}

// Process CLI arguments
const argv = process.argv.slice(2);
const writeStatsJson = argv.indexOf('--stats') !== -1;

// We require that you explictly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
checkBrowsers( paths.appPath, isInteractive )
	.then(() => {
		// First, read the current file sizes in build directory.
		// This lets us display how much they changed later.
		return measureFileSizesBeforeBuild(paths.appBuild);
	})
	.then(previousFileSizes => {
		// Remove all content but keep the directory so that
		// if you're in it, you don't end up in Trash
		fs.emptyDirSync(paths.appBuild);
		// Merge with the public folder
		copyPublicFolder();
		// Start the webpack build
		return build(previousFileSizes);
	})
	.then(
		({ stats, previousFileSizes, warnings }) => {
			if ( warnings.length ) {
				console.log(chalk.yellow('Compiled with warnings.\n'));
				console.log(warnings.join('\n\n'));
				console.log(
					'\nSearch for the ' +
						chalk.underline(chalk.yellow('keywords')) +
						' to learn more about each warning.'
				);
				console.log(
					'To ignore, add ' +
						chalk.cyan('// eslint-disable-next-line') +
						' to the line before.\n'
				);
			} else {
				console.log(chalk.green('Compiled successfully.\n'));
			}

			console.log('File sizes after gzip:\n');
			printFileSizesAfterBuild(
				stats,
				previousFileSizes,
				paths.appBuild,
				WARN_AFTER_BUNDLE_GZIP_SIZE,
				WARN_AFTER_CHUNK_GZIP_SIZE
			);
			console.log();

			const publicPath = config.output.publicPath;
			const buildFolder = path.relative(process.cwd(), paths.appBuild);

			console.log( 'The build is ready to be deployed.' );
			console.log();
			console.log( 'The project was built assuming it is hosted at '+publicPath );
			console.log();
			console.log( 'To copy the contents of the "'+buildFolder+'" folder via the command-line: ' );
			console.log();
			console.log( 'scp -r '+buildFolder+'/* <user>@<url>:<dirpath>' );
			console.log();
		},
		err => {
			console.log( chalk.red( 'Failed to compile.\n' ) );
			printBuildError( err );
			process.exit( 1 );
		}
	)
	.catch(err => {
		if (err && err.message) {
			console.log( err.message );
		}
		process.exit( 1 );
	});

// Create the production build and print the deployment instructions.
function build( previousFileSizes ) {
	console.log( 'Creating an optimized production build...' );

	let compiler = webpack( config );
	return new Promise( ( resolve, reject ) => {
		compiler.run( ( err, stats ) => {
			let messages;
			if ( err ) {
				if ( !err.message ) {
					return reject( err );
				}
				messages = formatWebpackMessages({
					errors: [ err.message ],
					warnings: []
				});
			} else {
				const rawMessages = stats.toJson({ all: false, warnings: true, errors: true });
				messages = formatWebpackMessages({
					errors: rawMessages.errors.map( ( e ) => e.message ),
					warnings: rawMessages.warnings.map( ( e ) => e.message )
				});
			}
			if ( messages.errors.length ) {
				// Only keep the first error. Others are often indicative
				// of the same problem, but confuse the reader with noise.
				if ( messages.errors.length > 1 ) {
					messages.errors.length = 1;
				}
				return reject( new Error( messages.errors.join( '\n\n' ) ) );
			}
			const resolveArgs = {
				stats,
				previousFileSizes,
				warnings: messages.warnings
			};
			if ( writeStatsJson ) {
				return bfj
					.write( paths.appBuild + '/bundle-stats.json', stats.toJson() )
					.then( () => resolve( resolveArgs ) )
					.catch( error => reject( new Error( error ) ) );
			}
			return resolve( resolveArgs );
		});
	});
}

function copyPublicFolder() {
	fs.copySync( paths.appPublic, paths.appBuild, {
		dereference: true,
		filter: file => file !== paths.appHtml
	});
}
