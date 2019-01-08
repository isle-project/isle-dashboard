// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import EnrollPage from 'components/enroll-page';


// EXPORTS //

const VisibleEnrollPage = connect( mapStateToProps, mapDispatchToProps )( EnrollPage );

function mapStateToProps( state ) {
	return {
		cohorts: state.cohorts,
		user: state.user
	};
}

function mapDispatchToProps() {
	return {

	};
}


export default VisibleEnrollPage;
