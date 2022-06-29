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
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LanguageSwitcher from 'components/language-switcher';
import pkgJson from './../../../package.json';
import './footer_bar.css';


// MAIN //

/**
* A footer bar component rendering the ISLE logo, copyright notice, dashboard version number, and links to the terms and privacy policy.
*
* @property {Object} props - component properties
* @property {Object} props.settings - ISLE instance settings
* @returns {ReactElement} component
*/
const FooterBar = ({ settings }): ReactElement => {
	const { t } = useTranslation( [ 'footer_bar', 'common' ] );
	return ( <div className="footer-bar" >
		<div className="isle-logo" >
			<img src="img/isle_logo.svg" alt="ISLE Logo" />
			<div className="footer-bar-copyright" >
				© 2016-2021 The ISLE Authors. All rights reserved.
			</div>
		</div>
		<div className="isle-terms" >
			{' | '}
			<Link target="_blank" to="/terms" >{t('terms')}</Link>
			{' | '}
			<Link target="_blank" to="/privacy" >{t('privacy')}</Link>
		</div>
		<div>
		</div>
		<LanguageSwitcher
			languages={settings.availableLanguages}
		/>
		<div className="footer-dashboard-version" >
			Dashboard v{pkgJson.version}
		</div>
	</div> );
};


// PROPERTIES //

FooterBar.propTypes = {
	settings: PropTypes.object.isRequired
};


// EXPORTS //

export default FooterBar;
