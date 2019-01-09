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
		fetchCredentials: ( obj ) => {
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
					return error;
				}
				user = JSON.parse( user );
				if ( user.picture ) {
					user.picture = server + '/avatar/' + user.picture;
				}
				user = {
					...obj,
					...user
				};
				dispatch( actions.loggedIn( user ) );
				request.get( server+'/get_enrollable_cohorts', {
					headers: {
						'Authorization': 'JWT ' + obj.token
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
			});
		}
	};
}

export default VisibleLogin;
