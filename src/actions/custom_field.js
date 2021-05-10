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

export const getCustomFieldsInjector = dispatch => {
	return async () => {
		await getCustomFields( dispatch );
	};
};

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

export const incrementFieldPositionInjector = dispatch => {
	return async ( id ) => {
		await incrementFieldPosition( dispatch, id );
	};
};

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

export const decrementFieldPositionInjector = dispatch => {
	return async ( id ) => {
		await decrementFieldPosition( dispatch, id );
	};
};

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

export const deleteCustomFieldInjector = dispatch => {
	return async ( id ) => {
		await deleteCustomField( dispatch, id );
	};
};

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
