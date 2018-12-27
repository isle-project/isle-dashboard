// MODULES //

import React, { Component, Fragment } from 'react';
import {
	Badge, Button, ButtonGroup, ButtonToolbar, Card, FormLabel, FormGroup, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import DetailsModal from './details_modal.js';
import DeleteModal from './delete_modal.js';
import COLORS from './../../constants/colors';
import background from './architecture.jpeg';


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

	renderButtonToolbar() {
		const activeStyle = this.props.active === true ? 'success' : 'warning';
		const publicStyle = this.props.public === true ? 'success' : 'warning';
		return ( <ButtonToolbar style={{
			paddingTop: 5,
			paddingLeft: 5,
			paddingRight: 5,
			position: 'absolute',
			top: 180,
			width: '100%',
			height: '50px',
			left: 5,
			background: 'rgba(0, 0, 0, 0.75)',
			border: '1px solid transparent',
			borderRadius: '4px'
		}}>
			<ButtonGroup style={{ marginRight: '5px' }} >
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="open_details">Open Details</Tooltip>}>
					<Button onClick={this.showDetailsModal}>
						<i className="fa fa-cog"></i>
					</Button>
				</OverlayTrigger>
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="toggle_availability">Toggle Availability</Tooltip>}>
					<Button onClick={this.toggleLessonState}>
						<i className="fa fa-power-off"></i>
					</Button>
				</OverlayTrigger>
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="toggle_visibility">Toggle Visibility</Tooltip>}>
					<Button onClick={this.toggleLessonVisibility}>
						<i className="fa fa-lock"></i>
					</Button>
				</OverlayTrigger>
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="delete_lesson">Delete Lesson</Tooltip>}>
					<Button onClick={this.showDeleteModal} >
						<i className="fa fa-trash-alt"></i>
					</Button>
				</OverlayTrigger>
			</ButtonGroup>
			<FormGroup>
				<FormLabel style={{ marginRight: '2px' }}>
					<Badge variant={activeStyle} style={{
						fontSize: '12px'
					}}>{this.props.active ? 'Active' : 'Inactive'}</Badge>
				</FormLabel>
				<FormLabel>
					<Badge variant={publicStyle} style={{
						fontSize: '12px'
					}}>{this.props.public ? 'Public' : 'Private'}</Badge>
				</FormLabel>
			</FormGroup>
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
