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
import CohortTable from './cohort_table.js';
import EventTable from './event_table.js';
import LessonTable from './lesson_table.js';
import NamespaceTable from './namespace_table.js';
import UserTable from './user_table.js';
import Overview from './overview.js';
import Rooms from './rooms.js';
import { version as dashboardVersion } from './../../../package.json';
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
			case 'overview':
				activePage = 0;
				break;
			case 'access-logs':
				activePage = 1;
				break;
			case 'error-logs':
				activePage = 2;
				break;
			case 'users':
				activePage = 3;
				break;
			case 'courses':
				activePage = 4;
				break;
			case 'cohorts':
				activePage = 5;
				break;
			case 'lessons':
				activePage = 6;
				break;
			case 'events':
				activePage = 7;
				break;
		}
		this.state = {
			activePage
		};
	}

	componentDidMount() {
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
			case 0:
				this.props.history.replace( '/admin/overview' );
				break;
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
				this.props.history.replace( '/admin/courses' );
				break;
			case 5:
				this.props.history.replace( '/admin/cohorts' );
				break;
			case 6:
				this.props.history.replace( '/admin/lessons' );
				break;
			case 7:
				this.props.history.replace( '/admin/events' );
				break;
			case 8:
				this.props.history.replace( '/admin/rooms' );
				break;
		}
		this.setState({
			activePage: selectedKey
		});
	}

	renderPage() {
		switch ( this.state.activePage ) {
			case 0:
				return <Overview />;
			case 1:
				return <AccessLog user={this.props.user} />;
			case 2:
				return <ErrorsLog user={this.props.user} />;
			case 3:
				return (
					<UserTable
						user={this.props.user}
						admin={this.props.admin}
						deleteUser={this.props.deleteUser}
						impersonateUser={this.props.impersonateUser}
						getUsers={this.props.getUsers}
						sanitizeRequest={this.props.sanitizeRequest}
						addNotification={this.props.addNotification}
					/>
				);
			case 4:
				return (
					<NamespaceTable
						admin={this.props.admin}
						getAllNamespaces={this.props.getAllNamespaces}
						deleteCurrentNamespace={this.props.deleteCurrentNamespace}
					/>
				);
			case 5:
				return (
					<CohortTable
						admin={this.props.admin}
						getAllCohorts={this.props.getAllCohorts}
						deleteCohort={this.props.deleteCohort}
					/>
				);
			case 6:
				return (
					<LessonTable
						admin={this.props.admin}
						getAllLessons={this.props.getAllLessons}
						deleteLesson={this.props.deleteLesson}
					/>
				);
			case 7:
				return (
					<EventTable
						admin={this.props.admin}
						deleteEvent={this.props.deleteEvent}
						getEvents={this.props.getEvents}
					/>
				);
			case 8:
				return (
					<Rooms
						admin={this.props.admin}
						getRooms={this.props.getRooms}
					/>
				);
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
							<Nav.Link eventKey="0" title="Overview" >{t('overview')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="1" title="Access Log" >{t('access-log')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="2" title="Error Log" >{t('error-log')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="3" title="Users" >{t('users')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="4" title="Courses" >{t('common:courses')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="5" title="Cohorts" >{t('common:cohorts')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="6" title="Lessons" >{t('common:lessons')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="7" title="Events" >{t('common:events')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="8" title="Active Rooms" >{t('admin:active-rooms')}</Nav.Link>
						</Nav.Item>
						<span className="admin-page-version" >{t('dashboard-version')}: {dashboardVersion}</span>
					</Nav>
				</div>
				<div className="admin-page-container" >
					{page}
				</div>
			</div>
		);
	}
}


// PROPERTIES //

AdminPage.propTypes = {
	addNotification: PropTypes.func.isRequired,
	admin: PropTypes.object.isRequired,
	deleteCohort: PropTypes.func.isRequired,
	deleteCurrentNamespace: PropTypes.func.isRequired,
	deleteEvent: PropTypes.func.isRequired,
	deleteLesson: PropTypes.func.isRequired,
	deleteUser: PropTypes.func.isRequired,
	getAllCohorts: PropTypes.func.isRequired,
	getAllLessons: PropTypes.func.isRequired,
	getAllNamespaces: PropTypes.func.isRequired,
	getEvents: PropTypes.func.isRequired,
	getUsers: PropTypes.func.isRequired,
	impersonateUser: PropTypes.func.isRequired,
	sanitizeRequest: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( AdminPage );
