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
import logger from 'debug';
import qs from 'querystring';
import i18next from 'i18next';
import server from 'constants/server';
import { fetchCredentials } from 'actions/authentication.js';
import { getEnrollableCohorts } from 'actions/cohort.js';
import { addNotification, addErrorNotification } from 'actions/notification.js';
import { AUTHENTICATED, USER_PICTURE_MODIFIED, DELETED_USER, GET_USERS, LOGGED_IN, LOGGED_OUT, RECEIVED_TOKEN, REQUEST_TFA, USER_UPDATED, USER_UPDATED_BY_ADMIN } from 'constants/action_types.js';


// VARIABLES //

const debug = logger( 'isle-dashboard:actions:user' );


// EXPORTS //

/**
 * Returns an action signaling that the user has been authenticated.
 *
 * @param {Object} user - user object
 * @returns {Object} action
 */
export function loggedIn( user ) {
	return {
		type: LOGGED_IN,
		payload: {
			email: user.email,
			verifiedEmail: user.verifiedEmail,
			name: user.name,
			firstName: user.firstName,
			lastName: user.lastName,
			preferredName: user.preferredName,
			pronouns: user.pronouns,
			enrolledNamespaces: user.enrolledNamespaces,
			ownedNamespaces: user.ownedNamespaces,
			organization: user.organization,
			writeAccess: user.writeAccess,
			administrator: user.administrator,
			lessonData: user.lessonData,
			picture: user.picture,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			score: user.score,
			spentTime: user.spentTime,
			licensed: user.licensed,
			customFields: user.customFields,
			availableCustomFields: user.availableCustomFields,
			twoFactorAuth: user.twoFactorAuth
		}
	};
}

/**
 * Returns an action signaling that the user has logged-in and a JSON web token has been received.
 *
 * @param {Object} options - function options
 * @param {string} options.token - JSON web token
 * @param {string} options.id - user id
 * @returns {Object} action
 */
export function receivedToken({ token, id }) {
	return {
		type: RECEIVED_TOKEN,
		payload: {
			token,
			id
		}
	};
}

/**
* Returns an action signaling that a request for a two-factor authentication token has been made.
*
* @param {Object} options - function options
* @param {string} options.email - user email
* @param {string} options.password - user password
* @returns {Object} action
*/
export function requestTFA({ email, password }) {
	return {
		type: REQUEST_TFA,
		payload: {
			email,
			password
		}
	};
}

/**
 * Returns an action signaling that the user has been logged-out.
 *
 * @returns {Object} action
 */
export function loggedOut() {
	return {
		type: LOGGED_OUT
	};
}

/**
 * Returns an action signaling that the user has been authenticated.
 *
 * @returns {Object} action
 */
export function authenticated() {
	return {
		type: AUTHENTICATED
	};
}

/**
 * Returns an action signaling that the user's picture has been updated.
 *
 * @param {Object} picture - user picture
 * @returns {Object} action
 */
export function updateUserPicture( picture ) {
	return {
		type: USER_PICTURE_MODIFIED,
		payload: {
			picture
		}
	};
}

/**
 * Returns an action signaling that the user's name or organization has been updated.
 *
 * @param {Object} user - user object
 * @param {string} user.name - user name
 * @param {string} user.organization - user organization
 * @returns {Object} action
 */
export const updatedUser = ({ name, organization }) => {
	return {
		type: USER_UPDATED,
		payload: {
			name,
			organization
		}
	};
};

/**
 * Returns an action signaling that a user has been updated by an administrator.
 *
 * @param {Object} user - user object
 * @returns {Object} action
 */
export const updatedUserByAdmin = ( user ) => {
	return {
		type: USER_UPDATED_BY_ADMIN,
		payload: user
	};
};

/**
 * Makes a GET request to the server to retrieve list of users.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {void}
 */
