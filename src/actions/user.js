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
import { DELETED_USER, GET_USERS } from 'constants/action_types.js';


// VARIABLES //

const debug = logger( 'isle-dashboard:actions:user' );


// EXPORTS //

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
