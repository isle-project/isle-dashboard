// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import logger from 'debug';
import ProfilePage from 'components/profile-page';
import server from 'constants/server';
import * as actions from 'actions';


// VARIABLES //

const debug = logger( 'isle-dashboard' );


// EXPORTS //

const VisibleProfilePage = connect( mapStateToProps, mapDispatchToProps )( ProfilePage );

function mapStateToProps( state ) {
	return {
		user: state.user
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		addNotification: ({ message, level }) => {
			dispatch( actions.addNotification({ message, level }) );
		},
		addBadges: () => {
			dispatch( actions.addNotification({
				children: (
					<div>
						<h3>Received Badge: TODO</h3>
						<div>
							<div>
								<div style={{
									position: 'absolute',
									left: '11%',
									top: '13%',
									width: '78%',
									height: '70%',
									borderRadius: '50%',
									filter: 'saturate(20%)',
									background: 'rgba(255,0,0,0.1)'
								}} />
								<img style={{ display: 'block',
									marginLeft: 'auto',
									marginRight: 'auto',
									width: '80%'
								}} src="https://isle.heinz.cmu.edu/badge_50_lessons_1546115022850.svg"
								/>
							</div>
							<p style={{ marginTop: 15 }}>You received a badge for: TODO.</p>
						</div>
					</div>
				),
				level: 'info',
				position: 'tc',
				dismissible: 'button',
				autoDismiss: 0
			}) );
		},
		updateUser: ({ name, organization }) => {
			dispatch( actions.updateUser({ name, organization }) );
		},
		authenticate: ({ userToken, writeAccessToken }) => {
			debug( 'Authenticate user with token: %s', userToken );
			request.get( server+'/set_write_access', {
				headers: {
					'Authorization': 'JWT ' + userToken
				},
				qs: {
					token: writeAccessToken
				}
			}, function onResponse( error, response, body ) {
				if ( error ) {
					return error;
				}
				if ( response.statusCode !== 200 ) {
					dispatch( actions.addNotification({
						message: 'The provided token is incorrect.',
						level: 'error'
					}) );
				} else {
					body = JSON.parse( body );
					dispatch( actions.authenticated() );
					dispatch( actions.addNotification({
						message: body.message,
						level: 'success'
					}) );
				}
			});
		},
		getFiles: ({ token }) => {
			request.get( server+'/get_user_files', {
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, function onResponse( error, response, body ) {
				if ( error ) {
					return error;
				}
				if ( response.statusCode === 200 ) {
					body = JSON.parse( body );
					dispatch( actions.receivedFiles( body.files ) );
				}
			});
		},
		getLessons: ( namespaceName ) => {
			if ( namespaceName ) {
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
					lessons = lessons.map( lesson => {
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
		},
		uploadProfilePic: ({ token, formData }) => {
			const xhr = new XMLHttpRequest();
			xhr.open( 'POST', server+'/upload_profile_pic', true );
			xhr.setRequestHeader( 'Authorization', 'JWT ' + token );
			xhr.onreadystatechange = () => {
				if ( xhr.readyState === XMLHttpRequest.DONE ) {
					let message;
					let level;
					let body;
					if ( xhr.status === 200 ) {
						body = JSON.parse( xhr.responseText );
						message = body.message;
						level = 'success';
						body.filename = server + '/avatar/' + body.filename;
						dispatch( actions.updateUserPicture( body.filename ) );
					} else {
						message = xhr.responseText;
						level = 'error';
					}
					return dispatch( actions.addNotification({
						title: 'Profile Picture Upload',
						message,
						level,
						position: 'tl'
					}) );
				}
			};
			xhr.send( formData );
		}
	};
}

export default VisibleProfilePage;
