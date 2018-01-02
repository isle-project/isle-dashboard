// MODULES //

import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';


// MAIN //

const DeleteModal = ( props ) => (
	<Modal show={props.show} onHide={props.close}>
		<Modal.Header>
			<Modal.Title>Delete?</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			Are you sure that you want to delete the lesson with the name "{props.title}"?
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={props.close}>Cancel</Button>
			<Button bsStyle="danger" onClick={props.delete} >Delete</Button>
		</Modal.Footer>
	</Modal>
);


// PROPERTY TYPES //

DeleteModal.propTypes = {
	close: PropTypes.func.isRequired,
	delete: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired
};


// EXPORTS //

export default DeleteModal;
