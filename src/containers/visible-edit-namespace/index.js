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
import EditNamespace from 'components/edit-namespace';
import { createCohortInjector, deleteCohortInjector, updateCohortInjector } from 'actions/cohort';
import { deleteCurrentNamespaceInjector, updateCurrentNamespaceInjector } from 'actions/namespace';
import { addNotificationInjector } from 'actions/notification';
import { copyNamespaceLessonsInjector } from 'actions/lesson';
import { saveLessonMetricsInjector, computeCompletionsInjector } from 'actions/completions';


// FUNCTIONS //

function mapStateToProps( state ) {
	return {
		user: state.user,
		namespace: state.namespace,
		cohorts: state.namespace.cohorts,
		settings: state.settings
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		addNotification: addNotificationInjector( dispatch ),
		createCohort: createCohortInjector( dispatch ),
		deleteCohort: deleteCohortInjector( dispatch ),
		updateCohort: updateCohortInjector( dispatch ),
		deleteCurrentNamespace: deleteCurrentNamespaceInjector( dispatch ),
		updateCurrentNamespace: updateCurrentNamespaceInjector( dispatch ),
		copyNamespaceLessons: copyNamespaceLessonsInjector( dispatch ),
		computeCompletions: computeCompletionsInjector( dispatch ),
		saveLessonMetrics: saveLessonMetricsInjector( dispatch )
	};
}


// MAIN //

const VisibleEditNamespace = connect( mapStateToProps, mapDispatchToProps )( EditNamespace );


// EXPORTS //

export default VisibleEditNamespace;
