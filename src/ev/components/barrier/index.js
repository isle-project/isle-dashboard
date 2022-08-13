// MODULES //

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';


// FUNCTIONS //

function Jumbotron({ message }) {
	return (
		<div
			className="jumbotron"
			style={{
				width: '100%',
				height: '73.7%'
			}}
		>
			<h3 style={{ textAlign: 'center', marginTop: '2%' }}>
				{message}
			</h3>
		</div>
	);
}


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
		return <Jumbotron message={t('not-available-in-community-edition')} />;
	}
	const currentDate = new Date();
	const endDate = new Date( admin.license.endDate );
	if ( currentDate > endDate ) {
		return <Jumbotron message={t('license-expired')} />;
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
