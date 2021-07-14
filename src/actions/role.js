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
import { CREATED_ROLE, DELETED_ROLE, GET_ALL_ROLES, UPDATED_ROLE } from 'constants/action_types.js';


// EXPORTS //

/**
 * Makes a GET request to the server to get all roles.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {void}
 */
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

/**
 * Returns a function to make a GET request to the server toe retrieve all roles with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a GET request to the server to retrieve all roles
 */
export const getAllRolesInjector = dispatch => {
	return async () => {
		await getAllRoles( dispatch );
	};
};

/**
 * Makes a POST request to the server to create a new role.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} role - the role to create
 * @param {string} role.title - the title of the role
 * @param {Array} role.authorizedRoles - the roles authorized to edit this role
 * @param {Object} role.permissions - the permissions of the role
 * @param {string} role.searchContext - the search context for the role governing where it can be used
 * @returns {(Object|Error)} result of the POST request or an error
 */
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
		dispatch({
			type: CREATED_ROLE,
			payload: res.data
		});
		return res;
	} catch ( err ) {
		addErrorNotification( dispatch, err );
		return err;
	}
};

/**
 * Returns a function to make a POST request to the server to create a new role with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a POST request to the server to create a new role
 */
export const createRoleInjector = dispatch => {
	return async ({
		title,
		authorizedRoles,
		searchContext,
		permissions
	}) => {
		const res = await createRole( dispatch, {
			title,
			authorizedRoles,
			searchContext,
			permissions
		});
		return res;
	};
};

/**
 * Makes a POST request to the server to update a role.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} role - the role to update
 * @param {string} role.id - the id of the role
 * @param {string} role.title - the new title of the role
 * @param {Array} role.authorizedRoles - the roles authorized to edit this role
 * @param {Object} role.permissions - the permissions of the role
 * @param {string} role.searchContext - the search context for the role governing where it can be used
 * @returns {(Object|Error)} result of the POST request or an error
 */
export const updateRole = async ( dispatch, {
	id,
	title,
	authorizedRoles,
	searchContext,
	permissions
}) => {
	try {
		const res = await globalAxios.post( server + '/update_role', {
			id,
			title,
			authorizedRoles,
			searchContext,
			permissions
		});
		addNotification( dispatch, {
			title: i18next.t('common:updated'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: UPDATED_ROLE,
			payload: res.data
		});
		return res;
	} catch ( err ) {
		addErrorNotification( dispatch, err );
		return err;
	}
};

/**
 * Returns a function to make a POST request to the server to update a role with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a POST request to the server to update a role
 */
export const updateRoleInjector = dispatch => {
	return async ({
		id,
		title,
		authorizedRoles,
		searchContext,
		permissions
	}) => {
		const res = await updateRole( dispatch, {
			id,
			title,
			authorizedRoles,
			searchContext,
			permissions
		});
		return res;
	};
};

/**
 * Makes a POST request to the server to delete a role.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} id - the id of the role to delete
 * @returns {void}
 */
export const deleteRole = async ( dispatch, id ) => {
	try {
		const res = await globalAxios.post( server+'/delete_role', {
			id
		});
		addNotification( dispatch, {
			title: i18next.t('common:deleted'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: DELETED_ROLE,
			payload: {
				id
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to the server to delete a role with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a POST request to the server to delete a role
 */
export const deleteRoleInjector = dispatch => {
	return async ( id ) => {
		await deleteRole( dispatch, id );
	};
};
