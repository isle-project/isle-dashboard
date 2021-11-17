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
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


// MAIN //

/**
 * Delete modal component.
 *
 * @param {Object} props - component properties
 * @param {boolean} props.show - boolean indicating if the modal is visible
 * @param {Function} props.close - callback to invoke when the modal is closed
 * @param {Function} props.delete - callback to invoke when the delete button is clicked
 * @param {string} props.title - lesson title
 * @param {Function} props.t - i18n translate function
 * @returns {ReactElement} delete modal
 */
const DeleteModal = ( props ) => (
	<Modal show={props.show} onHide={props.close}>
		<Modal.Header>
			<Modal.Title>{props.t('common:delete')}?</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{props.t('delete-modal-body', { name: props.title })}
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={props.close}>{props.t('common:cancel')}</Button>
			<Button variant="danger" onClick={props.delete} >{props.t('common:delete')}</Button>
		</Modal.Footer>
	</Modal>
);


// PROPERTIES //

DeleteModal.propTypes = {
	close: PropTypes.func.isRequired,
	delete: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	t: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired
};


// EXPORTS //

export default DeleteModal;
