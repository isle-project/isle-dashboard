/**
* Copyright (C) 2016-2020 The ISLE Authors
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

import React, { Component } from 'react';
import { Button, Card, Col, Row, FormLabel, FormControl, FormGroup, Form, Modal, OverlayTrigger, Overlay, Popover, Tooltip } from 'react-bootstrap';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import request from 'request';
import server from 'constants/server';
import 'css/login.css';


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
	}

	handleSubmit = ( event ) => {
		event.preventDefault();
		if ( this.getPasswordValidationState() ) {
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
				}, 4000 );
			});
		}
		return false;
	}

	handleInputChange = ( event ) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[ name ]: value
		});
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

	close = () => {
		this.props.history.replace( '/' );
	}

	render() {
		const enteredPasswords = this.state.password || this.state.passwordRepeat;
		const validPasswords = this.getPasswordValidationState();
		return (
			<div>
				<div className="login">
					<Card style={{ opacity: 0.9 }}>
						<Card.Header>
							<Card.Title as="h1">
								<small>Choose a new Password</small>
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Form>
								<FormGroup>
									<Row>
										<Col sm={2}>
											<FormLabel>Token</FormLabel>
										</Col>
										<Col sm={10}>
											<OverlayTrigger placement="right" overlay={createTooltip( 'User token. Do not change if pre-filled.' )}>
												<FormControl
													name="token"
													type="token"
													onChange={this.handleInputChange}
													value={this.state.token}
												/>
											</OverlayTrigger>
										</Col>
									</Row>
								</FormGroup>
								<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter a new password with at least six characters' )}>
									<FormGroup
										controlId="form-password"
									>
										<Row>
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
													autoComplete="new-password"
													isInvalid={enteredPasswords && !validPasswords}
												/>
												<FormControl.Feedback type="invalid">
													Please enter a new password with at least six characters.
												</FormControl.Feedback>
											</Col>
										</Row>
									</FormGroup>
								</OverlayTrigger>
								<FormGroup
									controlId="form-password-confirmation"
								>
									<Row>
										<Col sm={{ span: 10, offset: 2 }}>
											<FormControl
												name="passwordRepeat"
												type="password"
												placeholder="Confirm new password"
												onChange={this.handleInputChange}
												maxLength={30}
												minLength={6}
												autoComplete="new-password"
												isInvalid={enteredPasswords && !validPasswords}
											/>
											<FormControl.Feedback type="invalid">
												Passwords do not match.
											</FormControl.Feedback>
										</Col>
									</Row>
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
						</Card.Body>
					</Card>
				</div>
				{ this.state.showModal ? <MsgModal
					show={this.state.showModal}
					close={this.close}
					message={this.state.message}
				/> : null }
				<Overlay
					show={this.state.showSubmitOverlay}
					target={this.state.overlayTarget}
					placement="bottom"
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


// PROPERTIES //

NewPassword.propTypes = {
	history: PropTypes.object.isRequired
};


// EXPORTS //

export default withRouter( NewPassword );
