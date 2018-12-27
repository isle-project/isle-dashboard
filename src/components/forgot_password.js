// MODULES //

import React, { Component } from 'react';
import { Button, Card, FormLabel, FormControl, FormGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import request from 'request';
import server from './../constants/server';
import './login/login.css';


// MAIN //

class ForgotPassword extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			email: ''
		};

		this.handleClick = ( event ) => {
			event.preventDefault();
			request.get( server+'/forgot_password', {
				qs: {
					email: this.state.email
				}
			}, ( error, res ) => {
				if ( error ) {
					return this.props.addNotification({ message: error.message, level: 'error' });
				}
				if ( res.statusCode >= 400 ) {
					return this.props.addNotification({ message: res.body, level: 'error' });
				}
				this.props.addNotification({ message: 'Check your email inbox for a link to choose a new password.', level: 'success' });
			});
		};
	}

	render() {
		return (
			<div className="login">
				<Card style={{ boxShadow: '0 0 8px rgba(0,0,0,0.3)', borderRadius: '6px', opacity: 0.98, background: 'rgba(255,255,255,0.75)' }}>
					<Card.Header>
						<Card.Title as="h5">Forgot password?</Card.Title>
					</Card.Header>
					<Card.Body>
						<Form inline>
							<FormGroup controlId="form-email">
								<FormLabel>Email Address</FormLabel>
								<FormControl
									type="email"
									placeholder="Enter Email"
									value={this.state.email}
									onChange={( event )=>{
										const target = event.target;
										const value = target.value;
										this.setState({
											email: value
										});
									}}
									style={{
										marginLeft: '10px',
										marginRight: '6px'
									}}
								/>
								<Button onClick={this.handleClick} variant="primary" type="submit">Reset</Button>
							</FormGroup>
						</Form>
					</Card.Body>
					<Card.Footer style={{ background: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>
						<Link to="/signup">Sign up</Link>
						<span> | </span>
						<Link to="/login">Log in</Link>
					</Card.Footer>
				</Card>
			</div>
		);
	}
}


// PROPERTY TYPES //

ForgotPassword.propTypes = {
	addNotification: PropTypes.func.isRequired
};


// EXPORTS //

export default ForgotPassword;
