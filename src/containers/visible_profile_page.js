// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import ProfilePage from './../components/profile_page.js';
import * as actions from './../actions';


// EXPORTS //

const VisibleProfilePage = connect( mapStateToProps, mapDispatchToProps )( ProfilePage );

function mapStateToProps( state ) {
	return {
		user: state.user
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		addNotification: ({ message, level }) => {
			dispatch( actions.addNotification({ message, level }) );
		},
		updateUser: ({ name, organization }) => {
			dispatch( actions.updateUser({ name, organization }) );
		}
	};
}

export default VisibleProfilePage;
