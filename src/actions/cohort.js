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
import logger from 'debug';
import i18next from 'i18next';
import server from 'constants/server';
import { getLessons } from 'actions/lesson';
import { addNotification, addErrorNotification } from 'actions/notification';
import { ADD_ENROLLED_NAMESPACE, GET_ALL_COHORTS, RETRIEVED_COHORTS, RETRIEVED_ENROLLABLE_COHORTS } from 'constants/action_types.js';


// VARIABLES //

const debug = logger( 'isle-dashboard:actions:cohorts' );


// MAIN //

/**
 * Returns an action for a new enrolled namespace.
 *
 * @param {Object} namespace - namespace object
 * @param {string} namespace._id - namespace ID
 * @param {string} namespace.title - namespace title
 * @param {string} namespace.description - namespace description
 * @param {Array} namespace.owners - namespace owners
 * @returns {Object} action
 */
export function addEnrolledNamespace({ title, owners, description, _id }) {
	return {
		type: ADD_ENROLLED_NAMESPACE,
		payload: {
			title,
			description,
			owners,
			_id
		}
	};
}

/**
 * Returns an action for retrieving all enrollable cohorts.
 *
 * @param {Array} cohorts - cohorts
 * @param {Object} user - user object
 * @returns {Object} action
 */
export function retrievedEnrollableCohorts( cohorts, user ) {
	return {
		type: RETRIEVED_ENROLLABLE_COHORTS,
		payload: {
			cohorts,
			user
		}
	};
}

/**
 * Returns an action for retrieved cohorts.
 *
 * @param {Array} cohorts - cohorts
 * @param {Object} user - user object
 * @returns {Object} action
 */
export function retrievedCohorts( cohorts, user ) {
	return {
		type: RETRIEVED_COHORTS,
		payload: {
			cohorts,
			user
		}
	};
}

/**
 * Returns an action for retrieving all cohorts.
 *
 * @param {Array} cohorts - cohorts
 * @returns {Object} action
 */
export function retrievedAllCohorts( cohorts ) {
	return {
		type: GET_ALL_COHORTS,
		payload: {
			cohorts
		}
	};
}


// EXPORTS //

/**
 * Makes a GET request for retrieving all enrollable cohorts.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} user - user object
 */
export const getEnrollableCohorts = async ( dispatch, user ) => {
	try {
		const res = await axios.get( server+'/get_enrollable_cohorts' );
		const cohorts = res.data.cohorts;
		debug( 'Retrieved '+cohorts.length+' cohorts...' );
		dispatch( retrievedEnrollableCohorts( cohorts, user ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function making a GET request for retrieving all enrollable cohorts with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make GET request for retrieving all enrollable cohorts
 */
export const getEnrollableCohortsInjector = dispatch => {
	return async ( user ) => {
		await getEnrollableCohorts( dispatch, user );
	};
};

/**
 * Makes a GET request for retrieving all cohorts for the selected course.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.namespaceID - course ID
 */
export const getCohorts = async ( dispatch, { namespaceID }) => {
	try {
		const res = await axios.get( server+'/get_cohorts?'+qs.stringify({ namespaceID }) );
		dispatch( retrievedCohorts( res.data.cohorts ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function making a GET request for retrieving all cohorts for the selected course with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make GET request for retrieving all cohorts for the selected course
 */
export const getCohortsInjector = ( dispatch ) => {
	return async ({ namespaceID, userToken }) => {
		await getCohorts( dispatch, { namespaceID, userToken });
	};
};

/**
 * Makes a POST request for adding the user to the selected cohort.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} cohortID - cohort ID
 * @param {Object} namespace - namespace object
 */
export const addUserToCohort = async ( dispatch, cohortID, namespace ) => {
	try {
		const res = await axios.post( server+'/add_to_cohort', { cohortID });
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
		dispatch( addEnrolledNamespace( namespace ) );
		const namespaceName = namespace.title;
		getLessons( dispatch, namespaceName );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function making a POST request for adding the user to the selected cohort with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make POST request for adding the user to the selected cohort
 */
export const addUserToCohortInjector = ( dispatch ) => {
	return async ( cohortID, namespace ) => {
		await addUserToCohort( dispatch, cohortID, namespace );
	};
};

/**
 * Makes a POST request for deleting the selected cohort.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} _id - cohort ID
 * @param {string} namespaceID - namespace identifier corresponding to the cohort
 */
export const deleteCohort = async ( dispatch, _id, namespaceID ) => {
	try {
		const res = await axios.post( server+'/delete_cohort', { _id });
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
		dispatch( retrievedEnrollableCohorts( null ) );
		if ( namespaceID ) {
			getCohorts( dispatch, {
				namespaceID
			});
		}
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function making a POST request for deleting the selected cohort with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make POST request for deleting the selected cohort
 */
export const deleteCohortInjector = ( dispatch ) => {
	return async ( _id, namespaceID ) => {
		await deleteCohort( dispatch, _id, namespaceID );
	};
};

/**
 * Makes a POST request for creating a new cohort.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} cohort - cohort object
 * @param {string} namespaceID - namespace identifier corresponding to the cohort
 */
export const createCohort = async ( dispatch, cohort, namespaceID ) => {
	try {
		const res = await axios.post( server+'/create_cohort', cohort );
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
		dispatch( retrievedEnrollableCohorts( null ) );
		getCohorts( dispatch, { namespaceID });
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function making a POST request for creating a new cohort with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make POST request for creating a new cohort
 */
export const createCohortInjector = ( dispatch ) => {
	return async ( cohort, namespaceID ) => {
		await createCohort( dispatch, cohort, namespaceID );
	};
};

/**
 * Makes a POST request for updating the selected cohort.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} cohort - cohort object
 * @param {string} namespaceID - namespace identifier corresponding to the cohort
 */
export const updateCohort = async ( dispatch, cohort, namespaceID ) => {
	try {
		const res = await axios.post( server+'/update_cohort', { cohort });
		let msg = res.data.message;
		let notification;
		if ( res.data.newEmails && res.data.newEmails.length > 0 ) {
			notification = {
				children: <div>
					<p>{msg}</p>
					<p>{i18next.t('common:email-invitations-sent')}</p>
					<p>{res.data.newEmails.join( '\n' )}</p>
				</div>,
				level: 'success',
				autoDismiss: 0,
				dismissible: 'button'
			};
		}
		else {
			notification = {
				message: msg,
				level: 'success'
			};
		}
		addNotification( dispatch, notification );
		dispatch( retrievedEnrollableCohorts( null ) );
		getCohorts( dispatch, { namespaceID });
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function making a POST request for updating the selected cohort with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make POST request for updating the selected cohort
 */
export const updateCohortInjector = ( dispatch ) => {
	return async ( cohort, namespaceID ) => {
		await updateCohort( dispatch, cohort, namespaceID );
	};
};

/**
 * Makes a POST request for retrieving the list of cohorts.
 *
 * @param {Function} dispatch - dispatch function
 */
export const getAllCohorts = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_all_cohorts' );
		dispatch( retrievedAllCohorts( res.data.cohorts ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function making a POST request for retrieving the list of all cohorts with a bound dispatch function.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make POST request for retrieving the list of all cohorts
 */
export const getAllCohortsInjector = ( dispatch ) => {
	return async () => {
		await getAllCohorts( dispatch );
	};
};
