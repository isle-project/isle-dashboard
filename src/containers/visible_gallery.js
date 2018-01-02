// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import server from './../constants/server';
import Gallery from './../components/gallery.js';
import * as actions from './../actions';


// EXPORTS //

const VisibleGallery = connect( mapStateToProps, mapDispatchToProps )( Gallery );

function mapStateToProps( state ) {
	return {
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
		}
	};
}

export default VisibleGallery;
