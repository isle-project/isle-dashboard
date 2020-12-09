// MODULES //

import { connect } from 'react-redux';
import LicenseBarrier from 'ev/components/barrier';


// FUNCTIONS //

function mapStateToProps( state ) {
	return {
		admin: state.admin,
		user: state.user
	};
}

function mapDispatchToProps() {
	return {};
}


// MAIN //

const VisibleLicenseBarrier = connect( mapStateToProps, mapDispatchToProps )( LicenseBarrier );


// EXPORTS //

export default VisibleLicenseBarrier;
