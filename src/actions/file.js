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
import axios from 'axios';
import qs from 'querystring';
import i18next from 'i18next';
import server from 'constants/server';
import copyToClipboard from 'clipboard-copy';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import { addNotification, addErrorNotification } from 'actions/notification';
import { RECEIVED_FILES, RECEIVED_NAMESPACE_FILES } from 'constants/action_types.js';


// FUNCTIONS //

async function getFilesRequest( dispatch, { namespaceName, owner = false }) {
	try {
		const url = `${server}/get_files?${qs.stringify({
			namespaceName,
			owner
		})}`;
		const res = await axios.get( url );
		const files = res.data.files;
		dispatch( receivedNamespaceFiles( files ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
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

export const getUserFiles = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_user_files' );
		dispatch( receivedFiles( res.data.files ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const deleteFile = async ( dispatch, _id, namespaceName, owner ) => {
	try {
		const res = await axios.post( `${server}/delete_file`, { _id });
		getFilesRequest( dispatch, { namespaceName, owner });
		addNotification( dispatch, {
			title: i18next.t('common:delete-file-title'),
			message: res.data.message,
			level: 'success'
		});
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const deleteFileInjector = ( dispatch ) => {
	return async ( _id, namespaceName, owner ) => {
		await deleteFile( dispatch, _id, namespaceName, owner );
	};
};

export const uploadFile = async ( dispatch, { formData }) => {
	try {
		const res = await axios.post( server+'/upload_file', formData );
		getFilesRequest( dispatch, {
			namespaceName: formData.get( 'namespaceName' ),
			owner: formData.get( 'owner' )
		});
		const msg = {
			title: i18next.t('common:file-upload-title'),
			message: res.data.message,
			level: 'success',
			position: 'tl',
			autoDismiss: 10
		};
		msg.children = <div style={{ marginBottom: 30 }}>
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="ownerTooltip">
				{i18next.t('common:copy-link')}
			</Tooltip>}>
				<Button
					size="sm"
					variant="outline-secondary"
					style={{ float: 'right', marginRight: '10px' }}
					onClick={() => {
						copyToClipboard( server+'/'+res.data.filename );
						addNotification( dispatch, {
							title: i18next.t('common:copied-title'),
							message: i18next.t('common:link-copied'),
							level: 'success',
							position: 'tl'
						});
					}}
				>
					<i className="fa fa-clipboard"></i>
				</Button>
			</OverlayTrigger>
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="ownerTooltip">
				{i18next.t('common:open-uploaded-file')}
			</Tooltip>}>
				<a
					href={server+'/'+res.data.filename}
					target="_blank"
					style={{ float: 'right', marginRight: '10px' }}
				>
					<Button size="sm" variant="outline-secondary">
						<i className="fa fa-external-link-alt"></i>
					</Button>
				</a>
			</OverlayTrigger>
		</div>;
		return addNotification( dispatch, msg );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const uploadFileInjector = ( dispatch ) => {
	return async ({ formData }) => {
		await uploadFile( dispatch, { formData } );
	};
};

export const getFilesInjector = ( dispatch ) => {
	return async ({ namespaceName }) => {
		await getFilesRequest( dispatch, { namespaceName });
	};
};

export const getOwnerFilesInjector = ( dispatch ) => {
	return async ({ namespaceName }) => {
		await getFilesRequest( dispatch, { namespaceName, owner: true });
	};
};
