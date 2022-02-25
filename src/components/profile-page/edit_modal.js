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
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Modal from 'react-bootstrap/Modal';
import isEmptyObject from '@stdlib/assert/is-empty-object';
import logger from 'debug';
import TwoFactorAuthentication from './two_factor_authentication.js';
import EnterTokenModal from './enter_token_modal.js';


// FUNCTIONS //

const createTooltip = ( str ) => {
	return <Tooltip id="tooltip">{str}</Tooltip>;
};

const validateName = ( name ) => {
	if ( name && name.length > 2 ) {
		return true;
	}
	return false;
};


// VARIABLES //

const debug = logger( 'isle-dashboard' );


// MAIN //

class EditModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			email: props.user.email,
			firstName: props.user.firstName,
			lastName: props.user.lastName,
			preferredName: props.user.preferredName,
			organization: props.user.organization,
			pronouns: props.user.pronouns,
			password: '',
			passwordRepeat: '',
			changed: false,
			showTokenModal: false,
			customFields: props.user.customFields || {}
		};
	}

	handleUpdate = () => {
		const { firstName, lastName, preferredName, pronouns, password, passwordRepeat, organization, customFields } = this.state;
		const form = {
			firstName,
			lastName,
			preferredName,
			pronouns,
			organization
		};
		let change = false;
		if ( password ) {
			if ( passwordRepeat === password ) {
				change = true;
				form.password = password;
			}
		}
		if (
			firstName !== this.props.user.firstName ||
			lastName !== this.props.user.lastName ||
			preferredName !== this.props.user.preferredName ||
			pronouns !== this.props.user.pronouns ||
			organization !== this.props.user.organization
		) {
			change = true;
		}
		if ( !isEmptyObject( customFields ) ) {
			form.customFields = customFields;
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
			[ name ]: value,
			changed: true
		});
	};

	getPasswordValidationState = () => {
		const { password, passwordRepeat } = this.state;
		if ( password.length < 6 || passwordRepeat.length === 0 ) {
			return false;
		}
		if ( password !== passwordRepeat ) {
			return false;
		}
		return true;
	};

	toggleTokenModal = () => {
		this.setState({
			showTokenModal: !this.state.showTokenModal
		});
	};

	renderInstructorButton() {
		if ( this.props.user.writeAccess ) {
			return null;
		}
		const t = this.props.t;
		return ( <Button
			onClick={this.toggleTokenModal}
			variant="outline-success"
			style={{ float: 'right', marginRight: 5 }}
		>{t('get-instructor-access')}</Button> );
	}

	render() {
		const validPasswords = this.getPasswordValidationState();
		const validFirstName = validateName( this.state.firstName );
		const validLastName = validateName( this.state.lastName );
		const validPreferredName = validateName( this.state.preferredName );
		const enteredPasswords = this.state.password || this.state.passwordRepeat;
		const user = this.props.user;
		const t = this.props.t;
		const userCustomFields = this.state.customFields;
		const availableCustomFields = user.availableCustomFields || [];
		let passwordCol;
		if ( !user.loginWithoutPassword ) {
			passwordCol = <Col sm={6} className="d-grid gap-3" >
				<OverlayTrigger placement="right" overlay={createTooltip( t('enter-password') )}>
					<FormGroup
						controlId="form-password"
					>
						<FormLabel>{t('common:password')}</FormLabel>
						<FormControl
							name="password"
							type="password"
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
				<FormGroup
					controlId="form-repeat-password"
				>
					<FormControl
						name="passwordRepeat"
						type="password"
						value={this.state.passwordRepeat}
						autoComplete="none"
						placeholder={t('repeat-new-password')}
						onChange={this.handleInputChange}
						maxLength={30}
						minLength={6}
						isInvalid={enteredPasswords && !validPasswords}
					/>
					<Form.Control.Feedback type="invalid">
						{t('invalid-password')}
					</Form.Control.Feedback>
				</FormGroup>
				<TwoFactorAuthentication
					user={this.props.user} t={this.props.t}
					disableTFA={this.props.disableTFA}
					enableTFA={this.props.enableTFA}
					getTfaQRCode={this.props.getTfaQRCode}
				/>
			</Col>;
		} else {
			passwordCol = null;
		}
		return (
			<Fragment>
				<Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="edit-modal" >
				<Modal.Header>
					<Modal.Title as="h3" style={{ width: '100%' }}>
						{t('profile')}
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
						{this.renderInstructorButton()}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form as={Row} >
						<Col sm={6} className="d-grid gap-2" >
							<FormGroup
								controlId="form-email"
							>
								<FormLabel style={{ width: '100%' }}>
									{t('common:email')}
									{!user.verifiedEmail ? <Badge
										bg="danger" style={{ float: 'right' }}
									>{t('common:email-not-verified')}
										<OverlayTrigger placement="right" overlay={createTooltip( t('resend-confirm-email') )}>
											<Button
												aria-label={t('resend-confirm-email')}
												size="sm" variant="outline-light" onClick={this.props.resendConfirmEmail}
												style={{ fontSize: 12, marginLeft: 6 }}
											>
												<i className="fas fa-redo-alt"></i>
											</Button>
										</OverlayTrigger>
									</Badge> : null}
								</FormLabel>
								<FormControl
									name="email"
									type="email"
									value={this.state.email}
									disabled
								/>
							</FormGroup>
							<OverlayTrigger placement="right" overlay={createTooltip( t('update-first-name') )}>
								<FormGroup
									controlId="form-first-name"
								>
									<FormLabel>{t('common:first-name')}</FormLabel>
									<FormControl
										name="firstName"
										type="text"
										value={this.state.firstName}
										onChange={this.handleInputChange}
										isInvalid={!validFirstName}
									/>
									<Form.Control.Feedback type="invalid">
										{t('invalid-first-name')}
									</Form.Control.Feedback>
								</FormGroup>
							</OverlayTrigger>
							<Row>
								<Col md={6} >
									<OverlayTrigger placement="right" overlay={createTooltip( t('update-preferred-name') )}>
										<FormGroup
											controlId="form-preferred-name"
										>
											<FormLabel>{t('common:preferred-name')}</FormLabel>
											<FormControl
												name="preferredName"
												type="text"
												value={this.state.preferredName}
												onChange={this.handleInputChange}
												isInvalid={!validPreferredName}
											/>
											<Form.Control.Feedback type="invalid">
												{t('invalid-preferred-name')}
											</Form.Control.Feedback>
										</FormGroup>
									</OverlayTrigger>
								</Col>
								<Col md={6} >
									<OverlayTrigger placement="right" overlay={createTooltip( t('update-pronouns') )}>
										<FormGroup
											controlId="form-pronouns"
										>
											<FormLabel>{t('common:pronouns')}</FormLabel>
											<FormControl
												name="pronouns"
												type="text"
												value={this.state.pronouns}
												onChange={this.handleInputChange}
											/>
										</FormGroup>
									</OverlayTrigger>
								</Col>
							</Row>
							<OverlayTrigger placement="right" overlay={createTooltip( t('update-last-name') )}>
								<FormGroup
									controlId="form-last-name"
								>
									<FormLabel>{t('common:last-name')}</FormLabel>
									<FormControl
										name="lastName"
										type="text"
										value={this.state.lastName}
										onChange={this.handleInputChange}
										isInvalid={!validLastName}
									/>
									<Form.Control.Feedback type="invalid">
										{t('invalid-last-name')}
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
									/>
								</FormGroup>
							</OverlayTrigger>
							{availableCustomFields.filter( x => x.showOnProfile || x.editableOnProfile ).map( ( x, idx ) => {
								let input;
								const value = userCustomFields[ x.name ];
								if ( x.type === 'checkbox' ) {
									input = <Form.Check
										type="checkbox"
										label={x.name}
										defaultChecked={value}
										disabled={!x.editableOnProfile}
										onChange={( event ) => {
											const newCustomFields = { ...this.state.customFields };
											newCustomFields[ x.name ] = event.target.checked;
											this.setState({
												customFields: newCustomFields,
												changed: true
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
											disabled={!x.editableOnProfile}
											onChange={( event ) => {
												const newCustomFields = { ...this.state.customFields };
												newCustomFields[ x.name ] = event.target.value;
												this.setState({
													customFields: newCustomFields,
													changed: true
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
											disabled={!x.editableOnProfile}
											options={x.options.map( e => {
												return { value: e, label: e };
											})}
											onChange={( elem ) => {
												const newCustomFields = { ...this.state.customFields };
												newCustomFields[ x.name ] = elem.value;
												this.setState({
													customFields: newCustomFields,
													changed: true
												});
											}}
										/>
									</FormGroup>;
								}
								return (
									<OverlayTrigger key={idx} placement="top" overlay={createTooltip( x.description )} >
										{input}
									</OverlayTrigger>
								);
							})}
						</Col>
						{passwordCol}
					</Form>
					<Row style={{ paddingTop: 10 }} className="d-grid" >
						<Button
							disabled={!this.state.changed || !validFirstName || !validLastName || !validPreferredName || ( !validPasswords && enteredPasswords )}
							onClick={this.handleUpdate}
						>
							{t('common:update')}
						</Button>
					</Row>
					</Modal.Body>
				</Modal>
				<EnterTokenModal
					user={user}
					authenticate={this.props.authenticate}
					show={this.state.showTokenModal}
					onHide={this.toggleTokenModal}
				/>
			</Fragment>
		);
	}
}


// PROPERTIES //

EditModal.propTypes = {
	authenticate: PropTypes.func.isRequired,
	disableTFA: PropTypes.func.isRequired,
	enableTFA: PropTypes.func.isRequired,
	getTfaQRCode: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	resendConfirmEmail: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	t: PropTypes.func.isRequired,
	updateUser: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

EditModal.defaultProps = {};


// EXPORTS

export default EditModal;
