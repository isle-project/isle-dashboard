// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, FormLabel, FormControl, FormGroup, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import logger from 'debug';
import isEmail from '@stdlib/assert/is-email-address';
import trim from '@stdlib/string/trim';
import contains from '@stdlib/assert/contains';
import TextSelect from 'components/text-select';
import SERVER from 'constants/server';
import checkURLPath from '../../utils/check_url_path';


// VARIABLES //

const debug = logger( 'isle-dashboard:create-namespace' );


// FUNCTIONS //

export function validateOwners( owners ) {
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

export function validateTitle( title ) {
	return title.length >= 3 && !contains( title, ' ' ) && !checkURLPath( title );
}

export function validateDescription( description ) {
	return description.length >= 3;
}


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
		if ( !newValue ) {
			return this.setState({
				owners: []
			});
		}
		const owners = newValue.map( x => trim( x.value ) );
		this.setState({
			owners: owners
		});
	}

	render() {
		const validTitle = validateTitle( this.state.title );
		const invalidTitleChars = checkURLPath( this.state.title );
		const validDescription = validateDescription( this.state.description );
		const validOwners = validateOwners( this.state.owners );
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
								isInvalid={!validOwners}
							/>
							<FormControl.Feedback type="invalid">
								Must provide at least one owner via email address
							</FormControl.Feedback>
						</FormGroup>
					</OverlayTrigger>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip" >Lessons will be accessible at <code>{SERVER+'/<course>/<lesson>'}</code></Tooltip>}>
						<FormGroup>
							<FormLabel>Course</FormLabel>
							<FormControl
								name="title"
								type="text"
								placeholder="Enter course identifier"
								onChange={this.handleInputChange}
								isInvalid={this.state.title && !validTitle}
							/>
							<FormControl.Feedback type="invalid">
								{ invalidTitleChars ?
									'Course identifier contains invalid character(s): '+invalidTitleChars[ 0 ] :
									'Course identifier must be at least three characters long and should not contain any spaces.'
								}
							</FormControl.Feedback>
						</FormGroup>
					</OverlayTrigger>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Please enter a full course title and/or course description.</Tooltip>}>
						<FormGroup>
							<FormLabel>Title / Description</FormLabel>
							<FormControl
								name="description"
								type="text"
								placeholder="Enter full course title and/or description"
								onChange={this.handleInputChange}
								isInvalid={this.state.description && !validDescription}
							/>
							<FormControl.Feedback type="invalid">
								Description must be at least three characters long.
							</FormControl.Feedback>
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
