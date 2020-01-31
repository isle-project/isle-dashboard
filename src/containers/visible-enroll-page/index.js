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
import EnrollPage from 'components/enroll-page';
import request from 'request';
import contains from '@stdlib/assert/contains';
import isRegExpString from '@stdlib/assert/is-regexp-string';
import reFromString from '@stdlib/utils/regexp-from-string';
import server from 'constants/server';
import * as actions from 'actions';


// EXPORTS //

const VisibleEnrollPage = connect( mapStateToProps, mapDispatchToProps )( EnrollPage );

function mapStateToProps( state ) {
	return {
		cohorts: state.cohorts,
		user: state.user
	};
}

function mapDispatchToProps(dispatch) {
	return {
		addUserToCohort(cohortID, userToken, namespace, callback ) {
			request.get( server+'/add_to_cohort', {
				headers: {
					'Authorization': 'JWT ' + userToken
				},
				qs: {
					cohortID
				}
			}, function onAdded( error, response, body ) {
				if ( error ) {
					dispatch( actions.addNotification({
						message: error.message,
						level: 'error'
					}) );

					return callback();
				}
				body = JSON.parse( body );
				dispatch( actions.addNotification({
					message: body.message,
					level: 'success'
				}) );

				dispatch( actions.addEnrolledNamespace(namespace) );
				const namespaceName = namespace.title;

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
				return callback();
			});
		},
		fetchCohorts( user ) {
			request.get( server+'/get_enrollable_cohorts', {
				headers: {
					'Authorization': 'JWT ' + user.token
				}
			}, function onCohorts( error, response, body ) {
				if ( error ) {
					return error;
				}
				body = JSON.parse( body );
				let cohorts = body.cohorts;
				cohorts = cohorts.filter( elem => {
					let emailFilter = elem.emailFilter || '';
					if ( isRegExpString( emailFilter ) ) {
						emailFilter = reFromString( emailFilter );
					}
					return contains( user.email, emailFilter || '' );
				});
				dispatch( actions.retrievedEnrollableCohorts( cohorts ) );
			});
		}
	};
}


export default VisibleEnrollPage;
