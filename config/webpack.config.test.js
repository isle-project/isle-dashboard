// MODULES //

// For babel-plugin-webpack-loaders...
require( 'babel-register' );
const path = require( 'path' );
const devConfig = require( './webpack.config.dev.js' );


// EXPORTS //

module.exports = {
	output: {
		libraryTarget: 'commonjs2'
	},
	module: {
		rules: [
			...devConfig.module.rules.
			slice( 2 ) // Remove eslint-loader and babel-loader
		]
	},
	resolve: {
		modules: [
			path.resolve( './../src' ),
			path.resolve( './../node_modules' ),
			path.resolve( './../node_modules/@stdlib/stdlib/lib/node_modules' )
		]
	}
};
