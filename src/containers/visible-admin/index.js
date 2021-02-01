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
import AdminPage from 'components/admin';
import { getUsersInjector, deleteUserInjector, impersonateUserInjector, adminUpdateUserInjector } from 'actions/user.js';
import { getEventsInjector, deleteEventInjector, triggerEventInjector } from 'actions/event.js';
import { getAllNamespacesInjector, deleteCurrentNamespaceInjector } from 'actions/namespace.js';
import { getAllCohortsInjector, deleteCohortInjector } from 'actions/cohort.js';
import { getAllLessonsInjector, deleteLessonInjector, getRoomsInjector } from 'actions/lesson.js';
import { sanitizeRequestInjector } from 'actions/authentication.js';
import { addNotificationInjector } from 'actions/notification.js';
import { getOverviewStatisticsInjector, getHistoricalOverviewStatsInjector, getRequestStatisticsInjector } from 'actions/statistics.js';
import { deleteFileInjector, getAllFilesInjector, getLicenseInjector } from 'actions/file.js';
import { deleteTicketInjector, getAllTicketsInjector, sendTicketMessageInjector,
	closeTicketInjector, openTicketInjector, updatePriorityInjector } from 'actions/ticket.js';
import { getCustomFieldsInjector } from 'actions/custom_field.js';


// FUNCTIONS //

function mapStateToProps( state ) {
	return {
		admin: state.admin,
		user: state.user
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		addNotification: addNotificationInjector( dispatch ),
		getAllCohorts: getAllCohortsInjector( dispatch ),
		getAllFiles: getAllFilesInjector( dispatch ),
		getAllLessons: getAllLessonsInjector( dispatch ),
		getAllNamespaces: getAllNamespacesInjector( dispatch ),
		getCustomFields: getCustomFieldsInjector( dispatch ),
		getEvents: getEventsInjector( dispatch ),
		getRequestStatistics: getRequestStatisticsInjector( dispatch ),
		getRooms: getRoomsInjector( dispatch ),
		getAllTickets: getAllTicketsInjector( dispatch ),
		getUsers: getUsersInjector( dispatch ),
		deleteCohort: deleteCohortInjector( dispatch ),
		deleteFile: deleteFileInjector( dispatch ),
		deleteCurrentNamespace: deleteCurrentNamespaceInjector( dispatch ),
		deleteEvent: deleteEventInjector( dispatch ),
		deleteLesson: deleteLessonInjector( dispatch ),
		deleteTicket: deleteTicketInjector( dispatch ),
		deleteUser: deleteUserInjector( dispatch ),
		impersonateUser: impersonateUserInjector( dispatch ),
		sanitizeRequest: sanitizeRequestInjector( dispatch ),
		sendTicketMessage: sendTicketMessageInjector( dispatch ),
		closeTicket: closeTicketInjector( dispatch ),
		openTicket: openTicketInjector( dispatch ),
		getLicense: getLicenseInjector( dispatch ),
		triggerEvent: triggerEventInjector( dispatch ),
		updatePriority: updatePriorityInjector( dispatch ),
		adminUpdateUser: adminUpdateUserInjector( dispatch ),
		getOverviewStatistics: getOverviewStatisticsInjector( dispatch ),
		getHistoricalOverviewStats: getHistoricalOverviewStatsInjector( dispatch )
	};
}


// MAIN //

const VisibleAdminPage = connect( mapStateToProps, mapDispatchToProps )( AdminPage );


// EXPORTS //

export default VisibleAdminPage;
