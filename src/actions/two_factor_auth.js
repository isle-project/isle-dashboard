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
import { DISABLED_TFA, ENABLED_TFA, GET_TFA_QRCODE } from 'constants/action_types.js';


// EXPORTS //

/**
 * Makes a request to the server to get the two-factor authentication qrcode.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {(Object|void)} qrcode or void
 */
export const getTfaQRCode = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_tfa_qrcode' );
		dispatch({
			type: GET_TFA_QRCODE,
			payload: {
				events: res.data.events
			}
		});
		return res;
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a request for a two-factor authentication qrcode with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a request for a two-factor authentication qrcode
 */
export const getTfaQRCodeInjector = dispatch => {
	return async () => {
		const result = await getTfaQRCode( dispatch );
		return result;
	};
};

/**
 * Makes a POST request to the server to enable two-factor authentication for the user making the request.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} token - the token to use for the two-factor authentication
 * @returns {void}
 */
export const enableTFA = async ( dispatch, token ) => {
	try {
		const res = await axios.post( server+'/enable_tfa', {
			token
		});
		addNotification( dispatch, {
			title: res.data.verified ? i18next.t('common:tfa-enabled') : i18next.t('common:tfa-not-enabled'),
			message: res.data.message,
			level: res.data.verified ? 'success' : 'error'
		});
		dispatch({
			type: ENABLED_TFA,
			payload: {
				verified: res.data.verified
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to enable two-factor authentication for the user making the request with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to enable two-factor authentication for the user making the request
 */
export const enableTFAInjector = dispatch => {
	return async ( token ) => {
		await enableTFA( dispatch, token );
	};
};

/**
 * Makes a POST request to the server to disable two-factor authentication for the user making the request.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {void}
 */
export const disableTFA = async ( dispatch ) => {
	try {
		const res = await axios.post( server+'/disable_tfa' );
		addNotification( dispatch, {
			title: i18next.t('common:tfa-disabled'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: DISABLED_TFA,
			payload: {
				message: res.data.message,
				disabled: res.data.disabled
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to disable two-factor authentication for the user making the request with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to disable two-factor authentication for the user making the request
 */
export const disableTFAInjector = dispatch => {
	return async () => {
		await disableTFA( dispatch );
	};
};
