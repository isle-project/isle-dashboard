// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import floor from '@stdlib/math/base/special/floor';
import hoodie from './img/hoodie.jpg';
import EditModal from './edit_modal.js';
import EnterTokenModal from './enter_token_modal.js';
import ProfilePicModal from './profile_pic_modal.js';
import badges from './badges.js';
import badge from './img/question.svg';
import badgeCircle from './img/badge_circle.svg';
import './profile-page.css';


// FUNCTIONS //

const formatTime = ( time ) => {
	time = time / 1000;
	const hours = floor( time / ( 60*60 ) );
	time = time % ( 60*60 );
	let minutes = floor( time / 60 );
	if ( minutes < 10 ) {
		minutes = '0'+minutes;
	}
	return hours + ':' + minutes;
};


// MAIN //

class ProfilePage extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showEditModal: false,
			showTokenModal: false,
			showProfilePicModal: false
		};
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

	renderStatisticSection() {
		return (
			<div className="profile-page-statistics">
				<div className="profile-page-statistics-title1">Actions</div>
				<div className="profile-page-statistics-title2">Statistics</div>
				<div className="profile-page-statistics-actions"></div>
				<div className="profile-page-statistics-stats"></div>
			</div>
		);
	}

	renderBadgesSection() {
		let list = [];
		for ( let i = 0; i < 24; i++ ) {
			let temp = badge;
			let desc = 'Toggle visibility';
			let display = 'profile-page-badge-item-interior unknown';

			if (i < badges.length) {
				temp = badges[i].picture;
				desc = badges[i].description;
				display = 'profile-page-badge-item-interior';
			}

			var ani = 'scale-up ' + ((i*0.05) + 0.1) + 's';

			list.push(
				<div style={{ animation: ani }} className="profile-page-badge-item-nova" key={i}>
					<OverlayTrigger placement="bottom" overlay={<Tooltip id="description">{ desc }</Tooltip>}>
						<div className="profile-page-badge-item">
							<img className="mask" src={badgeCircle} />
							<div className={display} >
							<img src={temp} />
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
									<div className="profile-page-user-legend">Completed Lessons</div>
									<div className="profile-page-user-value">13</div>
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
	updateUser: PropTypes.func.isRequired,
	uploadProfilePic: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

ProfilePage.defaultProps = {
};


// EXPORTS //

export default ProfilePage;
