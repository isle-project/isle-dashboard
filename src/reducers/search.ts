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
import lowercase from '@stdlib/string/lowercase';
import * as types from 'constants/action_types.js';


// VARIABLES //

interface SearchState {
	phrase: string | null;
	type: string;
	direction: string;
}

const initialState: SearchState = {
	phrase: null,
	type: 'sequentially',
	direction: 'ascending'
};


// EXPORTS //

export default function search( state: SearchState = initialState, action: AnyAction ): SearchState {
	switch ( action.type ) {
	case types.SEARCH_PHRASE_SET: {
		return Object.assign({}, state, {
			phrase: lowercase( action.payload.phrase )
		});
	}
	case types.LESSON_ORDER: {
		return Object.assign({}, state, {
			type: action.payload.type
		});
	}
	case types.LESSON_ORDER_DIRECTION: {
		return Object.assign({}, state, {
			direction: action.payload.direction
		});
	}
	case types.LOGGED_OUT: {
		return initialState;
	}
	default:
		return state;
	}
}
