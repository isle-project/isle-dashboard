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

import isObject from '@stdlib/assert/is-object';


// MAIN //

function isOwner( user, namespace ) {
	let bool = false;
	for ( let i = 0; i < namespace.owners.length; i++ ) {
		const owner = namespace.owners[ i ];
		if ( isObject( owner ) ) {
			if ( owner.email === user.email ) {
				bool = true;
			}
		} else if ( owner === user.id ) {
			// Case: Owners array is not yet populated but contains only string IDs:
			bool = true;
		}
	}
	return bool;
}


// EXPORTS //

export default isOwner;
