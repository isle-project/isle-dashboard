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

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import logger from 'debug';
import { useTranslation } from 'react-i18next';
import { useNavigate, Route, Routes } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Nav from 'react-bootstrap/Nav';
import FilesPage from './files_page.js';
import AnnouncementsPage from './announcements_page.js';
import ProgressPage from './progress_page.js';
import CohortsPage from './cohorts_page.js';
import GradesPage from './grades_page.js';
import ActionsPage from './actions_page.js';
import TicketsPage from './tickets_page.js';
import AssessmentPage from './assessment_page.js';
import './namespace_data.css';


// VARIABLES //

const debug = logger( 'isle-dashboard:namespace-data' );


// MAIN //

const NamespaceData = ({
		addAnnouncement, deleteAnnouncement, editAnnouncement, badges, namespace, user,
		getBadges, uploadFile, deleteFile, getFiles, sendTicketMessage, addNotification,
		adjustProgress, getCourseTickets, getNamespaceActions, openTicket, closeTicket,
		computeAssessments, updatePriority, getOwnerFiles
}) => {
	let pathname = window.location.pathname;
	const [ activePage, setActivePage ] = useState( pathname.substring( pathname.lastIndexOf( '/' ) + 1 ) );
	const { t } = useTranslation( [ 'namespace_data', 'common' ] );
	const navigate = useNavigate();
	useEffect( () => {
		debug( 'Getting badges upon mounting...' );
		getBadges();
	}, [ getBadges ] );
	if ( !namespace._id ) {
		return ( <div className="namespace-data-div">
			<Alert variant="danger">{t('common:no-course-selected')}</Alert>
		</div> );
	}
	const handleUpload = ( event ) => {
		debug( 'Uploading file...' );
		const file = event.target.files[ 0 ];
		const formData = new FormData();
		formData.append( 'file', file, file.name );
		formData.append( 'namespaceName', namespace.title );
		formData.append( 'owner', 'true' );
		uploadFile({ formData, user });
	};
	const handleAnnouncementDeletion = ( createdAt, index ) => {
		deleteAnnouncement( {
			namespaceName: namespace.title,
			index,
			createdAt
		});
	};
	const handleAnnouncementEdit = ( announcement ) => {
		editAnnouncement({
			namespaceName: namespace.title,
			announcement
		});
	};
	const handleAnnouncementCreation = ( announcement ) => {
		addAnnouncement({
			namespaceName: namespace.title,
			announcement
		});
	};
	const handleFileDeletion = ( _id, ownerFiles ) => {
		deleteFile( _id, namespace.title, ownerFiles );
	};
	const submitTicketMessage = ({ message, ticketID }) => {
		sendTicketMessage({ message, ticketID, user: user });
	};
	const handleSelect = ( selectedKey ) => {
		const title = namespace.title;
		navigate( `/namespace-data/${title}/${selectedKey}` );
		setActivePage( selectedKey );
	};
	return (
		<div className="namespace-data-div" >
			<div className="namespace-data-navbar" >
				<Nav variant="pills" className="namespace-data-navbar-pills" activeKey={activePage} onSelect={handleSelect} >
					<Nav.Item>
						<Nav.Link eventKey="announcements" title="Announcements" >{t('common:announcements')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="progress" title="Progress" >{t('common:progress')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="assessments" title="Assessments" >{t('common:assessments')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="grades" title="Grades" >{t('grades')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="cohorts" title="Cohorts" >{t('common:cohorts')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="owner-files" title="Owner Files" >{t('owner-files')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="student-files" title="Student Files" >{t('student-files')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="tickets" title="Tickets" disabled={!namespace.enableTicketing} >{t('common:tickets')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="actions" title="Actions" disabled >{t('common:actions')}</Nav.Link>
					</Nav.Item>
				</Nav>
			</div>
			<div className="namespace-data-page-container" style={{ overflowY: 'auto' }}>
				<Routes>
					<Route path="announcements" element={<AnnouncementsPage
						namespace={namespace} editAnnouncement={handleAnnouncementEdit}
						deleteAnnouncement={handleAnnouncementDeletion}
						addAnnouncement={handleAnnouncementCreation} user={user} />}
					/>
					<Route path="progress" element={<ProgressPage adjustProgress={adjustProgress} addNotification={addNotification}
						namespace={namespace} cohorts={namespace.cohorts}
						lessons={namespace.lessons} user={user} />}
					/>
					<Route path="assessments/*" element={<AssessmentPage addNotification={addNotification} namespace={namespace}
						cohorts={namespace.cohorts} lessons={namespace.lessons} user={user} computeAssessments={computeAssessments} />}
					/>
					<Route path="grades" element={<GradesPage addNotification={addNotification} namespace={namespace}
						cohorts={namespace.cohorts} lessons={namespace.lessons} user={user} />}
					/>
					<Route path="cohorts" element={<CohortsPage badges={badges} cohorts={namespace.cohorts}
						lessons={namespace.lessons} />}
					/>
					<Route path="owner-files" element={<FilesPage ownerFiles files={namespace.ownerFiles} namespace={namespace}
						handleUpload={handleUpload} handleFileDeletion={handleFileDeletion}
						addNotification={addNotification} getFiles={getOwnerFiles} />}
					/>
					<Route path="student-files" element={<FilesPage files={namespace.files} namespace={namespace} handleUpload={handleUpload}
						handleFileDeletion={handleFileDeletion} addNotification={addNotification} getFiles={getFiles} />}
					/>
					<Route path="tickets" element={<TicketsPage tickets={namespace.tickets} namespace={namespace}
						getCourseTickets={getCourseTickets} submitTicketMessage={submitTicketMessage}
						openTicket={openTicket} closeTicket={closeTicket}
						updatePriority={updatePriority} />}
					/>
					<Route path="actions" element={<ActionsPage namespace={namespace} getNamespaceActions={getNamespaceActions}
						user={user} cohorts={namespace.cohorts} />}
					/>
				</Routes>
			</div>
		</div>
	);
};


// PROPERTIES //

NamespaceData.propTypes = {
	addAnnouncement: PropTypes.func.isRequired,
	addNotification: PropTypes.func.isRequired,
	adjustProgress: PropTypes.func.isRequired,
	badges: PropTypes.array,
	closeTicket: PropTypes.func.isRequired,
	computeAssessments: PropTypes.func.isRequired,
	deleteAnnouncement: PropTypes.func.isRequired,
	deleteFile: PropTypes.func.isRequired,
	editAnnouncement: PropTypes.func.isRequired,
	getBadges: PropTypes.func.isRequired,
	getCourseTickets: PropTypes.func.isRequired,
	getFiles: PropTypes.func.isRequired,
	getNamespaceActions: PropTypes.func.isRequired,
	getOwnerFiles: PropTypes.func.isRequired,
	namespace: PropTypes.object.isRequired,
	openTicket: PropTypes.func.isRequired,
	sendTicketMessage: PropTypes.func.isRequired,
	updatePriority: PropTypes.func.isRequired,
	uploadFile: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

NamespaceData.defaultProps = {
	badges: null
};


// EXPORTS //

export default NamespaceData;
