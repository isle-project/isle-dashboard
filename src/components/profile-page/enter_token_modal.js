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

import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FormLabel from 'react-bootstrap/FormLabel';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
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
	};

	handleSubmit = async () => {
		const success = await this.props.authenticate({
			writeAccessToken: this.state.token
		});
		if ( success ) {
			this.props.onHide();
		}
	};

	render() {
		return (
			<Modal onHide={this.props.onHide} show={this.props.show} >
				<Modal.Header closeButton >
					<Modal.Title as="h3">Enter Access Token</Modal.Title>
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
					<Button
						onClick={this.handleSubmit}
						disabled={!this.state.token}
					>
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
	show: PropTypes.bool.isRequired
};


// EXPORTS //

export default EnterTokenModal;
