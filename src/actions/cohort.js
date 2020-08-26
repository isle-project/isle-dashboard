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
import server from 'constants/server';
import { getLessons } from 'actions/lesson';
import { addNotification, addErrorNotification } from 'actions/notification';
import { ADD_ENROLLED_NAMESPACE, GET_ALL_COHORTS, RETRIEVED_COHORTS, RETRIEVED_ENROLLABLE_COHORTS } from 'constants/action_types.js';


// VARIABLES //

const debug = logger( 'isle-dashboard:actions:cohorts' );


// MAIN //

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

export function retrievedEnrollableCohorts( cohorts, user ) {
	return {
		type: RETRIEVED_ENROLLABLE_COHORTS,
		payload: {
			cohorts,
			user
		}
	};
}

export function retrievedCohorts( cohorts, user ) {
	return {
		type: RETRIEVED_COHORTS,
		payload: {
			cohorts,
			user
		}
	};
}

export function retrievedAllCohorts( cohorts ) {
	return {
		type: GET_ALL_COHORTS,
		payload: {
			cohorts
		}
	};
}


// EXPORTS //

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

export const getEnrollableCohortsInjector = dispatch => {
	return async ( user ) => {
		await getEnrollableCohorts( dispatch, user );
	};
};

export const getCohorts = async ( dispatch, { namespaceID }) => {
	try {
		const res = await axios.get( server+'/get_cohorts?'+qs.stringify({ namespaceID }) );
		dispatch( retrievedCohorts( res.data.cohorts ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const getCohortsInjector = ( dispatch ) => {
	return async ({ namespaceID, userToken }) => {
		await getCohorts( dispatch, { namespaceID, userToken });
	};
};

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

export const addUserToCohortInjector = ( dispatch ) => {
	return async ( cohortID, namespace ) => {
		await addUserToCohort( dispatch, cohortID, namespace );
	};
};

export const deleteCohort = async ( dispatch, _id, namespaceID ) => {
	try {
		await axios.post( server+'/delete_cohort', { _id });
		addNotification( dispatch, {
			message: 'Cohort successfully deleted',
			level: 'success'
		});
		dispatch( retrievedEnrollableCohorts( null ) );
		getCohorts( dispatch, {
			namespaceID
		});
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const deleteCohortInjector = ( dispatch ) => {
	return async ( _id, namespaceID ) => {
		await deleteCohort( dispatch, _id, namespaceID );
	};
};

export const createCohort = async ( dispatch, cohort, namespaceID ) => {
	try {
		await axios.post( server+'/create_cohort', cohort );
		addNotification( dispatch, {
			message: 'Cohort successfully created',
			level: 'success'
		});
		dispatch( retrievedEnrollableCohorts( null ) );
		getCohorts( dispatch, { namespaceID });
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const createCohortInjector = ( dispatch ) => {
	return async ( cohort, namespaceID ) => {
		await createCohort( dispatch, cohort, namespaceID );
	};
};

export const updateCohort = async ( dispatch, cohort, namespaceID ) => {
	try {
		const res = await axios.post( server+'/update_cohort', { cohort });
		let msg = res.data.message;
		let notification;
		if ( res.data.newEmails && res.data.newEmails.length > 0 ) {
			notification = {
				children: <div>
					<p>{msg}</p>
					<p>Email invitations to the following new users have been sent:</p>
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

export const updateCohortInjector = ( dispatch ) => {
	return async ( cohort, namespaceID ) => {
		await updateCohort( dispatch, cohort, namespaceID );
	};
};

export const getAllCohorts = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_all_cohorts' );
		dispatch( retrievedAllCohorts( res.data.cohorts ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const getAllCohortsInjector = ( dispatch ) => {
	return async () => {
		await getAllCohorts( dispatch );
	};
};
