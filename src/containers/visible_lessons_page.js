// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import LessonsPage from './../components/lessons_page.js';


// EXPORTS //

const VisibleLessonsPage = connect( mapStateToProps, mapDispatchToProps )( LessonsPage );

function mapStateToProps( state ) {
	return {
		user: state.user
	};
}

function  mapDispatchToProps() {
	return {};
}

export default VisibleLessonsPage;
