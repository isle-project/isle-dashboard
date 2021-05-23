/**
* Copyright (C) 2016-present The ISLE Authors
*
* The isle-server program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

'use strict';

// MODULES //

const { basename, resolve } = require( 'path' );
const { execSync } = require( 'child_process' );
const glob = require( 'glob' );
const readJSON = require( '@stdlib/fs/read-json' );
const objectKeys = require( '@stdlib/utils/keys' );


// VARIABLES //

const TOPLEVEL_DIR = resolve( __dirname, '..', '..', '..' );


// MAIN //

glob( 'public/locales/en/*.json', {
	cwd: TOPLEVEL_DIR
}, function onFiles( err, files ) {
	const translations = new Set();
	for ( let i = 0; i < files.length; i++ ) {
		const file = resolve( TOPLEVEL_DIR, files[ i ] );
		const table = readJSON.sync( file );
		const keys = objectKeys( table );
		keys.forEach( key => {
			translations.add( key );
			translations.add( basename( files[ i ], '.json' )+':'+key );
		});
	}
	const command = 'grep -hroP "(props.| )t\\( ?\'\\K[^\']*(?=\' ?\\))" src/* ';
	const identifiers = execSync( command, {
		cwd: TOPLEVEL_DIR
	})
		.toString()
		.split( '\n' );
	const unique = new Set( identifiers );

	unique.forEach( value => {
		if ( value && !translations.has( value ) ) {
			console.log( 'Missing translation: '+value ); // eslint-disable-line no-console
		}
	});
});

