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
import ProfilePage from 'components/profile-page';
import { getLessonsInjector } from 'actions/lesson';
import { getUserBadgesInjector } from 'actions/badge';
import { getUserFilesInjector } from 'actions/file';
import { authenticateInjector, uploadProfilePicInjector, updateUserInjector, resendConfirmEmailInjector } from 'actions/user';
import { addNotificationInjector } from 'actions/notification';
import { createTicketInjector, getUserTicketsInjector } from 'actions/ticket';
import { sendTicketMessageInjector, closeTicketInjector, openTicketInjector } from 'actions/ticket';
import { enableTFAInjector, disableTFAInjector, getTfaQRCodeInjector } from 'actions/two_factor_auth.js';


// FUNCTIONS //

function mapStateToProps( state ) {
	return {
		user: state.user
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		addNotification: addNotificationInjector( dispatch ),
		createTicket: createTicketInjector( dispatch ),
		getUserBadges: getUserBadgesInjector( dispatch ),
		updateUser: updateUserInjector( dispatch ),
		authenticate: authenticateInjector( dispatch ),
		getUserFiles: getUserFilesInjector( dispatch ),
		getLessons: getLessonsInjector( dispatch ),
		resendConfirmEmail: resendConfirmEmailInjector( dispatch ),
		sendTicketMessage: sendTicketMessageInjector( dispatch ),
		closeTicket: closeTicketInjector( dispatch ),
		openTicket: openTicketInjector( dispatch ),
		getUserTickets: getUserTicketsInjector( dispatch ),
		uploadProfilePic: uploadProfilePicInjector( dispatch ),
		enableTFA: enableTFAInjector( dispatch ),
		disableTFA: disableTFAInjector( dispatch ),
		getTfaQRCode: getTfaQRCodeInjector( dispatch )
	};
}


// MAIN //

const VisibleProfilePage = connect( mapStateToProps, mapDispatchToProps )( ProfilePage );


// EXPORTS //

export default VisibleProfilePage;
