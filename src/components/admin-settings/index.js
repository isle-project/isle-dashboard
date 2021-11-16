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

import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigate, Route, Routes } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import asyncComponent from 'components/async';
const Configuration = asyncComponent( () => import( './configuration.js' ) );
const License = asyncComponent( () => import( './license.js' ) );
const Backups = asyncComponent( () => import( './backups.js' ) );
const Roles = asyncComponent( () => import( './roles.js' ) );
import UserFields from 'ev/components/admin-settings/user-fields';
import Branding from 'ev/components/admin-settings/branding';
import Texts from 'ev/components/admin-settings/texts';
import './admin_settings.css';


// MAIN //

const Settings = ( props ) => {
	const [ activePage, setActivePage ] = useState( window.location.pathname );
	const { t } = useTranslation( [ 'admin_settings', 'common' ] );
	const navigate = useNavigate();
	const handleSelect = ( selectedKey ) => {
		navigate( selectedKey );
		setActivePage( selectedKey );
	};
	return (
		<Fragment>
			<div className="admin-settings-navbar" >
				<Nav variant="pills" activeKey={activePage} onSelect={handleSelect}>
					<Nav.Item>
						<Nav.Link eventKey="/admin/settings/license" title="License" >{t('license')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="/admin/settings/configuration" title="Configuration" >{t('configuration')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="/admin/settings/branding" title="Branding" >{t('branding')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="/admin/settings/texts" title="Texts" >{t('common:texts')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="/admin/settings/credentials" title="Roles" >{t('roles')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link disabled eventKey="/admin/settings/badges" title="Badges" >{t('common:badges')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="/admin/settings/user-fields" title="User Fields" >{t('user-fields')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="/admin/settings/backups" title="Backups" >{t('backups')}</Nav.Link>
					</Nav.Item>
				</Nav>
			</div>
			<Routes>
				<Route path="license" element={<License
					admin={props.admin}
					uploadLicense={props.uploadLicense}
					getLicense={props.getLicense}
					user={props.user}
					removeLicense={props.removeLicense}
					getUsers={props.getUsers} />}
				/>
				<Route path="configuration" element={<Configuration
					admin={props.admin}
					user={props.user}
					getSettings={props.getSettings}
					updateSettings={props.updateSettings} />}
				/>
				<Route path="branding" element={<Branding
					admin={props.admin}
					user={props.user}
					uploadLogo={props.uploadLogo}
					updateSettings={props.updateSettings} />}
				/>
				<Route path="texts" element={<Texts
					addCustomTranslation={props.addCustomTranslation}
					translations={props.translations}
					removeCustomTranslation={props.removeCustomTranslation} />}
				/>
				<Route path="credentials" element={<Roles
					admin={props.admin}
					createRole={props.createRole}
					getAllRoles={props.getAllRoles}
					deleteRole={props.deleteRole}
					updateRole={props.updateRole} />}
				/>
				<Route path="user-fields" element={<UserFields
					admin={props.admin}
					user={props.user}
					createCustomField={props.createCustomField}
					deleteCustomField={props.deleteCustomField}
					getCustomFields={props.getCustomFields}
					incrementFieldPosition={props.incrementFieldPosition}
					decrementFieldPosition={props.decrementFieldPosition} />}
				/>
				<Route path="backups" element={<Backups
					admin={props.admin}
					user={props.user}
					createBackup={props.createBackup}
					getBackups={props.getBackups}
					deleteBackup={props.deleteBackup} />}
				/>
			</Routes>
		</Fragment>
	);
};


// PROPERTIES //

Settings.propTypes = {
	addCustomTranslation: PropTypes.func.isRequired,
	admin: PropTypes.object.isRequired,
	createBackup: PropTypes.func.isRequired,
	createCustomField: PropTypes.func.isRequired,
	createRole: PropTypes.func.isRequired,
	decrementFieldPosition: PropTypes.func.isRequired,
	deleteBackup: PropTypes.func.isRequired,
	deleteCustomField: PropTypes.func.isRequired,
	deleteRole: PropTypes.func.isRequired,
	getAllRoles: PropTypes.func.isRequired,
	getBackups: PropTypes.func.isRequired,
	getCustomFields: PropTypes.func.isRequired,
	getLicense: PropTypes.func.isRequired,
	getSettings: PropTypes.func.isRequired,
	getUsers: PropTypes.func.isRequired,
	incrementFieldPosition: PropTypes.func.isRequired,
	removeCustomTranslation: PropTypes.func.isRequired,
	removeLicense: PropTypes.func.isRequired,
	translations: PropTypes.object.isRequired,
	updateRole: PropTypes.func.isRequired,
	updateSettings: PropTypes.func.isRequired,
	uploadLicense: PropTypes.func.isRequired,
	uploadLogo: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default Settings;
