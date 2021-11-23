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

import React, { useRef, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logger from 'debug';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Form from 'react-bootstrap/Form';
import Popover from 'react-bootstrap/Popover';
import Overlay from 'react-bootstrap/Overlay';
import { Link } from 'react-router-dom';
import useMountEffect from 'hooks/use-mount-effect';
import server from 'constants/server';
import 'css/login.css';


// VARIABLES //

const debug = logger( 'isle-dashboard:login' );


// MAIN //

/**
 * Login screen component.
 *
 * @param {Object} props - component properties
 * @param {Object} props.user - user object
 * @param {Function} props.restoreLogin - callback to restore login
 * @param {Function} props.fetchCredentials - callback to fetch user information
 * @param {Function} props.getEnrollableCohorts - callback to get enrollable cohorts of a user from the server
 * @param {Function} props.handleLogin - function to handle login
 * @param {Object} props.settings - ISLE instance settings
 * @returns {ReactElement} component
 */
const Login = ({ user, restoreLogin, fetchCredentials, getEnrollableCohorts, handleLogin, settings }) => {
	const [ email, setEmail ] = useState( '' );
	const [ password, setPassword ] = useState( '' );
	const [ overlay, setOverlay ] = useState({
		show: false,
		target: null,
		message: ''
	});
	const [ hasSSO, setHasSSO ] = useState( false );
	const passwordInput = useRef( null );
	const emailInput = useRef( null );
	const { t } = useTranslation( [ 'login', 'common' ] );
	const navigate = useNavigate();
	useMountEffect( () => {
		if ( user && user.loggedIn ) {
			restoreLogin( user );
			getEnrollableCohorts( user );
		} else {
			const res = axios.get( server + '/saml-xmw/login-type' );
			res.then( response => {
				if ( response.data === 'SSO' ) {
					navigate( server + '/saml-xmw/login-choices' );
				}
				else if ( response.data === 'Both' ) {
					setHasSSO( true );
				}
			}).catch( err => {
				debug( 'Encountered an error: ', err );
			});
		}
	});

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
				target: emailInput.current,
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
					navigate( '/login-tfa' );
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
	const form = <Form className="d-grid gap-3" >
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
	</Form>;
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
						{form}
					</Card.Body>
					<Card.Footer style={{ background: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>
						{hasSSO ? <Fragment>
							<a href={server+'/saml-xmw/login-choice'}>SSO</a>
							<span> | </span>
						</Fragment> : null }
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
