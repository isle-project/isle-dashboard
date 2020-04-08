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
import server from 'constants/server';
import { addNotification, addErrorNotification } from 'actions/notification';
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

export const createNamespace = ( dispatch, { title, description, owners, props }) => {
	request.post( server+'/create_namespace', {
		form: { title, description, owners },
		headers: {
			'Authorization': 'JWT ' + props.user.token
		}
	}, ( err, res ) => {
		if ( err ) {
			return addErrorNotification( dispatch, err.message );
		}
		const body = JSON.parse( res.body );
		if ( !body.successful ) {
			return addErrorNotification( dispatch, body.message );
		}
		const namespace = body.namespace;
		props.onNamespace( namespace );
		dispatch( appendCreatedNamespace( namespace ) );
		props.history.replace( '/lessons' );
		addNotification( dispatch, {
			message: body.message,
			level: body.successful ? 'success' : 'error'
		});
	});
};

export const createNamespaceInjector = dispatch => {
	return ({ title, description, owners, props }) => {
		createNamespace( dispatch, { title, description, owners, props } );
	};
};

export const deleteCurrentNamespace = ( dispatch, id, token, history ) => {
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
			return addErrorNotification( dispatch, msg );
		}
		history.replace( '/lessons' );
		dispatch( deletedCurrentNamespace( id ) );
		addNotification( dispatch, {
			message: 'Course successfully deleted',
			level: 'success'
		});
	});
};

export const deleteCurrentNamespaceInjector = ( dispatch ) => {
	return ( id, token, history ) => {
		deleteCurrentNamespace( dispatch, id, token, history );
	};
};

export const updateCurrentNamespace = ( dispatch, ns, clbk ) => {
	request.post( server+'/update_namespace', {
		form: {
			ns
		},
		headers: {
			'Authorization': 'JWT ' + ns.token
		}
	}, ( err, res, body ) => {
		if ( err ) {
			return clbk( err );
		}
		if ( res.statusCode === 200 ) {
			body = JSON.parse( body );
			dispatch( changedNamespace( body.namespace ) );
			dispatch( updatedOwnedNamespace( body.namespace ) );
		}
		return clbk( null, res );
	});
};

export const updateCurrentNamespaceInjector = ( dispatch ) => {
	return ( id, ns, clbk ) => {
		updateCurrentNamespace( dispatch, id, ns, clbk );
	};
};
