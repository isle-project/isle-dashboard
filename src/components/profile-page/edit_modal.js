// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, FormLabel, FormControl, FormGroup, Form, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import request from 'request';
import logger from 'debug';
import EnterTokenModal from './enter_token_modal.js';
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
			passwordRepeat: '',
			changed: false,
			showTokenModal: false
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
			debug( 'Update user...' );
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
					this.props.onHide();
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
			[ name ]: value,
			changed: true
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
		if ( password.length < 6 || passwordRepeat.length === 0 ) {
			return false;
		}
		if ( password !== passwordRepeat ) {
			return false;
		}
		return true;
	}

	toggleTokenModal = () => {
		this.setState({
			showTokenModal: !this.state.showTokenModal
		});
	}
	renderInstructorButton() {
		if ( this.props.user.writeAccess ) {
			return null;
		}
		return ( <Button
			onClick={this.toggleTokenModal}
			variant="outline-success"
			style={{ float: 'right', marginRight: 5 }}
		>Get Instructor Access</Button> );
	}

	render() {
		const validPasswords = this.getPasswordValidationState();
		const validName = this.getNameValidationState();
		const enteredPasswords = this.state.password || this.state.passwordRepeat;
		return (
			<Fragment>
				<Modal show={this.props.show} onHide={this.props.onHide} >
				<Modal.Header>
					<Modal.Title as="h3" style={{ width: '100%' }}>
						Profile
						<Button
							onClick={this.props.onHide}
							style={{ float: 'right' }}
							variant="outline-secondary"
						>
							<span aria-hidden="true">x</span>
						</Button>
						{this.renderInstructorButton()}
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
						<Button block disabled={!this.state.changed || !validName || ( !validPasswords && enteredPasswords )} onClick={this.handleUpdate}>Update</Button>
					</Card>
				</Modal>
				<EnterTokenModal
					user={this.props.user}
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
	addNotification: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	updateUser: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

EditModal.defaultProps = {};


// EXPORTS

export default EditModal;
