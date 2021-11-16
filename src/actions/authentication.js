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
import server from 'constants/server';
import { addErrorNotification } from 'actions/notification.js';
import { loggedIn } from 'actions/user';


// VARIABLES //

const debug = logger( 'isle-dashboard:actions:authentication' );


// FUNCTIONS //

/**
 * Sanitizes the user object.
 *
 * @param {Object} user - user object
 * @returns {Array} sanitized user object and a boolean indicating whether the user object needs sanitizing on the server
 */
const sanitizeUser = ( user ) => {
	// Check for duplicated enrolled and owned namespaces:
	const ownedNamespaces = user.ownedNamespaces;
	const newOwnedNamespaces = [];
	let ids = new Set();
	for ( let i = 0; i < ownedNamespaces.length; i++ ) {
		if ( !ids.has( ownedNamespaces[ i ]._id ) ) {
			ids.add( ownedNamespaces[ i ]._id );
			newOwnedNamespaces.push( ownedNamespaces[ i ] );
		}
	}
	const enrolledNamespaces = user.enrolledNamespaces;
	const newEnrolledNamespaces = [];
	ids = new Set();
	for ( let i = 0; i < enrolledNamespaces.length; i++ ) {
		if ( !ids.has( enrolledNamespaces[ i ]._id ) ) {
			ids.add( enrolledNamespaces[ i ]._id );
			newEnrolledNamespaces.push( enrolledNamespaces[ i ] );
		}
	}
	const needsSanitizing = newOwnedNamespaces.length !== ownedNamespaces.length ||
		newEnrolledNamespaces.length !== enrolledNamespaces.length;

	if ( needsSanitizing ) {
		user.ownedNamespaces = newOwnedNamespaces;
		user.enrolledNamespaces = newEnrolledNamespaces;
	}
	debug( 'Does user need sanitizing? '+needsSanitizing );
	return [ user, needsSanitizing ];
};


// MAIN //

/**
 * Makes a POST request to the server to sanitize the user.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} user - user object
 * @returns {(Promise|null)} promise or null
 */
export const sanitizeRequest = ( dispatch, user ) => {
	try {
		return axios.post( server+'/sanitize_user', {
			id: user.id
		});
	} catch ( err ) {
		addErrorNotification( dispatch, err );
		return null;
	}
};

/**
 * Returns a function to make a POST request to the server to sanitize the user with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to the server to sanitize the user
 */
export const sanitizeRequestInjector = dispatch => {
	return async ( user ) => {
		const result = await sanitizeRequest( dispatch, user );
		return result;
	};
};

/**
 * Makes a POST request to the server to fetch the user's credentials.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} obj - object with a `id` property and a `token` property
 * @returns {(Object|null)} user object or null
 */
export const fetchCredentials = async ( dispatch, obj ) => {
	debug( 'Fetch user credentials...' );
	localStorage.setItem( 'ISLE_USER_'+server, JSON.stringify( obj ) );
	try {
		const res = await axios.post( server+'/credentials_dashboard', {
			id: obj.id
		});
		let user = res.data;
		if ( user.picture ) {
			user.picture = server + '/avatar/' + user.picture;
		}
		user = {
			...obj,
			...user
		};
		let [ sanitizedUser, needsSanitizing ] = sanitizeUser( user );
		dispatch( loggedIn( user ) );
		if ( needsSanitizing ) {
			sanitizeRequest( dispatch, obj );
		}
		return sanitizedUser;
	} catch ( err ) {
		addErrorNotification( dispatch, err );
		return null;
	}
};

/**
 * Returns a function to make a POST request to the server to fetch the user's credentials with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to the server to fetch the user's credentials
 */
export const fetchCredentialsInjector = dispatch => {
	return async ( obj ) => {
		const result = await fetchCredentials( dispatch, obj );
		return result;
	};
};
