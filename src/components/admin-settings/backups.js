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
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { withTranslation } from 'react-i18next';
import round from '@stdlib/math/base/special/round';
import server from 'constants/server';


// MAIN //

class BackupsPage extends Component {
	constructor( props ) {
		super( props );
	}

	componentDidMount() {
		this.props.getBackups();
	}

	handleBackupCreation = () => {
		this.props.createBackup();
	}

	handleBackupDeletion = () => {

	}

	renderBackupList() {
		if ( !this.props.admin.backups ) {
			return null;
		}
		return (
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Filename</th>
						<th>Size</th>
						<th>Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{this.props.admin.backups.map( ( x, idx ) => {
					const size = round( x.size / ( 1024 * 1024 ) );
					return (
						<tr key={idx} >
							<td>{x.filename}</td>
							<td>{`${size} MB`}</td>
							<td>{x.createdAt}</td>
							<td>
								<a href={`${server}/${x.filename}`} target="_blank" >
									<Button size="sm" variant="secondary" style={{ marginRight: 8 }} >
										<i className="fas fa-cloud-download-alt" ></i>
									</Button>
									<Button size="sm" variant="danger" onClick={this.handleBackupDeletion} >
										<i className="fas fa-trash-alt" ></i>
									</Button>
								</a>
							</td>
						</tr>
					);
					})}
				</tbody>
			</Table>
		);
	}

	render() {
		const { t } = this.props;
		return (
			<div className="admin-settings-outer-container" >
				<h1>{t('created-backups')}</h1>
				{this.renderBackupList()}
				<Button size="lg" onClick={this.handleBackupCreation} >
					<i className="fas fa-cloud-upload-alt" style={{ marginRight: 12 }}></i>
					{t('create-backup')}
				</Button>
			</div>
		);
	}
}


// PROPERTIES //

BackupsPage.propTypes = {
	admin: PropTypes.object.isRequired,
	createBackup: PropTypes.func.isRequired,
	getBackups: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin_settings', 'common' ] )( BackupsPage );
