// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import server from 'constants/server';
import { withRouter } from 'react-router';
import NamespaceData from 'components/namespace-data';
import * as actions from 'actions';


// EXPORTS //

const VisibleNamespaceData = connect( mapStateToProps, mapDispatchToProps )( NamespaceData );

function mapStateToProps( state ) {
	return {
		badges: state.badges,
		user: state.user,
		namespace: state.namespace
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		getBadges: () => {
			request.get( server+'/get_available_badges', function onBadges( err, res, body ) {
				if ( err ) {
					return dispatch( actions.addNotification({
						message: err.message,
						level: 'error'
					}) );
				}
				body = JSON.parse( body );
				dispatch( actions.retrievedBadges( body ) );
			});
		},
		getFiles: ({ namespaceName, token }, clbk ) => {
			request.get( server+'/get_files', {
				qs: {
					namespaceName
				},
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, function onFiles( err, res, body ) {
				if ( err ) {
					dispatch( actions.addNotification({
						message: err.message,
						level: 'error'
					}) );
					return clbk( err );
				}
				body = JSON.parse( body );
				clbk( null, body.files );
			});
		},
		getNamespaceActions: ({ namespaceID, token }, clbk ) => {
			request.post( server+'/get_namespace_actions', {
				form: {
					namespaceID
				},
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, clbk );
		},
		addNotification: ({ message, level }) => {
			dispatch( actions.addNotification({ message, level }) );
		},
		uploadFile: ({ token, formData }) => {
			const xhr = new XMLHttpRequest();
			xhr.open( 'POST', server+'/upload_file', true );
			xhr.setRequestHeader( 'Authorization', 'JWT ' + token );
			xhr.onreadystatechange = () => {
				if ( xhr.readyState === XMLHttpRequest.DONE ) {
					let message;
					let level;
					let body;
					if ( xhr.status === 200 ) {
						body = JSON.parse( xhr.responseText );
						message = body.message;
						level = 'success';
					} else {
						message = xhr.responseText;
						level = 'error';
					}
					return dispatch( actions.addNotification({
						title: 'File Upload',
						message,
						level,
						position: 'tl'
					}) );
				}
			};
			xhr.send( formData );
		}
	};
}

export default withRouter( VisibleNamespaceData );
