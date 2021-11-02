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
import logger from 'debug';
import { withTranslation } from 'react-i18next';
import Alert from 'react-bootstrap/Alert';
import Nav from 'react-bootstrap/Nav';
import FilesPage from './files_page.js';
import AnnouncementsPage from './announcements_page.js';
import ProgressPage from './progress_page.js';
import CohortsPage from './cohorts_page.js';
import GradesPage from './grades_page.js';
import ActionsPage from './actions_page.js';
import TicketsPage from './tickets_page.js';
import './namespace_data.css';


// VARIABLES //

const debug = logger( 'isle-dashboard:namespace-data' );


// MAIN //

class NamespaceData extends Component {
	constructor( props ) {
		super( props );

		const subpage = props.match.params.subpage;
		let activePage;
		switch ( subpage ) {
			default:
			case 'announcements':
				activePage = 1;
				break;
			case 'progress':
				activePage = 2;
				break;
			case 'grades':
				activePage = 3;
				break;
			case 'cohorts':
				activePage = 4;
				break;
			case 'owner-files':
				activePage = 5;
				break;
			case 'student-files':
				activePage = 6;
				break;
			case 'tickets':
				activePage = 7;
				break;
			case 'actions':
				activePage = 8;
				break;
		}
		this.state = {
			activePage
		};
	}

	componentDidMount() {
		this.props.getBadges();
	}

	handleUpload = ( event ) => {
		debug( 'Uploading file...' );
		const file = event.target.files[ 0 ];
		const formData = new FormData();
		formData.append( 'file', file, file.name );
		formData.append( 'namespaceName', this.props.namespace.title );
		formData.append( 'owner', 'true' );
		this.props.uploadFile({
			formData: formData,
			user: this.props.user
		});
	};

	handleAnnouncementDeletion = (createdAt, index) => {
		this.props.deleteAnnouncement( {
			namespaceName: this.props.namespace.title,
			index,
			createdAt
		});
	};

	handleAnnouncementEdit = ( announcement ) => {
		this.props.editAnnouncement({
			namespaceName: this.props.namespace.title,
			announcement
		});
	};

	handleAnnouncementCreation = ( announcement ) => {
		this.props.addAnnouncement({
			namespaceName: this.props.namespace.title,
			announcement
		});
	};

	handleFileDeletion = ( _id, ownerFiles ) => {
		this.props.deleteFile( _id, this.props.namespace.title, ownerFiles );
	};

	submitTicketMessage = ({ message, ticketID }) => {
		this.props.sendTicketMessage({ message, ticketID, user: this.props.user });
	};

	handleSelect = ( selectedKey ) => {
		selectedKey = Number( selectedKey );
		const title = this.props.namespace.title;
		switch ( selectedKey ) {
			case 1:
				this.props.history.replace( `/namespace-data/${title}/announcements` );
				break;
			case 2:
				this.props.history.replace( `/namespace-data/${title}/progress` );
				break;
			case 3:
				this.props.history.replace( `/namespace-data/${title}/grades` );
				break;
			case 4:
				this.props.history.replace( `/namespace-data/${title}/cohorts` );
				break;
			case 5:
				this.props.history.replace( `/namespace-data/${title}/owner-files` );
				break;
			case 6:
				this.props.history.replace( `/namespace-data/${title}/student-files` );
				break;
			case 7:
				this.props.history.replace( `/namespace-data/${title}/tickets` );
				break;
			case 8:
				this.props.history.replace( `/namespace-data/${title}/actions` );
				break;
		}
		this.setState({
			activePage: selectedKey
		});
	};

	renderPage() {
		switch ( this.state.activePage ) {
			case 1:
				return <AnnouncementsPage namespace={this.props.namespace} editAnnouncement={this.handleAnnouncementEdit} deleteAnnouncement={this.handleAnnouncementDeletion} addAnnouncement={this.handleAnnouncementCreation} user={this.props.user} />;
			case 2:
				return <ProgressPage adjustProgress={this.props.adjustProgress} addNotification={this.props.addNotification} namespace={this.props.namespace} cohorts={this.props.namespace.cohorts} lessons={this.props.namespace.lessons} user={this.props.user} />;
			case 3:
				return <GradesPage addNotification={this.props.addNotification} namespace={this.props.namespace} cohorts={this.props.namespace.cohorts} lessons={this.props.namespace.lessons} user={this.props.user} />;
			case 4:
				return <CohortsPage badges={this.props.badges} cohorts={this.props.namespace.cohorts} lessons={this.props.namespace.lessons} />;
			case 5:
				return <FilesPage ownerFiles files={this.props.namespace.ownerFiles} namespace={this.props.namespace} handleUpload={this.handleUpload} handleFileDeletion={this.handleFileDeletion} addNotification={this.props.addNotification} getFiles={this.props.getOwnerFiles} />;
			case 6:
				return <FilesPage files={this.props.namespace.files} namespace={this.props.namespace} handleUpload={this.handleUpload} handleFileDeletion={this.handleFileDeletion} addNotification={this.props.addNotification} getFiles={this.props.getFiles} />;
			case 7:
				return <TicketsPage tickets={this.props.namespace.tickets} namespace={this.props.namespace} getCourseTickets={this.props.getCourseTickets} submitTicketMessage={this.submitTicketMessage} openTicket={this.props.openTicket} closeTicket={this.props.closeTicket} updatePriority={this.props.updatePriority} history={this.props.history} />;
			case 8:
				return <ActionsPage namespace={this.props.namespace} getNamespaceActions={this.props.getNamespaceActions} user={this.props.user} cohorts={this.props.namespace.cohorts} />;
		}
	}

	render() {
		const { t } = this.props;
		if ( !this.props.namespace._id ) {
			return ( <div className="namespace-data-div">
				<Alert variant="danger">{t('common:no-course-selected')}</Alert>
			</div> );
		}
		const page = this.renderPage();
		return (
			<div className="namespace-data-div">
				<div className="namespace-data-navbar">
					<Nav variant="pills" className="namespace-data-navbar-pills" activeKey={this.state.activePage} onSelect={this.handleSelect}>
						<Nav.Item>
							<Nav.Link eventKey="1" title="Announcements" >{t('common:announcements')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="2" title="Progress" >{t('common:progress')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="3" title="Grades" >{t('grades')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="4" title="Cohorts" >{t('common:cohorts')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="5" title="Owner Files" >{t('owner-files')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="6" title="Student Files" >{t('student-files')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="7" title="Tickets" disabled={!this.props.namespace.enableTicketing} >{t('common:tickets')}</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="8" title="Actions" disabled >{t('common:actions')}</Nav.Link>
						</Nav.Item>
					</Nav>
				</div>
				<div className="namespace-data-page-container" style={{ overflowY: 'auto' }}>
					{page}
				</div>
			</div>
		);
	}
}


// PROPERTIES //

NamespaceData.propTypes = {
	addAnnouncement: PropTypes.func.isRequired,
	addNotification: PropTypes.func.isRequired,
	adjustProgress: PropTypes.func.isRequired,
	badges: PropTypes.array,
	closeTicket: PropTypes.func.isRequired,
	deleteAnnouncement: PropTypes.func.isRequired,
	deleteFile: PropTypes.func.isRequired,
	editAnnouncement: PropTypes.func.isRequired,
	getBadges: PropTypes.func.isRequired,
	getCourseTickets: PropTypes.func.isRequired,
	getFiles: PropTypes.func.isRequired,
	getNamespaceActions: PropTypes.func.isRequired,
	getOwnerFiles: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
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

export default withTranslation( [ 'namespace_data', 'common' ] )( NamespaceData );
