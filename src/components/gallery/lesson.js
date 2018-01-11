// MODULES //

import React, { Component } from 'react';
import {
	ButtonToolbar, ButtonGroup, Button, Panel
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import ImportModal from './import_modal.js';
import './../image.css';
import COLORS from './../../constants/colors';


// MAIN //

class Lesson extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showImportModal: false
		};

		this.showImportModal = () => {
			this.setState({ showImportModal: true });
		};

		this.closeImportModal = () => {
			this.setState({ showImportModal: false });
		};
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

	render() {
		return (
			<Panel>
				<Panel.Body>
					<div className="hovereffect">
						<img
							className="img-responsive"
							src={this.props.url+'/preview.jpg'}
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
					<ButtonToolbar>
						<ButtonGroup style={{ marginTop: '8px' }}>
							<Button onClick={this.showImportModal}>Import</Button>
						</ButtonGroup>
					</ButtonToolbar>
				</Panel.Body>
				{this.renderImportModal()}
			</Panel>
		);
	}
}


// PROPERTY TYPES //

Lesson.propTypes = {
	colorIndex: PropTypes.number.isRequired,
	copyLesson: PropTypes.func.isRequired,
	description: PropTypes.string.isRequired,
	namespace: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	token: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	userNamespaces: PropTypes.array.isRequired
};


// EXPORTS //

export default Lesson;
