// MODULES //

import React, { Component, Fragment } from 'react';
import { Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './profile-page.css';
import stats from './img/stats.png';
import badge2 from './img/badge2.svg';
import EditModal from './edit_modal.js';


// FUNCTIONS //

const createTooltip = ( str ) => {
	return <Tooltip id="tooltip">{str}</Tooltip>;
};


// MAIN //

class ProfilePage extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showModal: false
		};
	}

	gotoTokenPage = () => {
		this.props.history.replace( '/enter-token' );
	}

	renderInstructorButton() {
		if ( this.props.user.writeAccess ) {
			return null;
		}
		return ( <Button
			onClick={this.gotoTokenPage}
			size="small" variant="success"
			style={{ marginTop: -7 }}
		>Instructor Access</Button> );
	}

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal
		});
	}

	renderStatisticSection() {
		return (
			<div className="profile-page-stats-section">
				<img src={stats} />
			</div>
		);
	}

	renderBadgesSection() {
		let list = [];
		for ( let i = 0; i < 24; i++ ) {
			list.push(
				<div className="profile-page-badge-item" key={i} >
					<OverlayTrigger placement="bottom" overlay={<Tooltip id="toggle_visibility">Toggle Visibility</Tooltip>}>
						<div className="profile-page-badge-image">
							<img src={badge2} />
						</div>
					</OverlayTrigger>
				</div>
			);
		}
		return list;
	}

	renderUserSection() {
		return (
			<div className="profile-page-user-container">
				<div className="profile-page-user-portrait">
					<img src="https://isle.heinz.cmu.edu/Philipp-Burckhardt_1545932125612.jpg" />
					<Button style={{ marginTop: 5 }} onClick={this.toggleModal}>EDIT PROFILE</Button>
				</div>
				<div className="profile-page-user-personal">
					<div className="profile-page-user-personal-name">
						<Card>
							<Card.Header>
								<Card.Title as="h3">{ this.props.user.name}</Card.Title>
							</Card.Header>
							<Card.Body>
								<OverlayTrigger placement="top" overlay={createTooltip( 'Your score' )}>
									<div className="profile-page-user-score">17912</div>
								</OverlayTrigger>
								<div>COMPLETED LESSONS</div>
								<div>TIME SPENT</div>
							</Card.Body>
						</Card>
					</div>
				</div>

				<div className="profile-page-user-footer">
					{this.renderInstructorButton()}
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
					<div className="profile-page-statistics">
						{this.renderStatisticSection()}
					</div>
					<div className="profile-page-badges">
						{this.renderBadgesSection()}
					</div>
				</div>
				<EditModal
					user={this.props.user}
					show={this.state.showModal}
					addNotification={this.props.addNotification}
					updateUser={this.props.updateUser}
					onHide={this.toggleModal}
				/>
			</Fragment>
		);
	}
}


// PROPERTIES //

ProfilePage.propTypes = {
	addNotification: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	updateUser: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

ProfilePage.defaultProps = {
};


// EXPORTS //

export default ProfilePage;
