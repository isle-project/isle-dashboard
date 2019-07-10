// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Badge, Button, Modal, Form, FormControl, Col, Row } from 'react-bootstrap';
import AvatarEditor from 'react-avatar-editor';
import path from 'path';


// FUNCTIONS //

function getResizedCanvas(canvas, newWidth, newHeight) {
	const tmpCanvas = document.createElement('canvas');
	tmpCanvas.width = newWidth;
	tmpCanvas.height = newHeight;

	const ctx = tmpCanvas.getContext('2d');
	ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, newWidth, newHeight);

	return tmpCanvas;
}


// MAIN //

class ProfilePicModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			actualFile: props.user.picture,
			zoom: 1.2,
			ext: null,
			rotate: 0
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
			const canvas = this.editor.getImageScaledToCanvas();

			canvas.toBlob( img => {
				const avatarData = new FormData();
				const thumbnailData = new FormData();
				const tn = getResizedCanvas(canvas, 80, 80);
				tn.toBlob( thumbnail => {
					const filename = this.props.user.id + this.state.ext;
					const thumbnailName = filename;
					avatarData.append( 'avatar', img, filename );
					thumbnailData.append( 'thumbnail', thumbnail, thumbnailName );
					this.props.uploadProfilePic({
						token: this.props.user.token,
						avatarData: avatarData,
						thumbnailData: thumbnailData
					});
				});
			});
		}
	}

	handleFileSelection = (e) => {
		const file = e.target.files[ 0 ];
		if ( file ) {
			const ext = path.extname( file.name );
			this.setState({
				actualFile: file,
				ext: ext
			});
		}
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
					className="avatarEditor"
					ref={(editor) => {
						this.editor = editor;
					}}
					image={this.state.actualFile}
					width={200}
					height={200}
					border={[80, 50]}
					crossOrigin='anonymous'
					color={[110, 98, 98, 0.29]} // RGBA
					scale={this.state.zoom}
					rotate={this.state.rotate}
				/>
				<Form.Group as={Row} controlId="form-zoom">
					<Form.Label column sm="2">Zoom</Form.Label>
					<Col sm="10">
						<FormControl
							step={0.05} type="range" defaultValue={1} min={0.5} max={3}
							onChange={this.changeZoom}
						/>
					</Col>
				</Form.Group>
			</Fragment>
		);
	}

	rotateLeft = () => {
		let oldRotate = this.state.rotate;
		this.setState({
			rotate: oldRotate - 90
		});
	}

	rotateRight = () => {
		let oldRotate = this.state.rotate;
		this.setState({
			rotate: oldRotate + 90
		});
	}

	render() {
		return (
			<Modal
				onHide={this.props.onHide}
				show={this.props.show}
				dialogClassName="profile-pic-modal"
			>
				<Modal.Header closeButton >
					<Modal.Title as="h3">Profile Picture</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{ paddingBottom: 0 }}>
					<Form.Group style={{ marginBottom: 0 }}>
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
						<span style={{ paddingLeft: 10 }}>
							Click to upload a new profile picture.
						</span>
					</Form.Group>
					{ this.renderAvatarEditor() }
					<Form.Group as={Row} controlId="form-rotate">
						<Form.Label column sm="2">Rotate</Form.Label>
						<Col sm="5">
							<Button block variant="secondary" onClick={this.rotateLeft}>
								Left
							</Button>
						</Col>
						<Col sm="5">
							<Button block variant="secondary" style={{ float: 'right' }} onClick={this.rotateRight}>
								Right
							</Button>
						</Col>
					</Form.Group>
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
