// MODULES //

import React, { Component, Fragment } from 'react';
import {
	Button, Card, Col, Row, FormLabel, FormControl, FormGroup,
	Form, Overlay, Popover
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import request from 'request';
import server from './../../constants/server';
import './login.css';


// MAIN //

class Login extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			email: '',
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

		this.handleSubmit = ( event ) => {
			event.preventDefault();
			let form = {
				password: this.state.password,
				email: this.state.email
			};
			if ( form.email === '' ) {
				this.setState({
					showInputOverlay: true,
					overlayTarget: this.emailInput,
					invalidInputMessage: 'Enter your email address.'
				});
			}
			else if ( form.password === '' ) {
				this.setState({
					showInputOverlay: true,
					overlayTarget: this.passwordInput,
					invalidInputMessage: 'Enter your password.'
				});
			}
			else {
				request.post( server+'/login', {
					form
				}, ( err, res ) => {
					if ( !err ) {
						const { message, type, token, id } = JSON.parse( res.body );
						if ( message === 'ok' ) {
							this.props.handleLogin({ token, id });
						} else {
							this.setState({
								showInputOverlay: true,
								overlayTarget: type === 'no_user' ? this.emailInput : this.passwordInput,
								invalidInputMessage: message
							}, () => {
								setTimeout( () => {
									this.setState({
										showInputOverlay: false
									});
								}, 2000 );
							});
						}
					}
				});
			}
		};
	}

	render() {
		return (
			<Fragment>
				<div className="login"><Card className="login-panel">
					<Card.Header>
						<Card.Title as="h1" style={{ textAlign: 'center' }}>
							ISLE <small>Dashboard</small>
						</Card.Title>
					</Card.Header>
					<Card.Body>
						<Form>
							<FormGroup controlId="form-email">
								<Row>
									<Col sm={3}>
										<FormLabel>Email</FormLabel>
									</Col>
									<Col sm={9}>
										<FormControl
											name="email"
											type="email"
											autoComplete="isle-email"
											placeholder="Email"
											onChange={this.handleInputChange}
											ref={( input ) => { this.emailInput = input; }}
										/>
									</Col>
								</Row>
							</FormGroup>
							<FormGroup controlId="form-password">
								<Row>
									<Col sm={3}>
										<FormLabel>Password</FormLabel>
									</Col>
									<Col sm={9}>
										<FormControl
											name="password"
											type="password"
											autoComplete="isle-password"
											placeholder="Password"
											onChange={this.handleInputChange}
											ref={( input ) => { this.passwordInput = input; }}
										/>
									</Col>
								</Row>
							</FormGroup>
							<FormGroup>
								<Button
									className="centered"
									variant="primary"
									onClick={this.handleSubmit}
									type="submit"
								>Sign in</Button>
							</FormGroup>
						</Form>
					</Card.Body>
					<Card.Footer style={{ background: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>
						<Link to="/forgot-password">Forgot password?</Link>
						<span> | </span>
						<Link to="/signup">Sign up</Link>
					</Card.Footer>
				</Card></div>
				<Overlay
					show={this.state.showInputOverlay}
					target={this.state.overlayTarget}
					placement="right"
					container={this}
					containerPadding={20}
				>
					<Popover id="popover-contained" title="Not valid">
						{this.state.invalidInputMessage}
					</Popover>
				</Overlay>
			</Fragment>
		);
	}
}


// PROPERTY TYPES //

Login.propTypes = {
	handleLogin: PropTypes.func.isRequired
};


// EXPORTS //

export default Login;
