// MODULES //

import React, { Component } from 'react';
import {
	ButtonToolbar, ButtonGroup, Button, Panel
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import ImportModal from './import_modal.js';


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

	render() {
		return (
			<div>
				<Panel>
					<div className="hovereffect">
						<img
							className="img-responsive"
							src={this.props.url+'/preview.jpg'}
							alt=""
							style={{
								width: 350,
								height: 200
							}}
						/>
						<div className="overlay">
							<h2>{this.props.namespace}: {this.props.title}</h2>
							<a className="info" href={this.props.url} target="_blank" >Open Lesson</a>
						</div>
					</div>
					<ButtonToolbar>
						<ButtonGroup>
							<Button onClick={this.showImportModal}>Import</Button>
						</ButtonGroup>
					</ButtonToolbar>
				</Panel>
				<ImportModal
					{...this.props}
					show={this.state.showImportModal}
					close={this.closeImportModal}
					userNamespaces={this.props.userNamespaces}
					token={this.props.token}
					copyLesson={this.props.copyLesson}
				/>
			</div>
		);
	}
}

// PROPERTY TYPES //

Lesson.propTypes = {
	title: PropTypes.string.isRequired,
	util: PropTypes.string.isRequired
};


// EXPORTS //

export default Lesson;
