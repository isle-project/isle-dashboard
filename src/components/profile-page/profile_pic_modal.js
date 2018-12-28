// MODULES //

import React, { Component, Fragment } from 'react';
import { Badge, Button, Modal, Form, FormControl } from 'react-bootstrap';
import AvatarEditor from 'react-avatar-editor';
import PropTypes from 'prop-types';
import path from 'path';


// MAIN //

class ProfilePicModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			actualFile: props.user.picture,
			zoom: 1.2,
			ext: null
		};
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.user.picture !== prevProps.user.picture ) {
			this.setState({
				actualFile: this.props.user.picture
			});
		}
	}

	handleUpload = () => {
		if ( this.editor ) {
			const canvas = this.editor.getImage();
			canvas.toBlob( img => {
				const formData = new FormData();
				formData.append( 'avatar', img, this.props.user.id + this.state.ext );
				this.props.uploadProfilePic({
					token: this.props.user.token,
					formData: formData
				});
			});
		}
	}

	handleFileSelection = (e) => {
		let file = e.target.files;
		var ext = path.extname( file[0].name);
		console.log(file );
		this.setState({
			actualFile: file[ 0 ],
			ext: ext
		});
	}

	changeZoom = (e) => {
		this.setState({
			zoom: Number( e.target.value )
		});
	}

	renderAvatarEditor = () => {
		return (
			<Fragment>
				<AvatarEditor
					ref={(editor) => {
						this.editor = editor;
					}}
					image={this.state.actualFile}
					width={365}
					height={365}
					border={50}
					color={[255, 255, 255, 0.9]} // RGBA
					scale={this.state.zoom}
					rotate={0}
				/>
				<Form.Group controlId="Form-Zoom">
					<Form.Label>
						<h3>Zoom</h3>
					</Form.Label>
					<FormControl
						step={0.05} type="range" defaultValue={1} min={0.5} max={3}
						onChange={this.changeZoom}
					/>
				</Form.Group>
			</Fragment>
		);
	}

	render() {
		return (
			<Modal onHide={this.props.onHide} show={this.props.show} >
				<Modal.Header closeButton >
					<Modal.Title as="h2">Profile Picture</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Group>
						<Form.Label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
							<h3><Badge variant="success">Select file</Badge></h3>
						</Form.Label>
						<FormControl
							id="imageUpload"
							style={{ display: 'none' }}
							type="file"
							onChange={this.handleFileSelection}
							accept="image/*"
						/>
					</Form.Group>
					{ this.renderAvatarEditor() }
					<br />
					<div>
						You can upload a new profile pic
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.handleUpload}>
						Upload
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}


// PROPERTIES //

ProfilePicModal.propTypes = {
	onHide: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	uploadProfilePic: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default ProfilePicModal;
