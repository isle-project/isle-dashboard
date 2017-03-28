// MODULES //

import React, { Component } from 'react';
import { Button, ButtonToolbar, ControlLabel, FormControl, FormGroup, Form, Modal, OverlayTrigger,Panel, Tooltip } from 'react-bootstrap';
import request from 'request';
import MsgModal from './message_modal.js';


// MAIN //

class EditNamespace extends Component {

	constructor( props ) {
		super( props );
		let { title, description, owners } = this.props.namespace;
		this.state = {
			disabled: true,
			title,
			description,
			owners
		};

		this.handleInputChange = ( event ) => {
			const target = event.target;
			const value = target.value;
			const name = target.name;

			this.setState({
				[ name ]: value
			}, () => {
				let { title } = this.state;
				if ( title.length > 6 ) {
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

		this.close = () => {
			this.setState({
				showModal: false
			});
		};
	}

	render() {
		return (
			<Panel style={{
				position: 'relative',
				top: '80px',
				width: '50%',
				margin: '0 auto'
			}} header={<h2>Edit Current Namespace</h2>}>
				<Form style={{ padding: '20px' }}>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Comma-separated list of email addresses denoting the administrators for this namespace</Tooltip>}>
						<FormGroup>
							<ControlLabel>Owners</ControlLabel>
							<FormControl
								name="owners"
								componentClass="textarea"
								value={this.state.owners}
								onChange={this.handleInputChange}
							/>
						</FormGroup>
					</OverlayTrigger>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Title with a minimum length of six characters.</Tooltip>}>
						<FormGroup>
							<ControlLabel>Title</ControlLabel>
							<FormControl
								name="title"
								type="text"
								value={this.state.title}
								onChange={this.handleInputChange}
							/>
						</FormGroup>
					</OverlayTrigger>
					<FormGroup>
						<ControlLabel>Description</ControlLabel>
						<FormControl
							name="description"
							type="text"
							value={this.state.description}
							onChange={this.handleInputChange}
						>
						</FormControl>
					</FormGroup>
				</Form>
				<ButtonToolbar>
					<Button type="submit" onClick={this.handleSubmit}>Update</Button>
					<Button onClick={this.handleSubmit} bsStyle="danger">Delete</Button>
				</ButtonToolbar>
				<MsgModal
					show={this.state.showModal}
					close={this.close}
					message={this.state.message}
					successful={this.state.successful}
					title="Create Namespace"
				/>
			</Panel>
		);
	}
}


// EXPORTS //

export default EditNamespace;
