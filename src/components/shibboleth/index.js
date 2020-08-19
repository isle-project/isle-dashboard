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
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import 'css/login.css';


// MAIN //

class Shibboleth extends Component {
	constructor( props ) {
		super( props );

		const hash = window.location.hash.substring( 12 );
		this.params = queryString.parse( hash );
	}

	async componentDidMount() {
		const res = await this.props.shibboleth( this.params );
		if ( res && res.data ) {
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
		const { t } = this.props;
		return (
			<div className="login">
				<Card className="login-panel">
					<Card.Header>
						<Card.Title as="h1" style={{ textAlign: 'center' }} >
							ISLE <small>Dashboard</small>
						</Card.Title>
					</Card.Header>
					<Card.Footer style={{ background: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>
						<Link to="/login">{t('common:login')}</Link>
						<span> | </span>
						<Link to="/signup">{t('common:register')}</Link>
					</Card.Footer>
				</Card>
			</div>
		);
	}
}


// PROPERTIES //

Shibboleth.propTypes = {
	fetchCredentials: PropTypes.func.isRequired,
	getEnrollableCohorts: PropTypes.func.isRequired,
	shibboleth: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation( [ 'common' ] )( Shibboleth );
