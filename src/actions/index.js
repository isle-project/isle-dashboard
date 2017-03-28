// MODULES //

import * as types from './../constants/action_types.js';


// EXPORTS //

export function loggedIn({ email, name, token, id }) {
	return {
		type: types.LOGGED_IN,
		payload: {
			email,
			name,
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

export function changedNamespace({ title, owners, description }) {
	return {
		type: types.CHANGED_NAMESPACE,
		payload: {
			title,
			description,
			owners
		}
	};
}
