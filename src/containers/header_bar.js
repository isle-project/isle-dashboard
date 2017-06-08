// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import HeaderBar from './../components/header_bar.js';
import server from './../constants/server';
import * as actions from './../actions';


// EXPORTS //

export default connect( mapStateToProps, mapDispatchToProps )( HeaderBar );

function mapStateToProps( state ) {
	return {
		user: state.user,
		namespace: state.namespace
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		logout: () => {
			dispatch( actions.loggedOut() );
			dispatch( actions.deletedCurrentNamespace() );
		},
		onNamespace: ({ title, description, owners, _id }, userToken ) => {
			dispatch( actions.changedNamespace({ title, description, owners, _id }) );
			request.get( server+'/get_cohorts', {
				headers: {
					'Authorization': 'JWT ' + userToken
				},
				qs: {
					namespaceID: _id
				},
			}, function( error, response, body ) {
				if ( error ) {
					return error;
				}
				body = JSON.parse( body );
				dispatch( actions.retrievedCohorts( body.cohorts ) );
			});
		}
	};
}
