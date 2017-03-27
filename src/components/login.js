// MODULES //

import React, { Component } from 'react';
import { Button, ButtonGroup, Col, Row, ControlLabel, FormControl, FormGroup, Form, PageHeader, Panel } from 'react-bootstrap';
import { Link } from 'react-router';
import './login.css';


// MAIN //

class Login extends Component {
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
								<FormControl type="email" placeholder="Email" />
							</Col>
						</FormGroup>
						<FormGroup controlId="formHorizontalPassword">
							<Col componentClass={ControlLabel} sm={2}>
								Password
							</Col>
							<Col sm={10}>
								<FormControl type="password" placeholder="Password" />
							</Col>
						</FormGroup>
						<FormGroup>
							<Button bsStyle="primary" type="submit">Sign in</Button>
						</FormGroup>
					</Form>
					<div style={{ marginTop: 20 }}>
						<span style={{ float: 'right' }}>
							<Link to="/forgot-password">Forgot password?</Link>
							<span> | </span>
							<Link to="/signup">Sign up</Link>
						</span>
					</div>
				</Panel>
			</div>
		);
	}
}


// EXPORTS //

export default Login;
