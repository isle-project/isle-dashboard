// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Button, FormLabel, FormControl, FormGroup, Modal
} from 'react-bootstrap';
import SelectInput from 'react-select';
import isArray from '@stdlib/assert/is-array';


// MAIN //

class ImportModal extends Component {
	constructor( props ) {
		super( props );

		const ns = props.userNamespaces;
		let selected;
		if ( props.openedNamespace.title ) {
			selected = props.openedNamespace.title;
		} else {
			selected = ( isArray( ns ) && ns.length > 0 ) ?
				ns[ 0 ].title :
				null;
		}
		if ( selected ) {
			selected = { label: selected, value: selected };
		}
		this.state = {
			selected: selected,
			targetName: props.title
		};
	}

	handleChange = ( event ) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[ name ]: value
		});
	}

	handleImport = () => {
		this.props.copyLesson({
			sourceName: this.props.title,
			source: this.props.namespace,
			target: this.state.selected.value,
			targetName: this.state.targetName,
			token: this.props.token
		});
		this.props.close();
	}

	handleCourseChange = ( newValue ) => {
		this.setState({
			selected: newValue
		});
	}

	render() {
		return (
			<Modal show={this.props.show} onHide={this.props.close}>
				<Modal.Header>
					<Modal.Title>
						Import lesson <span style={{ color: 'darkred' }}>{this.props.namespace}: {this.props.title}</span>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Please select the course that the lesson should be copied into.</p>
					<FormGroup>
						<FormLabel>Select Course</FormLabel>
						<SelectInput
							options={this.props.userNamespaces.map( ns => {
								return { value: ns.title, label: ns.title };
							})}
							onChange={this.handleCourseChange}
							value={this.state.selected}
						/>
					</FormGroup>
					<FormGroup>
						<FormLabel>Lesson Name</FormLabel>
						<FormControl
							name="targetName"
							type="text"
							value={this.state.targetName}
							onChange={this.handleChange}
						/>
					</FormGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.close}>Cancel</Button>
					<Button variant="success" onClick={this.handleImport} >Import</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}


// PROPERTIES //

ImportModal.propTypes = {
	close: PropTypes.func.isRequired,
	copyLesson: PropTypes.func.isRequired,
	namespace: PropTypes.string.isRequired,
	openedNamespace: PropTypes.object.isRequired,
	show: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	token: PropTypes.string.isRequired,
	userNamespaces: PropTypes.array.isRequired
};


// EXPORTS //

export default ImportModal;
