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

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	Button, Card, Col, Row, FormLabel, FormControl, FormGroup,
	Form, Overlay, Popover
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'css/login.css';


// MAIN //

class Login extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			email: '',
			password: ''
		};
	}

	componentDidMount() {
		const { user } = this.props;
		if ( user && user.loggedIn ) {
			this.props.restoreLogin( user );
			this.props.getEnrollableCohorts( user );
		}
	}

	handleSubmit = ( event ) => {
		event.preventDefault();
		const form = {
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
			this.props.handleLogin( form, ( err, res ) => {
				if ( !err ) {
					const { message, type, token, id } = JSON.parse( res.body );
					if ( message === 'ok' ) {
						this.props.fetchCredentials({ token, id }, ( err, user ) => {
							this.props.getEnrollableCohorts( user );
						});
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
							}, 4000 );
						});
					}
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


// PROPERTIES //

Login.propTypes = {
	fetchCredentials: PropTypes.func.isRequired,
	handleLogin: PropTypes.func.isRequired
};


// EXPORTS //

export default Login;
