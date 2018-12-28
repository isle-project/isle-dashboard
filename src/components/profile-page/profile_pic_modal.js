// MODULES //

import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import AvatarEditor from 'react-avatar-editor';
import PropTypes from 'prop-types';

// MAIN //

class ProfilePicModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			token: null
		};
	}

	handleInputChange = ( event ) => {
		this.setState({
			token: event.target.value
		});
	}

	handleSubmit = () => {
		this.props.authenticate({
			writeAccessToken: this.state.token,
			userToken: this.props.user.token
		});
	}

	renderAvatarEditor = () => {
		return (
			<AvatarEditor
				image="https://isle.heinz.cmu.edu/Philipp-Burckhardt_1545932125612.jpg"
				width={365}
				height={365}
				border={50}
				color={[255, 255, 255, 0.9]} // RGBA
				scale={1.2}
				rotate={0}
			/>
		);
	}

	render() {
		return (
			<Modal onHide={this.props.onHide} show={this.props.show} >
				<Modal.Header closeButton >
					<Modal.Title as="h2">Profile Pic</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{ this.renderAvatarEditor() }
					<br />
					<div>
						You can upload a new profile pic
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.handleSubmit}>
						Submit
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}


// PROPERTIES //

ProfilePicModal.propTypes = {
	authenticate: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default ProfilePicModal;
