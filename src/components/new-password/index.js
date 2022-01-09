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

import React, { useState } from 'react';
import axios from 'axios';
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
import server from 'constants/server';
import 'css/login.css';


// VARIABLES //

const MsgModal = ( props ) => (
	<Modal show={props.show} onHide={props.close}>
		<Modal.Header>
			<Modal.Title>New Password Chosen</Modal.Title>
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
 * Renders a component for choosing a new password.
 *
 * @returns {ReactElement} component
 */
const NewPassword = () => {
	const [ password, setPassword ] = useState( '' );
	const [ passwordRepeat, setPasswordRepeat ] = useState( '' );
	const [ modal, setModal ] = useState({
		message: '',
		show: false
	});
	const [ submitOverlay, setSubmitOverlay ] = useState({
		show: false,
		target: null
	});
	const { t } = useTranslation( [ 'common', 'signup' ] );
	const navigate = useNavigate();

	const validatePasswords = () => {
		if ( password.length < 6 || passwordRepeat.length === 0 ) {
			return false;
		}
		if ( password !== passwordRepeat ) {
			return false;
		}
		return true;
	};
	const handleSubmit = async ( event ) => {
		event.preventDefault();
		if ( validatePasswords() ) {
			const search = window.location.search || window.location.hash.substring( 15 );
			const qs = queryString.parse( search );
			const token = qs[ 'token' ];
			try {
				const res = await axios.post( server+'/update_user_password', {
					id: token,
					newPassword: password
				});
				setModal({
					message: res.data.message,
					show: true
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
					message: msg,
					show: true
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
	const handlePasswordChange = ( event ) => {
		setPassword( event.target.value );
	};
	const handlePasswordRepeatChange = ( event ) => {
		setPasswordRepeat( event.target.value );
	};
	const enteredPasswords = password || passwordRepeat;
	const validPasswords = validatePasswords();
	return (
		<div>
			<div className="login">
				<Card style={{ opacity: 0.9 }}>
					<Card.Header>
						<Card.Title as="h1">
							<small>Choose a new Password</small>
						</Card.Title>
					</Card.Header>
					<Card.Body>
						<Form className="d-grid gap-3" >
							<OverlayTrigger
								placement="right"
								overlay={<Tooltip id="tooltip">Please enter a new password with at least six characters</Tooltip>}
							>
								<FormGroup
									controlId="form-password"
								>
									<Row>
										<Col sm={2}>
											<FormLabel>{t('common:password')}</FormLabel>
										</Col>
										<Col sm={10}>
											<FormControl
												name="password"
												type="password"
												placeholder="Enter new password"
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
									<Col sm={{ span: 10, offset: 2 }}>
										<FormControl
											name="passwordRepeat"
											type="password"
											placeholder="Confirm new password"
											onChange={handlePasswordRepeatChange}
											maxLength={30}
											minLength={6}
											autoComplete="new-password"
											isInvalid={enteredPasswords && !validPasswords}
										/>
										<FormControl.Feedback type="invalid">
											Passwords do not match.
										</FormControl.Feedback>
									</Col>
								</Row>
							</FormGroup>
							<FormGroup>
								<Button
									variant="primary"
									type="submit"
									onClick={handleSubmit}
									className="centered"
								>{t('common:confirm')}</Button>
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
		</div>
	);
};


// PROPERTIES //

NewPassword.propTypes = {};


// EXPORTS //

export default NewPassword;
