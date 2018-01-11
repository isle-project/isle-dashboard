// MODULES //

import React, { Component } from 'react';
import { Button, ControlLabel, FormControl, FormGroup, Form, Panel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import request from 'request';
import server from './../constants/server';
import './login.css';


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
				<Panel style={{ opacity: 0.9 }}>
					<Panel.Body>
						<h3>Forgot password?</h3>
						<Form inline>
							<FormGroup controlId="formHorizontalEmail">
								<ControlLabel>Email Address</ControlLabel>
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
								<Button onClick={this.handleClick} bsStyle="primary" type="submit">Reset</Button>
							</FormGroup>
						</Form>
					</Panel.Body>
					<Panel.Footer style={{ textAlign: 'right' }}>
						<Link to="/signup">Sign up</Link>
						<span> | </span>
						<Link to="/login">Log in</Link>
					</Panel.Footer>
				</Panel>
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
