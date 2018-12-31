// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Media, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import path from 'path';
import keys from '@stdlib/utils/keys';
import isArray from '@stdlib/assert/is-array';
import formatTime from 'utils/format_time.js';
import server from 'constants/server';
import hoodie from './img/hoodie.jpg';
import EditModal from './edit_modal.js';
import EnterTokenModal from './enter_token_modal.js';
import ProfilePicModal from './profile_pic_modal.js';
import Statistics from './statistics.js';
import badges from './badges.js';
import badge from './img/question.svg';
import badgeCircle from './img/badge_circle.svg';
import './profile-page.css';


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

		this.state = {
			showEditModal: false,
			showTokenModal: false,
			showProfilePicModal: false,
			selectedNamespace: null,
			selectedNamespaceID: null
		};
	}

	componentDidMount() {
		if ( !this.props.user.files ) {
			this.props.getFiles({ token: this.props.user.token });
		}
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

	renderStatisticNavigation() {
		console.log(this.props.user);
		let courses = this.props.user.enrolledNamespaces;
		let arr = [];
		for ( let i = 0; i < courses.length; i++) {
			const title = courses[i].title;
			const id = courses[i]._id;
			arr.push(
				<Nav.Item key={i}>
					<Nav.Link eventKey={id} title={title} data-id={i} >{title}</Nav.Link>
				</Nav.Item>
			);
		}
		return arr;
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

	renderStatisticSection() {
		return (
			<div className="profile-page-statistics">
				<div className="profile-page-statistics-navigation-title">Courses</div>
				<div className="profile-page-statistics-navigation">
				<Nav variant="tabs" activeKey={this.state.selectedNamespaceID} onSelect={this.handleSelect}>
					{ this.renderStatisticNavigation()}
				</Nav>
				</div>
				<div className="profile-page-statistics-title1">Files</div>
				<div className="profile-page-statistics-title2">Statistics</div>
				<div className="profile-page-statistics-actions">
						{this.renderFiles()}
				</div>
				<div className="profile-page-statistics-stats">
					<Statistics user={this.props.user} selectedNamespace={this.state.selectedNamespace} />
				</div>
			</div>
		);
	}

	renderBadgesSection() {
		let list = [];
		for ( let i = 0; i < 24; i++ ) {
			let temp = badge;
			let desc = 'Toggle visibility';
			let display = 'profile-page-badge-item-interior unknown';
			let badgeState = 'badge-not-acquired';

			if (i < badges.length) {
				temp = badges[i].picture;
				desc = badges[i].description;
				display = 'profile-page-badge-item-interior';
				if (badges[i].acquired) badgeState='badge-acquired';
			}


			var ani = 'scale-up ' + ((i*0.05) + 0.1) + 's';

			list.push(
				<div style={{ animation: ani }} className="profile-page-badge-item-nova" key={i}>
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
