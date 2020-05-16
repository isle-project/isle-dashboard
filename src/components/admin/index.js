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
import Nav from 'react-bootstrap/Nav';
import ErrorsLog from './logs/errors';
import AccessLog from './logs/access';
import UserTable from './user_table.js';
import 'react-table/react-table.css';
import 'css/table.css';
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
			case 'users':
				activePage = 3;
				break;
			case 'admins':
				activePage = 4;
				break;
		}
		this.state = {
			activePage
		};
	}

	componentDidMount() {
		this.props.getUsers();
		if ( !this.props.user.administrator ) {
			this.props.history.replace( '/profile' );
		}
	}

	componentDidUpdate() {
		if ( !this.props.user.administrator ) {
			this.props.history.replace( '/profile' );
		}
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
			case 3:
				this.props.history.replace( '/admin/users' );
				break;
			case 4:
				this.props.history.replace( '/admin/admins' );
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
			case 3:
				return ( <UserTable
					user={this.props.user} admin={this.props.admin}
					deleteUser={this.props.deleteUser}
					impersonateUser={this.props.impersonateUser}
				/> );
		}
	}

	render() {
		const page = this.renderPage();
		const { t } = this.props;
		return (
			<div className="admin-page-div">
				<div className="admin-page-navbar">
					<Nav variant="pills" activeKey={this.state.activePage} onSelect={this.handleSelect}>
						<Nav.Item>
							<Nav.Link eventKey="1" title="Access Log" >{t('access-log')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="2" title="Error Log" >{t('error-log')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="3" title="Users" >{t('users')}</Nav.Link>
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
	admin: PropTypes.object.isRequired,
	deleteUser: PropTypes.func.isRequired,
	getUsers: PropTypes.func.isRequired,
	impersonateUser: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( AdminPage );
