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
import logger from 'debug';
import server from 'constants/server';
import { getLessons } from 'actions/lesson';
import { addNotification, addErrorNotification } from 'actions/notification';
import { ADD_ENROLLED_NAMESPACE, RETRIEVED_COHORTS, RETRIEVED_ENROLLABLE_COHORTS } from 'constants/action_types.js';


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

export function retrievedEnrollableCohorts( cohorts ) {
	return {
		type: RETRIEVED_ENROLLABLE_COHORTS,
		payload: {
			cohorts
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


// EXPORTS //

export const getEnrollableCohorts = ( dispatch, user ) => {
	request.get( server+'/get_enrollable_cohorts', {
		headers: {
			'Authorization': 'JWT ' + user.token
		}
	}, function onCohorts( error, response, body ) {
		if ( error ) {
			return error;
		}
		body = JSON.parse( body );
		let cohorts = body.cohorts;
		debug( 'Retrieved '+cohorts.length+' cohorts...' );
		dispatch( retrievedEnrollableCohorts( cohorts, user ) );
	});
};

export const getEnrollableCohortsInjector = dispatch => {
	return ( user ) => {
		getEnrollableCohorts( dispatch, user );
	};
};

export const getCohorts = ( dispatch, { namespaceID, userToken }) => {
	request.get( server+'/get_cohorts', {
		headers: {
			'Authorization': 'JWT ' + userToken
		},
		qs: {
			namespaceID
		}
	}, function onCohorts( error, response, body ) {
		if ( error ) {
			return error;
		}
		body = JSON.parse( body );
		dispatch( retrievedCohorts( body.cohorts ) );
	});
};

export const getCohortsInjector = ( dispatch ) => {
	return ({ namespaceID, userToken }) => {
		getCohorts( dispatch, { namespaceID, userToken });
	};
};

export const addUserToCohort = ( dispatch, cohortID, userToken, namespace, callback ) => {
	request.get( server+'/add_to_cohort', {
		headers: {
			'Authorization': 'JWT ' + userToken
		},
		qs: {
			cohortID
		}
	}, function onAdded( error, response, body ) {
		if ( error ) {
			addErrorNotification( dispatch, {
				message: error.message,
				level: 'error'
			});
			return callback();
		}
		body = JSON.parse( body );
		addNotification( dispatch, {
			message: body.message,
			level: 'success'
		});
		dispatch( addEnrolledNamespace( namespace ) );
		const namespaceName = namespace.title;
		getLessons( dispatch, namespaceName );
		return callback();
	});
};

export const addUserToCohortInjector = ( dispatch ) => {
	return ( cohortID, userToken, namespace, callback ) => {
		addUserToCohort( dispatch, cohortID, userToken, namespace, callback );
	};
};

export const deleteCohort = ( dispatch, _id, token, clbk ) => {
	request.get( server+'/delete_cohort', {
		qs: {
			_id
		},
		headers: {
			'Authorization': 'JWT ' + token
		}
	}, ( err, res ) => {
		if ( err || res.statusCode !== 200 ) {
			let msg = res.body;
			return addErrorNotification( dispatch, msg );
		}
		addNotification( dispatch, {
			message: 'Cohort successfully deleted',
			level: 'success'
		});
		dispatch( retrievedEnrollableCohorts( null ) );
		clbk();
	});
};

export const deleteCohortInjector = ( dispatch ) => {
	return ( _id, token, clbk ) => {
		deleteCohort( dispatch, _id, token, clbk );
	};
};

export const createCohort = ( dispatch, user, cohortInstance, clbk ) => {
	request.post( server+'/create_cohort', {
		form: cohortInstance,
		headers: {
			'Authorization': 'JWT ' + user.token
		}
	}, ( err, res ) => {
		if ( !err && res.statusCode === 200 ) {
			addNotification( dispatch, {
				message: 'Cohort successfully created',
				level: 'success'
			});
			dispatch( retrievedEnrollableCohorts(null) );
			return clbk();
		}
		const message = err ? err.msg : res.body;
		addErrorNotification( dispatch, message );
	});
};

export const createCohortInjector = ( dispatch ) => {
	return ( user, cohortInstance, clbk ) => {
		createCohort( dispatch, user, cohortInstance, clbk );
	};
};

export const updateCohort = ( dispatch, cohort, userToken, clbk ) => {
	request.post( server+'/update_cohort', {
		form: {
			cohort
		},
		headers: {
			'Authorization': 'JWT ' + userToken
		}
	}, ( err, res ) => {
		if ( err ) {
			return clbk( err );
		}
		addNotification( dispatch, {
			message: 'Cohort successfully updated',
			level: 'success'
		});
		dispatch( retrievedEnrollableCohorts( null ) );
		clbk( null, res );
	});
};

export const updateCohortInjector = ( dispatch ) => {
	return ( cohort, userToken, clbk ) => {
		updateCohort( dispatch, cohort, userToken, clbk );
	};
};
