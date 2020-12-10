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

export const getBackupsInjector = dispatch => {
	return async () => {
		await getBackups( dispatch );
	};
};

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

export const createBackupInjector = dispatch => {
	return async () => {
		await createBackup( dispatch );
	};
};

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

export const deleteBackupInjector = dispatch => {
	return async ( id ) => {
		await deleteBackup( dispatch, id );
	};
};
