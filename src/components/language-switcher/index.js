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

import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { LANGUAGE_CODES, languageDescription } from 'constants/languages';
import './language_switcher.css';


// FUNCTIONS //

/**
* Modal for selecting a language.
*
* @param {Object} props - component props
* @param {Object} props.languages - object containing language codes
* @param {Function} props.t - translation function
* @param {Function} props.onHide - callback to hide the modal
* @returns {ReactElement} modal
*/
const SelectModal = ({ t, languages, onHide }) => {
	const availableLanguages = languages || LANGUAGE_CODES;
	const changeLanguageFactory = ( lng ) => {
		return async () => {
			onHide();
			await i18next.changeLanguage( lng );
		};
	};
	return (
		<Modal show onHide={onHide} >
			<Modal.Header closeButton >
				<Modal.Title as="h3">{t('choose-language')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<ButtonGroup size="sm" vertical style={{ width: '100%' }} >
					{availableLanguages.map( ( x, idx ) => {
						return ( <Button
							key={idx} variant="outline-primary"
							onClick={changeLanguageFactory( x )}
						>{languageDescription( x )}</Button> );
					})}
				</ButtonGroup>
			</Modal.Body>
		</Modal>
	);
};


// MAIN //

/**
* Renders a language switcher button in the bottom-right corner of the screen.
*
* @param {Object} props - component props
* @param {Object} props.languages - object containing language codes
* @returns {ReactElement} component
*/
const LanguageSwitcher = ({ languages }) => {
	const { t } = useTranslation( 'common' );
	const [ showSelectModal, setShowSelectModal ] = useState( false );
	const toggleSelectModal = () => {
		setShowSelectModal( !showSelectModal );
	};
	return (
		<Fragment>
			<OverlayTrigger placement="left" overlay={<Tooltip id="language-switcher">{t('change-language')}</Tooltip>} >
				<Button
					onClick={toggleSelectModal} className="language-switcher"
					variant="light" size="sm" aria-label={t('choose-language')}
				>
					<i className="fas fa-globe"></i>
				</Button>
			</OverlayTrigger>
			{showSelectModal ? <SelectModal languages={languages} t={t} onHide={toggleSelectModal} /> : null}
		</Fragment>
	);
};


// PROPERTIES //

LanguageSwitcher.propTypes = {
	languages: PropTypes.array
};

LanguageSwitcher.defaultProps = {
	languages: null
};


// EXPORTS //

export default LanguageSwitcher;
