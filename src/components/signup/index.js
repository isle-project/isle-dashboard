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
import { Trans, withTranslation } from 'react-i18next';
import SelectInput from 'react-select';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link } from 'react-router-dom';
import logger from 'debug';
import isEmail from '@stdlib/assert/is-email-address';
import MessageModal from './message_modal.js';
import 'css/login.css';


// FUNCTIONS //

const createTooltip = ( str ) => {
	return <Tooltip id="tooltip">{str}</Tooltip>;
};

const extractUserData = ({ name, email, password, customFields }) => {
	return { name, email, password, customFields };
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
			showModal: false,
			customFields: {}
		};
	}

	componentDidMount() {
		this.props.getCustomFields();
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
						<FormLabel>{t('common:email')}</FormLabel>
					</Col>
					<Col sm={9}>
						<FormControl
							name="email"
							type="email"
							autoComplete="username email"
							placeholder={t('common:enter-email')}
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
							<FormLabel>{t('common:name')}</FormLabel>
						</Col>
						<Col sm={9}>
							<FormControl
								name="name"
								type="text"
								placeholder={t('common:enter-name')}
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
								<FormLabel>{t('common:password')}</FormLabel>
							</Col>
							<Col sm={9}>
								<FormControl
									name="password"
									type="password"
									autoComplete="new-password"
									placeholder={t('choose-password')}
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
						<Col sm={3}>
							<FormLabel>{t('common:repeat')}</FormLabel>
						</Col>
						<Col sm={{ span: 9 }}>
							<FormControl
								name="passwordRepeat"
								type="password"
								autoComplete="new-password"
								placeholder={t('confirm-password')}
								onChange={this.handleInputChange}
								maxLength={30}
								minLength={6}
								isInvalid={enteredPasswords && !validPasswords}
							/>
							<Form.Control.Feedback type="invalid">
								{t('invalid-password-match')}
							</Form.Control.Feedback>
						</Col>
					</Row>
				</FormGroup>
			</Fragment>
		);
	}

	render() {
		const { t, settings } = this.props;
		const userCustomFields = this.state.customFields;
		const availableCustomFields = this.props.user.availableCustomFields || [];
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
								{availableCustomFields.filter( x => x.editableOnSignup ).map( ( x, idx ) => {
									let input;
									const value = userCustomFields[ x.name ];
									if ( x.type === 'checkbox' ) {
										input = <FormGroup
											controlId={`form-${x.name}`}
											as={Row}
										>
											<Col sm={3}></Col>
											<Col sm={3}>
												<Form.Check
													type="checkbox"
													label={x.name}
													defaultChecked={value}
													onChange={( event ) => {
														const newCustomFields = { ...this.state.customFields };
														newCustomFields[ x.name ] = event.target.checked;
														this.setState({
															customFields: newCustomFields,
															changed: true
														});
													}}
												/>
											</Col>
										</FormGroup>;
									} else if ( x.type === 'text' ) {
										input = <FormGroup
											controlId={`form-${x.name}`}
											as={Row}
										>
											<Col sm={3}>
												<FormLabel>{x.name}</FormLabel>
											</Col>
											<Col sm={9} >
												<FormControl
													name={x.name}
													type="text"
													value={value}
													placeholder={`Enter ${x.name}...`}
													onChange={( event ) => {
														const newCustomFields = { ...this.state.customFields };
														newCustomFields[ x.name ] = event.target.value;
														this.setState({
															customFields: newCustomFields,
															changed: true
														});
													}}
													autoComplete="none"
												/>
											</Col>
										</FormGroup>;
									} else {
										// Case: dropdown menu
										input = <FormGroup
											controlId={`form-${x.name}`}
											as={Row}
										>
											<Col sm={3}>
												<FormLabel>{x.name}</FormLabel>
											</Col>
											<Col sm={9}>
												<SelectInput
													defaultValue={value ?
														{ label: value, value: value } :
														null
													}
													options={x.options.map( e => {
														return { value: e, label: e };
													})}
													onChange={( elem ) => {
														const newCustomFields = { ...this.state.customFields };
														newCustomFields[ x.name ] = elem.value;
														this.setState({
															customFields: newCustomFields,
															changed: true
														});
													}}
												/>
											</Col>
										</FormGroup>;
									}
									return (
										<OverlayTrigger key={idx} placement="top" overlay={createTooltip( x.description )} >
											{input}
										</OverlayTrigger>
									);
								})}
								<p>
									<Trans i18nKey="signup:tos-disclaimer" >
										Through clicking the signup button you agree to our <Link to="/terms">terms of service</Link>. Learn more about how your data is processed in our <Link to="/privacy" >privacy policy</Link>.
									</Trans>
								</p>
								<FormGroup>
									<Button
										variant="primary"
										className="centered"
										type="submit"
										onClick={this.handleSubmit}
									>{t('common:register')}</Button>
								</FormGroup>
							</Form>
						</Card.Body>
						<Card.Footer style={{ background: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>
							<Link to="/forgot-password">{t('common:forgot-password')}</Link>
							<span> | </span>
							<Link to="/login">{t('common:login')}</Link>
						</Card.Footer>
					</Card>
					{settings.brandingLogo ? <img
						className="login-branding-logo"
						src={settings.brandingLogo}
						alt="Branded Logo"
					/> : null}
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
	createUser: PropTypes.func.isRequired,
	getCustomFields: PropTypes.func.isRequired,
	settings: PropTypes.object,
	user: PropTypes.object
};

Signup.defaultProps = {
	settings: {},
	user: {}
};


// EXPORTS //

export default withTranslation( [ 'signup', 'common' ] )( Signup );
