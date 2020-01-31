/**
* Copyright (C) 2016-2020 The ISLE Authors
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
import isArray from '@stdlib/assert/is-array';


// FUNCTIONS //

function titleCompare( a, b ) {
	return ( '' + a.title ).localeCompare( b.title );
}


// EXPORTS //

export default function cohorts( state = null, action ) {
	switch ( action.type ) {
	case types.RETRIEVED_ENROLLABLE_COHORTS: {
		if ( !isArray( action.payload.cohorts ) ) {
			return action.payload.cohorts;
		}
		return action.payload.cohorts.sort( titleCompare );
	}
	default:
		return state;
	}
}
