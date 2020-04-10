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

export const getPublicLessons = ( dispatch ) => {
	request.get( server+'/get_public_lessons', function onResponse( error, response, body ) {
		if ( error ) {
			return error;
		}
		body = JSON.parse( body );
		let lessons = body.lessons;
		dispatch( retrievedPublicLessons( lessons ) );
	});
};

export const getPublicLessonsInjector = ( dispatch ) => {
	return () => {
		getPublicLessons( dispatch );
	};
};

export const getIsleFile = ( dispatch, { lessonName, namespaceName, token, callback }) => {
	request.get( server+'/get_isle_file', {
		qs: {
			lessonName,
			namespaceName
		},
		headers: {
			'Authorization': 'JWT ' + token
		}
	}, function onResponse( error, response, body ) {
		if ( error ) {
			return callback( error );
		}
		return callback( null, body );
	});
};

export const getIsleFileInjector = ( dispatch ) => {
	return ({ lessonName, namespaceName, token, callback }) => {
		getIsleFile( dispatch, { lessonName, namespaceName, token, callback });
	};
};

export const getLessons = ( dispatch, namespaceName ) => {
	if ( namespaceName ) {
		request.get( server+'/get_lessons', {
			qs: {
				namespaceName
			}
		}, function onLessons( error, response, body ) {
			if ( error ) {
				return error;
			}
			body = JSON.parse( body );
			let lessons = body.lessons;
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
		});
	}
};

export const getLessonsInjector = ( dispatch ) => {
	return ( namespaceName ) => {
		getLessons( dispatch, namespaceName );
	};
};

export const copyLesson = ( dispatch, { sourceName, target, targetName, source, token }) => {
	if ( sourceName && target && source ) {
		request.get( server+'/copy_lesson', {
			qs: {
				target,
				source,
				sourceName,
				targetName
			},
			headers: {
				'Authorization': 'JWT ' + token
			}
		}, function onResponse( err, res ) {
			if ( err ) {
				return addErrorNotification( dispatch, err.message );
			}
			let msg = JSON.parse( res.body ).message;
			if ( res.statusCode >= 400 ) {
				return addErrorNotification( dispatch, msg );
			}
			addNotification( dispatch, {
				message: msg,
				level: 'success'
			});
		});
	}
};

export const copyLessonInjector = ( dispatch ) => {
	return ({ sourceName, target, targetName, source, token }) => {
		copyLesson( dispatch, { sourceName, target, targetName, source, token } );
	};
};

export const deleteLesson = ( dispatch, { lessonName, namespaceName, token }) => {
	if ( namespaceName && lessonName ) {
		request.get( server+'/delete_lesson', {
			qs: {
				namespaceName,
				lessonName
			},
			headers: {
				'Authorization': 'JWT ' + token
			}
		}, function onDelete( err, res ) {
			if ( err ) {
				return addErrorNotification( dispatch, err.message );
			}
			let msg = JSON.parse( res.body ).message;
			if ( res.statusCode >= 400 ) {
				return addErrorNotification( dispatch, err.message );
			}
			dispatch( deletedLesson( lessonName ) );
			addNotification( dispatch, {
				message: msg,
				level: 'success'
			});
		});
	}
};

export const deleteLessonInjector = ( dispatch ) => {
	return ({ lessonName, namespaceName, token }) => {
		deleteLesson( dispatch, { lessonName, namespaceName, token } );
	};
};

export const showLessonInGallery = ( dispatch, { lessonName, namespaceName, token }) => {
	request.get( server+'/show_lesson', {
		qs: {
			namespaceName,
			lessonName
		},
		headers: {
			'Authorization': 'JWT ' + token
		}
	}, function onShow( err, res ) {
		if ( err ) {
			return addErrorNotification( dispatch, err.message );
		}
		addNotification( dispatch, {
			message: JSON.parse( res.body ).message,
			level: 'success'
		});
		dispatch( updatedLesson( lessonName, { public: true }) );
	});
};

export const showLessonInGalleryInjector = ( dispatch ) => {
	return ({ lessonName, namespaceName, token }) => {
		showLessonInGallery( dispatch, { lessonName, namespaceName, token });
	};
};

export const hideLessonInGallery = ( dispatch, { lessonName, namespaceName, token }) => {
	request.get( server+'/hide_lesson', {
		qs: {
			namespaceName,
			lessonName
		},
		headers: {
			'Authorization': 'JWT ' + token
		}
	}, function onHide( err, res ) {
		if ( err ) {
			return addErrorNotification( dispatch, err.message );
		}
		addNotification( dispatch, {
			message: JSON.parse( res.body ).message,
			level: 'success'
		});
		dispatch( updatedLesson( lessonName, { public: false }) );
	});
};

export const hideLessonInGalleryInjector = ( dispatch ) => {
	return ({ lessonName, namespaceName, token }) => {
		hideLessonInGallery( dispatch, { lessonName, namespaceName, token });
	};
};

export const activateLesson = ( dispatch, { lessonName, namespaceName, token }) => {
	request.get( server+'/activate_lesson', {
		qs: {
			namespaceName,
			lessonName
		},
		headers: {
			'Authorization': 'JWT ' + token
		}
	}, function onActivate( err, res ) {
		if ( err ) {
			return addErrorNotification( dispatch, err.message );
		}
		addNotification( dispatch, {
			message: JSON.parse( res.body ).message,
			level: 'success'
		});
		dispatch( updatedLesson( lessonName, { active: true }) );
	});
};

export const activateLessonInjector = ( dispatch ) => {
	return ({ lessonName, namespaceName, token }) => {
		activateLesson( dispatch, { lessonName, namespaceName, token });
	};
};

export const deactivateLesson = ( dispatch, { lessonName, namespaceName, token }) => {
	request.get( server+'/deactivate_lesson', {
		qs: {
			namespaceName,
			lessonName
		},
		headers: {
			'Authorization': 'JWT ' + token
		}
	}, function onDeactivate( err, res ) {
		if ( err ) {
			return addErrorNotification( dispatch, err.message );
		}
		addNotification( dispatch, {
			message: JSON.parse( res.body ).message,
			level: 'success'
		});
		dispatch( updatedLesson( lessonName, { active: false }) );
	});
};

export const deactivateLessonInjector = ( dispatch ) => {
	return ({ lessonName, namespaceName, token }) => {
		deactivateLesson( dispatch, { lessonName, namespaceName, token });
	};
};

export const updateLesson = ( dispatch, { lessonName, namespaceName, newTitle, newDescription, token }, clbk ) => {
	if ( namespaceName && lessonName ) {
		request.get( server+'/update_lesson', {
			qs: {
				namespaceName,
				lessonName,
				newTitle,
				newDescription
			},
			headers: {
				'Authorization': 'JWT ' + token
			}
		}, function onUpdate( err, res ) {
			if ( err ) {
				return addErrorNotification( dispatch, err.message );
			}
			const msg = JSON.parse( res.body ).message;
			if ( res.statusCode >= 400 ) {
				return addErrorNotification( dispatch, msg );
			}
			dispatch( deletedLesson( lessonName ) );
			addNotification( dispatch, {
				message: msg,
				level: 'success'
			});
			clbk();
		});
	}
};

export const updateLessonInjector = ( dispatch ) => {
	return ({ lessonName, namespaceName, newTitle, newDescription, token }) => {
		updateLesson( dispatch, { lessonName, namespaceName, newTitle, newDescription, token });
	};
};
