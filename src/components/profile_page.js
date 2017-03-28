// MODULES //

import React, { Component } from 'react';
import { Button, ControlLabel, FormControl, FormGroup, Form, Modal, OverlayTrigger, Panel, Tooltip } from 'react-bootstrap';
import MsgModal from './message_modal.js';


// FUNCTIONS //

const createTooltip = ( str ) => {
	return <Tooltip id="tooltip">{str}</Tooltip>;
};


// MAIN //

class ProfilePage extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			email: this.props.user.email,
			name: this.props.user.name,
			password: ''
		};

		this.handleInputChange = ( event ) => {
			const target = event.target;
			const value = target.value;
			const name = target.name;

			this.setState({
				[ name ]: value
			});
		};

		this.getEmailValidationState = () => {
			const { email } = this.state;
			if ( email.includes( '@' ) ) {
				return 'success';
			}
			return 'warning';
		};

		this.getNameValidationState = () => {
			const { name } = this.state;
			if ( name.length > 3 ) {
				return 'success';
			}
			return 'warning';
		};

		this.getPasswordValidationState = () => {
			const { password, passwordRepeat } = this.state;
			if ( password.length < 6 || passwordRepeat.length === 0 ) {
				return 'warning';
			}
			if ( password !== passwordRepeat ) {
				 return 'error';
			}
			return 'success';
		};
	}

	render() {
		return (
			<Panel style={{
				position: 'relative',
				top: '80px',
				width: '50%',
				margin: '0 auto'
			}} header={<h2>Profile</h2>}>
				<Form style={{ padding: '20px' }}>
					<OverlayTrigger placement="right" overlay={createTooltip( 'Update your email address.' )}>
						<FormGroup
							controlId="formHorizontalEmail"
							validationState={this.getEmailValidationState()}
						>
							<ControlLabel>Email Address</ControlLabel>
							<FormControl
								name="email"
								type="email"
								value={this.state.email}
								onChange={this.handleInputChange}
							/>
						</FormGroup>
					</OverlayTrigger>
					<OverlayTrigger placement="right" overlay={createTooltip( 'Update your name' )}>
						<FormGroup
							controlId="formHorizontalName"
							validationState={this.getNameValidationState()}
						>
							<ControlLabel>Name</ControlLabel>
							<FormControl
								name="name"
								type="text"
								value={this.state.name}
								onChange={this.handleInputChange}
							/>
						</FormGroup>
					</OverlayTrigger>
					<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter a password of your choosing with at least six characters' )}>
						<FormGroup
							controlId="formHorizontalPassword"
							validationState={this.getPasswordValidationState()}
						>
							<ControlLabel>Password</ControlLabel>
							<FormControl
								name="password"
								type="password"
								placeholder="Choose a new password"
								onChange={this.handleInputChange}
								maxLength={30}
								minLength={6}
							/>
							<FormControl.Feedback />
						</FormGroup>
					</OverlayTrigger>
					<FormGroup
						controlId="formHorizontalPassword"
						validationState={this.getPasswordValidationState()}
					>
						<FormControl
							name="passwordRepeat"
							type="password"
							placeholder="Repeat new password"
							onChange={this.handleInputChange}
							maxLength={30}
							minLength={6}
						/>
						<FormControl.Feedback />
					</FormGroup>
				</Form>
				<Button block>Update</Button>
				<MsgModal
					show={this.state.showModal}
					close={this.close}
					message={this.state.message}
					successful={this.state.successful}
					titile="Update Profile"
				/>
			</Panel>
		);
	}
}


// EXPORTS //

export default ProfilePage;
