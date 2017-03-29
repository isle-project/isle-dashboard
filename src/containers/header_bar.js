// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import HeaderBar from './../components/header_bar.js';
import * as actions from './../actions';


// EXPORTS //

export default connect( mapStateToProps, mapDispatchToProps )( HeaderBar );

function mapStateToProps( state ) {
	return {
		user: state.user,
		namespace: state.namespace
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		logout: () => {
			dispatch( actions.loggedOut() );
		},
		onNamespace: ({ title, description, owners, _id }) => {
			dispatch( actions.changedNamespace({ title, description, owners, _id }) );
		}
	};
}
