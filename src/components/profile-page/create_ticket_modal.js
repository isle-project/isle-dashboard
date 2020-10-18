// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import platform from 'platform';
import logger from 'debug';
import SelectInput from 'react-select';
import Modal from 'react-bootstrap/Modal';
import FormControl from 'react-bootstrap/FormControl';
import FormLabel from 'react-bootstrap/FormLabel';
import FormGroup from 'react-bootstrap/FormGroup';
import Button from 'react-bootstrap/Button';


// VARIABLES //

const debug = logger( 'isle:toolbar:ticketing' );


// FUNCTIONS //

const createOption = ( ns ) => {
	return { value: ns, label: ns.title };
};


// MAIN //

class CreateTicketModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			title: '',
			description: '',
			selectedCourse: props.enrolledNamespaces ? createOption( props.enrolledNamespaces[ 0 ] ) : null
		};
	}

	handleTitleChange = ( event ) => {
		this.setState({
			title: event.target.value
		});
	}

	handleDescriptionChange = ( event ) => {
		this.setState({
			description: event.target.value
		});
	}

	handleCourseChange = ( newValue ) => {
		this.setState({
			selectedCourse: newValue
		});
	}

	handleSubmit = async () => {
		debug( 'Create ticket...' );
		await this.props.createTicket({
			title: this.state.title,
			description: this.state.description,
			platform: {
				name: platform.name,
				version: platform.version,
				product: platform.product,
				manufacturer: platform.manufacturer,
				os: platform.os,
				description: platform.description
			},
			namespace: this.state.selectedCourse.value
		});
		this.props.onHide();
	}

	render() {
		const { t } = this.props;
		return (
			<Modal onHide={this.props.onHide} show={this.props.show} dialogClassName="modal-40w" >
				<Modal.Header closeButton >
					<Modal.Title as="h3" >{t('new-ticket')}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>{t('ticketing-intro')}</p>
					<FormGroup>
						<FormLabel>{t('common:course')}:</FormLabel>
						<SelectInput
							options={this.props.enrolledNamespaces.map( createOption )}
							onChange={this.handleCourseChange}
							value={this.state.selectedCourse}
						/>
					</FormGroup>
					<FormGroup>
						<FormLabel>{t('common:title')}:</FormLabel>
						<FormControl
							type="text"
							placeholder="Select title..."
							onChange={this.handleTitleChange}
						/>
					</FormGroup>
					<FormGroup controlId="form-text" >
						<FormLabel>{t('common:description')}:</FormLabel>
						<FormControl
							name="body"
							type="text"
							as="textarea" rows="5"
							placeholder="Enter description of your problem..."
							value={this.state.description}
							onChange={this.handleDescriptionChange}
						>
						</FormControl>
					</FormGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.onHide} >
						{t('common:cancel')}
					</Button>
					<Button onClick={this.handleSubmit} >
						{t('create-ticket')}
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}


// PROPERTIES //

CreateTicketModal.propTypes = {
	createTicket: PropTypes.func.isRequired,
	enrolledNamespaces: PropTypes.array,
	onHide: PropTypes.func.isRequired
};

CreateTicketModal.defaultProps = {
	enrolledNamespaces: []
};


// EXPORTS //

export default CreateTicketModal;
