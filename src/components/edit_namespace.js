// MODULES //

import React, { Component } from 'react';
import { Button, ButtonToolbar, ControlLabel, FormControl, FormGroup, Form, OverlayTrigger,Panel, Tooltip } from 'react-bootstrap';
import isArray from '@stdlib/utils/is-array';
import isEmail from '@stdlib/utils/is-email-address';
import MsgModal from './message_modal.js';
import ConfirmModal from './confirm_modal.js';
import checkURLPath from './../utils/check_url_path.js';


// MAIN //

class EditNamespace extends Component {

	constructor( props ) {
		super( props );
		let { title, description, owners } = this.props.namespace;
		if ( isArray( owners ) ) {
			owners = owners.join( ',' );
		};
		this.state = {
			disabled: true,
			title,
			description,
			owners,
			showDeleteModal: false
		};

		this.handleInputChange = ( event ) => {
			const target = event.target;
			const name = target.name;
			let value = target.value;

			if ( name === 'owners' ) {
				value = value.replace( /\s/g, '' );
			}

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

		this.validateInputs = () => {
			if ( this.state.owners === '' ) {
				return 'Owners field cannot be empty';
			}
			console.log( this.state.owners );
			const owners = this.state.owners.split( ',' );
			let invalidOwner = false;
			owners.forEach( owner => {
				if ( isEmail( owner ) === false ) {
					invalidOwner = true;
				}
			});
			if ( invalidOwner ) {
				return 'Owners must be valid email addresses';
			}
			const res = checkURLPath( this.state.title );
			if ( res ) {
				return 'Namespace title contains invalid characters: '+res[ 0 ]+'';
			}
			return 'success';
		};

		this.handleUpdate = () => {
			var msg = this.validateInputs();
			if ( msg === 'success' ) {
				this.props.updateCurrentNamespace({
					_id: this.props.namespace._id,
					description: this.state.description,
					title: this.state.title,
					owners: this.state.owners,
					token: this.props.user.token
				}, ( err, res ) => {
					if ( err ) {
						this.props.addNotification({
							message: err.message,
							level: 'error'
						});
					}
					else {
						if ( res.statusCode >= 400 ) {
							this.props.addNotification({
								message: res.body,
								level: 'error'
							});
						} else {
							this.props.addNotification({
								message: JSON.parse( res.body ).message,
								level: 'success'
							});
							this.props.getNamespaces( this.props.user.token );
						}
					}
				});
			} else {
				this.props.addNotification({
					message: msg,
					level: 'warning'
				});
			}
		};

		this.handleDelete = () => {
			this.props.deleteCurrentNamespace( this.props.namespace._id, this.props.user.token, () => {
				this.props.getNamespaces( this.props.user.token );
				this.setState({
					showDeleteModal: false
				});
			});
		};

		this.close = () => {
			this.setState({
				showModal: false
			});
		};

		this.closeDeleteModal = () => {
			this.setState({
				showDeleteModal: false
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
			}} header={<h2>Edit Current Course</h2>}>
				<Form style={{ padding: '20px' }}>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Comma-separated list of email addresses denoting the administrators for this course</Tooltip>}>
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
					<Button type="submit" onClick={this.handleUpdate}>Update</Button>
					<Button onClick={() => {
						this.setState({
							showDeleteModal: true
						});
					}} bsStyle="danger">Delete</Button>
				</ButtonToolbar>
				<MsgModal
					show={this.state.showModal}
					close={this.close}
					message={this.state.message}
					successful={this.state.successful}
					title="Update Course"
				/>
				<ConfirmModal
					show={this.state.showDeleteModal}
					close={this.closeDeleteModal}
					message="Are you sure that you want to delete this course?"
					title="Delete?"
					onDelete={this.handleDelete}
				/>
			</Panel>
		);
	}
}


// EXPORTS //

export default EditNamespace;
