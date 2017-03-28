// MODULES //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import './app.css';


// MAIN //

class App extends Component {

	componentDidUpdate( prevProps ) {
		const isLoggingOut = prevProps.isLoggedIn && !this.props.isLoggedIn;
		const isLoggingIn = !prevProps.isLoggedIn && this.props.isLoggedIn;

		if ( isLoggingIn ) {
			browserHistory.push( '/lessons' );
		}
	}

	render() {
		return (
			<div className="App">
				{this.props.children}
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
