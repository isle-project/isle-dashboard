// MODULES //

import * as types from 'constants/action_types.js';
import isArray from '@stdlib/assert/is-array';


// FUNCTIONS //

function titleCompare( a, b ) {
	return ( '' + a.title ).localeCompare( b.title );
}


// EXPORTS //

export default function cohorts( state = null, action ) {
	switch ( action.type ) {
	case types.RETRIEVED_ENROLLABLE_COHORTS:
		if ( !isArray( action.payload.cohorts ) ) {
			return action.payload.cohorts;
		}
		return action.payload.cohorts.sort( titleCompare );
	default:
		return state;
	}
}
