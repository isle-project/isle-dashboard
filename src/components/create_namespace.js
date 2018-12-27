// MODULES //

import React, { Component } from 'react';
import { Button, Card, FormLabel, FormControl, FormGroup, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';


// MAIN //

class CreateNamespace extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			disabled: true,
			title: '',
			description: '',
			owners: this.props.user.email
		};

		this.handleInputChange = ( event ) => {
			const target = event.target;
			const value = target.value;
			const name = target.name;

			this.setState({
				[ name ]: value
			}, () => {
				let { title, description } = this.state;
				if ( title.length >= 6 && description.length > 3 ) {
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

		this.handleSubmit = () => {
			const { state, props } = this;
			this.props.createNamespace({ state, props });
		};
	}

	render() {
		return (
			<Card style={{
				position: 'relative',
				top: '80px',
				width: '50%',
				margin: '0 auto'
			}}>
				<Card.Heading>
					<Card.Title>Create Course</Card.Title>
				</Card.Heading>
				<Form style={{ padding: '20px' }}>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Enter a comma-separated list of email addresses denoting the administrators for this course</Tooltip>}>
						<FormGroup>
							<FormLabel>Owners</FormLabel>
							<FormControl
								name="owners"
								componentClass="textarea"
								value={this.state.owners}
								onChange={this.handleInputChange}
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
