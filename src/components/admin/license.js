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
import FormLabel from 'react-bootstrap/FormLabel';
import FormGroup from 'react-bootstrap/FormGroup';
import Badge from 'react-bootstrap/Badge';


// MAIN //

class LicensePage extends Component {
	constructor( props ) {
		super( props );
	}

	componentDidMount() {
		this.props.getLicense( this.props.user );
	}

	handleUpload = ( event ) => {
		const file = event.target.files[ 0 ];
		const formData = new FormData();
		formData.append( 'license', file, file.name );
		this.props.uploadLicense({
			formData,
			user: this.props.user
		});
	}

	render() {
		const { t } = this.props;
		return (
			<div className="admin-overview-container" >
				<h2>{t('your-license')}</h2>
				{this.props.user.licensed}
				<FormGroup className="file-upload-button" >
					<FormLabel htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
						<h3><Badge variant="info" >{t('upload-license')}</Badge></h3>
						<input
							id="fileUpload"
							type="file"
							accept=".isle-license"
							onChange={this.handleUpload}
							style={{ display: 'none' }}
						/>
					</FormLabel>
				</FormGroup>
			</div>
		);
	}
}


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( LicensePage );
