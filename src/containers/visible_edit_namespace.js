// MODULES //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import EditNamespace from './../components/edit_namespace.js';
import { updatedNamespace, deletedNamespace } from './../actions';


// EXPORTS //

const VisibleEditNamespace = connect( mapStateToProps, mapDispatchToProps )( EditNamespace );

function mapStateToProps( state ) {
	return {
		user: state.user,
		namespace: state.namespace
	};
} // end FUNCTION mapStateToProps()

function  mapDispatchToProps( dispatch ) {
	return {

	};
} // end FUNCTION mapStateToProps()

export default VisibleEditNamespace;
