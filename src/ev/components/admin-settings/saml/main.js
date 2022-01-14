// MODULES //

import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import FormGroup from 'react-bootstrap/FormGroup';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LicenseBarrier from 'ev/containers/visible-barrier';
import SelectInputField from 'components/admin-settings/select_input_field.js';
import TextSelectField from 'components/admin-settings/text_select_field.js';
import TextArea from 'components/admin-settings/text_area.js';
import CheckboxInputField from 'components/admin-settings/checkbox_input_field.js';


// MAIN //

const AdminSettingsSaml = ({ admin, updateSettings }) => {
	const { t } = useTranslation( 'admin_settings' );
	const settings = admin.settings;
	return (
		<Fragment>
			<LicenseBarrier>
				<Container style={{ float: 'left' }} className="d-grid gap-3" >
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
							{t('saml-email-domains')}
						</Form.Label>
						<Col sm={4} >
							<TextSelectField
								name="samlEmailDomains"
								key={admin.settings.samlEmailDomains}
								placeholder={t('saml-email-domains-placeholder')}
								defaultValue={admin.settings.samlEmailDomains}
								updateSettings={updateSettings}
							/>
						</Col>
						<Col sm={5} >
							<Form.Text muted >
								{t('saml-email-domains-description')}
							</Form.Text>
						</Col>
					</FormGroup>
					<Form.Group as={Row} >
						<Form.Label column sm={2} >
							{t('saml-choice-header')}
						</Form.Label>
						<Col sm={5} >
							<TextArea
								name="samlChoiceHeader"
								key={admin.settings.samlChoiceHeader}
								defaultValue={admin.settings.samlChoiceHeader}
								updateSettings={updateSettings}
								t={t}
							/>
						</Col>
						<Col sm={5} >
							<Form.Text muted >
								{t('saml-choice-header-description')}
							</Form.Text>
						</Col>
					</Form.Group>
					<Form.Group as={Row} >
						<Form.Label column sm={2} >
							{t('saml-choice-extra-styles')}
						</Form.Label>
						<Col sm={5} >
							<TextArea
								name="samlExtraStyles"
								key={admin.settings.samlExtraStyles}
								defaultValue={admin.settings.samlExtraStyles}
								updateSettings={updateSettings}
								t={t}
							/>
						</Col>
						<Col sm={5} >
							<Form.Text muted >
								{t('saml-choice-extra-styles-description')}
							</Form.Text>
						</Col>
					</Form.Group>
					<Form.Group as={Row} >
						<Form.Label column sm={4} >
							{t('saml-authentication-barrier')}
						</Form.Label>
						<Col sm={8} >
							<CheckboxInputField
								name="samlDisableAuthenticationBarrier"
								label={t('saml-authentication-barrier-description')}
								defaultValue={admin.settings.samlDisableAuthenticationBarrier}
								updateSettings={updateSettings}
							/>
						</Col>
					</Form.Group>
					<FormGroup as={Row} >
						<Form.Label column sm={3} >
							{t('saml-exempt-patterns')}
						</Form.Label>
						<Col sm={4} >
							<TextSelectField
								name="samlExemptPatterns"
								key={admin.settings.samlExemptPatterns}
								placeholder={t('saml-exempt-patterns-placeholder')}
								defaultValue={admin.settings.samlExemptPatterns}
								updateSettings={updateSettings}
							/>
						</Col>
						<Col sm={5} >
							<Form.Text muted >
								{t('saml-exempt-patterns-description')}
							</Form.Text>
						</Col>
					</FormGroup>
				</Container>
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
