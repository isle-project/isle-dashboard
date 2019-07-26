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
		}
	};
}

export default withRouter( VisibleCreateNamespace );
