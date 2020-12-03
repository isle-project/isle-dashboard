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
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Jumbotron from 'react-bootstrap/Jumbotron';


// MAIN //

class LicenseBarrier extends Component {
	render() {
		const license = this.props.license;
		if ( !license || !license.valid ) {
			return (
				<Jumbotron
					style={{
						width: '100%',
						height: '73.7%'
					}}
				>
					<h3 style={{ textAlign: 'center', marginTop: '12%' }}>
						{this.props.t('not-available-in-community-edition')}
					</h3>
				</Jumbotron>
			);
		}
		return this.props.children;
	}
}


// PROPERTIES //

LicenseBarrier.propTypes = {
	license: PropTypes.object
};

LicenseBarrier.defaultProps = {
	license: null
};


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( LicenseBarrier );
