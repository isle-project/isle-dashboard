// MODULES //

import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import SelectInput from 'react-select';
import Form from 'react-bootstrap/Form';
import 'react-datetime-picker/dist/DateTimePicker.css';


// FUNCTIONS //

function selectOption( value, transform ) {
	return {
		label: transform ? transform(value) : value,
		value: value
	};
}

function convertRuleParam( value, parameter ) {
	switch ( parameter.type ) {
		case 'number':
			return parseFloat( value );
		case 'datetime':
			return value.getTime();
		case 'string':
		case 'enum':
		case 'text':
		default:
			return value;
	}
}


// MAIN //

function ParameterInput({ parameter, onChange, t, value, ...rest }) {
	const { type, name, values } = parameter;
	switch ( type ) {
		case 'number':
		case 'text':
			return (
				<Form.Control
					key={`${name}-param`}
					name={name}
					type={type}
					placeholder={t('enter-parameter-value')}
					onChange={( event ) => {
						onChange( event.target.value );
					}}
					value={value}
					{...rest}
				/>
			);
		case 'enum':
			return (
				<SelectInput
					key={`${name}-param`}
					onChange={( elem ) => {
						onChange( elem ? elem.value : null );
					}}
					options={values.map( value => selectOption( value, t ) )}
					value={value ? selectOption( value, t ) : null}
					isDisabled={rest.disabled}
				/>
			);
		case 'datetime':
			return (
				<DateTimePicker
					onChange={( time ) => {
						onChange( time );
					}}
					clearIcon={null}
					value={value ? new Date( value ) : new Date()}
					{...rest}
				/>
			);
	}
}


// EXPORTS //

export default ParameterInput;

export const convertRuleParameter = convertRuleParam;
