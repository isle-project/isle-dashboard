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
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import round from '@stdlib/math/base/special/round';
import ConfirmModal from 'components/confirm-modal';
import server from 'constants/server';


// MAIN //

class BackupsPage extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			selectedBackup: null,
			showDeleteModal: false
		};
	}

	componentDidMount() {
		this.props.getBackups();
	}

	handleBackupCreation = () => {
		this.props.createBackup();
	};

	askToDeleteSelectedBackupFactory = ( backup ) => {
		return () => {
			this.setState({
				showDeleteModal: !this.state.showDeleteModal,
				selectedBackup: backup
			});
		};
	};

	deleteSelectedBackup= () => {
		this.setState({
			showDeleteModal: false
		}, async () => {
			await this.props.deleteBackup( this.state.selectedBackup._id );
		});
	};

	toggleDeleteModal = () => {
		this.setState({
			showDeleteModal: !this.state.showDeleteModal
		});
	};

	renderBackupList() {
		if ( !this.props.admin.backups ) {
			return null;
		}
		const { t } = this.props;
		return (
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>{t('common:filename')}</th>
						<th>{t('common:size')}</th>
						<th>{t('common:date')}</th>
						<th>{t('common:actions')}</th>
					</tr>
				</thead>
				<tbody>
					{this.props.admin.backups.map( ( x, idx ) => {
					if ( !x ) {
						return null;
					}
					const size = round( x.size / ( 1024 * 1024 ) );
					return (
						<tr key={idx} >
							<td>{x.filename}</td>
							<td>{`${size} MB`}</td>
							<td>{x.createdAt}</td>
							<td>
								<a aria-label={t('download-backup')} href={`${server}/${x.filename}`} target="_blank" rel="noopener noreferrer" >
									<OverlayTrigger placement="bottom" overlay={<Tooltip id="download-backup-tooltip">{t('download-backup')}</Tooltip>}>
										<Button aria-label={t('download-backup')} size="sm" variant="secondary" style={{ marginRight: 8 }} >
											<i className="fas fa-cloud-download-alt" ></i>
										</Button>
									</OverlayTrigger>
								</a>
								<OverlayTrigger placement="bottom" overlay={<Tooltip id="delete-backup-tooltip">{t('delete-backup')}</Tooltip>}>
									<Button aria-label={t('delete-backup')} size="sm" variant="danger" onClick={this.askToDeleteSelectedBackupFactory( x )} >
										<i className="fas fa-trash-alt" ></i>
									</Button>
								</OverlayTrigger>
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
			<Fragment>
				<div className="admin-settings-outer-container" >
					<h1>{t('created-backups')}</h1>
					{this.renderBackupList()}
					<Button size="lg" onClick={this.handleBackupCreation} >
						<i className="fas fa-cloud-upload-alt" style={{ marginRight: 12 }}></i>
						{t('create-backup')}
					</Button>
				</div>
				{ this.state.showDeleteModal ? <ConfirmModal
					title={t('delete-backup')}
					message={<div>
						<p>{t('delete-backup-confirm')}</p>
						<span style={{ color: 'red' }}>{this.state.selectedBackup.filename}</span>
					</div>}
					close={this.toggleDeleteModal}
					show={this.state.showDeleteModal}
					onConfirm={this.deleteSelectedBackup}
				/> : null }
			</Fragment>
		);
	}
}


// PROPERTIES //

BackupsPage.propTypes = {
	admin: PropTypes.object.isRequired,
	createBackup: PropTypes.func.isRequired,
	deleteBackup: PropTypes.func.isRequired,
	getBackups: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin_settings', 'common' ] )( BackupsPage );
