// MODULES //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import request from 'request';
import LessonsPage from './../components/lessons_page.js';
import * as actions from './../actions';


// EXPORTS //

const VisibleLessonsPage = connect( mapStateToProps, mapDispatchToProps )( LessonsPage );

function mapStateToProps( state ) {
	return {
		user: state.user
	};
}

function  mapDispatchToProps( dispatch ) {
	return {};
}

export default VisibleLessonsPage;
