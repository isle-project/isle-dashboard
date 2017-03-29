// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
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
		deleteCurrentNamespace: ( id, token ) => {
			request.get( 'http://localhost:3000/delete_namespace', {
				qs: {
					id
				},
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, ( err ) => {
				if ( !err ) {
					browserHistory.replace( '/lessons' );
					dispatch( actions.deletedCurrentNamespace() );
					dispatch( actions.addNotification({
						message: 'Course successfully deleted',
						level: 'success'
					}) );
				}
			});
		},
		updateCurrentNamespace: ( ns, clbk ) => {
			request.post( 'http://localhost:3000/update_namespace', {
				form: {
					ns
				},
				headers: {
					'Authorization': 'JWT ' + ns.token
				}
			}, ( err ) => {
				if ( err ) {
					return err;
				}
				clbk();
				dispatch( actions.changedNamespace( ns ) );
			});
		}
	};
} // end FUNCTION mapStateToProps()

export default VisibleEditNamespace;
