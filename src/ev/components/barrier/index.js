// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Jumbotron from 'react-bootstrap/Jumbotron';


// MAIN //

class LicenseBarrier extends Component {
	render() {
		const admin = this.props.admin;
		const user = this.props.user;
		if ( !user.licensed && ( !admin.license || !admin.license.valid ) ) {
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
	admin: PropTypes.object,
	user: PropTypes.object
};

LicenseBarrier.defaultProps = {
	admin: null,
	user: null
};


// EXPORTS //

export default withTranslation( 'common' )( LicenseBarrier );
