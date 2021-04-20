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
import 'css/login.css';


// MAIN //

class LoginTFA extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			token: ''
		};
	}

	handleSubmit = async ( event ) => {
		event.preventDefault();
		const form = {
			email: this.props.user.requestTFA.email,
			password: this.props.user.requestTFA.password,
			token: this.state.token
		};
		const res = await this.props.handleLoginTFA( form );
		if ( res ) {
			const { message, token, id } = res.data;
			if ( message === 'ok' ) {
				const user = await this.props.fetchCredentials({ token, id });
				if ( user ) {
					this.props.getEnrollableCohorts( user );
				}
			}
		}
	}

	render() {
		const { t, settings } = this.props;
		return (
			<Fragment>
				<div className="login">
					<Card className="login-panel">
						<Card.Header>
							<Card.Title as="h1" style={{ textAlign: 'center' }} >
								ISLE <small>Dashboard</small>
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<p>
								{t('enter-tfa-token')}
							</p>
							<Form>
								<FormGroup controlId="form-token">
									<Row>
										<Col sm={3}>
											<FormLabel>{t('token')}</FormLabel>
										</Col>
										<Col sm={9}>
											<FormControl
												type="text"
												placeholder={t('enter-token')}
												onChange={( event ) => {
													this.setState({
														token: event.target.value
													});
												}}
											/>
										</Col>
									</Row>
								</FormGroup>
								<Button
									className="centered"
									variant="primary"
									onClick={this.handleSubmit}
									type="submit"
									disabled={this.state.token.length !== 6}
								>{t('common:login')}</Button>
							</Form>
						</Card.Body>
					</Card>
					{settings.brandingLogo ? <img
						className="login-branding-logo"
						src={settings.brandingLogo}
						alt="Branded Logo"
					/> : null}
				</div>
			</Fragment>
		);
	}
}


// PROPERTIES //

LoginTFA.propTypes = {
	fetchCredentials: PropTypes.func.isRequired,
	handleLoginTFA: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default withTranslation( [ 'login', 'common' ] )( LoginTFA );
