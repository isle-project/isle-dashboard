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
import logger from 'debug';
import { withTranslation } from 'react-i18next';
import ReactTable from 'react-table';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ConfirmModal from 'components/confirm-modal';
import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';
import server from 'constants/server';
import 'react-table/react-table.css';


// VARIABLES //

const debug = logger( 'isle-dashboard:admin' );


// MAIN //

class UserPage extends Component {
	constructor( props ) {
		super( props );
		this.columns = this.createColumns();

		this.state = {
			selectedUser: null,
			showDeleteModal: false,
			showImpersonateModal: false,
			password: ''
		};
	}

	toggleImpersonateModal = () => {
		this.setState({
			showImpersonateModal: !this.state.showImpersonateModal
		});
	}

	toggleDeleteModal = () => {
		this.setState({
			showDeleteModal: !this.state.showDeleteModal
		});
	}

	impersonateUser = () => {
		this.setState({
			showImpersonateModal: false
		}, () => {
			this.props.impersonateUser({
				id: this.state.selectedUser._id,
				password: this.state.password
			});
		});
	}

	deleteSelectedUser = () => {
		debug( `Delete user ${this.state.selectedUser.name} with id ${this.state.selectedUser._id}` );
		this.setState({
			showDeleteModal: false
		}, () => {
			this.props.deleteUser({
				id: this.state.selectedUser._id
			});
		});
	}

	askToImpersonateSelectedUserFactory = ( user ) => {
		return () => {
			this.setState({
				showImpersonateModal: !this.state.showImpersonateModal,
				selectedUser: user
			});
		};
	}

	askToDeleteSelectedUserFactory = ( user ) => {
		return () => {
			this.setState({
				showDeleteModal: !this.state.showDeleteModal,
				selectedUser: user
			});
		};
	}

	handlePassword = ( event ) => {
		this.setState({
			password: event.target.value
		});
	}

	createColumns = () => {
		const { t } = this.props;
		return [
			{
				Header: 'Pic',
				accessor: 'picture',
				Cell: row => (
					<img className="table-pic" src={`${server}/thumbnail/${row.original.picture}`} alt="Profile Pic" />
				),
				maxWidth: 46,
				minWidth: 46,
				filterable: false,
				resizable: false,
				sortable: false,
				style: { color: 'darkslategrey' }
			},
			{
				Header: t('common:name'),
				id: 'name',
				accessor: 'name',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' },
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			},
			{
				Header: t('common:email'),
				accessor: 'email',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' },
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			},
			{
				Header: t('common:organization'),
				accessor: 'organization',
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 200
			},
			{
				Header: t( 'instructor' ),
				accessor: 'writeAccess',
				style: { marginTop: '2px', color: 'darkslategrey', fontSize: 24, textAlign: 'center' },
				Cell: ( row ) => {
					if ( row.value ) {
						return <i className="far fa-check-square"></i>;
					}
					return null;
				},
				maxWidth: 80
			},
			{
				Header: t( 'admin' ),
				accessor: 'administrator',
				style: { marginTop: '2px', color: 'darkslategrey', fontSize: 24, textAlign: 'center' },
				Cell: ( row ) => {
					if ( row.value ) {
						return <i className="far fa-check-square"></i>;
					}
					return null;
				},
				maxWidth: 60
			},
			{
				Header: t('last-updated'),
				accessor: 'updatedAt',
				Cell: ( row ) => {
					return new Date( row.value ).toLocaleString();
				},
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 150
			},
			{
				Header: t('created-at'),
				accessor: 'createdAt',
				Cell: ( row ) => {
					return new Date( row.value ).toLocaleString();
				},
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 150
			},
			{
				Header: t('common:actions'),
				Cell: ( row ) => {
					if ( row.row.email === this.props.user.email ) {
						return null;
					}
					return ( <div>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="edit_user_data">{t('edit-user-data')}</Tooltip>}>
							<Button
								variant="outline-secondary"
								aria-label={t('edit-user-data')}
							>
								<div className="fa fa-edit" />
							</Button>
						</OverlayTrigger>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="impersonate_user">{t('impersonate-user')}</Tooltip>}>
							<Button
								variant="outline-secondary"
								style={{ marginLeft: 8 }}
								onClick={this.askToImpersonateSelectedUserFactory( row.row._original )}
								aria-label={t('impersonate-user')}
							>
								<div className="fa fa-theater-masks" />
							</Button>
						</OverlayTrigger>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="delete_user">{t('delete-user')}</Tooltip>}>
							<Button
								variant="outline-secondary"
								style={{ marginLeft: 8 }}
								onClick={this.askToDeleteSelectedUserFactory( row.row._original )}
								aria-label={t('delete-user')}
							>
								<div className="fa fa-trash-alt" />
							</Button>
						</OverlayTrigger>
					</div> );
				}
			}
		];
	}

	render() {
		const { t } = this.props;
		return (
			<Fragment>
				<ReactTable
					filterable
					data={this.props.admin.users}
					columns={this.columns}
					ref={(r) => {
						this.reactTable = r;
					}}
				/>
				{ this.state.showImpersonateModal ? <ConfirmModal
					title={t('impersonate-user')}
					message={<span>
						{t('enter-password')}<span style={{ color: 'red' }}>{this.state.selectedUser.name}</span>.{t('automatic-logout')}
						<FormControl
							name="password"
							type="password"
							placeholder={t('password-placeholder')}
							onChange={this.handlePassword}
							maxLength={30}
							minLength={6}
							style={{ marginTop: 8 }}
						/>
					</span>}
					close={this.toggleImpersonateModal}
					show={this.state.showImpersonateModal}
					onConfirm={this.impersonateUser}
				/> : null }
				{ this.state.showDeleteModal ? <ConfirmModal
					title={t('delete-user')}
					message={<span>{t('delete-user-confirm')}<span style={{ color: 'red' }}>{this.state.selectedUser.name}</span>?</span>}
					close={this.toggleDeleteModal}
					show={this.state.showDeleteModal}
					onConfirm={this.deleteSelectedUser}
				/> : null }
			</Fragment>
		);
	}
}


// PROPERTIES //

UserPage.propTypes = {
	admin: PropTypes.object.isRequired,
	deleteUser: PropTypes.func.isRequired,
	impersonateUser: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( UserPage );
