// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, FormLabel, FormControl, FormGroup, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import logger from 'debug';
import isEmail from '@stdlib/assert/is-email-address';
import TextSelect from 'components/text-select';


// VARIABLES //

const debug = logger( 'isle-dashboard:create-namespace' );


// MAIN //

class CreateNamespace extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			title: '',
			description: '',
			owners: [ this.props.user.email ]
		};
	}

	handleInputChange = ( event ) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[ name ]: value
		});
	}

	handleSubmit = () => {
		this.props.createNamespace({
			title: this.state.title,
			description: this.state.description,
			owners: this.state.owners,
			props: this.props
		});
	}

	handleOwnerChange = ( newValue ) => {
		const owners = newValue.map( x => x.value );
		this.setState({
			owners: owners
		});
	}

	validateOwners() {
		const owners = this.state.owners;
		let invalid = false;
		if ( owners.length === 0 ) {
			invalid = true;
		} else {
			owners.forEach( owner => {
				if ( !isEmail( owner ) ) {
					invalid = true;
				}
			});
		}
		if ( invalid ) {
			return false;
		}
		return true;
	}

	validateTitle() {
		return this.state.title.length >= 3;
	}

	validateDescription() {
		return this.state.description.length > 3;
	}

	render() {
		const validTitle = this.validateTitle();
		const validDescription = this.validateDescription();
		const validOwners = this.validateOwners();
		debug( 'Validation status of input fields: ' );
		debug( `Title: ${validTitle}` );
		debug( `Description: ${validDescription}` );
		debug( `Owners: ${validOwners}` );
		return (
			<Card style={{
				position: 'relative',
				top: '80px',
				width: '50%',
				margin: '0 auto'
			}}>
				<Card.Header>
					<Card.Title as="h2" >Create Course</Card.Title>
				</Card.Header>
				<Form style={{ padding: '20px' }}>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Enter list of email addresses denoting the administrators for this course</Tooltip>}>
						<FormGroup>
							<FormLabel>Owners</FormLabel>
							<TextSelect
								onChange={this.handleOwnerChange}
								defaultValue={this.state.owners}
							/>
						</FormGroup>
					</OverlayTrigger>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Please enter a course title</Tooltip>}>
						<FormGroup>
							<FormLabel>Title</FormLabel>
							<FormControl
								name="title"
								type="text"
								placeholder="Enter title"
								onChange={this.handleInputChange}
								isInvalid={this.state.title && !validTitle}
							/>
							<Form.Control.Feedback type="invalid">
								Title must be at least three characters long.
							</Form.Control.Feedback>
						</FormGroup>
					</OverlayTrigger>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Please enter a course description.</Tooltip>}>
						<FormGroup>
							<FormLabel>Description</FormLabel>
							<FormControl
								name="description"
								type="text"
								placeholder="Enter description"
								onChange={this.handleInputChange}
								isInvalid={this.state.description && !validDescription}
							/>
							<Form.Control.Feedback type="invalid">
								Description must be at least three characters long.
							</Form.Control.Feedback>
						</FormGroup>
					</OverlayTrigger>
				</Form>
				<Button
					variant="success"
					onClick={this.handleSubmit}
					disabled={!validOwners || !validTitle || !validDescription}
					block
				>Create</Button>
			</Card>
		);
	}
}


// PROPERTIES //

CreateNamespace.propTypes = {
	createNamespace: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

CreateNamespace.defaultProps = {
};


// EXPORTS //

export default CreateNamespace;
