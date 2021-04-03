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
import TextSelect from 'components/text-select';


// FUNCTIONS //

const InputField = ({ name, defaultValue, type, updateSettings }) => {
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

const TextSelectField = ( props ) => {
	const [ value, setValue ] = useState( props.defaultValue );
	const handleChange = useCallback( ( newValue ) => {
		console.log( newValue );
		setValue( newValue );
	}, [] );
	const handleReset = useCallback( () => {
		setValue( props.defaultValue );
	}, [] );
	return (
		<Fragment>
			<TextSelect
				placeholder={props.placeholder}
				defaultValue={value}
				onChange={handleChange}
				styles={{
					control: () => ({
						width: 'calc(100% - 78px)'
					})
				}}
			/>
			{ value !== props.defaultValue ?
				<Fragment>
					<Button variant="success" size="sm" style={{ marginRight: 6, marginLeft: 8 }} >
						<i className="fas fa-check" />
					</Button>
					<Button variant="warning" size="sm" style={{ width: 32 }} onClick={handleReset} >
						<i className="fas fa-times" />
					</Button>
				</Fragment> : null
			}
		</Fragment>
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
		console.log( admin.settings );
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
							<option value="en" >English - EN</option>
							<option value="es" >Español - ES</option>
							<option value="de" >Deutsch - DE</option>
							<option value="fr" >Français - FR</option>
							<option value="it" >Italiano - IT</option>
							<option value="ja" >にほんご - JA</option>
							<option value="nl" >Nederlands - NL</option>
							<option value="pt" >Porgtugês - PT</option>
							<option value="pl" >Polski - PL</option>
							<option value="ru" >русский - RU</option>
							<option value="zh">中文 - ZH</option>
						</SelectInputField>
					</Col>
					<Col sm={5} >
						<Form.Text muted >
							{t('default-language-description')}
						</Form.Text>
					</Col>
				</FormGroup>
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
				<Form.Group as={Row} controlId="formRegistrations" >
					<Form.Label column sm={4} >
						{t('permitted-email-domains')}
					</Form.Label>
					<Col sm={4} >
						<TextSelectField
							placeholder={t('permitted-email-domains')}
							defaultValue={this.state.members}
						/>
					</Col>
					<Col sm={4} >
						<Form.Text muted >
							{t('permitted-email-domains-description')}
						</Form.Text>
					</Col>
				</Form.Group>
				<Form.Group as={Row} controlId="formRegistrations" >
					<Form.Label column sm={4} >
						{t('disallowed-email-domains')}
					</Form.Label>
					<Col sm={4} >
						<TextSelectField
							placeholder={t('disallowed-email-domains')}
							defaultValue={this.state.members}
						/>
					</Col>
					<Col sm={4} >
						<Form.Text muted >
							{t('disallowed-email-domains-description')}
						</Form.Text>
					</Col>
				</Form.Group>
			</Container>
		);
	}

	renderRateLimits() {
		const { t } = this.props;
		return (
			<Container style={{ float: 'left' }} >
				<Form.Group as={Row} controlId="formRegistrations" >
					<Form.Label column sm={5} >
						{t('create-namespaces-per-hour')}
					</Form.Label>
					<Col sm={2} >
						<InputField type="number" defaultValue="" />
					</Col>
					<Col sm={5} >
						<Form.Text muted >
							{t('create-namespaces-per-hour-description')}
						</Form.Text>
					</Col>
				</Form.Group>
				<Form.Group as={Row} controlId="formRegistrations" >
					<Form.Label column sm={5} >
						{t('create-users-per-hour')}
					</Form.Label>
					<Col sm={2} >
						<InputField type="number" defaultValue="" />
					</Col>
					<Col sm={5} >
						<Form.Text muted >
							{t('create-users-per-hour-description')}
						</Form.Text>
					</Col>
				</Form.Group>
				<Form.Group as={Row} controlId="formRegistrations" >
					<Form.Label column sm={5} >
						{t('create-backups-per-day')}
					</Form.Label>
					<Col sm={2} >
						<InputField type="number" defaultValue="" />
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
		const { user, t } = this.props;
		console.log( user.email );
		let content;
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
	admin: PropTypes.object.isRequired,
	getSettings: PropTypes.func.isRequired,
	updateSettings: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin_settings', 'common' ] )( ConfigurationPage );
