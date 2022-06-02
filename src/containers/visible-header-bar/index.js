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
import HeaderBar from 'components/header-bar';
import { getCohorts } from 'actions/cohort';
import { getLessons } from 'actions/lesson';
import { changedNamespace } from 'actions/namespace';
import { logoutInjector, userUpdateCheckInjector } from 'actions/user';
import { setLessonOrderInjector, setSearchPhraseInjector, setLessonOrderDirInjector } from 'actions/search';


// EXPORTS //

export default connect( mapStateToProps, mapDispatchToProps )( HeaderBar );

function mapStateToProps( state ) {
	return {
		user: state.user,
		namespace: state.namespace,
		search: state.search
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		userUpdateCheck: userUpdateCheckInjector( dispatch ),
		logout: logoutInjector( dispatch ),
		setSearchPhrase: setSearchPhraseInjector( dispatch ),
		setLessonOrder: setLessonOrderInjector( dispatch ),
		setLessonOrderDirection: setLessonOrderDirInjector( dispatch ),
		onEnrolledNamespace: ({ title, description, announcements, enableTicketing, owners, _id }) => {
			dispatch( changedNamespace({
				title, description, announcements, enableTicketing, owners, _id
			}) );
			const namespaceName = title;
			getLessons( dispatch, namespaceName );
		},
		onNamespace: ({ title, description, announcements, enableTicketing, owners, completions, _id }) => {
			dispatch( changedNamespace({ title, description, announcements, enableTicketing, owners, completions, _id }) );
			if ( _id ) {
				getCohorts( dispatch, { namespaceID: _id });
			}
			getLessons( dispatch, title );
		}
	};
}
