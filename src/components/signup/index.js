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

import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
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

const validateEmail = ( email ) => {
	return isEmail( email );
};

const validateName = ( name ) => {
	return name.length >= 2;
};

const validatePasswords = ( password, passwordRepeat ) => {
	if ( password.length < 6 || passwordRepeat.length === 0 ) {
		return false;
	}
	if ( password !== passwordRepeat ) {
		return false;
	}
	return true;
};


// VARIABLES //

const debug = logger( 'isle-dashboard:signup' );


// MAIN //

/**
 * A screen which allows users to sign up for an account.
 *
 * @param {Object} props - component properties
 * @param {Function} props.createUser - function to create a new user
 * @param {Function} props.getCustomFields - function to get custom fields for a user
 * @param ops.user - user object
 * @param {Object} props.settings - ISLE instance settings
 * @returns {ReactElement} signup screen
 */
const Signup = ({ createUser, getCustomFields, user, settings }) => {
	const { t } = useTranslation( [ 'signup', 'common' ] );
	const [ lastName, setLastName ] = useState( '' );
	const [ firstName, setFirstName ] = useState( '' );
	const [ preferredName, setPreferredName ] = useState( '' );
	const [ email, setEmail ] = useState( '' );
	const [ password, setPassword ] = useState( '' );
	const [ passwordRepeat, setPasswordRepeat ] = useState( '' );
	const [ customFields, setCustomFields ] = useState( {} );
	const [ modal, setModal ] = useState({
		show: false,
		message: '',
		successful: false
	});
	const [ submitOverlay, setSubmitOverlay ] = useState({
		show: false,
		target: null
	});
	useEffect( () => {
		getCustomFields();
	}, [ getCustomFields ] );
	const handleSubmit = async ( event ) => {
		event.preventDefault();
		if (
			validateEmail( email ) &&
			validateName( firstName ) &&
			validateName( lastName ) &&
			( !preferredName || validateName( preferredName ) ) &&
			validatePasswords( password, passwordRepeat )
		) {
			try {
				const res = await createUser({
					firstName, lastName, preferredName, email, password, customFields
				});
				setModal({
					message: res.data.message,
					successful: true,
					show: true
				});
			} catch ( err ) {
				let message;
				if ( err.response ) {
					message = err.response.data;
				} else {
					message = err.message;
				}
				debug( 'Encountered an error: ' + message );
				setModal({
					message,
					successful: false,
					show: true
				});
			}
		} else {
			setSubmitOverlay({
				show: true,
				target: event.target
			}, () => {
				setTimeout( () => {
					setSubmitOverlay({
						show: false,
						target: null
					});
				}, 4000 );
			});
		}
	};
	const close = () => {
		setModal({
			show: false,
			message: '',
			successful: false
		});
	};
	const userCustomFields = customFields;
	const availableCustomFields = user.availableCustomFields || [];
	const validPasswords = validatePasswords( password, passwordRepeat );
	const enteredPasswords = password || passwordRepeat;
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
						<Form className="d-grid gap-3" >
							<OverlayTrigger placement="right" overlay={createTooltip( t('email-tooltip') )}>
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
												onChange={( event ) => {
													setEmail( event.target.value );
												}}
												isInvalid={email && !validateEmail( email )}
											/>
											<Form.Control.Feedback type="invalid">
												{t('invalid-email')}
											</Form.Control.Feedback>
										</Col>
									</Row>
								</FormGroup>
							</OverlayTrigger>
							<OverlayTrigger placement="right" overlay={createTooltip( t('first-name-tooltip') )}>
								<FormGroup
									controlId="form-first-name"
								>
									<Row>
										<Col sm={3}>
											<FormLabel>{t('common:first-name')}</FormLabel>
										</Col>
										<Col sm={9}>
											<FormControl
												name="name"
												type="text"
												placeholder={t('common:enter-first-name')}
												onChange={( event ) => {
													setFirstName( event.target.value );
												}}
												isInvalid={firstName && !validateName( firstName )}
											/>
											<Form.Control.Feedback type="invalid">
												{t('invalid-name')}
											</Form.Control.Feedback>
										</Col>
									</Row>
								</FormGroup>
							</OverlayTrigger>
							<OverlayTrigger placement="right" overlay={createTooltip( t('preferred-name-tooltip') )}>
								<FormGroup
									controlId="form-preferred-name"
								>
									<Row>
										<Col sm={3}>
											<FormLabel>{t('preferred-name')}</FormLabel>
										</Col>
										<Col sm={9}>
											<FormControl
												name="name"
												type="text"
												placeholder={t('common:enter-preferred-name')}
												onChange={( event ) => {
													setPreferredName( event.target.value );
												}}
												isInvalid={preferredName && !validateName( preferredName )}
											/>
											<Form.Control.Feedback type="invalid">
												{t('invalid-name')}
											</Form.Control.Feedback>
										</Col>
									</Row>
								</FormGroup>
							</OverlayTrigger>
							<OverlayTrigger placement="right" overlay={createTooltip( t('last-name-tooltip') )}>
								<FormGroup
									controlId="form-name"
								>
									<Row>
										<Col sm={3}>
											<FormLabel>{t('common:last-name')}</FormLabel>
										</Col>
										<Col sm={9}>
											<FormControl
												name="name"
												type="text"
												placeholder={t('common:enter-last-name')}
												onChange={( event ) => {
													setLastName( event.target.value );
												}}
												isInvalid={lastName && !validateName( lastName )}
											/>
											<Form.Control.Feedback type="invalid">
												{t('invalid-name')}
											</Form.Control.Feedback>
										</Col>
									</Row>
								</FormGroup>
							</OverlayTrigger>
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
												onChange={( event ) => {
													setPassword( event.target.value );
												}}
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
											onChange={( event ) => {
												setPasswordRepeat( event.target.value );
											}}
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
													const newCustomFields = { ...customFields };
													newCustomFields[ x.name ] = event.target.checked;
													setCustomFields( newCustomFields );
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
													const newCustomFields = { ...customFields };
													newCustomFields[ x.name ] = event.target.value;
													setCustomFields( newCustomFields );
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
													const newCustomFields = { ...customFields };
													newCustomFields[ x.name ] = elem.value;
													setCustomFields( newCustomFields );
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
									onClick={handleSubmit}
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
				show={modal.show}
				close={close}
				message={modal.message}
				successful={modal.successful}
			/>
			<Overlay
				show={submitOverlay.show}
				target={submitOverlay.target}
				placement="right"
				containerPadding={20}
			>
				<Popover id="popover-contained" title="Input fields are not valid">
					{t('signup-not-valid')}
				</Popover>
			</Overlay>
		</Fragment>
	);
};


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

export default Signup;
