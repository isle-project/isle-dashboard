// MODULES //

import React, { Component } from 'react';
import { Button, Modal, Col, Row, FormLabel, Form, FormControl, FormGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';


// MAIN //

class EnterTokenModal extends Component {
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

	render() {
		return (
			<Modal onHide={this.props.onHide} show={this.props.show} >
				<Modal.Header closeButton >
					<Modal.Title as="h2">Enter Access Token</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						Please enter the write-access token that was sent to you. If you have not received it yet,
						please get in touch with <a href="mailto:pgb@andrew.cmu.edu">Philipp Burckhardt</a>.
					</div>
					<br />
					<Form>
						<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Please enter the access token.</Tooltip>}>
							<FormGroup>
								<Row>
									<Col sm={2}>
										<FormLabel>Token</FormLabel>
									</Col>
									<Col sm={10}>
										<FormControl
											name="title"
											type="text"
											placeholder="Enter token"
											onChange={this.handleInputChange}
										/>
									</Col>
								</Row>
							</FormGroup>
						</OverlayTrigger>
					</Form>
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

EnterTokenModal.propTypes = {
	authenticate: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default EnterTokenModal;
