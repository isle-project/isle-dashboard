// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import ForgotPassword from './../components/forgot_password.js';
import * as actions from './../actions';


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
	};
}

export default VisibleForgotPassword;
