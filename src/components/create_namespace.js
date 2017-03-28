// MODULES //

import React, { Component } from 'react';
import { Button, ControlLabel, FormControl, FormGroup, Form, Modal, OverlayTrigger,Panel, Tooltip } from 'react-bootstrap';
import request from 'request';
import MsgModal from './message_modal.js';


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
				let { title } = this.state;
				if ( title.length >= 6 ) {
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
			request.post( 'http://localhost:3000/create_namespace', {
				form: this.state,
				headers: {
					'Authorization': 'JWT ' + this.props.user.token
				}
			}, ( err, res ) => {
				console.log( err );
				if ( !err ) {
					const body = JSON.parse( res.body );
					let namespace = {
						title: this.state.title,
						description: this.state.description,
						owners: this.state.owners
					};
					console.log( namespace );
					this.props.onNamespace( namespace );
					this.setState({
						message: body.message,
						successful: body.successful,
						showModal: true
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
			}} header={<h2>Create Namespace</h2>}>
				<Form style={{ padding: '20px' }}>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Enter a comma-separated list of email addresses denoting the administrators for this namespace</Tooltip>}>
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
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Please enter a title with a minimum length of six characters.</Tooltip>}>
						<FormGroup>
							<ControlLabel>Title</ControlLabel>
							<FormControl
								name="title"
								type="text"
								placeholder="Enter title"
								onChange={this.handleInputChange}
							/>
						</FormGroup>
					</OverlayTrigger>
					<FormGroup>
						<ControlLabel>Description</ControlLabel>
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

export default CreateNamespace;
