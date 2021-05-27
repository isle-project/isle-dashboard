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

import React, { Component, Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SelectInput, { components } from 'react-select';
import deepEqual from '@stdlib/assert/deep-equal';
import TextSelect from 'components/text-select';
import { LANGUAGES, languageLabel } from 'constants/languages';
import i18next from 'helpers/i18n';


// FUNCTIONS //

const InputField = ({ name, defaultValue, type, updateSettings }) => {
	const [ value, setValue ] = useState( defaultValue );
	const handleChange = useCallback( ( event ) => {
		const target = event.target;
		setValue( target.type === 'number' ? Number( target.value ) : target.value );
	}, [] );
	const handleReset = useCallback( () => {
		setValue( defaultValue );
	}, [ defaultValue ] );
	const handleConfirm = useCallback( () => {
		updateSettings( name, value );
	}, [ updateSettings, name, value ] );
	return (
		<Form.Group style={{ marginBottom: 0 }} >
			<Form.Control type={type} value={value} style={{ width: 'calc(100% - 78px)', float: 'left' }} onChange={handleChange} />
			{ value !== defaultValue ?
				<Fragment>
					<Button
						onClick={handleConfirm}
						variant="success" size="sm" style={{ marginRight: 6, marginLeft: 8 }}
					>
						<i className="fas fa-check" />
					</Button>
					<Button
						onClick={handleReset}
						variant="warning" size="sm" style={{ width: 32 }}
					>
						<i className="fas fa-times" />
					</Button>
				</Fragment> : null
			}
		</Form.Group>
	);
};

const SelectInputField = ({ name, children, defaultValue, updateSettings }) => {
	const [ value, setValue ] = useState( defaultValue );
	const handleChange = useCallback( ( event ) => {
		setValue( event.target.value );
	}, [] );
	const handleReset = useCallback( () => {
		setValue( defaultValue );
	}, [ defaultValue ] );
	const handleConfirm = useCallback( () => {
		updateSettings( name, value );
	}, [ updateSettings, name, value ] );
	return (
		<Form.Group style={{ marginBottom: 0 }} >
			<Form.Control
				value={value} as="select" onChange={handleChange}
				style={{ width: 'calc(100% - 78px)', float: 'left' }}
			>
				{children}
			</Form.Control>
			{ value !== defaultValue ?
				<Fragment>
					<Button
						onClick={handleConfirm}
						variant="success" size="sm" style={{ marginRight: 6, marginLeft: 8 }}
					>
						<i className="fas fa-check" />
					</Button>
					<Button
						onClick={handleReset}
						variant="warning" size="sm" style={{ width: 32 }}
					>
						<i className="fas fa-times" />
					</Button>
				</Fragment> : null
			}
		</Form.Group>
	);
};

const CheckboxInput = ({ name, defaultValue, label, updateSettings }) => {
	const [ value, setValue ] = useState( defaultValue );
	const handleChange = useCallback( ( event ) => {
		setValue( event.target.checked );
	}, [] );
	const handleReset = useCallback( () => {
		setValue( defaultValue );
	}, [ defaultValue ] );
	const handleConfirm = useCallback( () => {
		updateSettings( name, value );
	}, [ updateSettings, name, value ] );
	return (
		<Form.Group style={{ marginBottom: 0 }} >
			<Form.Check
				type="checkbox" label={label} checked={value} onChange={handleChange}
				style={{ width: 'calc(100% - 78px)', float: 'left' }}
			/>
			{ value !== defaultValue ?
				<Fragment>
					<Button
						onClick={handleConfirm}
						variant="success" size="sm" style={{ marginRight: 6, marginLeft: 8 }}
					>
						<i className="fas fa-check" />
					</Button>
					<Button
						onClick={handleReset}
						variant="warning" size="sm" style={{ width: 32 }}
					>
						<i className="fas fa-times" />
					</Button>
				</Fragment> : null
			}
		</Form.Group>
	);
};

const TextSelectField = ({ name, placeholder, defaultValue, updateSettings }) => {
	const [ value, setValue ] = useState( defaultValue );
	const [ modified, setModified ] = useState( false );
	const handleChange = useCallback( ( newValue ) => {
		setModified( true );
		setValue( newValue );
	}, [] );
	const handleConfirm = useCallback( () => {
		const domains = value ? value.map( x => x.label ) : [];
		updateSettings( name, domains );
	}, [ updateSettings, name, value ] );
	const handleReset = useCallback( () => {
		setValue( defaultValue );
		setModified( false );
	}, [ defaultValue ] );
	return (
		<Fragment>
			<TextSelect
				placeholder={placeholder}
				defaultValue={value}
				onChange={handleChange}
				styles={{
					control: () => ({
						width: 'calc(100% - 78px)'
					})
				}}
			/>
			{ modified ?
				<Fragment>
					<Button
						onClick={handleConfirm}
						variant="success" size="sm" style={{ marginRight: 6, marginLeft: 8 }}
					>
						<i className="fas fa-check" />
					</Button>
					<Button
						onClick={handleReset}
						variant="warning" size="sm" style={{ width: 32 }}
					>
						<i className="fas fa-times" />
					</Button>
				</Fragment> : null
			}
		</Fragment>
	);
};

const Option = props => {
	return ( <components.Option key={props.data.label} {...props} >
		<span style={{
			color: props.isSelected ? 'white' : 'black'
		}}>{i18next.t( 'admin_settings:'+props.data.label )}</span>
	</components.Option> );
};

const MultiValue = props => {
	return ( <components.MultiValue key={props.data.label} {...props} >
		<span>{i18next.t( 'admin_settings:'+props.data.label )}</span>
	</components.MultiValue> );
};

const MultiSelectInputField = ({ name, options, placeholder, defaultValue, updateSettings }) => {
	const [ value, setValue ] = useState( defaultValue );
	const handleReset = useCallback( () => {
		setValue( defaultValue );
	}, [ defaultValue ] );
	const handleConfirm = useCallback( () => {
		const languageCodes = value.map( x => x.value );
		updateSettings( name, languageCodes );
	}, [ updateSettings, name, value ] );
	return (
		<Form.Group style={{ marginBottom: 0 }} >
			<SelectInput
				value={value}
				name={name}
				options={options}
				placeholder={placeholder}
				updateSettings={updateSettings}
				onChange={setValue}
				isMulti
				isClearable={false}
				components={{ Option, MultiValue }}
				styles={{
					container: ( provided, state ) => ({
						...provided,
						width: '82%',
						float: 'left'
					})
				}}
			/>
			{ !deepEqual( value, defaultValue ) ?
				<Fragment>
					<Button
						onClick={handleConfirm}
						variant="success" size="sm" style={{ marginRight: 6, marginLeft: 8 }}
					>
						<i className="fas fa-check" />
					</Button>
					<Button
						onClick={handleReset}
						variant="warning" size="sm" style={{ width: 32 }}
					>
						<i className="fas fa-times" />
					</Button>
				</Fragment> : null
			}
		</Form.Group>
	);
};


// MAIN //

class ConfigurationPage extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			selected: 'main'
		};
	}

	componentDidMount() {
		this.props.getSettings();
	}

	handleSelect = ( key ) => {
		this.setState({
			selected: key
		});
	}

	renderMain() {
		const { admin, t, updateSettings } = this.props;
		let availableLanguages = admin.settings.availableLanguages;
		if ( !availableLanguages ) {
			availableLanguages = LANGUAGES;
		} else {
			availableLanguages = availableLanguages.map( x => ({ label: languageLabel( x ), value: x }) );
		}
		return (
			<Container style={{ float: 'left' }} >
				<Form.Group as={Row} controlId="formPlaintextTitle" >
					<Form.Label column sm={2} >
						{t('title')}
					</Form.Label>
					<Col sm={5} >
						<InputField
							name="siteTitle"
							key={admin.settings.siteTitle}
							type="text"
							defaultValue={admin.settings.siteTitle}
							updateSettings={updateSettings}
						/>
					</Col>
					<Col sm={5} >
						<Form.Text muted >
							{t('title-description')}
						</Form.Text>
					</Col>
				</Form.Group>
				<Form.Group as={Row} controlId="formPlaintextDescription">
					<Form.Label column sm={2} >
						{t('site-description')}
					</Form.Label>
					<Col sm={5} >
						<InputField
							name="siteDescription"
							key={admin.settings.siteDescription}
							type="text"
							defaultValue={admin.settings.siteDescription}
							updateSettings={updateSettings}
						/>
					</Col>
					<Col sm={5} >
						<Form.Text muted >
							{t('site-description-description')}
						</Form.Text>
					</Col>
				</Form.Group>
				<FormGroup as={Row} >
					<Form.Label column sm={2} >
						{t('default-language')}
					</Form.Label>
					<Col sm={5} >
						<SelectInputField
							name="defaultLanguage"
							defaultValue={admin.settings.defaultLanguage}
							updateSettings={updateSettings}
						>
							<option value="en">English - EN</option>
							<option value="bg">Български - BG</option>
							<option value="cs">Česky - CS</option>
							<option value="da">Dansk - DA</option>
							<option value="el">Ελληνική - EL</option>
							<option value="es">Español - ES</option>
							<option value="et">Eesti - ET</option>
							<option value="de">Deutsch - DE</option>
							<option value="fi">Suomalainen - FI</option>
							<option value="fr">Français - FR</option>
							<option value="hu">English - HU</option>
							<option value="it">Italiano - IT</option>
							<option value="ja">にほんご - JA</option>
							<option value="lt">Lietuvių kalba - LT</option>
							<option value="lv">Latviešu - LV</option>
							<option value="nl">Nederlands - NL</option>
							<option value="pl">Polski - PL</option>
							<option value="pt">Porgtugês - PT</option>
							<option value="ro">Românesc - RO</option>
							<option value="ru">русский - RU</option>
							<option value="sk">Slovenská - SK</option>
							<option value="sl">Slovenski - SL</option>
							<option value="sv">Svenska - SV</option>
							<option value="zh">中文 - ZH</option>
						</SelectInputField>
					</Col>
					<Col sm={5} >
						<Form.Text muted >
							{t('default-language-description')}
						</Form.Text>
					</Col>
				</FormGroup>
				<Form.Group as={Row} controlId="availableLanguages" >
					<Form.Label column sm={2} >
						{t('available-languages')}
					</Form.Label>
					<Col sm={5} >
						<MultiSelectInputField
							name="availableLanguages"
							defaultValue={availableLanguages}
							options={LANGUAGES}
							updateSettings={updateSettings}
							placeholder={i18next.t('admin_settings:available-languages')}
						/>
					</Col>
					<Col sm={5} >
						<Form.Text muted >
							{t('available-languages-description')}
						</Form.Text>
					</Col>
				</Form.Group>
			</Container>
		);
	}

	renderLogin() {
		const { admin, t, updateSettings } = this.props;
		return (
			<Container style={{ float: 'left' }} >
				<Form.Group as={Row} controlId="formRegistrations" >
					<Form.Label column sm={4} >
						{t('allow-new-registrations')}
					</Form.Label>
					<Col sm={8} >
						<CheckboxInput
							name="allowUserRegistrations"
							label={t('allow-new-registrations-description')}
							defaultValue={admin.settings.allowUserRegistrations}
							updateSettings={updateSettings}
						/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} controlId="permittedEmailDomains" >
					<Form.Label column sm={4} >
						{t('permitted-email-domains')}
					</Form.Label>
					<Col sm={4} >
						<TextSelectField
							name="permittedEmailDomains"
							key={admin.settings.permittedEmailDomains}
							placeholder={t('permitted-email-domains')}
							defaultValue={admin.settings.permittedEmailDomains}
							updateSettings={updateSettings}
						/>
					</Col>
					<Col sm={4} >
						<Form.Text muted >
							{t('permitted-email-domains-description')}
						</Form.Text>
					</Col>
				</Form.Group>
				<Form.Group as={Row} controlId="disallowedEmailDomains" >
					<Form.Label column sm={4} >
						{t('disallowed-email-domains')}
					</Form.Label>
					<Col sm={4} >
						<TextSelectField
							name="disallowedEmailDomains"
							key={admin.settings.disallowedEmailDomains}
							placeholder={t('disallowed-email-domains')}
							defaultValue={admin.settings.disallowedEmailDomains}
							updateSettings={updateSettings}
						/>
					</Col>
					<Col sm={4} >
						<Form.Text muted >
							{t('disallowed-email-domains-description')}
						</Form.Text>
					</Col>
				</Form.Group>
				<Form.Group as={Row} controlId="reservedUserNames" >
					<Form.Label column sm={4} >
						{t('reserved-user-names')}
					</Form.Label>
					<Col sm={4} >
						<TextSelectField
							name="reservedUserNames"
							key={admin.settings.reservedUserNames}
							placeholder={t('reserved-user-names')}
							defaultValue={admin.settings.reservedUserNames}
							updateSettings={updateSettings}
						/>
					</Col>
					<Col sm={4} >
						<Form.Text muted >
							{t('reserved-user-names-description')}
						</Form.Text>
					</Col>
				</Form.Group>
			</Container>
		);
	}

	renderRateLimits() {
		const { admin, t, updateSettings } = this.props;
		return (
			<Container style={{ float: 'left' }} >
				<Form.Group as={Row} controlId="rateLimitNamespaceCreation" >
					<Form.Label column sm={5} >
						{t('create-namespaces-per-hour')}
					</Form.Label>
					<Col sm={2} >
						<InputField
							name="rateLimitNamespaceCreation"
							type="number"
							defaultValue={admin.settings.rateLimitNamespaceCreation}
							updateSettings={updateSettings}
						/>
					</Col>
					<Col sm={5} >
						<Form.Text muted >
							{t('create-namespaces-per-hour-description')}
						</Form.Text>
					</Col>
				</Form.Group>
				<Form.Group as={Row} controlId="rateLimitUserCreation" >
					<Form.Label column sm={5} >
						{t('create-users-per-hour')}
					</Form.Label>
					<Col sm={2} >
						<InputField
							name="rateLimitUserCreation"
							type="number"
							defaultValue={admin.settings.rateLimitUserCreation}
							updateSettings={updateSettings}
						/>
					</Col>
					<Col sm={5} >
						<Form.Text muted >
							{t('create-users-per-hour-description')}
						</Form.Text>
					</Col>
				</Form.Group>
				<Form.Group as={Row} controlId="rateLimitBackupCreation" >
					<Form.Label column sm={5} >
						{t('create-backups-per-day')}
					</Form.Label>
					<Col sm={2} >
						<InputField
							name="rateLimitBackupCreation"
							type="number"
							defaultValue={admin.settings.rateLimitBackupCreation}
							updateSettings={updateSettings}
						/>
					</Col>
					<Col sm={5} >
						<Form.Text muted >
							{t('create-backups-per-day-description')}
						</Form.Text>
					</Col>
				</Form.Group>
			</Container>
		);
	}

	render() {
		const { admin, user, t } = this.props;
		console.log( user.email );
		let content;
		if ( admin.settings ) {
			switch ( this.state.selected ) {
				case 'main':
					content = this.renderMain();
				break;
				case 'login':
					content = this.renderLogin();
				break;
				case 'rate-limits':
					content = this.renderRateLimits();
				break;
			}
		}
		return (
			<div className="admin-settings-outer-container" >
				<Row>
					<Col sm={2} >
						<Nav
							activeKey={this.state.selected}
							className="admin-settings-configuration-nav flex-column"
							onSelect={this.handleSelect}
						>
							<Nav.Link eventKey="main" >
								{t('main')}
							</Nav.Link>
							<Nav.Link eventKey="login" >
								{t('login')}
							</Nav.Link>
							<Nav.Link eventKey="rate-limits" >
								{t('rate-limits')}
							</Nav.Link>
						</Nav>
					</Col>
					<Col sm={10} >
						{content}
					</Col>
				</Row>
			</div>
		);
	}
}


// PROPERTIES //

ConfigurationPage.propTypes = {
	admin: PropTypes.object,
	getSettings: PropTypes.func.isRequired,
	updateSettings: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

ConfigurationPage.defaultProps = {
	admin: {}
};


// EXPORTS //

export default withTranslation( [ 'admin_settings', 'common' ] )( ConfigurationPage );
