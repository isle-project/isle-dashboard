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

import React, { lazy, Suspense, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import logger from 'debug';
import { connect } from 'react-redux';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import capitalize from '@stdlib/string/capitalize';
import axios from 'axios';
import Spinner from 'components/spinner';
import usePrevious from 'hooks/use-previous';
import useMountEffect from 'hooks/use-mount-effect/index.js';
import server from 'constants/server';
import { fetchCredentialsInjector } from 'actions/authentication.js';
import { getEnrollableCohortsInjector } from 'actions/cohort.js';
import { getPublicSettingsInjector, getCustomTranslationsInjector } from 'actions/settings.js';
import { receivedToken } from 'actions/user.js';
import NotificationSystem from './notification.js';
import './app.css';


// VARIABLES //

import FooterBar from 'containers/visible-footer-bar';
const AsyncTerms = lazy(() => import( 'containers/visible-terms' ));
const AsyncPrivacy = lazy(() => import( 'containers/visible-privacy' ));
const AsyncHeaderBar = lazy(() => import( 'containers/visible-header-bar' ));
const AsyncForgotPassword = lazy(() => import( 'containers/visible-forgot-password' ));
const AsyncCreateNamespace = lazy(() => import( 'containers/visible-create-namespace' ));
const AsyncEditNamespace = lazy(() => import( 'containers/visible-edit-namespace' ));
const AsyncNewPassword = lazy(() => import( 'containers/visible-new-password' ));
const AsyncCompleteRegistration = lazy(() => import( 'containers/visible-complete-registration' ));
const AsyncConfirmEmail = lazy(() => import( 'containers/visible-confirm-email' ));
const AsyncAdminPage = lazy(() => import( 'containers/visible-admin' ));
const AsyncLogin = lazy(() => import( 'containers/visible-login' ));
const AsyncLoginTFA = lazy(() => import( 'containers/visible-login-tfa' ));
const AsyncSignup = lazy(() => import( 'containers/visible-signup' ));
const AsyncNamespaceData = lazy(() => import( 'containers/visible-namespace-data' ));
const AsyncGallery = lazy(() => import( 'containers/visible-gallery' ));
const AsyncLessonsPage = lazy(() => import( 'containers/visible-lessons-page' ));
const AsyncProfilePage = lazy(() => import( 'containers/visible-profile-page' ));
const AsyncEnrollPage = lazy(() => import( 'containers/visible-enroll-page' ));
const USER_STORAGE_ID = 'ISLE_USER_'+server;
const RE_PUBLIC_PAGES = /(?:new-password|complete-registration|confirm-email|signup|login|login-tfa|terms|privacy)/;
const debug = logger( 'isle-dashboard' );


// FUNCTIONS //

/**
* Injects the application title into the document's title tag.
*
* @private
* @returns {ReactElement} helmet component
*/
const Title = () => {
	const { pathname } = useLocation();
	let title = capitalize( pathname.replace( /^[\s\S]*\//, '' ) ) || 'Login';
	title = `${title} | ISLE Dashboard`;
	return (
		<Helmet>
			<title>{title}</title>
		</Helmet>
	);
};

/**
* Generates a destination URL based off the query string or a sensible default and navigates to it.
*
* @private
* @param {string} search - query string
* @param {boolean} writeAccess - whether or not the user has write access
* @param {Function} navigate - function that navigates to a provided URL
* @returns {void}
*/
function goToDestination( search, writeAccess, navigate ) {
	let url = new URLSearchParams( search ).get( 'url' );
	if ( !url ) {
		url = writeAccess ? '/dashboard/lessons' : '/dashboard/profile';
	}
	if ( url.indexOf( 'dashboard' ) !== -1 ) {
		url = url.replace( /\/dashboard/, '' );
		debug( 'Redirecting to dashboard page: %s', url );
		navigate( url );
	} else {
		debug( 'Destination is not a dashboard URL: %s', url );
		window.location = server + url;
	}
}


// MAIN //

/**
* The main application component.
*
* @param {Object} props - component properties
* @param {boolean} props.isLoggedIn - whether or not the user is logged in
* @param {Object} props.user - user object
* @param {Object} props.settings - application settings
* @param {Function} props.fetchCredentials - function to fetch credentials
* @param {Function} props.getCustomTranslations - function to get custom translations
* @param {Function} props.getPublicSettings - function to get public settings
* @param {Function} props.getEnrollableCohorts - function to get enrollable cohorts
* @param {Function} props.dispatch - redux dispatch function
* @returns {ReactElement} component
*/
const App =({ isLoggedIn, dispatch, getCustomTranslations, getPublicSettings, fetchCredentials, getEnrollableCohorts, user, settings }) => {
	const oldIsLoggedIn = usePrevious( isLoggedIn );
	const writeAccess = user.writeAccess;
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	useMountEffect( async () => {
		getCustomTranslations();
		getPublicSettings();
		if (
			!isLoggedIn &&
			!RE_PUBLIC_PAGES.test( pathname )
		) {
			let isle = localStorage.getItem( USER_STORAGE_ID );
			if ( isle ) {
				isle = JSON.parse( isle );
				const user = await fetchCredentials( isle );
				if ( user ) {
					getEnrollableCohorts( user );
				}
			} else {
				try {
					const res = await axios.get( server+'/saml-xmw/session' );
					dispatch( receivedToken( res.data ) );
					const user = await fetchCredentials( res.data );
					if ( user ) {
						getEnrollableCohorts( user );
					}
				} catch ( err ) {
					navigate( '/login' );
				}
			}
		}
		if ( isLoggedIn ) {
			debug( 'User is logged in, check local storage...' );
			const isle = localStorage.getItem( USER_STORAGE_ID );
			if ( !isle ) {
				debug( 'User is logged in, but no local storage found -> write to local storage' );
				localStorage.setItem( USER_STORAGE_ID, JSON.stringify({
					token: user.token,
					id: user.id
				}) );
			}
		}
	});
	useEffect( () => {
		const isLoggingOut = oldIsLoggedIn && !isLoggedIn;
		const isLoggingIn = !oldIsLoggedIn && isLoggedIn;
		if ( isLoggingIn ) {
			if ( pathname === '/login-tfa' ) {
				goToDestination( search, writeAccess, navigate );
			}
			else if ( pathname && pathname !== '/' && pathname !== '/login' ) {
				debug( 'User has logged in, redirecting to: '+pathname );
				navigate( pathname );
			} else {
				debug( 'User has logged in, redirecting...' );
				axios.post( server+'/ensure_session' )
					.then( ( res ) => {
						goToDestination( search, writeAccess, navigate );
					} )
					.catch( ( err ) => {
						debug( 'Encountered an error while ensuring session: '+err.message );
					});
			}
		}
		else if ( isLoggingOut ) {
			navigate( '/login' );
		}
		else if (
			isLoggedIn && pathname &&
			( pathname === '/' || pathname === '/login' || pathname === '/login-tfa' )
		) {
			debug( 'User is logged in, check for redirect...' );
			axios.post( server+'/ensure_session' )
				.then( ( res ) => {
					goToDestination( search, writeAccess, navigate );
				} )
				.catch( ( err ) => {
					debug( 'Encountered an error while ensuring session: '+err.message );
				});
		}
	}, [ isLoggedIn, pathname, search, navigate, oldIsLoggedIn, writeAccess ] );
	let AuthenticationBarrier = null;
	if ( isLoggedIn ) {
		AuthenticationBarrier =
			<Fragment>
				{!RE_PUBLIC_PAGES.test( pathname ) ? <Suspense fallback={<Spinner />}>
					<AsyncHeaderBar />
				</Suspense> : null}
				<Routes>
					<Route
						path="/create-namespace"
						element={<Suspense fallback={<Spinner />}>
							<AsyncCreateNamespace />
						</Suspense>}
					/>
					<Route
						path="/edit-namespace/:namespace"
						element={<Suspense fallback={<Spinner />}>
							<AsyncEditNamespace />
						</Suspense>}
					/>
					<Route
						path="/namespace-data/:namespace/*"
						element={<Suspense fallback={<Spinner />}>
							<AsyncNamespaceData />
						</Suspense>}
					/>
					<Route
						path="/profile"
						element={<Suspense fallback={<Spinner />}>
							<AsyncProfilePage />
						</Suspense>}
					/>
					<Route
						index
						path="/lessons"
						element={<Suspense fallback={<Spinner />}>
							<AsyncLessonsPage />
						</Suspense>}
					/>
					<Route
						path="/lessons/:namespace"
						element={<Suspense fallback={<Spinner />}>
							<AsyncLessonsPage />
						</Suspense>}
					/>
					<Route
						path="/gallery"
						element={<Suspense fallback={<Spinner />}>
							<AsyncGallery />
						</Suspense>}
					/>
					<Route
						path="/enroll"
						element={<Suspense fallback={<Spinner />}>
							<AsyncEnrollPage />
						</Suspense>}
					/>
					<Route
						path="/admin/*"
						element={<Suspense fallback={<Spinner />}>
							<AsyncAdminPage />
						</Suspense>}
					/>
				</Routes>
			</Fragment>;
	}
	return (
		<div className="App">
			<Title />
			{AuthenticationBarrier}
			<Routes>
				<Route index path="/" element={<Suspense fallback={<Spinner />}>
					<AsyncLogin />
				</Suspense>} />
				<Route path="/login" element={<Suspense fallback={<Spinner />}>
					<AsyncLogin />
				</Suspense>} />
				<Route path="/login-tfa" element={<Suspense fallback={<Spinner />}>
					<AsyncLoginTFA />
				</Suspense>} />
				<Route path="/new-password" element={<Suspense fallback={<Spinner />}>
					<AsyncNewPassword />
				</Suspense>} />
				<Route path="/complete-registration" element={<Suspense fallback={<Spinner />}>
					<AsyncCompleteRegistration />
				</Suspense>} />
				<Route path="/confirm-email" element={<Suspense fallback={<Spinner />}>
					<AsyncConfirmEmail />
				</Suspense>} />
				{settings.allowUserRegistrations ? <Route path="/signup" element={<Suspense fallback={<Spinner />}>
					<AsyncSignup />
				</Suspense>} /> : null}
				<Route path="/forgot-password" element={<Suspense fallback={<Spinner />}>
					<AsyncForgotPassword />
				</Suspense>} />
				<Route path="/terms" element={<Suspense fallback={<Spinner />}>
					<AsyncTerms />
				</Suspense>} />
				<Route path="/privacy" element={<Suspense fallback={<Spinner />}>
					<AsyncPrivacy />
				</Suspense>} />
			</Routes>
			<FooterBar />
			<NotificationSystem />
		</div>
	);
};


// PROPERTIES //

App.propTypes = {
	dispatch: PropTypes.func.isRequired,
	fetchCredentials: PropTypes.func.isRequired,
	getCustomTranslations: PropTypes.func.isRequired,
	getEnrollableCohorts: PropTypes.func.isRequired,
	getPublicSettings: PropTypes.func.isRequired,
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
		dispatch: dispatch,
		fetchCredentials: fetchCredentialsInjector( dispatch ),
		getCustomTranslations: getCustomTranslationsInjector( dispatch ),
		getPublicSettings: getPublicSettingsInjector( dispatch ),
		getEnrollableCohorts: getEnrollableCohortsInjector( dispatch )
	};
}
