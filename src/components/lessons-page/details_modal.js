// MODULES //

import React, { Component } from 'react';
import {
	Button, Col, FormLabel, Form, FormControl, FormGroup, Modal
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import logger from 'debug';
import SERVER from './../../constants/server';


// VARIABLES //

const debug = logger( 'isle-dashboard' );


// MAIN //

class DetailsModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			title: props.title,
			description: props.description,
			disabled: false
		};
	}

	componentDidUpdate( prevProps ) {
		if (
			prevProps.title !== this.props.title ||
			prevProps.description !== this.props.description
		) {
			this.setState({
				title: this.props.title,
				description: this.props.description
			});
		}
	}

	handleInputChange = ( event ) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		debug( `Input field ${name} changed to ${value}` );
		this.setState({
			[ name ]: value
		}, () => {
			if ( this.state.title.length >= 3 && this.state.description.length > 0 ) {
				this.setState({
					disabled: false
				});
			} else {
				this.setState({
					disabled: true
				});
			}
		});
	};

	onSubmit = ( evt ) => {
		evt.preventDefault();
		this.props.update({
			newTitle: this.state.title,
			newDescription: this.state.description
		});
	}

	render() {
		return (
			<Modal show={this.props.show} onHide={this.props.close}>
				<Form action={SERVER} method="get" onSubmit={this.onSubmit}>
					<Modal.Header>
						<Modal.Title as="h3">Lesson Details</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<FormGroup>
							<Col sm={2}>
								<FormLabel>Title</FormLabel>
							</Col>
							<Col sm={10}>
								<FormControl
									name="title"
									type="title"
									onChange={this.handleInputChange}
									defaultValue={this.state.title}
								/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={2}>
								<FormLabel>Description</FormLabel>
							</Col>
							<Col sm={10}>
								<FormControl
									name="description"
									type="description"
									onChange={this.handleInputChange}
									defaultValue={this.state.description}
								/>
							</Col>
						</FormGroup>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.props.close}>Cancel</Button>
						<Button
							variant="success"
							type="submit"
							disabled={this.state.disabled}
						>Save</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		);
	}
}


// PROPERTY TYPES //

DetailsModal.propTypes = {
	close: PropTypes.func.isRequired,
	description: PropTypes.string.isRequired,
	show: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	update: PropTypes.func.isRequired
};


// EXPORTS //

export default DetailsModal;
