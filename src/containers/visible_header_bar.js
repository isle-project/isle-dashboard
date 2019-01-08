// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import HeaderBar from 'components/header-bar';
import server from 'constants/server';
import * as actions from 'actions';


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
		onEnrolledNamespace: ({ title, description, owners, _id }) => {
			dispatch( actions.changedNamespace({
				title, description, owners, _id, userStatus: 'enrolled'
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
		onNamespace: ({ title, description, owners, _id }, userToken ) => {
			dispatch( actions.changedNamespace({ title, description, owners, _id, userStatus: 'owner' }) );
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
