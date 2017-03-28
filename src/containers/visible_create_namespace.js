// MODULES //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import CreateNamespace from './../components/create_namespace.js';
import { changedNamespace } from './../actions';


// EXPORTS //

const VisibleCreateNamespace = connect( mapStateToProps, mapDispatchToProps )( CreateNamespace );

function mapStateToProps( state ) {
	return {
		user: state.user
	};
} // end FUNCTION mapStateToProps()

function  mapDispatchToProps( dispatch ) {
	return {
		onNamespace: ({ title, description, owners }) => {
			dispatch( changedNamespace({ title, description, owners }) );
		}
	};
} // end FUNCTION mapStateToProps()

export default VisibleCreateNamespace;
