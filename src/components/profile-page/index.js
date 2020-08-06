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
import path from 'path';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Media from 'react-bootstrap/Media';
import Nav from 'react-bootstrap/Nav';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import keys from '@stdlib/utils/keys';
import isArray from '@stdlib/assert/is-array';
import formatTime from 'utils/format_time.js';
import asyncComponent from 'components/async';
import server from 'constants/server';
import EditModal from './edit_modal.js';
const ProfilePicModal = asyncComponent( () => import( './profile_pic_modal.js' ) );
const TimeSpent = asyncComponent( () => import( './time_spent.js' ) );
const ProgressStats = asyncComponent( () => import( './progress.js' ) );
import ActionTypesDisplay from './action_types_display.js';
import hoodie from './img/hoodie.jpg';
import badge from './img/question.svg';
import badgeCircle from './img/badge_circle.svg';
import './profile-page.css';
import './message-page.css';


// FUNCTIONS //

function id2Name( lessons, id ) {
	if ( !lessons ) {
		return '';
	}
	for ( let i = 0; i < lessons.length; i++ ) {
		if ( lessons[ i ]._id === id ) {
			return lessons[ i ].title;
		}
	}
	return '';
}


// MAIN //

class ProfilePage extends Component {
	constructor( props ) {
		super( props );

		let selectedNamespace = null;
		let selectedNamespaceID = null;
		if ( props.user.enrolledNamespaces.length > 0 ) {
			selectedNamespace = props.user.enrolledNamespaces[ 0 ];
			selectedNamespaceID = selectedNamespace._id;
		}
		this.state = {
			showEditModal: false,
			showProfilePicModal: false,
			selectedNamespace: selectedNamespace,
			selectedNamespaceID: selectedNamespaceID,
			selectedDataType: 'messages',
			selectedStatsType: 'progress'
		};
	}

	componentDidMount() {
		if ( !this.props.user.files ) {
			this.props.getFiles({});
		}
		const course = this.state.selectedNamespace;
		if ( course && !course.lessons ) {
			this.props.getLessons( course.title );
		}
		this.props.getUserBadges();
	}

	toggleEditModal = () => {
		this.setState({
			showEditModal: !this.state.showEditModal
		});
	}

	toggleProfilePicModal = () => {
		this.setState({
			showProfilePicModal: !this.state.showProfilePicModal
		});
	}

	handleSelect = ( newValue, event ) => {
		const namespaceName = event.target.title;
		const id = event.target.dataset.id;
		this.setState({
			selectedNamespaceID: newValue,
			selectedNamespace: this.props.user.enrolledNamespaces[ id ]
		}, () => {
			const course = this.props.user.enrolledNamespaces[ id ];
			if ( !course.lessons ) {
				this.props.getLessons( namespaceName );
			}
		});
	}

	handleStatsSelect = ( newValue, event ) => {
		this.setState({
			selectedStatsType: newValue
		});
	}

	renderRightPanel() {
		if ( !this.state.selectedNamespace ) {
			return null;
		}
		if ( this.state.selectedStatsType === 'progress' ) {
			return (
				<ProgressStats
					user={this.props.user}
					selectedNamespace={this.state.selectedNamespace}
				/>
			);
		}
		if ( this.state.selectedStatsType === 'timeSpent' ) {
			return (
				<TimeSpent
					user={this.props.user}
					selectedNamespace={this.state.selectedNamespace}
				/>
			);
		}
	}


	handleDataSelect = ( newValue, event ) => {
		this.setState({
			selectedDataType: newValue
		});
	}

	renderLeftPanel() {
		if ( !this.state.selectedNamespace ) {
			return null;
		}
		if ( this.state.selectedDataType === 'files' ) {
			return this.renderFiles();
		}
		if ( this.state.selectedDataType === 'actions' ) {
			const data = this.props.user.lessonData;
			return ( <ActionTypesDisplay
				lessonData={data}
				selectedNamespace={this.state.selectedNamespace}
				selectedNamespaceID={this.state.selectedNamespaceID}
			/> );
		}
		if ( this.state.selectedDataType === 'messages' ) {
			return this.renderMessages();
		}
	}

