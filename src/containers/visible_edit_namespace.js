// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import server from './../constants/server';
import { browserHistory } from 'react-router';
import EditNamespace from './../components/edit_namespace.js';
import * as actions from './../actions';


// EXPORTS //

const VisibleEditNamespace = connect( mapStateToProps, mapDispatchToProps )( EditNamespace );

function mapStateToProps( state ) {
	return {
		user: state.user,
		namespace: state.namespace
	};
} // end FUNCTION mapStateToProps()

function  mapDispatchToProps( dispatch ) {
	return {
		addNotification: ({ message, level }) => {
			dispatch( actions.addNotification({ message, level }) );
		},
		getNamespaces: ( token ) => {
			request.get( server+'/get_namespaces', {
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
		deleteCurrentNamespace: ( id, token, clbk ) => {
			request.get( server+'/delete_namespace', {
				qs: {
					id
				},
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, ( err, res ) => {
				if ( err || res.statusCode >= 400 ) {
					let msg = res.body;
					if ( res.statusCode === 403 ) {
						msg = 'Only courses with no lessons can be deleted.';
					}
					return dispatch( actions.addNotification({
						message: msg,
						level: 'error'
					}) );
				}
				browserHistory.replace( '/lessons' );
				dispatch( actions.deletedCurrentNamespace() );
				dispatch( actions.addNotification({
					message: 'Course successfully deleted',
					level: 'success'
				}) );
				clbk();
			});
		},
		updateCurrentNamespace: ( ns, clbk ) => {
			request.post( server+'/update_namespace', {
				form: {
					ns
				},
				headers: {
					'Authorization': 'JWT ' + ns.token
				}
			}, ( err, res ) => {
				if ( err ) {
					return clbk( err );
				}
				clbk( null, res );
				dispatch( actions.changedNamespace( ns ) );
			});
		}
	};
} // end FUNCTION mapStateToProps()

export default VisibleEditNamespace;
