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

import { AnyAction } from 'redux';
import groupBy from '@stdlib/utils/group-by';
import copy from '@stdlib/utils/copy';
import * as types from 'constants/action_types.js';


// VARIABLES //

interface UserState {
	loggedIn: boolean;
	email: string;
	verifiedEmail: boolean;
	name: string;
	firstName: string;
	lastName: string;
	preferredName: string;
	pronouns: string;
	organization: string;
	writeAccess: boolean;
	administrator: boolean;
	enrolledNamespaces: Array<any>;
	ownedNamespaces: Array<any>;
	lessonData: any;
	picture: string | null;
	createdAt: any | null;
	updatedAt: any | null;
	score: number | null;
	spentTime: number | null;
	files: any;
	badges: any;
	id: string | null;
	token: string | null;
	tickets: Array<any>;
	licensed: boolean;
	customFields: any;
	availableCustomFields: Array<any>;
	twoFactorAuth: boolean;
	requestTFA: any;
	templateLessons: Array<any>;
}

const initialState: UserState = {
	loggedIn: false,
	email: '',
	verifiedEmail: false,
	name: '',
	firstName: '',
	lastName: '',
	preferredName: '',
	pronouns: '',
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
	token: null,
	tickets: [],
	licensed: false,
	customFields: null,
	availableCustomFields: [],
	twoFactorAuth: false,
	requestTFA: null,
	templateLessons: []
};


// FUNCTIONS //

function getNamespace( namespaces: Array<any>, name: string ): any {
	for ( let i= 0; i < namespaces.length; i++ ) {
		if ( namespaces[i].title === name ) {
			return namespaces[i];
		}
	}
	return null;
}


// EXPORTS //

