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
import { AUTHENTICATED, USER_PICTURE_MODIFIED, DELETED_USER, GET_USERS, LOGGED_IN, LOGGED_OUT, RECEIVED_TOKEN, USER_UPDATED, USER_UPDATED_BY_ADMIN } from 'constants/action_types.js';


// VARIABLES //

const debug = logger( 'isle-dashboard:actions:user' );


// EXPORTS //

export function loggedIn( user ) {
	return {
		type: LOGGED_IN,
		payload: {
			email: user.email,
			verifiedEmail: user.verifiedEmail,
			name: user.name,
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
			licensed: user.licensed
		}
	};
}

export function receivedToken({ token, id }) {
	return {
		type: RECEIVED_TOKEN,
		payload: {
			token,
			id
		}
	};
}

export function loggedOut() {
	return {
		type: LOGGED_OUT
	};
}

export function authenticated() {
	return {
		type: AUTHENTICATED
	};
}

export function updateUserPicture( picture ) {
	return {
		type: USER_PICTURE_MODIFIED,
		payload: {
			picture
		}
	};
}

export const updatedUser = ({ name, organization }) => {
	return {
		type: USER_UPDATED,
		payload: {
			name,
			organization
		}
	};
};

export const updatedUserByAdmin = ( user ) => {
	return {
		type: USER_UPDATED_BY_ADMIN,
		payload: user
	};
};

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

export const getUsersInjector = dispatch => {
	return async () => {
		await getUsers( dispatch );
	};
};

export const impersonateUser = async ( dispatch, { id, password }) => {
	debug( 'Impersonating user with id '+id );
	try {
		const res = await axios.post( server+'/impersonate', { id, password });
		const user = await fetchCredentials( dispatch, {
			id: res.data.id
		});
		if ( user ) {
			getEnrollableCohorts( dispatch, user );
		}
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const impersonateUserInjector = dispatch => {
	return async ({ id, password }) => {
		await impersonateUser( dispatch, { id, password } );
	};
};

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

export const deleteUserInjector = dispatch => {
	return async ({ id }) => {
		await deleteUser( dispatch, { id } );
	};
};

export const uploadProfilePic = async ( dispatch, { token, avatarData, thumbnailData }) => {
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

export const uploadProfilePicInjector = ( dispatch ) => {
	return async ({ avatarData, thumbnailData }) => {
		await uploadProfilePic( dispatch, { avatarData, thumbnailData });
	};
};

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

export const authenticateInjector = ( dispatch ) => {
	return async ({ writeAccessToken }) => {
		const result = await authenticate( dispatch, { writeAccessToken });
		return result;
	};
};

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

export const forgotPasswordInjector = ( dispatch ) => {
	return async ({ email }) => {
		await forgotPassword( dispatch, { email });
	};
};

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

export const updateUserInjector = ( dispatch ) => {
	return async ({ name, organization, password, customFields }) => {
		await updateUser( dispatch, { name, organization, password, customFields });
	};
};

export const createUser = ( form ) => {
	return axios.post( server+'/create_user', form );
};

export const handleLogin = async ( dispatch, form ) => {
	const res = await axios.post( server+'/login', form );
	dispatch( receivedToken( res.data ) );
	return res;
};

export const handleLoginInjector = ( dispatch ) => {
	return async ( form ) => {
		const result = await handleLogin( dispatch, form );
		return result;
	};
};

export const restoreLogin = ( dispatch, user ) => {
	dispatch( loggedIn( user ) );
};

export const restoreLoginInjector = ( dispatch ) => {
	return ( user ) => {
		restoreLogin( dispatch, user );
	};
};

export const logout = ( dispatch ) => {
	localStorage.removeItem( 'ISLE_USER_'+server );
	dispatch( loggedOut() );
};

export const logoutInjector = ( dispatch ) => {
	return () => {
		logout( dispatch );
	};
};

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

export const userUpdateCheckInjector = ( dispatch ) => {
	return async ( user ) => {
		await userUpdateCheck( dispatch, user );
	};
};

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

export const resendConfirmEmailInjector = ( dispatch ) => {
	return async ( user ) => {
		await resendConfirmEmail( dispatch, user );
	};
};

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

export const adminUpdateUserInjector = ( dispatch ) => {
	return async ( form ) => {
		await adminUpdateUser( dispatch, form );
	};
};
