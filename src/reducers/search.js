// MODULES //

import lowercase from '@stdlib/string/lowercase';
import * as types from 'constants/action_types.js';


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
