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

import request from 'request';
import server from 'constants/server';
import { CREATED_ANNOUNCEMENT, EDITED_ANNOUNCEMENT, DELETED_ANNOUNCEMENT } from 'constants/action_types.js';
import { addNotification, addErrorNotification } from 'actions/notification';


// EXPORTS //

export function editedAnnouncement( announcement, namespaceName ) {
	return {
		type: EDITED_ANNOUNCEMENT,
		payload: {
			announcement,
			namespaceName
		}
	};
}

export function createdAnnouncement( announcement, namespaceName ) {
	return {
		type: CREATED_ANNOUNCEMENT,
		payload: {
			announcement,
			namespaceName
		}
	};
}

export function deletedAnnouncement( index, namespaceName ) {
	return {
		type: DELETED_ANNOUNCEMENT,
		payload: {
			index,
			namespaceName
		}
	};
}

export const addAnnouncement = ( dispatch, { namespaceName, token, announcement }) => {
	request.post( server+'/new_announcement', {
		form: {
			namespaceName,
			announcement
		},
		headers: {
			'Authorization': 'JWT ' + token
		}
	}, ( err, res ) => {
		if ( err || res.statusCode >= 400 ) {
			return addErrorNotification( dispatch, err.message || res.body );
		}
		const obj = JSON.parse(res.body);
		dispatch( addNotification({
			message: obj.message,
			level: 'success'
		}) );
		dispatch( createdAnnouncement( announcement, namespaceName ) );
	});
};

export const addAnnouncementInjector = dispatch => {
	return ( { namespaceName, token, announcement } ) => {
		addAnnouncement( dispatch, { namespaceName, token, announcement } );
	};
};

export const deleteAnnouncement = ( dispatch, { namespaceName, token, createdAt, index }) => {
	request.post( server+'/delete_announcement', {
		form: {
			namespaceName,
			createdAt
		},
		headers: {
			'Authorization': 'JWT ' + token
		}
	}, ( err, res ) => {
		if ( err || res.statusCode >= 400 ) {
			return addErrorNotification( dispatch, err.message || res.body );
		}
		const obj = JSON.parse(res.body);
		addNotification( dispatch, {
			message: obj.message,
			level: 'success'
		});
		dispatch( deletedAnnouncement( index, namespaceName ) );
	});
};


export const deleteAnnouncementInjector = dispatch => {
	return ( { namespaceName, token, createdAt, index } ) => {
		deleteAnnouncement( dispatch, { namespaceName, token, createdAt, index } );
	};
};

export const editAnnouncement = ( dispatch, { namespaceName, token, announcement }) => {
	request.post( server+'/edit_announcement', {
		form: {
			namespaceName,
			announcement
		},
		headers: {
			'Authorization': 'JWT ' + token
		}
	}, ( err, res ) => {
		if ( err || res.statusCode >= 400 ) {
			return addErrorNotification( dispatch, err.message || res.body );
		}
		const obj = JSON.parse(res.body);
		addNotification( dispatch, {
			message: obj.message,
			level: 'success'
		});
		dispatch( editedAnnouncement( announcement, namespaceName ) );
	});
};

export const editAnnouncementInjector = dispatch => {
	return ( { namespaceName, token, announcement } ) => {
		editAnnouncement( dispatch, { namespaceName, token, announcement } );
	};
};
