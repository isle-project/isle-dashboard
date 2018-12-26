// MODULES //

import isArray from '@stdlib/assert/is-array';
import * as types from './../constants/action_types.js';


// VARIABLES //

const initialState = {
	loggedIn: false,
	email: '',
	name: '',
	namespaces: [],
	organization: '',
	writeAccess: false,
	enrolledNamespaces: [],
	ownedNamespaces: []
};


// EXPORTS //

export default function user( state = initialState, action ) {
	switch ( action.type ) {
	case types.LOGGED_IN:
		return Object.assign({}, state, {
			email: action.payload.email,
			name: action.payload.name,
			enrolledNamespaces: action.payload.enrolledNamespaces,
			ownedNamespaces: action.payload.ownedNamespaces,
			organization: action.payload.organization,
			token: action.payload.token,
			writeAccess: action.payload.writeAccess,
			id: action.payload.id,
			loggedIn: true
		});
	case types.AUTHENTICATED:
		return Object.assign({}, state, {
			writeAccess: true
		});
	case types.LOGGED_OUT:
		return initialState;
	case types.USER_UPDATED:
		return Object.assign({}, state, {
			name: action.payload.name,
			organization: action.payload.organization
		});
	/* eslint-disable no-case-declarations */
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
