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
import { DELETED_FILE, GET_ALL_FILES, RECEIVED_FILES, RECEIVED_LICENSE, RECEIVED_NAMESPACE_FILES, REMOVED_LICENSE } from 'constants/action_types.js';


// FUNCTIONS //

async function getFilesRequest( dispatch, { namespaceName, owner = false }) {
	try {
		const url = `${server}/get_files?${qs.stringify({
			namespaceName,
			owner
		})}`;
		const res = await axios.get( url );
		const files = res.data.files;
		dispatch( receivedNamespaceFiles({ files, owner }) );
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

export function receivedLicense( license ) {
	return {
		type: RECEIVED_LICENSE,
		payload: {
			license
		}
	};
}

export function removedLicense() {
	return {
		type: REMOVED_LICENSE
	};
}

export function receivedNamespaceFiles({ files, owner }) {
	return {
		type: RECEIVED_NAMESPACE_FILES,
		payload: {
			files,
			owner
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

export const getUserFilesInjector = ( dispatch ) => {
	return async () => {
		await getUserFiles( dispatch );
	};
};

export const deleteFile = async ( dispatch, _id, namespaceName, owner ) => {
	try {
		const res = await axios.post( `${server}/delete_file`, { _id });
		if ( namespaceName ) {
			getFilesRequest( dispatch, { namespaceName, owner });
		} else {
			dispatch({
				type: DELETED_FILE,
				payload: {
					id: _id
				}
			});
		}
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

export const uploadFile = async ( dispatch, { formData, user }) => {
	try {
		const query = qs.stringify({
			namespaceName: formData.get( 'namespaceName' ),
			owner: formData.get( 'owner' ),
			jwt: user.token
		});
		const res = await axios.post( server+'/upload_file?'+ query, formData );
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
					rel="noopener noreferrer"
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
	return async ({ formData, user }) => {
		await uploadFile( dispatch, { formData, user } );
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

export const getAllFiles = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_all_files' );
		dispatch({
			type: GET_ALL_FILES,
			payload: {
				files: res.data.files
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const getAllFilesInjector = ( dispatch ) => {
	return async () => {
		await getAllFiles( dispatch );
	};
};

export const uploadLicense = async ( dispatch, { formData, user }) => {
	try {
		const query = qs.stringify({
			jwt: user.token
		});
		const res = await axios.post( server+'/upload_license?'+ query, formData );
		addNotification( dispatch, {
			title: i18next.t('common:uploaded'),
			message: res.data.message,
			level: 'success',
			position: 'tl',
			autoDismiss: 5
		});
		dispatch( receivedLicense( res.data.license ) );
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const uploadLicenseInjector = ( dispatch ) => {
	return async ({ formData, user }) => {
		await uploadLicense( dispatch, { formData, user } );
	};
};

export const getLicense = async ( dispatch, user ) => {
	try {
		const query = qs.stringify({
			jwt: user.token
		});
		const res = await axios.get( server+'/get_license?'+ query );
		dispatch( receivedLicense( res.data.license ) );
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const getLicenseInjector = ( dispatch ) => {
	return async ( user ) => {
		await getLicense( dispatch, user );
	};
};

export const removeLicense = async ( dispatch ) => {
	try {
		const res = await axios.post( server+'/remove_license' );
		if ( res.data.message === 'ok' ) {
			dispatch( removedLicense() );
		}
	} catch ( err ) {
		if ( err.message.includes( '404' ) ) {
			// Case: License file has already been removed
			dispatch( removedLicense() );
		}
		return addErrorNotification( dispatch, err );
	}
};

export const removeLicenseInjector = ( dispatch ) => {
	return async () => {
		await removeLicense( dispatch );
	};
};
