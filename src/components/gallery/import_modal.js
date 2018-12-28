// MODULES //

import React, { Component } from 'react';
import {
	Button, FormLabel, FormControl, FormGroup, Modal
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import isArray from '@stdlib/assert/is-array';


// MAIN //

class ImportModal extends Component {
	constructor( props ) {
		super( props );

		const ns = props.userNamespaces;
		this.state = {
			selected: ( isArray( ns ) && ns.length > 0 ) ?
				ns[ 0 ].title :
				null,
			targetName: null
		};

		this.handleChange = ( event ) => {
			const target = event.target;
			const value = target.value;
			const name = target.name;
			this.setState({
				[ name ]: value
			});
		};

		this.handleImport = () => {
			this.props.copyLesson({
				sourceName: this.props.title,
				source: this.props.namespace,
				target: this.state.selected,
				targetName: this.state.targetName,
				token: this.props.token
			});
			this.props.close();
		};
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
					Please select the course that the lesson should be copied into.
					<br />
					<FormGroup>
						<FormLabel>Select Course</FormLabel>
						<FormControl
							name="selected"
							as="select"
							placeholder="select"
							onChange={this.handleChange}
						>
							{this.props.userNamespaces.map( ( ns, idx ) => {
								return ( <option
									key={idx}
									value={ns.title}
								>{ns.title}</option> );
							})}
						</FormControl>
					</FormGroup>
					<FormGroup>
						<FormLabel>Lesson Name</FormLabel>
						<FormControl
							name="targetName"
							type="text"
							placeholder={this.props.title}
							onChange={this.handleChange}
						/>
					</FormGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.close}>Cancel</Button>
					<Button variant="primary" onClick={this.handleImport} >Import</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}


// PROPERTY TYPES //

ImportModal.propTypes = {
	close: PropTypes.func.isRequired,
	copyLesson: PropTypes.func.isRequired,
	namespace: PropTypes.string.isRequired,
	show: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	token: PropTypes.string.isRequired,
	userNamespaces: PropTypes.array.isRequired
};


// EXPORTS //

export default ImportModal;
