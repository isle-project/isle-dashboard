// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Media, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import path from 'path';
import keys from '@stdlib/utils/keys';
import isArray from '@stdlib/assert/is-array';
import formatTime from 'utils/format_time.js';
import server from 'constants/server';
import EditModal from './edit_modal.js';
import EnterTokenModal from './enter_token_modal.js';
import ProfilePicModal from './profile_pic_modal.js';
import TimeSpent from './time_spent.js';
import ProgressStats from './progress.js';
import ActionTypesDisplay from './action_types_display.js';
import hoodie from './img/hoodie.jpg';
import badge from './img/question.svg';
import badgeCircle from './img/badge_circle.svg';
import './profile-page.css';
import './message-page.css';

let now = 'Mo, 7.7.2018, 13:48';

const Announcement = [
	{
	author: 'Philipp Burckhardt',
	picture: 'https://isle.heinz.cmu.edu/avatar/5c28cd2e48f70e7ff2cd370f.jpeg',
	title: 'Automatic grading will soon be enabled',
	body: 'We are proud to present the new automatic grading system.',
	createdAt: now
	},
	{
	author: 'Philipp Burckhardt',
	picture: 'https://isle.heinz.cmu.edu/avatar/5c28cd2e48f70e7ff2cd370f.jpeg',
	title: 'Phishing activities, beware!!!',
	body: 'It seems that we have been hacked. It may be very probable that Russians have stolen hundreds of passwords.',
	createdAt: now
	},
	{
	author: 'Martin Burckhardt',
	picture: 'https://isle.heinz.cmu.edu/avatar/595a9c3c8c7dcf6c3cbe0464.jpg',
	title: 'Too lazy!',
	body: 'It seems that we have been hacked. It may be very probable that Russians have stolen hundreds of passwords.',
	createdAt: now
	}
];

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
		if (props.user.enrolledNamespaces.length > 0) {
			selectedNamespace = props.user.enrolledNamespaces[0];
			selectedNamespaceID = selectedNamespace._id;
		}


		this.state = {
			showEditModal: false,
			showTokenModal: false,
			showProfilePicModal: false,
			selectedNamespace: selectedNamespace,
			selectedNamespaceID: selectedNamespaceID,
			selectedDataType: 'messages',
			selectedStatsType: 'progress'

		};
	}

	componentDidMount() {
		if ( !this.props.user.files ) {
			this.props.getFiles({ token: this.props.user.token });
		}
		this.props.addBadges(this.props.user.token);
	}

	renderInstructorButton() {
		if ( this.props.user.writeAccess ) {
			return null;
		}
		return ( <Button
			onClick={this.toggleTokenModal}
			variant="success"
			style={{ marginLeft: 10, marginTop: 15 }}
		>Instructor Access</Button> );
	}

	toggleEditModal = () => {
		this.setState({
			showEditModal: !this.state.showEditModal
		});
	}

	toggleTokenModal = () => {
		this.setState({
			showTokenModal: !this.state.showTokenModal
		});
	}

	toggleProfilePicModal = () => {
		this.setState({
			showProfilePicModal: !this.state.showProfilePicModal
		});
	}

	handleSelect = ( newValue, event ) => {
		console.log('NEW VALUE ' + newValue);
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
		if ( this.state.selectedStatsType === 'progress' ) {
			return (
				<ProgressStats
					user={this.props.user}
					selectedNamespace={this.state.selectedNamespace}
				/>
			);
		}
		if (this.state.selectedStatsType === 'timeSpent') {
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
		if (this.state.selectedDataType === 'files') {
			return this.renderFiles();
		}

		if (this.state.selectedDataType === 'actions') {
			const data = this.props.user.lessonData;
			return ( <ActionTypesDisplay
				lessonData={data}
				selectedNamespace={this.state.selectedNamespace}
				selectedNamespaceID={this.state.selectedNamespaceID}
			/> );
		}

		if (this.state.selectedDataType === 'messages') {
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
			switch (pth) {
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

			out.push( <Media>
				<div className="mr-3">
					<a href={server+'/'+file.filename} target="_blank">
						<i className={cl} />
					</a>
				</div>
				<Media.Body>
					<h4>{file.title}</h4>
					<p>Date: {new Date( file.createdAt ).toLocaleDateString()}, Lesson: {lessonName}</p>
				</Media.Body>
			</Media> );
		}
		return out;
	}


	getMessage(ndx) {
		return (
			<div className="message-container">
				<div className="message-data">
					<div className="message-profile-pic">
						<img src={Announcement[ndx].picture} />
					</div>

					<div className="message-author-line">
						<span className="message-author">{ Announcement[ndx].author } </span>
						wrote on { Announcement[ndx].createdAt }
					</div>
				</div>

				<div className="message-title">
					{ Announcement[ndx].title }
				</div>
				<div className="message-body">
					{ Announcement[ndx].body }
				</div>
			</div>
		);
	}

	renderMessages() {
		let msg = [];
		for (let i = 0; i < Announcement.length; i++) {
			msg.push(this.getMessage(i));
		}
		console.log(msg);

		return (
			<div>{ msg }</div>
		);
	}

	renderStatisticDataToolbar() {
		return (
		<Nav variant="tabs" activeKey={this.state.selectedDataType} onSelect={this.handleDataSelect}>
			<Nav.Item >
				<Nav.Link eventKey="messages" title="Messages">
					Messages
				</Nav.Link>
			</Nav.Item>
			<Nav.Item >
				<Nav.Link eventKey="files" title="Files">
					Files
				</Nav.Link>
			</Nav.Item>
			<Nav.Item >
				<Nav.Link eventKey="actions" title="Actions">
					Actions
				</Nav.Link>
			</Nav.Item>
		</Nav>
		);
	}

	renderStatisticStatsToolbar() {
		return (
			<Nav variant="tabs" activeKey={this.state.selectedStatsType} onSelect={this.handleStatsSelect}>
				<Nav.Item >
					<Nav.Link eventKey="progress" title="progress">
						Progress
					</Nav.Link>
				</Nav.Item>
				<Nav.Item >
					<Nav.Link eventKey="timeSpent" title="timeSpent">
						Time spent
					</Nav.Link>
				</Nav.Item>
			</Nav>
		);
	}

	renderStatisticSection() {
		const courses = this.props.user.enrolledNamespaces;
		return (
			<div className="profile-page-statistics">
				<div className="profile-page-statistics-navigation-title">Courses</div>
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
				<div className="profile-page-statistics-data-select">Data</div>
				<div className="profile-page-statistics-top-actions">
					{ this.state.selectedNamespaceID ? this.renderStatisticDataToolbar() : null }
				</div>
				<div className="profile-page-statistics-title2">
					Statistics
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
					<OverlayTrigger placement="bottom" overlay={<Tooltip id="description">{ desc }</Tooltip>}>
						<div className="profile-page-badge-item">
							<img className="mask" src={badgeCircle} />
							<div className={display} >
							<img className={badgeState} src={temp} />
							</div>
						</div>
					</OverlayTrigger>
				</div>
			);
		}
		return list;
	}

	renderUserSection() {
		const user = this.props.user;
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
				<div className="profile-page-user-portrait">
					<img onClick={this.toggleProfilePicModal} src={userPic} />
				</div>
				<div className="profile-page-user-personal">
					<div className="profile-page-user-personal-name">
						<Card>
							<Card.Header>
								<Card.Title as="h3">
									{user.name} <br />
									{user.organization ? <small>{user.organization}</small>: null }
								</Card.Title>
								{date ? <div>registered since {date}</div> : null}
							</Card.Header>
							<Card.Body>
								<div className="profile-page-user-values">
									<div className="profile-page-user-legend">Score</div>
									<div className="profile-page-user-value">
										{user.score}
									</div>
									<div className="profile-page-user-legend">No. of Lessons</div>
									<div className="profile-page-user-value">{nLessons}</div>
									<div className="profile-page-user-legend">Time spent</div>
									<div className="profile-page-user-value">
										{formatTime( user.spentTime )}
									</div>
								</div>
							</Card.Body>
						</Card>
						<Button style={{ marginTop: 15 }} onClick={this.toggleEditModal}>Edit Profile</Button>
						{this.renderInstructorButton()}
					</div>
				</div>
				<div className="profile-page-user-footer">
				</div>
			</div>
		);
	}

	render() {
		return (
			<Fragment>
				<div className="profile-page-grid-container">
					<div className="profile-page-left">
						{this.renderUserSection()}
					</div>
					{this.renderStatisticSection()}
					<div className="profile-page-badge-title">Badges</div>
					<div className="profile-page-badge-container">
						{this.renderBadgesSection()}
					</div>
				</div>
				<EditModal
					user={this.props.user}
					show={this.state.showEditModal}
					addNotification={this.props.addNotification}
					updateUser={this.props.updateUser}
					onHide={this.toggleEditModal}
				/>
				<EnterTokenModal
					user={this.props.user}
					authenticate={this.props.authenticate}
					show={this.state.showTokenModal}
					onHide={this.toggleTokenModal}
				/>
				<ProfilePicModal
					user={this.props.user}
					authenticate={this.props.authenticate}
					show={this.state.showProfilePicModal}
					onHide={this.toggleProfilePicModal}
					uploadProfilePic={this.props.uploadProfilePic}
				/>
			</Fragment>
		);
	}
}


// PROPERTIES //

ProfilePage.propTypes = {
	addBadges: PropTypes.func.isRequired,
	addNotification: PropTypes.func.isRequired,
	authenticate: PropTypes.func.isRequired,
	getFiles: PropTypes.func.isRequired,
	getLessons: PropTypes.func.isRequired,
	updateUser: PropTypes.func.isRequired,
	uploadProfilePic: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

ProfilePage.defaultProps = {
};


// EXPORTS //

export default ProfilePage;
