// MODULES //

import * as types from 'constants/action_types.js';


// EXPORTS //

export default function cohorts( state = null, action ) {
	switch ( action.type ) {
	case types.RETRIEVED_ENROLLABLE_COHORTS:
		return action.payload.cohorts;
	default:
		return state;
	}
}
