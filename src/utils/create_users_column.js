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

import React from 'react';
import Avatar from 'react-string-avatar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import server from 'constants/server';
import COLORS from 'constants/colors';


// MAIN //

function createUsersColumn({ Header, accessor, maxWidth = 600 }) {
	return {
		Header,
		accessor,
		style: { marginTop: '2px', color: 'darkslategrey' },
		maxWidth,
		filterable: false,
		Cell: ( row ) => {
			const arr = [];
			for ( let i = 0; i < row.value.length; i++ ) {
				const owner = row.value[ i ];
				if ( owner.picture !== 'anonymous.jpg' ) {
					arr.push(
						<OverlayTrigger key={owner.email} trigger={['hover', 'focus']}
							overlay={<Tooltip key={owner.email} >{owner.name} ({owner.email})</Tooltip>}
						>
							<img className="table-pic" src={`${server}/thumbnail/${owner.picture}`} alt="Profile Pic" />
						</OverlayTrigger>
					);
				} else if ( owner.name ) {
					const initials = owner.name
						.split( ' ' )
						.map( x => x[ 0 ] )
						.join( '' );
					const bgColor = COLORS[ i % COLORS.length ];
					arr.push(
						<OverlayTrigger key={owner.email} trigger={['hover', 'focus']}
							overlay={<Tooltip key={owner.email} >{owner.name} ({owner.email})</Tooltip>}
						>
							<span><Avatar
								initials={initials} bgColor={bgColor}
								key={i} width={40} height={40}
							/></span>
						</OverlayTrigger>
					);
				}
			}
			return arr;
		}
	};
}


// EXPORTS //

export default createUsersColumn;
