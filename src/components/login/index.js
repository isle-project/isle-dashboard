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

class Login extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			email: '',
			password: ''
		};
	}

	componentDidMount() {
		const { user } = this.props;
		if ( user && user.loggedIn ) {
			this.props.restoreLogin( user );
			this.props.getEnrollableCohorts( user );
		}
	}

	handleSubmit = async ( event ) => {
		event.preventDefault();
		const form = {
			password: this.state.password,
			email: this.state.email
		};
		if ( form.email === '' ) {
			this.setState({
				showInputOverlay: true,
				overlayTarget: this.emailInput,
				invalidInputMessage: 'Enter your email address.'
			});
		}
		else if ( form.password === '' ) {
			this.setState({
				showInputOverlay: true,
				overlayTarget: this.passwordInput,
				invalidInputMessage: 'Enter your password.'
			});
		}
		else {
			try {
				const res = await this.props.handleLogin( form );
				const { message } = res.data;
				if ( message === 'finish-login-via-tfa' ) {
					this.props.history.push( '/login-tfa' );
				}
				else if ( message === 'ok' ) {
					const { token, id } = res.data;
					const user = await this.props.fetchCredentials({ token, id });
					if ( user ) {
						this.props.getEnrollableCohorts( user );
					}
				}
			} catch ( err ) {
				const msg = err.response ? err.response.data : err.message;
				this.setState({
					showInputOverlay: true,
					overlayTarget: msg === 'Password is not correct.' ? this.passwordInput : this.emailInput,
					invalidInputMessage: msg
				}, () => {
					setTimeout( () => {
						this.setState({
							showInputOverlay: false
						});
					}, 4000 );
				});
			}
		}
	};

	handleInputChange = ( event ) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[ name ]: value
		});
	};

	render() {
		const { t, settings } = this.props;
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
												onChange={this.handleInputChange}
												ref={( input ) => { this.emailInput = input; }}
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
												onChange={this.handleInputChange}
												ref={( input ) => { this.passwordInput = input; }}
											/>
										</Col>
									</Row>
								</FormGroup>
								<FormGroup>
									<Button
										className="centered"
										variant="primary"
										onClick={this.handleSubmit}
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
					show={this.state.showInputOverlay}
					target={this.state.overlayTarget}
					placement="right"
					containerPadding={20}
				>
					<Popover id="popover-contained" title="Not valid">
						{this.state.invalidInputMessage}
					</Popover>
				</Overlay>
			</Fragment>
		);
	}
}


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

export default withTranslation( [ 'login', 'common' ] )( Login );
