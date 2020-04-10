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

import request from 'request';
import qs from 'querystring';
import noop from '@stdlib/utils/noop';
import server from 'constants/server';
import copyToClipboard from 'clipboard-copy';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import { addNotification, addErrorNotification } from 'actions/notification';
import { RECEIVED_FILES, RECEIVED_NAMESPACE_FILES } from 'constants/action_types.js';


// FUNCTIONS //

async function getFilesRequest({ namespaceName, token, clbk = noop, dispatch, owner = false }) {
	try {
		const url = `${server}/get_files?${qs.stringify({
			namespaceName,
			owner
		})}`;
		const res = await fetch( url, {
			headers: {
				'Authorization': 'JWT ' + token
			}
		});
		const body = await res.json();
		dispatch( receivedNamespaceFiles( body.files ) );
		clbk( null, body.files );
	} catch ( err ) {
		clbk( err );
		addErrorNotification( dispatch, err.message );
	}
}


// EXPORTS //


export function receivedFiles( files ) {
	return {
		type: RECEIVED_FILES,
		payload: {
			files
		}
	};
}

export function receivedNamespaceFiles( files ) {
	return {
		type: RECEIVED_NAMESPACE_FILES,
		payload: {
			files
		}
	};
}

export const getUserFiles = ( dispatch, { token }) => {
	request.get( server+'/get_user_files', {
		headers: {
			'Authorization': 'JWT ' + token
		}
	}, function onResponse( error, response, body ) {
		if ( error ) {
			return error;
		}
		if ( response.statusCode === 200 ) {
			body = JSON.parse( body );
			dispatch( receivedFiles( body.files ) );
		}
	});
};

export const deleteFile = ( dispatch, _id, namespaceName, token, owner ) => {
	request.get( server+'/delete_file', {
		qs: {
			_id
		},
		headers: {
			'Authorization': 'JWT ' + token
		}
	}, ( err, res ) => {
		if ( err || res.statusCode >= 400 ) {
			let msg = err.message || res.body;
			return addErrorNotification( dispatch, msg );
		}
		getFilesRequest({ namespaceName, token, dispatch, owner });
		return addNotification( dispatch, {
			title: 'File Deleted',
			message: 'File successfully deleted',
			level: 'success'
		});
	});
};

export const deleteFileInjector = ( dispatch ) => {
	return ( _id, namespaceName, token, owner ) => {
		deleteFile( dispatch, _id, namespaceName, token, owner );
	};
};

export const uploadFile = ( dispatch, { token, formData }) => {
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
								addNotification( dispatch, {
									title: 'Copied',
									message: 'Link copied to clipboard',
									level: 'success',
									position: 'tl'
								});
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
			return addNotification( dispatch, msg );
		}
	};
	xhr.send( formData );
};

export const uploadFileInjector = ( dispatch ) => {
	return ({ token, formData }) => {
		uploadFile( dispatch, { token, formData } );
	};
};

export const getFilesInjector = ( dispatch ) => {
	return ( { namespaceName, token }, clbk ) => {
		getFilesRequest({ namespaceName, token, clbk, dispatch });
	};
};

export const getOwnerFilesInjector = ( dispatch ) => {
	return ({ namespaceName, token }, clbk ) => {
		getFilesRequest({ namespaceName, token, clbk, dispatch, owner: true });
	};
};
