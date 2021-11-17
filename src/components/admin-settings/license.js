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
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import FormLabel from 'react-bootstrap/FormLabel';
import FormGroup from 'react-bootstrap/FormGroup';
import Badge from 'react-bootstrap/Badge';
import isDateObject from '@stdlib/assert/is-date-object';
import useMountEffect from 'hooks/use-mount-effect';
import ConfirmModal from 'components/confirm-modal';


// FUNCTIONS //

/**
 * A component which displays the license information.
 *
 * @param {Object} props - component properties
 * @param {Object} props.admin - admin object
 * @param {Object} props.t - i18next translation function
 * @param {Function} props.onRemove - callback to remove the license
 * @returns {ReactElement} component
 */
const LicenseInformation = ( props ) => {
	const { admin, t } = props;
	const license = admin.license;
	if ( !license || !license.valid ) {
		return (
			<div
				className="jumbotron"
				style={{
					width: '100%',
					height: '73.7%'
				}}
			>
				<h3 style={{ textAlign: 'center', marginTop: '12%' }}>
					{t('no-license-found')}
				</h3>
			</div>
		);
	}
	let usersInTrial;
	if ( license.trialPeriod > 0 ) {
		usersInTrial = 0;
		for ( let i = 0; i < admin.users.length; i++ ) {
			const user = admin.users[ i ];
			const trialLength = new Date();
			const createdAt = isDateObject( user.createdAt ) ? user.createdAt : new Date( user.createdAt );
			trialLength.setDate( trialLength.getDate() - license.trialPeriod );
			if ( createdAt >= trialLength ) {
				usersInTrial += 1;
			}
		}
	}
	const nUsers = admin.users.length > 0 ? admin.users.length : admin.statistics.nUsers;
	const tooManyUsers = license.maxUsers < nUsers;
	const tooManyInstructors = license.maxInstructors < admin.statistics.nInstructors;
	return (
		<Fragment>
			<h1>
				{t('your-license')}:
				<span style={{ marginLeft: 12 }}>{license.type}</span>
			</h1>
			<Table bordered >
				<tbody>
					<tr>
						<td colSpan="2" className="title" >{t('registration-information')}:</td>
						<td style={{ background: tooManyUsers ? 'lightcoral': 'white' }} >
							<div className="title">{t('number-of-seats')}</div>
							{license.maxUsers}
						</td>
						<td style={{ background: tooManyUsers ? 'lightcoral': 'white' }} >
							<div className="title">{t('active-users')}</div>
							{admin.users.length > 0 ? admin.users.length : admin.statistics.nUsers}
						</td>
					</tr>
					<tr>
						<td colSpan="2"></td>
						<td style={{ background: tooManyInstructors ? 'lightcoral': 'white' }} >
							<div className="title">{t('number-of-instructors')}</div>
							{license.maxInstructors}
						</td>
						<td style={{ background: tooManyInstructors ? 'lightcoral': 'white' }} >
							<div className="title">{t('active-instructors')}</div>
							{admin.statistics.nInstructors}
						</td>
					</tr>
					<tr>
						<td colSpan="2"></td>
						<td>
							<div className="title">{t('user-trial-period')}</div>
							{license.trialPeriod} {t('days')}
						</td>
						<td>
							<div className="title">{t('users-currently-in-trial')}</div>
							{usersInTrial}
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
						<td style={{ background: license.endDate < new Date() ? 'lightcoral': 'white' }} >
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
							{license.organization}
						</td>
					</tr>
				</tbody>
			</Table>
			<Button variant="danger" size="sm" onClick={props.onRemove} >
				{t('remove-license')}
			</Button>
		</Fragment>
	);
};


// MAIN //

/**
 * A component for viewing the current instance license.
 *
 * @param {Object} props - component properties
 * @param {Object} props.admin - instance admin data
 * @param {Function} props.getLicense - function for getting the current license
 * @param {Function} props.getUsers - function for getting the current users
 * @param {Function} props.removeLicense - function for removing the current license
 * @param {Function} props.uploadLicense - function for uploading a new license
 * @param {Object} props.user - user data
 * @returns {ReactElement} component
 */
const LicensePage = ( props ) => {
	const [ showDeleteModal, setShowDeleteModal ] = useState( false );
	const { t } = useTranslation( [ 'admin', 'common' ] );
	useMountEffect( () => {
		props.getLicense( props.user );
		if ( props.admin.users.length === 0 ) {
			props.getUsers();
		}
	});
	const handleUpload = ( event ) => {
		const file = event.target.files[ 0 ];
		const formData = new FormData();
		formData.append( 'license', file, file.name );
		props.uploadLicense({
			formData,
			user: props.user
		});
	};
	const toggleDeleteModal = () => {
		setShowDeleteModal( !showDeleteModal );
	};
	const handleRemoval = () => {
		toggleDeleteModal();
		props.removeLicense();
	};
	return (
		<div className="admin-settings-outer-container" >
			<FormGroup className="license-upload-button" >
				<FormLabel htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
					<h2><Badge bg="secondary" >{t('upload-new-license')}</Badge></h2>
					<input
						id="fileUpload"
						type="file"
						accept=".isle-license"
						onChange={handleUpload}
						style={{ display: 'none' }}
					/>
				</FormLabel>
			</FormGroup>
			<LicenseInformation admin={props.admin} t={t} onRemove={toggleDeleteModal} />
			{ showDeleteModal ? <ConfirmModal
				title={t('remove-license')}
				message={t('remove-license-confirm')}
				close={toggleDeleteModal}
				show={showDeleteModal}
				onConfirm={handleRemoval}
			/> : null }
		</div>
	);
};


// PROPERTIES //

LicensePage.propTypes = {
	admin: PropTypes.object.isRequired,
	getLicense: PropTypes.func.isRequired,
	getUsers: PropTypes.func.isRequired,
	removeLicense: PropTypes.func.isRequired,
	uploadLicense: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default LicensePage;
