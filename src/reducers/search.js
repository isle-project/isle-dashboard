// MODULES //

import lowercase from '@stdlib/string/lowercase';
import * as types from 'constants/action_types.js';


// VARIABLES //

const initialState = {
	phrase: null,
	type: 'alphabetically',
	direction: 'ascending'
};


// EXPORTS //

export default function search( state = initialState, action ) {
	switch ( action.type ) {
	case types.SEARCH_PHRASE_SET:
		return Object.assign({}, state, {
			phrase: lowercase( action.payload.phrase )
		});
	case types.LESSON_ORDER:
		return Object.assign({}, state, {
			type: action.payload.type
		});
	case types.LESSON_ORDER_DIRECTION:
		return Object.assign({}, state, {
			direction: action.payload.direction
		});
	case types.LOGGED_OUT:
		return initialState;
	default:
		return state;
	}
}
