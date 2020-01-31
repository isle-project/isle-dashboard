/**
* Copyright (C) 2016-2020 The ISLE Authors
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

import React from 'react';
import { connect } from 'react-redux';
import logger from 'debug';
import request from 'request';
import HeaderBar from 'components/header-bar';
import server from 'constants/server';
import * as actions from 'actions';


// VARIABLES //

const debug = logger( 'isle:header-bar' );


// EXPORTS //

export default connect( mapStateToProps, mapDispatchToProps )( HeaderBar );

function mapStateToProps( state ) {
	return {
		user: state.user,
		namespace: state.namespace,
		search: state.search
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		userUpdateCheck: ( user ) => {
			request.get( server+'/user_update_check', {
				headers: {
					'Authorization': 'JWT ' + user.token
				},
				qs: {
					id: user.id,
					updatedAt: user.updatedAt
				}
			}, function onUserCheck( error, response, body ) {
				if ( error ) {
					return error;
				}
				debug( 'Received response: '+body );
				body = JSON.parse( body );
				if ( !body.hasMostRecent ) {
					request.post( server+'/credentials_dashboard', {
						headers: {
							'Authorization': 'JWT ' + user.token
						},
						form: {
							id: user.id
						}
					}, function onLogin( error, response, newUser ) {
						if ( error ) {
							return error;
						}
						newUser = JSON.parse( newUser );
						if ( newUser.picture ) {
							newUser.picture = server + '/avatar/' + newUser.picture;
						}
						newUser = {
							id: user.id,
							token: user.token,
							...newUser
						};
						debug( 'Updated user data...' );
						dispatch( actions.loggedIn( newUser ) );
					});
				}
			});
		},
		logout: () => {
			localStorage.removeItem( 'ISLE_USER_'+server );
			dispatch( actions.loggedOut() );
		},
		setSearchPhrase: ( str ) => {
			dispatch( actions.searchPhraseSet( str ) );
		},
		setLessonOrder: ( order ) => {
			dispatch( actions.setLessonOrder( order ) );
		},
		setLessonOrderDirection: ( direction ) => {
			dispatch( actions.setLessonOrderDirection( direction ) );
		},
		onEnrolledNamespace: ({ title, description, announcements, owners, _id }) => {
			dispatch( actions.changedNamespace({
				title, description, announcements, owners, _id
			}) );
			const namespaceName = title;
			request.get( server+'/get_lessons', {
				qs: {
					namespaceName
				}
			}, function onLessons( error, response, body ) {
				if ( error ) {
					return error;
				}
				body = JSON.parse( body );
				let lessons = body.lessons;
				lessons = lessons.map((lesson, index) => {
					lesson.colorIndex = index % 20;
					lesson.url = server+'/'+namespaceName+'/'+lesson.title;
					if ( !lesson.createdAt ) {
						lesson.createdAt = new Date( 0 ).toLocaleString();
					}
					if ( !lesson.updatedAt ) {
						lesson.updatedAt = lesson.createdAt;
					}
					return lesson;
				});
				dispatch( actions.retrievedLessons({ lessons, namespaceName }) );
			});
		},
		onNamespace: ({ title, description, announcements, owners, _id }, userToken ) => {
			dispatch( actions.changedNamespace({ title, description, announcements, owners, _id }) );
			request.get( server+'/get_cohorts', {
				headers: {
					'Authorization': 'JWT ' + userToken
				},
				qs: {
					namespaceID: _id
				}
			}, function onNamespace( error, response, body ) {
				if ( error ) {
					return error;
				}
				body = JSON.parse( body );
				dispatch( actions.retrievedCohorts( body.cohorts ) );
			});
			const namespaceName = title;
			request.get( server+'/get_lessons', {
				qs: {
					namespaceName
				}
			}, function onLessons( error, response, body ) {
				if ( error ) {
					return error;
				}
				body = JSON.parse( body );
				let lessons = body.lessons;
				lessons = lessons.map((lesson, index) => {
					lesson.colorIndex = index % 20;
					lesson.url = server+'/'+namespaceName+'/'+lesson.title;
					if ( !lesson.createdAt ) {
						lesson.createdAt = new Date( 0 ).toLocaleString();
					}
					if ( !lesson.updatedAt ) {
						lesson.updatedAt = lesson.createdAt;
					}
					return lesson;
				});
				dispatch( actions.retrievedLessons({ lessons, namespaceName }) );
			});
		}
	};
}
