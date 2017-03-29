// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import { browserHistory } from 'react-router';
import CreateNamespace from './../components/create_namespace.js';
import * as actions from './../actions';


// EXPORTS //

const VisibleCreateNamespace = connect( mapStateToProps, mapDispatchToProps )( CreateNamespace );

function mapStateToProps( state ) {
	return {
		user: state.user
	};
} // end FUNCTION mapStateToProps()

function mapDispatchToProps( dispatch ) {
	return {
		createNamespace: ({ state, props }) => {
			const user = props.user;
			request.post( 'http://localhost:3000/create_namespace', {
				form: state,
				headers: {
					'Authorization': 'JWT ' + user.token
				}
			}, ( err, res ) => {
				if ( !err ) {
					const body = JSON.parse( res.body );
					let namespace = {
						title: state.title,
						description: state.description,
						owners: state.owners,
						_id: body._id
					};
					props.onNamespace( namespace );
					props.getNamespaces( user.token );
					browserHistory.replace( '/lessons' );
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
		getNamespaces: ( token ) => {
			request.get( 'http://localhost:3000/get_namespaces', {
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, function( error, response, body ) {
				if ( error ) {
					return error;
				}
				body = JSON.parse( body );
				dispatch( actions.retrievedNamespaces( body.namespaces ) );
			});
		},
		onNamespace: ({ title, description, owners, _id }) => {
			dispatch( actions.changedNamespace({ title, description, owners, _id }) );
		}
	};
} // end FUNCTION mapStateToProps()

export default VisibleCreateNamespace;
