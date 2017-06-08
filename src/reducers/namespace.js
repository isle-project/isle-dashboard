// MODULES //

import * as types from './../constants/action_types.js';


// VARIABLES //

const initialState = {
	id: null,
	title: '',
	description: '',
	owners: '',
	lessons: null,
	cohorts: []
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
			owners: action.payload.owners
		});
	case types.DELETED_CURRENT_NAMESPACE:
		return initialState;
	case types.RETRIEVED_LESSONS:
		return Object.assign({}, state, {
			lessons: action.payload.lessons
		});
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
	case types.UPDATED_LESSON:
		lessons = state.lessons.slice();
		const { props, lessonName } = action.payload;
		for ( let i = 0; i < lessons.length; i++ ) {
			if ( lessons[ i ].title === lessonName ) {
				for ( let key in props ) {
					lessons[ i ][ key ] = props[ key ];
				}
				break;
			}
		}
		return Object.assign({}, state, {
			lessons
		});
	default:
		return state;
	}
}
