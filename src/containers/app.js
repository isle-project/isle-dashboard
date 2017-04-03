// MODULES //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import NotificationSystem from './../components/notification.js';
import './app.css';


// MAIN //

class App extends Component {

	componentDidUpdate( prevProps ) {
		const isLoggingOut = prevProps.isLoggedIn && !this.props.isLoggedIn;
		const isLoggingIn = !prevProps.isLoggedIn && this.props.isLoggedIn;

		if ( isLoggingIn ) {
			hashHistory.push( '/lessons' );
		}
		if ( isLoggingOut ) {
			hashHistory.push( '/login' );
		}
	}

	render() {
		return (
			<div className="App">
				{this.props.children}
				<NotificationSystem />
			</div>
		);
	}
}


// EXPORTS //

export default connect( mapStateToProps )( App );

function mapStateToProps( state ) {
	return {
		isLoggedIn: state.user.loggedIn,
	};
}
