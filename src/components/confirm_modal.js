// MODULES //

import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';


// MAIN //

const ConfirmModal = ( props ) => (
	<Modal show={props.show} onHide={props.close}>
		<Modal.Header>
			<Modal.Title>{props.title}</Modal.Title>
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


// PROPERTY TYPES //

ConfirmModal.propTypes = {
	close: PropTypes.func,
	message: PropTypes.string,
	onDelete: PropTypes.func,
	show: PropTypes.bool,
	title: PropTypes.string

};

ConfirmModal.defaultProps = {
	close(){},
	message: '',
	onDelete(){},
	show: false,
	title: ''
};


// EXPORTS //

export default ConfirmModal;
