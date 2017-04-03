// MODULES //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import request from 'request';
import HeaderBar from './header_bar.js';
import server from './../constants/server';
import * as actions from './../actions';


// MAIN //

class AuthenticationBarrier extends Component {
	componentDidMount() {
		if ( !this.props.isLoggedIn ) {
			hashHistory.replace( '/login' );
		} else {
			this.props.getNamespaces( this.props.user.token );
		}
	}

	render() {
		if ( this.props.isLoggedIn ) {
			return (
				<div>
					<HeaderBar />
					{this.props.children}
				</div>
			);
		}
		return null;
	}
}


// EXPORTS //

export default connect( mapStateToProps, mapDispatchToProps )( AuthenticationBarrier );

function mapStateToProps( state ) {
	return {
		isLoggedIn: state.user.loggedIn,
		user: state.user,
		namespace: state.namespace
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		getNamespaces: ( token ) => {
			request.get( server+'/get_namespaces', {
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, function( error, response, body ) {
				if ( error ) {
					return error;
				}
				body = JSON.parse( body );
				dispatch( actions.retrievedNamespaces( body.namespaces ) );
			});
		}
	};
}

