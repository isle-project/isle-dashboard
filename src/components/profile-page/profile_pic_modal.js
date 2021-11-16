/**
* Copyright (C) 2016-present The ISLE Authors
*
* The isle-dashboard program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import AvatarEditor from 'react-avatar-editor';


// FUNCTIONS //

function getResizedCanvas( canvas, newWidth, newHeight ) {
	const tmpCanvas = document.createElement( 'canvas' );
	tmpCanvas.width = newWidth;
	tmpCanvas.height = newHeight;
	const ctx = tmpCanvas.getContext( '2d' );
	ctx.drawImage( canvas, 0, 0, canvas.width, canvas.height, 0, 0, newWidth, newHeight );
	return tmpCanvas;
}


// MAIN //

class ProfilePicModal extends Component {
	constructor( props ) {
		super( props );

		let ext;
		if ( props.user.picture ) {
			ext = props.user.picture.substr( props.user.picture.lastIndexOf( '.' ) );
		} else {
			ext = null;
		}
		this.state = {
			actualFile: props.user.picture,
			zoom: 1.2,
			ext,
			rotate: 0
		};
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.user.picture !== prevProps.user.picture ) {
			this.setState({
				actualFile: this.props.user.picture,
				rotate: 0,
				zoom: 1.2
			});
		}
	}

	handleUpload = () => {
		if ( this.editor ) {
			const canvas = this.editor.getImageScaledToCanvas();
			canvas.toBlob( img => {
				const avatarData = new FormData();
				const thumbnailData = new FormData();
				const tn = getResizedCanvas( canvas, 80, 80 );
				tn.toBlob( thumbnail => {
					const id = this.props.user.id;
					const filename = `${id}_${this.state.zoom}_${this.state.rotate}${this.state.ext}`;
					const thumbnailName = filename;
					avatarData.append( 'avatar', img, filename );
					thumbnailData.append( 'thumbnail', thumbnail, thumbnailName );
					this.props.uploadProfilePic({
						avatarData: avatarData,
						thumbnailData: thumbnailData
					});
				});
			});
		}
	};

	handleFileSelection = (e) => {
		const file = e.target.files[ 0 ];
		if ( file ) {
			const ext = path.extname( file.name );
			this.setState({
				actualFile: file,
				ext: ext
			});
		}
	};

	changeZoom = (e) => {
		this.setState({
			zoom: Number( e.target.value )
		});
	};

	renderAvatarEditor = () => {
		const t = this.props.t;
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
					<Form.Label column sm="2">{t('zoom')}</Form.Label>
					<Col sm="10">
						<FormControl
							step={0.05}
							type="range"
							defaultValue={1} min={0.5} max={3}
							onChange={this.changeZoom}
						/>
					</Col>
				</Form.Group>
			</Fragment>
		);
	};

	rotateFactory = ( degrees ) => {
		return () => {
			this.setState({
				rotate: this.state.rotate + degrees
			});
		};
	};

	render() {
		const { t } = this.props;
		return (
			<Modal
				onHide={this.props.onHide}
				show={this.props.show}
				dialogClassName="profile-pic-modal"
			>
				<Modal.Header closeButton >
					<Modal.Title as="h3">{t('profile-picture')}</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{ paddingBottom: 0 }}>
					<Form.Group style={{ marginBottom: 0 }}>
						<Form.Label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
							<h3><Badge bg="success">{t('select-file')}</Badge></h3>
						</Form.Label>
						<FormControl
							id="imageUpload"
							style={{ display: 'none' }}
							type="file"
							onChange={this.handleFileSelection}
							accept="image/*"
						/>
						<span style={{ paddingLeft: 10 }}>
							{t('click-to-upload')}
						</span>
					</Form.Group>
					{ this.renderAvatarEditor() }
					<Form.Group as={Row} controlId="form-rotate">
						<Form.Label column sm="2">{t('rotate')}</Form.Label>
						<Col sm="5">
							<Button block variant="secondary" onClick={this.rotateFactory( -90 )}>
								{t('left')}
							</Button>
						</Col>
						<Col sm="5">
							<Button block variant="secondary" style={{ float: 'right' }} onClick={this.rotateFactory( 90 )}>
								{t('right')}
							</Button>
						</Col>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.handleUpload}>
						{t('save-and-close')}
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
	t: PropTypes.func.isRequired,
	uploadProfilePic: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default ProfilePicModal;
