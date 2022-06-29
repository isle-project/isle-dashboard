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
import * as types from 'constants/action_types.js';
import isArray from '@stdlib/assert/is-array';
import isRegExpString from '@stdlib/assert/is-regexp-string';
import reFromString from '@stdlib/utils/regexp-from-string';
import contains from '@stdlib/assert/contains';


// FUNCTIONS //

function titleCompare( a: any, b: any ): number {
	return ( '' + a.title ).localeCompare( b.title );
}


// EXPORTS //

export default function cohorts( state = null, action: AnyAction ) {
	switch ( action.type ) {
	case types.RETRIEVED_ENROLLABLE_COHORTS: {
		let cohorts = action.payload.cohorts;
		if ( !isArray( cohorts ) ) {
			return cohorts;
		}
		cohorts = cohorts.filter( elem => {
			let emailFilter = elem.emailFilter || '';
			if ( isRegExpString( emailFilter ) ) {
				emailFilter = reFromString( emailFilter );
				return emailFilter.test( action.payload.user.email );
			}
			return contains( action.payload.user.email, emailFilter || '' );
		});
		return cohorts.sort( titleCompare );
	}
	default:
		return state;
	}
}
