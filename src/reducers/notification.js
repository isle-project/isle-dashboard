// MODULES //

import * as types from './../constants/action_types.js';


// VARIABLES //

const initialState = {
	message: '',
	level: '',
	position: 'tl'
};


// EXPORTS //

export default function namespace( state = initialState, action ) {
	switch ( action.type ) {
	case types.ADD_NOTIFICATION:
		return Object.assign({}, state, {
			message: action.payload.message,
			level: action.payload.level
		});
	default:
		return state;
	}
}
