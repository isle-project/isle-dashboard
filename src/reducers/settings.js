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

const initialState = {};


// EXPORTS //

export default function settings( state = initialState, action ) {
	switch ( action.type ) {
	case types.GET_SETTINGS_PUBLIC: {
		return Object.assign({}, state, action.payload );
	}
	case types.UPDATED_SETTINGS: {
		return Object.assign({}, state, action.payload.settings );
	}
	case types.RETRIEVED_ASSESSMENT_RULES: {
		return Object.assign({}, state, {
			assessmentRules: action.payload.assessmentRules
		});
	}
	default:
		return state;
	}
}
