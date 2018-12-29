// MODULES //

import React, { Component, Fragment } from 'react';
import {
	Badge, Button, ButtonGroup, ButtonToolbar, Card, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import DetailsModal from './details_modal.js';
import DeleteModal from './delete_modal.js';
import COLORS from './../../constants/colors';
import background from './architecture.jpeg';
import './lessons.css';
import upload from './upload.svg';


// MAIN //

class Lesson extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showDeleteModal: false,
			showDetailsModal: false
		};

		this.showDeleteModal = () => {
			this.setState({ showDeleteModal: true });
		};

		this.showDetailsModal = () => {
			this.setState({ showDetailsModal: true });
		};

		this.closeDeleteModal = () => {
			this.setState({ showDeleteModal: false });
		};

		this.closeDetailsModal = () => {
			this.setState({ showDetailsModal: false });
		};

		this.toggleLessonState = () => {
			const query = {
				lessonName: this.props.title,
				namespaceName: this.props.namespace,
				token: this.props.token
			};
			if ( this.props.active ) {
				this.props.deactivateLesson( query );
			} else {
				this.props.activateLesson( query );
			}
		};

		this.toggleLessonVisibility = () => {
			const query = {
				lessonName: this.props.title,
				namespaceName: this.props.namespace,
				token: this.props.token
			};
			if ( this.props.public ) {
				this.props.hideLessonInGallery( query );
			} else {
				this.props.showLessonInGallery( query );
			}
		};

		this.delete = () => {
			this.props.deleteLesson({
				lessonName: this.props.title,
				namespaceName: this.props.namespace,
				token: this.props.token
			});
			this.closeDeleteModal();
		};

		this.update = ({ newTitle, newDescription }) => {
			this.props.updateLesson({
				lessonName: this.props.title,
				namespaceName: this.props.namespace,
				token: this.props.token,
				newTitle,
				newDescription
			}, () => {
				this.props.getLessons( this.props.namespace );
			});
			this.closeDetailsModal();
		};
	}

	renderButtonToolbarDate() {
		if (!this.props.updatedAt) return null;

		let date = null;
		let updated = null;

		if (this.props.updatedAt) {
			updated = new Date(this.props.updatedAt);
			updated = updated.toLocaleDateString();
			if (this.props.createdAt) {
				date = new Date(this.props.createdAt);
				date = date.toLocaleDateString();
			}
			else date = updated;
			}

		return (
			<span className="lessons-upload">
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="toggle_visibility">created at</Tooltip>}>
				<span className="lessons-uploaded-image"><img style={{ stroke: 'white', fill: 'red'}} src={upload} /></span>
			</OverlayTrigger>
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="toggle_visibility">updated at {updated}</Tooltip>}>
			<span className="lessons-uploaded">{date}</span>
			</OverlayTrigger>
		</span>
		);
	}

	renderButtonToolbar() {
		const activeStyle = this.props.active === true ? 'success' : 'warning';
		const publicStyle = this.props.public === true ? 'success' : 'warning';
		return ( <ButtonToolbar style={{
			position: 'absolute',
			top: 180,
			width: '100%',
			background: 'rgba(0, 0, 0, 0.75)'
		}}>
			<ButtonGroup style={{ marginRight: '5px' }} >
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="open_details">Open Details</Tooltip>}>
					<Button size="small" variant="secondary" onClick={this.showDetailsModal}>
						<i className="fa fa-cog"></i>
					</Button>
				</OverlayTrigger>
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="delete_lesson">Delete Lesson</Tooltip>}>
					<Button size="small" variant="secondary" onClick={this.showDeleteModal} >
						<i className="fa fa-trash-alt"></i>
					</Button>
				</OverlayTrigger>
			</ButtonGroup>
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="toggle_availability">Toggle Availability</Tooltip>}>
				<Badge className="lessons-status" onClick={this.toggleLessonState} variant={activeStyle} >{this.props.active ? 'Active' : 'Inactive'}</Badge>
			</OverlayTrigger>
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="toggle_visibility">Toggle Visibility</Tooltip>}>
				<Badge className="lessons-status" onClick={this.toggleLessonVisibility} variant={publicStyle}>{this.props.public ? 'Public' : 'Private'}</Badge>
			</OverlayTrigger>
			{ this.renderButtonToolbarDate() }

		</ButtonToolbar> );
	}

	renderModals() {
		return ( <Fragment>
			<DeleteModal {...this.props} show={this.state.showDeleteModal} close={this.closeDeleteModal} delete={this.delete} />
			<DetailsModal {...this.props} show={this.state.showDetailsModal} close={this.closeDetailsModal} update={this.update} />
		</Fragment> );
	}

	render() {
		return (
			<Card>
				<Card.Body style={{ padding: 0 }}>
					<div style={{
						filter: 'grayscale(30%)',
						background: COLORS[ this.props.colorIndex ]
					}} className="hovereffect">
						<img
							className="img-responsive"
							src={background}
							alt=""
							style={{
								width: '100%',
								height: 180
							}}
						/>
						<div className="overlay" >
							<h2>{this.props.title}</h2>
							<h3>{this.props.description}</h3>
							<span
								ref={( link ) => {
									this.link = link;
								}}
								className="info"
								onClick={() => {
									const win = window.open( this.props.url, '_blank' );
									win.focus();
								}}
							>
								Open Lesson
							</span>
						</div>
					</div>
					{this.renderButtonToolbar()}
					{this.renderModals()}
				</Card.Body>
			</Card>
		);
	}
}


// PROPERTY TYPES //

Lesson.propTypes = {
	activateLesson: PropTypes.func.isRequired,
	active: PropTypes.bool.isRequired,
	colorIndex: PropTypes.number.isRequired,
	deactivateLesson: PropTypes.func.isRequired,
	deleteLesson: PropTypes.func.isRequired,
	description: PropTypes.string.isRequired,
	getLessons: PropTypes.func.isRequired,
	hideLessonInGallery: PropTypes.func.isRequired,
	namespace: PropTypes.string.isRequired,
	public: PropTypes.bool.isRequired,
	showLessonInGallery: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	token: PropTypes.string.isRequired,
	updateLesson: PropTypes.func.isRequired,
	url: PropTypes.string.isRequired
};


// EXPORTS //

export default Lesson;
