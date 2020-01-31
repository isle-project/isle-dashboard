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
