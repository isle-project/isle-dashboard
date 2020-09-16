// MODULES //

import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';


// MAIN //

const textFilter = ( filter, row ) => {
	const str = row[ filter.id ] || '';
	return contains( lowercase( str ), lowercase( filter.value ) );
};


// EXPORTS //

export default textFilter;
