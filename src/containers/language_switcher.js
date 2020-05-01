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

import React, { Component, Fragment } from 'react';
import i18next from 'i18next';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


// MAIN //

class LanguageSwitcher extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showSelectModal: false
		};
	}

	changeLanguageFactory = ( lng ) => {
		return async () => {
			this.toggleSelectModal();
			await i18next.changeLanguage( lng );
		};
	}

	toggleSelectModal = () => {
		this.setState({
			showSelectModal: !this.state.showSelectModal
		});
	}

	renderSelectModal() {
		if ( !this.state.showSelectModal ) {
			return null;
		}
		return (
			<Modal show onHide={this.toggleSelectModal} >
				<Modal.Header closeButton >
					<Modal.Title as="h3">Choose Language</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Button block onClick={this.changeLanguageFactory( 'en' )}>English - EN</Button>
					<Button block onClick={this.changeLanguageFactory( 'es' )}>Español - ES</Button>
					<Button block onClick={this.changeLanguageFactory( 'de' )}>Deutsch - DE</Button>
				</Modal.Body>
			</Modal>
		);
	}

	render() {
		return (
			<Fragment>
				<OverlayTrigger placement="left" overlay={<Tooltip id="language-switcher">Change language</Tooltip>} >
					<Button
						onClick={this.toggleSelectModal} className="language-switcher"
						variant="light" size="sm" aria-label="Change language"
					>
						<i className="fas fa-globe"></i>
					</Button>
				</OverlayTrigger>
				{this.renderSelectModal()}
			</Fragment>
		);
	}
}


// EXPORTS //

export default LanguageSwitcher;
