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

/**
 * Makes a GET request to the server to retrieve the server instance settings.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {void}
 */
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

/**
 * Returns a function to make a GET request to the server to retrieve the server instance settings with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a GET request to the server to retrieve the server instance settings
 */
export const getSettingsInjector = dispatch => {
	return async () => {
		await getSettings( dispatch );
	};
};

/**
 * Makes a GET request to the server to retrieve the server instance's public settings.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {void}
 */
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

/**
 * Returns a function to make a GET request to the server to retrieve the server instance's public settings with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a GET request to the server to retrieve the server instance's public settings
 */
export const getPublicSettingsInjector = dispatch => {
	return async () => {
		await getPublicSettings( dispatch );
	};
};

/**
 * Makes a POST request to the server to update a server instance setting.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} name - name of the setting to update
 * @param {string} value - value of the setting to update
 * @returns {void}
 */
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

/**
 * Returns a function to make a POST request to the server to update a server instance setting with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to the server to update a server instance setting
 */
export const updateSettingsInjector = dispatch => {
	return async ( name, value ) => {
		await updateSettings( dispatch, name, value );
	};
};

/**
 * Makes a POST request to the server to add a custom translation.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} translation - the translation to add
 * @param {string} translation.language - the locale of the translation
 * @param {string} translation.ns - the namespace of the translation
 * @param {string} translation.key - the translation's key
 * @param {string} translation.value - the translation's value
 * @returns {(Object|Error)} the translation added or an error
 */
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

/**
 * Returns a function to make a POST request to the server to add a custom translation with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to the server to add a custom translation
 */
export const addCustomTranslationInjector = dispatch => {
	return async ({ language, ns, key, value }) => {
		const res = await addCustomTranslation( dispatch, { language, ns, key, value });
		return res;
	};
};

/**
 * Makes a POST request to the server to get all custom translations.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {void}
 */
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

/**
 * Returns a function to make a POST request to the server to get all custom translations with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to the server to get all custom translations
 */
export const getCustomTranslationsInjector = dispatch => {
	return async () => {
		await getCustomTranslations( dispatch );
	};
};

/**
 * Makes a POST request to the server to remove a custom translation.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} translation - the translation to remove
 * @param {string} translation.language - the locale of the translation
 * @param {string} translation.ns - the namespace of the translation
 * @param {string} translation.key - the translation's key
 * @returns {(Object|Error)} the server response or an error
 */
export const removeCustomTranslation = async ( dispatch, { language, ns, key }) => {
	try {
		const res = await axios.post( server+'/remove_custom_translation', {
			language, ns, key
		});
		addNotification( dispatch, {
			title: i18next.t('common:removed'),
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

/**
 * Returns a function to make a POST request to the server to remove a custom translation with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to the server to remove a custom translation
 */
export const removeCustomTranslationInjector = dispatch => {
	return async ({ language, ns, key }) => {
		const res = await removeCustomTranslation( dispatch, { language, ns, key });
		return res;
	};
};
