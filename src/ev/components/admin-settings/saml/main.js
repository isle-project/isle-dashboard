// MODULES //

import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import FormGroup from 'react-bootstrap/FormGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LicenseBarrier from 'ev/containers/visible-barrier';
import SelectInputField from 'components/admin-settings/select_input_field.js';
import TextSelectField from 'components/admin-settings/text_select_field.js';


// MAIN //

const AdminSettingsSaml = ({ admin, updateSettings }) => {
	const { t } = useTranslation( 'admin_settings' );
	const settings = admin.settings;
	return (
		<Fragment>
			<LicenseBarrier>
				<FormGroup as={Row} >
					<Form.Label column sm={3} >
						{t('status')}
					</Form.Label>
					<Col sm={4} >
						<SelectInputField
							name="saml"
							defaultValue={settings.saml || 'disabled'}
							updateSettings={updateSettings}
						>
								<option value="enabled">{t('enabled')}</option>
								<option value="disabled">{t('disabled')}</option>
								<option value="passive">{t('passive')}</option>
						</SelectInputField>
					</Col>
					<Col sm={5} >
						<Form.Text muted >
							{t('saml-status-description')}
						</Form.Text>
					</Col>
				</FormGroup>
				<FormGroup as={Row} >
					<Form.Label column sm={3} >
						{t('emails-corresponding-to-saml')}
					</Form.Label>
					<Col sm={4} >
						<TextSelectField
							name="samlEmailDomains"
							key={admin.settings.samlEmailDomains}
							placeholder={t('saml-email-domains')}
							defaultValue={admin.settings.samlEmailDomains}
							updateSettings={updateSettings}
						/>
					</Col>
					<Col sm={5} >
						<Form.Text muted >
							{t('emails-corresponding-to-saml-description')}
						</Form.Text>
					</Col>
				</FormGroup>
			</LicenseBarrier>
		</Fragment>
	);
};


// PROPERTIES //

AdminSettingsSaml.propTypes = {
	admin: PropTypes.object.isRequired,
	updateSettings: PropTypes.func.isRequired
};

AdminSettingsSaml.defaultProps = {
};


// EXPORTS //

export default AdminSettingsSaml;
