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
import {
	Card, ButtonToolbar, ProgressBar, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import copyToClipboard from 'clipboard-copy';
import round from '@stdlib/math/base/special/round';
import min from '@stdlib/math/base/special/min';
import COLORS from 'constants/colors';
import formatTime from 'utils/format_time.js';
import background from './architecture.jpeg';
import './lessons.css';


// FUNCTIONS //

function addDefaultSrc( event ) {
	event.target.src = background;
}


// VARIABLES //

const DEFAULT_DESCRIPTION = 'No description supplied.';


// MAIN //

class EnrolledLesson extends Component {
	constructor( props ) {
		super( props );
		this.state = {};
	}

	showPreviewImage = () => {
		this.img.src = this.props.url+'/preview.jpg';
	}

	openLesson = () => {
		const win = window.open( this.props.url, '_blank' );
		win.focus();
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

	renderButtonToolbar() {
		let progress;
		let duration;
		const lessonData = this.props.user.lessonData;
		const data = lessonData[ this.props._id ];
		if ( data ) {
			progress = data.progress;
			progress *= 100;
			progress = min( round( progress ), 100.0 );
			duration = data.spentTime;
		} else {
			progress = 0;
			duration = 0;
		}
		return (
			<ButtonToolbar style={{
				position: 'absolute',
				top: 180,
				width: '100%',
				height: '36px',
				background: 'rgba(0, 0, 0, 0.75)'
			}}>
				<div className="enrolled-lesson-progress">
					<OverlayTrigger placement="top" overlay={<Tooltip id="open_details">Your Progress</Tooltip>}>
						<ProgressBar variant='success' now={progress} label={`${progress}%`} />
					</OverlayTrigger>
				</div>
				<div className="enrolled-lesson-time" style={{ width: '35%', height: '100%' }} >
					<OverlayTrigger placement="top" overlay={<Tooltip id="open_details">In hours:minutes</Tooltip>}>
						<span>Time Spent: {formatTime( duration )}</span>
					</OverlayTrigger>
				</div>
			</ButtonToolbar>
		);
	}

	render() {
		return (
			<Card className="animated-lesson-card">
				<Card.Body style={{ padding: 0 }}>
					<div style={{
						filter: 'grayscale(30%)',
						background: COLORS[ this.props.colorIndex ]
					}} onMouseOver={this.showPreviewImage} onFocus={this.showPreviewImage}
						className="hovereffect"
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
							role="button"
							className="overlay" tabIndex={0}
							onClick={this.openLesson}
							onKeyPress={this.openLesson}
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
				</Card.Body>
			</Card>
		);
	}
}


// PROPERTIES //

EnrolledLesson.propTypes = {
	'_id': PropTypes.string.isRequired,
	colorIndex: PropTypes.number.isRequired,
	description: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default EnrolledLesson;
