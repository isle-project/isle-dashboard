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
import asyncComponent from 'components/async';
const ErrorsLog = asyncComponent( () => import( './logs/errors' ) );
const AccessLog = asyncComponent( () => import( './logs/access' ) );
const CohortTable = asyncComponent( () => import( './cohort_table.js' ) );
const EventTable = asyncComponent( () => import( './event_table.js' ) );
const LessonTable = asyncComponent( () => import( './lesson_table.js' ) );
const FileTable = asyncComponent( () => import( './file_table.js' ) );
const NamespaceTable = asyncComponent( () => import( './namespace_table.js' ) );
const TicketTable = asyncComponent( () => import( './ticket_table.js' ) );
const UserTable = asyncComponent( () => import( './user_table.js' ) );
const Rooms = asyncComponent( () => import( './rooms.js' ) );
const Overview = asyncComponent( () => import( './overview.js' ) );
const Requests = asyncComponent( () => import( './requests.js' ) );
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
			case 'lessons':
				activePage = 5;
				break;
			case 'cohorts':
				activePage = 6;
				break;
			case 'files':
				activePage = 7;
				break;
			case 'events':
				activePage = 8;
				break;
			case 'rooms':
				activePage = 9;
				break;
			case 'tickets':
				activePage = 10;
				break;
			case 'requests':
				activePage = 11;
				break;
			case 'settings':
				activePage = null;
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

	submitTicketMessage = ({ message, ticketID }) => {
		this.props.sendTicketMessage({ message, ticketID, user: this.props.user });
	}

	handleSelect = ( selectedKey ) => {
		selectedKey = Number( selectedKey );
		const { history } = this.props;
		switch ( selectedKey ) {
			case 0:
				history.replace( '/admin/overview' );
				break;
			case 1:
				history.replace( '/admin/access-logs' );
				break;
			case 2:
				history.replace( '/admin/error-logs' );
				break;
			case 3:
				history.replace( '/admin/users' );
				break;
			case 4:
				history.replace( '/admin/courses' );
				break;
			case 5:
				history.replace( '/admin/lessons' );
				break;
			case 6:
				history.replace( '/admin/cohorts' );
				break;
			case 7:
				history.replace( '/admin/files' );
				break;
			case 8:
				history.replace( '/admin/events' );
				break;
			case 9:
				history.replace( '/admin/rooms' );
				break;
			case 10:
				history.replace( '/admin/tickets' );
				break;
			case 11:
				history.replace( '/admin/requests' );
				break;
			case 12:
				history.replace( '/admin/settings' );
				break;
		}
		this.setState({
			activePage: selectedKey
		});
	}

	renderPage() {
		switch ( this.state.activePage ) {
			case 0:
				return ( <Overview
					getOverviewStatistics={this.props.getOverviewStatistics}
					getHistoricalOverviewStats={this.props.getHistoricalOverviewStats}
					statistics={this.props.admin.statistics}
					historicalStatistics={this.props.admin.historicalStatistics}
					admin={this.props.admin}
				/> );
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
						updateUser={this.props.adminUpdateUser}
						getCustomFields={this.props.getCustomFields}
						createUser={this.props.createUser}
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
					<LessonTable
						admin={this.props.admin}
						getAllLessons={this.props.getAllLessons}
						deleteLesson={this.props.deleteLesson}
					/>
				);
			case 6:
				return (
					<CohortTable
						admin={this.props.admin}
						getAllCohorts={this.props.getAllCohorts}
						deleteCohort={this.props.deleteCohort}
					/>
				);
			case 7:
				return (
					<FileTable
						admin={this.props.admin}
						deleteFile={this.props.deleteFile}
						getAllFiles={this.props.getAllFiles}
						addNotification={this.props.addNotification}
					/>
				);
			case 8:
				return (
					<EventTable
						admin={this.props.admin}
						deleteEvent={this.props.deleteEvent}
						getEvents={this.props.getEvents}
						triggerEvent={this.props.triggerEvent}
					/>
				);
			case 9:
				return (
					<Rooms
						admin={this.props.admin}
						getRooms={this.props.getRooms}
					/>
				);
			case 10:
				return (
					<TicketTable
						admin={this.props.admin}
						getAllTickets={this.props.getAllTickets}
						deleteTicket={this.props.deleteTicket}
						submitTicketMessage={this.submitTicketMessage}
						closeTicket={this.props.closeTicket}
						openTicket={this.props.openTicket}
						history={this.props.history}
						updatePriority={this.props.updatePriority}
					/>
				);
			case 11:
				return (
					<Requests
						admin={this.props.admin}
						getRequestStatistics={this.props.getRequestStatistics}
					/>
				);
		}
	}

	render() {
		const page = this.renderPage();
		const { t } = this.props;
		const navbar = <div className="admin-page-navbar">
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
					<Nav.Link eventKey="5" title="Lessons" >{t('common:lessons')}</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="6" title="Cohorts" >{t('common:cohorts')}</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="7" title="Files" >{t('common:files')}</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="8" title="Events" >{t('common:events')}</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="9" title="Active Rooms" >{t('active-rooms')}</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="10" title="Tickets" >{t('common:tickets')}</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="11" title="Requests" >{t('common:requests')}</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="12" title="Settings" >{t('settings')}</Nav.Link>
				</Nav.Item>
			</Nav>
		</div>;
		if ( !page ) {
			return ( <div className="admin-page-div">
				{navbar}
			</div> );
		}
		return (
			<div className="admin-page-div">
				{navbar}
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
	adminUpdateUser: PropTypes.func.isRequired,
	closeTicket: PropTypes.func.isRequired,
	createUser: PropTypes.func.isRequired,
	deleteCohort: PropTypes.func.isRequired,
	deleteCurrentNamespace: PropTypes.func.isRequired,
	deleteEvent: PropTypes.func.isRequired,
	deleteLesson: PropTypes.func.isRequired,
	deleteTicket: PropTypes.func.isRequired,
	deleteUser: PropTypes.func.isRequired,
	getAllCohorts: PropTypes.func.isRequired,
	getAllFiles: PropTypes.func.isRequired,
	getAllLessons: PropTypes.func.isRequired,
	getAllNamespaces: PropTypes.func.isRequired,
	getAllTickets: PropTypes.func.isRequired,
	getEvents: PropTypes.func.isRequired,
	getHistoricalOverviewStats: PropTypes.func.isRequired,
	getOverviewStatistics: PropTypes.func.isRequired,
	getUsers: PropTypes.func.isRequired,
	impersonateUser: PropTypes.func.isRequired,
	openTicket: PropTypes.func.isRequired,
	sanitizeRequest: PropTypes.func.isRequired,
	sendTicketMessage: PropTypes.func.isRequired,
	triggerEvent: PropTypes.func.isRequired,
	updatePriority: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( AdminPage );
