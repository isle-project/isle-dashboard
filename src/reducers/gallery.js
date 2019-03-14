// MODULES //

import * as types from 'constants/action_types.js';


// VARIABLES //

const initialState = {
	lessons: null
};


// EXPORTS //

export default function namespace( state = initialState, action ) {
	switch ( action.type ) {
	case types.RETRIEVED_PUBLIC_LESSONS: {
		return Object.assign({}, state, {
			lessons: action.payload.lessons
		});
	}
	default:
		return state;
	}
}
