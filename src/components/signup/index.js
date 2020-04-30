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

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button, Card, Col, Row, FormLabel, FormControl, FormGroup, Form, OverlayTrigger, Overlay, Popover, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logger from 'debug';
import isEmail from '@stdlib/assert/is-email-address';
import MessageModal from './message_modal.js';
import 'css/login.css';


// FUNCTIONS //

const createTooltip = ( str ) => {
	return <Tooltip id="tooltip">{str}</Tooltip>;
};

const extractUserData = ({ name, email, password }) => {
	return { name, email, password };
};


// VARIABLES //

const debug = logger( 'isle-dashboard:signup' );


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
	}

	handleSubmit = async ( event ) => {
		event.preventDefault();
		if (
			this.getEmailValidationState() &&
			this.getNameValidationState() &&
			this.getPasswordValidationState()
		) {
			try {
				const res = await this.props.createUser( extractUserData( this.state ) );
				this.setState({
					message: res.data.message,
					successful: true,
					showModal: true
				});
			} catch ( err ) {
				let message;
				if ( err.response ) {
					message = err.response.data;
				} else {
					message = err.message;
				}
				debug( 'Encountered an error: ' + message );
				this.setState({
					message,
					successful: false,
					showModal: true
				});
			}
		} else {
			this.setState({
				showSubmitOverlay: true,
				overlayTarget: event.target
			}, () => {
				setTimeout( () => {
					this.setState({
						showSubmitOverlay: false
					});
				}, 4000 );
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

	getEmailValidationState = () => {
		return isEmail( this.state.email );
	}

	getNameValidationState = () => {
		return this.state.name.length > 3;
	}

	getPasswordValidationState = () => {
		const { password, passwordRepeat } = this.state;
		if ( password.length < 6 || passwordRepeat.length === 0 ) {
			return false;
		}
		if ( password !== passwordRepeat ) {
			return false;
		}
		return true;
	}

	close = () => {
		this.setState({
			showModal: false
		});
	}

	renderEmail() {
		const { t } = this.props;
		return ( <OverlayTrigger placement="right" overlay={createTooltip( t('email-tooltip') )}>
			<FormGroup
				controlId="form-email"
			>
				<Row>
					<Col sm={3}>
						<FormLabel>{t('email')}</FormLabel>
					</Col>
					<Col sm={9}>
						<FormControl
							name="email"
							type="email"
							autoComplete="username email"
							placeholder="Enter Email"
							onChange={this.handleInputChange}
							isInvalid={this.state.email && !this.getEmailValidationState()}
						/>
						<Form.Control.Feedback type="invalid">
							{t('invalid-email')}
						</Form.Control.Feedback>
					</Col>
				</Row>
			</FormGroup>
		</OverlayTrigger> );
	}

	renderName() {
		const { t } = this.props;
		return (
			<OverlayTrigger placement="right" overlay={createTooltip( t('name-tooltip') )}>
				<FormGroup
					controlId="form-name"
				>
					<Row>
						<Col sm={3}>
							<FormLabel>{t('name')}</FormLabel>
						</Col>
						<Col sm={9}>
							<FormControl
								name="name"
								type="text"
								placeholder="Enter Name"
								onChange={this.handleInputChange}
								isInvalid={this.state.name && !this.getNameValidationState()}
							/>
							<Form.Control.Feedback type="invalid">
								{t('invalid-name')}
							</Form.Control.Feedback>
						</Col>
					</Row>
				</FormGroup>
			</OverlayTrigger>
		);
	}

	renderPasswordFields() {
		const { t } = this.props;
		const validPasswords = this.getPasswordValidationState();
		const enteredPasswords = this.state.password || this.state.passwordRepeat;
		return (
			<Fragment>
				<OverlayTrigger placement="right" overlay={createTooltip( t('password-tooltip') )}>
					<FormGroup
						controlId="form-password"
					>
						<Row>
							<Col sm={3}>
								<FormLabel>{t('password')}</FormLabel>
							</Col>
							<Col sm={9}>
								<FormControl
									name="password"
									type="password"
									autoComplete="new-password"
									placeholder="Choose Password"
									onChange={this.handleInputChange}
									maxLength={30}
									minLength={6}
									isInvalid={enteredPasswords && !validPasswords}
								/>
								<Form.Control.Feedback type="invalid">
									{t('invalid-password')}
								</Form.Control.Feedback>
							</Col>
						</Row>
					</FormGroup>
				</OverlayTrigger>
				<FormGroup
					controlId="form-repeat-password"
				>
					<Row>
						<Col sm={{ span: 9, offset: 3 }}>
							<FormControl
								name="passwordRepeat"
								type="password"
								autoComplete="new-password"
								placeholder="Confirm Password"
								onChange={this.handleInputChange}
								maxLength={30}
								minLength={6}
								isInvalid={enteredPasswords && !validPasswords}
							/>
							<Form.Control.Feedback type="invalid">
								Passwords do not match.
							</Form.Control.Feedback>
						</Col>
					</Row>
				</FormGroup>
			</Fragment>
		);
	}

	render() {
		const { t } = this.props;
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
								{this.renderEmail()}
								{this.renderName()}
								{this.renderPasswordFields()}
								<FormGroup>
									<Button
										variant="primary"
										className="centered"
										type="submit"
										onClick={this.handleSubmit}
									>{t('register')}</Button>
								</FormGroup>
							</Form>
						</Card.Body>
						<Card.Footer style={{ background: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>
							<Link to="/forgot-password">{t('forgot-password')}</Link>
							<span> | </span>
							<Link to="/login">{t('login')}</Link>
						</Card.Footer>
					</Card>
				</div>
				<MessageModal
					show={this.state.showModal}
					close={this.close}
					message={this.state.message}
					successful={this.state.successful}
				/>
				<Overlay
					show={this.state.showSubmitOverlay}
					target={this.state.overlayTarget}
					placement="right"
					containerPadding={20}
				>
					<Popover id="popover-contained" title="Input fields are not valid">
						{t('signup-not-valid')}
					</Popover>
				</Overlay>
			</Fragment>
		);
	}
}


// PROPERTIES //

Signup.propTypes = {
	createUser: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation()( Signup );
