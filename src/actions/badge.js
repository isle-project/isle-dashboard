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

import request from 'request';
import contains from '@stdlib/assert/contains';
import server from 'constants/server';
import { addNotification } from 'actions/notification';
import { RETRIEVED_BADGES, USER_RECEIVED_BADGES } from 'constants/action_types.js';


// FUNCTIONS //

function createBadgeNotification({ name, description, picture }) {
	let pic = server + '/badges/' + picture;
	return {
		children: (
			<div>
				<h3>Received Badge: {name}</h3>
				<div>
					<div>
						<div className="received-badge-before" />
						<img className="received-badge" src={pic} alt="Received Badge" />
					</div>
					<p style={{ marginTop: 15 }}>You received a badge for:  <b>{description}</b></p>
				</div>
			</div>
		),
		level: 'info',
		position: 'tc',
		dismissible: 'button',
		autoDismiss: 0
	};
}


// FUNCTIONS //

export function receivedUserBadges( badges ) {
	return {
		type: USER_RECEIVED_BADGES,
		payload: {
			badges
		}
	};
}

export function retrievedBadges( badges ) {
	return {
		type: RETRIEVED_BADGES,
		payload: {
			badges
		}
	};
}

export const getBadges = ( dispatch, userToken ) => {
	request.get( server+'/get_user_badges', {
		headers: {
			'Authorization': 'JWT ' + userToken
		}
	}, function getBadges( error, response, body ) {
		if ( error ) {
			return error;
		}
		body = JSON.parse( body );
		dispatch( receivedUserBadges(body.badges) );
		if ( body.addedBadges.length > 0 ) {
			for ( let i = 0; i < body.badges.length; i++ ) {
				const item = body.badges[i];
				if ( contains( body.addedBadges, item.name ) ) {
					addNotification( dispatch, createBadgeNotification( item ) );
				}
			}
		}
	});
};

export const getBadgesInjector = ( dispatch ) => {
	return ( userToken ) => {
		getBadges( dispatch, userToken );
	};
};