export const getUsers = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_users' );
		dispatch({
			type: GET_USERS,
			payload: {
				users: res.data.users
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a GET request to the server to retrieve list of users with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a GET request to the server to retrieve list of users
 */
export const getUsersInjector = dispatch => {
	return async () => {
		await getUsers( dispatch );
	};
};

/**
 * Makes a POST request to the server to impersonate a user.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.id - user id
 * @param {string} options.password - user password
 */
export const impersonateUser = async ( dispatch, { id, password }) => {
	debug( 'Impersonating user with id '+id );
	try {
		const res = await axios.post( server+'/impersonate', { id, password });
		const user = await fetchCredentials( dispatch, {
			id: res.data.id
		});
		// Save user token to local storage:
		const JWT = {
			token: res.data.token,
			id: res.data.id
		};
		const userVal = 'ISLE_USER_' + server;
		localStorage.setItem( userVal, JSON.stringify( JWT ) );
		if ( user ) {
			getEnrollableCohorts( dispatch, user );
		}
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to the server to impersonate a user with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to the server to impersonate a user
 */
export const impersonateUserInjector = dispatch => {
	return async ({ id, password }) => {
		await impersonateUser( dispatch, { id, password } );
	};
};

/**
 * Makes a POST request to the server to delete a user.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.id - user id
 */
export const deleteUser = async ( dispatch, { id }) => {
	try {
		const res = await axios.post( server+'/delete_user', { id });
		addNotification( dispatch, {
			title: i18next.t('common:deleted'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: DELETED_USER,
			payload: {
				id
			}
		});
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to the server to delete a user with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to the server to delete a user
 */
export const deleteUserInjector = dispatch => {
	return async ({ id }) => {
		await deleteUser( dispatch, { id } );
	};
};

/**
 * Makes POST requests to the server to upload a user's profile picture.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {Object} options.avatarData - user avatar picture data
 * @param {Object} options.thumbnailData - user thumbnail picture data
 */
export const uploadProfilePic = async ( dispatch, { avatarData, thumbnailData }) => {
	try {
		let res = await axios.post( server+'/upload_profile_pic', avatarData );
		const message = res.data.message;
		let filename = res.data.filename;
		filename = server + '/avatar/' + filename;
		dispatch( updateUserPicture( filename ) );

		res = await axios.post( server+'/upload_thumbnail_pic', thumbnailData );
		addNotification( dispatch, {
			title: i18next.t('profile-pic-title'),
			message,
			level: 'success',
			position: 'tl'
		});
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make POST requests to the server to upload a user's profile picture with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make POST requests to the server to upload a user's profile picture
 */
export const uploadProfilePicInjector = ( dispatch ) => {
	return async ({ avatarData, thumbnailData }) => {
		await uploadProfilePic( dispatch, { avatarData, thumbnailData });
	};
};

/**
 * Makes a POST request to the server to authenticate a user as an instructor.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.writeAccessToken - write access token to enable instructor access
 * @returns {boolean} true if the user is now an instructor, false otherwise
 */
export const authenticate = async ( dispatch, { writeAccessToken }) => {
	try {
		const res = await axios.post( server+'/set_write_access', { token: writeAccessToken });
		dispatch( authenticated() );
		addNotification( dispatch, {
			message: res.data.message+' You can now create your own courses on ISLE and have access to the gallery of public lessons.',
			level: 'success',
			autoDismiss: 10
		});
		return true;
	} catch ( err ) {
		addErrorNotification( dispatch, err );
		return false;
	}
};

/**
 * Returns a function to make a POST request to the server to authenticate a user as an instructor with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to the server to authenticate a user as an instructor
 */
export const authenticateInjector = ( dispatch ) => {
	return async ({ writeAccessToken }) => {
		const result = await authenticate( dispatch, { writeAccessToken });
		return result;
	};
};

/**
 * Makes a POST request to the server to trigger an email to be sent to the user to change their password.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.email - user email
 */
export const forgotPassword = async ( dispatch, { email }) => {
	try {
		await axios.get( server+'/forgot_password?'+qs.stringify({ email }) );
		addNotification( dispatch, {
			message: 'Check your email inbox for a link to choose a new password.',
			level: 'success'
		});
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to the server to trigger an email to be sent to the user to change their password with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to the server to trigger an email to be sent to the user to change their password
 */
export const forgotPasswordInjector = ( dispatch ) => {
	return async ({ email }) => {
		await forgotPassword( dispatch, { email });
	};
};

/**
 * Makes a POST request to the server to change a user's data.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} form - form data
 * @param {string} form.name - user name
 * @param {string} form.organization- user organization
 * @param {Object} form.customFields - user custom fields
 */
export const updateUser = async ( dispatch, form ) => {
	try {
		const res = await axios.post( server+'/update_user', form );
		dispatch( updatedUser({
			name: form.name,
			organization: form.organization,
			customFields: form.customFields
		}) );
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to the server to change a user's data with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to the server to change a user's data
 */
export const updateUserInjector = ( dispatch ) => {
	return async ({ name, organization, password, customFields }) => {
		await updateUser( dispatch, { name, organization, password, customFields });
	};
};

/**
 * Makes a POST request to the server to create a new user.
 *
 * @param {Object} form - form data
 * @returns {Promise} promise that resolves to the server response
 */
export const createUser = ( form ) => {
	return axios.post( server+'/create_user', form );
};

/**
 * Makes a POST request to the server to login a user.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} form - form data
 * @returns {Object} server response
 */
export const handleLogin = async ( dispatch, form ) => {
	const res = await axios.post( server+'/login', form );
	if ( res.data.message === 'finish-login-via-tfa' ) {
		dispatch( requestTFA( res.data ) );
	} else {
		dispatch( receivedToken( res.data ) );
	}
	return res;
};

/**
 * Returns a function to make a POST request to the server to login a user with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to the server to login a user
 */
export const handleLoginInjector = ( dispatch ) => {
	return async ( form ) => {
		const result = await handleLogin( dispatch, form );
		return result;
	};
};

/**
 * Makes a POST request to the server to login a user with a TFA code.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} form - form data
 * @returns {(Object|Error)} server response or an error if the TFA code is invalid
 */
export const handleLoginTFA = async ( dispatch, form ) => {
	try {
		const res = await axios.post( server+'/login_tfa', form );
		dispatch( receivedToken( res.data ) );
		return res;
	} catch ( err ) {
		addErrorNotification( dispatch, err );
		return err;
	}
};

/**
 * Returns a function to make a POST request to the server to login a user with a TFA code with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to the server to login a user with a TFA code
 */
export const handleLoginTFAInjector = ( dispatch ) => {
	return async ( form ) => {
		const result = await handleLoginTFA( dispatch, form );
		return result;
	};
};

/**
 * Restores a users' login session.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} user - user object
 */
export const restoreLogin = ( dispatch, user ) => {
	dispatch( loggedIn( user ) );
};

/**
 * Returns a function to restore a users' login session with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to restore a users' login session
 */
export const restoreLoginInjector = ( dispatch ) => {
	return ( user ) => {
		restoreLogin( dispatch, user );
	};
};

/**
 * Logs a user out.
 *
 * @param {Function} dispatch - dispatch function
 */
export const logout = async ( dispatch ) => {
	debug( 'Logging out the current user...' );
	try {
		await axios.get( server+'/saml-xmw/logout' );
	} catch ( err ) {
		debug( err.message );
	}
	localStorage.removeItem( 'ISLE_USER_'+server );
	dispatch( loggedOut() );
};

/**
 * Returns a function to log a user out with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to log a user out
 */
export const logoutInjector = ( dispatch ) => {
	return () => {
		logout( dispatch );
	};
};

/**
 * Makes a GET request to the server to check whether a user's locally stored data has to be updated.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} user - user object
 */
export const userUpdateCheck = async ( dispatch, user ) => {
	try {
		const res = await axios.get( server+'/user_update_check?'+qs.stringify({
			updatedAt: user.updatedAt
		}) );
		debug( 'Received response: '+res.data );
		if ( !res.data.hasMostRecent ) {
			const res = await axios.post( server+'/credentials_dashboard', {
				id: user.id
			});
			let newUser = res.data;
			if ( newUser.picture ) {
				newUser.picture = server + '/avatar/' + newUser.picture;
			}
			newUser = {
				id: user.id,
				token: user.token,
				...newUser
			};
			debug( 'Updated user data...' );
			dispatch( loggedIn( newUser ) );
		}
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a GET request to the server to check whether a user's locally stored data has to be updated with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a GET request to the server to check whether a user's locally stored data has to be updated
 */
export const userUpdateCheckInjector = ( dispatch ) => {
	return async ( user ) => {
		await userUpdateCheck( dispatch, user );
	};
};

/**
 * Makes a POST request to the server to confirm a user's email address.
 *
 * @param {string} token - user token
 * @returns {string} server response message or error message
 */
export const confirmEmail = async ( token ) => {
	try {
		const res = await axios.post( server+'/confirm_email', {
			token
		});
		return res.data.message;
	} catch ( err ) {
		if ( err.response && err.response.data ) {
			return err.response.data;
		}
		return err.message;
	}
};

/**
 * Make a POST request to the server to trigger a new email for confirming a user's email address.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} user - user object
 */
export const resendConfirmEmail = async ( dispatch, user ) => {
	try {
		await axios.post( server+'/resend_confirm_email' );
		addNotification( dispatch, {
			title: 'Email sent',
			message: i18next.t('common:verification-email-sent'),
			level: 'success',
			position: 'tl'
		});
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to the server to trigger a new email for confirming a user's email address with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to the server to trigger a new email for confirming a user's email address
 */
export const resendConfirmEmailInjector = ( dispatch ) => {
	return async ( user ) => {
		await resendConfirmEmail( dispatch, user );
	};
};

/**
 * Makes a POST request to the server by an administrator to update an arbitrary user's data.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} form - form object with new user data
 * @param {string} [form.password] - user password
 * @param {boolean} [form.writeAccess] - boolean indicating whether the user should have instructor access
 * @param {boolean} [form.administrator] - boolean indicating whether the user should be an administrator
 * @param {boolean} [form.twoFactorAuth] - boolean indicating whether the user should have two factor authentication enabled
 * @param {boolean} [form.loginWithoutPassword] - boolean indicating whether the user should be able to login without a password
 * @param {string} [form.name] - user name
 * @param {string} [form.organization] - user organization
 * @param {Object} [form.customFields] - user custom fields
 */
export const adminUpdateUser = async ( dispatch, form ) => {
	try {
		const res = await axios.post( server+'/admin_update_user', form );
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
		dispatch( updatedUserByAdmin( form ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to the server by an administrator to update an arbitrary user's data with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to the server by an administrator to update an arbitrary user's data
 */
export const adminUpdateUserInjector = ( dispatch ) => {
	return async ( form ) => {
		await adminUpdateUser( dispatch, form );
	};
};
