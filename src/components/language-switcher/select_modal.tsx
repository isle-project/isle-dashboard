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

import React, { ReactElement } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import i18next from 'i18next';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { LANGUAGE_CODES, languageDescription } from 'constants/languages';


// VARIABLES //

const SelectModalPropTypes = {
	languages: PropTypes.arrayOf(PropTypes.string).isRequired,
	onHide: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired
};


// MAIN //

/**
* Modal for selecting a language.
*
* @param props - component props
* @param props.languages - array containing language codes
* @param props.t - translation function
* @param props.onHide - callback to hide the modal
* @returns modal
*/
const SelectModal = ({ t, languages, onHide }: InferProps<typeof SelectModalPropTypes>): ReactElement => {
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

SelectModal.propTypes = SelectModalPropTypes;


// EXPORTS //

export default SelectModal;
