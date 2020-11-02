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

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import FormLabel from 'react-bootstrap/FormLabel';
import FormGroup from 'react-bootstrap/FormGroup';
import Badge from 'react-bootstrap/Badge';
import ConfirmModal from 'components/confirm-modal';


// MAIN //

class LicensePage extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showDeleteModal: false
		};
	}

	componentDidMount() {
		this.props.getLicense( this.props.user );
	}

	handleUpload = ( event ) => {
		const file = event.target.files[ 0 ];
		const formData = new FormData();
		formData.append( 'license', file, file.name );
		this.props.uploadLicense({
			formData,
			user: this.props.user
		});
	}

	handleRemoval = () => {
		this.toggleDeleteModal();
		this.props.removeLicense();
	}

	toggleDeleteModal = () => {
		this.setState({
			showDeleteModal: !this.state.showDeleteModal
		});
	}

	renderLicenseInformation() {
		const { admin, t } = this.props;
		const license = admin.license;
		if ( !license || !license.valid ) {
			return (
				<Jumbotron
					style={{
						width: '100%',
						height: '73.7%'
					}}
				>
					<h3 style={{ textAlign: 'center', marginTop: '12%' }}>
						{t('no-license-found')}
					</h3>
				</Jumbotron>
			);
		}
		return (
			<Fragment>
				<Table bordered >
					<tbody>
						<tr>
							<td colSpan="2" className="title" >{t('registration-information')}:</td>
							<td>
								<div className="title">{t('number-of-seats')}</div>
								{license.maxUsers}
							</td>
							<td>
								<div className="title">{t('registered-users')}</div>
								{admin.users.length > 0 ? admin.users.length : admin.statistics.nUsers}
							</td>
						</tr>
						<tr>
							<td colSpan="2" className="title" >
								{t('validity-period')}:
							</td>
							<td>
								<div className="title">{t('start-date')}</div>
								{license.startDate}
							</td>
							<td>
								<div className="title">{t('end-date')}</div>
								{license.endDate}
							</td>
						</tr>
						<tr>
							<td>
								<div className="title">{t('licensed-to')}:</div>
							</td>
							<td>
								<div className="title">{t('common:name')}</div>
								{license.name}
							</td>
							<td>
								<div className="title">{t('common:email-address')}</div>
								{license.email}
							</td>
							<td>
								<div className="title">{t('common:organization')}</div>
								{license.company}
							</td>
						</tr>
					</tbody>
				</Table>
				<Button variant="danger" size="sm" onClick={this.toggleDeleteModal} >
					{t('remove-license')}
				</Button>
			</Fragment>
		);
	}

	render() {
		const { t } = this.props;
		return (
			<div className="admin-outer-container" >
				<FormGroup className="license-upload-button" >
					<FormLabel htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
						<h2><Badge variant="secondary" >{t('upload-new-license')}</Badge></h2>
						<input
							id="fileUpload"
							type="file"
							accept=".isle-license"
							onChange={this.handleUpload}
							style={{ display: 'none' }}
						/>
					</FormLabel>
				</FormGroup>
				<h1>{t('your-license')}</h1>
				{this.renderLicenseInformation()}
				{ this.state.showDeleteModal ? <ConfirmModal
					title={t('remove-license')}
					message={t('remove-license-confirm')}
					close={this.toggleDeleteModal}
					show={this.state.showDeleteModal}
					onConfirm={this.handleRemoval}
				/> : null }
			</div>
		);
	}
}


// PROPERTIES //

LicensePage.propTypes = {
	admin: PropTypes.object.isRequired,
	getLicense: PropTypes.func.isRequired,
	removeLicense: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
	uploadLicense: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( LicensePage );
