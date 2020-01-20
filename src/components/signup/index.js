// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Row, FormLabel, FormControl, FormGroup, Form, OverlayTrigger, Overlay, Popover, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logger from 'debug';
import isEmail from '@stdlib/assert/is-email-address';
import MessageModal from './message_modal.js';
import 'css/login.css';


// FUNCTIONS //

const createTooltip = ( str ) => {
	return <Tooltip id="tooltip">{str}</Tooltip>;
};

const extractUserData = ({ name, email, password }) => {
	return { name, email, password };
};


// VARIABLES //

const debug = logger( 'isle-dashboard:signup' );


// MAIN //

class Signup extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			name: '',
			email: '',
			password: '',
			passwordRepeat: '',
			showModal: false
		};
	}

	handleSubmit = ( event ) => {
		event.preventDefault();
		if (
			this.getEmailValidationState() &&
			this.getNameValidationState() &&
			this.getPasswordValidationState()
		) {
			this.props.createUser( extractUserData( this.state ), ( err, res ) => {
				if ( err ) {
					debug( 'Encountered an error: ' + err.message );
					return this.setState({
						message: 'The server appears to be down. Please try again later.',
						successful: false,
						showModal: true
					});
				}
				if ( res.statusCode !== 200 ) {
					return this.setState({
						message: res.body,
						successful: false,
						showModal: true
					});
				}
				const body = JSON.parse( res.body );
				return this.setState({
					message: body.message,
					successful: true,
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

	getEmailValidationState = () => {
		return isEmail( this.state.email );
	}

	getNameValidationState = () => {
		return this.state.name.length > 3;
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
		this.setState({
			showModal: false
		});
	}

	renderEmail() {
		return ( <OverlayTrigger placement="right" overlay={createTooltip( 'Please enter a valid email address.' )}>
			<FormGroup
				controlId="form-email"
			>
				<Row>
					<Col sm={3}>
						<FormLabel>Email</FormLabel>
					</Col>
					<Col sm={9}>
						<FormControl
							name="email"
							type="email"
							autoComplete="username email"
							placeholder="Enter Email"
							onChange={this.handleInputChange}
							isInvalid={this.state.email && !this.getEmailValidationState()}
						/>
						<Form.Control.Feedback type="invalid">
							Not a valid email address.
						</Form.Control.Feedback>
					</Col>
				</Row>
			</FormGroup>
		</OverlayTrigger> );
	}

	renderName() {
		return (
			<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter your name.' )}>
				<FormGroup
					controlId="form-name"
				>
					<Row>
						<Col sm={3}>
							<FormLabel>Name</FormLabel>
						</Col>
						<Col sm={9}>
							<FormControl
								name="name"
								type="text"
								placeholder="Enter Name"
								onChange={this.handleInputChange}
								isInvalid={this.state.name && !this.getNameValidationState()}
							/>
							<Form.Control.Feedback type="invalid">
								Name must contain four characters.
							</Form.Control.Feedback>
						</Col>
					</Row>
				</FormGroup>
			</OverlayTrigger>
		);
	}

	renderPasswordFields() {
		const validPasswords = this.getPasswordValidationState();
		const enteredPasswords = this.state.password || this.state.passwordRepeat;
		return (
			<Fragment>
				<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter a password of your choosing with at least six characters' )}>
					<FormGroup
						controlId="form-password"
					>
						<Row>
							<Col sm={3}>
								<FormLabel>Password</FormLabel>
							</Col>
							<Col sm={9}>
								<FormControl
									name="password"
									type="password"
									autoComplete="new-password"
									placeholder="Choose Password"
									onChange={this.handleInputChange}
									maxLength={30}
									minLength={6}
									isInvalid={enteredPasswords && !validPasswords}
								/>
								<Form.Control.Feedback type="invalid">
									Please enter a new password with at least six characters.
								</Form.Control.Feedback>
							</Col>
						</Row>
					</FormGroup>
				</OverlayTrigger>
				<FormGroup
					controlId="form-repeat-password"
				>
					<Row>
						<Col sm={{ span: 9, offset: 3 }}>
							<FormControl
								name="passwordRepeat"
								type="password"
								autoComplete="new-password"
								placeholder="Confirm Password"
								onChange={this.handleInputChange}
								maxLength={30}
								minLength={6}
								isInvalid={enteredPasswords && !validPasswords}
							/>
							<Form.Control.Feedback type="invalid">
								Passwords do not match.
							</Form.Control.Feedback>
						</Col>
					</Row>
				</FormGroup>
			</Fragment>
		);
	}

	render() {
		return (
			<Fragment>
				<div className="login">
					<Card style={{ boxShadow: '0 0 8px rgba(0,0,0,0.3)', borderRadius: '6px', opacity: 0.98, background: 'rgba(255,255,255,0.75)' }}>
						<Card.Header>
							<Card.Title as="h1" style={{ textAlign: 'center' }}>
								ISLE <small>Dashboard</small>
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Form>
								{this.renderEmail()}
								{this.renderName()}
								{this.renderPasswordFields()}
								<FormGroup>
									<Button
										variant="primary"
										className="centered"
										type="submit"
										onClick={this.handleSubmit}
									>Sign up</Button>
								</FormGroup>
							</Form>
						</Card.Body>
						<Card.Footer style={{ background: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>
							<Link to="/forgot-password">Forgot password?</Link>
							<span> | </span>
							<Link to="/login">Log in</Link>
						</Card.Footer>
					</Card>
				</div>
				<MessageModal
					show={this.state.showModal}
					close={this.close}
					message={this.state.message}
					successful={this.state.successful}
				/>
				<Overlay
					show={this.state.showSubmitOverlay}
					target={this.state.overlayTarget}
					placement="right"
					containerPadding={20}
				>
					<Popover id="popover-contained" title="Input fields are not valid">
						Please make sure that all input values are valid before submitting.
					</Popover>
				</Overlay>
			</Fragment>
		);
	}
}


// PROPERTIES //

Signup.propTypes = {
	createUser: PropTypes.func.isRequired
};


// EXPORTS //

export default Signup;
