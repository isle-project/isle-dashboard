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
import PropTypes from 'prop-types';


// MAIN //

class TicketListModal extends Component {
	constructor( props ) {
		super( props );
	}

	render() {
		return (
			<Modal onHide={this.props.onHide} show={this.props.show} >
				<Modal.Header closeButton >
					<Modal.Title as="h3">My Tickets</Modal.Title>
				</Modal.Header>
				<Modal.Body>
				</Modal.Body>
				<Modal.Footer>
					<Button
					>
						Create Ticket
					</Button>
					<Button
						onClick={this.props.onHide}
					>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}


// PROPERTIES //

TicketListModal.propTypes = {
	onHide: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired
};


// EXPORTS //

export default TicketListModal;
