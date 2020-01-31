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
			lessonData: user.lessonData,
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

export function editedAnnouncement( announcement, namespaceName ) {
	return {
		type: types.EDITED_ANNOUNCEMENT,
		payload: {
			announcement,
			namespaceName
		}
	};
}

export function createdAnnouncement( announcement, namespaceName ) {
	return {
		type: types.CREATED_ANNOUNCEMENT,
		payload: {
			announcement,
			namespaceName
		}
	};
}

export function deletedAnnouncement( index, namespaceName ) {
	return {
		type: types.DELETED_ANNOUNCEMENT,
		payload: {
			index,
			namespaceName
		}
	};
}

export function changedNamespace({ title, owners, announcements = [], cohorts = [], description, _id }) {
	return {
		type: types.CHANGED_NAMESPACE,
		payload: {
			title,
			announcements,
			cohorts,
			description,
			owners,
			_id
		}
	};
}

export function updatedOwnedNamespace({ title, owners, description, _id }) {
	return {
		type: types.UPDATED_OWNED_NAMESPACE,
		payload: {
			title,
			description,
			owners,
			_id
		}
	};
}

export function addEnrolledNamespace({ title, owners, description, _id }) {
	return {
		type: types.ADD_ENROLLED_NAMESPACE,
		payload: {
			title,
			description,
			owners,
			_id
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

export function retrievedLessons({ lessons, namespaceName }) {
	return {
		type: types.RETRIEVED_LESSONS,
		payload: {
			lessons,
			namespaceName
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

export function receivedFiles( files ) {
	return {
		type: types.RECEIVED_FILES,
		payload: {
			files
		}
	};
}

export function receivedNamespaceFiles( files ) {
	return {
		type: types.RECEIVED_NAMESPACE_FILES,
		payload: {
			files
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

export function addNotification( notification ) {
	return {
		type: types.ADD_NOTIFICATION,
		payload: notification
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

export function receivedUserBadges( badges ) {
	return {
		type: types.USER_RECEIVED_BADGES,
		payload: {
			badges
		}
	};
}

export function retrievedBadges( badges ) {
	return {
		type: types.RETRIEVED_BADGES,
		payload: {
			badges
		}
	};
}

export function retrievedEnrollableCohorts( cohorts ) {
	return {
		type: types.RETRIEVED_ENROLLABLE_COHORTS,
		payload: {
			cohorts
		}
	};
}
