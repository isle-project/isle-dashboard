// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from 'request';
import createHashHistory from 'history/createHashHistory';
import { Router, Route } from 'react-router-dom';
import contains from '@stdlib/assert/contains';
import asyncComponent from 'components/async';
import server from 'constants/server';
import NotificationSystem from './notification.js';
import * as actions from 'actions';
import './app.css';


// VARIABLES //

const history = createHashHistory();
const AsyncHeaderBar = asyncComponent(() => import( 'containers/visible-header-bar' ));
const AsyncForgotPassword = asyncComponent(() => import( 'containers/visible-forgot-password' ));
const AsyncCreateNamespace = asyncComponent(() => import( 'containers/visible-create-namespace' ));
const AsyncEditNamespace = asyncComponent(() => import( 'containers/visible-edit-namespace' ));
const AsyncNewPassword = asyncComponent(() => import( 'components/new-password' ));
const AsyncLogin = asyncComponent(() => import( 'containers/visible-login' ));
const AsyncSignup = asyncComponent(() => import( 'containers/visible-signup' ));
const AsyncNamespaceData = asyncComponent(() => import( 'containers/visible-namespace-data' ));
const AsyncGallery = asyncComponent(() => import( 'containers/visible-gallery' ));
const AsyncLessonsPage = asyncComponent(() => import( 'containers/visible-lessons-page' ));
const AsyncProfilePage = asyncComponent(() => import( 'containers/visible-profile-page' ));
const AsyncEnrollPage = asyncComponent(() => import( 'containers/visible-enroll-page' ));


// MAIN //

class App extends Component {
	componentDidMount() {
		if (
			!this.props.isLoggedIn &&
			!contains( history.location.pathname, 'courses' ) &&
			!contains( history.location.pathname, 'new-password' ) &&
			!contains( history.location.pathname, 'signup' )
		) {
			let isle = localStorage.getItem( 'ISLE_USER_'+server );
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
					<Route
						path="/"
						component={AsyncHeaderBar}
						history={history}
					/>
					<Route
						path="/create-namespace"
						component={AsyncCreateNamespace}
					/>
					<Route
						path="/edit-namespace"
						component={AsyncEditNamespace}
					/>
					<Route
						path="/namespace-data"
						component={AsyncNamespaceData}
					/>
					<Route
						path="/profile"
						component={AsyncProfilePage}
					/>
					<Route
						path="/lessons"
						component={AsyncLessonsPage}
					/>
					<Route
						path="/gallery"
						component={AsyncGallery}
					/>
					<Route
						path="/enroll"
						component={AsyncEnrollPage}
					/>
				</Fragment>;
		}
		return (
			<Router history={history}>
				<div className="App">
					{AuthenticationBarrier}
					<Route exact path="/" component={AsyncLogin} />
					<Route path="/login" component={AsyncLogin} />
					<Route path="/new-password" component={AsyncNewPassword} />
					<Route path="/signup" component={AsyncSignup} />
					<Route path="/forgot-password" component={AsyncForgotPassword} />
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
