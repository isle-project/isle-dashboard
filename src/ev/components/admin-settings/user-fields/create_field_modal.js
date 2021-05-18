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

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import SelectInput from 'react-select';
import Button from 'react-bootstrap/Button';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormCheck from 'react-bootstrap/FormCheck';
import Modal from 'react-bootstrap/Modal';
import TextSelect from 'components/text-select';


// VARIABLES //

const INPUT_TYPES = [
	{ value: 'text', label: 'Text' },
	{ value: 'dropdown', label: 'Dropdown' },
	{ value: 'checkbox', label: 'Checkbox' }
];


// MAIN //

class CreateFieldModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			name: '',
			description: '',
			type: INPUT_TYPES[ 0 ],
			options: [],
			showOnProfile: false,
			editableOnSignup: false,
			editableOnProfile: false
		};
	}

	createCustomField = () => {
		const field = {
			name: this.state.name,
			description: this.state.description,
			type: this.state.type.value,
			position: this.props.customFields.length,
			showOnProfile: this.state.showOnProfile,
			editableOnSignup: this.state.editableOnSignup,
			editableOnProfile: this.state.editableOnProfile
		};
		if ( field.type === 'dropdown' ) {
			field.options = this.state.options.map( x => x.value );
		}
		this.props.createCustomField( field );
		this.props.onHide();
	}

	handleInputChange = ( event ) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[ name ]: value
		});
	}

	handleCheckboxChangeFactory = ( name ) => {
		return ( event ) => {
			this.setState({
				[ name ]: event.target.checked
			});
		};
	}

	render() {
		const t = this.props.t;
		const { name, description } = this.state;
		const validName = name.length >= 3;
		const validDescription = description.length >= 3;
		return (
			<Fragment>
				<Modal show={this.props.show} onHide={this.props.onHide} >
					<Modal.Header closeButton >
						<Modal.Title as="h3" style={{ width: '100%' }}>
							{t('admin_settings:create-user-field')}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<FormGroup controlId="formFieldName" >
							<FormLabel>{t('field-name')}</FormLabel>
							<FormControl
								name="name"
								type="text" placeholder={t('enter-field-name')}
								defaultValue={name}
								onChange={this.handleInputChange}
								isInvalid={!validName}
							/>
							<FormControl.Feedback type="invalid" >
								{t('invalid-name')}
							</FormControl.Feedback>
						</FormGroup>
						<FormGroup controlId="formFieldDescription" >
							<FormLabel>{t('field-description')}</FormLabel>
							<FormControl
								name="description"
								type="text" placeholder={t('enter-field-description')}
								defaultValue={description}
								onChange={this.handleInputChange}
								isInvalid={!validDescription}
							/>
							<FormControl.Feedback type="invalid" >
								{t('invalid-description')}
							</FormControl.Feedback>
						</FormGroup>
						<FormGroup controlId="formFieldType" >
							<FormLabel>{t('field-type')}</FormLabel>
							<SelectInput
								options={INPUT_TYPES}
								defaultValue={this.state.type}
								onChange={( elem ) => {
									this.setState({
										type: elem
									});
								}}
							/>
							{ this.state.type.value === 'dropdown' ?
								<TextSelect
									placeholder={t('create-dropdown-options')}
									options={this.state.options}
									onChange={( options ) => {
										this.setState({
											options
										});
									}}
								/> : null }
						</FormGroup>
						<FormGroup>
							<FormCheck
								type="checkbox"
								label={t('editable-on-signup')}
								defaultChecked={false}
								onChange={( event ) => {
									this.setState({
										editableOnSignup: !this.state.editableOnSignup
									});
								}}
							/>
						</FormGroup>
						<FormGroup>
							<FormCheck
								type="checkbox"
								label={t('show-on-profile')}
								defaultChecked={false}
								onChange={( event ) => {
									this.setState({
										showOnProfile: !this.state.showOnProfile
									});
								}}
							/>
						</FormGroup>
						<FormGroup>
							<FormCheck
								type="checkbox"
								label={t('editable-on-profile')}
								defaultChecked={false}
								onChange={( event ) => {
									this.setState({
										editableOnProfile: !this.state.editableOnProfile
									});
								}}
							/>
						</FormGroup>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.props.onHide} >
							{t('common:cancel')}
						</Button>
						<Button
							variant="success" onClick={this.createCustomField}
							disabled={!validName || !validDescription}
						>
							{t('common:create')}
						</Button>
					</Modal.Footer>
				</Modal>
			</Fragment>
		);
	}
}


// PROPERTIES //

CreateFieldModal.propTypes = {
	createCustomField: PropTypes.func.isRequired,
	customFields: PropTypes.array,
	onHide: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	t: PropTypes.func.isRequired
};

CreateFieldModal.defaultProps = {
	customFields: []
};


// EXPORTS

export default CreateFieldModal;
