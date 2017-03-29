// MODULES //

import React, { Component } from 'react';
import { Button, ControlLabel, FormControl, FormGroup, Form, Panel } from 'react-bootstrap';
import { Link } from 'react-router';
import request from 'request';
import './login.css';


// MAIN //

class ForgotPassword extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			email: ''
		};

		this.handleClick = () => {
			request.get( 'http://localhost:3000/forgot_password', {
				qs: {
					email: this.state.email
				}
			}, function( error, response, body ) {
				if ( error ) {
					return error;
				}
				console.log( body );
			});
		};
	}

	render() {
		return (
			<div className="login">
				<Panel style={{ opacity: 0.9 }}>
					<h3>Forgot password?</h3>
					<Form inline>
						<FormGroup controlId="formHorizontalEmail">
							<ControlLabel>Email Address</ControlLabel>
							{'   '}
							<FormControl
								type="email"
								placeholder="Enter Email"
								value={this.state.email}
								onChange={( event )=>{
									const target = event.target;
									const value = target.value;
									this.setState({
										email:  value
									});
								}}
							/>
							{'   '}
							<Button onClick={this.handleClick} bsStyle="primary" type="submit">Reset</Button>
						</FormGroup>
					</Form>
					<div style={{ marginTop: 20 }}>
						<span style={{ float: 'right' }}>
							<Link to="/signup">Sign up</Link>
							<span> | </span>
							<Link to="/login">Log in</Link>
						</span>
					</div>
				</Panel>
			</div>
		);
	}
}


// EXPORTS //

export default ForgotPassword;
