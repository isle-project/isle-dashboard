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
import { withTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import axios from 'axios';
import server from 'constants/server.js';
import 'css/login.css';


// FUNCTIONS //

const createTooltip = ( str ) => {
	return <Tooltip id="tooltip">{str}</Tooltip>;
};


// VARIABLES //

const MsgModal = ( props ) => (
	<Modal show={props.show} onHide={props.close} >
		<Modal.Header>
			<Modal.Title>Registration Completion</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{props.message}
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={props.close}>
				{props.t('common:close')}
			</Button>
		</Modal.Footer>
	</Modal>
);

MsgModal.propTypes = {
	close: PropTypes.func.isRequired,
	message: PropTypes.string.isRequired,
	show: PropTypes.bool.isRequired
};


// MAIN //

class CompleteRegistration extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			name: '',
			password: '',
			passwordRepeat: '',
			showModal: false
		};
	}

	handleSubmit = async ( event ) => {
		event.preventDefault();
		if ( this.getPasswordValidationState() && this.getNameValidationState() ) {
			try {
				const hash = window.location.hash.substring( 24 );
				const qs = queryString.parse( hash );
				const token = qs[ 'token' ];
				const res = await axios.post( server+'/complete_registration', {
					id: token,
					newName: this.state.name,
					newPassword: this.state.password
				});
				this.setState({
					message: res.data.message,
					showModal: true
				});
			} catch ( err ) {
				let msg;
				if ( err.response ) {
					msg = 'Server response: ' + err.response.status + '.\n';
					msg += err.response.data;
				} else {
					msg = err.message;
				}
				this.setState({
					message: msg,
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
		return false;
	}

	handleInputChange = ( event ) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[ name ]: value
		});
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
		this.props.history.replace( '/' );
	}

	getNameValidationState = () => {
		return this.state.name.length > 3;
	}

	renderName() {
		const { t } = this.props;
		return (
			<OverlayTrigger placement="right" overlay={createTooltip( t('signup:name-tooltip') )}>
				<FormGroup
					controlId="form-name"
				>
					<Row>
						<Col sm={3}>
							<FormLabel>{t('common:name')}</FormLabel>
						</Col>
						<Col sm={9}>
							<FormControl
								name="name"
								type="text"
								placeholder={t('enter-name')}
								onChange={this.handleInputChange}
								isInvalid={this.state.name && !this.getNameValidationState()}
							/>
							<Form.Control.Feedback type="invalid">
								{t('signup:invalid-name')}
							</Form.Control.Feedback>
						</Col>
					</Row>
				</FormGroup>
			</OverlayTrigger>
		);
	}

	renderPassword() {
		const enteredPasswords = this.state.password || this.state.passwordRepeat;
		const validPasswords = this.getPasswordValidationState();
		return (
			<Fragment>
				<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter a new password with at least six characters' )}>
					<FormGroup
						controlId="form-password"
					>
						<Row>
							<Col sm={3}>
								<FormLabel>{this.props.t('common:password')}</FormLabel>
							</Col>
							<Col sm={9}>
								<FormControl
									name="password"
									type="password"
									placeholder={this.props.t('common:choose-new-password')}
									onChange={this.handleInputChange}
									maxLength={30}
									minLength={6}
									autoComplete="new-password"
									isInvalid={enteredPasswords && !validPasswords}
								/>
								<FormControl.Feedback type="invalid">
									Please enter a new password with at least six characters.
								</FormControl.Feedback>
							</Col>
						</Row>
					</FormGroup>
				</OverlayTrigger>
				<FormGroup
					controlId="form-password-confirmation"
				>
					<Row>
						<Col sm={{ span: 9, offset: 3 }} >
							<FormControl
								name="passwordRepeat"
								type="password"
								placeholder={this.props.t('signup:confirm-password')}
								onChange={this.handleInputChange}
								maxLength={30}
								minLength={6}
								autoComplete="new-password"
								isInvalid={enteredPasswords && !validPasswords}
							/>
							<FormControl.Feedback type="invalid">
								{this.props.t('signup:invalid-password')}
							</FormControl.Feedback>
						</Col>
					</Row>
				</FormGroup>
			</Fragment>
		);
	}

	render() {
		const { settings } = this.props;
		return (
			<div>
				<div className="login">
					<Card style={{ opacity: 0.9 }}>
						<Card.Header>
							<Card.Title as="h1">
								<small>Complete Registration</small>
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<Form>
								{this.renderName()}
								{this.renderPassword()}
								<FormGroup>
									<Button
										variant="primary"
										type="submit"
										onClick={this.handleSubmit}
										className="centered"
										disabled={!this.getNameValidationState() || !this.getPasswordValidationState()}
									>Confirm</Button>
								</FormGroup>
							</Form>
						</Card.Body>
					</Card>
				</div>
				{ this.state.showModal ? <MsgModal
					show={this.state.showModal}
					close={this.close}
					message={this.state.message}
					t={this.props.t}
				/> : null }
				<Overlay
					show={this.state.showSubmitOverlay}
					target={this.state.overlayTarget}
					placement="bottom"
					containerPadding={20}
				>
					<Popover id="popover-contained" title="Input fields are not valid">
						Please make sure that the passwords are valid and match each other before submitting.
					</Popover>
				</Overlay>
				{settings.brandingLogo ? <img
					className="login-branding-logo"
					src={settings.brandingLogo}
					alt="Branded Logo"
				/> : null}
			</div>
		);
	}
}


// PROPERTIES //

CompleteRegistration.propTypes = {
	history: PropTypes.object.isRequired,
	settings: PropTypes.object
};

CompleteRegistration.defaultProps = {
	settings: {}
};


// EXPORTS //

export default withRouter( withTranslation( [ 'common', 'signup' ] )( CompleteRegistration ) );
