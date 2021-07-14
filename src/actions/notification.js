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

import { ADD_NOTIFICATION, ADD_ERROR_NOTIFICATION } from 'constants/action_types.js';


// EXPORTS //

/**
 * Dispatches an action object to add a notification.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} notification - Notification object
 */
export function addNotification( dispatch, notification ) {
	dispatch({
		type: ADD_NOTIFICATION,
		payload: notification
	});
}

/**
 * Returns a function to dispatch an action object to add a notification.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to dispatch action object to add a notification
 */
export const addNotificationInjector = dispatch => {
	return notification => {
		addNotification( dispatch, notification );
	};
};

/**
 * Dispatches an action object to add an error notification.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Error} err - error object
 */
export function addErrorNotification( dispatch, err ) {
	let msg;
	if ( err.response ) {
		msg = 'Server response: ' + err.response.status + '.\n';
		msg += err.response.data;
	} else {
		msg = err.message;
	}
	dispatch({
		type: ADD_ERROR_NOTIFICATION,
		payload: msg
	});
}

/**
 * Returns a function to dispatch an action object to add an error notification with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to dispatch action object to add an error notification
 */
export const addErrorNotificationInjector = dispatch => {
	return message => {
		addErrorNotification( dispatch, message );
	};
};
