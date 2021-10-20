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
import logger from 'debug';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import capitalize from '@stdlib/string/capitalize';
import { ConnectedRouter } from 'connected-react-router';
import asyncComponent from 'components/async';
import server from 'constants/server';
import { fetchCredentialsInjector } from 'actions/authentication.js';
import { getEnrollableCohortsInjector } from 'actions/cohort.js';
import { getPublicSettingsInjector, getCustomTranslationsInjector } from 'actions/settings.js';
import NotificationSystem from './notification.js';
import './app.css';
import axios from 'axios';


// VARIABLES //

const AsyncFooterBar = asyncComponent(() => import( 'containers/visible-footer-bar' ));
const AsyncTerms = asyncComponent(() => import( 'containers/visible-terms' ));
const AsyncPrivacy = asyncComponent(() => import( 'containers/visible-privacy' ));
const AsyncHeaderBar = asyncComponent(() => import( 'containers/visible-header-bar' ));
const AsyncForgotPassword = asyncComponent(() => import( 'containers/visible-forgot-password' ));
const AsyncCreateNamespace = asyncComponent(() => import( 'containers/visible-create-namespace' ));
const AsyncEditNamespace = asyncComponent(() => import( 'containers/visible-edit-namespace' ));
const AsyncNewPassword = asyncComponent(() => import( 'containers/visible-new-password' ));
const AsyncCompleteRegistration = asyncComponent(() => import( 'containers/visible-complete-registration' ));
const AsyncConfirmEmail = asyncComponent(() => import( 'containers/visible-confirm-email' ));
const AsyncShibboleth = asyncComponent(() => import( 'containers/visible-shibboleth' ));
const AsyncAdminPage = asyncComponent(() => import( 'containers/visible-admin' ));
const AsyncAdminSettings = asyncComponent(() => import( 'containers/visible-admin-settings' ));
const AsyncLogin = asyncComponent(() => import( 'containers/visible-login' ));
const AsyncLoginTFA = asyncComponent(() => import( 'containers/visible-login-tfa' ));
const AsyncSignup = asyncComponent(() => import( 'containers/visible-signup' ));
const AsyncNamespaceData = asyncComponent(() => import( 'containers/visible-namespace-data' ));
const AsyncGallery = asyncComponent(() => import( 'containers/visible-gallery' ));
const AsyncLessonsPage = asyncComponent(() => import( 'containers/visible-lessons-page' ));
const AsyncProfilePage = asyncComponent(() => import( 'containers/visible-profile-page' ));
const AsyncEnrollPage = asyncComponent(() => import( 'containers/visible-enroll-page' ));
const USER_STORAGE_ID = 'ISLE_USER_'+server;


// VARIABLES //

const ALL_LOGGEDIN_PATHS = [
	'/create-namespace',
	'/edit-namespace/:namespace',
	'/edit-namespace',
	'/namespace-data/:namespace',
	'/profile',
	'/lessons/:namespace',
	'/lessons',
	'/gallery',
	'/enroll',
	'/admin',
	'/admin-settings'
];
const RE_PUBLIC_PAGES = /(?:courses|new-password|complete-registration|confirm-email|shibboleth|signup|login|login-tfa|terms|privacy)/;
const debug = logger( 'isle-dashboard' );


// FUNCTIONS //

