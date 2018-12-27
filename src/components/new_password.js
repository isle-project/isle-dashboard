// MODULES //

import React, { Component } from 'react';
import { Button, Card, Col, FormLabel, FormControl, FormGroup, Form, Modal, OverlayTrigger, Overlay, Popover, Tooltip } from 'react-bootstrap';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import request from 'request';
import server from './../constants/server';
import './login/login.css';


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

MsgModal.propTypes = {
	close: PropTypes.func.isRequired,
	message: PropTypes.string.isRequired,
	show: PropTypes.bool.isRequired
};


// MAIN //

class NewPassword extends Component {
	constructor( props ) {
		super( props );

		const hash = window.location.hash.substring( 15 );
		const qs = queryString.parse( hash );
		const token = qs[ 'token' ];
		this.state = {
			password: '',
			passwordRepeat: '',
			showModal: false,
			token: token
		};

		this.handleSubmit = ( event ) => {
			event.preventDefault();
			if (
				this.getPasswordValidationState() === 'success'
			) {
				request.post( server+'/update_user_password', {
					form: {
						id: this.state.token,
						newPassword: this.state.password
					}
				}, ( err, res ) => {
					let msg;
					if ( err ) {
						msg = err.message;
					}
					else if ( res.statusCode === 404 ) {
						msg = 'User does not exist';
					}
					else if ( res.statusCode === 200 ) {
						const body = JSON.parse( res.body );
						msg = body.message;
					}
					this.setState({
						message: msg,
						showModal: true
					});
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
			this.props.history.replace( '/' );
		};
	}

	render() {
		return (
			<div>
				<div className="login">
					<Card style={{ opacity: 0.9 }}>
						<Card.Title>
							<small>Choose a new Password</small>
						</Card.Title>
						<Form horizontal>
							<FormGroup>
								<Col sm={2}>
									<FormLabel>Token</FormLabel>
								</Col>
								<Col sm={10}>
									<FormControl
										name="token"
										type="token"
										onChange={this.handleInputChange}
										value={this.state.token}
									/>
								</Col>
							</FormGroup>
							<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter a new password with at least six characters' )}>
								<FormGroup
									controlId="form-horizontal-password"
									validationState={this.getPasswordValidationState()}
								>
									<Col sm={2}>
										<FormLabel>Password</FormLabel>
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
								controlId="form-horizontal-password-confirmation"
								validationState={this.getPasswordValidationState()}
							>
								<Col sm={{ span: 10, offset: 2 }}>
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
								<Button
									variant="primary"
									type="submit"
									onClick={this.handleSubmit}
									className="centered"
								>Confirm</Button>
							</FormGroup>
						</Form>
					</Card>
				</div>
				<MsgModal
					show={this.state.showModal}
					close={this.close}
					message={this.state.message}
				/>
				<Overlay
					show={this.state.showSubmitOverlay}
					target={this.state.overlayTarget}
					placement="bottom"
					container={this}
					containerPadding={20}
				>
					<Popover id="popover-contained" title="Input fields are not valid">
						Please make sure that the passwords are valid and match each other before submitting.
					</Popover>
				</Overlay>
			</div>
		);
	}
}


// PROPERTY TYPES //

NewPassword.propTypes = {
	history: PropTypes.object.isRequired
};


// EXPORTS //

export default withRouter( NewPassword );