	renderFiles() {
		let files = this.props.user.files;
		if ( files ) {
			files = files[ this.state.selectedNamespaceID ];
		}
		if ( !isArray( files ) ) {
			return null;
		}
		const out = [];
		for ( let i = 0; i < files.length; i++ ) {
			const file = files[ i ];
			const lessonName = id2Name( this.state.selectedNamespace.lessons, file.lesson );

			let cl = 'fas fa-file-image fa-4x';
			const pth = path.extname(file.filename);
			switch ( pth ) {
				case '.html':
					cl = 'fab fa-html5 fa-4x';
				break;
				case '.pdf':
					cl = 'far fa-file-pdf fa-4x';
				break;
				case '.jpg':
					cl = 'fas fa-file-image fa-4x';
				break;
			}
			out.push( <Media key={i}>
				<div className="mr-3">
					<a href={server+'/'+file.filename} target="_blank">
						<i className={cl} />
					</a>
				</div>
				<Media.Body>
					<a href={server+'/'+file.filename} target="_blank">
						<h4>{file.title}</h4>
					</a>
					<p>Date: {new Date( file.createdAt ).toLocaleDateString()}, Lesson: {lessonName}</p>
				</Media.Body>
			</Media> );
		}
		return out;
	}

	renderMessages() {
		if ( !this.state.selectedNamespace.announcements ) {
			return null;
		}
		return (
			<div>{ this.state.selectedNamespace.announcements.map( (value, index) => {
				const date = new Date(value.createdAt);
				const dateString = date.toLocaleDateString() + '  -  ' + date.toLocaleTimeString( navigator.language, {
					hour: '2-digit',
					minute: '2-digit'
				});
				return (
					<div key={index} className="message-container">
						<div className="message-data">
							<div className="message-profile-pic">
								<img src={value.picture} alt="Message User Profile" />
							</div>
							<div className="message-author-line">
								<span className="message-author">{ value.author } </span>
								wrote on { dateString }
							</div>
						</div>
						<div className="message-title">
							{ value.title }
						</div>
						<div className="message-body">
							{ value.body }
						</div>
					</div>
				);
			})
			}</div>
		);
	}

	renderStatisticDataToolbar() {
		const { t } = this.props;
		return (
		<Nav variant="tabs" activeKey={this.state.selectedDataType} onSelect={this.handleDataSelect}>
			<Nav.Item >
				<Nav.Link eventKey="messages" title={t('messages')}>
					{t('messages')}
				</Nav.Link>
			</Nav.Item>
			<Nav.Item >
				<Nav.Link eventKey="files" title={t('files')}>
					{t('files')}
				</Nav.Link>
			</Nav.Item>
			<Nav.Item >
				<Nav.Link eventKey="actions" title={t('actions')}>
					{t('actions')}
				</Nav.Link>
			</Nav.Item>
		</Nav>
		);
	}

	renderStatisticStatsToolbar() {
		const { t } = this.props;
		return (
			<Nav variant="tabs" activeKey={this.state.selectedStatsType} onSelect={this.handleStatsSelect}>
				<Nav.Item >
					<Nav.Link eventKey="progress" title={t('progress')}>
						{t('progress')}
					</Nav.Link>
				</Nav.Item>
				<Nav.Item >
					<Nav.Link eventKey="timeSpent" title={t('time-spent')} >
						{t('time-spent')}
					</Nav.Link>
				</Nav.Item>
			</Nav>
		);
	}

	renderStatisticSection() {
		const { t, user } = this.props;
		const courses = user.enrolledNamespaces;
		return (
			<div className="profile-page-statistics">
				<div className="profile-page-statistics-navigation-title">{t('common:courses')}</div>
				<div className="profile-page-statistics-navigation">
				<Nav variant="tabs" activeKey={this.state.selectedNamespaceID} onSelect={this.handleSelect}>
					{courses.map( ( course, i ) => {
						const title = course.title;
						const id = course._id;
						return ( <Nav.Item key={i}>
							<Nav.Link eventKey={id} title={title} data-id={i} >
								{title}
							</Nav.Link>
						</Nav.Item> );
					})}
				</Nav>
				</div>
				<div className="profile-page-statistics-data-select">{t('common:data')}</div>
				<div className="profile-page-statistics-top-actions">
					{ this.state.selectedNamespaceID ? this.renderStatisticDataToolbar() : null }
				</div>
				<div className="profile-page-statistics-title2">
					{t('common:statistics')}
				</div>
				<div className="profile-page-statistics-actions">
					{this.renderLeftPanel()}
				</div>
				<div className="profile-page-statistics-select">
					{ this.state.selectedNamespaceID ? this.renderStatisticStatsToolbar() : null }
				</div>
				<div className="profile-page-statistics-stats">
					{this.renderRightPanel()}
				</div>
			</div>
		);
	}

