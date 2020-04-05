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
import AdminPage from 'components/admin';
import server from 'constants/server';
import * as actions from 'actions';


// EXPORTS //

const VisibleAdminPage = connect( mapStateToProps, mapDispatchToProps )( AdminPage );

function mapStateToProps( state ) {
	return {
		admin: state.admin,
		user: state.user
	};
}

function mapDispatchToProps( dispatch ) {
	return {
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
		}
	};
}

export default VisibleAdminPage;
