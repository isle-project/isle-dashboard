/**
* Copyright (C) 2016-present The ISLE Authors
*
* The isle-dashboard program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// MODULES //

import * as types from 'constants/action_types.js';
import groupBy from '@stdlib/utils/group-by';
import copy from '@stdlib/utils/copy';


// VARIABLES //

const initialState = {
	loggedIn: false,
	email: '',
	name: '',
	organization: '',
	writeAccess: false,
	administrator: false,
	enrolledNamespaces: [],
	ownedNamespaces: [],
	lessonData: {},
	picture: null,
	createdAt: null,
	updatedAt: null,
	score: null,
	spentTime: null,
	files: null,
	badges: null,
	id: null,
	token: null
};


// FUNCTIONS //

function getNamespace( namespaces, name ) {
	for ( let i= 0; i < namespaces.length; i++ ) {
		if ( namespaces[i].title === name ) {
			return namespaces[i];
		}
	}
	return null;
}


// EXPORTS //

export default function user( state = initialState, action ) {
	switch ( action.type ) {
	case types.LOGGED_IN: {
		return Object.assign({}, state, {
			email: action.payload.email,
			name: action.payload.name,
			enrolledNamespaces: action.payload.enrolledNamespaces,
			ownedNamespaces: action.payload.ownedNamespaces,
			organization: action.payload.organization,
			token: action.payload.token,
			writeAccess: action.payload.writeAccess,
			administrator: action.payload.administrator,
			id: action.payload.id,
			picture: action.payload.picture,
			lessonData: action.payload.lessonData,
			createdAt: action.payload.createdAt,
			updatedAt: action.payload.updatedAt,
			score: action.payload.score,
			spentTime: action.payload.spentTime,
			loggedIn: true
		});
	}
	case types.AUTHENTICATED: {
		return Object.assign({}, state, {
			writeAccess: true
		});
	}
	case types.LOGGED_OUT: {
		return initialState;
	}
	case types.USER_UPDATED: {
		return Object.assign({}, state, {
			name: action.payload.name,
			organization: action.payload.organization
		});
	}
	case types.USER_PICTURE_MODIFIED: {
		return Object.assign({}, state, {
			picture: action.payload.picture
		});
	}
	case types.APPEND_CREATED_NAMESPACE: {
		const arr = state.ownedNamespaces.slice();
		arr.push( action.payload.namespace );
		return Object.assign({}, state, {
			ownedNamespaces: arr
		});
	}
	case types.DELETED_CURRENT_NAMESPACE: {
		const arr = [];
		for ( let i = 0; i < state.ownedNamespaces.length; i++ ) {
			const item = state.ownedNamespaces[ i ];
			if ( item._id !== action.payload.id ) {
				arr.push( item );
			}
		}
		return Object.assign({}, state, {
			ownedNamespaces: arr
		});
	}
	case types.RETRIEVED_LESSONS: {
		const arr = state.enrolledNamespaces.slice();
		for ( let i = 0; i < arr.length; i++ ) {
			const course = arr[ i ];
			if ( course.title === action.payload.namespaceName ) {
				arr[ i ].lessons = action.payload.lessons;
			}
		}
		return Object.assign({}, state, {
			enrolledNamespaces: arr
		});
	}
	case types.UPDATED_OWNED_NAMESPACE: {
		const arr = state.ownedNamespaces.slice();
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
	}
	case types.ADD_ENROLLED_NAMESPACE: {
		const arr = state.enrolledNamespaces.slice();
		arr.push( action.payload );
		return Object.assign({}, state, {
			enrolledNamespaces: arr
		});
	}
	case types.CREATED_ANNOUNCEMENT: {
		const namespaceName = action.payload.namespaceName;
		const enrolledNamespaces = copy( state.enrolledNamespaces );
		let ns = getNamespace( enrolledNamespaces, namespaceName );
		if ( ns ) {
			ns.announcements.unshift( action.payload.announcement );
		}
		const ownedNamespaces = copy( state.ownedNamespaces );
		ns = getNamespace( ownedNamespaces, namespaceName );
		if ( ns ) {
			ns.announcements.unshift( action.payload.announcement );
		}
		return Object.assign({}, state, {
			enrolledNamespaces,
			ownedNamespaces
		});
	}
	case types.EDITED_ANNOUNCEMENT: {
		const namespaceName = action.payload.namespaceName;
		const announcement = action.payload.announcement;
		const createdAt = announcement.createdAt;
		const enrolledNamespaces = copy( state.enrolledNamespaces );
		let ns = getNamespace( enrolledNamespaces, namespaceName );
		if ( ns ) {
			for ( let i = 0; i < ns.announcements.length; i++ ) {
				if ( ns.announcements[ i ].createdAt === createdAt ) {
					ns.announcements[ i ] = announcement;
				}
			}
		}
		const ownedNamespaces = copy( state.ownedNamespaces );
		ns = getNamespace( ownedNamespaces, namespaceName );
		if ( ns ) {
			for ( let i = 0; i < ns.announcements.length; i++ ) {
				if ( ns.announcements[ i ].createdAt === createdAt ) {
					ns.announcements[ i ] = announcement;
				}
			}
		}
		return Object.assign({}, state, {
			enrolledNamespaces,
			ownedNamespaces
		});
	}
	case types.DELETED_ANNOUNCEMENT: {
		const namespaceName = action.payload.namespaceName;
		const enrolledNamespaces = copy( state.enrolledNamespaces );
		let ns = getNamespace( enrolledNamespaces, namespaceName );
		if ( ns ) {
			ns.announcements.splice( action.payload.index, 1 );
		}
		const ownedNamespaces = copy( state.ownedNamespaces );
		ns = getNamespace( ownedNamespaces, namespaceName );
		if ( ns ) {
			ns.announcements.splice( action.payload.index, 1 );
		}
		return Object.assign({}, state, {
			enrolledNamespaces,
			ownedNamespaces
		});
	}
	case types.RECEIVED_FILES: {
		return Object.assign({}, state, {
			files: groupBy( action.payload.files, ( v ) => {
				return v.namespace;
			})
		});
	}
	case types.USER_RECEIVED_BADGES: {
		return Object.assign({}, state, {
			badges: action.payload.badges
		});
	}
	default:
		return state;
	}
}

