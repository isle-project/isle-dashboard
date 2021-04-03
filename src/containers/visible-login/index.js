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
import Login from 'components/login';
import { fetchCredentialsInjector } from 'actions/authentication';
import { getEnrollableCohortsInjector } from 'actions/cohort';
import { handleLoginInjector, restoreLoginInjector } from 'actions/user';


// FUNCTIONS //

function mapStateToProps( state ) {
	return {
		user: state.user,
		settings: state.settings
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		handleLogin: handleLoginInjector( dispatch ),
		restoreLogin: restoreLoginInjector( dispatch ),
		fetchCredentials: fetchCredentialsInjector( dispatch ),
		getEnrollableCohorts: getEnrollableCohortsInjector( dispatch )
	};
}


// MAIN //

const VisibleLogin = connect( mapStateToProps, mapDispatchToProps )( Login );


// EXPORTS //

export default VisibleLogin;
