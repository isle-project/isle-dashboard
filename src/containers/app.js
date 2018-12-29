// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from 'request';
import createHashHistory from 'history/createHashHistory';
import { Router, Route } from 'react-router-dom';
import contains from '@stdlib/assert/contains';
import NewPassword from 'components/new-password';
import CoursePage from 'components/course-page';
import server from 'constants/server';
import NotificationSystem from './notification.js';
import VisibleHeaderBar from './visible_header_bar.js';
import VisibleForgotPassword from './visible_forgot_password.js';
import VisibleCreateNamespace from './visible_create_namespace.js';
import VisibleEditNamespace from './visible_edit_namespace.js';
import VisibleLogin from './visible_login.js';
import VisibleSignup from './visible_signup.js';
import VisibleNamespaceData from './visible_namespace_data.js';
import VisibleGallery from './visible_gallery.js';
import VisibleLessonsPage from './visible_lessons_page.js';
import VisibleProfilePage from './visible_profile_page.js';
import * as actions from 'actions';
import './app.css';


// VARIABLES //

const history = createHashHistory();

const VisibleCoursePage = ({ match }) => {
	return <CoursePage namespace={match.params.namespace} />;
};

VisibleCoursePage.propTypes = {
	match: PropTypes.object.isRequired
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
			let isle = localStorage.getItem( 'isle-dashboard' );
			if ( isle ) {
				isle = JSON.parse( isle );
				this.props.handleLogin( isle );
			} else {
				history.replace( '/login' );
			}
		}
	}

	componentDidUpdate( prevProps ) {
		const isLoggingOut = prevProps.isLoggedIn && !this.props.isLoggedIn;
		const isLoggingIn = !prevProps.isLoggedIn && this.props.isLoggedIn;
		if ( isLoggingIn ) {
			const pathname = history.location.pathname;
			if ( pathname && pathname !== '/' && pathname !== '/login' ) {
				history.push( history.location.pathname );
			} else {
				const path = this.props.user.writeAccess ? '/lessons' : '/profile';
				history.push( path );
			}
		}
		if ( isLoggingOut ) {
			history.push( '/login' );
		}
	}

	render() {
		let AuthenticationBarrier = null;
		if ( this.props.isLoggedIn ) {
			AuthenticationBarrier =
				<Fragment>
					<VisibleHeaderBar history={history} />
					<Route
						path="/create-namespace"
						component={VisibleCreateNamespace}
					/>
					<Route
						path="/edit-namespace"
						component={VisibleEditNamespace}
					/>
					<Route
						path="/namespace-data"
						component={VisibleNamespaceData}
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
				</Fragment>;
		}
		return (
			<Router history={history}>
				<div className="App">
					{AuthenticationBarrier}
					<Route exact path="/" component={VisibleLogin} />
					<Route path="/login" component={VisibleLogin} />
					<Route path="/new-password" component={NewPassword} />
					<Route path="/signup" component={VisibleSignup} />
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


// PROPERTIES //

App.propTypes = {
	handleLogin: PropTypes.func.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired
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
		handleLogin: ( obj ) => {
			request.post( server+'/credentials_dashboard', {
				headers: {
					'Authorization': 'JWT ' + obj.token
				},
				form: {
					id: obj.id
				}
			}, function onLogin( error, response, body ) {
				if ( error ) {
					return error;
				}
				body = JSON.parse( body );
				if ( body.picture ) {
					body.picture = server + '/avatar/' + body.picture;
				}
				let user = {
					...obj,
					...body
				};
				dispatch( actions.loggedIn( user ) );
			});
		}
	};
}
