// MODULES //

import React, { Component, Fragment } from 'react';
import { Button, Card, Col, Row, FormLabel, FormControl, FormGroup, Form, Modal, OverlayTrigger, Overlay, Popover, Tooltip } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import logger from 'debug';
import request from 'request';
import server from './../constants/server';
import './login/login.css';


// FUNCTIONS //

const createTooltip = ( str ) => {
	return <Tooltip id="tooltip">{str}</Tooltip>;
};

const extractUserData = ({ name, email, password }) => {
	return { name, email, password };
};


// VARIABLES //

const debug = logger( 'isle-dashboard:signup' );
const MsgModal = withRouter( ( props ) => (
	<Modal show={props.show}>
		<Modal.Header>
			<Modal.Title>Create User</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{props.message}
		</Modal.Body>
		<Modal.Footer>
			{ props.successful ?
				<Button onClick={()=>{
					props.history.push( '/login' );
				}}>Go to login page</Button> :
				<Button onClick={props.close}>
					Close
				</Button>
			}
		</Modal.Footer>
	</Modal>
) );


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

		this.handleSubmit = ( event ) => {
			event.preventDefault();
			if (
				this.getEmailValidationState() === 'success' &&
				this.getNameValidationState() === 'success' &&
				this.getPasswordValidationState() === 'success'
			) {
				request.post( server+'/create_user', {
					form: extractUserData( this.state )
				}, ( err, res ) => {
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
					}, 3000 );
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

		this.close = () => {
			this.setState({
				showModal: false
			});
		};
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
								<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter a valid email address.' )}>
									<FormGroup
										controlId="formHorizontalEmail"
										validationState={this.getEmailValidationState()}
									>
										<Row>
											<Col sm={3}>
												<FormLabel>Email</FormLabel>
											</Col>
											<Col sm={9}>
												<FormControl
													name="email"
													type="email"
													placeholder="Enter Email"
													onChange={this.handleInputChange}
												/>
												<FormControl.Feedback />
											</Col>
										</Row>
									</FormGroup>
								</OverlayTrigger>
								<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter your name (minimum three characters).' )}>
									<FormGroup
										controlId="formHorizontalName"
										validationState={this.getNameValidationState()}
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
												/>
												<FormControl.Feedback />
											</Col>
										</Row>
									</FormGroup>
								</OverlayTrigger>
								<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter a password of your choosing with at least six characters' )}>
									<FormGroup
										controlId="formHorizontalPassword"
										validationState={this.getPasswordValidationState()}
									>
										<Row>
											<Col sm={3}>
												<FormLabel>Password</FormLabel>
											</Col>
											<Col sm={9}>
												<FormControl
													name="password"
													type="password"
													placeholder="Choose Password"
													onChange={this.handleInputChange}
													maxLength={30}
													minLength={6}
												/>
												<FormControl.Feedback />
											</Col>
										</Row>
									</FormGroup>
								</OverlayTrigger>
								<FormGroup
									controlId="formHorizontalPasswordConfirmation"
									validationState={this.getPasswordValidationState()}
								>
									<Row>
										<Col sm={{ span: 9, offset: 3 }}>
											<FormControl
												name="passwordRepeat"
												type="password"
												placeholder="Confirm Password"
												onChange={this.handleInputChange}
												maxLength={30}
												minLength={6}
											/>
											<FormControl.Feedback />
										</Col>
									</Row>
								</FormGroup>
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
						Please make sure that all input values are valid before submitting.
					</Popover>
				</Overlay>
			</Fragment>
		);
	}
}


// EXPORTS //

export default Signup;
