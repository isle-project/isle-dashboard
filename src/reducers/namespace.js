// MODULES //

import * as types from './../constants/action_types.js';


// VARIABLES //

const initialState = {
	id: null,
	title: '',
	description: '',
	owners: ''
};


// EXPORTS //

export default function namespace( state = initialState, action ) {
	switch ( action.type ) {
	case types.CHANGED_NAMESPACE:
		return Object.assign({}, state, {
			_id: action.payload._id,
			title: action.payload.title,
			description: action.payload.description,
			owners: action.payload.owners
		});
	case types.DELETED_CURRENT_NAMESPACE:
		return initialState;
	default:
		return state;
	}
}
