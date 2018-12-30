// MODULES //

import * as types from 'constants/action_types.js';


// EXPORTS //

export function loggedIn( user ) {
	return {
		type: types.LOGGED_IN,
		payload: {
			email: user.email,
			name: user.name,
			enrolledNamespaces: user.enrolledNamespaces,
			ownedNamespaces: user.ownedNamespaces,
			organization: user.organization,
			token: user.token,
			writeAccess: user.writeAccess,
			id: user.id,
			picture: user.picture,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			score: user.score,
			spentTime: user.spentTime
		}
	};
}

export function authenticated() {
	return {
		type: types.AUTHENTICATED
	};
}

export function loggedOut() {
	return {
		type: types.LOGGED_OUT
	};
}

export function searchPhraseSet( phrase ) {
	return {
		type: types.SEARCH_PHRASE_SET,
		payload: {
			phrase
		}
	};
}

export function setLessonOrder( type ) {
	return {
		type: types.LESSON_ORDER,
		payload: {
			type
		}
	};
}

export function setLessonOrderDirection( direction ) {
	return {
		type: types.LESSON_ORDER_DIRECTION,
		payload: {
			direction
		}
	};
}

export function changedNamespace({ title, owners, description, _id, userStatus }) {
	return {
		type: types.CHANGED_NAMESPACE,
		payload: {
			title,
			description,
			owners,
			_id,
			userStatus
		}
	};
}

export function appendCreatedNamespace( namespace ) {
	return {
		type: types.APPEND_CREATED_NAMESPACE,
		payload: {
			namespace
		}
	};
}

export function retrievedCohorts( cohorts ) {
	return {
		type: types.RETRIEVED_COHORTS,
		payload: {
			cohorts
		}
	};
}

export function retrievedLessons( lessons ) {
	return {
		type: types.RETRIEVED_LESSONS,
		payload: {
			lessons
		}
	};
}

export function retrievedPublicLessons( lessons ) {
	return {
		type: types.RETRIEVED_PUBLIC_LESSONS,
		payload: {
			lessons
		}
	};
}

export function deletedLesson( lessonName ) {
	return {
		type: types.DELETED_LESSON,
		payload: {
			lessonName
		}
	};
}

export function updatedLesson( lessonName, props ) {
	return {
		type: types.UPDATED_LESSON,
		payload: {
			lessonName,
			props
		}
	};
}

export function deletedCurrentNamespace( id ) {
	return {
		type: types.DELETED_CURRENT_NAMESPACE,
		payload: {
			id
		}
	};
}

export function addNotification({ message, level }) {
	return {
		type: types.ADD_NOTIFICATION,
		payload: {
			message,
			level
		}
	};
}

export function updateUser({ name, organization }) {
	return {
		type: types.USER_UPDATED,
		payload: {
			name,
			organization
		}
	};
}

export function updateUserPicture( picture ) {
	return {
		type: types.USER_PICTURE_MODIFIED,
		payload: {
			picture
		}
	};
}
