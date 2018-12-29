// MODULES //

import React, { Component } from 'react';
import {
	ButtonToolbar, Button, Card, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import ImportModal from './import_modal.js';
import './../image.css';
import COLORS from './../../constants/colors';
import copyToClipboard from 'clipboard-copy';
import background from './bubble.jpg';
import upload from './upload.svg';


// MAIN //

class Lesson extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showImportModal: false
		};
	}

	showImportModal = () => {
		this.setState({ showImportModal: true });
	}

	closeImportModal = () => {
		this.setState({ showImportModal: false });
	}

	getIsleFile = () => {
		this.props.getIsleFile({
			lessonName: this.props.title,
			namespaceName: this.props.namespace,
			token: this.props.token,
			callback( err, body ) {
				copyToClipboard( body);
			}
		});
	}

	renderImportModal() {
		return ( <ImportModal
			{...this.props}
			show={this.state.showImportModal}
			close={this.closeImportModal}
			userNamespaces={this.props.userNamespaces}
			token={this.props.token}
			copyLesson={this.props.copyLesson}
		/> );
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
			<div className="gallery-upload">
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="toggle_visibility">created at</Tooltip>}>
				<span className="gallery-uploaded-image"><img style={{ stroke: 'white', fill: 'red'}} src={upload} /></span>
			</OverlayTrigger>
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="toggle_visibility">updated at {updated}</Tooltip>}>
			<span className="gallery-uploaded">{date}</span>
			</OverlayTrigger>
		</div>
		);
	}


	renderButtonToolbar() {
		return ( <div className="gallery-toolbar">
			<ButtonToolbar size="sm" style={{ marginLeft: 16, marginTop: 3 }}>
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="ImportFile">Import lesson to own course</Tooltip>}>
					<Button size="sm" style={{ marginLeft: 4, marginRight: 4 }} onClick={this.showImportModal}>
						Import
					</Button>
				</OverlayTrigger>
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="IsleFile">Copy ISLE file to clipboard</Tooltip>}>
					<Button size="sm" onClick={this.getIsleFile}>
						<i className="fa fa-clipboard"></i>
					</Button>
				</OverlayTrigger>
				{ this.renderButtonToolbarDate() }
			</ButtonToolbar>
		</div> );
	}

	render() {
		return (
			<Card className="gallery-card">
				<Card.Body>
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
								height: 180,
								background: COLORS[ this.props.colorIndex ]
							}}
						/>
						<div className="overlay">
							<h2>{this.props.namespace}: {this.props.title}</h2>
							<h3>{this.props.description}</h3>
							<span
								className="info"
								onClick={() => {
									const win = window.open( this.props.url, '_blank' );
									win.focus();
								}}
							>Open Lesson</span>
						</div>
					</div>
					{this.renderButtonToolbar()}
				</Card.Body>
				{this.renderImportModal()}
			</Card>
		);
	}
}


// PROPERTY TYPES //

Lesson.propTypes = {
	colorIndex: PropTypes.number.isRequired,
	copyLesson: PropTypes.func.isRequired,
	description: PropTypes.string.isRequired,
	getIsleFile: PropTypes.func.isRequired,
	namespace: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	token: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	userNamespaces: PropTypes.array.isRequired
};


// EXPORTS //

export default Lesson;
