/**
* Copyright (C) 2016-present The ISLE Authors
*
* The isle-dashboard program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
const AsyncAdminPage = asyncComponent(() => import( 'containers/admin' ));
const AsyncLogin = asyncComponent(() => import( 'containers/visible-login' ));
const AsyncSignup = asyncComponent(() => import( 'containers/visible-signup' ));
const AsyncNamespaceData = asyncComponent(() => import( 'containers/visible-namespace-data' ));
const AsyncGallery = asyncComponent(() => import( 'containers/visible-gallery' ));
const AsyncLessonsPage = asyncComponent(() => import( 'containers/visible-lessons-page' ));
const AsyncProfilePage = asyncComponent(() => import( 'containers/visible-profile-page' ));
const AsyncEnrollPage = asyncComponent(() => import( 'containers/visible-enroll-page' ));
const USER_STORAGE_ID = 'ISLE_USER_'+server;


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
			let isle = localStorage.getItem( USER_STORAGE_ID );
			if ( isle ) {
				isle = JSON.parse( isle );
				this.props.handleLogin( isle );
			} else {
				history.replace( '/login' );
			}
		}
		if ( this.props.isLoggedIn ) {
			const isle = localStorage.getItem( USER_STORAGE_ID );
			if ( !isle ) {
				localStorage.setItem( USER_STORAGE_ID, JSON.stringify({
					token: this.props.user.token,
					id: this.props.user.id
				}) );
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
							'/edit-namespace',
							'/namespace-data',
							'/profile',
							'/lessons/:namespace',
							'/lessons',
							'/gallery',
							'/enroll',
							'/admin'
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
					<Route
						path="/admin"
						component={AsyncAdminPage}
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
