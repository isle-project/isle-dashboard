// MODULES //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProfilePage from './../components/profile_page.js';
import { loggedIn } from './../actions';


// EXPORTS //

const VisibleProfilePage = connect( mapStateToProps, mapDispatchToProps )( ProfilePage );

function mapStateToProps( state ) {
	console.log( state );
	return {
		user: state.user
	};
} // end FUNCTION mapStateToProps()

function  mapDispatchToProps( dispatch ) {
	return {
		onTodoClick: ( id ) => {
			dispatch( loggedIn( id ) );
		}
	};
} // end FUNCTION mapStateToProps()

export default VisibleProfilePage;
