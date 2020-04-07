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
import request from 'request';
import logger from 'debug';
import isRegExpString from '@stdlib/assert/is-regexp-string';
import reFromString from '@stdlib/utils/regexp-from-string';
import contains from '@stdlib/assert/contains';
import server from 'constants/server';
import * as actions from 'actions';


// VARIABLES //

const debug = logger( 'isle-dashboard:dispatch' );


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

function mapDispatchToProps( dispatch ) {
	const methods = {
		getUsers: ( user ) => {
			request.get( server+'/get_users', {
				headers: {
					'Authorization': 'JWT ' + user.token
				}
			}, ( err, res ) => {
				if ( err ) {
					return dispatch( actions.addNotification({
						title: 'Error encountered',
						message: err.message,
						level: 'error'
					}) );
				}
				const body = JSON.parse( res.body );
				dispatch( actions.retrievedUsers( body.users ) );
			});
		},
		deleteUser: ({ id, token }) => {
			request.post( server+'/delete_user', {
				form: { id },
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, ( err, res ) => {
				if ( err ) {
					return dispatch( actions.addNotification({
						title: 'Error encountered',
						message: err.message,
						level: 'error'
					}) );
				}
				dispatch( actions.addNotification({
					title: 'Deleted',
					message: 'User successfully deleted',
					level: 'success'
				}) );
				dispatch( actions.deleteUser({ id }) );
			});
		},
		impersonateUser: ({ id, token, password }) => {
			debug( 'Impersonating user with id '+id );
			request.post( server+'/impersonate', {
				form: { id, password },
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, ( err, res ) => {
				if ( err || res.statusCode !== 200 ) {
					return dispatch( actions.addNotification({
						title: 'Error encountered',
						message: err ? err.message : res.body,
						level: 'error'
					}) );
				}
				const body = JSON.parse( res.body );
				methods.fetchCredentials({
					token: body.token,
					id: body.id
				}, ( err, user ) => {
					methods.getEnrollableCohorts( user );
				});
			});
		},

		handleLogin: ( form, clbk ) => {
			debug( 'Login user on server...' );
			request.post( server+'/login', {
				form
			}, clbk );
		},
		restoreLogin: ( user ) => {
			dispatch( actions.loggedIn( user ) );
		},
		fetchCredentials: ( obj, clbk ) => {
			debug( 'Fetch user credentials...' );
			localStorage.setItem( 'ISLE_USER_'+server, JSON.stringify( obj ) );
			request.post( server+'/credentials_dashboard', {
				headers: {
					'Authorization': 'JWT ' + obj.token
				},
				form: {
					id: obj.id
				}
			}, function onLogin( error, response, user ) {
				if ( error ) {
					return clbk( error );
				}
				user = JSON.parse( user );
				if ( user.picture ) {
					user.picture = server + '/avatar/' + user.picture;
				}
				user = {
					...obj,
					...user
				};
				let [ sanitizedUser, needsSanitizing ] = sanitizeUser( user );
				dispatch( actions.loggedIn( sanitizedUser ) );
				if ( needsSanitizing ) {
					request.post( server+'/sanitize_user', {
						headers: {
							'Authorization': 'JWT ' + obj.token
						},
						form: {
							id: obj.id
						}
					}, function onSanitize( error ) {
						if ( error ) {
							return dispatch( actions.addNotification({ message: error.message, level: 'error' }) );
						}
					});
				}
				return clbk( null, sanitizedUser );
			});
		},
		getEnrollableCohorts: ( user ) => {
			request.get( server+'/get_enrollable_cohorts', {
				headers: {
					'Authorization': 'JWT ' + user.token
				}
			}, function onCohorts( error, response, body ) {
				if ( error ) {
					return error;
				}
				body = JSON.parse( body );
				let cohorts = body.cohorts;
				cohorts = cohorts.filter( elem => {
					let emailFilter = elem.emailFilter || '';
					if ( isRegExpString( emailFilter ) ) {
						emailFilter = reFromString( emailFilter );
					}
					return contains( user.email, emailFilter );
				});
				dispatch( actions.retrievedEnrollableCohorts( cohorts ) );
			});
		}
	};
	return methods;
}


// EXPORTS //

export default mapDispatchToProps;
