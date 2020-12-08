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
import { CREATED_CUSTOM_FIELD, DELETED_CUSTOM_FIELD, GET_CUSTOM_FIELDS } from 'constants/action_types.js';


// EXPORTS //

export const getCustomFields = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_custom_fields' );
		dispatch({
			type: GET_CUSTOM_FIELDS,
			payload: {
				fields: res.data.fields
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

export const deleteCustomField = async ( dispatch, id ) => {
	try {
		const res = await axios.post( server+'/delete_custom_field', {
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
	showOnProfile,
	editableOnSignup,
	editableOnProfile
}) => {
	try {
		const res = await axios.post( server + '/create_custom_field', {
			name,
			description,
			type,
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
			payload: {
				name,
				description,
				type,
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

export const createCustomFieldInjector = dispatch => {
	return async ({
		name,
		description,
		type,
		showOnProfile,
		editableOnSignup,
		editableOnProfile
	}) => {
		await createCustomField( dispatch, {
			name,
			description,
			type,
			showOnProfile,
			editableOnSignup,
			editableOnProfile
		});
	};
};
