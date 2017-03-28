// MODULES //

import * as types from './../constants/action_types.js';


// VARIABLES //

const initialState = {
	loggedIn: false,
	email: '',
	name: ''
};


// EXPORTS //

export default function user( state = initialState, action ) {
	switch ( action.type ) {
	case types.LOGGED_IN:
		console.log( action.payload );
		return Object.assign({}, state, {
			email: action.payload.email,
			name: action.payload.name,
			token: action.payload.token,
			id: action.payload.id,
			loggedIn: true
		});
	case types.LOGGED_OUT:
		return initialState;
	default:
		return state;
	}
}
