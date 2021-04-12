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

export function deletedLesson( lessonName ) {
	return {
		type: DELETED_LESSON,
		payload: {
			lessonName
		}
	};
}

export function updatedLesson( lessonName, props ) {
	return {
		type: UPDATED_LESSON,
		payload: {
			lessonName,
			props
		}
	};
}

export function retrievedLessons({ lessons, namespaceName }) {
	return {
		type: RETRIEVED_LESSONS,
		payload: {
			lessons,
			namespaceName
		}
	};
}

export function retrievedAllLessons( lessons ) {
	return {
		type: GET_ALL_LESSONS,
		payload: {
			lessons
		}
	};
}

export function retrievedTemplateLessons( templateLessons ) {
	return {
		type: GET_TEMPLATE_LESSONS,
		payload: {
			templateLessons
		}
	};
}

export function retrievedRooms( rooms ) {
	return {
		type: GET_ROOMS,
		payload: {
			rooms
		}
	};
}

export function retrievedPublicLessons( lessons ) {
	return {
		type: RETRIEVED_PUBLIC_LESSONS,
		payload: {
			lessons
		}
	};
}

export const getPublicLessons = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_public_lessons' );
		dispatch( retrievedPublicLessons( res.data.lessons ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const getPublicLessonsInjector = ( dispatch ) => {
	return async () => {
		await getPublicLessons( dispatch );
	};
};

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

export const getIsleFileInjector = ( dispatch ) => {
	return async ({ lessonName, namespaceName }) => {
		const file = await getIsleFile( dispatch, { lessonName, namespaceName });
		return file;
	};
};

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

export const getLessonsInjector = ( dispatch ) => {
	return async ( namespaceName ) => {
		await getLessons( dispatch, namespaceName );
	};
};

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
		}
	}
};

export const copyLessonInjector = ( dispatch ) => {
	return async ({ sourceName, target, targetName, source }) => {
		await copyLesson( dispatch, { sourceName, target, targetName, source } );
	};
};

export const deleteLesson = async ( dispatch, { lessonName, namespaceName }) => {
	if ( !namespaceName || !lessonName ) {
		return;
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
	}
};

export const deleteLessonInjector = ( dispatch ) => {
	return async ({ lessonName, namespaceName }) => {
		await deleteLesson( dispatch, { lessonName, namespaceName } );
	};
};

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

export const showLessonInGalleryInjector = ( dispatch ) => {
	return async ({ lessonName, namespaceName }) => {
		await showLessonInGallery( dispatch, { lessonName, namespaceName });
	};
};

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

export const hideLessonInGalleryInjector = ( dispatch ) => {
	return async ({ lessonName, namespaceName }) => {
		await hideLessonInGallery( dispatch, { lessonName, namespaceName });
	};
};

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

export const activateLessonInjector = ( dispatch ) => {
	return async ({ lessonName, namespaceName }) => {
		await activateLesson( dispatch, { lessonName, namespaceName });
	};
};

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

export const deactivateLessonInjector = ( dispatch ) => {
	return async ({ lessonName, namespaceName }) => {
		await deactivateLesson( dispatch, { lessonName, namespaceName });
	};
};

export const updateLesson = async ( dispatch, { lessonName, namespaceName, newTitle, newDescription, lockUntil, template }) => {
	if ( namespaceName && lessonName ) {
		try {
			const query = {
				namespaceName,
				lessonName,
				newTitle,
				newDescription,
				lockUntil
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

export const updateLessonInjector = ( dispatch ) => {
	return async ({ lessonName, namespaceName, newTitle, newDescription, lockUntil, template }) => {
		const bool = await updateLesson( dispatch, { lessonName, namespaceName, newTitle, newDescription, lockUntil, template });
		return bool;
	};
};

export const getAllLessons = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_all_lessons' );
		dispatch( retrievedAllLessons( res.data.lessons ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const getAllLessonsInjector = ( dispatch ) => {
	return async () => {
		await getAllLessons( dispatch );
	};
};

export const getTemplateLessons = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_template_lessons' );
		dispatch( retrievedTemplateLessons( res.data.lessons ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const getTemplateLessonsInjector = ( dispatch ) => {
	return async () => {
		await getTemplateLessons( dispatch );
	};
};


export const getRooms = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_open_rooms' );
		dispatch( retrievedRooms( res.data.rooms ) );
	} catch ( err ) {
		addErrorNotification( dispatch, err );
	}
};

export const getRoomsInjector = ( dispatch ) => {
	return async () => {
		await getRooms( dispatch );
	};
};
