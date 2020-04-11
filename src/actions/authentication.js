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
			try {
				axios.post( server+'/sanitize_user', {
					id: obj.id
				});
			} catch ( err ) {
				addErrorNotification( dispatch, err );
			}
		}
		return sanitizedUser;
	} catch ( err ) {
		addErrorNotification( dispatch, err );
		return null;
	}
};

export const fetchCredentialsInjector = dispatch => {
	return ( obj ) => {
		return fetchCredentials( dispatch, obj );
	};
};
