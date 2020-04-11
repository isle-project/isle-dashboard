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
import server from 'constants/server';
import { fetchCredentials } from 'actions/authentication.js';
import { getEnrollableCohorts } from 'actions/cohort.js';
import { addNotification, addErrorNotification } from 'actions/notification.js';
import { AUTHENTICATED, USER_PICTURE_MODIFIED, DELETED_USER, GET_USERS, LOGGED_IN, LOGGED_OUT, RECEIVED_TOKEN, USER_UPDATED } from 'constants/action_types.js';


// VARIABLES //

const debug = logger( 'isle-dashboard:actions:user' );


// EXPORTS //

export function loggedIn( user ) {
	return {
		type: LOGGED_IN,
		payload: {
			email: user.email,
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
			spentTime: user.spentTime
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
	return () => {
		getUsers( dispatch );
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
	return ({ id, password }) => {
		impersonateUser( dispatch, { id, password } );
	};
};

export const deleteUser = async ( dispatch, { id }) => {
	try {
		await axios.post( server+'/delete_user', { id });
		addNotification( dispatch, {
			title: 'Deleted',
			message: 'User successfully deleted',
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
	return ({ id }) => {
		deleteUser( dispatch, { id } );
	};
};

export const uploadProfilePic = ( dispatch, { token, avatarData, thumbnailData }) => {
	const xhr = new XMLHttpRequest();
	xhr.open( 'POST', server+'/upload_profile_pic', true );
	xhr.setRequestHeader( 'Authorization', 'JWT ' + token );
	xhr.onreadystatechange = () => {
		if ( xhr.readyState === XMLHttpRequest.DONE ) {
			let message;
			let level;
			let body;
			if ( xhr.status === 200 ) {
				body = JSON.parse( xhr.responseText );
				message = body.message;
				level = 'success';
				body.filename = server + '/avatar/' + body.filename;
				dispatch( updateUserPicture( body.filename ) );
			} else {
				message = xhr.responseText;
				level = 'error';
			}
			return addNotification( dispatch, {
				title: 'Profile Picture Upload',
				message,
				level,
				position: 'tl'
			});
		}
	};
	xhr.send( avatarData );

	const xhr2 = new XMLHttpRequest();
	xhr2.open( 'POST', server+'/upload_thumbnail_pic', true );
	xhr2.setRequestHeader( 'Authorization', 'JWT ' + token );
	xhr2.send( thumbnailData );
};

export const uploadProfilePicInjector = ( dispatch ) => {
	return ({ token, avatarData, thumbnailData }) => {
		uploadProfilePic( dispatch, { token, avatarData, thumbnailData });
	};
};

export const authenticate = async ( dispatch, { writeAccessToken }) => {
	try {
		const res = await axios.get( server+'/set_write_access?'+qs.stringify({ token: writeAccessToken }) );
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
	return ({ writeAccessToken }) => {
		authenticateInjector( dispatch, { writeAccessToken });
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
	return ({ email }) => {
		forgotPassword( dispatch, { email });
	};
};

export const updateUser = ( dispatch, { name, organization }) => {
	dispatch({
		type: USER_UPDATED,
		payload: {
			name,
			organization
		}
	});
};

export const updateUserInjector = ( dispatch ) => {
	return ({ name, organization }) => {
		updateUser( dispatch, { name, organization });
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
	return ( form ) => {
		return handleLogin( dispatch, form );
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
			id: user.id,
			updatedAt: user.updatedAt
		}) );
		debug( 'Received response: '+res.data );
		if ( !res.data.hasMostRecent ) {
			const res = await axios.post( server+'/credentials_dashboard', {
				id: user.id
			});
			const newUser = res.data;
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
	return ( user ) => {
		userUpdateCheck( dispatch, user );
	};
};
