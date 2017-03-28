// MODULES //

import * as types from './../constants/action_types.js';


// VARIABLES //

const initialState = {
	title: '',
	description: '',
	owners: ''
};


// EXPORTS //

export default function namespace( state = initialState, action ) {
	switch ( action.type ) {
	case types.CHANGED_NAMESPACE:
		return Object.assign({}, state, {
			title: action.payload.title,
			description: action.payload.description,
			owners: action.payload.owners
		});
	default:
		return state;
	}
}
