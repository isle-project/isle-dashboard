// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import server from 'constants/server';
import Signup from 'components/signup';


// EXPORTS //

const VisibleSignup = connect( mapStateToProps, mapDispatchToProps )( Signup );

function mapStateToProps( state ) {
	return {
		user: state.user
	};
}

function mapDispatchToProps() {
	return {
		createUser: ( form, clbk ) => {
			request.post( server+'/create_user', {
				form
			}, clbk );
		}
	};
}

export default VisibleSignup;
