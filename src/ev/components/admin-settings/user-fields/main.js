// MODULES //

import React, { Component, Fragment } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import LicenseBarrier from 'ev/components/admin/barrier';
import CreateFieldModal from './create_field_modal.js';


// MAIN //

class AdminSettingsUserFields extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showCreateModal: false
		};
	}

	toggleCreateModal = () => {
		this.setState({
			showCreateModal: !this.state.showCreateModal
		});
	}

	render() {
		return (
			<Fragment>
				<div className="admin-settings-outer-container" >
					<LicenseBarrier license={this.props.admin.license} >
						<h1>{this.props.t('user-fields')}</h1>
						<p>{this.props.t('user-fields-description')}</p>
						<Button variant="primary" onClick={this.toggleCreateModal} >
							<i className="fas fa-plus" style={{ marginRight: 8 }}></i>
							{this.props.t('add-user-field')}
						</Button>
					</LicenseBarrier>
				</div>
				<CreateFieldModal
					show={this.state.showCreateModal}
					onHide={this.toggleCreateModal}
					t={this.props.t}
				/>
			</Fragment>
		);
	}
};


// PROPERTIES //

AdminSettingsUserFields.propTypes = {
	admin: PropTypes.object
};

AdminSettingsUserFields.defaultProps = {
	admin: {}
};


// EXPORTS //

export default withTranslation( 'admin_settings' )( AdminSettingsUserFields );
