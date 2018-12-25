// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import server from './../constants/server';
import Gallery from './../components/gallery';
import * as actions from './../actions';


// EXPORTS //

const VisibleGallery = connect( mapStateToProps, mapDispatchToProps )( Gallery );

function mapStateToProps( state ) {
	return {
		search: state.search,
		user: state.user,
		gallery: state.gallery
	};
}

function mapDispatchToProps( dispatch ) {
	return {
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
				lessons = lessons.map( lesson => {
					lesson.url = server+'/'+lesson.namespace+'/'+lesson.title;
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
					dispatch( actions.addNotification({
						message: error.message,
						level: 'error'
					}) );
					return callback( error );
				}
				callback( null, body );
				dispatch( actions.addNotification({
					message: 'Source code has been copied to the clipboard',
					level: 'success'
				}) );
			});
		}
	};
}

export default VisibleGallery;
