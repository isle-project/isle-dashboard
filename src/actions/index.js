// MODULES //

import * as types from './../constants/action_types.js';


// EXPORTS //

export function loggedIn({ email, name, token, id, organization }) {
	return {
		type: types.LOGGED_IN,
		payload: {
			email,
			name,
			organization,
			token,
			id
		}
	};
}

export function loggedOut() {
	return {
		type: types.LOGGED_OUT
	};
}

export function changedNamespace({ title, owners, description, _id }) {
	return {
		type: types.CHANGED_NAMESPACE,
		payload: {
			title,
			description,
			owners,
			_id
		}
	};
}

export function retrievedNamespaces( namespaces ) {
	return {
		type: types.RETRIEVED_NAMESPACES,
		payload: {
			namespaces
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

export function deletedLesson( lessonName ) {
	return {
		type: types.DELETED_LESSON,
		payload: {
			lessonName
		}
	};
}

export function deletedCurrentNamespace() {
	return {
		type: types.DELETED_CURRENT_NAMESPACE
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
