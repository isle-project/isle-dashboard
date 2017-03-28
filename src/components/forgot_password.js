// MODULES //

import React, { Component } from 'react';
import { Button, Col, ControlLabel, FormControl, FormGroup, Form, Panel } from 'react-bootstrap';
import { Link } from 'react-router';
import './login.css';


// MAIN //

class ForgotPassword extends Component {
	render() {
		return (
			<div className="login">
				<Panel style={{ opacity: 0.9 }}>
					<h3>Forgot password?</h3>
					<Form inline>
						<FormGroup controlId="formHorizontalEmail">
							<ControlLabel>Email Address</ControlLabel>
							{'   '}
							<FormControl type="email" placeholder="Enter Email" />
							{'   '}
							<Button bsStyle="primary" type="submit">Reset</Button>
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
