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

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import server from 'constants/server';
import Gallery from 'components/gallery';
import * as actions from 'actions';


// EXPORTS //

const VisibleGallery = connect( mapStateToProps, mapDispatchToProps )( Gallery );

function mapStateToProps( state ) {
	return {
		search: state.search,
		user: state.user,
		openedNamespace: state.namespace,
		gallery: state.gallery
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		addNotification: ( notification ) => {
			dispatch( actions.addNotification( notification ) );
		},
		copyLesson: ({ sourceName, target, targetName, source, token }) => {
			if ( sourceName && target && source ) {
				request.get( server+'/copy_lesson', {
					qs: {
						target,
						source,
						sourceName,
						targetName
					},
					headers: {
						'Authorization': 'JWT ' + token
					}
				}, function onResponse( err, res ) {
					if ( err ) {
						return dispatch( actions.addNotification({
							message: err.message,
							level: 'error'
						}) );
					}
					let msg = JSON.parse( res.body ).message;
					if ( res.statusCode >= 400 ) {
						return dispatch( actions.addNotification({
							message: msg,
							level: 'error'
						}) );
					}
					dispatch( actions.addNotification({
						message: msg,
						level: 'success'
					}) );
				});
			}
		},
		findPublicLessons: () => {
			request.get( server+'/get_public_lessons', function onResponse( error, response, body ) {
				if ( error ) {
					return error;
				}
				body = JSON.parse( body );
				let lessons = body.lessons;
				lessons = lessons.map( (lesson, index) => {
					lesson.colorIndex = index % 20;
					lesson.url = server+'/'+lesson.namespace+'/'+lesson.title;
					if ( !lesson.createdAt ) {
						lesson.createdAt = new Date( 0 ).toLocaleString();
					}
					if ( !lesson.updatedAt ) {
						lesson.updatedAt = lesson.createdAt;
					}
					return lesson;
				});
				dispatch( actions.retrievedPublicLessons( lessons ) );
			});
		},
		getIsleFile: ({ lessonName, namespaceName, token, callback }) => {
			request.get( server+'/get_isle_file', {
				qs: {
					lessonName,
					namespaceName
				},
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, function onResponse( error, response, body ) {
				if ( error ) {
					return callback( error );
				}
				return callback( null, body );
			});
		}
	};
}

export default VisibleGallery;
