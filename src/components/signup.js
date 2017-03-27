// MODULES //

import React, { Component } from 'react';
import { Button, ButtonGroup, Col, Row, ControlLabel, FormControl, FormGroup, Form, PageHeader, Panel } from 'react-bootstrap';
import SocialButton from 'react-social-button';
import { Link } from 'react-router';
import './login.css';


// MAIN //

class Signup extends Component {
	render() {
		return (
			<div className="login">
				<Panel style={{ opacity: 0.9 }}>
					<PageHeader>ISLE <small>Dashboard</small></PageHeader>
					<Form horizontal>
						<FormGroup controlId="formHorizontalEmail">
							<Col componentClass={ControlLabel} sm={2}>
								Email
							</Col>
							<Col sm={10}>
								<FormControl type="email" placeholder="Enter Email" />
							</Col>
						</FormGroup>
						<FormGroup controlId="formHorizontalName">
							<Col componentClass={ControlLabel} sm={2}>
								Name
							</Col>
							<Col sm={10}>
								<FormControl type="text" placeholder="Enter Name" />
							</Col>
						</FormGroup>
						<FormGroup controlId="formHorizontalPassword">
							<Col componentClass={ControlLabel} sm={2}>
								Password
							</Col>
							<Col sm={10}>
								<FormControl type="password" placeholder="Choose Password" />
							</Col>
						</FormGroup>
						<FormGroup controlId="formHorizontalPassword">
							<Col sm={2}>
							</Col>
							<Col sm={10}>
								<FormControl type="password" placeholder="Confirm Password" />
							</Col>
						</FormGroup>
						<FormGroup>
							<Button bsStyle="primary" type="submit">Sign up</Button>
						</FormGroup>
					</Form>
					<div style={{ marginTop: 20 }}>
						<span style={{ float: 'right' }}>
							<Link to="/forgot-password">Forgot password?</Link>
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

export default Signup;
