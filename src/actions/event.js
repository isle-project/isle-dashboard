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
import server from 'constants/server';
import i18next from 'i18next';
import { addNotification, addErrorNotification } from 'actions/notification';
import { DELETED_EVENT, GET_EVENTS, TRIGGERED_EVENT } from 'constants/action_types.js';


// EXPORTS //

/**
 * Makes a GET request to the server to get all events.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {void}
 */
export const getEvents = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_events' );
		dispatch({
			type: GET_EVENTS,
			payload: {
				events: res.data.events
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a GET request to retrieve all events with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a GET request to retrieve all events
 */
export const getEventsInjector = dispatch => {
	return async () => {
		await getEvents( dispatch );
	};
};

/**
 * Makes a POST request to delete an event.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} id - event id
 * @returns {void}
 */
export const deleteEvent = async ( dispatch, id ) => {
	try {
		const res = await axios.post( server+'/delete_event', {
			id
		});
		addNotification( dispatch, {
			title: i18next.t('common:deleted'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: DELETED_EVENT,
			payload: {
				id
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to delete an event with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a POST request to delete an event
 */
export const deleteEventInjector = dispatch => {
	return async ( id ) => {
		await deleteEvent( dispatch, id );
	};
};

/**
 * Makes a POST request to trigger an event.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} id - event id
 * @returns {void}
 */
export const triggerEvent = async ( dispatch, id ) => {
	try {
		const res = await axios.post( server+'/trigger_event', {
			id
		});
		addNotification( dispatch, {
			title: i18next.t('admin:event-triggered'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: TRIGGERED_EVENT,
			payload: {
				id
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to trigger an event with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a POST request to trigger an event
 */
export const triggerEventInjector = dispatch => {
	return async ( id ) => {
		await triggerEvent( dispatch, id );
	};
};
