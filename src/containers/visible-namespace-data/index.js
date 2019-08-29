// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import noop from '@stdlib/utils/noop';
import server from 'constants/server';
import { withRouter } from 'react-router';
import copyToClipboard from 'clipboard-copy';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import NamespaceData from 'components/namespace-data';
import * as actions from 'actions';


// FUNCTIONS //

function getFilesRequest({ namespaceName, token, clbk = noop, dispatch, owner = false }) {
	request.get( `${server}/get_files`, {
		qs: {
			namespaceName,
			owner
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
		dispatch( actions.receivedNamespaceFiles( body.files ) );
		clbk( null, body.files );
	});
}


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
			getFilesRequest({ namespaceName, token, clbk, dispatch });
		},
		getOwnerFiles: ({ namespaceName, token }, clbk ) => {
			getFilesRequest({ namespaceName, token, clbk, dispatch, owner: true });
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
		addNotification: ( notification ) => {
			dispatch( actions.addNotification( notification ) );
		},
		deleteFile: ( _id, namespaceName, token, owner ) => {
			request.get( server+'/delete_file', {
				qs: {
					_id
				},
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, ( err, res ) => {
				if ( err || res.statusCode >= 400 ) {
					let msg = res.body;
					return dispatch( actions.addNotification({
						message: msg,
						level: 'error'
					}) );
				}
				getFilesRequest({ namespaceName, token, dispatch, owner });
				return dispatch( actions.addNotification({
					title: 'File Deleted',
					message: 'File successfully deleted',
					level: 'success'
				}) );
			});
		},
		deleteAnnouncement: ({ namespaceName, token, createdAt, index }) => {
			request.post( server+'/delete_announcement', {
				form: {
					namespaceName,
					createdAt
				},
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, ( err, res ) => {
				if ( err || res.statusCode >= 400 ) {
					return dispatch( actions.addNotification({
						message: res.body,
						level: 'error'
					}) );
				}
				const obj = JSON.parse(res.body);
				dispatch( actions.addNotification({
					message: obj.message,
					level: 'success'
				}) );
				dispatch( actions.deletedAnnouncement(index, namespaceName) );
			});
		},
		editAnnouncement: ({ namespaceName, token, announcement }) => {
			request.post( server+'/edit_announcement', {
				form: {
					namespaceName,
					announcement
				},
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, ( err, res ) => {
				if ( err || res.statusCode >= 400 ) {
					return dispatch( actions.addNotification({
						message: res.body,
						level: 'error'
					}) );
				}
				const obj = JSON.parse(res.body);
				dispatch( actions.addNotification({
					message: obj.message,
					level: 'success'
				}) );
				dispatch( actions.editedAnnouncement( announcement, namespaceName) );
			});
		},
		addAnnouncement: ({ namespaceName, token, announcement }) => {
			request.post( server+'/new_announcement', {
				form: {
					namespaceName,
					announcement
				},
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, ( err, res ) => {
				if ( err || res.statusCode >= 400 ) {
					return dispatch( actions.addNotification({
						message: res.body,
						level: 'error'
					}) );
				}
				const obj = JSON.parse(res.body);
				dispatch( actions.addNotification({
					message: obj.message,
					level: 'success'
				}) );
				dispatch( actions.createdAnnouncement( announcement, namespaceName) );
			});
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
						getFilesRequest({
							namespaceName: formData.get( 'namespaceName' ),
							token,
							dispatch,
							owner: formData.get( 'owner' )
						});
					} else {
						message = xhr.responseText;
						level = 'error';
					}
					const msg = {
						title: 'File Upload',
						message,
						level,
						position: 'tl'
					};
					if ( level === 'success' ) {
						msg.autoDismiss = 10;
						msg.children = <div style={{ marginBottom: 30 }}>
							<OverlayTrigger placement="bottom" overlay={<Tooltip id="ownerTooltip">
								Copy link to clipboard
							</Tooltip>}>
								<Button
									size="sm"
									variant="outline-secondary"
									style={{ float: 'right', marginRight: '10px' }}
									onClick={() => {
										copyToClipboard( server+'/'+body.filename );
										dispatch( actions.addNotification({
											title: 'Copied',
											message: 'Link copied to clipboard',
											level: 'success',
											position: 'tl'
										}) );
									}}
								>
									<i className="fa fa-clipboard"></i>
								</Button>
							</OverlayTrigger>
							<OverlayTrigger placement="bottom" overlay={<Tooltip id="ownerTooltip">
								Open uploaded file
							</Tooltip>}>
								<a
									href={server+'/'+body.filename}
									target="_blank"
									style={{ float: 'right', marginRight: '10px' }}
								>
									<Button size="sm" variant="outline-secondary">
										<i className="fa fa-external-link-alt"></i>
									</Button>
								</a>
							</OverlayTrigger>
						</div>;
					}
					return dispatch( actions.addNotification( msg ) );
				}
			};
			xhr.send( formData );
		}
	};
}

export default withRouter( VisibleNamespaceData );
