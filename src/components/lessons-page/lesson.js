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
import logger from 'debug';
import {
	Badge, Button, ButtonGroup, ButtonToolbar, Card, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import copyToClipboard from 'clipboard-copy';
import DetailsModal from './details_modal.js';
import DeleteModal from './delete_modal.js';
import COLORS from 'constants/colors';
import background from './architecture.jpeg';
import upload from './upload.svg';
import './lesson.css';


// VARIABLES //

const DEFAULT_DESCRIPTION = 'No description supplied.';
const debug = logger( 'isle:lessons-page:lesson' );


// FUNCTIONS //

function addDefaultSrc( event ) {
	event.target.src = background;
}


// MAIN //

class Lesson extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showDeleteModal: false,
			showDetailsModal: false,
			isleFile: null
		};
	}

	toggleLessonState = () => {
		const query = {
			lessonName: this.props.title,
			namespaceName: this.props.namespace
		};
		if ( this.props.active ) {
			this.props.deactivateLesson( query );
		} else {
			this.props.activateLesson( query );
		}
	}

	toggleLessonVisibility = () => {
		const query = {
			lessonName: this.props.title,
			namespaceName: this.props.namespace
		};
		if ( this.props.public ) {
			this.props.hideLessonInGallery( query );
		} else {
			this.props.showLessonInGallery( query );
		}
	}

	delete = () => {
		this.props.deleteLesson({
			lessonName: this.props.title,
			namespaceName: this.props.namespace
		});
		this.closeDeleteModal();
	}

	update = ({ newTitle, newDescription }) => {
		this.props.updateLesson({
			lessonName: this.props.title,
			namespaceName: this.props.namespace,
			newTitle,
			newDescription
		});
		this.closeDetailsModal();
	}

	showDeleteModal = () => {
		this.setState({ showDeleteModal: true });
	}

	showDetailsModal = () => {
		this.setState({ showDetailsModal: true });
	}

	closeDeleteModal = () => {
		this.setState({ showDeleteModal: false });
	};

	closeDetailsModal = () => {
		this.setState({ showDetailsModal: false });
	}

	getIsleFile = () => {
		debug( 'Request ISLE source code from server...' );
		if ( !this.state.isleFile ) {
			this.props.getIsleFile({
				lessonName: this.props.title,
				namespaceName: this.props.namespace,
				callback: ( err, body ) => {
					if ( err ) {
						return this.props.addNotification({
							message: err.message,
							level: 'error'
						});
					}
					this.setState({
						isleFile: body
					});
				}
			});
		}
	}

	copyIsleFileToClipboard = () => {
		if ( !this.state.isleFile ) {
			return this.props.addNotification({
				message: 'Source could not be fetched. Please try again in a few seconds.',
				level: 'error'
			});
		}
		const promise = copyToClipboard( this.state.isleFile );
		promise.then( () => {
			this.props.addNotification({
				message: 'Source code has been copied to the clipboard',
				level: 'success'
			});
		}).catch( err => {
			this.props.addNotification({
				message: err.message,
				level: 'error'
			});
		});
	}

	copyLinkToClipboard = () => {
		const promise = copyToClipboard( this.props.url );
		promise.then( () => {
			this.props.addNotification({
				message: 'Link has been copied to the clipboard',
				level: 'success'
			});
		}).catch( err => {
			this.props.addNotification({
				message: err.message,
				level: 'error'
			});
		});
	}

	showPreviewImage = () => {
		this.img.src = this.props.url+'/preview.jpg';
	}

	openLesson = () => {
		const win = window.open( this.props.url, '_blank' );
		win.focus();
	}

	renderButtonToolbarDate() {
		let updated = new Date( this.props.updatedAt );
		updated = updated.toLocaleDateString();

		let date = new Date( this.props.createdAt );
		date = date.toLocaleDateString();
		return (
			<span className="lessons-upload">
			<OverlayTrigger placement="top" overlay={<Tooltip id="toggle_visibility">created at</Tooltip>}>
				<span className="lessons-uploaded-image">
					<img alt="Upload Date Icon" style={{ stroke: 'white', fill: 'red' }} src={upload} />
				</span>
			</OverlayTrigger>
			<OverlayTrigger placement="top" overlay={<Tooltip id="toggle_visibility">last updated at {updated}</Tooltip>}>
				<span className="lessons-uploaded">{date}</span>
			</OverlayTrigger>
		</span>
		);
	}

	renderButtonToolbar() {
		const activeStyle = this.props.active === true ? 'success' : 'warning';
		const publicStyle = this.props.public === true ? 'success' : 'warning';
		return ( <ButtonToolbar className="lesson-button-toolbar">
			<ButtonGroup style={{ marginRight: '5px' }} >
				<OverlayTrigger placement="top" overlay={<Tooltip id="open_details">Open Details</Tooltip>}>
					<Button size="sm" variant="secondary" onClick={this.showDetailsModal}>
						<i className="fa fa-cog"></i>
					</Button>
				</OverlayTrigger>
				<OverlayTrigger placement="top" overlay={<Tooltip id="delete_lesson">Delete Lesson</Tooltip>}>
					<Button size="sm" variant="secondary" onClick={this.showDeleteModal} >
						<i className="fa fa-trash-alt"></i>
					</Button>
				</OverlayTrigger>
				<OverlayTrigger placement="top" overlay={<Tooltip id="isle-file">Copy ISLE file to clipboard</Tooltip>}>
					<Button variant="secondary" size="sm" onFocus={this.getIsleFile} onMouseEnter={this.getIsleFile} onClick={this.copyIsleFileToClipboard} style={{ float: 'right' }}>
						<i className="fa fa-clipboard"></i>
					</Button>
				</OverlayTrigger>
			</ButtonGroup>
			<OverlayTrigger placement="top" overlay={<Tooltip id="toggle_availability">{this.props.active ? 'Disable lesson': 'Activate lesson'}</Tooltip>}>
				<Badge className="lessons-status" onClick={this.toggleLessonState} variant={activeStyle} >{this.props.active ? 'Active' : 'Inactive'}</Badge>
			</OverlayTrigger>
			<OverlayTrigger placement="top" overlay={<Tooltip id="toggle_visibility">{this.props.public ? 'Remove lesson from gallery' : 'Show lesson in gallery' }</Tooltip>}>
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
			<Card className="animated-lesson-card">
				<Card.Body style={{ padding: 0 }}>
					<div style={{
						filter: 'grayscale(30%)',
						background: COLORS[ this.props.colorIndex ]
					}} className="hovereffect"
						onMouseOver={this.showPreviewImage}
						onFocus={this.showPreviewImage}
					>
						<img
							className="img-responsive"
							src={background}
							ref={( div ) => {
								this.img = div;
							}}
							alt=""
							style={{
								width: '100%',
								height: 180
							}}
							onError={addDefaultSrc}
						/>
						<div
							className="overlay"
							onClick={this.openLesson} onKeyPress={this.openLesson}
							tabIndex={0} role="button"
						>
							<h2>{this.props.title}</h2>
							{this.props.description !== DEFAULT_DESCRIPTION ?
								<h3>{this.props.description}</h3> :
								null
							}
							<span
								ref={( link ) => {
									this.link = link;
								}}
								className="info"
							>
								Open Lesson
							</span>
						</div>
					</div>
					<OverlayTrigger placement="top" overlay={<Tooltip id="copy_link">Copy link to clipboard</Tooltip>}>
						<i
							role="button" tabIndex={0}
							className="lesson-link-icon fas fa-external-link-alt"
							onClick={this.copyLinkToClipboard}
							onKeyPress={this.copyLinkToClipboard}
						></i>
					</OverlayTrigger>
					{this.renderButtonToolbar()}
					{this.renderModals()}
				</Card.Body>
			</Card>
		);
	}
}


// PROPERTIES //

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
	updateLesson: PropTypes.func.isRequired,
	url: PropTypes.string.isRequired
};


// EXPORTS //

export default Lesson;
