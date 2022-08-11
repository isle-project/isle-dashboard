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
import server from 'constants/server';
import { addNotification, addErrorNotification } from 'actions/notification';
import { COMPUTED_COMPLETIONS, CREATED_METRIC, DELETED_METRIC,
	GET_COMPLETION_LESSON_REFS, GET_COMPLETION_COMPONENTS, GET_COMPLETION_TAGS,
	SAVED_LESSON_METRICS, UPDATED_METRIC, RETRIEVED_COMPLETION_RULES } from 'constants/action_types.js';


// VARIABLES //

const DEFAULT_TAGS = [
	'_default_tag'
];


// MAIN //

/**
 * Makes a GET request to the server to retrieve all completion tags.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Array<ObjectId>} lessonIDs - ids for lessons whose tags are
 *     to be retrieved.
 * @returns {void}
 */
export const getCompletionTags = async ( dispatch, lessonIDs ) => {
	try {
		const res = await axios.post( `${server}/completion_tags`, {
			lessons: lessonIDs
		});
		dispatch({
			type: GET_COMPLETION_TAGS,
			payload: {
				completionTags: res.data
			}
		});
	} catch ( err ) {
		dispatch({
			type: GET_COMPLETION_TAGS,
			payload: {
				completionTags: DEFAULT_TAGS
			}
		});
	}
};

/**
* Returns a function to retrieve all completion tags for a set of lessons.
*
* @param {Function} dispatch - dispatch function
* @returns {Function} function to retrieve completion tags
*/
export const getCompletionTagsInjector = dispatch => {
	return async ( lessonIDs ) => {
		await getCompletionTags( dispatch, lessonIDs );
	};
};

export const getCompletionComponents = async ( dispatch, lessonIds ) => {
	try {
		const res = await axios.post( `${server}/completion_components`, {
			lessons: lessonIds
		});
		dispatch({
			type: GET_COMPLETION_COMPONENTS,
			payload: {
				componentsByLesson: res.data
			}
		});
	} catch ( err ) {
		console.error( 'Error getting completion components: ', err );
		const componentsByLesson = {};
		lessonIds.forEach( lessonID => {
			componentsByLesson[ lessonID ] = [];
		});
		dispatch({
			type: GET_COMPLETION_COMPONENTS,
			payload: {
				componentsByLesson
			}
		});
	}
};

/**
 * Retrieves the names of lower level metrics (refs)
 *
 * @param {Function} dispatch - dispatch function
 * @param {Array<ObjectId>} entities - id of entities whose refs (metrics at next lowest level)
 *     we are retrieving. In the typical case, these will be lesson ids.
 * @param {string} target - name of the target field in the Completions table that we
 *     constrain to be in `entities`.  In the typical case, this will be 'lesson'.
 *     We then search for refs (component metric names) for which lesson id belongs to
 *     the given list of entities.
 * @returns {void}
 */
