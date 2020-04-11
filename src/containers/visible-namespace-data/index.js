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
import { withRouter } from 'react-router';
import NamespaceData from 'components/namespace-data';
import { addAnnouncementInjector, deleteAnnouncementInjector, editAnnouncementInjector } from 'actions/announcement';
import { getAvailableBadgesInjector } from 'actions/badge';
import { deleteFileInjector, getFilesInjector, getOwnerFilesInjector, uploadFileInjector } from 'actions/file';
import { addNotificationInjector } from 'actions/notification';
import { getNamespaceActionsInjector } from 'actions/namespace';


// FUNCTIONS //

function mapStateToProps( state ) {
	return {
		badges: state.badges,
		user: state.user,
		namespace: state.namespace
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		getBadges: getAvailableBadgesInjector( dispatch ),
		getFiles: getFilesInjector( dispatch ),
		getOwnerFiles: getOwnerFilesInjector( dispatch ),
		getNamespaceActions: getNamespaceActionsInjector( dispatch ),
		addNotification: addNotificationInjector( dispatch ),
		deleteFile: deleteFileInjector( dispatch ),
		deleteAnnouncement: deleteAnnouncementInjector( dispatch ),
		editAnnouncement: editAnnouncementInjector( dispatch ),
		addAnnouncement: addAnnouncementInjector( dispatch ),
		uploadFile: uploadFileInjector( dispatch )
	};
}


// MAIN //

const VisibleNamespaceData = connect( mapStateToProps, mapDispatchToProps )( NamespaceData );


// EXPORTS //

export default withRouter( VisibleNamespaceData );
