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
import logger from 'debug';
import ProfilePage from 'components/profile-page';
import server from 'constants/server';
import * as actions from 'actions';
import { getLessonsInjector } from 'actions/lesson';
import { getBadgesInjector } from 'actions/badge';


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
		addNotification: ( notification ) => {
			dispatch( actions.addNotification( notification ) );
		},
		addBadges: getBadgesInjector( dispatch ),
		updateUser: ({ name, organization }) => {
			dispatch( actions.updateUser({ name, organization }) );
		},
		authenticate: ({ userToken, writeAccessToken }, clbk ) => {
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
					return clbk( error );
				}
				if ( response.statusCode !== 200 ) {
					dispatch( actions.addNotification({
						message: 'The provided token is incorrect.',
						level: 'error'
					}) );
					return clbk( null, false );
				}
				body = JSON.parse( body );
				dispatch( actions.authenticated() );
				dispatch( actions.addNotification({
					message: body.message+' You can now create your own courses on ISLE and have access to the gallery of public lessons.',
					level: 'success',
					autoDismiss: 10
				}) );
				return clbk( null, true );
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
		getLessons: getLessonsInjector( dispatch ),
		uploadProfilePic: ({ token, avatarData, thumbnailData }) => {
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
			xhr.send( avatarData );

			const xhr2 = new XMLHttpRequest();
			xhr2.open( 'POST', server+'/upload_thumbnail_pic', true );
			xhr2.setRequestHeader( 'Authorization', 'JWT ' + token );
			xhr2.send( thumbnailData );
		}
	};
}

export default VisibleProfilePage;
