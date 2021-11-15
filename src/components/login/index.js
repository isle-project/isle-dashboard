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

import React, { useEffect, useRef, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Form from 'react-bootstrap/Form';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import { Link } from 'react-router-dom';
import 'css/login.css';


// MAIN //

const Login = ({ user, restoreLogin, getEnrollableCohorts, handleLogin, settings, t }) => {
	const [ email, setEmail ] = useState( '' );
	const [ password, setPassword ] = useState( '' );
	const [ overlay, setOverlay ] = useState({
		show: false,
		target: null,
		message: ''
	});
	const passwordInput = useRef( null );
	const emailInput = useRef( null );
	const { t } = useTranslation( [ 'login', 'common' ] );
	const history = useHistory();
	useEffect( () => {
		if ( user && user.loggedIn ) {
			restoreLogin( user );
			getEnrollableCohorts( user );
		}
	}, [ user, restoreLogin, getEnrollableCohorts ] );

	const handleEmailChange = ( event ) => {
		setEmail( event.target.value );
	};
	const handlePasswordChange = ( event ) => {
		setPassword( event.target.value );
	};
	const handleSubmit = async ( event ) => {
		event.preventDefault();
		const form = { password, email };
		if ( form.email === '' ) {
			setOverlay({
				show: true,
				target: this.emailInput,
				message: 'Enter your email address.'
			});
		}
		else if ( form.password === '' ) {
			setOverlay({
				show: true,
				target: passwordInput.current,
				message: 'Enter your password.'
			});
		}
		else {
			try {
				const res = await handleLogin( form );
				const { message } = res.data;
				if ( message === 'finish-login-via-tfa' ) {
					history.push( '/login-tfa' );
				}
				else if ( message === 'ok' ) {
					const { token, id } = res.data;
					const user = await fetchCredentials({ token, id });
					if ( user ) {
						getEnrollableCohorts( user );
					}
				}
			} catch ( err ) {
				const msg = err.response ? err.response.data : err.message;
				setOverlay({
					show: true,
					target: msg === 'Password is not correct.' ? passwordInput.current : emailInput.current,
					message: msg
				});
				setTimeout( () => {
					setOverlay({
						show: false
					});
				}, 4000 );
			}
		}
	};
	return (
		<Fragment>
			<div className="login">
				<Card className="login-panel">
					<Card.Header>
						<Card.Title as="h1" style={{ textAlign: 'center' }} >
							<img alt="ISLE Logo" className="login-isle-logo" src="img/isle_logo.svg" />
							ISLE <small>{settings.siteTitle}</small>
						</Card.Title>
					</Card.Header>
					<Card.Body>
						<Form>
							<FormGroup controlId="form-email">
								<Row>
									<Col sm={3}>
										<FormLabel>{t('common:email')}</FormLabel>
									</Col>
									<Col sm={9}>
										<FormControl
											name="email"
											type="email"
											autoComplete="isle-email"
											placeholder={t('common:email')}
											onChange={handleEmailChange}
											ref={emailInput}
										/>
									</Col>
								</Row>
							</FormGroup>
							<FormGroup controlId="form-password">
								<Row>
									<Col sm={3}>
										<FormLabel>{t('common:password')}</FormLabel>
									</Col>
									<Col sm={9}>
										<FormControl
											name="password"
											type="password"
											autoComplete="isle-password"
											placeholder={t('common:password')}
											onChange={handlePasswordChange}
											ref={passwordInput}
										/>
									</Col>
								</Row>
							</FormGroup>
							<FormGroup>
								<Button
									className="centered"
									variant="primary"
									onClick={handleSubmit}
									type="submit"
								>{t('common:login')}</Button>
							</FormGroup>
						</Form>
					</Card.Body>
					<Card.Footer style={{ background: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>
						<Link to="/forgot-password">{t('common:forgot-password')}</Link>
						{settings.allowUserRegistrations ?
							<Fragment>
								<span> | </span>
								<Link to="/signup">{t('common:register')}</Link>
							</Fragment> :
							null
						}
					</Card.Footer>
				</Card>
				{settings.brandingLogo ? <img
					className="login-branding-logo"
					src={settings.brandingLogo}
					alt="Branded Logo"
				/> : null}
			</div>
			<Overlay
				show={overlay.show}
				target={overlay.target}
				placement="right"
				containerPadding={20}
			>
				<Popover id="popover-contained" title="Not valid">
					{overlay.message}
				</Popover>
			</Overlay>
		</Fragment>
	);
};


// PROPERTIES //

Login.propTypes = {
	fetchCredentials: PropTypes.func.isRequired,
	getEnrollableCohorts: PropTypes.func.isRequired,
	handleLogin: PropTypes.func.isRequired,
	restoreLogin: PropTypes.func.isRequired,
	settings: PropTypes.object,
	user: PropTypes.object.isRequired
};

Login.defaultProps = {
	settings: {}
};


// EXPORTS //

export default Login;
