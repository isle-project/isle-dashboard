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
import server from 'constants/server';
import { isPrimitive as isBoolean } from '@stdlib/assert/is-boolean';
import { addNotification, addErrorNotification } from 'actions/notification';
import { DELETED_LESSON, GET_ALL_LESSONS, GET_TEMPLATE_LESSONS, GET_ROOMS, UPDATED_LESSON, RETRIEVED_LESSONS, RETRIEVED_PUBLIC_LESSONS } from 'constants/action_types.js';


// EXPORTS //

/**
 * Returns an action signifying a lesson has been deleted.
 *
 * @param {string} lessonName - name of the lesson
 * @returns {Object} action
 */
export function deletedLesson( lessonName ) {
	return {
		type: DELETED_LESSON,
		payload: {
			lessonName
		}
	};
}

/**
 * Returns an action indicating that a lesson has been updated.
 *
 * @param {string} lessonName - name of the lesson
 * @param {Object} props - properties of the lesson
 * @returns {Object} action
 */
export function updatedLesson( lessonName, props ) {
	return {
		type: UPDATED_LESSON,
		payload: {
			lessonName,
			props
		}
	};
}

/**
 * Returns an action indicating that lessons have been retrieved.
 *
 * @param {Array} lessons - lessons
 * @param {string} namespaceName - namespace name
 * @returns {Object} action
 */
export function retrievedLessons({ lessons, namespaceName }) {
	return {
		type: RETRIEVED_LESSONS,
		payload: {
			lessons,
			namespaceName
		}
	};
}

/**
 * Returns an action indicating that all lessons have been retrieved for an admin user.
 *
 * @param {Array} lessons - lessons
 * @returns {Object} action
 */
export function retrievedAllLessons( lessons ) {
	return {
		type: GET_ALL_LESSONS,
		payload: {
			lessons
		}
	};
}

/**
 * Returns an action indicating that all lessons that may serve as templates have been retrieved.
 *
 * @param {Array} templateLessons - lessons that may serve as templates
 * @returns {Object} action
 */
export function retrievedTemplateLessons( templateLessons ) {
	return {
		type: GET_TEMPLATE_LESSONS,
		payload: {
			templateLessons
		}
	};
}

/**
 * Returns an action indicating that all chat rooms have been retrieved.
 *
 * @param {Array} rooms - chat rooms
 * @returns {Object} action
 */
export function retrievedRooms( rooms ) {
	return {
		type: GET_ROOMS,
		payload: {
			rooms
		}
	};
}

/**
 * Returns an action indicating that all public lessons have been retrieved.
 *
 * @param {Array} lessons - lessons
 * @returns {Object} action
 */
export function retrievedPublicLessons( lessons ) {
	return {
		type: RETRIEVED_PUBLIC_LESSONS,
		payload: {
			lessons
		}
	};
}

/**
 * Makes a POST request to retrieve all public lessons.
 *
 * @param {Function} dispatch - dispatch function
 */
