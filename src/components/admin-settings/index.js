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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Nav from 'react-bootstrap/Nav';
import asyncComponent from 'components/async';
const Configuration = asyncComponent( () => import( './configuration.js' ) );
const License = asyncComponent( () => import( './license.js' ) );
const Backups = asyncComponent( () => import( './backups.js' ) );
const Roles = asyncComponent( () => import( './roles.js' ) );
import UserFields from 'ev/components/admin-settings/user-fields';
import Branding from 'ev/components/admin-settings/branding';
import './admin_settings.css';


// MAIN //

class Settings extends Component {
	constructor( props ) {
		super( props );

		const subpage = props.match.params.subpage;
		let activePage;
		switch ( subpage ) {
			default:
			case 'license':
				activePage = 0;
				break;
			case 'configuration':
				activePage = 1;
				break;
			case 'branding':
				activePage = 2;
				break;
			case 'credentials':
				activePage = 3;
				break;
			case 'badges':
				activePage = 4;
				break;
			case 'user-fields':
				activePage = 5;
				break;
			case 'backups':
				activePage = 6;
				break;
		}
		this.state = {
			activePage
		};
	}

	handleSelect = ( selectedKey ) => {
		selectedKey = Number( selectedKey );
		const { history } = this.props;
		switch ( selectedKey ) {
			case 0:
				history.replace( '/admin/settings/license' );
				break;
			case 1:
				history.replace( '/admin/settings/configuration' );
				break;
			case 2:
				history.replace( '/admin/settings/branding' );
				break;
			case 3:
				history.replace( '/admin/settings/credentials' );
				break;
			case 4:
				history.replace( '/admin/settings/badges' );
				break;
			case 5:
				history.replace( '/admin/settings/user-fields' );
				break;
			case 6:
				history.replace( '/admin/settings/backups' );
				break;
		}
		this.setState({
			activePage: selectedKey
		});
	}

	renderPage() {
		switch ( this.state.activePage ) {
			case 0:
				return ( <License
					admin={this.props.admin}
					uploadLicense={this.props.uploadLicense}
					getLicense={this.props.getLicense}
					user={this.props.user}
					removeLicense={this.props.removeLicense}
					getUsers={this.props.getUsers}
				/> );
			case 1:
				return (
					<Configuration
						admin={this.props.admin}
						user={this.props.user}
						getSettings={this.props.getSettings}
						updateSettings={this.props.updateSettings}
					/>
				);
			case 2:
				return (
					<Branding />
				);
			case 3:
				return (
					<Roles
						admin={this.props.admin}
						createRole={this.props.createRole}
						getAllRoles={this.props.getAllRoles}
						deleteRole={this.props.deleteRole}
					/>
				);
			case 4:
				return (
					<div>BADGES</div>
				);
			case 5:
				return (
					<UserFields
						admin={this.props.admin}
						user={this.props.user}
						createCustomField={this.props.createCustomField}
						deleteCustomField={this.props.deleteCustomField}
						getCustomFields={this.props.getCustomFields}
						incrementFieldPosition={this.props.incrementFieldPosition}
						decrementFieldPosition={this.props.decrementFieldPosition}
					/>
				);
			case 6:
				return (
					<Backups
						admin={this.props.admin}
						user={this.props.user}
						createBackup={this.props.createBackup}
						getBackups={this.props.getBackups}
						deleteBackup={this.props.deleteBackup}
					/>
				);
		}
	}

	render() {
		const page = this.renderPage();
		const { t } = this.props;
		return (
			<div className="admin-settings-div" >
				<div className="admin-settings-navbar" >
					<Nav variant="pills" activeKey={this.state.activePage} onSelect={this.handleSelect}>
						<Nav.Item>
							<Nav.Link eventKey="0" title="License" >{t('license')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="1" title="Configuration" >{t('configuration')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="2" title="Branding" >{t('branding')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="3" title="Roles" >{t('roles')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link disabled eventKey="4" title="Badges" >{t('common:badges')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="5" title="User Fields" >{t('user-fields')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="6" title="Backups" >{t('backups')}</Nav.Link>
						</Nav.Item>
					</Nav>
				</div>
				<div className="admin-settings-container" >
					{page}
				</div>
			</div>
		);
	}
}

// PROPERTIES //

Settings.propTypes = {
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
	incrementFieldPosition: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	removeLicense: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
	updateSettings: PropTypes.func.isRequired,
	uploadLicense: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin_settings', 'common' ] )( Settings );
