// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import server from './../constants/server';
import { withRouter } from 'react-router';
import CreateNamespace from './../components/create_namespace.js';
import * as actions from './../actions';


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
				if ( !err ) {
					const body = JSON.parse( res.body );
					let namespace = {
						title,
						description,
						owners,
						_id: body._id
					};
					props.onNamespace( namespace );
					dispatch( actions.appendCreatedNamespace( namespace ) );
					props.history.replace( '/lessons' );
					props.addNotification({
						message: body.message,
						level: body.successful ? 'success' : 'error'
					});
				}
			});
		},
		addNotification: ({ message, level }) => {
			dispatch( actions.addNotification({ message, level }) );
		},
		onNamespace: ({ title, description, owners, _id }) => {
			dispatch( actions.changedNamespace({ title, description, owners, _id }) );
		}
	};
}

export default withRouter( VisibleCreateNamespace );
