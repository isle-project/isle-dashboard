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
import { UPDATED_SETTINGS, UPDATED_TRANSLATIONS, GET_CUSTOM_TRANSLATIONS, GET_SETTINGS_PUBLIC, GET_SETTINGS } from 'constants/action_types.js';


// EXPORTS //

export const getSettings = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_settings' );
		dispatch({
			type: GET_SETTINGS,
			payload: res.data
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const getSettingsInjector = dispatch => {
	return async () => {
		await getSettings( dispatch );
	};
};

export const getPublicSettings = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_public_settings' );
		dispatch({
			type: GET_SETTINGS_PUBLIC,
			payload: res.data
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const getPublicSettingsInjector = dispatch => {
	return async () => {
		await getPublicSettings( dispatch );
	};
};

export const updateSettings = async ( dispatch, name, value ) => {
	try {
		const res = await axios.post( server+'/update_settings', {
			name, value
		});
		addNotification( dispatch, {
			title: i18next.t('common:updated'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: UPDATED_SETTINGS,
			payload: res.data
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const updateSettingsInjector = dispatch => {
	return async ( name, value ) => {
		await updateSettings( dispatch, name, value );
	};
};

export const addCustomTranslation = async ( dispatch, { language, ns, key, value }) => {
	try {
		const res = await axios.post( server+'/add_custom_translation', {
			language, ns, key, value
		});
		addNotification( dispatch, {
			title: i18next.t('common:updated'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: UPDATED_TRANSLATIONS,
			payload: res.data
		});
		return res;
	} catch ( err ) {
		addErrorNotification( dispatch, err );
		return err;
	}
};

export const addCustomTranslationInjector = dispatch => {
	return async ({ language, ns, key, value }) => {
		const res = await addCustomTranslation( dispatch, { language, ns, key, value });
		return res;
	};
};

export const getCustomTranslations = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_translations' );
		dispatch({
			type: GET_CUSTOM_TRANSLATIONS,
			payload: res.data
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const getCustomTranslationsInjector = dispatch => {
	return async () => {
		await getCustomTranslations( dispatch );
	};
};
