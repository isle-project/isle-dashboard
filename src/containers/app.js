// MODULES //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import createHashHistory from 'history/createHashHistory';
import { Router, Route } from 'react-router-dom';
import request from 'request';
import contains from '@stdlib/assert/contains';
import VisibleLogin from './visible_login.js';
import Signup from './../components/signup.js';
import NewPassword from './../components/new_password.js';
import HeaderBar from './header_bar.js';
import VisibleEnterToken from './visible_enter_token.js';
import VisibleForgotPassword from './visible_forgot_password.js';
import VisibleCreateNamespace from './visible_create_namespace.js';
import VisibleEditNamespace from './visible_edit_namespace.js';
import VisibleGallery from './visible_gallery.js';
import VisibleLessonsPage from './visible_lessons_page.js';
import VisibleProfilePage from './visible_profile_page.js';
import CoursePage from './../components/course_page.js';
import Lesson from './../components/lesson.js';
import NotificationSystem from './../components/notification.js';
import server from './../constants/server';
import * as actions from './../actions';
import './app.css';


// VARIABLES //

const history = createHashHistory();

const VisibleCoursePage = ({ match }) => {
	return <CoursePage namespace={match.params.namespace} />;
};


// MAIN //

class App extends Component {
	componentDidMount() {
		if (
			!this.props.isLoggedIn &&
			!contains( history.location.pathname, 'courses' ) &&
			!contains( history.location.pathname, 'new-password' ) &&
			!contains( history.location.pathname, 'signup' )
		) {
			history.replace( '/login' );
		} else if ( this.props.user.token ) {
			this.props.getNamespaces( this.props.user.token );
		}
	}

	componentDidUpdate( prevProps ) {
		const isLoggingOut = prevProps.isLoggedIn && !this.props.isLoggedIn;
		const isLoggingIn = !prevProps.isLoggedIn && this.props.isLoggedIn;

		if ( isLoggingIn ) {
			history.push( '/lessons' );
			this.props.getNamespaces( this.props.user.token );
		}
		if ( isLoggingOut ) {
			history.push( '/login' );
		}
	}

	render() {
		let AuthenticationBarrier = null;
		if ( this.props.isLoggedIn ) {
			AuthenticationBarrier =
				<div>
					<HeaderBar history={history} />
					<Route
						path="/create-namespace"
						component={this.props.user.writeAccess ? VisibleCreateNamespace : VisibleEnterToken}
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
						path="/gallery"
						component={VisibleGallery}
					/>
					<Route
						path="/lessons/:lessonId"
						component={Lesson}
					/>
				</div>;
		}

		return (
			<Router history={history}>
				<div className="App">
					{AuthenticationBarrier}
					<Route exact path="/" component={VisibleLogin} />
					<Route path="/login" component={VisibleLogin} />
					<Route path="/new-password" component={NewPassword} />
					<Route path="/signup" component={Signup} />
					<Route path="/forgot-password" component={VisibleForgotPassword} />
					<Route
						path="/courses/:namespace"
						component={VisibleCoursePage}
					/>
					<NotificationSystem />
				</div>
			</Router>
		);
	}
}

App.propTypes = {
	getNamespaces: PropTypes.func,
	isLoggedIn: PropTypes.bool,
	user: PropTypes.object.isRequired
};

App.defaultProps = {
};

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
			}, function onNamespaces( error, response, body ) {
				if ( error ) {
					return error;
				}
				body = JSON.parse( body );
				dispatch( actions.retrievedNamespaces( body.namespaces ) );
			});
		}
	};
}
