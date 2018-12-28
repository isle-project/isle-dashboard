// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, FormLabel, FormControl, FormGroup, Form, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import request from 'request';
import logger from 'debug';
import server from './../../constants/server';


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
			passwordRepeat: ''
		};
	}

	handleUpdate = () => {
		const { name, password, passwordRepeat, organization } = this.state;
		let form = {};
		let change = false;
		if ( password ) {
			if ( passwordRepeat === password ) {
				change = true;
				form.password = password;
			}
		}
		if ( name !== this.props.user.name ) {
			form.name = name;
			change = true;
		}
		if ( organization !== this.props.user.organization ) {
			form.organization = organization;
			change = true;
		}
		if ( change ) {
			request.post( server+'/update_user', {
				form: form,
				headers: {
					'Authorization': 'JWT ' + this.props.user.token
				}
			}, ( err, res ) => {
				if ( err ) {
					this.props.addNotification({
						message: err.message,
						level: 'error'
					});
				} else {
					this.props.updateUser({
						name,
						organization
					});
					this.props.addNotification({
						message: JSON.parse( res.body ).message,
						level: 'success'
					});
				}
			});
		}
	}

	handleInputChange = ( event ) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[ name ]: value
		});
	}

	getNameValidationState = () => {
		const { name } = this.state;
		if ( name.length > 3 ) {
			return true;
		}
		return false;
	}

	getPasswordValidationState = () => {
		const { password, passwordRepeat } = this.state;
		debug( `Password: ${password}; Repeat password: ${passwordRepeat}` );
		if ( password.length < 6 || passwordRepeat.length === 0 ) {
			return false;
		}
		if ( password !== passwordRepeat ) {
			return false;
		}
		return true;
	}

	render() {
		const validPasswords = this.getPasswordValidationState();
		const validName = this.getNameValidationState();
		const enteredPasswords = this.state.password || this.state.passwordRepeat;
		return (
			<Modal show={this.props.show} onHide={this.props.onHide}>
			<Modal.Header closeButton>
				<Modal.Title as="h3">Profile
				</Modal.Title>
			</Modal.Header>
				<Form noValidate style={{ padding: '20px' }}>
					<FormGroup
						controlId="form-email"
					>
						<FormLabel>Email Address</FormLabel>
						<FormControl
							name="email"
							type="email"
							value={this.state.email}
							disabled
						/>
					</FormGroup>
					<OverlayTrigger placement="right" overlay={createTooltip( 'Update your name' )}>
						<FormGroup
							controlId="form-name"
						>
							<FormLabel>Name</FormLabel>
							<FormControl
								name="name"
								type="text"
								value={this.state.name}
								onChange={this.handleInputChange}
								isInvalid={!validName}
							/>
							<Form.Control.Feedback type="invalid">
								Name needs to be at least four characters long.
							</Form.Control.Feedback>
						</FormGroup>
					</OverlayTrigger>
					<OverlayTrigger placement="right" overlay={createTooltip( 'Update your organization' )}>
						<FormGroup
							controlId="form-organization"
						>
							<FormLabel>Organization</FormLabel>
							<FormControl
								name="organization"
								type="text"
								value={this.state.organization}
								onChange={this.handleInputChange}
							/>
						</FormGroup>
					</OverlayTrigger>
					<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter a password of your choosing with at least six characters' )}>
						<FormGroup
							controlId="form-password"
						>
							<FormLabel>Password</FormLabel>
							<FormControl
								name="password"
								type="password"
								value={this.state.password}
								autoComplete="new-password"
								placeholder="Choose a new password"
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
							autoComplete="new-password"
							placeholder="Repeat new password"
							onChange={this.handleInputChange}
							maxLength={30}
							minLength={6}
							isInvalid={enteredPasswords && !validPasswords}
						/>
						<Form.Control.Feedback type="invalid">
							Passwords do not match.
						</Form.Control.Feedback>
					</FormGroup>
				</Form>
				<Card>
					<Button block disabled={!validName || ( !validPasswords && enteredPasswords )} onClick={this.handleUpdate}>Update</Button>
				</Card>
			</Modal>
		);
	}
}


// PROPERTIES //

EditModal.propTypes = {
	addNotification: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	updateUser: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

EditModal.defaultProps = {};


// EXPORTS

export default EditModal;
