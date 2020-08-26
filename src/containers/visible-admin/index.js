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
import { getUsersInjector, deleteUserInjector, impersonateUserInjector } from 'actions/user.js';
import { getEventsInjector } from 'actions/event.js';
import { getAllNamespacesInjector, deleteCurrentNamespaceInjector } from 'actions/namespace.js';
import { getAllCohortsInjector, deleteCohortInjector } from 'actions/cohort.js';
import { getAllLessonsInjector, deleteLessonInjector } from 'actions/lesson.js';


// FUNCTIONS //

function mapStateToProps( state ) {
	return {
		admin: state.admin,
		user: state.user
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		getAllCohorts: getAllCohortsInjector( dispatch ),
		getAllLessons: getAllLessonsInjector( dispatch ),
		getAllNamespaces: getAllNamespacesInjector( dispatch ),
		getEvents: getEventsInjector( dispatch ),
		getUsers: getUsersInjector( dispatch ),
		deleteCohort: deleteCohortInjector( dispatch ),
		deleteCurrentNamespace: deleteCurrentNamespaceInjector( dispatch ),
		deleteLesson: deleteLessonInjector( dispatch ),
		deleteUser: deleteUserInjector( dispatch ),
		impersonateUser: impersonateUserInjector( dispatch )
	};
}


// MAIN //

const VisibleAdminPage = connect( mapStateToProps, mapDispatchToProps )( AdminPage );


// EXPORTS //

export default VisibleAdminPage;
