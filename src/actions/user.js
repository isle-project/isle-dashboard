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

import request from 'request';
import logger from 'debug';
import server from 'constants/server';
import { fetchCredentials } from 'actions/authentication.js';
import { getEnrollableCohorts } from 'actions/cohort.js';
import { addNotification, addErrorNotification } from 'actions/notification.js';
import { AUTHENTICATED, USER_PICTURE_MODIFIED, DELETED_USER, GET_USERS, LOGGED_IN, LOGGED_OUT, USER_UPDATED } from 'constants/action_types.js';


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
			token: user.token,
			writeAccess: user.writeAccess,
			administrator: user.administrator,
			id: user.id,
			lessonData: user.lessonData,
			picture: user.picture,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			score: user.score,
			spentTime: user.spentTime
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

export const getUsers = async ( dispatch, user ) => {
	try {
		const res = await request.get( server+'/get_users', {
			headers: {
				'Authorization': 'JWT ' + user.token
			}
		});
		const { users } = JSON.parse( res.body );
		dispatch({
			type: GET_USERS,
			payload: {
				users
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err.message );
	}
};

export const getUsersInjector = dispatch => {
	return users => {
		getUsers( dispatch, users );
	};
};

export const impersonateUser = ( dispatch, { id, token, password }) => {
	debug( 'Impersonating user with id '+id );
	request.post( server+'/impersonate', {
		form: { id, password },
		headers: {
			'Authorization': 'JWT ' + token
		}
	}, ( err, res ) => {
		if ( err || res.statusCode !== 200 ) {
			return addErrorNotification( dispatch, err ? err.message : res.body );
		}
		const body = JSON.parse( res.body );
		fetchCredentials( dispatch, {
			token: body.token,
			id: body.id
		}, ( err, user ) => {
			getEnrollableCohorts( dispatch, user );
		});
	});
};

export const impersonateUserInjector = dispatch => {
	return ({ id, token, password }) => {
		impersonateUser( dispatch, { id, token, password } );
	};
};

export const deleteUser = async ( dispatch, { id, token }) => {
	try {
		await request.post( server+'/delete_user', {
			form: { id },
			headers: {
				'Authorization': 'JWT ' + token
			}
		});
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
		return addNotification( dispatch, err.message );
	}
};

export const deleteUserInjector = dispatch => {
	return ({ id, token }) => {
		deleteUser( dispatch, { id, token } );
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
		uploadProfilePic( dispatchEvent, { token, avatarData, thumbnailData });
	};
};

export const authenticate = ( dispatch, { userToken, writeAccessToken }, clbk ) => {
	debug( 'Authenticate user with token: %s', userToken );
	request.get( server+'/set_write_access', {
		headers: {
			'Authorization': 'JWT ' + userToken
		},
		qs: {
			token: writeAccessToken
		}
	}, function onResponse( error, response, body ) {
		if ( error ) {
			return clbk( error );
		}
		if ( response.statusCode !== 200 ) {
			addErrorNotification( dispatch, 'The provided token is incorrect.' );
			return clbk( null, false );
		}
		body = JSON.parse( body );
		dispatch( authenticated() );
		addNotification( dispatch, {
			message: body.message+' You can now create your own courses on ISLE and have access to the gallery of public lessons.',
			level: 'success',
			autoDismiss: 10
		});
		return clbk( null, true );
	});
};

export const authenticateInjector = ( dispatch ) => {
	return ( { userToken, writeAccessToken }, clbk ) => {
		authenticateInjector( dispatch, { userToken, writeAccessToken }, clbk );
	};
};

export const forgotPassword = ( dispatch, { email }) => {
	request.get( server+'/forgot_password', {
		qs: {
			email
		}
	}, ( error, res ) => {
		if ( error ) {
			return addErrorNotification( dispatch, error.message );
		}
		if ( res.statusCode >= 400 ) {
			return addErrorNotification( dispatch, res.body );
		}
		addNotification( dispatch, {
			message: 'Check your email inbox for a link to choose a new password.',
			level: 'success'
		});
	});
};

export const forgotPasswordInjector = ( dispatch ) => {
	return ({ email }) => {
		forgotPassword( dispatch, { email } );
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

export const createUser = ( form, clbk ) => {
	request.post( server+'/create_user', {
		form
	}, clbk );
};

export const handleLogin = ( form, clbk ) => {
	request.post( server+'/login', {
		form
	}, clbk );
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

export const userUpdateCheck = ( dispatch, user ) => {
	request.get( server+'/user_update_check', {
		headers: {
			'Authorization': 'JWT ' + user.token
		},
		qs: {
			id: user.id,
			updatedAt: user.updatedAt
		}
	}, function onUserCheck( error, response, body ) {
		if ( error ) {
			return error;
		}
		debug( 'Received response: '+body );
		body = JSON.parse( body );
		if ( !body.hasMostRecent ) {
			request.post( server+'/credentials_dashboard', {
				headers: {
					'Authorization': 'JWT ' + user.token
				},
				form: {
					id: user.id
				}
			}, function onLogin( error, response, newUser ) {
				if ( error ) {
					return error;
				}
				newUser = JSON.parse( newUser );
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
			});
		}
	});
};

export const userUpdateCheckInjector = ( dispatch ) => {
	return ( user ) => {
		userUpdateCheck( dispatch, user );
	};
};
