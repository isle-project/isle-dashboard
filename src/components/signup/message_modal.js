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
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { withRouter } from 'react-router';
import i18n from 'i18next';


// MAIN //

const MessageModal = withRouter( ( props ) => (
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
					props.history.push( '/login' );
				}}>{i18n.t('signup:go-to-login-page')}</Button> :
				<Button onClick={props.close}>
					{i18n.t('signup:close')}
				</Button>
			}
		</Modal.Footer>
	</Modal>
) );


// EXPORTS //

export default MessageModal;
