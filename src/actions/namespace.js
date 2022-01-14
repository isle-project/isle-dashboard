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

/**
 * Returns an action object to be used in signalling that a namespace has been created.
 *
 * @param {Object} namespace - the created namespace
 * @returns {Object} the action object
 */
export function appendCreatedNamespace( namespace ) {
	return {
		type: APPEND_CREATED_NAMESPACE,
		payload: {
			namespace
		}
	};
}

/**
 * Returns an action object to be used in signalling that a namespace has been changed.
 *
 * @param {Object} namespace - the changed namespace
 * @param {string} namespace.title - namespace title
 * @param {Array} namespace.owners - ids of owners
 * @param {Array} namespace.announcements - announcements
 * @param {Array} namespace.cohorts - cohorts
 * @param {string} namespace.description - namespace description
 * @param {boolean} namespace.enableTicketing - controls if ticketing is enabled for the namespace
 * @param {string} namespace._id - id of the namespace
 * @returns {Object} the action object
 */
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

/**
 * Returns an action object to be used in signalling that a namespace has been deleted.
 *
 * @param {string} id - the id of the namespace to be deleted
 * @returns {Object} the action object
 */
export function deletedCurrentNamespace( id ) {
	return {
		type: DELETED_CURRENT_NAMESPACE,
		payload: {
			id
		}
	};
}

/**
 * Returns an action object to be used in signalling that a student's progress has been updated.
 *
 * @param {Object} options - progress of the student
 * @param {string} options.email - email of the student
 * @param {string} options.lessonId - lesson id
 * @param {number} options.progress - progress of the student
 * @param {Object} options.cohort - cohort of the student
 */
export function updateStudentProgress({ email, lessonID, progress, cohort }) {
	return {
		type: UPDATED_STUDENT_PROGRESS,
		payload: {
			email, lessonID, progress, cohort
		}
	};
}

/**
 * Returns an action object to be used in signalling that an owned namespace has been updated.
 *
 * @param {Object} namespace - the updated namespace
 * @param {string} namespace.title - namespace title
 * @param {Array} namespace.owners - ids of owners
 * @param {Array} namespace.enableTicketing - controls if ticketing is enabled for the namespace
 * @param {string} namespace._id - id of the namespace
 * @returns {Object} the action object
 */
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

/**
 * Makes a POST request to create a new namespace.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} namespace - the new namespace
 * @param {string} namespace.title - namespace title
 * @param {Array} namespace.description - namespace description
 * @param {Array} namespace.owners - ids of owners
 * @param {Object} namespace.props - properties of the invoking component
 */
export const createNamespace = async ( dispatch, { title, description, owners, props }) => {
	try {
		const res = await axios.post( server+'/create_namespace', { title, description, owners });
		if ( !res.data.successful ) {
			return addErrorNotification( dispatch, new Error( res.data.message ));
		}
		const namespace = res.data.namespace;
		props.onNamespace( namespace );
		dispatch( appendCreatedNamespace( namespace ) );
		window.location.replace( '/dashboard/lessons' );
		addNotification( dispatch, {
			message: res.data.message,
			level: res.data.successful ? 'success' : 'error'
		});
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to create a new namespace.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make the POST request to create a new namespace
 */
export const createNamespaceInjector = dispatch => {
	return async ({ title, description, owners, props }) => {
		await createNamespace( dispatch, { title, description, owners, props } );
	};
};

/**
 * Makes a POST request to delete a namespace.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} id - the id of the namespace to be deleted
 * @returns {void}
 */
export const deleteCurrentNamespace = async ( dispatch, id ) => {
	try {
		const res = await axios.post( server+'/delete_namespace', { id });
		window.location.replace( '/dashboard/lessons' );
		dispatch( deletedCurrentNamespace( id ) );
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to delete a namespace.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make the POST request to delete a namespace
 */
export const deleteCurrentNamespaceInjector = ( dispatch ) => {
	return async ( id ) => {
		await deleteCurrentNamespace( dispatch, id );
	};
};

/**
 * Makes a POST request to update a namespace.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} ns - the updated namespace
 */
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

/**
 * Returns a function to make a POST request to update a namespace.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make the POST request to update a namespace
 */
export const updateCurrentNamespaceInjector = ( dispatch ) => {
	return async ( id, ns ) => {
		await updateCurrentNamespace( dispatch, id, ns );
	};
};

/**
 * Makes a GET request to get a namespace's actions.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.namespaceID - id of the namespace
 * @param {string} options.namespaceTitle - title of the namespace
 * @returns {void}
 */
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

/**
 * Returns a function to make a GET request to get a namespace's actions.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make the GET request to get a namespace's actions
 */
export const getNamespaceActionsInjector = ( dispatch ) => {
	return async ({ namespaceID, namespaceTitle }) => {
		await getNamespaceActions( dispatch, { namespaceID, namespaceTitle });
	};
};

/**
 * Makes a POST request to update a user's lesson progress.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.namespaceID - id of the namespace
 * @param {string} options.lessonID - id of the lesson
 * @param {string} options.email - email of the user
 * @param {number} options.progress - progress of the user
 * @param {Object} options.cohort - cohort of the user
 */
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

/**
 * Returns a function to make a POST request to update a user's lesson progress.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make the POST request to update a user's lesson progress
 */
export const adjustProgressInjector = ( dispatch ) => {
	return async ( { email, lessonID, namespaceID, progress, cohort } ) => {
		await adjustProgress( dispatch, { email, lessonID, namespaceID, progress, cohort } );
	};
};

/**
 * Makes a GET request to get a all available namespaces.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {void}
 */
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

/**
 * Returns a function to make a GET request to get a all available namespaces.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make the GET request to get a all available namespaces
 */
export const getAllNamespacesInjector = ( dispatch ) => {
	return async () => {
		await getAllNamespaces( dispatch );
	};
};

/**
 * Makes a POST request to set the order lessons appear on the dashboard.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {Array} options.lessons - lessons of the course in the order to be displayed on the dashboard
 * @param {string} options.id - id of the namespace
 * @returns {void}
 */
export const setLessonOrder = async ( dispatch, { lessons, id }) => {
	try {
		await axios.post( server+'/set_lesson_order', {
			lessons, id
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to set the order lessons appear on the dashboard.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make the POST request to set the order lessons appear on the dashboard
 */
export const setLessonOrderInjector = ( dispatch ) => {
	return async ({ lessons, id }) => {
		await setLessonOrder( dispatch, { lessons, id } );
	};
};
