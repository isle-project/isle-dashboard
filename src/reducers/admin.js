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


// VARIABLES //

const initialState = {
	users: []
};


// EXPORTS //

export default function admin( state = initialState, action ) {
	switch ( action.type ) {
	case types.GET_USERS: {
		return Object.assign({}, state, {
			users: action.payload.users
		});
	}
	case types.DELETED_USER: {
		let users = state.users.slice();
		users = users.filter( x => x._id !== action.payload.id );
		return Object.assign({}, state, {
			users
		});
	}
	default:
		return state;
	}
}
