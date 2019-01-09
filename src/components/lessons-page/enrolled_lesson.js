// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Card, ButtonToolbar, ProgressBar, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import round from '@stdlib/math/base/special/round';
import COLORS from 'constants/colors';
import formatTime from 'utils/format_time.js';
import background from './architecture.jpeg';
import './lessons.css';


// MAIN //

class EnrolledLesson extends Component {
	constructor( props ) {
		super( props );

		this.state = {};
	}

	renderButtonToolbar() {
		let progress;
		let duration;
		const lessonData = this.props.user.lessonData;
		const data = lessonData[ this.props._id ];
		if ( data ) {
			progress = data.progress;
			progress *= 100;
			progress = round( progress );
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
					<OverlayTrigger placement="bottom" overlay={<Tooltip id="open_details">Your Progress</Tooltip>}>
						<ProgressBar variant='success' now={progress} label={`${progress}%`} />
					</OverlayTrigger>
				</div>
				<div className="enrolled-lesson-time" style={{ width: '35%', height: '100%' }} >
					Time Spent: {formatTime( duration )}
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
