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

import React, { Component, Fragment, useState } from 'react';
import { withTranslation } from 'react-i18next';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FormLabel from 'react-bootstrap/FormLabel';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SelectInput from 'react-select';
import SearchBar from 'components/searchbar';
import PERMISSIONS from './permissions.json';


// VARIABLES //

const SEARCH_CONTEXT = [
	{
		label: 'course',
		value: 'course'
	},
	{
		label: 'program',
		value: 'program'
	},
	{
		label: 'global',
		value: 'global'
	}
];


// FUNCTIONS //

const RoleModal = ( props ) => {
	const [ title, setTitle ] = useState( '' );
	const [ search, setSearch ] = useState( null );
	const [ searchContext, setSearchContext ] = useState( SEARCH_CONTEXT[ 2 ] );
	const [ permissions, setPermissions ] = useState( {} );
	const [ show, setShow ] = useState( 'all' );
	const handleActiveChange = ( event ) => {
		const check = event.target.checked;
		const show = event.target.dataset.show;
		if ( check ) {
			setShow( show );
		}
	};
	return (
		<Modal show={props.modal !== null} dialogClassName="modal-75w" onHide={props.onHide} >
			<Modal.Header closeButton >
				<Modal.Title as="h3" >
					{props.modal}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body >
				<Row>
					<FormGroup
						controlId="form-title"
						as={Col}
					>
						<FormLabel>{props.t('common:title')}</FormLabel>
						<FormControl
							name="title"
							type="text"
							value={title}
							onChange={( event ) => {
								setTitle( event.target.value );
							}}
							autoComplete="none"
						/>
					</FormGroup>
					<FormGroup
						controlId="form-context"
						as={Col}
					>
						<FormLabel>{props.t('common:search-context')}</FormLabel>
						<SelectInput
							options={SEARCH_CONTEXT}
							onChange={setSearchContext}
							value={searchContext}
						/>
					</FormGroup>
				</Row>
				<div style={{ height: 50 }}>
					<h4 style={{ float: 'left', width: 120 }}>Permissions</h4>
					<FormCheck
						data-show="all" type="radio" inline
						checked={show === 'all'} label='Show All' name="radioGroup"
						onChange={handleActiveChange}
					/>
					<FormCheck
						data-show="active" type="radio" inline
						checked={show === 'active'} label='Show Active' name="radioGroup"
						onChange={handleActiveChange}
					/>
					<FormCheck
						data-show="inactive" type="radio" inline
						checked={show === 'inactive'} label='Show Inactive' name="radioGroup"
						onChange={handleActiveChange}
					/>
					<SearchBar
						onChange={( event ) => {
							setSearch( event.target.value );
						}}
						value={search || ''}
						placeholder={props.t('search-permissions')}
						style={{
							float: 'right'
						}}
					/>
				</div>
				<div key={show} style={{ height: 'calc(100vh - 400px)', overflowY: 'auto', overflowX: 'hidden', backgroundColor: 'rgba(255,128,0,0.04)', padding: 12 }} >
					{PERMISSIONS.map( ( group, i ) => {
						const actions = group.actions
							.filter( x => {
								if ( search && !x.name.includes( search ) ) {
									return false;
								}
								if (
									( show === 'active' && !permissions[ x.name ] ) ||
									( show === 'inactive' && permissions[ x.name ] )
								) {
									return false;
								}
								return true;
							})
							.map( ( x, j ) => {
								return (
									<Col
										key={j}
										sm={3}
									>
										<FormCheck
											inline
											id={x.name}
										>
											<FormCheck.Input
												type="checkbox"
												checked={permissions[ x.name ]}
												key={`${x.name}-${j}-input`}
												onChange={() => {
													const newPermissions = { ...permissions };
													newPermissions[ x.name ] = !newPermissions[ x.name ];
													setPermissions( newPermissions );
												}}
											/>
											<span
												style={{
													color: permissions[ x.name ] ? 'green' : 'black'
												}}
											>
												{x.name}
											</span>
										</FormCheck>
										<Form.Text>
											{x.description || 'Description comes here...'}
										</Form.Text>
									</Col>
								);
							});
						if ( actions.length === 0 ) {
							return null;
						}
						return (
							<Fragment key={`${group.name}-${i}`} >
								<h5>{group.name}</h5>
								<Form.Row style={{ marginBottom: 16 }} >
									{actions}
								</Form.Row>
								<hr />
							</Fragment>
						);
					})}
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide} >
					Cancel
				</Button>
				<Button >
					{props.t('common:create')}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};


// MAIN //

class RolesPage extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			modal: null
		};
	}

	toggleEditModal = () => {
		this.setState({
			modal: this.state.modal ? null : 'edit'
		});
	}

	toggleCreateModal = () => {
		this.setState({
			modal: this.state.modal ? null : 'create'
		});
	}

	toggleDeleteModal = () => {

	}

	renderRoleItems() {
		const out = [];
		const roles = [{
			name: 'Administrator',
			createdBy: null,
			permissions: {},
			searchContext: 'global'
		}];
		for ( let i = 0; i < roles.length; i++ ) {
			const role = roles[ i ];
			const li = ( <tr key={i}>
				<td><b>{role.name}</b></td>
				<td></td>
				<td></td>
				<td>
					<Button size="sm" onClick={this.toggleEditModal} style={{ marginRight: 6 }} >
						<i className="fas fa-edit" ></i>
					</Button>
					<Button variant="danger" size="sm" onClick={this.toggleDeleteModal} >
						<i className="fas fa-trash" ></i>
					</Button>
				</td>
			</tr> );
			out.push( li );
		}
		return out;
	}

	render() {
		const { t } = this.props;
		return (
			<Fragment>
				<div className="admin-settings-outer-container" >
					<h1>{t('roles')}</h1>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>{t('common:name')}</th>
								<th>{t('common:created_by')}</th>
								<th>{t('common:permissions')}</th>
								<th>{t('common:actions')}</th>
							</tr>
						</thead>
						<tbody>
							{this.renderRoleItems()}
						</tbody>
					</Table>

					<Button size="lg" onClick={this.toggleCreateModal} >
						<i className="fas fa-plus" style={{ marginRight: 12 }}></i>
						{t('create-role')}
					</Button>
				</div>
				<RoleModal onHide={this.toggleCreateModal} modal={this.state.modal} t={t} />
			</Fragment>
		);
	}
}


// PROPERTIES //

RolesPage.propTypes = {};


// EXPORTS //

export default withTranslation( [ 'admin_settings', 'common' ] )( RolesPage );