export const getCompletionLessonRefs = async ( dispatch, { entities, target } ) => {
	try {
		const res = await axios.post( `${server}/completion_refs`, {
			entities,
			target
		});
		dispatch({
			type: GET_COMPLETION_LESSON_REFS,
			payload: {
				completionRefs: res.data
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to retrieve the names of lower level metrics (refs).
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to retrieve completion refs
 */
export const getCompletionLessonRefsInjector = dispatch => {
	return async ({ entities, target }) => {
		await getCompletionLessonRefs( dispatch, { entities, target });
	};
};

/**
 * Makes a POST request to the server to compute completion values for a particular metric, entity, and a set of users.
 *
 * @param {Function} dispatch - dispatch function
 */
export const computeCompletions = async ( dispatch, { metric, ids, users, policyOptions } ) => {
	try {
		const res = await axios.post( `${server}/compute_completions`, {
			metric,
			ids,
			users,
			policyOptions
		});
		dispatch({
			type: COMPUTED_COMPLETIONS,
			payload: res.data
		});
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
	}
	catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to compute completion values for a particular metric, entity, and a set of users.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to compute completion values
 */
export const computeCompletionsInjector = dispatch => {
	return async ({ metric, ids, users, policyOptions }) => {
		const res = await computeCompletions( dispatch, { metric, ids, users, policyOptions });
		return res;
	};
};

/**
 * Makes a POST request to the server to create a new completion metric.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} name - the metric name
 * @param {string} level - the level of the hierarchy for which we are computing completions,
 *     one of: 'program', 'namespace', 'lesson', 'component'.
 * @param {ObjectId} id - the id of the entity at the given level for which we are computing
 *     the completions.
 * @param {Array} rule - a vector of the form ['rule-name', ...params], specifying
 *     the aggregation rule used by the completion
 * @param {Array} coverage - an array of the form ['all'], ['include', ...ids], or
 *     ['exclude', ...ids], where ids are the ObjectId's for the  entities at the next
 *     sublevel (e.g., lessons when level is 'namespace').
 * @param {string} ref - the name of the metric to use at the next lower level for computing
 *     the completions that are used at this level.
 * @param {Object<string,number>} tagWeights - a map from completion tag names to weights
 * @param {boolean} autoCompute - whether to automatically compute the completions for this metric
 * @param {boolean} visibleToStudent - whether to make the score visible to the student with whom it is associated
 * @returns {void}
 */
 export const createMetric = async ( dispatch, { name, rule, coverage, level, id, ref, tagWeights, autoCompute, visibleToStudent }) => {
	try {
		const res = await axios.post( `${server}/create_metric`, {
			name, rule, coverage, level, id, ref, tagWeights, autoCompute, visibleToStudent
		});
		console.log( res.data );
		dispatch({
			type: CREATED_METRIC,
			payload: {
				metric: res.data.metric,
				level,
				id
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to the server to create a new completion metric.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a POST request to the server to create a new completion metric
 */
export const createMetricInjector = dispatch => {
	return async ( metric ) => {
		await createMetric( dispatch, metric );
	};
};

/**
 * Makes a POST request to the server to update a completion metric.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} body.name - the metric name
 * @param {string} body.level - the level of the hierarchy for which we are computing completions,
 *     one of: 'program', 'namespace', 'lesson', 'component'.
 * @param {ObjectId} body.id - the id of the entity at the given level for which we are computing
 *     the completions.
 * @param {Array} body.rule - a vector of the form ['rule-name', ...params], specifying
 *     the aggregation rule used by the completion
 * @param {Array} body.coverage - an array of the form ['all'], ['include', ...ids], or
 *     ['exclude', ...ids], where ids are the ObjectId's for the  entities at the next
 *     sublevel (e.g., lessons when level is 'namespace').
 * @param {string} body.ref - the name of the metric to use at the next lower level for computing
 *     the completions that are used at this level.
 * @param {Object<string,number>} body.tagWeights - a map from completion tag names to weights
 * @returns {void}
 */
export const updateMetric = async ( dispatch, body ) => {
	try {
		const res = await axios.post( `${server}/update_metric`, body );
		console.log( res.data );
		dispatch({
			type: UPDATED_METRIC,
			payload: {
				metric: body,
				level: body.level,
				id: body.id
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to the server to update a completion metric.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a POST request to the server to update a completion metric
 */
export const updateMetricInjector = dispatch => {
	return async ( metric ) => {
		await updateMetric( dispatch, metric );
	};
};

/**
 * Makes a POST request to the server to delete a completion metric.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} body - request body
 * @param {string} body.name - the metric name
 * @param {string} body.level - the level of the hierarchy for which we are computing completions,
 *     one of: 'program', 'namespace', 'lesson', 'component'.
 * @param {ObjectId} body.id - the id of the entity at the given level for which we are computing
 *     the completions.
 * @returns {void}
 */
export const deleteMetric = async ( dispatch, { name, level, id }) => {
	try {
		await axios.post( `${server}/delete_metric`, {
			name, level, id
		});
		dispatch({
			type: DELETED_METRIC,
			payload: {
				name, level, id
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to the server to delete a completion metric.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} a function to make a POST request to the server to delete a completion metric
 */
export const deleteMetricInjector = dispatch => {
	return async ({ name, level, id }) => {
		const res = await deleteMetric( dispatch, { name, level, id });
		return res;
	};
};

export const saveLessonMetrics = async ( dispatch, body ) => {
	try {
		const res = await axios.post( `${server}/save_lesson_metrics`, body );
		console.log( 'SAVE LESSON METRICS', res.data );
		dispatch({
			type: SAVED_LESSON_METRICS,
			payload: {
				...res.data,
				metricName: body.name
			}
		});
		return res;
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const saveLessonMetricsInjector = dispatch => {
	return async ( body ) => {
		const res = await saveLessonMetrics( dispatch, body );
		return res;
	};
};

export const getCompletionRules = async ( dispatch ) => {
	try {
		const res = await axios.get( `${server}/completion_rules` );
		dispatch({
			type: RETRIEVED_COMPLETION_RULES,
			payload: {
				completionRules: res.data
			}
		});
		return res;
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const getCompletionRulesInjector = dispatch => {
	return async () => {
		const res = await getCompletionRules( dispatch );
		return res;
	};
};
