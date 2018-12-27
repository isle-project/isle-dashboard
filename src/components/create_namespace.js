// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, FormLabel, FormControl, FormGroup, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import isEmail from '@stdlib/assert/is-email-address';
import TextSelect from './text_select.js';


// FUNCTIONS //

function validateInputs({ emails, title, description }) {
	let invalid = false;
	if ( emails.length === 0 ) {
		invalid = true;
	} else {
		emails.forEach( owner => {
			if ( !isEmail( owner ) ) {
				invalid = true;
			}
		});
	}
	if ( invalid ) {
		return false;
	}
	return title.length >= 6 && description.length > 3;
}


// MAIN //

class CreateNamespace extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			disabled: true,
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
		}, () => {
			this.setState({
				disabled: !validateInputs({
					emails: this.state.owners,
					description: this.state.description,
					title: this.state.title
				})
			});
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
			owners: owners,
			disabled: !validateInputs({
				emails: owners,
				description: this.state.description,
				title: this.state.title
			})
		});
	}

	render() {
		return (
			<Card style={{
				position: 'relative',
				top: '80px',
				width: '50%',
				margin: '0 auto'
			}}>
				<Card.Header>
					<Card.Title as="h3" >Create Course</Card.Title>
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
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Please enter a title with a minimum length of six characters.</Tooltip>}>
						<FormGroup>
							<FormLabel>Title</FormLabel>
							<FormControl
								name="title"
								type="text"
								placeholder="Enter title"
								onChange={this.handleInputChange}
							/>
						</FormGroup>
					</OverlayTrigger>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Please enter a course description with a minimum length of three characters.</Tooltip>}>
						<FormGroup>
							<FormLabel>Description</FormLabel>
							<FormControl
								name="description"
								type="text"
								placeholder="Enter description"
								onChange={this.handleInputChange}
							>
							</FormControl>
						</FormGroup>
					</OverlayTrigger>
				</Form>
				<Button
					onClick={this.handleSubmit}
					disabled={this.state.disabled}
					block
				>Create</Button>
			</Card>
		);
	}
}


CreateNamespace.propTypes = {
	createNamespace: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

CreateNamespace.defaultProps = {
};


// EXPORTS //

export default CreateNamespace;