export default function user( state: UserState = initialState, action: AnyAction ): UserState {
	switch ( action.type ) {
	case types.RECEIVED_TOKEN: {
		return Object.assign({}, state, {
			token: action.payload.token,
			id: action.payload.id
		});
	}
	case types.LOGGED_IN: {
		return Object.assign({}, state, {
			email: action.payload.email,
			verifiedEmail: action.payload.verifiedEmail,
			name: action.payload.name,
			firstName: action.payload.firstName,
			lastName: action.payload.lastName,
			preferredName: action.payload.preferredName,
			pronouns: action.payload.pronouns,
			enrolledNamespaces: action.payload.enrolledNamespaces,
			ownedNamespaces: action.payload.ownedNamespaces,
			organization: action.payload.organization,
			writeAccess: action.payload.writeAccess,
			administrator: action.payload.administrator,
			picture: action.payload.picture,
			lessonData: action.payload.lessonData,
			createdAt: action.payload.createdAt,
			updatedAt: action.payload.updatedAt,
			score: action.payload.score,
			spentTime: action.payload.spentTime,
			licensed: action.payload.licensed,
			customFields: action.payload.customFields,
			availableCustomFields: action.payload.availableCustomFields,
			twoFactorAuth: action.payload.twoFactorAuth,
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
			firstName: action.payload.firstName,
			lastName: action.payload.lastName,
			preferredName: action.payload.preferredName,
			pronouns: action.payload.pronouns,
			organization: action.payload.organization,
			customFields: action.payload.customFields
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
		const arr: Array<any> = [];
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
	case types.GET_USER_TICKETS: {
		let tickets = action.payload.tickets;
		tickets = tickets.map( x => {
			x.createdAt = new Date( x.createdAt );
			return x;
		});
		return Object.assign({}, state, {
			tickets
		});
	}
	case types.CREATED_TICKET: {
		const tickets = state.tickets.slice();
		tickets.push({
			...action.payload,
			messages: [],
			user: {
				picture: state.picture && state.picture.substring( state.picture.lastIndexOf( '/' )+1 ),
				name: state.name,
				email: state.email
			}
		});
		return Object.assign({}, state, {
			tickets
		});
	}
	case types.TICKET_OPENED: {
		const tickets = state.tickets.map( ticket => {
			if ( ticket._id === action.payload.id ) {
				ticket.done = false;
			}
			return ticket;
		});
		return Object.assign({}, state, {
			tickets
		});
	}
	case types.TICKET_CLOSED: {
		const tickets = state.tickets.map( ticket => {
			if ( ticket._id === action.payload.id ) {
				ticket.done = true;
			}
			return ticket;
		});
		return Object.assign({}, state, {
			tickets
		});
	}
	case types.TICKET_MESSAGE_ADDED: {
		const tickets = state.tickets.map( ticket => {
			if ( ticket._id === action.payload.id ) {
				const message = action.payload.message;
				message.picture = message.picture.substring( message.picture.lastIndexOf( '/' )+1 );
				ticket.messages.unshift( message );
			}
			return ticket;
		});
		return Object.assign({}, state, {
			tickets
		});
	}
	case types.USER_RECEIVED_BADGES: {
		return Object.assign({}, state, {
			badges: action.payload.badges
		});
	}
	case types.GET_CUSTOM_FIELDS:
	case types.FIELD_POSITION_DECREMENTED:
	case types.FIELD_POSITION_INCREMENTED: {
		return Object.assign({}, state, {
			availableCustomFields: action.payload.customFields
		});
	}
	case types.DELETED_CUSTOM_FIELD: {
		const fields: Array<any> = [];
		for ( let i = 0; i < state.availableCustomFields.length; i++ ) {
			const item = state.availableCustomFields[ i ];
			if ( item._id !== action.payload.id ) {
				fields.push( item );
			}
		}
		return Object.assign({}, state, {
			availableCustomFields: fields
		});
	}
	case types.CREATED_CUSTOM_FIELD: {
		const availableCustomFields = state.availableCustomFields.slice();
		availableCustomFields.push({
			...action.payload
		});
		return Object.assign({}, state, {
			availableCustomFields
		});
	}
	case types.ENABLED_TFA: {
		return Object.assign({}, state, {
			twoFactorAuth: action.payload.verified
		});
	}
	case types.DISABLED_TFA: {
		return Object.assign({}, state, {
			twoFactorAuth: !action.payload.disabled
		});
	}
	case types.REQUEST_TFA: {
		return Object.assign({}, state, {
			requestTFA: {
				email: action.payload.email,
				password: action.payload.password
			}
		});
	}
	case types.GET_TEMPLATE_LESSONS: {
		return Object.assign({}, state, {
			templateLessons: action.payload.templateLessons
		});
	}
	case types.UPDATED_METRIC: {
		console.log( 'UPDATED_METRIC', action.payload );
		const enrolledNamespaces = state.enrolledNamespaces.slice();
		const ownedNamespaces = state.ownedNamespaces.slice();
		for ( let i = 0; i < state.enrolledNamespaces.length; i++ ) {
			const ns = state.enrolledNamespaces[ i ];
			if ( ns._id !== action.payload.id ) {
				continue;
			}
			const completions = ns.completions.slice();
			const metric = action.payload.metric;
			for ( let j = 0; j < completions.length; j++ ) {
				if ( completions[ j ].name === metric.name ) {
					completions[ j ] = metric;
					break;
				}
			}
			enrolledNamespaces[ i ].completions = completions;
			break;
		}
		for ( let i = 0; i < state.ownedNamespaces.length; i++ ) {
			const ns = state.ownedNamespaces[ i ];
			if ( ns._id !== action.payload.id ) {
				continue;
			}
			const completions = ns.completions.slice();
			const metric = action.payload.metric;
			for ( let j = 0; j < completions.length; j++ ) {
				if ( completions[ j ].name === metric.name ) {
					completions[ j ] = metric;
					break;
				}
			}
			ownedNamespaces[ i ].completions = completions;
			break;
		}
		return Object.assign({}, state, {
			enrolledNamespaces: enrolledNamespaces,
			ownedNamespaces: ownedNamespaces
		});
	}
	case types.CREATED_METRIC: {
		const enrolledNamespaces = state.enrolledNamespaces.slice();
		const ownedNamespaces = state.ownedNamespaces.slice();
		for ( let i = 0; i < state.enrolledNamespaces.length; i++ ) {
			const ns = state.enrolledNamespaces[ i ];
			if ( ns._id !== action.payload.id ) {
				continue;
			}
			const completions = ns.completions.slice();
			completions.push( action.payload.metric );
			enrolledNamespaces[ i ].completions = completions;
			break;
		}
		for ( let i = 0; i < state.ownedNamespaces.length; i++ ) {
			const ns = state.ownedNamespaces[ i ];
			if ( ns._id !== action.payload.id ) {
				continue;
			}
			const completions = ns.completions.slice();
			completions.push( action.payload.metric );
			ownedNamespaces[ i ].completions = completions;
			break;
		}
		return Object.assign({}, state, {
			enrolledNamespaces: enrolledNamespaces,
			ownedNamespaces: ownedNamespaces
		});
	}
	case types.DELETED_METRIC: {
		console.log( 'DELETED_METRIC', action.payload );
		const enrolledNamespaces = state.enrolledNamespaces.slice();
		const ownedNamespaces = state.ownedNamespaces.slice();
		for ( let i = 0; i < state.enrolledNamespaces.length; i++ ) {
			const ns = state.enrolledNamespaces[ i ];
			if ( ns._id !== action.payload.id ) {
				continue;
			}
			const newCompletions: Array<any> = [];
			for ( let i = 0; i < ns.completions.length; i++ ) {
				if ( ns.completions[ i ].name !== action.payload.name ) {
					newCompletions.push( ns.completions[ i ] );
				}
			}
			enrolledNamespaces[ i ].completions = newCompletions;
			console.log( 'newCompletions', newCompletions );
			break;
		}
		for ( let i = 0; i < state.ownedNamespaces.length; i++ ) {
			const ns = state.ownedNamespaces[ i ];
			if ( ns._id !== action.payload.id ) {
				continue;
			}
			const newCompletions: Array<any> = [];
			for ( let i = 0; i < ns.completions.length; i++ ) {
				if ( ns.completions[ i ].name !== action.payload.name ) {
					newCompletions.push( ns.completions[ i ] );
				}
			}
			ownedNamespaces[ i ].completions = newCompletions;
			console.log( 'newCompletions', newCompletions );
			break;
		}
		return Object.assign({}, state, {
			enrolledNamespaces: enrolledNamespaces,
			ownedNamespaces: ownedNamespaces
		});
	}
	default:
		return state;
	}
}

