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

import axios from 'axios';
import qs from 'querystring';
import saveAs from 'utils/file_saver.js';
import server from 'constants/server';
import { addNotification, addErrorNotification } from 'actions/notification';
import { getCohorts } from 'actions/cohort';
import { APPEND_CREATED_NAMESPACE, CHANGED_NAMESPACE, DELETED_CURRENT_NAMESPACE, UPDATED_OWNED_NAMESPACE } from 'constants/action_types.js';


// EXPORTS //

export function appendCreatedNamespace( namespace ) {
	return {
		type: APPEND_CREATED_NAMESPACE,
		payload: {
			namespace
		}
	};
}

export function changedNamespace({ title, owners, announcements = [], cohorts = [], description, _id }) {
	return {
		type: CHANGED_NAMESPACE,
		payload: {
			title,
			announcements,
			cohorts,
			description,
			owners,
			_id
		}
	};
}

export function deletedCurrentNamespace( id ) {
	return {
		type: DELETED_CURRENT_NAMESPACE,
		payload: {
			id
		}
	};
}

export function updatedOwnedNamespace({ title, owners, description, _id }) {
	return {
		type: UPDATED_OWNED_NAMESPACE,
		payload: {
			title,
			description,
			owners,
			_id
		}
	};
}

export const createNamespace = async ( dispatch, { title, description, owners, props }) => {
	try {
		const res = await axios.post( server+'/create_namespace', { title, description, owners });
		if ( !res.data.successful ) {
			return addErrorNotification( dispatch, res.data.message );
		}
		const namespace = res.data.namespace;
		props.onNamespace( namespace );
		dispatch( appendCreatedNamespace( namespace ) );
		props.history.replace( '/lessons' );
		addNotification( dispatch, {
			message: res.data.message,
			level: res.data.successful ? 'success' : 'error'
		});
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const createNamespaceInjector = dispatch => {
	return ({ title, description, owners, props }) => {
		createNamespace( dispatch, { title, description, owners, props } );
	};
};

export const deleteCurrentNamespace = async ( dispatch, id, history ) => {
	try {
		await axios.get( server+'/delete_namespace?'+qs.stringify({ id }) );
		history.replace( '/lessons' );
		dispatch( deletedCurrentNamespace( id ) );
		addNotification( dispatch, {
			message: 'Course successfully deleted',
			level: 'success'
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const deleteCurrentNamespaceInjector = ( dispatch ) => {
	return ( id, token, history ) => {
		deleteCurrentNamespace( dispatch, id, token, history );
	};
};

export const updateCurrentNamespace = async ( dispatch, ns ) => {
	try {
		const res = await axios.post( server+'/update_namespace', { ns });
		dispatch( changedNamespace( res.data.namespace ) );
		dispatch( updatedOwnedNamespace( res.data.namespace ) );
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
		getCohorts( dispatch, {
			namespaceID: ns
		});
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const updateCurrentNamespaceInjector = ( dispatch ) => {
	return ( id, ns, clbk ) => {
		updateCurrentNamespace( dispatch, id, ns, clbk );
	};
};

export const getNamespaceActions = async ( dispatch, { namespaceID, namespaceTitle } ) => {
	try {
		const res = await axios.post( server+'/get_namespace_actions', { namespaceID });
		const blob = new Blob([ res.data ], {
			type: 'application/json'
		});
		const name = `actions_${namespaceTitle}.json`;
		saveAs( blob, name );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const getNamespaceActionsInjector = ( dispatch ) => {
	return ({ namespaceID, namespaceTitle }) => {
		getNamespaceActions( dispatch, { namespaceID, namespaceTitle });
	};
};
