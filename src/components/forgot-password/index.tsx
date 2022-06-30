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

import React, { useState, useCallback, Fragment, ReactElement } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import isEmail from '@stdlib/assert/is-email-address';
import 'css/login.css';


// VARIABLES //

const ForgotPasswordPropTypes = {
	forgotPassword: PropTypes.func.isRequired,
	settings: PropTypes.objectOf(PropTypes.any)
};


// MAIN //

/**
* A component for rendering the forgot password form.
*
* @property props - component properties
* @property props.forgotPassword - callback to invoke when the user submits the form
* @property props.settings - ISLE instance settings
* @returns forgot password form
*/
const ForgotPassword = ({ forgotPassword, settings }: InferProps<typeof ForgotPasswordPropTypes>): ReactElement => {
	const [ email, setEmail ] = useState( '' );
	const { t } = useTranslation( [ 'forgot_password', 'common' ] );
	const handleClick = useCallback( ( event ) => {
		event.preventDefault();
		forgotPassword({ email });
	}, [ email, forgotPassword ] );
	const handleEmailChange = useCallback( ( event ) => {
		setEmail( event.target.value );
	}, [] );
	return (
		<div className="login">
			<Card style={{ boxShadow: '0 0 8px rgba(0,0,0,0.3)', borderRadius: '6px', opacity: 0.98, background: 'rgba(255,255,255,0.75)' }}>
				<Card.Header>
					<Card.Title as="h3">{t('common:forgot-password')}</Card.Title>
				</Card.Header>
				<Card.Body>
					<Form className="d-grid gap-3" >
						<FormGroup controlId="form-email">
							<FormLabel>{t('common:email-address')}</FormLabel>
							<FormControl
								type="email"
								placeholder={t('common:enter-email')}
								value={email}
								onChange={handleEmailChange}
							/>
						</FormGroup>
						<Button
							disabled={!isEmail( email )}
							onClick={handleClick} variant="primary"
							type="submit"
						>{t('common:reset')}</Button>
					</Form>
				</Card.Body>
				<Card.Footer style={{ background: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>
					{settings.allowUserRegistrations ?
						<Fragment>
							<Link to="/signup">{t('common:register')}</Link>
							<span> | </span>
						</Fragment> : null
					}
					<Link to="/login">{t('common:login')}</Link>
				</Card.Footer>
			</Card>
			{settings.brandingLogo ? <img
				className="login-branding-logo"
				src={settings.brandingLogo}
				alt="Branded Logo"
			/> : null}
		</div>
	);
};


// PROPERTIES //

ForgotPassword.propTypes = ForgotPasswordPropTypes;

ForgotPassword.defaultProps = {
	settings: {}
};


// EXPORTS //

export default ForgotPassword;
