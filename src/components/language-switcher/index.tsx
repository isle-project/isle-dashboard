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

import React, { useState, Fragment, ReactElement } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { useTranslation } from 'react-i18next';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import SelectModal from './select_modal';
import './language_switcher.css';


// VARIABLES //

const LanguageSwitcherPropTypes = {
	languages: PropTypes.array
};


// MAIN //

/**
* Renders a language switcher button in the bottom-right corner of the screen.
*
* @param props - component props
* @param props.languages - array containing language codes
* @returns component
*/
const LanguageSwitcher = ({ languages }: InferProps<typeof LanguageSwitcherPropTypes>): ReactElement => {
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

LanguageSwitcher.propTypes = LanguageSwitcherPropTypes;

LanguageSwitcher.defaultProps = {
	languages: null
};


// EXPORTS //

export default LanguageSwitcher;
