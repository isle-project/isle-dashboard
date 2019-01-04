// MODULES //

import * as types from 'constants/action_types.js';


// EXPORTS //

export default function namespace( state = null, action ) {
	switch ( action.type ) {
	case types.RETRIEVED_BADGES:
		return action.payload.badges;
	default:
		return state;
	}
}
