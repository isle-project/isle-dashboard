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
import axios from 'axios';
import i18next from 'i18next';
import contains from '@stdlib/assert/contains';
import server from 'constants/server';
import { addNotification, addErrorNotification } from 'actions/notification';
import { RETRIEVED_BADGES, USER_RECEIVED_BADGES } from 'constants/action_types.js';


// FUNCTIONS //

/**
 * Create a badge notification object for use in the `react-notification-system` component.
 *
 * @param {Object} opts - options
 * @param {string} opts.name - name of the badge
 * @param {string} opts.description - description of the badge
 * @param {string} opts.picture - URL with icon of the badge
 * @returns {Object} `react-notification-system` component configuration
 */
function createBadgeNotification({ name, description, picture }) {
	const pic = server + '/badges/' + picture;
	return {
		children: (
			<div>
				<h3>{i18next.t('common:received-badge')}{name}</h3>
				<div>
					<div>
						<div className="received-badge-before" />
						<img className="received-badge" src={pic} alt="Received Badge" />
					</div>
					<p style={{ marginTop: 15 }}>{i18next.t('common:received-badge-for')}<b>{description}</b></p>
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

/**
 * Returns an action for retrieving the user's badges.
 *
 * @param {Array} badges - retrieved user badges
 * @returns {Object} action
 */
export function receivedUserBadges( badges ) {
	return {
		type: USER_RECEIVED_BADGES,
		payload: {
			badges
		}
	};
}

/**
 * Returns an action for retrieved available badges.
 *
 * @param {Array} badges - retrieved available badges
 * @returns {Object} action
 */
export function retrievedBadges( badges ) {
	return {
		type: RETRIEVED_BADGES,
		payload: {
			badges
		}
	};
}

/**
 * Makes a GET request to retrieve the user's badges.
 *
 * @param {Function} dispatch - dispatch function
 */
export const getUserBadges = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_user_badges' );
		const { badges, addedBadges } = res.data;
		dispatch( receivedUserBadges( badges ) );
		if ( addedBadges.length > 0 ) {
			for ( let i = 0; i < badges.length; i++ ) {
				const item = badges[i];
				if ( contains( addedBadges, item.name ) ) {
					addNotification( dispatch, createBadgeNotification( item ) );
				}
			}
		}
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a GET request to retrieve the user's badges.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a GET request to retrieve the user's badges
 */
export const getUserBadgesInjector = ( dispatch ) => {
	return async () => {
		await getUserBadges( dispatch );
	};
};

/**
 * Makes a GET request to retrieve the available badges.
 *
 * @param {Function} dispatch - dispatch function
 */
export const getAvailableBadges = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_available_badges' );
		dispatch( retrievedBadges( res.data ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a GET request to retrieve the available badges.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a GET request to retrieve the available badges
 */
export const getAvailableBadgesInjector = ( dispatch ) => {
	return async () => {
		await getAvailableBadges( dispatch );
	};
};
