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
import ReactTable from 'react-table';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ConfirmModal from 'components/confirm-modal';
import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';
import server from 'constants/server';
import 'react-table/react-table.css';


// MAIN //

class UserPage extends Component {
	constructor( props ) {
		super( props );
		this.columns = this.createColumns();

		this.state = {
			showDeleteModal: false,
			deletedUser: null
		};
	}

	toggleDeleteModal = () => {
		this.setState({
			showDeleteModal: !this.state.showDeleteModal
		});
	}

	deleteSelectedUser = () => {
		console.log( `Delete user ${this.state.deletedUser.name} with id ${this.state.deletedUser._id}` );
		this.props.deleteUser({
			id: this.state.deletedUser._id,
			token: this.props.user.token
		});
	}

	askToDeleteSelectedUserFactory = ( user ) => {
		return () => {
			this.setState({
				showDeleteModal: !this.state.showDeleteModal,
				deletedUser: user
			});
		};
	}

	createColumns = () => {
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
				Header: 'Name',
				id: 'name',
				accessor: 'name',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' },
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			},
			{
				Header: 'Email',
				accessor: 'email',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' },
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			},
			{
				Header: 'Organization',
				accessor: 'organization',
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 200
			},
			{
				Header: 'Last Updated',
				accessor: 'updatedAt',
				Cell: ( row ) => {
					return new Date( row.value ).toLocaleString();
				},
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 150
			},
			{
				Header: 'Created At',
				accessor: 'createdAt',
				Cell: ( row ) => {
					return new Date( row.value ).toLocaleString();
				},
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 150
			},
			{
				Header: 'Actions',
				Cell: ( row ) => {
					console.log( row.row );
					if ( row.row.email === this.props.user.email ) {
						return null;
					}
					return ( <div>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="edit_user_data">Edit User Data</Tooltip>}>
							<Button
								variant="outline-secondary"
							>
								<div className="fa fa-edit" />
							</Button>
						</OverlayTrigger>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="impersonate_user">Impersonate User</Tooltip>}>
							<Button
								variant="outline-secondary"
								style={{ marginLeft: 8 }}
							>
								<div className="fa fa-theater-masks" />
							</Button>
						</OverlayTrigger>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="delete_user">Delete User</Tooltip>}>
							<Button
								variant="outline-secondary"
								style={{ marginLeft: 8 }}
								onClick={this.askToDeleteSelectedUserFactory( row.row._original )}
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
				{ this.state.showDeleteModal ? <ConfirmModal
					title="Delete User"
					message={<span>Are you sure you want to delete the user <span style={{ color: 'red' }}>{this.state.deletedUser.name}</span>?</span>}
					close={this.toggleDeleteModal}
					show={this.state.showDeleteModal}
					onDelete={this.deleteSelectedUser}
				/> : null }
			</Fragment>
		);
	}
}


// PROPERTIES //

UserPage.propTypes = {
	admin: PropTypes.object.isRequired
};


// EXPORTS //

export default UserPage;
