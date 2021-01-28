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
import i18next from 'i18next';
import saveAs from 'utils/file_saver.js';
import server from 'constants/server';
import { addNotification, addErrorNotification } from 'actions/notification';
import { getCohorts } from 'actions/cohort';
import { APPEND_CREATED_NAMESPACE, CHANGED_NAMESPACE, DELETED_CURRENT_NAMESPACE, GET_ALL_NAMESPACES, UPDATED_OWNED_NAMESPACE, UPDATED_STUDENT_PROGRESS } from 'constants/action_types.js';


// EXPORTS //

export function appendCreatedNamespace( namespace ) {
	return {
		type: APPEND_CREATED_NAMESPACE,
		payload: {
			namespace
		}
	};
}

export function changedNamespace({ title, owners, announcements = [], cohorts = [], description, enableTicketing, _id }) {
	return {
		type: CHANGED_NAMESPACE,
		payload: {
			title,
			announcements,
			cohorts,
			description,
			enableTicketing,
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

export function updateStudentProgress({ email, lessonID, progress, cohort }) {
	return {
		type: UPDATED_STUDENT_PROGRESS,
		payload: {
			email, lessonID, progress, cohort
		}
	};
}

export function updatedOwnedNamespace({ title, owners, description, enableTicketing, _id }) {
	return {
		type: UPDATED_OWNED_NAMESPACE,
		payload: {
			title,
			description,
			owners,
			enableTicketing,
			_id
		}
	};
}

export const createNamespace = async ( dispatch, { title, description, owners, props }) => {
	try {
		const res = await axios.post( server+'/create_namespace', { title, description, owners });
		if ( !res.data.successful ) {
			return addErrorNotification( dispatch, new Error( res.data.message ));
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
	return async ({ title, description, owners, props }) => {
		await createNamespace( dispatch, { title, description, owners, props } );
	};
};

export const deleteCurrentNamespace = async ( dispatch, id, history ) => {
	try {
		const res = await axios.post( server+'/delete_namespace', { id });
		if ( history ) {
			history.replace( '/lessons' );
		}
		dispatch( deletedCurrentNamespace( id ) );
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const deleteCurrentNamespaceInjector = ( dispatch ) => {
	return async ( id, history ) => {
		await deleteCurrentNamespace( dispatch, id, history );
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
			namespaceID: ns._id
		});
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const updateCurrentNamespaceInjector = ( dispatch ) => {
	return async ( id, ns ) => {
		await updateCurrentNamespace( dispatch, id, ns );
	};
};

export const getNamespaceActions = async ( dispatch, { namespaceID, namespaceTitle } ) => {
	try {
		const res = await axios.get( server+'/get_namespace_actions?'+qs.stringify({ namespaceID }) );
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
	return async ({ namespaceID, namespaceTitle }) => {
		await getNamespaceActions( dispatch, { namespaceID, namespaceTitle });
	};
};

export const adjustProgress = async ( dispatch, { email, lessonID, namespaceID, progress, cohort }) => {
	const res = await axios.post( server+'/user_adjust_progress', {
		email, lessonID, namespaceID, progress
	});
	addNotification( dispatch, {
		title: i18next.t('common:updated'),
		message: res.data.message,
		level: 'success'
	});
	dispatch( updateStudentProgress({ email, lessonID, progress, cohort }) );
};

export const adjustProgressInjector = ( dispatch ) => {
	return async ( { email, lessonID, namespaceID, progress, cohort } ) => {
		await adjustProgress( dispatch, { email, lessonID, namespaceID, progress, cohort } );
	};
};

export const getAllNamespaces = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_all_namespaces' );
		dispatch({
			type: GET_ALL_NAMESPACES,
			payload: {
				namespaces: res.data.namespaces
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const getAllNamespacesInjector = ( dispatch ) => {
	return async () => {
		await getAllNamespaces( dispatch );
	};
};

export const setLessonOrder = async ( dispatch, { lessons, id }) => {
	try {
		await axios.post( server+'/set_lesson_order', {
			lessons, id
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const setLessonOrderInjector = ( dispatch ) => {
	return async ({ lessons, id }) => {
		await setLessonOrder( dispatch, { lessons, id } );
	};
};
