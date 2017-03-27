// MODULES //

var path = require('path');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var url = require('url');
var paths = require('./paths');
var getClientEnvironment = require('./env');


// FUNCTIONS //

function ensureSlash(path, needsSlash) {
	var hasSlash = path.endsWith('/');
	if (hasSlash && !needsSlash) {
		return path.substr(path, path.length - 1);
	} else if (!hasSlash && needsSlash) {
		return path + '/';
	} else {
		return path;
	}
}

// MAIN //

var homepagePath = require(paths.appPackageJson).homepage;
var homepagePathname = homepagePath ? url.parse(homepagePath).pathname : '/';
var publicPath = ensureSlash(homepagePathname, true);
var publicUrl = ensureSlash(homepagePathname, false);
var env = getClientEnvironment(publicUrl);

if (env['process.env.NODE_ENV'] !== '"production"') {
	throw new Error('Production builds must have NODE_ENV=production.');
}

module.exports = {	
	bail: true,
	devtool: 'source-map',
	entry: [
		require.resolve('./polyfills'),
		paths.appIndexJs
	],
	output: {
		path: paths.appBuild,
		filename: 'static/js/[name].[chunkhash:8].js',
		chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
		publicPath: publicPath
	},
	resolve: {
		modules: paths.nodePaths.concat( 'node_modules' ),
		extensions: ['.js', '.json', '.jsx'],
		alias: {
			'react-native': 'react-native-web'
		}
	},
	
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				enforce: 'pre',
				use: 'eslint-loader',
				include: paths.appSrc
			},
			{
				test: /\.(js|jsx)$/,
				include: paths.appSrc,
				loader: 'babel-loader',
				query: {
					plugins: [
						'transform-async-to-generator'
					]
				}
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: { 
							plugins: () => [
								autoprefixer({
									browsers: [
										'>1%',
										'last 4 versions',
										'Firefox ESR',
										'not ie < 9'
									]
								})
							]
						}
					}
				]
			},
			{
				test: /\.json$/,
				use: 'json-loader'
			},
			{
				test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
				loader: 'file-loader',
				query: {
					name: 'static/media/[name].[hash:8].[ext]'
				}
			},
			{
				test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: 'static/media/[name].[hash:8].[ext]'
				}
			}
		]
	},
	plugins: [
		new InterpolateHtmlPlugin({
			PUBLIC_URL: publicUrl
		}),
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
				minifyURLs: true
			}
		}),
		new webpack.DefinePlugin(env),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				screw_ie8: true, // React doesn't support IE8
				warnings: false
			},
			mangle: {
				screw_ie8: true
			},
			output: {
				comments: false,
				screw_ie8: true
			}
		}),
		new ExtractTextPlugin('static/css/[name].[contenthash:8].css')
	],
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	}
};
