// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import server from 'constants/server';
import Login from 'components/login';
import * as actions from 'actions';


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
			request.post( server+'/login', {
				form
			}, clbk );
		},
		fetchCredentials: ( obj ) => {
			localStorage.setItem( 'ISLE_USER_'+server, JSON.stringify( obj ) );
			request.post( server+'/credentials_dashboard', {
				headers: {
					'Authorization': 'JWT ' + obj.token
				},
				form: {
					id: obj.id
				}
			}, function onLogin( error, response, body ) {
				if ( error ) {
					return error;
				}
				body = JSON.parse( body );
				if ( body.picture ) {
					body.picture = server + '/avatar/' + body.picture;
				}
				let user = {
					...obj,
					...body
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
					console.log( body );
					dispatch( actions.retrievedEnrollableCohorts( body.cohorts ) );
				});
			});
		}
	};
}

export default VisibleLogin;
