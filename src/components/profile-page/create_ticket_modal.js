// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import platform from 'platform';
import logger from 'debug';
import SelectInput from 'react-select';
import Modal from 'react-bootstrap/Modal';
import FormControl from 'react-bootstrap/FormControl';
import FormLabel from 'react-bootstrap/FormLabel';
import FormGroup from 'react-bootstrap/FormGroup';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ListGroup from 'react-bootstrap/ListGroup';
import Tooltip from 'react-bootstrap/Tooltip';


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
			selectedCourse: props.enrolledNamespaces ? createOption( props.enrolledNamespaces[ 0 ] ) : null,
			files: []
		};
	}

	attachFile = () => {
		const input = document.createElement( 'input' );
		input.type = 'file';
		input.onchange = ( e ) => {
			const files = e.target.files;
			const newFiles = [ ...this.state.files, ...files ];
			this.setState({
				files: newFiles
			});
		};
		input.click();
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
			namespace: this.state.selectedCourse.value,
			files: this.state.files
		});
		this.props.onHide();
	}

	removeFileFactory = ( idx ) => {
		return () => {
			const newFiles = this.state.files.slice();
			newFiles.splice( idx, 1 );
			this.setState({
				files: newFiles
			});
		};
	}

	renderAttachments() {
		if ( this.state.files.length === 0 ) {
			return null;
		}
		return (
			<Fragment>
				<span className="title">{this.props.t('attachments')}:</span>
				<ListGroup className="ticketing-attachment-list" >
					{this.state.files.map( ( file, idx ) => {
						return (
							<ListGroup.Item key={`file-${idx}`}>
								{file.name}
								<Button
									variant="danger"
									size="sm"
									onClick={this.removeFileFactory( idx )}
									style={{ float: 'right' }}
								>
									x
								</Button>
							</ListGroup.Item>
						);
					})}
				</ListGroup>
			</Fragment>
		);
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
							placeholder={t('ticket-title-placeholder')}
							onChange={this.handleTitleChange}
						/>
					</FormGroup>
					<FormGroup controlId="form-text" >
						<FormLabel>{t('common:description')}:</FormLabel>
						<FormControl
							name="body"
							type="text"
							as="textarea" rows="5"
							placeholder={t('ticket-description-placeholder')}
							value={this.state.description}
							onChange={this.handleDescriptionChange}
						>
						</FormControl>
					</FormGroup>
					{this.renderAttachments()}
				</Modal.Body>
				<Modal.Footer>
					<OverlayTrigger placement="left" overlay={<Tooltip id="attachmentTooltip">{t('attach-file')}</Tooltip>}>
						<Button onClick={this.attachFile} >
							<i className="fas fa-paperclip"></i>
						</Button>
					</OverlayTrigger>
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
	onHide: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired
};

CreateTicketModal.defaultProps = {
	enrolledNamespaces: []
};


// EXPORTS //

export default CreateTicketModal;
