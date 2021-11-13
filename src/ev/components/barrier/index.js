// MODULES //

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';


// MAIN //

/**
* A component which renders a barrier if no ISLE license is available.
*
* @property {Object} props - component properties
* @property {string} props.admin - admin settings
* @property {string} props.user - user settings
* @returns {ReactElement} license barrier
*/
const LicenseBarrier = ({ admin, user, children }) => {
	const { t } = useTranslation( 'common' );
	if ( !user.licensed && ( !admin.license || !admin.license.valid ) ) {
		return (
			<div
				className="jumbotron"
				style={{
					width: '100%',
					height: '73.7%'
				}}
			>
				<h3 style={{ textAlign: 'center', marginTop: '12%' }}>
					{t('not-available-in-community-edition')}
				</h3>
			</div>
		);
	}
	return children;
};


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

export default LicenseBarrier;
