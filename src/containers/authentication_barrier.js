// MODULES //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import HeaderBar from './../components/header_bar.js';
import * as actions from './../actions';


// MAIN //

class AuthenticationBarrier extends Component {
	componentDidMount() {
		if ( !this.props.isLoggedIn ) {
			browserHistory.replace( '/login' );
		}
	}

	render() {
		if ( this.props.isLoggedIn ) {
			return (
				<div>
					<HeaderBar
						username={this.props.username}
						onDashboardClick={this.showLessons}
						onProfileClick={this.showProfile}
						onLogout={this.props.logout}
						currentNamespace={this.props.namespace}
					/>
					{this.props.children}
				</div>
			);
		}
		return null;
	}
}


// EXPORTS //

export default connect( mapStateToProps, mapDispatchToProps )( AuthenticationBarrier );

function mapStateToProps( state, ownProps ) {
	return {
		isLoggedIn: state.user.loggedIn,
		username: state.user.name,
		namespace: state.namespace
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		logout: () => {
			browserHistory.replace( '/login' );
			dispatch( actions.loggedOut() );
		}
	};
}

