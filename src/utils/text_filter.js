// MODULES //

import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';


// MAIN //

/**
* Checks whether a row contains a string that matches a filter.
*
* @param {Object} filter - filter object
* @param {Object} row - row of data
* @returns {boolean} boolean indicating whether a row contains a string that matches a filter
*/
const textFilter = ( filter, row ) => {
	const str = row[ filter.id ] || '';
	return contains( lowercase( str ), lowercase( filter.value ) );
};


// EXPORTS //

export default textFilter;
