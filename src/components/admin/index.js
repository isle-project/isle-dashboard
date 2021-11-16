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

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigate, Route, Routes } from 'react-router-dom';
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

const AdminPage = ( props ) => {
	const [ activePage, setActivePage ] = useState( window.location.pathname );
	const { t } = useTranslation( [ 'admin', 'common' ] );
	const navigate = useNavigate();

	const user = props.user;
	useEffect( () => {
		if ( !user.administrator ) {
			navigate( '/profile' );
		}
	}, [ user, navigate ] );

	const handleSelect = ( selectedKey ) => {
		navigate( selectedKey );
		setActivePage( selectedKey );
	};
	const navbar = <div className="admin-page-navbar">
		<Nav variant="pills" activeKey={activePage} onSelect={handleSelect}>
			<Nav.Item>
				<Nav.Link eventKey="/admin/overview" title="Overview" >{t('overview')} </Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link eventKey="/admin/access-logs" title="Access Log" >{t('access-log')}</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link eventKey="/admin/error-logs" title="Error Log" >{t('error-log')}</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link eventKey="/admin/users" title="Users" >{t('users')}</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link eventKey="/admin/courses" title="Courses" >{t('common:courses')}</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link eventKey="/admin/lessons" title="Lessons" >{t('common:lessons')}</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link eventKey="/admin/cohorts" title="Cohorts" >{t('common:cohorts')}</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link eventKey="/admin/files" title="Files" >{t('common:files')}</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link eventKey="/admin/events" title="Events" >{t('common:events')}</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link eventKey="/admin/active-rooms" title="Active Rooms" >{t('active-rooms')}</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link eventKey="/admin/tickets" title="Tickets" >{t('common:tickets')}</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link eventKey="/admin/requests" title="Requests" >{t('common:requests')}</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link eventKey="/admin/settings" title="Settings" >{t('settings')}</Nav.Link>
			</Nav.Item>
		</Nav>
	</div>;
	return (
		<div className="admin-page-div">
			{navbar}
			<div className="admin-page-container" >
				<Routes>
					<Route path="/overview" element={<Overview
						getOverviewStatistics={props.getOverviewStatistics}
						getHistoricalOverviewStats={props.getHistoricalOverviewStats}
						statistics={props.admin.statistics}
						historicalStatistics={props.admin.historicalStatistics}
						admin={props.admin} />}
					/>
					<Route path="/access-logs" element={<AccessLog
						user={props.user} />}
					/>
					<Route path="/error-logs" element={<ErrorsLog
						user={props.user} />}
					/>
					<Route path="/users" element={<UserTable
						user={props.user}
						admin={props.admin}
						deleteUser={props.deleteUser}
						impersonateUser={props.impersonateUser}
						getUsers={props.getUsers}
						sanitizeRequest={props.sanitizeRequest}
						addNotification={props.addNotification}
						updateUser={props.adminUpdateUser}
						getCustomFields={props.getCustomFields}
						createUser={props.createUser} />}
					/>
					<Route path="/courses" element={<NamespaceTable
						admin={props.admin}
						getAllNamespaces={props.getAllNamespaces}
						deleteCurrentNamespace={props.deleteCurrentNamespace} />}
					/>
					<Route path="/lessons" element={<LessonTable
						admin={props.admin}
						getAllLessons={props.getAllLessons}
						deleteLesson={props.deleteLesson} />}
					/>
					<Route path="/cohorts" element={<CohortTable
						admin={props.admin}
						getAllCohorts={props.getAllCohorts}
						deleteCohort={props.deleteCohort} />}
					/>
					<Route path="/files" element={<FileTable
						admin={props.admin}
						deleteFile={props.deleteFile}
						getAllFiles={props.getAllFiles}
						addNotification={props.addNotification} />}
					/>
					<Route path="/events" element={<EventTable
						admin={props.admin}
						deleteEvent={props.deleteEvent}
						getEvents={props.getEvents}
						triggerEvent={props.triggerEvent} />}
					/>
					<Route path="/rooms" element={<Rooms
						admin={props.admin}
						getRooms={props.getRooms} />}
					/>
					<Route path="/tickets" element={<TicketTable
						admin={props.admin}
						getAllTickets={props.getAllTickets}
						deleteTicket={props.deleteTicket}
						submitTicketMessage={({ message, ticketID }) => {
							props.sendTicketMessage({ message, ticketID, user: props.user });
						}}
						closeTicket={props.closeTicket}
						openTicket={props.openTicket}
						history={props.history}
						updatePriority={props.updatePriority} />}
					/>
					<Route path="/requests" element={<Requests
						admin={props.admin}
						getRequestStatistics={props.getRequestStatistics} />}
					/>
				</Routes>
			</div>
		</div>
	);
};


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
	deleteFile: PropTypes.func.isRequired,
	deleteLesson: PropTypes.func.isRequired,
	deleteTicket: PropTypes.func.isRequired,
	deleteUser: PropTypes.func.isRequired,
	getAllCohorts: PropTypes.func.isRequired,
	getAllFiles: PropTypes.func.isRequired,
	getAllLessons: PropTypes.func.isRequired,
	getAllNamespaces: PropTypes.func.isRequired,
	getAllTickets: PropTypes.func.isRequired,
	getCustomFields: PropTypes.func.isRequired,
	getEvents: PropTypes.func.isRequired,
	getHistoricalOverviewStats: PropTypes.func.isRequired,
	getOverviewStatistics: PropTypes.func.isRequired,
	getRequestStatistics: PropTypes.func.isRequired,
	getRooms: PropTypes.func.isRequired,
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

export default AdminPage;
