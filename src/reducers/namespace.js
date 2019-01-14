// MODULES //

import hasOwnProp from '@stdlib/assert/has-own-property';
import * as types from 'constants/action_types.js';


// VARIABLES //

const initialState = {
	_id: null,
	title: '',
	description: '',
	owners: '',
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
			cohorts: action.payload.cohorts
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
	case types.LOGGED_OUT:
		return initialState;
	default:
		return state;
	}
}
