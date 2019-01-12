// MODULES //

import * as types from 'constants/action_types.js';


// VARIABLES //

const initialState = {
	message: '',
	level: '',
	position: 'tl',
	children: null,
	time: null,
	autoDismiss: 5
};


// EXPORTS //

export default function namespace( state = initialState, action ) {
	switch ( action.type ) {
	case types.ADD_NOTIFICATION:
		return Object.assign({}, initialState, {
			...action.payload,
			time: new Date()
		});
	default:
		return state;
	}
}
