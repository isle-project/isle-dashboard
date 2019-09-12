// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import logger from 'debug';
import isRegExpString from '@stdlib/assert/is-regexp-string';
import reFromString from '@stdlib/utils/regexp-from-string';
import contains from '@stdlib/assert/contains';
import server from 'constants/server';
import Login from 'components/login';
import * as actions from 'actions';


// VARIABLES //

const debug = logger( 'isle-dashboard:visible-login' );


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


// EXPORTS //

const VisibleLogin = connect( mapStateToProps, mapDispatchToProps )( Login );

function mapStateToProps( state ) {
	return {
		user: state.user
	};
}


function mapDispatchToProps( dispatch ) {
	return {
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
}

export default VisibleLogin;
