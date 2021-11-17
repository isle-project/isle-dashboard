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

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from 'react-bootstrap/Card';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ProgressBar from 'react-bootstrap/ProgressBar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import copyToClipboard from 'clipboard-copy';
import round from '@stdlib/math/base/special/round';
import min from '@stdlib/math/base/special/min';
import COLORS from 'constants/colors';
import formatTime from 'utils/format_time.js';
import background from './architecture.jpeg';
import './lessons.css';


// FUNCTIONS //

/**
 * Adds a default background image to the card.
 *
 * @private
 * @param {Event} event - event object
 * @returns {void}
 */
function addDefaultSrc( event ) {
	event.target.src = background;
}

/**
 * Renders user progress.
 *
 * @private
 * @param {Object} props - component properties
 * @param {Object} props.user - user object
 * @param {string} props._id - id of the lesson
 * @param {Object} props.metadata - metadata associated with the lesson
 * @param {Function} props.t - i18n translation function
 * @returns {ReactElement} component
 */
function LessonProgress( props ) {
	let progress;
	if ( props.metadata && props.metadata.hideProgressBar === true ) {
		return <div className="enrolled-lesson-progress"></div>;
	}
	const lessonData = props.user.lessonData;
	const data = lessonData[ props._id ];
	if ( data ) {
		progress = data.progress;
		progress *= 100;
		progress = min( round( progress ), 100.0 );
	} else {
		progress = 0;
	}
	const { t } = props;
	return ( <div className="enrolled-lesson-progress">
		<OverlayTrigger placement="top" overlay={<Tooltip id="open_details">{t('your-progress')}</Tooltip>}>
			<ProgressBar aria-label={t('your-progress')} variant='success' now={progress} label={`${progress}%`} />
		</OverlayTrigger>
	</div> );
}

/**
 * Renders user progress and information about the lesson.
 *
 * @private
 * @param {Object} props - component properties
 * @param {Object} props.user - user object
 * @param {string} props._id - id of the lesson
 * @param {Object} props.metadata - metadata associated with the lesson
 * @param {Function} props.t - i18n translation function
 * @returns {ReactElement} component
 */
function LessonInfo( props ) {
	let duration;
	const lessonData = props.user.lessonData;
	const data = lessonData[ props._id ];
	if ( data ) {
		duration = data.spentTime;
	} else {
		duration = 0;
	}
	const { t } = props;
	return (
		<ButtonToolbar style={{
			position: 'absolute',
			top: 180,
			width: '100%',
			height: '36px',
			background: 'rgba(0, 0, 0, 0.75)'
		}}>
			<LessonProgress {...props} t={t} />
			<div className="enrolled-lesson-time" style={{ width: '35%', height: '100%' }} >
				<OverlayTrigger placement="top" overlay={<Tooltip id="open_details">{t('time-format')}</Tooltip>}>
					<span>{t('time-spent')}: {formatTime( duration )}</span>
				</OverlayTrigger>
			</div>
		</ButtonToolbar>
	);
}


// VARIABLES //

const DEFAULT_DESCRIPTION = 'No description supplied.';


// MAIN //

/**
 * A component which displays a lesson that the user has enrolled in.
 *
 * @param {Object} props - component properties
 * @param {string} props.title - title of the lesson
 * @param {string} props.description - description of the lesson
 * @param {string} props._id - id of the lesson
 * @param {string} props.url - URL of the lesson
 * @param {Object} props.metadata - metadata associated with the lesson
 * @param {number} props.colorIndex - color index associated with the lesson
 * @param {Object} props.user - user object
 * @param {Function} props.addNotification - function to add a notification
 * @returns {ReactElement} lesson component
 */
const EnrolledLesson = ( props ) => {
	const { t } = useTranslation( [ 'lesson', 'common' ] );
	const imgRef = useRef();
	const openLesson = () => {
		const win = window.open( props.url, '_blank' );
		win.focus();
	};
	const showPreviewImage = () => {
		imgRef.current.src = props.url+'/preview.jpg';
	};
	const copyLinkToClipboard = () => {
		const promise = copyToClipboard( props.url );
		promise.then( () => {
			props.addNotification({
				message: t('link-copied'),
				level: 'success'
			});
		}).catch( err => {
			props.addNotification({
				message: err.message,
				level: 'error'
			});
		});
	};
	return (
		<Card className="animated-lesson-card">
			<Card.Body style={{ padding: 0 }}>
				<div style={{
					filter: 'grayscale(30%)',
					background: COLORS[ props.colorIndex ]
				}} onMouseOver={showPreviewImage} onFocus={showPreviewImage}
					className="hovereffect"
				>
					<img
						className="img-responsive"
						src={background}
						ref={imgRef}
						alt=""
						style={{
							width: '100%',
							height: 180
						}}
						onError={addDefaultSrc}
					/>
					<div className="overlay" >
						<h2>{props.title}</h2>
						{props.description !== DEFAULT_DESCRIPTION ?
							<h3>{props.description}</h3> :
							null
						}
						<span
							className="info"
							role="button" tabIndex={0}
							onClick={openLesson} onKeyPress={openLesson}
						>
							{t('open-lesson')}
						</span>
					</div>
				</div>
				<OverlayTrigger placement="top" overlay={<Tooltip id="copy_link">{t('common:copy-link')}</Tooltip>}>
					<i
						role="button" tabIndex={0}
						className="lesson-link-icon fas fa-external-link-alt"
						onClick={copyLinkToClipboard}
						onKeyPress={copyLinkToClipboard}
						aria-label={t('common:copy-link')}
					></i>
				</OverlayTrigger>
				<LessonInfo {...props} t={t} />
			</Card.Body>
		</Card>
	);
};


// PROPERTIES //

EnrolledLesson.propTypes = {
	'_id': PropTypes.string.isRequired,
	addNotification: PropTypes.func.isRequired,
	colorIndex: PropTypes.number.isRequired,
	description: PropTypes.string.isRequired,
	metadata: PropTypes.object,
	title: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	user: PropTypes.object.isRequired
};

EnrolledLesson.defaultProps = {
	metadata: null
};


// EXPORTS //

export default EnrolledLesson;
