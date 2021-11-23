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

const path = require('path');
const webpack = require('webpack');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const { ESBuildMinifyPlugin } = require( 'esbuild-loader' );
const esbuild = require( 'esbuild' );
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const WebpackCdnPlugin = require( '@isle-project/webpack-cdn-plugin' );

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === './';
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// Get environment variables to inject into our app.
const env = getClientEnvironment();

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (env.stringified['process.env'].NODE_ENV !== '"production"') {
	throw new Error('Production builds must have NODE_ENV=production.');
}

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor) => {
	const loaders = [
		{
			loader: MiniCssExtractPlugin.loader,
			options: Object.assign(
				{},
				shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined
			),
		},
		{
			loader: require.resolve('css-loader'),
			options: cssOptions,
		},
		{
			// Options for PostCSS as we reference these options twice
			// Adds vendor prefixing based on your specified browser support in
			// package.json
			loader: require.resolve('postcss-loader'),
			options: {
				// Necessary for external CSS imports to work
				// https://github.com/facebook/create-react-app/issues/2677
				postcssOptions: {
					ident: 'postcss',
					plugins: [
						require('postcss-flexbugs-fixes'),
						require('postcss-preset-env')({
							autoprefixer: {
								flexbox: 'no-2009',
							},
							stage: 3,
						}),
					],
					sourceMap: shouldUseSourceMap
				},
			},
		},
	];
	if ( preProcessor ) {
		loaders.push({
			loader: require.resolve( preProcessor ),
			options: {
				sourceMap: shouldUseSourceMap,
			},
		});
	}
	return loaders;
};

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
	mode: 'production',
	// Don't attempt to continue if there are any errors.
	bail: true,
	// We generate sourcemaps in production. This is slow but gives good results.
	// You can exclude the *.map files from the build during deployment.
	devtool: shouldUseSourceMap ? 'source-map' : false,
	// In production, we only want to load the app code.
	entry: [paths.appIndexJs],
	output: {
		// The build folder.
		path: paths.appBuild,
		// Generated JS file names (with nested folders).
		// There will be one main bundle, and one file per asynchronous chunk.
		// We don't currently advertise code splitting but Webpack supports it.
		filename: 'static/js/[name].[chunkhash:8].js',
		chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
		// We inferred the "public path" (such as / or /my-project) from homepage.
		publicPath: publicPath,
		// Point sourcemap entries to original disk location (format as URL on Windows)
		devtoolModuleFilenameTemplate: info =>
			path
				.relative(paths.appSrc, info.absoluteResourcePath)
				.replace(/\\/g, '/'),
		assetModuleFilename: 'static/media/[hash][ext][query]'
	},
	optimization: {
		minimizer: [
			new ESBuildMinifyPlugin({
				target: 'es2015',
				implementation: esbuild,
				minify: false,
				minifyIdentifiers: false,
				minifyWhitespace: true,
				minifySyntax: true,
				legalComments: 'none'
			}),
			new CssMinimizerPlugin({
				parallel: false,
				minimizerOptions: {
					processorOptions: {
						parser: safePostCssParser,
					},
				},
			})
		],
		// Automatically split vendor and commons
		// https://twitter.com/wSokra/status/969633336732905474
		// https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
		splitChunks: {
			chunks: 'all',
			name: false,
		},
		// Keep the runtime chunk seperated to enable long term caching
		// https://twitter.com/wSokra/status/969679223278505985
		runtimeChunk: true,
	},
	resolve: {
		// This allows you to set a fallback for where Webpack should look for modules.
		// We placed these paths second because we want `node_modules` to "win"
		// if there are any conflicts. This matches Node resolution mechanism.
		// https://github.com/facebook/create-react-app/issues/253
		modules: [
			'node_modules',
			paths.appSrc
		].concat(
			// It is guaranteed to exist because we tweak it in `env.js`
			process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
		),
		// These are the reasonable defaults supported by the Node ecosystem.
		// We also include JSX as a common component filename extension to support
		// some tools, although we do not recommend using it, see:
		// https://github.com/facebook/create-react-app/issues/290
		// `web` extension prefixes have been added for better support
		// for React Native Web.
		extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
		mainFields: [ 'webpack', 'browser', 'web', 'browserify', [ 'jam', 'main' ], 'main' ],
		alias: {
			// Support React Native Web
			// https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
			'react-native': 'react-native-web',
			'csv-stringify': require.resolve( 'csv-stringify/lib/browser/index.js' )
		},
		plugins: [
			// Adds support for installing with Plug'n'Play, leading to faster installs and adding
			// guards against forgotten dependencies and such.
			PnpWebpackPlugin
		],
		fallback: {
			assert: false,
			dgram: false,
			fs: false,
			net: false,
			tls: false,
			punycode: false,
			child_process: false,
			path: require.resolve( 'path-browserify' ),
			stream: require.resolve( 'stream-browserify' ),
			querystring: require.resolve( 'querystring-es3' ),
			buffer: require.resolve( 'buffer' )
		},
	},
	resolveLoader: {
		plugins: [
			// Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
			// from the current package.
			PnpWebpackPlugin.moduleLoader(module),
		],
	},
	module: {
		strictExportPresence: true,
		rules: [
			{
				// "oneOf" will traverse all following loaders until one will
				// match the requirements. When no loader matches it will fall
				// back to the "file" loader at the end of the loader list.
				oneOf: [
					// "url" loader works just like "file" loader but it also embeds
					// assets smaller than specified size as data URLs to avoid requests.
					{
						test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
						type: 'asset'
					},
					// Process application JS with esbuild.
					{
						test: /\.(js|jsx|cjs)$/,
						include: [
							paths.appSrc,
							/@isle-project/
						],
						use: {
							loader: 'esbuild-loader',
							options: {
								loader: 'jsx',
								target: 'es2015',
								legalComments: 'none'
							}
						}
					},
					// "postcss" loader applies autoprefixer to our CSS.
					// "css" loader resolves paths in CSS and adds assets as dependencies.
					// `MiniCSSExtractPlugin` extracts styles into CSS
					// files. If you use code splitting, async bundles will have their own separate CSS chunk file.
					// By default we support CSS Modules with the extension .module.css
					{
						test: cssRegex,
						exclude: cssModuleRegex,
						use: getStyleLoaders({
							importLoaders: 1,
							sourceMap: shouldUseSourceMap,
						}),
						// Don't consider CSS imports dead code even if the
						// containing package claims to have no side effects.
						// Remove this when webpack adds a warning or an error for this.
						// See https://github.com/webpack/webpack/issues/6571
						sideEffects: true,
					},
					// "file" loader makes sure assets end up in the `build` folder.
					// When you `import` an asset, you get its filename.
					// This loader doesn't use a "test" so it will catch all modules
					// that fall through the other loaders.
					{

						type: 'asset/resource',
						// Exclude `js` files to keep "css" loader working as it injects
						// it's runtime that would otherwise be processed through "file" loader.
						// Also exclude `html` and `json` extensions so they get processed
						// by webpacks internal loaders.
						exclude: [/\.(js|jsx)$/, /\.html$/, /\.json$/, /\.css$/]
					},
					// ** STOP ** Are you adding a new loader?
					// Make sure to add the new loader(s) before the "file" loader.
				],
			},
		],
	},
	plugins: [
		// Generates an `index.html` file with the <script> injected.
		new HtmlWebpackPlugin({
			inject: true,
			template: paths.appHtml,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),
		new WebpackCdnPlugin({
			prodUrl: 'https://cdnjs.cloudflare.com/ajax/libs/:alias/:version/:path',
			modules: WebpackCdnPlugin.CDN_MODULES
		}),
		// Inlines the webpack runtime script. This script is too small to warrant
		// a network request.
		new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
		// Makes some environment variables available in index.html.
		// The public URL is available as %PUBLIC_URL% in index.html, e.g.:
		// <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
		// In production, it will be an empty string unless you specify "homepage"
		// in `package.json`, in which case it will be the pathname of that URL.
		new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
		// This gives some necessary context to module not found errors, such as
		// the requesting resource.
		new ModuleNotFoundPlugin(paths.appPath),
		// Makes some environment variables available to the JS code, for example:
		// if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
		// It is absolutely essential that NODE_ENV was set to production here.
		// Otherwise React will be compiled in the very slow development mode.
		new webpack.DefinePlugin(env.stringified),
		new CopyPlugin({
			patterns: [
				{ from: 'public/locales', to: 'locales' },
				{ from: 'public/img', to: 'img' },
			],
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: 'static/css/[name].[contenthash:8].css',
			chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
		}),
		// Generate a manifest file which contains a mapping of all asset filenames
		// to their corresponding output file so that tools can pick it up without
		// having to parse `index.html`.
		new WebpackManifestPlugin({
			fileName: 'asset-manifest.json',
			publicPath: publicPath,
		}),
		// Moment.js is an extremely popular library that bundles large locale files
		// by default due to how Webpack interprets its code. This is a practical
		// solution that requires the user to opt into importing specific locales.
		// https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
		// You can remove this if you don't use Moment.js:
		new webpack.IgnorePlugin({
			resourceRegExp: /^\.\/locale$/,
			contextRegExp: /moment$/
		}),
		// Generate a service worker script that will precache, and keep up to date,
		// the HTML & assets that are part of the Webpack build.
		new WorkboxWebpackPlugin.GenerateSW({
			clientsClaim: true,
			exclude: [/\.map$/, /asset-manifest\.json$/],
			navigateFallback: './index.html',
			navigateFallbackDenylist: [
				// Exclude URLs starting with /_, as they're likely an API call
				new RegExp('^/_'),
				// Exclude URLs containing a dot, as they're likely a resource in
				// public/ and not a SPA route
				new RegExp('/[^/]+\\.[^/]+$'),
			],
			maximumFileSizeToCacheInBytes: 10485760
		})
	],
	// Turn off performance processing because we utilize
	// our own hints via the FileSizeReporter
	performance: false,
};
