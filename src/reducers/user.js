// MODULES //

import isArray from '@stdlib/utils/is-array';
import * as types from './../constants/action_types.js';


// VARIABLES //

const initialState = {
	loggedIn: false,
	email: '',
	name: '',
	namespaces: [],
	organization: ''
};


// EXPORTS //

export default function user( state = initialState, action ) {
	switch ( action.type ) {
	case types.LOGGED_IN:
		return Object.assign({}, state, {
			email: action.payload.email,
			name: action.payload.name,
			organization: action.payload.organization,
			token: action.payload.token,
			id: action.payload.id,
			loggedIn: true
		});
	case types.LOGGED_OUT:
		return initialState;
	case types.USER_UPDATED:
		return Object.assign({}, state, {
			name: action.payload.name,
			organization: action.payload.organization
		});
	case types.RETRIEVED_NAMESPACES:
		const { namespaces } = action.payload;
		if ( !isArray( namespaces ) ) {
			return state;
		}
		return Object.assign({}, state, {
			namespaces
		});
	default:
		return state;
	}
}
