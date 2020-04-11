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
import { addNotification, addErrorNotification } from 'actions/notification';
import { DELETED_LESSON, UPDATED_LESSON, RETRIEVED_LESSONS, RETRIEVED_PUBLIC_LESSONS } from 'constants/action_types.js';


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
	return () => {
		getPublicLessons( dispatch );
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
	return ({ lessonName, namespaceName }) => {
		return getIsleFile( dispatch, { lessonName, namespaceName });
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
	return ( namespaceName ) => {
		getLessons( dispatch, namespaceName );
	};
};

export const copyLesson = async ( dispatch, { sourceName, target, targetName, source }) => {
	if ( sourceName && target && source ) {
		try {
			const res = await axios.get( server+'/copy_lesson?'+qs.stringify({
				target,
				source,
				sourceName,
				targetName
			}) );
			addNotification( dispatch, {
				message: res.data.message,
				level: 'success'
			});
		} catch ( err ) {
			addErrorNotification( dispatch, err );
		}
	}
};

export const copyLessonInjector = ( dispatch ) => {
	return ({ sourceName, target, targetName, source }) => {
		copyLesson( dispatch, { sourceName, target, targetName, source } );
	};
};

export const deleteLesson = async ( dispatch, { lessonName, namespaceName }) => {
	if ( namespaceName && lessonName ) {
		try {
			const res = await axios.get( server+'/delete_lesson?'+qs.stringify({
				namespaceName,
				lessonName
			}) );
			dispatch( deletedLesson( lessonName ) );
			addNotification( dispatch, {
				message: res.data.message,
				level: 'success'
			});
		} catch ( err ) {
			addErrorNotification( dispatch, err );
		}
	}
};

export const deleteLessonInjector = ( dispatch ) => {
	return ({ lessonName, namespaceName }) => {
		deleteLesson( dispatch, { lessonName, namespaceName } );
	};
};

export const showLessonInGallery = async ( dispatch, { lessonName, namespaceName }) => {
	try {
		const res = await axios.get( server+'/show_lesson?'+qs.stringify({
			namespaceName,
			lessonName
		}) );
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
	return ({ lessonName, namespaceName }) => {
		showLessonInGallery( dispatch, { lessonName, namespaceName });
	};
};

export const hideLessonInGallery = async ( dispatch, { lessonName, namespaceName }) => {
	try {
		const res = await axios.get( server+'/hide_lesson?'+qs.stringify({
			namespaceName,
			lessonName
		}) );
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
	return ({ lessonName, namespaceName }) => {
		hideLessonInGallery( dispatch, { lessonName, namespaceName });
	};
};

export const activateLesson = async ( dispatch, { lessonName, namespaceName }) => {
	try {
		const res = await axios.get( server+'/activate_lesson?'+qs.stringify({
			namespaceName,
			lessonName
		}) );
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
	return ({ lessonName, namespaceName }) => {
		activateLesson( dispatch, { lessonName, namespaceName });
	};
};

export const deactivateLesson = async ( dispatch, { lessonName, namespaceName }) => {
	try {
		const res = await axios.get( server+'/deactivate_lesson?'+qs.stringify({
			namespaceName,
			lessonName
		}) );
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
	return ({ lessonName, namespaceName }) => {
		deactivateLesson( dispatch, { lessonName, namespaceName });
	};
};

export const updateLesson = async ( dispatch, { lessonName, namespaceName, newTitle, newDescription }) => {
	if ( namespaceName && lessonName ) {
		try {
			const res = await axios.get( server+'/update_lesson?'+qs.stringify({
				namespaceName,
				lessonName,
				newTitle,
				newDescription
			}) );
			dispatch( deletedLesson( lessonName ) );
			addNotification( dispatch, {
				message: res.data.message,
				level: 'success'
			});
			getLessons( dispatch, namespaceName );
		} catch ( err ) {
			addErrorNotification( dispatch, err );
		}
	}
};

export const updateLessonInjector = ( dispatch ) => {
	return ({ lessonName, namespaceName, newTitle, newDescription }) => {
		updateLesson( dispatch, { lessonName, namespaceName, newTitle, newDescription });
	};
};
