// MODULES //

import React, { Component } from 'react';
import { Button, Col, ControlLabel, FormControl, FormGroup, Form, Modal, OverlayTrigger, Overlay, PageHeader, Panel, Popover, Tooltip } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import request from 'request';
import './login.css';


// FUNCTIONS //

const createTooltip = ( str ) => {
	return <Tooltip id="tooltip">{str}</Tooltip>;
};


// VARIABLES //

const MsgModal = ( props ) => (
	<Modal show={props.show}>
		<Modal.Header>
			<Modal.Title>New Password Chosen</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{props.message}
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={props.close}>
				Close
			</Button>
		</Modal.Footer>
	</Modal>
);


// MAIN //

class NewPassword extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			password: '',
			passwordRepeat: '',
			showModal: false
		};

		this.handleSubmit = ( event ) => {
			event.preventDefault();
			let id = window.location.hash;
			id = id.substr( 1 );
			if (
				this.getPasswordValidationState() === 'success'
			) {
				request.post( 'http://localhost:3000/update_user_password', {
					form: {
						id: id,
						newPassword: this.state.password
					}
				}, ( err, res ) => {
					if ( !err ) {
						const body = JSON.parse( res.body );
						this.setState({
							message: body.message,
							successful: body.successful,
							showModal: true
						});
					}
				});
			} else {
				this.setState({
					showSubmitOverlay: true,
					overlayTarget: event.target
				}, () => {
					setTimeout( () => {
						this.setState({
							showSubmitOverlay: false
						});
					}, 2000 );
				});
			}
			return false;
		};

		this.handleInputChange = ( event ) => {
			const target = event.target;
			const value = target.value;
			const name = target.name;

			this.setState({
				[ name ]: value
			});
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

		this.close = () => {
			browserHistory.replace( '/login' );
		};
	}

	render() {
		return (
			<div>
				<div className="login">
					<Panel style={{ opacity: 0.9 }}>
						<PageHeader><small>Choose a new Password</small></PageHeader>
						<Form horizontal>
							<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter a new password with at least six characters' )}>
								<FormGroup
									controlId="formHorizontalPassword"
									validationState={this.getPasswordValidationState()}
								>
									<Col componentClass={ControlLabel} sm={2}>
										Password
									</Col>
									<Col sm={10}>
										<FormControl
											name="password"
											type="password"
											placeholder="Enter new password"
											onChange={this.handleInputChange}
											maxLength={30}
											minLength={6}
										/>
										<FormControl.Feedback />
									</Col>
								</FormGroup>
							</OverlayTrigger>
							<FormGroup
								controlId="formHorizontalPassword"
								validationState={this.getPasswordValidationState()}
							>
								<Col componentClass={ControlLabel} sm={2}>
								</Col>
								<Col sm={10}>
									<FormControl
										name="passwordRepeat"
										type="password"
										placeholder="Confirm new password"
										onChange={this.handleInputChange}
										maxLength={30}
										minLength={6}
									/>
									<FormControl.Feedback />
								</Col>
							</FormGroup>
							<FormGroup>
								<Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Confirm</Button>
							</FormGroup>
						</Form>
					</Panel>
				</div>
				<MsgModal
					show={this.state.showModal}
					close={this.close}
					message={this.state.message}
					successful={this.state.successful}
				/>
				<Overlay
					show={this.state.showSubmitOverlay}
					target={this.state.overlayTarget}
					placement="bottom"
					container={this}
					containerPadding={20}
				>
					<Popover id="popover-contained" title="Input fields are not valid">
						Please make sure that the passwords  are valid and match each other before submitting.
					</Popover>
				</Overlay>
			</div>
		);
	}
}


// EXPORTS //

export default NewPassword;
