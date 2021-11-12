// MODULES //

import React, { Component, Fragment } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import LicenseBarrier from 'ev/containers/visible-barrier';
import CreateFieldModal from './create_field_modal.js';
import './user_fields.css';


// MAIN //

class AdminSettingsUserFields extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showCreateModal: false
		};
	}

	componentDidMount() {
		this.props.getCustomFields();
	}

	toggleCreateModal = () => {
		this.setState({
			showCreateModal: !this.state.showCreateModal
		});
	};

	handleDeletionFactory = ( id ) => {
		return () => {
			this.props.deleteCustomField( id );
		};
	};

	render() {
		const { t } = this.props;
		const availableCustomFields = this.props.user.availableCustomFields || [];
		return (
			<Fragment>
				<div className="admin-settings-outer-container" >
					<LicenseBarrier>
						<h1>{this.props.t('user-fields')}</h1>
						<p>{this.props.t('user-fields-description')}</p>
						{ availableCustomFields.length > 0 ? <ListGroup className="admin-settings-fields-list" >
							{availableCustomFields.map( ( field, idx ) => {
								let optionsStr;
								if ( field.type === 'dropdown' ) {
									optionsStr = `; options: ${field.options.join( ', ' )}`;
								}
								return (
									<ListGroup.Item key={idx} >
										<b>{field.name}</b>: {field.description} (type: {field.type}{optionsStr})
										{field.editableOnSignup ? ', editableOnSignup' : ''}
										{field.showOnProfile ? ', showOnProfile' : ''}
										{field.editableOnProfile ? ', editableOnProfile' : ''}
										<OverlayTrigger placement="left" overlay={<Tooltip id="delete_field">{t('delete-field')}</Tooltip>}>
											<Button
												variant="outline-secondary"
												onClick={this.handleDeletionFactory( field._id )}
												aria-label={t('delete-field')}
											>
												<div className="fa fa-trash-alt" />
											</Button>
										</OverlayTrigger>
										<Button
											aria-label={t('increment-position')}
											variant="outline-secondary"
											onClick={() => {
												this.props.incrementFieldPosition( field._id );
											}}
											disabled={idx === availableCustomFields.length - 1}
										>
											<i className="fas fa-arrow-down"></i>
										</Button>
										<Button
											aria-label={t('decrement-position')}
											variant="outline-secondary"
											onClick={() => {
												this.props.decrementFieldPosition( field._id );
											}}
											disabled={idx === 0}
										>
											<i className="fas fa-arrow-up"></i>
										</Button>
									</ListGroup.Item>
								);
							})}
						</ListGroup> : <div className="jumbotron admin-settings-fields-jumbotron" >
							{t('no-custom-fields')}
						</div> }
						<Button variant="primary" onClick={this.toggleCreateModal} >
							<i className="fas fa-plus" style={{ marginRight: 8 }}></i>
							{this.props.t('add-user-field')}
						</Button>
					</LicenseBarrier>
				</div>
				{this.state.showCreateModal ? <CreateFieldModal
					show={this.state.showCreateModal}
					onHide={this.toggleCreateModal}
					t={this.props.t}
					createCustomField={this.props.createCustomField}
					availableCustomFields={this.props.user.availableCustomFields}
				/> : null}
			</Fragment>
		);
	}
}


// PROPERTIES //

AdminSettingsUserFields.propTypes = {
	createCustomField: PropTypes.func.isRequired,
	decrementFieldPosition: PropTypes.func.isRequired,
	deleteCustomField: PropTypes.func.isRequired,
	getCustomFields: PropTypes.func.isRequired,
	incrementFieldPosition: PropTypes.func.isRequired,
	user: PropTypes.object
};

AdminSettingsUserFields.defaultProps = {
	user: {}
};


// EXPORTS //

export default withTranslation( 'admin_settings' )( AdminSettingsUserFields );