function generateTitle( ) {
	console.log( window.location.hash );
	const title = capitalize( window.location.hash.replace( /^\//, '' ) );
	console.log( title );
	return `${title} | ISLE Dashboard`;
}


// MAIN //

class App extends Component {
	async componentDidMount() {
		const history = this.props.history;
		this.props.getCustomTranslations();
		this.props.getPublicSettings();
		if (
			!this.props.isLoggedIn &&
			!RE_PUBLIC_PAGES.test( history.location.pathname )
		) {
			let isle = localStorage.getItem( USER_STORAGE_ID );
			if ( isle ) {
				isle = JSON.parse( isle );
				const user = await this.props.fetchCredentials( isle );
				if ( user ) {
					this.props.getEnrollableCohorts( user );
				}
			} else {
				const res = await axios.get( server+'/saml/session' );
				const user = await this.props.fetchCredentials( res.data );
				if ( user ) {
					this.props.getEnrollableCohorts( user );
				}
			} else {
				history.replace( '/login' );
			}
		}
		if ( this.props.isLoggedIn ) {
			debug( 'User is logged in, check local storage...' );
			const isle = localStorage.getItem( USER_STORAGE_ID );
			if ( !isle ) {
				debug( 'User is logged in, but no local storage found -> write to local storage' );
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
			if ( pathname === '/login-tfa' ) {
				const path = this.props.user.writeAccess ? '/lessons' : '/profile';
				history.push( path );
			}
			else if ( pathname && pathname !== '/' && pathname !== '/login' && pathname !== '/shibboleth' ) {
				debug( 'User has logged in, redirecting to: '+pathname );
				history.push( history.location.pathname );
			} else {
				const path = this.props.user.writeAccess ? '/lessons' : '/profile';
				debug( 'User has logged in, redirecting to default page: '+pathname );
				history.push( path );
			}
		}
		else if ( isLoggingOut ) {
			history.push( '/login' );
		}
		else if (
			this.props.isLoggedIn && pathname &&
			( pathname === '/' || pathname === '/login' || pathname === '/login-tfa' || pathname === '/shibboleth' )
		) {
			const path = this.props.user.writeAccess ? '/lessons' : '/profile';
			history.push( path );
		}
	}

	render() {
		const { settings } = this.props;
		let AuthenticationBarrier = null;
		if ( this.props.isLoggedIn ) {
			AuthenticationBarrier =
				<Fragment>
					<Route
						path={ALL_LOGGEDIN_PATHS}
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
						path="/namespace-data/:namespace" exact
						component={AsyncNamespaceData}
					/>
					<Route
						path="/namespace-data/:namespace/:subpage"
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
						path="/admin" exact
						component={AsyncAdminPage}
					/>
					<Route
						path="/admin/:subpage"
						component={AsyncAdminPage}
					/>
					<Route
						path="/admin/settings" exact
						component={AsyncAdminSettings}
					/>
					<Route
						path="/admin/settings/:subpage"
						component={AsyncAdminSettings}
					/>
				</Fragment>;
		}
		return (
			<HelmetProvider>
				<ConnectedRouter history={this.props.history}>
					<div className="App">
						{AuthenticationBarrier}
						<Helmet>
							<title>{generateTitle()}</title>
						</Helmet>
						<Route
							path="/*"
							component={AsyncFooterBar}
							history={this.props.history}
						/>
						<Route exact path="/" component={AsyncLogin} />
						<Route path="/login" component={AsyncLogin} />
						<Route path="/login-tfa" component={AsyncLoginTFA} />
						<Route path="/new-password" component={AsyncNewPassword} />
						<Route path="/complete-registration" component={AsyncCompleteRegistration} />
						<Route path="/confirm-email" component={AsyncConfirmEmail} />
						<Route path="/shibboleth" component={AsyncShibboleth} />
						{settings.allowUserRegistrations ? <Route path="/signup" component={AsyncSignup} /> : null}
						<Route path="/forgot-password" component={AsyncForgotPassword} />
						<Route path="/terms" component={AsyncTerms} />
						<Route path="/privacy" component={AsyncPrivacy} />
						<NotificationSystem />
					</div>
				</ConnectedRouter>
			</HelmetProvider>
		);
	}
}


// PROPERTIES //

App.propTypes = {
	fetchCredentials: PropTypes.func.isRequired,
	getCustomTranslations: PropTypes.func.isRequired,
	getEnrollableCohorts: PropTypes.func.isRequired,
	getPublicSettings: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	settings: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default connect( mapStateToProps, mapDispatchToProps )( App );

function mapStateToProps( state ) {
	return {
		isLoggedIn: state.user.loggedIn,
		user: state.user,
		settings: state.settings
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		fetchCredentials: fetchCredentialsInjector( dispatch ),
		getCustomTranslations: getCustomTranslationsInjector( dispatch ),
		getPublicSettings: getPublicSettingsInjector( dispatch ),
		getEnrollableCohorts: getEnrollableCohortsInjector( dispatch )
	};
}
