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
import SelectInput from 'react-select';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Modal from 'react-bootstrap/Modal';
import isEmptyObject from '@stdlib/assert/is-empty-object';
import logger from 'debug';
import server from 'constants/server';


// FUNCTIONS //

const createTooltip = ( str ) => {
	return <Tooltip id="tooltip">{str}</Tooltip>;
};


// VARIABLES //

const debug = logger( 'isle-dashboard' );


// MAIN //

class EditModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			email: props.user.email,
			name: props.user.name,
			organization: props.user.organization,
			password: '',
			writeAccess: props.user.writeAccess,
			verifiedEmail: props.user.verifiedEmail,
			administrator: props.user.administrator,
			customFields: props.user.customFields || {},
			twoFactorAuth: props.user.twoFactorAuth
		};
	}

	handleUpdate = () => {
		const { name, password, organization, writeAccess, verifiedEmail, administrator, twoFactorAuth } = this.state;
		const form = {
			name,
			organization,
			id: this.props.user._id,
			writeAccess,
			verifiedEmail,
			administrator,
			twoFactorAuth
		};
		let change = false;
		if ( password ) {
			form.password = password;
			change = true;
		}
		if ( !isEmptyObject( this.state.customFields ) ) {
			form.customFields = this.state.customFields;
			change = true;
		}
		const user = this.props.user;
		if (
			name !== user.name ||
			organization !== user.organization ||
			writeAccess !== user.writeAccess ||
			verifiedEmail !== user.verifiedEmail ||
			administrator !== user.administrator ||
			twoFactorAuth !== user.twoFactorAuth
		) {
			change = true;
		}
		if ( change ) {
			debug( 'Update user...' );
			this.props.updateUser( form );
			this.props.onHide();
		}
	};

	handleInputChange = ( event ) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[ name ]: value
		});
	};

	handleCheckboxChangeFactory = ( name ) => {
		return ( event ) => {
			this.setState({
				[ name ]: event.target.checked
			});
		};
	};

	getNameValidationState = () => {
		const { name } = this.state;
		return name && name.length > 3;
	};

	getPasswordValidationState = () => {
		const { password } = this.state;
		return password.length >= 6;
	};

	render() {
		const validPasswords = this.getPasswordValidationState();
		const validName = this.getNameValidationState();
		const enteredPasswords = this.state.password || this.state.passwordRepeat;
		const t = this.props.t;
		const userCustomFields = this.props.user.customFields || {};
		return (
			<Fragment>
				<Modal dialogClassName="user-edit-modal" show={this.props.show} onHide={this.props.onHide} >
				<Modal.Header>
					<Modal.Title as="h3" style={{ width: '100%' }}>
						{t('common:profile')}
						<OverlayTrigger placement="right" overlay={createTooltip( t('close-edit-modal') )}>
							<Button
								onClick={this.props.onHide}
								style={{ float: 'right' }}
								variant="outline-secondary"
								aria-label={t('close-edit-modal')}
								className="modal-close"
							>
								<span aria-hidden="true">x</span>
							</Button>
						</OverlayTrigger>
					</Modal.Title>
				</Modal.Header>
					<Form noValidate style={{ padding: '20px' }}>
						<Row>
							<Col md={4} >
								<img src={`${server}/avatar/${this.props.user.picture}`} alt="Profile Pic" width="160px" />
							</Col>
							<Col md={4} >
								<FormGroup
									controlId="form-email"
								>
									<FormLabel>
										{t('common:email')}
									</FormLabel>
									<FormControl
										name="email"
										type="email"
										value={this.state.email}
										disabled
										autoComplete="none"
									/>
								</FormGroup>
								<OverlayTrigger placement="right" overlay={createTooltip( t('update-name') )}>
									<FormGroup
										controlId="form-name"
									>
										<FormLabel>{t('common:name')}</FormLabel>
										<FormControl
											name="name"
											type="text"
											value={this.state.name}
											onChange={this.handleInputChange}
											isInvalid={!validName}
											autoComplete="none"
										/>
										<Form.Control.Feedback type="invalid">
											{t('invalid-name')}
										</Form.Control.Feedback>
									</FormGroup>
								</OverlayTrigger>
								<OverlayTrigger placement="right" overlay={createTooltip( t('update-organization') )}>
									<FormGroup
										controlId="form-organization"
									>
										<FormLabel>{t('common:organization')}</FormLabel>
										<FormControl
											name="organization"
											type="text"
											value={this.state.organization}
											onChange={this.handleInputChange}
											autoComplete="none"
										/>
									</FormGroup>
								</OverlayTrigger>
							</Col>
							<Col md={4} >
								<OverlayTrigger placement="right" overlay={createTooltip( t('admin:enter-new-password') )}>
									<FormGroup
										controlId="form-password"
									>
										<FormLabel>{t('common:password')}</FormLabel>
										<FormControl
											name="password"
											type="password"
											data-lpignore="true"
											value={this.state.password}
											autoComplete="none"
											placeholder={t('common:choose-new-password')}
											onChange={this.handleInputChange}
											maxLength={30}
											minLength={6}
											isInvalid={enteredPasswords && !validPasswords}
										/>
										<Form.Control.Feedback type="invalid">
											Please enter a new password with at least six characters.
										</Form.Control.Feedback>
									</FormGroup>
								</OverlayTrigger>
								<FormGroup>
									<Form.Check
										type="checkbox"
										label={t('admin:instructor')}
										defaultChecked={this.props.user.writeAccess}
										onChange={this.handleCheckboxChangeFactory( 'writeAccess' )}
									/>
									<Form.Check
										type="checkbox"
										label={t('admin:admin')}
										defaultChecked={this.props.user.administrator}
										onChange={this.handleCheckboxChangeFactory( 'administrator' )}
									/>
									<Form.Check
										type="checkbox"
										label={t('admin:email-verified')}
										defaultChecked={this.props.user.verifiedEmail}
										onChange={this.handleCheckboxChangeFactory( 'verifiedEmail' )}
									/>
									<Form.Check
										type="checkbox"
										label={t('common:two-factor-authentication')}
										defaultChecked={this.props.user.twoFactorAuth}
										onChange={this.handleCheckboxChangeFactory( 'twoFactorAuth' )}
									/>
								</FormGroup>
							</Col>
						</Row>
						<Row>
							{this.props.availableCustomFields.map( ( x, idx ) => {
								let input;
								const value = userCustomFields[ x.name ];
								if ( x.type === 'checkbox' ) {
									input = <Form.Check
										type="checkbox"
										label={x.name}
										defaultChecked={value}
										onChange={( event ) => {
											const newCustomFields = { ...this.state.customFields };
											newCustomFields[ x.name ] = event.target.checked;
											this.setState({
												customFields: newCustomFields
											});
										}}
									/>;
								} else if ( x.type === 'text' ) {
									input = <FormGroup
										controlId={`form-${x.name}`}
									>
										<FormLabel>{x.name}</FormLabel>
										<FormControl
											name={x.name}
											type="text"
											value={value}
											placeholder={`Enter ${x.name}...`}
											onChange={( event ) => {
												const newCustomFields = { ...this.state.customFields };
												newCustomFields[ x.name ] = event.target.value;
												this.setState({
													customFields: newCustomFields
												});
											}}
											autoComplete="none"
										/>
									</FormGroup>;
								} else {
									// Case: dropdown menu
									input = <FormGroup
										controlId={`form-${x.name}`}
									>
										<FormLabel>{x.name}</FormLabel>
										<SelectInput
											defaultValue={value ?
												{ label: value, value: value } :
												null
											}
											options={x.options.map( e => {
												return { value: e, label: e };
											})}
											onChange={( elem ) => {
												const newCustomFields = { ...this.state.customFields };
												newCustomFields[ x.name ] = elem.value;
												this.setState({
													customFields: newCustomFields
												});
											}}
										/>
									</FormGroup>;
								}
								return (
									<Col md={4} key={idx} >
										<OverlayTrigger placement="top" overlay={createTooltip( x.description )} >
											{input}
										</OverlayTrigger>
									</Col>
								);
							})}
						</Row>
					</Form>
					<Card>
						<Button block disabled={false} onClick={this.handleUpdate}>
							{t('common:update')}
						</Button>
					</Card>
				</Modal>
			</Fragment>
		);
	}
}


// PROPERTIES //

EditModal.propTypes = {
	availableCustomFields: PropTypes.array.isRequired,
	onHide: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	t: PropTypes.func.isRequired,
	updateUser: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

EditModal.defaultProps = {};


// EXPORTS

export default EditModal;
