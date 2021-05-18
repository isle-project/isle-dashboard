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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import 'css/login.css';


// MAIN //

class ConfirmEmail extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			message: 'common:waiting'
		};
	}

	async componentDidMount() {
		const hash = window.location.hash.substring( 16 );
		const qs = queryString.parse( hash );
		const token = qs[ 'token' ];
		const newMessage = await this.props.confirmEmail( token );

		// eslint-disable-next-line react/no-did-mount-set-state
		this.setState({
			message: newMessage
		});
	}

	render() {
		const { t, settings } = this.props;
		return (
			<div className="login">
				<Card style={{ boxShadow: '0 0 8px rgba(0,0,0,0.3)', borderRadius: '6px', opacity: 0.98, background: 'rgba(255,255,255,0.75)' }}>
					<Card.Header>
						<Card.Title as="h3">{t('common:confirm-email')}</Card.Title>
					</Card.Header>
					<Card.Body>
						<p data-testid="message" >{this.state.message}</p>
					</Card.Body>
					<Card.Footer style={{ background: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>
						<Link to="/signup">{t('common:register')}</Link>
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
		);
	}
}


// PROPERTIES //

ConfirmEmail.propTypes = {
	confirmEmail: PropTypes.func.isRequired,
	settings: PropTypes.object
};

ConfirmEmail.defaultProps = {
	settings: {}
};


// EXPORTS //

export default withTranslation( [ 'common' ] )( ConfirmEmail );
