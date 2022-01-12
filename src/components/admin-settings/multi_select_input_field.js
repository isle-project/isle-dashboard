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

import React, { Fragment, useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SelectInput, { components } from 'react-select';
import deepEqual from '@stdlib/assert/deep-equal';
import i18next from 'helpers/i18n';


// FUNCTIONS //

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


// MAIN //

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


// EXPORTS //

export default MultiSelectInputField;
