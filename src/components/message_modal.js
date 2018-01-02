// MODULES //

import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';


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


MsgModal.propTypes = {
	close: PropTypes.func,
	message: PropTypes.string,
	show: PropTypes.bool,
	title: PropTypes.string

};

MsgModal.defaultProps = {
	close(){},
	message: '',
	show: false,
	title: ''
};


// EXPORTS //

export default MsgModal;
