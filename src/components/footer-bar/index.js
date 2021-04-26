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

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LanguageSwitcher from 'components/language-switcher';
import pkgJson from './../../../package.json';
import './footer_bar.css';


// MAIN //

class FooterBar extends Component {
	render() {
		return ( <div className="footer-bar" >
			<div className="isle-logo" >
				<img src="img/isle_logo.svg" alt="ISLE Logo" />
				<div className="footer-bar-copyright" >
					© 2016-2021 The ISLE Authors. All rights reserved.
				</div>
			</div>
			<div className="isle-terms" >
				{' | '}
				<Link target="_blank" to="/terms" >Terms</Link>
				{' | '}
				<Link target="_blank" to="/privacy" >Privacy</Link>
			</div>
			<div>
			</div>
			<LanguageSwitcher />
			<div className="footer-dashboard-version" >
				Dashboard v{pkgJson.version}
			</div>
		</div> );
	}
}


// EXPORTS //

export default withTranslation( [ 'footer_bar', 'common' ] )( FooterBar );
