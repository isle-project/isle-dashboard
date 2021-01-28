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
import { withTranslation } from 'react-i18next';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
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
const IS_IOS = isIOS();


// FUNCTIONS //

function addDefaultSrc( event ) {
	event.target.src = background;
}

function isIOS() {
	return [
		'iPad Simulator',
		'iPhone Simulator',
		'iPod Simulator',
		'iPad',
		'iPhone',
		'iPod'
	].includes( navigator.platform ) ||
	(
		navigator.userAgent.includes('Mac') &&
		'ontouchend' in document
	);
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

	update = async ({ newTitle, newDescription, lockUntil }) => {
		const bool = await this.props.updateLesson({
			lessonName: this.props.title,
			namespaceName: this.props.namespace,
			newTitle,
			newDescription,
			lockUntil: lockUntil ? lockUntil.getTime() : null
		});
		if ( bool ) {
			this.closeDetailsModal();
		}
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

	getIsleFile = async () => {
		debug( 'Request ISLE source code from server...' );
		if ( !this.state.isleFile ) {
			const data = await this.props.getIsleFile({
				lessonName: this.props.title,
				namespaceName: this.props.namespace
			});
			if ( data ) {
				this.setState({
					isleFile: data
				});
			}
		}
	}

	copyIsleFileToClipboard = () => {
		if ( !this.state.isleFile ) {
			return this.props.addNotification({
				message: this.props.t('source-file-error'),
				level: 'error'
			});
		}
		const promise = copyToClipboard( this.state.isleFile );
		promise.then( () => {
			this.props.addNotification({
				message: this.props.t('source-file-copied'),
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
				message: this.props.t('link-copied'),
				level: 'success'
			});
		}).catch( err => {
			this.props.addNotification({
				message: err.message,
				level: 'error'
			});
		});
	}

	copyNameToClipboard = ( event ) => {
		event.stopPropagation();
		const promise = copyToClipboard( this.props.title );
		promise.then( () => {
			this.props.addNotification({
				message: this.props.t('name-copied'),
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
		if ( IS_IOS ) {
			window.location = this.props.url;
		} else {
			const win = window.open( this.props.url, '_blank' );
			win.focus();
		}
	}

	renderButtonToolbarDate() {
		const { t } = this.props;

		let updated = new Date( this.props.updatedAt );
		updated = updated.toLocaleDateString();

		let date = new Date( this.props.createdAt );
		date = date.toLocaleDateString();
		return (
			<span className="lessons-upload">
			<OverlayTrigger placement="top" overlay={<Tooltip id="toggle_visibility">{t('created-at')}</Tooltip>}>
				<span className="lessons-uploaded-image">
					<img alt="Upload Date Icon" style={{ stroke: 'white', fill: 'red' }} src={upload} />
				</span>
			</OverlayTrigger>
			<OverlayTrigger placement="top" overlay={<Tooltip id="toggle_visibility">{t('last-updated')}{updated}</Tooltip>}>
				<span className="lessons-uploaded">{date}</span>
			</OverlayTrigger>
		</span>
		);
	}

	renderActivateButton() {
		const { lockUntil, t } = this.props;
		const activeStyle = this.props.active === true ? 'success' : 'warning';
		if ( lockUntil ) {
			return ( <OverlayTrigger placement="top" overlay={<Tooltip id="lockUntil_disabled">
				{t('scheduled-at', { date: lockUntil.toLocaleString() })}
			</Tooltip>} >
				<Badge
					className="lessons-status"
					variant={activeStyle}
					style={{
						opacity: 0.3
					}}
				>
					{this.props.active ? t('active') : t('inactive')}
				</Badge>
			</OverlayTrigger> );
		}
		return (
			<OverlayTrigger placement="top" overlay={<Tooltip id="toggle_availability">{this.props.active ? t('disable-lesson') : t('activate-lesson')}</Tooltip>}>
				<Badge
					className="lessons-status"
					onClick={this.toggleLessonState}
					variant={activeStyle}
				>
					{this.props.active ? t('active') : t('inactive')}
				</Badge>
			</OverlayTrigger>
		);
	}

	renderButtonToolbar() {
		const { t } = this.props;
		const publicStyle = this.props.public === true ? 'success' : 'warning';
		return ( <ButtonToolbar className="lesson-button-toolbar">
			<ButtonGroup style={{ marginRight: '5px' }} >
				<OverlayTrigger placement="top" overlay={<Tooltip id="open_details">{t('open-details')}</Tooltip>}>
					<Button size="sm" variant="secondary" onClick={this.showDetailsModal} aria-label={t('open-details')} >
						<i className="fa fa-cog"></i>
					</Button>
				</OverlayTrigger>
				<OverlayTrigger placement="top" overlay={<Tooltip id="delete_lesson">{t('delete-lesson')}</Tooltip>}>
					<Button size="sm" variant="secondary" onClick={this.showDeleteModal} aria-label={t('delete-lesson')} >
						<i className="fa fa-trash-alt"></i>
					</Button>
				</OverlayTrigger>
				<OverlayTrigger placement="top" overlay={<Tooltip id="isle-file">{t('copy-file')}</Tooltip>}>
					<Button variant="secondary" size="sm" onFocus={this.getIsleFile} onMouseEnter={this.getIsleFile}
						onClick={this.copyIsleFileToClipboard} style={{ float: 'right' }}
						aria-label={t('copy-file')}
					>
						<i className="fa fa-clipboard"></i>
					</Button>
				</OverlayTrigger>
			</ButtonGroup>
			{this.renderActivateButton()}
			<OverlayTrigger placement="top" overlay={<Tooltip id="toggle_visibility">{this.props.public ? t('remove-from-gallery') : t('show-in-gallery') }</Tooltip>}>
				<Badge className="lessons-status" onClick={this.toggleLessonVisibility} variant={publicStyle}>{this.props.public ? t(('public')) : t('private')}</Badge>
			</OverlayTrigger>
			{ this.renderButtonToolbarDate() }
		</ButtonToolbar> );
	}

	renderModals() {
		return ( <Fragment>
			<DeleteModal {...this.props} show={this.state.showDeleteModal} close={this.closeDeleteModal} delete={this.delete} />
			{ this.state.showDetailsModal ?
				<DetailsModal {...this.props} show={this.state.showDetailsModal} close={this.closeDetailsModal} update={this.update} /> :
				null
			}
		</Fragment> );
	}

	render() {
		const { t } = this.props;
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
							style={{ cursor: 'cell' }}
						>
							<h2>
								<OverlayTrigger
									placement="top"
									overlay={<Tooltip id="copy_name">
										{t('common:copy-name')
									}</Tooltip>}
								>
									<span
										className="lesson-title-button"
										role="button" tabIndex={0}
										onClick={this.copyNameToClipboard}
										onKeyPress={this.copyNameToClipboard}
									>
										{this.props.title}
									</span>
								</OverlayTrigger>
							</h2>
							{this.props.description !== DEFAULT_DESCRIPTION ?
								<h3>{this.props.description}</h3> :
								null
							}
							<span
								ref={( link ) => {
									this.link = link;
								}}
								className="info"
								onClick={this.openLesson} onKeyPress={this.openLesson}
								tabIndex={0} role="button"
							>
								{t('open-lesson')}
							</span>
						</div>
					</div>
					<OverlayTrigger placement="top" overlay={<Tooltip id="copy_link">{t('common:copy-link')}</Tooltip>}>
						<i
							role="button" tabIndex={0}
							className="lesson-link-icon fas fa-external-link-alt"
							onClick={this.copyLinkToClipboard}
							onKeyPress={this.copyLinkToClipboard}
							aria-label={t('common:copy-link')}
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
	lockUntil: PropTypes.instanceOf( Date ),
	namespace: PropTypes.string.isRequired,
	public: PropTypes.bool.isRequired,
	showLessonInGallery: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	updateLesson: PropTypes.func.isRequired,
	url: PropTypes.string.isRequired
};

Lesson.defaultProps = {
	lockUntil: null
};


// EXPORTS //

export default withTranslation( [ 'lesson', 'common' ] )( Lesson );
