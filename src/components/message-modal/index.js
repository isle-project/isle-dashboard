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
