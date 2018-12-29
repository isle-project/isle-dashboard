// MODULES //

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';


// MAIN //

const DeleteModal = ( props ) => (
	<Modal show={props.show} onHide={props.close}>
		<Modal.Header>
			<Modal.Title>Delete?</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			Are you sure that you want to delete the lesson with the name &quot;{props.title}&quot;?
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={props.close}>Cancel</Button>
			<Button variant="danger" onClick={props.delete} >Delete</Button>
		</Modal.Footer>
	</Modal>
);


// PROPERTIES //

DeleteModal.propTypes = {
	close: PropTypes.func.isRequired,
	delete: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired
};


// EXPORTS //

export default DeleteModal;
