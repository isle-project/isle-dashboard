// MODULES //

import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { withRouter } from 'react-router';


// MAIN //

const MessageModal = withRouter( ( props ) => (
	<Modal variant={props.successful ? 'success' : 'warning'} show={props.show}>
		<Modal.Header>
			<Modal.Title>Create User</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{props.message}
		</Modal.Body>
		<Modal.Footer>
			{ props.successful ?
				<Button onClick={()=>{
					props.history.push( '/login' );
				}}>Go to login page</Button> :
				<Button onClick={props.close}>
					Close
				</Button>
			}
		</Modal.Footer>
	</Modal>
) );


// EXPORTS //

export default MessageModal;
