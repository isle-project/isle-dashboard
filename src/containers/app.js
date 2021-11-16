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
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import capitalize from '@stdlib/string/capitalize';
import axios from 'axios';
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
const AsyncAdminSettings = lazy(() => import( 'containers/visible-admin-settings' ));
const AsyncLogin = lazy(() => import( 'containers/visible-login' ));
const AsyncLoginTFA = lazy(() => import( 'containers/visible-login-tfa' ));
const AsyncSignup = lazy(() => import( 'containers/visible-signup' ));
const AsyncNamespaceData = lazy(() => import( 'containers/visible-namespace-data' ));
const AsyncGallery = lazy(() => import( 'containers/visible-gallery' ));
const AsyncLessonsPage = lazy(() => import( 'containers/visible-lessons-page' ));
const AsyncProfilePage = lazy(() => import( 'containers/visible-profile-page' ));
const AsyncEnrollPage = lazy(() => import( 'containers/visible-enroll-page' ));
const USER_STORAGE_ID = 'ISLE_USER_'+server;


// VARIABLES //

const RE_PUBLIC_PAGES = /(?:courses|new-password|complete-registration|confirm-email|signup|login|login-tfa|terms|privacy)/;
const debug = logger( 'isle-dashboard' );


// FUNCTIONS //

function generateTitle( ) {
	console.log( window.location.hash );
	const title = capitalize( window.location.hash.replace( /^\//, '' ) );
	console.log( title );
	return `${title} | ISLE Dashboard`;
}


// MAIN //

const App =({ isLoggedIn, dispatch, getCustomTranslations, getPublicSettings, fetchCredentials, getEnrollableCohorts, user, settings }) => {
	const oldIsLoggedIn = usePrevious( isLoggedIn );
	const writeAccess = user.writeAccess;
	const navigate = useNavigate();
	useMountEffect( async () => {
		getCustomTranslations();
		getPublicSettings();
		if (
			!isLoggedIn &&
			!RE_PUBLIC_PAGES.test( window.location.pathname )
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
					token: this.props.user.token,
					id: this.props.user.id
				}) );
			}
		}
	});
	useEffect( () => {
		const isLoggingOut = oldIsLoggedIn && !isLoggedIn;
		const isLoggingIn = !oldIsLoggedIn && isLoggedIn;
		const pathname = window.location.pathname;
		if ( isLoggingIn ) {
			if ( pathname === '/login-tfa' ) {
				const path = writeAccess ? '/lessons' : '/profile';
				navigate( path );
			}
			else if ( pathname && pathname !== '/' && pathname !== '/login' ) {
				debug( 'User has logged in, redirecting to: '+pathname );
				navigate( pathname );
			} else {
				const path = writeAccess ? '/lessons' : '/profile';
				debug( 'User has logged in, redirecting to default page: '+pathname );
				navigate( path );
			}
		}
		else if ( isLoggingOut ) {
			navigate( '/login' );
		}
		else if (
			isLoggedIn && pathname &&
			( pathname === '/' || pathname === '/login' || pathname === '/login-tfa' )
		) {
			const path = writeAccess ? '/lessons' : '/profile';
			navigate( path );
		}
	}, [ isLoggedIn, navigate, oldIsLoggedIn, writeAccess ] );
	let AuthenticationBarrier = null;
	if ( isLoggedIn ) {
		AuthenticationBarrier =
			<Fragment>
				<Suspense fallback={<div>Loading...</div>}>
					<AsyncHeaderBar />
				</Suspense>
				<Routes>
					<Route
						path="/create-namespace"
						element={<Suspense fallback={<div>Loading...</div>}>
							<AsyncCreateNamespace />
						</Suspense>}
					/>
					<Route
						path="/edit-namespace/:namespace"
						element={<Suspense fallback={<div>Loading...</div>}>
							<AsyncEditNamespace />
						</Suspense>}
					/>
					<Route
						path="/namespace-data/:namespace"
						element={<Suspense fallback={<div>Loading...</div>}>
							<AsyncNamespaceData />
						</Suspense>}
					/>
					<Route
						path="/namespace-data/:namespace/:subpage"
						element={<Suspense fallback={<div>Loading...</div>}>
							<AsyncNamespaceData />
						</Suspense>}
					/>
					<Route
						path="/profile"
						element={<Suspense fallback={<div>Loading...</div>}>
							<AsyncProfilePage />
						</Suspense>}
					/>
					<Route
						path="/lessons"
						element={<Suspense fallback={<div>Loading...</div>}>
							<AsyncLessonsPage />
						</Suspense>}
					/>
					<Route
						path="/lessons/:namespace"
						element={<Suspense fallback={<div>Loading...</div>}>
							<AsyncLessonsPage />
						</Suspense>}
					/>
					<Route
						path="/gallery"
						element={<Suspense fallback={<div>Loading...</div>}>
							<AsyncGallery />
						</Suspense>}
					/>
					<Route
						path="/enroll"
						element={<Suspense fallback={<div>Loading...</div>}>
							<AsyncEnrollPage />
						</Suspense>}
					/>
					<Route
						path="/admin/*"
						element={<Suspense fallback={<div>Loading...</div>}>
							<AsyncAdminPage />
						</Suspense>}
					/>
					<Route
						path="/admin/settings"
						element={<Suspense fallback={<div>Loading...</div>}>
							<AsyncAdminSettings />
						</Suspense>}
					/>
					<Route
						path="/admin/settings/:subpage"
						element={<Suspense fallback={<div>Loading...</div>}>
							<AsyncAdminSettings />
						</Suspense>}
					/>
				</Routes>
			</Fragment>;
	}
	return (
		<div className="App">
			<Helmet>
				<title>{generateTitle()}</title>
			</Helmet>
			{AuthenticationBarrier}
			<Routes>
				<Route path="/" element={<Suspense fallback={<div>Loading...</div>}>
					<AsyncLogin />
				</Suspense>} />
				<Route path="/login" element={<Suspense fallback={<div>Loading...</div>}>
					<AsyncLogin />
				</Suspense>} />
				<Route path="/login-tfa" element={<Suspense fallback={<div>Loading...</div>}>
					<AsyncLoginTFA />
				</Suspense>} />
				<Route path="/new-password" element={<Suspense fallback={<div>Loading...</div>}>
					<AsyncNewPassword />
				</Suspense>} />
				<Route path="/complete-registration" element={<Suspense fallback={<div>Loading...</div>}>
					<AsyncCompleteRegistration />
				</Suspense>} />
				<Route path="/confirm-email" element={<Suspense fallback={<div>Loading...</div>}>
					<AsyncConfirmEmail />
				</Suspense>} />
				{settings.allowUserRegistrations ? <Route path="/signup" element={<Suspense fallback={<div>Loading...</div>}>
					<AsyncSignup />
				</Suspense>} /> : null}
				<Route path="/forgot-password" element={<Suspense fallback={<div>Loading...</div>}>
					<AsyncForgotPassword />
				</Suspense>} />
				<Route path="/terms" element={<Suspense fallback={<div>Loading...</div>}>
					<AsyncTerms />
				</Suspense>} />
				<Route path="/privacy" element={<Suspense fallback={<div>Loading...</div>}>
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
