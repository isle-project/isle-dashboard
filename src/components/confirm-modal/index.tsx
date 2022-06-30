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

import React, { ReactElement } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { withTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


// VARIABLES //

const ConfirmModalTypes ={
	close: PropTypes.func,
	message: PropTypes.node,
	onConfirm: PropTypes.func,
	show: PropTypes.bool,
	t: PropTypes.func.isRequired,
	title: PropTypes.string
};


// MAIN //

/**
 * A confirmation modal component.
 *
 * @param {Object} props - component properties
 * @param {string} props.title - modal title
 * @param {string} props.message - modal message
 * @param {boolean} props.show - boolean indicating whether the modal is visible
 * @param {Function} props.close - callback to invoke upon hiding the modal
 * @param {Function} props.onConfirm - callback to invoke upon confirming the modal
 * @param {Function} props.t - i18next translation function
 * @returns {ReactElement} modal component
 */
const ConfirmModal = ({ title, message, show, close, onConfirm, t }: InferProps<typeof ConfirmModalTypes>): ReactElement => (
	<Modal show={show} onHide={close} >
		<Modal.Header>
			<Modal.Title as="h3">{title}</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{message}
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={close}>
				{t('cancel')}
			</Button>
			<Button variant="danger" onClick={onConfirm}>
				{t('confirm')}
			</Button>
		</Modal.Footer>
	</Modal>
);


// PROPERTIES //

ConfirmModal.propTypes = ConfirmModalTypes;

ConfirmModal.defaultProps = {
	close() {},
	message: '',
	onConfirm() {},
	show: false,
	title: ''
};


// EXPORTS //

export default withTranslation( [ 'common' ] )( ConfirmModal );
