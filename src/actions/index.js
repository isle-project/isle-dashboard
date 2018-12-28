// MODULES //

import * as types from './../constants/action_types.js';


// EXPORTS //

export function loggedIn({ email, name, enrolledNamespaces, ownedNamespaces, token, id, organization, writeAccess }) {
	return {
		type: types.LOGGED_IN,
		payload: {
			email,
			name,
			enrolledNamespaces,
			ownedNamespaces,
			organization,
			token,
			writeAccess,
			id
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
