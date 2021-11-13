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
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import i18n from 'i18next';


// MAIN //

/**
 * A modal dialog for displaying a message after signing up.
 *
 * @param {Object} props - component properties
 * @param {string} props.message - message to display
 * @param {boolean} props.show - boolean indicating whether the modal should be shown
 * @param {Function} props.close - callback to invoke when the modal is hidden
 * @param {boolean} props.successful - boolean indicating whether the signup was successful
 * @returns {ReactElement} modal dialog
 */
const MessageModal = ( props ) => {
	const history = useHistory();
	return (
		<Modal variant={props.successful ? 'success' : 'warning'} show={props.show}>
			<Modal.Header>
				<Modal.Title>{i18n.t('signup:create-user')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{props.message}
			</Modal.Body>
			<Modal.Footer>
				{ props.successful ?
					<Button onClick={()=>{
						history.push( '/login' );
					}}>{i18n.t('signup:go-to-login-page')}</Button> :
					<Button onClick={props.close}>
						{i18n.t('signup:close')}
					</Button>
				}
			</Modal.Footer>
		</Modal>
	);
};


// EXPORTS //

export default MessageModal;
