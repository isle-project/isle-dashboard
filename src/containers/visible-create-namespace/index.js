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
import CreateNamespace from 'components/create-namespace';
import { changedNamespace, createNamespaceInjector } from 'actions/namespace';
import { addNotificationInjector } from 'actions/notification';
import { retrievedLessons } from 'actions/lesson';


// FUNCTIONS //

function mapStateToProps( state ) {
	return {
		user: state.user
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		createNamespace: createNamespaceInjector( dispatch ),
		addNotification: addNotificationInjector( dispatch ),
		onNamespace: ({ title, description, announcements, owners, enableTicketing, _id }) => {
			dispatch( changedNamespace({ title, description, announcements, enableTicketing, owners, _id }) );
			dispatch( retrievedLessons({ lessons: [], namespaceName: title }) );
		}
	};
}


// MAIN //

const VisibleCreateNamespace = connect( mapStateToProps, mapDispatchToProps )( CreateNamespace );


// EXPORTS //

export default VisibleCreateNamespace;
