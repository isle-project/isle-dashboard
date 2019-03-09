// MODULES //

import hasOwnProp from '@stdlib/assert/has-own-property';
import * as types from 'constants/action_types.js';


// FUNCTIONS //

function titleCompare( a, b ) {
	return ( '' + a.title ).localeCompare( b.title );
}


// VARIABLES //

const initialState = {
	_id: null,
	title: '',
	description: '',
	owners: '',
	announcements: [],
	lessons: [],
	cohorts: [],
	files: [],
	userStatus: null
};


// EXPORTS //

export default function namespace( state = initialState, action ) {
	let lessons;

	switch ( action.type ) {
	case types.CHANGED_NAMESPACE:
		return Object.assign({}, state, {
			_id: action.payload._id,
			title: action.payload.title,
			description: action.payload.description,
			announcements: action.payload.announcements,
			owners: action.payload.owners,
			userStatus: action.payload.userStatus
		});
	case types.DELETED_CURRENT_NAMESPACE:
		return initialState;
	case types.RETRIEVED_LESSONS:
		if ( action.payload.namespaceName === state.title ) {
			return Object.assign({}, state, {
				lessons: action.payload.lessons
			});
		}
		return state;
	case types.RETRIEVED_COHORTS:
		return Object.assign({}, state, {
			cohorts: action.payload.cohorts.sort( titleCompare )
		});
	case types.DELETED_LESSON:
		lessons = state.lessons.slice();
		lessons = lessons.filter( x => x.title !== action.payload.lessonName );
		return Object.assign({}, state, {
			lessons
		});
	/* eslint-disable no-case-declarations */
	case types.UPDATED_LESSON:
		lessons = state.lessons.slice();
		const { props, lessonName } = action.payload;
		for ( let i = 0; i < lessons.length; i++ ) {
			if ( lessons[ i ].title === lessonName ) {
				for ( let key in props ) {
					if ( hasOwnProp( props, key ) ) {
						lessons[ i ][ key ] = props[ key ];
					}
				}
				break;
			}
		}
		return Object.assign({}, state, {
			lessons
		});
	case types.RECEIVED_NAMESPACE_FILES:
		lessons = state.lessons;
		let files = action.payload.files;
		files = files.map( file => {
			file.updatedAt = new Date( file.updatedAt );
			for ( let i = 0; i < lessons.length; i++ ) {
				if ( lessons[ i ]._id === file.lesson ) {
					file.lesson = lessons[ i ];
					break;
				}
			}
			return file;
		});
		return Object.assign({}, state, {
			files
		});

	case types.EDITED_ANNOUNCEMENT: {
		const announcements = state.announcements.slice();
		for (let i = 0; i < announcements.length; i++) {
			if (announcements[i].createdAt === action.payload.announcement.createdAt) {
				announcements[i] = action.payload.announcement;
			}
		}
		return Object.assign({}, state, {
			announcements: announcements
		});
	}
	case types.CREATED_ANNOUNCEMENT: {
		const announcements = state.announcements.slice();
		announcements.unshift(action.payload.announcement);
		return Object.assign({}, state, {
			announcements: announcements
		});
	}

	case types.DELETED_ANNOUNCEMENT:
		const announcements = state.announcements.slice();
		announcements.splice(action.payload.index, 1);

		return Object.assign({}, state, {
			announcements: announcements
		});
	case types.LOGGED_OUT:
		return initialState;
	default:
		return state;
	}
}
