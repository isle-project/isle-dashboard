// MODULES //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { HashRouter, Route } from 'react-router-dom';
import request from 'request';
import ForgotPassword from './../components/forgot_password.js';
import VisibleLogin from './visible_login.js';
import Signup from './../components/signup.js';
import NewPassword from './../components/new_password.js';
import HeaderBar from './header_bar.js';
import VisibleCreateNamespace from './visible_create_namespace.js';
import VisibleEditNamespace from './visible_edit_namespace.js';
import VisibleLessonsPage from './visible_lessons_page.js';
import VisibleProfilePage from './visible_profile_page.js';
import Lesson from './../components/lesson.js';
import NotificationSystem from './../components/notification.js';
import server from './../constants/server';
import * as actions from './../actions';
import './app.css';


// MAIN //

class App extends Component {

	componentDidMount() {
		if ( !this.props.isLoggedIn ) {
			hashHistory.replace( '/login' );
		} else {
			this.props.getNamespaces( this.props.user.token );
		}
	}

	componentDidUpdate( prevProps ) {
		const isLoggingOut = prevProps.isLoggedIn && !this.props.isLoggedIn;
		const isLoggingIn = !prevProps.isLoggedIn && this.props.isLoggedIn;

		if ( isLoggingIn ) {
			hashHistory.push( '/lessons' );
			this.props.getNamespaces( this.props.user.token );
		}
		if ( isLoggingOut ) {
			hashHistory.push( '/login' );
		}
	}

	render() {
		let AuthenticationBarrier = null;
		if ( this.props.isLoggedIn ) {
			AuthenticationBarrier =
				<div>
					<HeaderBar />
					<Route
						path="/create-namespace"
						component={VisibleCreateNamespace}
					/>
					<Route
						path="/edit-namespace"
						component={VisibleEditNamespace}
					/>
					<Route
						path="/profile"
						component={VisibleProfilePage}
					/>
					<Route
						path="/lessons"
						component={VisibleLessonsPage}
					/>
					<Route
						path="/lessons/:lessonId"
						component={Lesson}
					/>
				</div>;
		}

		return (
			<HashRouter>
				<div className="App">
					{AuthenticationBarrier}
					<Route exact path="/" component={VisibleLogin } />
					<Route path="/login" component={VisibleLogin}/>
					<Route path="/new-password" component={NewPassword}/>
					<Route path="/signup" component={Signup}/>
					<Route path="/forgot-password" component={ForgotPassword}/>
					<NotificationSystem />
				</div>
			</HashRouter>
		);
	}
}


// EXPORTS //

export default connect( mapStateToProps, mapDispatchToProps )( App );

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
