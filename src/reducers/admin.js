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

import objectKeys from '@stdlib/utils/keys';
import * as types from 'constants/action_types.js';


// VARIABLES //

const initialState = {
	cohorts: [],
	events: [],
	files: [],
	lessons: [],
	lessonsMap: {},
	namespaces: [],
	rooms: [],
	tickets: [],
	users: [],
	statistics: {},
	requestStatistics: [],
	historicalStatistics: [],
	backups: [],
	license: null,
	settings: {}
};


// EXPORTS //

export default function admin( state = initialState, action ) {
	switch ( action.type ) {
	case types.GET_USERS: {
		let users = action.payload.users;
		users = users.map( x => {
			const keys = objectKeys( x.lessonData );
			let chatMessages = 0;
			let nActions = 0;
			for ( let i = 0; i < keys.length; i++ ) {
				const key = keys[ i ];
				chatMessages += x.lessonData[ key ].chatMessages;
				const types = objectKeys( x.lessonData[ key ].actionTypes );
				for ( let j = 0; j < types.length; j++ ) {
					nActions += x.lessonData[ key ].actionTypes[ types[ j ] ];
				}
			}
			x.nActions = nActions;
			x.chatMessages = chatMessages;
			x.createdAt = new Date( x.createdAt );
			x.updatedAt = new Date( x.updatedAt );
			return x;
		});
		return Object.assign({}, state, {
			users
		});
	}
	case types.GET_ALL_COHORTS: {
		let cohorts = action.payload.cohorts;
		cohorts = cohorts.map( x => {
			x.startDate = new Date( x.startDate );
			x.endDate = new Date( x.endDate );
			return x;
		});
		return Object.assign({}, state, {
			cohorts
		});
	}
	case types.GET_ALL_FILES: {
		let files = action.payload.files;
		files = files.map( x => {
			x.updatedAt = new Date( x.updatedAt );
			return x;
		});
		return Object.assign({}, state, {
			files
		});
	}
	case types.DELETED_FILE: {
		let files = state.files.slice();
		files = files.filter( x => x._id !== action.payload.id );
		return Object.assign({}, state, {
			files
		});
	}
	case types.GET_ALL_LESSONS: {
		let lessons = action.payload.lessons;
		const lessonsMap = { ...state.lessonsMap };
		lessons = lessons.map( x => {
			x.createdAt = new Date( x.createdAt );
			x.updatedAt = new Date( x.updatedAt );
			lessonsMap[ x._id ] = x.title;
			return x;
		});
		return Object.assign({}, state, {
			lessons,
			lessonsMap
		});
	}
	case types.GET_ALL_NAMESPACES: {
		let namespaces = action.payload.namespaces;
		namespaces = namespaces.map( x => {
			x.createdAt = new Date( x.createdAt );
			x.updatedAt = new Date( x.updatedAt );
			return x;
		});
		return Object.assign({}, state, {
			namespaces
		});
	}
	case types.GET_EVENTS: {
		let events = action.payload.events;
		events = events.map( x => {
			x.time = new Date( x.time );
			return x;
		});
		return Object.assign({}, state, {
			events
		});
	}
	case types.GET_ROOMS: {
		let rooms = action.payload.rooms;
		rooms = rooms.map( x => {
			x.startTime = new Date( x.startTime );
			return x;
		});
		return Object.assign({}, state, {
			rooms
		});
	}
	case types.DELETED_EVENT: {
		let events = state.events.slice();
		events = events.filter( x => x._id !== action.payload.id );
		return Object.assign({}, state, {
			events
		});
	}
	case types.DELETED_USER: {
		let users = state.users.slice();
		users = users.filter( x => x._id !== action.payload.id );
		return Object.assign({}, state, {
			users
		});
	}
	case types.TRIGGERED_EVENT: {
		const events = state.events.slice();
		for ( let i = 0; i < events.length; i++ ) {
			if ( events[ i ]._id === action.payload.id ) {
				events[ i ].done = true;
			}
		}
		return Object.assign({}, state, {
			events
		});
	}
	case types.USER_UPDATED_BY_ADMIN: {
		let users = state.users.slice();
		for ( let i = 0; i < users.length; i++ ) {
			const user = users[ i ];
			if ( user._id === action.payload.id ) {
				const keys = objectKeys( action.payload );
				for ( let j = 0; j < keys.length; j++ ) {
					const key = keys[ j ];
					if ( key !== 'id' ) {
						user[ key ] = action.payload[ key ];
					}
				}
			}
		}
		return Object.assign({}, state, {
			users
		});
	}
	case types.GET_OVERVIEW_STATISTICS: {
		return Object.assign({}, state, {
			statistics: action.payload.statistics
		});
	}
	case types.GET_ALL_TICKETS: {
		let tickets = action.payload.tickets;
		tickets = tickets.map( x => {
			x.createdAt = new Date( x.createdAt );
			x.updatedAt = new Date( x.updatedAt );
			return x;
		});
		return Object.assign({}, state, {
			tickets
		});
	}
	case types.DELETED_TICKET: {
		let tickets = state.tickets.slice();
		tickets = tickets.filter( x => x._id !== action.payload.id );
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
	case types.TICKET_PRIORITY_UPDATED: {
		const tickets = state.tickets.map( ticket => {
			if ( ticket._id === action.payload.id ) {
				ticket.priority = action.payload.priority;
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
	case types.RECEIVED_LICENSE:
		return Object.assign({}, state, {
			license: action.payload.license
		});
	case types.REMOVED_LICENSE:
		return Object.assign({}, state, {
			license: null
		});
	case types.GET_HISTORICAL_OVERVIEW_STATISTICS: {
		const statistics = action.payload.statistics.map( x => {
			x.createdAt = x.createdAt.substring( 0, x.createdAt.indexOf( 'T' ) );
			return x;
		});
		return Object.assign({}, state, {
			historicalStatistics: statistics
		});
	}
	case types.GET_REQUEST_STATISTICS: {
		return Object.assign({}, state, {
			requestStatistics: action.payload.statistics
		});
	}
	case types.GET_BACKUPS: {
		return Object.assign({}, state, {
			backups: action.payload.backups
		});
	}
	case types.CREATED_BACKUP: {
		const backups = state.backups.slice();
		backups.push( action.payload.backup );
		return Object.assign({}, state, {
			backups
		});
	}
	case types.DELETED_BACKUP: {
		let backups = state.backups.slice();
		backups = backups.filter( x => x._id !== action.payload.id );
		return Object.assign({}, state, {
			backups
		});
	}
	case types.GET_SETTINGS: {
		return Object.assign({}, state, {
			settings: action.payload
		});
	}
	case types.UPDATED_SETTINGS: {
		return Object.assign({}, state, {
			settings: action.payload.settings
		});
	}
	default:
		return state;
	}
}
