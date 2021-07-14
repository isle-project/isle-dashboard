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

import axios from 'axios';
import server from 'constants/server';
import i18next from 'i18next';
import { addNotification, addErrorNotification } from 'actions/notification';
import { CREATED_BACKUP, DELETED_BACKUP, GET_BACKUPS } from 'constants/action_types.js';


// EXPORTS //

/**
 * Makes a GET request to the server to get the list of backups.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {void}
 */
export const getBackups = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_backups' );
		dispatch({
			type: GET_BACKUPS,
			payload: {
				backups: res.data.backups
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function making a GET request to the server to get the list of backups with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function making a GET request to the server to get the list of backups
 */
export const getBackupsInjector = dispatch => {
	return async () => {
		await getBackups( dispatch );
	};
};

/**
 * Makes a POST request to the server to create a backup.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {void}
 */
export const createBackup = async ( dispatch ) => {
	try {
		const res = await axios.post( server+'/create_backup' );
		addNotification( dispatch, {
			title: i18next.t('common:created'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: CREATED_BACKUP,
			payload: {
				backup: res.data.backup
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function making a POST request to the server to create a backup with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function making a POST request to the server to create a backup
 */
export const createBackupInjector = dispatch => {
	return async () => {
		await createBackup( dispatch );
	};
};

/**
 * Returns a function making a POST request to the server to delete a backup with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} id - the id of the backup to delete
 */
export const deleteBackup = async ( dispatch, id ) => {
	try {
		const res = await axios.post( server+'/delete_backup', {
			id
		});
		addNotification( dispatch, {
			title: i18next.t('common:deleted'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: DELETED_BACKUP,
			payload: {
				id
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function making a POST request to the server to delete a backup with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function making a POST request to the server to delete a backup
 */
export const deleteBackupInjector = dispatch => {
	return async ( id ) => {
		await deleteBackup( dispatch, id );
	};
};
