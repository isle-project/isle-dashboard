// MODULES //

var path = require('path');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var findCacheDir = require('find-cache-dir');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
var getClientEnvironment = require('./env');
var paths = require('./paths');


// MAIN //

var publicPath = '/';
var publicUrl = '';
var env = getClientEnvironment(publicUrl);

module.exports = {
	devtool: 'eval',
	entry: [
		require.resolve('react-dev-utils/webpackHotDevClient'),
		require.resolve('./polyfills'),
		paths.appIndexJs
	],
	output: {
		path: paths.appBuild,
		pathinfo: true,
		filename: 'static/js/bundle.js',
		publicPath: publicPath
	},
	resolve: {
		modules: paths.nodePaths.concat( [
			'node_modules', 
			'node_modules/@stdlib/stdlib/lib/node_modules'
		]),
		extensions: ['.js', '.json', '.jsx'],
		alias: {
			'react-native': 'react-native-web'
		}
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				enforce: "pre",
				use: "eslint-loader",
				include: paths.appSrc,
			},
			{
				test: /\.(js|jsx)$/,
				include: paths.appSrc,
				loader: 'babel-loader',
				options: {
					cacheDirectory: findCacheDir({
						name: 'react-scripts'
					}),
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
		}),
		new webpack.DefinePlugin(env),
		new webpack.HotModuleReplacementPlugin(),
		new CaseSensitivePathsPlugin(),
		new WatchMissingNodeModulesPlugin(paths.appNodeModules)
	],
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	}
};