export const getPublicLessons = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_public_lessons' );
		dispatch( retrievedPublicLessons( res.data.lessons ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to retrieve all public lessons.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to retrieve all public lessons
 */
export const getPublicLessonsInjector = ( dispatch ) => {
	return async () => {
		await getPublicLessons( dispatch );
	};
};

/**
 * Makes a GET request to retrieve the ISLE file for a lesson.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.lessonName - name of the lesson
 * @param {string} options.namespaceName - namespace name
 * @returns {(Object|null)} file data or null if the file does not exist
 */
export const getIsleFile = async ( dispatch, { lessonName, namespaceName }) => {
	try {
		const res = await axios.get( server+'/get_isle_file?'+qs.stringify({
			lessonName,
			namespaceName
		}) );
		return res.data;
	} catch ( err ) {
		addErrorNotification( dispatch, err );
		return null;
	}
};

/**
 * Returns a function to make a GET request to retrieve the ISLE file for a lesson.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a GET request to retrieve the ISLE file for a lesson
 */
export const getIsleFileInjector = ( dispatch ) => {
	return async ({ lessonName, namespaceName }) => {
		const file = await getIsleFile( dispatch, { lessonName, namespaceName });
		return file;
	};
};

/**
 * Makes a GET request to retrieve all lessons for a given namespace.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} namespaceName - namespace name
 */
export const getLessons = async ( dispatch, namespaceName ) => {
	if ( namespaceName ) {
		try {
			const res = await axios.get( server+'/get_lessons?'+qs.stringify({
				namespaceName
			}) );
			let lessons = res.data.lessons;
			lessons = lessons.map(( lesson, index ) => {
				lesson.colorIndex = index % 20;
				lesson.url = server+'/'+namespaceName+'/'+lesson.title;
				if ( lesson.lockUntil ) {
					lesson.lockUntil = new Date( lesson.lockUntil.time );
				}
				if ( !lesson.createdAt ) {
					lesson.createdAt = new Date( 0 ).toLocaleString();
				}
				if ( !lesson.updatedAt ) {
					lesson.updatedAt = lesson.createdAt;
				}
				return lesson;
			});
			dispatch( retrievedLessons({ lessons, namespaceName }) );
		} catch ( err ) {
			addErrorNotification( dispatch, err );
		}
	}
};

/**
 * Returns a function to make a GET request to retrieve all lessons for a given namespace.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a GET request to retrieve all lessons for a given namespace
 */
export const getLessonsInjector = ( dispatch ) => {
	return async ( namespaceName ) => {
		await getLessons( dispatch, namespaceName );
	};
};

/**
 * Makes a POST request to copy a lesson from a source namespace to a target namespace.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.sourceName - source lesson name
 * @param {string} options.targetName - target lesson name
 * @param {string} options.source - source namespace name
 * @param {string} options.target - target namespace name
 * @returns {(Object|Error)} response data or an error if encountered
 */
export const copyLesson = async ( dispatch, { sourceName, target, targetName, source }) => {
	if ( sourceName && target && source ) {
		try {
			const res = await axios.post( server+'/copy_lesson', {
				target,
				source,
				sourceName,
				targetName
			});
			addNotification( dispatch, {
				message: res.data.message,
				level: 'success'
			});
			return res;
		} catch ( err ) {
			addErrorNotification( dispatch, err );
			return err;
		}
	}
};

/**
 * Returns a function to make a POST request to copy a lesson from a source namespace to a target namespace.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to copy a lesson from a source namespace to a target namespace
 */
export const copyLessonInjector = ( dispatch ) => {
	return async ({ sourceName, target, targetName, source }) => {
		await copyLesson( dispatch, { sourceName, target, targetName, source } );
	};
};

/**
 * Makes a POST request to copy all lessons from a source namespace to a target namespace.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.source - source namespace name
 * @param {string} options.target - target namespace name
 * @returns {(Object|Error)} response data or an error if encountered
 */
export const copyNamespaceLessons = async ( dispatch, { target, source }) => {
	try {
		const res = await axios.post( server+'/copy_namespace_lessons', {
			target,
			source
		});
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
		return res;
	} catch ( err ) {
		addErrorNotification( dispatch, err );
		return err;
	}
};

/**
 * Returns a function to make a POST request to copy all lessons from a source namespace to a target namespace.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to copy all lessons from a source namespace to a target namespace
 */
export const copyNamespaceLessonsInjector = ( dispatch ) => {
	return async ({ target, source }) => {
		const res = await copyNamespaceLessons( dispatch, { target, source } );
		return res;
	};
};

/**
 * Makes a POST request to delete a lesson.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.lessonName - lesson name
 * @param {string} options.namespaceName - namespace name
 * @returns {(Object|Error)} response data or an error if encountered
 */
export const deleteLesson = async ( dispatch, { lessonName, namespaceName }) => {
	if ( !namespaceName || !lessonName ) {
		const err = new Error( 'Missing `namespaceName` or `lessonName`.' );
		addErrorNotification( dispatch, err );
		return err;
	}
	try {
		const res = await axios.post( server+'/delete_lesson', {
			namespaceName,
			lessonName
		});
		dispatch( deletedLesson( lessonName ) );
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
		return res;
	} catch ( err ) {
		addErrorNotification( dispatch, err );
		return err;
	}
};

/**
 * Returns a function to make a POST request to delete a lesson.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to delete a lesson
 */
export const deleteLessonInjector = ( dispatch ) => {
	return async ({ lessonName, namespaceName }) => {
		await deleteLesson( dispatch, { lessonName, namespaceName } );
	};
};

/**
 * Makes a POST request to show a lesson in the gallery of the dashboard.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.lessonName - lesson name
 * @param {string} options.namespaceName - namespace name
 */
export const showLessonInGallery = async ( dispatch, { lessonName, namespaceName }) => {
	try {
		const res = await axios.post( server+'/show_lesson', {
			namespaceName,
			lessonName
		});
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
		dispatch( updatedLesson( lessonName, { public: true }) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to show a lesson in the gallery of the dashboard.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to show a lesson in the gallery of the dashboard
 */
export const showLessonInGalleryInjector = ( dispatch ) => {
	return async ({ lessonName, namespaceName }) => {
		await showLessonInGallery( dispatch, { lessonName, namespaceName });
	};
};


/**
 * Makes a POST request to hide a lesson in the gallery of the dashboard.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.lessonName - lesson name
 * @param {string} options.namespaceName - namespace name
 */
export const hideLessonInGallery = async ( dispatch, { lessonName, namespaceName }) => {
	try {
		const res = await axios.post( server+'/hide_lesson', {
			namespaceName,
			lessonName
		});
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
		dispatch( updatedLesson( lessonName, { public: false }) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to hide a lesson in the gallery of the dashboard.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to hide a lesson in the gallery of the dashboard
 */
export const hideLessonInGalleryInjector = ( dispatch ) => {
	return async ({ lessonName, namespaceName }) => {
		await hideLessonInGallery( dispatch, { lessonName, namespaceName });
	};
};

/**
 * Makes a POST request to make a lesson available to users, i.e. set it to being active.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.lessonName - lesson name
 * @param {string} options.namespaceName - namespace name
 */
export const activateLesson = async ( dispatch, { lessonName, namespaceName }) => {
	try {
		const res = await axios.post( server+'/activate_lesson?', {
			namespaceName,
			lessonName
		});
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
		dispatch( updatedLesson( lessonName, { active: true }) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to make a lesson available to users, i.e. set it to being active.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to make a lesson available to users, i.e. set it to being active
 */
export const activateLessonInjector = ( dispatch ) => {
	return async ({ lessonName, namespaceName }) => {
		await activateLesson( dispatch, { lessonName, namespaceName });
	};
};

/**
 * Makes a POST request to make a lesson hidden from users, i.e. set it to being inactive.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.lessonName - lesson name
 * @param {string} options.namespaceName - namespace name
 */
export const deactivateLesson = async ( dispatch, { lessonName, namespaceName }) => {
	try {
		const res = await axios.post( server+'/deactivate_lesson', {
			namespaceName,
			lessonName
		});
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
		dispatch( updatedLesson( lessonName, { active: false }) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to make a lesson hidden from users, i.e. set it to being inactive.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to make a lesson hidden from users, i.e. set it to being inactive
 */
export const deactivateLessonInjector = ( dispatch ) => {
	return async ({ lessonName, namespaceName }) => {
		await deactivateLesson( dispatch, { lessonName, namespaceName });
	};
};

/**
 * Makes a POST request to update a lesson.
 *
 * @param {Function} dispatch - dispatch function
 * @param {Object} options - request options
 * @param {string} options.lessonName - lesson name
 * @param {string} options.namespaceName - namespace name
 * @param {string} options.newTitle - new title
 * @param {string} options.newDescription - new description
 * @param {string} options.lockAfter - date on which the lesson should be made unavailable to users
 * @param {string} options.lockUntil - date on which the lesson should be made available to users
 * @param {boolean} options.template - controls whether the lesson shall be a template or not
 * @param {boolean} options.hideFromDashboard - controls whether the lesson shall be hidden from the dashboard (but may still be active and accessible)
 * @returns {boolean} true if the lesson was updated, false otherwise
 */
export const updateLesson = async ( dispatch, { lessonName, namespaceName, newTitle, newDescription, lockAfter, lockUntil, template, hideFromDashboard }) => {
	if ( namespaceName && lessonName ) {
		try {
			const query = {
				namespaceName,
				lessonName,
				newTitle,
				newDescription,
				lockAfter,
				lockUntil,
				hideFromDashboard
			};
			if ( isBoolean( template ) ) {
				query.template = template;
			}
			const res = await axios.post( server+'/update_lesson', query );
			dispatch( deletedLesson( lessonName ) );
			addNotification( dispatch, {
				message: res.data.message,
				level: 'success'
			});
			getLessons( dispatch, namespaceName );
			return true;
		} catch ( err ) {
			addErrorNotification( dispatch, err );
			return false;
		}
	}
	return false;
};

/**
 * Returns a function to make a POST request to update a lesson.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a POST request to update a lesson
 */
export const updateLessonInjector = ( dispatch ) => {
	return async ({ lessonName, namespaceName, newTitle, newDescription, lockAfter, lockUntil, hideFromDashboard, template }) => {
		const bool = await updateLesson( dispatch, { lessonName, namespaceName, newTitle, newDescription, lockAfter, lockUntil, hideFromDashboard, template });
		return bool;
	};
};

/**
 * Makes a GET request to retrieve all lessons for an admin user.
 *
 * @param {Function} dispatch - dispatch function
 */
export const getAllLessons = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_all_lessons' );
		dispatch( retrievedAllLessons( res.data.lessons ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a GET request to retrieve all lessons for an admin user.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a GET request to retrieve all lessons for an admin user
 */
export const getAllLessonsInjector = ( dispatch ) => {
	return async () => {
		await getAllLessons( dispatch );
	};
};

/**
 * Makes a GET request to retrieve all template lessons.
 *
 * @param {Function} dispatch - dispatch function
 */
export const getTemplateLessons = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_template_lessons' );
		dispatch( retrievedTemplateLessons( res.data.lessons ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a GET request to retrieve all template lessons.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a GET request to retrieve all template lessons
 */
export const getTemplateLessonsInjector = ( dispatch ) => {
	return async () => {
		await getTemplateLessons( dispatch );
	};
};


/**
 * Makes a GET request to retrieve all chat rooms
 *
 * @param {Function} dispatch - dispatch function
 */
export const getRooms = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_open_rooms' );
		dispatch( retrievedRooms( res.data.rooms ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a GET request to retrieve all chat rooms
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make a GET request to retrieve all chat rooms
 */
export const getRoomsInjector = ( dispatch ) => {
	return async () => {
		await getRooms( dispatch );
	};
};
