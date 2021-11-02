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
import { withTranslation } from 'react-i18next';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import PropTypes from 'prop-types';
import logger from 'debug';
import 'css/image.css';
import COLORS from 'constants/colors';
import copyToClipboard from 'clipboard-copy';
import background from './bubble.jpg';
import upload from './upload.svg';


// VARIABLES //

const debug = logger( 'isle:gallery:lesson' );


// MAIN //

class Lesson extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isleFile: null
		};
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
	};

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
	};

	copyIncludeToClipboard = () => {
		const promise = copyToClipboard( `<!-- #include "${this.props.url}" -->` );
		promise.then( () => {
			this.props.addNotification({
				message: this.props.t('include-copied'),
				level: 'success'
			});
		}).catch( err => {
			this.props.addNotification({
				message: err.message,
				level: 'error'
			});
		});
	};

	openLesson = () => {
		const win = window.open( this.props.url, '_blank' );
		win.focus();
	};

	renderButtonToolbarDate() {
		if ( !this.props.updatedAt ) {
			return null;
		}
		let date = null;
		let updated = null;
		if ( this.props.updatedAt ) {
			updated = new Date( this.props.updatedAt );
			updated = updated.toLocaleDateString();
			if ( this.props.createdAt ) {
				date = new Date( this.props.createdAt );
				date = date.toLocaleDateString();
			} else {
				date = updated;
			}
		}
		const { t } = this.props;
		return (
			<div className="gallery-upload">
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="toggle_visibility">{t('created-at')}</Tooltip>}>
					<span className="gallery-uploaded-image"><img style={{ stroke: 'white', fill: 'red' }} alt="Upload Time Icon" src={upload} /></span>
				</OverlayTrigger>
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="toggle_visibility">{t('last-updated')}{updated}</Tooltip>}>
					<span className="gallery-uploaded">{date}</span>
				</OverlayTrigger>
			</div>
		);
	}

	renderButtonToolbar() {
		const { t } = this.props;
		return ( <div className="gallery-toolbar">
			<ButtonToolbar size="sm" style={{ marginLeft: -4, marginTop: 3 }}>
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="ImportFile">{t('import-tooltip')}</Tooltip>}>
					<Button size="sm" style={{ marginLeft: 4, marginRight: 4 }} onClick={this.props.onImport}>
						{t('import')}
					</Button>
				</OverlayTrigger>
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="IsleFile">{t('copy-file')}</Tooltip>}>
					<Button aria-label={t('copy-file')} size="sm" onFocus={this.getIsleFile} onMouseEnter={this.getIsleFile} onClick={this.copyIsleFileToClipboard} >
						<i className="fa fa-clipboard"></i>
					</Button>
				</OverlayTrigger>
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="IsleFile">{t('copy-include')}</Tooltip>}>
					<Button aria-label={t('copy-include')} size="sm" onClick={this.copyIncludeToClipboard} style={{ marginLeft: 4 }} >
						<i className="fa fa-link"></i>
					</Button>
				</OverlayTrigger>
				{ this.renderButtonToolbarDate() }
			</ButtonToolbar>
		</div> );
	}

	render() {
		const { t } = this.props;
		return (
			<Card className="gallery-card">
				<Card.Body>
					<div style={{ height: 180 }} >
						<div style={{
							filter: 'grayscale(30%)',
							background: COLORS[ this.props.colorIndex ]
						}} className="hovereffect ">
							<img
								className="img-responsive"
								src={background}
								alt=""
								style={{
									width: '100%',
									height: 180,
									background: COLORS[ this.props.colorIndex ]
								}}
							/>
							<div
								role="button" className="overlay"
								onClick={this.openLesson}
								onKeyPress={this.openLesson}
								tabIndex={0}
							>
								<h2>{this.props.namespace}: {this.props.title}</h2>
								<h3>{this.props.description}</h3>
								<span
									className="info"
								>{t('open-lesson')}</span>
							</div>
						</div>
					</div>
					{this.renderButtonToolbar()}
				</Card.Body>
			</Card>
		);
	}
}


// PROPERTIES//

Lesson.propTypes = {
	addNotification: PropTypes.func.isRequired,
	colorIndex: PropTypes.number.isRequired,
	createdAt: PropTypes.any.isRequired,
	description: PropTypes.string.isRequired,
	getIsleFile: PropTypes.func.isRequired,
	namespace: PropTypes.string.isRequired,
	onImport: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	updatedAt: PropTypes.any.isRequired,
	url: PropTypes.string.isRequired
};


// EXPORTS //

export default withTranslation( [ 'lesson', 'common' ] )( Lesson );
