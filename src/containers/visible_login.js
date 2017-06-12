// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import server from './../constants/server';
import Login from './../components/login.js';
import * as actions from './../actions';


// EXPORTS //

const VisibleLogin = connect( mapStateToProps, mapDispatchToProps )( Login );

function mapStateToProps( state ) {
	return {
		user: state.user
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		handleLogin: ( obj ) => {
			localStorage.setItem( 'isle', JSON.stringify( obj ) );
			request.post( server+'/credentials', {
				headers: {
					'Authorization': 'JWT ' + obj.token
				},
				form: {
					 id: obj.id
				}
			}, function( error, response, body ) {
				if ( error ) {
					return error;
				}
				let user = {
					...obj,
					...JSON.parse( body )
				};
				dispatch( actions.loggedIn( user ) );
			});
		}
	};
}

export default VisibleLogin;
