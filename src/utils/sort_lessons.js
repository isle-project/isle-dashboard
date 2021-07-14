/**
* Copyright (C) 2016-present The ISLE Authors
*
* The isle-dashboard program is free software: you can redistribute it and/or modify
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

// VARIABLES //

const OPTS = {
	numeric: true // Use numeric collation such that "1" < "2" < "10"...
};


// MAIN //

/**
* Sorts lessons according to the `search` object in place.
*
* @param {Array} lessons - a list of lessons
* @param {Object} search - search object
* @param {string} search.type - either `sequentially`, `alphabetically`, `created_at`, or `updated_at`
* @param {string} search.direction - either `ascending` or `descending`
*/
function sortLessons( lessons, search ) {
	const { type, direction } = search;
	if ( type === 'sequentially' ) {
		if ( direction === 'ascending' ) {
			lessons.sort( ( a, b ) => {
				return a.pos - b.pos;
			});
		} else {
			lessons.sort( ( a, b ) => {
				return b.pos - a.pos;
			});
		}
	}
	else if ( type === 'alphabetically' ) {
		if ( direction === 'ascending' ) {
			lessons.sort( ( a, b ) => {
				const x = a.namespace + a.title;
				const y = b.namespace + b.title;
				return x.localeCompare( y, void 0, OPTS );
			});
		} else {
			lessons.sort( ( a, b ) => {
				const x = a.namespace + a.title;
				const y = b.namespace + b.title;
				return y.localeCompare( x, void 0, OPTS );
			});
		}
	}
	else if ( type === 'created_at' ) {
		if ( direction === 'ascending' ) {
			lessons.sort( ( a, b ) => {
				return a.createdAt.localeCompare( b.createdAt, void 0, OPTS );
			});
		} else {
			lessons.sort( ( a, b ) => {
				return b.createdAt.localeCompare( a.createdAt, void 0, OPTS );
			});
		}
	}
	else if ( type === 'updated_at' ) {
		if ( direction === 'ascending' ) {
			lessons.sort( ( a, b ) => {
				return a.updatedAt.localeCompare( b.updatedAt, void 0, OPTS );
			});
		} else {
			lessons.sort( ( a, b ) => {
				return b.updatedAt.localeCompare( a.updatedAt, void 0, OPTS );
			});
		}
	}
}


// EXPORTS //

export default sortLessons;
