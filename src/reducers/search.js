// MODULES //

import * as types from './../constants/action_types.js';
import lowercase from '@stdlib/string/lowercase';


// VARIABLES //

const initialState = {
	phrase: null
};


// EXPORTS //

export default function search( state = initialState, action ) {
	switch ( action.type ) {
	case types.SEARCH_PHRASE_SET:
		return Object.assign({}, state, {
			phrase: lowercase( action.payload.phrase )
		});
	default:
		return state;
	}
}
