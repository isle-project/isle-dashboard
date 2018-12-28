// MODULES //

import * as types from './../constants/action_types.js';


// VARIABLES //

const initialState = {
	loggedIn: false,
	email: '',
	name: '',
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
	case types.APPEND_CREATED_NAMESPACE:
		const arr = state.ownedNamespaces.slice();
		arr.push( action.payload.namespace );
		return Object.assign({}, state, {
			ownedNamespaces: arr
		});
	case types.DELETED_CURRENT_NAMESPACE:
		const ownedNamespaces = [];
		for ( let i = 0; i < state.ownedNamespaces.length; i++ ) {
			const item = state.ownedNamespaces[ i ];
			if ( item._id !== action.payload.id ) {
				ownedNamespaces.push( item );
			}
		}
		return Object.assign({}, state, {
			ownedNamespaces
		});
	default:
		return state;
	}
}
