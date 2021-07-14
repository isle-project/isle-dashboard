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

import server from 'constants/server';
import { CREATED_ANNOUNCEMENT, EDITED_ANNOUNCEMENT, DELETED_ANNOUNCEMENT } from 'constants/action_types.js';
import { addNotification, addErrorNotification } from 'actions/notification';
import { namespaceAxios } from 'helpers/axios.js';


// EXPORTS //

/**
 * Returns an action object to be used in signalling that an announcement has been edited.
 *
 * @param {Object} announcement
 * @param {string} namespaceName
 * @returns {Object} an action object
 */
export function editedAnnouncement( announcement, namespaceName ) {
	return {
		type: EDITED_ANNOUNCEMENT,
		payload: {
			announcement,
			namespaceName
		}
	};
}

/**
 * Returns an action object to be used in signalling that an announcement has been created.
 *
 * @param {Object} announcement
 * @param {string} namespaceName
 * @returns {Object} an action object
 */
export function createdAnnouncement( announcement, namespaceName ) {
	return {
		type: CREATED_ANNOUNCEMENT,
		payload: {
			announcement,
			namespaceName
		}
	};
}

/**
 * Returns an action object to be used in signalling that an announcement has been deleted.
 *
 * @param {number} index - index of the announcement
 * @param {string} namespaceName
 * @returns {Object} an action object
 */
export function deletedAnnouncement( index, namespaceName ) {
	return {
		type: DELETED_ANNOUNCEMENT,
		payload: {
			index,
			namespaceName
		}
	};
}

/**
 * Makes a request to create an announcement.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} opts - request options
 * @param {string} opts.namespaceName - namespace name
 * @param {Object} opts.announcement - announcement object
 */
export const addAnnouncement = async ( dispatch, { namespaceName, announcement }) => {
	try {
		const res = await namespaceAxios.post( server+'/new_announcement', {
			namespaceName,
			announcement
		});
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
		dispatch( createdAnnouncement( announcement, namespaceName ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function for making an request to create an announcement with a bound dispatch function
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} wrapped `addAnnouncement` function
 */
export const addAnnouncementInjector = dispatch => {
	return async ( { namespaceName, announcement } ) => {
		await addAnnouncement( dispatch, { namespaceName, announcement } );
	};
};

/**
 * Makes a request to delete an announcement.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} opts - request options
 * @param {string} opts.namespaceName - namespace name
 * @param {number} opts.index - index of the announcement
 * @param {string} opts.createdAt - creation time of the announcement
 */
export const deleteAnnouncement = async ( dispatch, { namespaceName, createdAt, index }) => {
	try {
		const res = await namespaceAxios.post( server+'/delete_announcement', {
			namespaceName,
			createdAt
		});
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
		dispatch( deletedAnnouncement( index, namespaceName ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function for making an request to delete an announcement with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} wrapped `deleteAnnouncement` function
 */
export const deleteAnnouncementInjector = dispatch => {
	return async ( { namespaceName, createdAt, index } ) => {
		await deleteAnnouncement( dispatch, { namespaceName, createdAt, index } );
	};
};

/**
 * Makes a request to edit an announcement.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} opts - request options
 * @param {string} opts.namespaceName - namespace name
 * @param {Object} opts.announcement - announcement object
 */
export const editAnnouncement = async ( dispatch, { namespaceName, announcement }) => {
	try {
		const res = await namespaceAxios.post( server+'/edit_announcement', {
			namespaceName,
			announcement
		});
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
		dispatch( editedAnnouncement( announcement, namespaceName ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function for making an request to edit an announcement with a bound dispatch function.
 *
* @param {Function} dispatch - dispatch function
* @returns {Function} wrapped `editAnnouncement` function
*/
export const editAnnouncementInjector = dispatch => {
	return async ( { namespaceName, announcement } ) => {
		await editAnnouncement( dispatch, { namespaceName, announcement } );
	};
};
