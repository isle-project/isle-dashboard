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

import React, { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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

/**
 * Renders a modal confirming that the user has completed the registration process.
 *
 * @param {Object} props - component props
 * @param {boolean} props.show - boolean indicating whether the modal is visible
 * @param {Function} props.close - callback to invoke when the modal is closed
 * @param {string} props.message - message to display in the modal
 * @returns {ReactElement} modal component
 */
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

/**
 * A component which allows a user to complete their registration by choosing a password and entering their name.
 *
 * @param {Object} props - component properties
 * @param {Object} props.settings - ISLE instance settings
 * @returns {ReactElement} component
 */
const CompleteRegistration = ({ settings }) => {
	const [ name, setName ] = useState( '' );
	const [ password, setPassword ] = useState( '' );
	const [ passwordRepeat, setPasswordRepeat ] = useState( '' );
	const [ modal, setModal ] = useState({
		show: false,
		message: ''
	});
	const [ submitOverlay, setSubmitOverlay ] = useState({
		show: false,
		target: null
	});
	const { t } = useTranslation([ 'common', 'signup' ]);
	const navigate = useNavigate();

	const validateName = () => {
		return name && name.length > 3;
	};
	const validatePasswords = () => {
		if ( password.length < 6 || passwordRepeat.length === 0 ) {
			return false;
		}
		if ( password !== passwordRepeat ) {
			return false;
		}
		return true;
	};
	const handleNameChange = ( event ) => {
		setName( event.target.value );
	};
	const handlePasswordChange = ( event ) => {
		setPassword( event.target.value );
	};
	const handlePasswordRepeatChange = ( event ) => {
		setPasswordRepeat( event.target.value );
	};
	const handleSubmit = async ( event ) => {
		event.preventDefault();
		if ( validatePasswords() && validateName() ) {
			try {
				const hash = window.location.hash.substring( 24 );
				const qs = queryString.parse( hash );
				const token = qs[ 'token' ];
				const res = await axios.post( server+'/complete_registration', {
					id: token,
					newName: name,
					newPassword: password
				});
				setModal({
					show: true,
					message: res.data.message
				});
			} catch ( err ) {
				let msg;
				if ( err.response ) {
					msg = 'Server response: ' + err.response.status + '.\n';
					msg += err.response.data;
				} else {
					msg = err.message;
				}
				setModal({
					show: true,
					message: msg
				});
			}
		} else {
			setSubmitOverlay({
				show: true,
				target: event.target
			});
			setTimeout( () => {
				setSubmitOverlay({
					show: false,
					target: null
				});
			}, 4000 );
		}
		return false;
	};
	const handleClose = () => {
		navigate( '/' );
	};
	const renderedName = <OverlayTrigger placement="right" overlay={createTooltip( t('signup:name-tooltip') )}>
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
						onChange={handleNameChange}
						isInvalid={name && !validateName()}
					/>
					<Form.Control.Feedback type="invalid">
						{t('signup:invalid-name')}
					</Form.Control.Feedback>
				</Col>
			</Row>
		</FormGroup>
	</OverlayTrigger>;
	const enteredPasswords = password || passwordRepeat;
	const validPasswords = validatePasswords();
	const renderedPassword = <Fragment>
		<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter a new password with at least six characters' )}>
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
							placeholder={t('common:choose-new-password')}
							onChange={handlePasswordChange}
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
						placeholder={t('signup:confirm-password')}
						onChange={handlePasswordRepeatChange}
						maxLength={30}
						minLength={6}
						autoComplete="new-password"
						isInvalid={enteredPasswords && !validPasswords}
					/>
					<FormControl.Feedback type="invalid">
						{t('signup:invalid-password')}
					</FormControl.Feedback>
				</Col>
			</Row>
		</FormGroup>
	</Fragment>;
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
							{renderedName}
							{renderedPassword}
							<FormGroup>
								<Button
									variant="primary"
									type="submit"
									onClick={handleSubmit}
									className="centered"
									disabled={!validateName() || !validPasswords}
								>Confirm</Button>
							</FormGroup>
						</Form>
					</Card.Body>
				</Card>
			</div>
			{ modal.show ? <MsgModal
				show={modal.show}
				close={handleClose}
				message={modal.message}
				t={t}
			/> : null }
			<Overlay
				show={submitOverlay.show}
				target={submitOverlay.target}
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
};


// PROPERTIES //

CompleteRegistration.propTypes = {
	settings: PropTypes.object
};

CompleteRegistration.defaultProps = {
	settings: {}
};


// EXPORTS //

export default CompleteRegistration;
