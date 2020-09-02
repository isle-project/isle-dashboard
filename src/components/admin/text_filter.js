// MODULES //

import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';


// MAIN //

const textFilter = ( filter, row ) => {
	return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
};


// EXPORTS //

export default textFilter;
