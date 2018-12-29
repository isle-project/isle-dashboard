// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import ForgotPassword from 'components/forgot-password';
import server from 'constants/server';
import * as actions from 'actions';


// EXPORTS //

const VisibleForgotPassword = connect( mapStateToProps, mapDispatchToProps )( ForgotPassword );

function mapStateToProps( state ) {
	return {
		user: state.user
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		addNotification: ({ message, level }) => {
			dispatch( actions.addNotification({ message, level }) );
		},
		forgotPassword: ({ email }) => {
			request.get( server+'/forgot_password', {
				qs: {
					email
				}
			}, ( error, res ) => {
				if ( error ) {
					return dispatch( actions.addNotification({ message: error.message, level: 'error' }) );
				}
				if ( res.statusCode >= 400 ) {
					return dispatch( actions.addNotification({ message: res.body, level: 'error' }) );
				}
				dispatch( actions.addNotification({ message: 'Check your email inbox for a link to choose a new password.', level: 'success' }) );
			});
		}
	};
}

export default VisibleForgotPassword;
