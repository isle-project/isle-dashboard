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
import AdminSettings from 'components/admin-settings';
import { getUsersInjector } from 'actions/user.js';
import { addNotificationInjector } from 'actions/notification.js';
import { getLicenseInjector, uploadLicenseInjector, removeLicenseInjector, uploadLogoInjector } from 'actions/file.js';
import { createCustomFieldInjector, deleteCustomFieldInjector, getCustomFieldsInjector,
	decrementFieldPositionInjector, incrementFieldPositionInjector } from 'actions/custom_field.js';
import { createBackupInjector, deleteBackupInjector, getBackupsInjector } from 'actions/backup.js';
import { getSettingsInjector, updateSettingsInjector } from 'actions/settings.js';
import { createRoleInjector, deleteRoleInjector, getAllRolesInjector, updateRoleInjector } from 'actions/role.js';


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
		getAllRoles: getAllRolesInjector( dispatch ),
		getBackups: getBackupsInjector( dispatch ),
		getUsers: getUsersInjector( dispatch ),
		createBackup: createBackupInjector( dispatch ),
		createCustomField: createCustomFieldInjector( dispatch ),
		createRole: createRoleInjector( dispatch ),
		deleteBackup: deleteBackupInjector( dispatch ),
		deleteRole: deleteRoleInjector( dispatch ),
		deleteCustomField: deleteCustomFieldInjector( dispatch ),
		getCustomFields: getCustomFieldsInjector( dispatch ),
		getLicense: getLicenseInjector( dispatch ),
		getSettings: getSettingsInjector( dispatch ),
		uploadLogo: uploadLogoInjector( dispatch ),
		updateRole: updateRoleInjector( dispatch ),
		updateSettings: updateSettingsInjector( dispatch ),
		uploadLicense: uploadLicenseInjector( dispatch ),
		removeLicense: removeLicenseInjector( dispatch ),
		incrementFieldPosition: incrementFieldPositionInjector( dispatch ),
		decrementFieldPosition: decrementFieldPositionInjector( dispatch )
	};
}


// MAIN //

const VisibleAdminSettings = connect( mapStateToProps, mapDispatchToProps )( AdminSettings );


// EXPORTS //

export default VisibleAdminSettings;
