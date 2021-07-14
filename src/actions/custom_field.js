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
import { CREATED_CUSTOM_FIELD, DELETED_CUSTOM_FIELD, FIELD_POSITION_INCREMENTED, FIELD_POSITION_DECREMENTED, GET_CUSTOM_FIELDS, UPDATED_CUSTOM_FIELD } from 'constants/action_types.js';
import { globalAxios } from 'helpers/axios.js';


// EXPORTS //

/**
 * Makes a GET request to the server to get all custom user fields.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {void}
 */
export const getCustomFields = async ( dispatch ) => {
	try {
		const res = await globalAxios.get( server+'/get_custom_fields' );
		dispatch({
			type: GET_CUSTOM_FIELDS,
			payload: {
				customFields: res.data.fields
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a GET request to the server to get all custom user fields with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a GET request to the server to get all custom user fields
 */
export const getCustomFieldsInjector = dispatch => {
	return async () => {
		await getCustomFields( dispatch );
	};
};

/**
 * Makes a POST request to the server to increment a custom field's position.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} id - the custom field's unique id
 * @returns {void}
 */
export const incrementFieldPosition = async ( dispatch, id ) => {
	try {
		const res = await globalAxios.post( server+'/increment_field_position', {
			id
		});
		dispatch({
			type: FIELD_POSITION_INCREMENTED,
			payload: {
				customFields: res.data.fields
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to the server to increment a custom field's position with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a POST request to the server to increment a custom field's position
 */
export const incrementFieldPositionInjector = dispatch => {
	return async ( id ) => {
		await incrementFieldPosition( dispatch, id );
	};
};

/**
 * Makes a POST request to the server to decrement a custom field's position.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} id - the custom field's unique id
 * @returns {void}
 */
export const decrementFieldPosition = async ( dispatch, id ) => {
	try {
		const res = await globalAxios.post( server+'/decrement_field_position', {
			id
		});
		dispatch({
			type: FIELD_POSITION_DECREMENTED,
			payload: {
				customFields: res.data.fields
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to the server to decrement a custom field's position with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a POST request to the server to decrement a custom field's position
 */
export const decrementFieldPositionInjector = dispatch => {
	return async ( id ) => {
		await decrementFieldPosition( dispatch, id );
	};
};

/**
 * Makes a POST request to the server to delete a custom field.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} id - the custom field's unique id
 * @returns {void}
 */
export const deleteCustomField = async ( dispatch, id ) => {
	try {
		const res = await globalAxios.post( server+'/delete_custom_field', {
			id
		});
		addNotification( dispatch, {
			title: i18next.t('common:deleted'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: DELETED_CUSTOM_FIELD,
			payload: {
				id
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to the server to delete a custom field with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a POST request to the server to delete a custom field
 */
export const deleteCustomFieldInjector = dispatch => {
	return async ( id ) => {
		await deleteCustomField( dispatch, id );
	};
};

/**
 * Makes a POST request to the server to create a custom field.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} field - the custom field's data
 * @param {string} field.name - the custom field's name
 * @param {string} field.description - the custom field's description
 * @param {string} field.type - the custom field's type
 * @param {Array} field.options - the custom field's options (if type is `dropdown`)
 * @param {number} field.position - the custom field's position
 * @param {boolean} field.showOnProfile - whether the custom field should be shown on the users' profile
 * @param {boolean} field.editableOnSignup - whether the custom field should be editable on signup
 * @param {boolean} field.editableOnProfile - whether the custom field should be editable on the users' profile
 * @returns {void}
 */
export const createCustomField = async ( dispatch, {
	name,
	description,
	type,
	options,
	position,
	showOnProfile,
	editableOnSignup,
	editableOnProfile
}) => {
	try {
		const res = await globalAxios.post( server + '/create_custom_field', {
			name,
			description,
			type,
			options,
			position,
			showOnProfile,
			editableOnSignup,
			editableOnProfile
		});
		addNotification( dispatch, {
			title: i18next.t('common:created'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: CREATED_CUSTOM_FIELD,
			payload: res.data.field
		});
		return res;
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to the server to create a custom field with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a POST request to the server to create a custom field
 */
export const createCustomFieldInjector = dispatch => {
	return async ({
		name,
		description,
		type,
		options,
		position,
		showOnProfile,
		editableOnSignup,
		editableOnProfile
	}) => {
		await createCustomField( dispatch, {
			name,
			description,
			type,
			options,
			position,
			showOnProfile,
			editableOnSignup,
			editableOnProfile
		});
	};
};

/**
 * Makes a POST request to the server to update a custom field.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} field - the custom field's data
 * @param {string} field.name - the custom field's name
 * @param {string} field.description - the custom field's description
 * @param {string} field.type - the custom field's type
 * @param {Array} field.options - the custom field's options (if type is `dropdown`)
 * @param {number} field.position - the custom field's position
 * @param {boolean} field.showOnProfile - whether the custom field should be shown on the users' profile
 * @param {boolean} field.editableOnSignup - whether the custom field should be editable on signup
 * @param {boolean} field.editableOnProfile - whether the custom field should be editable on the users' profile
 */
export const updateCustomField = async ( dispatch, {
	name,
	description,
	type,
	options,
	position,
	showOnProfile,
	editableOnSignup,
	editableOnProfile
}) => {
	try {
		const res = await globalAxios.post( server + '/update_custom_field', {
			name,
			description,
			type,
			options,
			position,
			showOnProfile,
			editableOnSignup,
			editableOnProfile
		});
		addNotification( dispatch, {
			title: i18next.t('common:update'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: UPDATED_CUSTOM_FIELD,
			payload: {
				name,
				description,
				type,
				position,
				showOnProfile,
				editableOnSignup,
				editableOnProfile
			}
		});
		return res;
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to the server to update a custom field with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a POST request to the server to update a custom field
 */
export const updateCustomFieldInjector = dispatch => {
	return async ({
		name,
		description,
		type,
		options,
		position,
		showOnProfile,
		editableOnSignup,
		editableOnProfile
	}) => {
		await updateCustomField( dispatch, {
			name,
			description,
			type,
			options,
			position,
			showOnProfile,
			editableOnSignup,
			editableOnProfile
		});
	};
};
