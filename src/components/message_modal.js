// MODULES //

import React from 'react';
import { Button, Modal } from 'react-bootstrap';


// MAIN //

const MsgModal = ( props ) => (
	<Modal show={props.show} onHide={props.close}>
		<Modal.Header closeButton>
			<Modal.Title>{props.title}</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{props.message}
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={props.close}>
				Close
			</Button>
		</Modal.Footer>
	</Modal>
);


// EXPORTS //

export default MsgModal;
