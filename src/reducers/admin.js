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
	namespaces: [],
	rooms: [],
	users: [],
	statistics: {},
	historicalStatistics: []
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
	case types.GET_ALL_FILES:
		return Object.assign({}, state, {
			files: action.payload.files
		});
	case types.DELETED_FILE: {
		let files = state.files.slice();
		files = files.filter( x => x._id !== action.payload.id );
		return Object.assign({}, state, {
			files
		});
	}
	case types.GET_ALL_LESSONS: {
		let lessons = action.payload.lessons;
		lessons = lessons.map( x => {
			x.createdAt = new Date( x.createdAt );
			x.updatedAt = new Date( x.updatedAt );
			return x;
		});
		return Object.assign({}, state, {
			lessons
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
		return Object.assign({}, state, {
			events: action.payload.events
		});
	}
	case types.GET_ROOMS: {
		return Object.assign({}, state, {
			rooms: action.payload.rooms
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
	case types.GET_HISTORICAL_OVERVIEW_STATISTICS: {
		const statistics = action.payload.statistics.map( x => {
			x.createdAt = x.createdAt.substring( 0, x.createdAt.indexOf( 'T' ) );
			return x;
		});
		return Object.assign({}, state, {
			historicalStatistics: statistics
		});
	}
	default:
		return state;
	}
}
