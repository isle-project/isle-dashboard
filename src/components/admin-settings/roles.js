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
import { isPrimitive as isBoolean } from '@stdlib/assert/is-boolean';
import objectKeys from '@stdlib/utils/keys';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
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
	const [ authorizedRoles, setAuthorizedRoles ] = useState( [] );
	const { createRole, modal, roles, onHide, t } = props;

	const handleActiveChange = ( event ) => {
		const check = event.target.checked;
		const show = event.target.dataset.show;
		if ( check ) {
			setShow( show );
		}
	};
	const handleCreation = () => {
		createRole({
			title,
			authorizedRoles: authorizedRoles.map( x => x.value._id ),
			searchContext: searchContext.value,
			permissions
		});
	};
	return (
		<Modal show={modal !== null} dialogClassName="modal-75w" onHide={onHide} >
			<Modal.Header closeButton >
				<Modal.Title as="h3" >
					{t( 'common:'+modal )}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body >
				<Row>
					<FormGroup
						controlId="form-title"
						as={Col}
					>
						<FormLabel>{t('common:title')}</FormLabel>
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
						controlId="form-authorized-roles"
						as={Col}
					>
						<FormLabel>{t('authorized-roles')}:</FormLabel>
						<SelectInput
							options={roles.map( x => {
								return {
									label: x.title,
									value: x
								};
							})}
							isMulti
							value={authorizedRoles}
							onChange={( newValue ) => {
								setAuthorizedRoles( newValue ? newValue : [] );
							}}
						/>
					</FormGroup>
					<FormGroup
						controlId="form-context"
						as={Col}
					>
						<FormLabel>{t('search-context')}</FormLabel>
						<SelectInput
							options={SEARCH_CONTEXT}
							onChange={setSearchContext}
							value={searchContext}
						/>
					</FormGroup>
				</Row>
				<div style={{ height: 50 }}>
					<h4 style={{ float: 'left', width: 150 }}>{t('permissions')}</h4>
					<FormCheck
						data-show="all" type="radio" inline
						checked={show === 'all'} label={t('show-all')} name="radioGroup"
						onChange={handleActiveChange}
					/>
					<FormCheck
						data-show="allowed" type="radio" inline
						checked={show === 'allowed'} label={t('show-allowed')} name="radioGroup"
						onChange={handleActiveChange}
					/>
					<FormCheck
						data-show="disallowed" type="radio" inline
						checked={show === 'disallowed'} label={t('show-disallowed')} name="radioGroup"
						onChange={handleActiveChange}
					/>
					<FormCheck
						data-show="inactive" type="radio" inline
						checked={show === 'inactive'} label={t('show-inactive')} name="radioGroup"
						onChange={handleActiveChange}
					/>
					<SearchBar
						onChange={( event ) => {
							setSearch( event.target.value );
						}}
						value={search || ''}
						placeholder={t('search-permissions')}
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
									( show === 'allowed' && !permissions[ x.name ] ) ||
									( show === 'disallowed' && permissions[ x.name ] !== false ) ||
									( show === 'inactive' && isBoolean( permissions[ x.name ] ) )
								) {
									return false;
								}
								return true;
							})
							.map( ( x, j ) => {
								let color;
								if ( permissions[ x.name ] === true ) {
									color = 'green';
								} else {
									color = permissions[ x.name ] === false ? 'red' : 'black';
								}
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
												ref={( elem ) => {
													if ( elem ) {
														elem.indeterminate = permissions[ x.name ] === false;
													}
												}}
												onChange={( event ) => {
													const newPermissions = { ...permissions };
													switch ( permissions[ x.name ] ) {
														case true:
															newPermissions[ x.name ] = false;
															event.target.indeterminate = true;
															break;
														case false:
															newPermissions[ x.name ] = null;
															event.target.indeterminate = false;
															break;
														default:
															newPermissions[ x.name ] = true;
															event.target.indeterminate = false;
															break;
													}
													setPermissions( newPermissions );
												}}
											/>
											<span
												style={{
													color
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
				<Button onClick={onHide} >
					{t('common:cancel')}
				</Button>
				<Button onClick={handleCreation} disabled={!title} >
					{t('common:create')}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

const PermissionList = ({ permissions, status, t }) => {
	const keys = objectKeys( permissions );
	const out = [];
	if ( status === 'allowed' ) {
		for ( let i = 0; i < keys.length; i++ ) {
			const key = keys[ i ];
			if ( permissions[ key ] === true ) {
				out.push(
					<ListGroup.Item>{key}</ListGroup.Item>
				);
			}
		}
	}
	else if ( status === 'disallowed' ) {
		for ( let i = 0; i < keys.length; i++ ) {
			const key = keys[ i ];
			if ( permissions[ key ] === false ) {
				out.push(
					<ListGroup.Item>{key}</ListGroup.Item>
				);
			}
		}
	}
	if ( out.length === 0 ) {
		return (
			<ListGroup variant="flush" >
				<ListGroup.Item>{t('common:none')}</ListGroup.Item>
			</ListGroup>
		);
	}
	return (
		<ListGroup variant="flush" style={{ fontSize: '0.8em' }} >
			{out.length > 0 ? out : <ListGroup.Item>{t('common:none')}</ListGroup.Item>}
		</ListGroup>
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

	componentDidMount() {
		this.props.getAllRoles();
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
		const { admin, t } = this.props;
		const roles = admin.roles || [];
		for ( let i = 0; i < roles.length; i++ ) {
			const role = roles[ i ];
			const li = ( <tr key={i}>
				<td><b>{role.title}</b></td>
				<td>{role.createdBy}</td>
				<td>
					<OverlayTrigger
						placement="left"
						delay={{ show: 250, hide: 400 }}
						overlay={<Popover id={`popover-allowed-${i}`} >
							<Popover.Title as="h3">{t('allowed-permissions')}</Popover.Title>
							<Popover.Content style={{ maxHeight: '40vh', overflowY: 'auto' }} >
								<PermissionList status="allowed" permissions={role.permissions} t={t} />
							</Popover.Content>
					 	 </Popover>}
						trigger="click"
					>
						<Button variant="success" style={{ marginRight: 8 }} >
							<i className="fas fa-check-circle"></i>
						</Button>
					</OverlayTrigger>
					<OverlayTrigger
						placement="right"
						delay={{ show: 250, hide: 400 }}
						overlay={<Popover id={`popover-disallowed-${i}`} >
							<Popover.Title as="h3">{t('disallowed-permissions')}</Popover.Title>
							<Popover.Content style={{ maxHeight: '40vh', overflowY: 'auto' }} >
								<PermissionList status="disallowed" permissions={role.permissions} t={t} />
							</Popover.Content>
					 	 </Popover>}
						trigger="click"
					>
						<Button variant="danger" >
							<i className="far fa-times-circle"></i>
						</Button>
					</OverlayTrigger>
				</td>
				<td>{role.searchContext}</td>
				<td>{role.authorizedRoles.map( x => x.title ).join( ', ' )}</td>
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
								<th>{t('common:created-by')}</th>
								<th>{t('common:permissions')}</th>
								<th>{t('search-context')}</th>
								<th>{t('authorized-roles')}</th>
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
				<RoleModal
					onHide={this.toggleCreateModal}
					modal={this.state.modal} t={t}
					createRole={this.props.createRole}
					roles={this.props.admin.roles}
				/>
			</Fragment>
		);
	}
}


// PROPERTIES //

RolesPage.propTypes = {};


// EXPORTS //

export default withTranslation( [ 'admin_settings', 'common' ] )( RolesPage );
