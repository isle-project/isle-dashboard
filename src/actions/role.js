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
import i18next from 'i18next';
import { addNotification, addErrorNotification } from 'actions/notification';
import { globalAxios } from 'helpers/axios.js';
import { GET_ALL_ROLES } from 'constants/action_types.js';


// EXPORTS //

export const getAllRoles = async ( dispatch ) => {
	try {
		const res = await globalAxios.get( server+'/get_all_roles' );
		dispatch({
			type: GET_ALL_ROLES,
			payload: {
				roles: res.data.roles
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const getAllRolesInjector = dispatch => {
	return async () => {
		await getAllRoles( dispatch );
	};
};

export const createRole = async ( dispatch, {
	title,
	authorizedRoles,
	searchContext,
	permissions
}) => {
	try {
		const res = await globalAxios.post( server + '/create_role', {
			title,
			authorizedRoles,
			searchContext,
			permissions
		});
		addNotification( dispatch, {
			title: i18next.t('common:created'),
			message: res.data.message,
			level: 'success'
		});
		return res;
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const createRoleInjector = dispatch => {
	return async ({
		title,
		authorizedRoles,
		searchContext,
		permissions
	}) => {
		await createRole( dispatch, {
			title,
			authorizedRoles,
			searchContext,
			permissions
		});
	};
};
