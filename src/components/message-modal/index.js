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
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';


// MAIN //

/**
 * A modal dialog for displaying messages.
 *
 * @param {Object} props - component properties
 * @param {string} props.message - message to display
 * @param {string} props.title - title of the modal
 * @param {boolean} props.show - boolean indicating whether the modal is shown
 * @param {Function} props.close - callback invoked upon closing the modal
 * @returns {ReactElement} modal dialog
 */
const MsgModal = ({ show, close, message, title }) => (
	<Modal show={show} onHide={close}>
		<Modal.Header closeButton>
			<Modal.Title>{title}</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{message}
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={close}>
				Close
			</Button>
		</Modal.Footer>
	</Modal>
);


// PROPERTIES //

MsgModal.propTypes = {
	close: PropTypes.func,
	message: PropTypes.string,
	show: PropTypes.bool,
	title: PropTypes.string
};

MsgModal.defaultProps = {
	close() {},
	message: '',
	show: false,
	title: ''
};


// EXPORTS //

export default MsgModal;