	renderBadgesSection() {
		let list = [];
		let badges = this.props.user.badges || [];

		for ( let i = 0; i < 24; i++ ) {
			let temp = badge;
			let desc = 'Hidden Badge';
			let display = 'profile-page-badge-item-interior unknown';
			let badgeState = 'badge-not-acquired';
			if ( i < badges.length ) {
				temp = server + '/badges/' + badges[i].picture;
				desc = badges[i].description;
				display = 'profile-page-badge-item-interior';
				if ( badges[i].acquired ) {
					badgeState='badge-acquired';
				}
			}
			list.push(
				<div style={{ animation: 'scale-up ' + ((i*0.05) + 0.1) + 's' }} className="profile-page-badge-item-nova" key={i}>
					<OverlayTrigger placement="top" overlay={<Tooltip id={`badge-${i}-description`} >{ desc }</Tooltip>}>
						<div className="profile-page-badge-item">
							<img className="mask" src={badgeCircle} alt="" />
							<div className={display} >
								<img className={badgeState} src={temp} alt="User Badge" />
							</div>
						</div>
					</OverlayTrigger>
				</div>
			);
		}
		return list;
	}

	renderUserSection() {
		const { t, user } = this.props;
		let date = null;
		if ( user.createdAt ) {
			date = new Date( user.createdAt ).toLocaleDateString();
		}
		let userPic = hoodie;
		if ( user.picture ) {
			userPic = user.picture;
		}
		const nLessons = keys( user.lessonData ).length;
		return (
			<div className="profile-page-user-container">
				<div
					role="button" className="profile-page-user-portrait"
					onClick={this.toggleProfilePicModal}
					onKeyPress={this.toggleProfilePicModal}
					tabIndex={0}
				>
					<img alt="User Profile" src={userPic} />
				</div>
				<div className="profile-page-user-personal">
					<div className="profile-page-user-personal-name">
						<Card>
							<Card.Header>
								<Card.Title as="h3">
									{user.name} <br />
									{user.organization ? <small>{user.organization}</small>: null }
								</Card.Title>
								{date ? <div>{t('registered-since', { date })}</div> : null}
							</Card.Header>
							<Card.Body>
								<div className="profile-page-user-values">
									<div className="profile-page-user-legend">{t('score')}</div>
									<div className="profile-page-user-value">
										{user.score}
									</div>
									<div className="profile-page-user-legend">{t('no-lessons')}</div>
									<div className="profile-page-user-value">{nLessons}</div>
									<div className="profile-page-user-legend">{t('time-spent')}</div>
									<div className="profile-page-user-value">
										{formatTime( user.spentTime )}
									</div>
								</div>
							</Card.Body>
						</Card>
						<div>
							<Button style={{ marginTop: 15 }} block onClick={this.toggleEditModal}>{t('edit-profile')}</Button>
						</div>
					</div>
				</div>
				<div className="profile-page-user-footer">
				</div>
			</div>
		);
	}

	render() {
		const { t } = this.props;
		return (
			<Fragment>
				<div className="profile-page-grid-container">
					<div className="profile-page-left">
						{this.renderUserSection()}
					</div>
					{this.renderStatisticSection()}
					<div className="profile-page-badge-title">{t('common:badges')}</div>
					<div className="profile-page-badge-container">
						{this.renderBadgesSection()}
					</div>
				</div>
				<EditModal
					user={this.props.user}
					authenticate={this.props.authenticate}
					show={this.state.showEditModal}
					addNotification={this.props.addNotification}
					updateUser={this.props.updateUser}
					onHide={this.toggleEditModal}
					t={t}
				/>
				<ProfilePicModal
					user={this.props.user}
					show={this.state.showProfilePicModal}
					onHide={this.toggleProfilePicModal}
					uploadProfilePic={this.props.uploadProfilePic}
					t={t}
				/>
			</Fragment>
		);
	}
}


// PROPERTIES //

ProfilePage.propTypes = {
	addNotification: PropTypes.func.isRequired,
	authenticate: PropTypes.func.isRequired,
	getFiles: PropTypes.func.isRequired,
	getLessons: PropTypes.func.isRequired,
	getUserBadges: PropTypes.func.isRequired,
	updateUser: PropTypes.func.isRequired,
	uploadProfilePic: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

ProfilePage.defaultProps = {
};


// EXPORTS //

export default withTranslation( [ 'profile_page', 'common' ] )( ProfilePage );
