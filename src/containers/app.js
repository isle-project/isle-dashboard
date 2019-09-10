// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from 'request';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import contains from '@stdlib/assert/contains';
import asyncComponent from 'components/async';
import server from 'constants/server';
import NotificationSystem from './notification.js';
import * as actions from 'actions';
import './app.css';


// VARIABLES //

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
		const history = this.props.history;
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
		const history = this.props.history;
		const isLoggingOut = prevProps.isLoggedIn && !this.props.isLoggedIn;
		const isLoggingIn = !prevProps.isLoggedIn && this.props.isLoggedIn;
		const pathname = history.location.pathname;
		if ( isLoggingIn ) {
			if ( pathname && pathname !== '/' && pathname !== '/login' ) {
				history.push( history.location.pathname );
			} else {
				const path = this.props.user.writeAccess ? '/lessons' : '/profile';
				history.push( path );
			}
		}
		else if ( isLoggingOut ) {
			history.push( '/login' );
		}
		else if (
			this.props.isLoggedIn && pathname &&
			( pathname === '/' || pathname === '/login' )
		) {
			const path = this.props.user.writeAccess ? '/lessons' : '/profile';
			history.push( path );
		}
	}

	render() {
		let AuthenticationBarrier = null;
		if ( this.props.isLoggedIn ) {
			AuthenticationBarrier =
				<Fragment>
					<Route
						path={[
							'/create-namespace',
							'/edit-namespace/:namespace',
							'/namespace-data',
							'/profile',
							'/lessons',
							'/lessons/:namespace',
							'/gallery',
							'/enroll'
						]}
						component={AsyncHeaderBar}
						history={this.props.history}
					/>
					<Route
						path="/create-namespace"
						component={AsyncCreateNamespace}
					/>
					<Route
						path="/edit-namespace/:namespace"
						component={AsyncEditNamespace}
					/>
					<Route
						path="/namespace-data" exact
						component={AsyncNamespaceData}
					/>
					<Route
						path="/namespace-data/:subpage"
						component={AsyncNamespaceData}
					/>
					<Route
						path="/profile"
						component={AsyncProfilePage}
					/>
					<Route
						path="/lessons" exact
						component={AsyncLessonsPage}
					/>
					<Route
						path="/lessons/:namespace"
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
			<ConnectedRouter history={this.props.history}>
				<div className="App">
					{AuthenticationBarrier}
					<Route exact path="/" component={AsyncLogin} />
					<Route path="/login" component={AsyncLogin} />
					<Route path="/new-password" component={AsyncNewPassword} />
					<Route path="/signup" component={AsyncSignup} />
					<Route path="/forgot-password" component={AsyncForgotPassword} />
					<NotificationSystem />
				</div>
			</ConnectedRouter>
		);
	}
}


// PROPERTIES //

App.propTypes = {
	handleLogin: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
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
