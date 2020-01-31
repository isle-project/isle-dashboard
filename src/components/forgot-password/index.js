/**
* Copyright (C) 2016-present The ISLE Authors
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, FormLabel, FormControl, FormGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import isEmail from '@stdlib/assert/is-email-address';
import 'css/login.css';


// MAIN //

class ForgotPassword extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			email: ''
		};
	}

	handleClick = ( event ) => {
		event.preventDefault();
		this.props.forgotPassword({
			email: this.state.email
		});
	}

	render() {
		return (
			<div className="login">
				<Card style={{ boxShadow: '0 0 8px rgba(0,0,0,0.3)', borderRadius: '6px', opacity: 0.98, background: 'rgba(255,255,255,0.75)' }}>
					<Card.Header>
						<Card.Title as="h3">Forgot password?</Card.Title>
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
								<Button disabled={!isEmail( this.state.email )} onClick={this.handleClick} variant="primary" type="submit">Reset</Button>
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


// PROPERTIES //

ForgotPassword.propTypes = {
	forgotPassword: PropTypes.func.isRequired
};


// EXPORTS //

export default ForgotPassword;
