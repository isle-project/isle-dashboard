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
import { Nav } from 'react-bootstrap';
import ErrorsLog from './logs/errors';
import AccessLog from './logs/access';
import './admin_page.css';


// MAIN //

class AdminPage extends Component {
	constructor( props ) {
		super( props );

		const subpage = props.match.params.subpage;
		let activePage;
		switch ( subpage ) {
			default:
			case 'access-logs':
				activePage = 1;
				break;
			case 'error-logs':
				activePage = 2;
				break;
		}
		this.state = {
			activePage
		};
	}

	handleSelect = ( selectedKey ) => {
		selectedKey = Number( selectedKey );
		switch ( selectedKey ) {
			case 1:
				this.props.history.replace( '/admin/access-logs' );
				break;
			case 2:
				this.props.history.replace( '/admin/error-logs' );
				break;
		}
		this.setState({
			activePage: selectedKey
		});
	}

	renderPage() {
		switch ( this.state.activePage ) {
			case 1:
				return <AccessLog user={this.props.user} />;
			case 2:
				return <ErrorsLog user={this.props.user} />;
		}
	}

	render() {
		const page = this.renderPage();
		return (
			<div className="admin-page-div">
				<div className="admin-page-navbar">
					<Nav variant="pills" activeKey={this.state.activePage} onSelect={this.handleSelect}>
						<Nav.Item>
							<Nav.Link eventKey="1" title="Access Log" >Access Log</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="2" title="Error Log" >Error Log</Nav.Link>
						</Nav.Item>
					</Nav>
				</div>
				<div className="admin-page-container" style={{ overflowY: 'auto' }}>
					{page}
				</div>
			</div>
		);
	}
}


// PROPERTIES //

AdminPage.propTypes = {
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default AdminPage;
