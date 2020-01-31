/**
* Copyright (C) 2016-2020 The ISLE Authors
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
import { withRouter } from 'react-router';
import request from 'request';
import server from 'constants/server';
import CreateNamespace from 'components/create-namespace';
import * as actions from 'actions';


// EXPORTS //

const VisibleCreateNamespace = connect( mapStateToProps, mapDispatchToProps )( CreateNamespace );

function mapStateToProps( state ) {
	return {
		user: state.user
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		createNamespace: ({ title, description, owners, props }) => {
			request.post( server+'/create_namespace', {
				form: { title, description, owners },
				headers: {
					'Authorization': 'JWT ' + props.user.token
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
				if ( !body.successful ) {
					return dispatch( actions.addNotification({
						title: 'Error encountered',
						message: body.message,
						level: 'error'
					}) );
				}
				const namespace = body.namespace;
				props.onNamespace( namespace );
				dispatch( actions.appendCreatedNamespace( namespace ) );
				props.history.replace( '/lessons' );
				props.addNotification({
					message: body.message,
					level: body.successful ? 'success' : 'error'
				});
			});
		},
		addNotification: ( notification ) => {
			dispatch( actions.addNotification( notification ) );
		},
		onNamespace: ({ title, description, announcements, owners, _id }) => {
			dispatch( actions.changedNamespace({ title, description, announcements, owners, _id }) );
			dispatch( actions.retrievedLessons({ lessons: [], namespaceName: title }) );
		}
	};
}

export default withRouter( VisibleCreateNamespace );
