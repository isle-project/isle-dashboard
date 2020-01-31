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

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';


// MAIN //

const ConfirmModal = ( props ) => (
	<Modal show={props.show} onHide={props.close}>
		<Modal.Header>
			<Modal.Title as="h3">{props.title}</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{props.message}
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={props.close}>Cancel</Button>
			<Button variant="danger" onClick={props.onDelete}>Confirm</Button>
		</Modal.Footer>
	</Modal>
);


// PROPERTIES //

ConfirmModal.propTypes = {
	close: PropTypes.func,
	message: PropTypes.string,
	onDelete: PropTypes.func,
	show: PropTypes.bool,
	title: PropTypes.string
};

ConfirmModal.defaultProps = {
	close() {},
	message: '',
	onDelete() {},
	show: false,
	title: ''
};


// EXPORTS //

export default ConfirmModal;
