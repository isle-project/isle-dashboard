// MODULES //

import * as types from 'constants/action_types.js';
import groupBy from '@stdlib/utils/group-by';

// VARIABLES //

const initialState = {
	loggedIn: false,
	email: '',
	name: '',
	organization: '',
	writeAccess: false,
	enrolledNamespaces: [],
	ownedNamespaces: [],
	lessonData: {},
	picture: null,
	createdAt: null,
	updatedAt: null,
	score: null,
	spentTime: null,
	files: null
};


// EXPORTS //

export default function user( state = initialState, action ) {
	let arr;
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
			picture: action.payload.picture,
			lessonData: action.payload.lessonData,
			createdAt: action.payload.createdAt,
			updatedAt: action.payload.updatedAt,
			score: action.payload.score,
			spentTime: action.payload.spentTime,
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
	case types.USER_PICTURE_MODIFIED:
		return Object.assign({}, state, {
			picture: action.payload.picture
		});
	case types.APPEND_CREATED_NAMESPACE:
		arr = state.ownedNamespaces.slice();
		arr.push( action.payload.namespace );
		return Object.assign({}, state, {
			ownedNamespaces: arr
		});
	case types.DELETED_CURRENT_NAMESPACE:
		arr = [];
		for ( let i = 0; i < state.ownedNamespaces.length; i++ ) {
			const item = state.ownedNamespaces[ i ];
			if ( item._id !== action.payload.id ) {
				arr.push( item );
			}
		}
		return Object.assign({}, state, {
			ownedNamespaces: arr
		});
	case types.RETRIEVED_LESSONS:
		arr = state.enrolledNamespaces.slice();
		for ( let i = 0; i < arr.length; i++ ) {
			let course = arr[ i ];
			if ( course.title === action.payload.namespaceName ) {
				arr[ i ].lessons = action.payload.lessons;
			}
		}
		return Object.assign({}, state, {
			enrolledNamespaces: arr
		});
	case types.UPDATED_OWNED_NAMESPACE:
		arr = state.ownedNamespaces.slice();
		for ( let i = 0; i < arr.length; i++ ) {
			const item = arr[ i ];
			if ( item._id === action.payload._id ) {
				arr[ i ] = action.payload;
			} else {
				arr[ i ] = item;
			}
		}
		return Object.assign({}, state, {
			ownedNamespaces: arr
		});
	case types.RECEIVED_FILES:
		return Object.assign({}, state, {
			files: groupBy(action.payload.files, (v) => {
				return v.namespace;
			})
		});
	default:
		return state;
	}
}
