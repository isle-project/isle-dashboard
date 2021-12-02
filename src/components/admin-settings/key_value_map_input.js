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

import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


// MAIN //

/**
* Renders key-value pair inputs for the entries of a JSON object.
*
* @param {Object} props - component properties
* @param {Object} props.defaultValue - default value
* @param {Function} props.updateSettings - callback to update settings
* @returns {ReactElement} component
*/
const KeyValueMapInput = ({ name, defaultValue, updateSettings }) => {
	const [ values, setValues ] = useState( defaultValue );
	const [ newKey, setNewKey ] = useState( '' );
	const [ newValue, setNewValue ] = useState( '' );
	const { t } = useTranslation( 'common' );

	const handleChange = useCallback( ( event ) => {
		const { name, value } = event.target;
		setValues( {
			...values,
			[ name ]: value
		} );
		updateSettings( name, values );
	}, [ values, updateSettings ] );

	const handleKeyChange = useCallback( ( event ) => {
		const { value } = event.target;
		setNewKey( value );
	}, [] );

	const handleValueChange = useCallback( ( event ) => {
		const { value } = event.target;
		setNewValue( value );
	}, [] );

	const handleAdd = useCallback( () => {
		const key = newKey;
		const value = newValue;
		if ( key && value ) {
			const newValues = {
				...values,
				[ key ]: value
			};
			setValues( newValues );
			setNewKey( '' );
			setNewValue( '' );
			updateSettings( name, newValues );
		}
	}, [ name, values, newKey, newValue, updateSettings ] );

	const handleRemove = useCallback( ( event ) => {
		const { name } = event.target;
		const newValues = { ...values };
		delete newValues[ name ];
		setValues( newValues );
		updateSettings( name, newValues );
	}, [ values, updateSettings ] );

	return (
		<Container className="d-grid gap-2" >
			{Object.keys( values ).map( ( key, i ) => (
				<Row key={`${key}-{i}`} >
					<Col sm={4} >
						<FormControl
							type="text"
							name={key}
							value={key}
							onChange={handleChange}
						/>
					</Col>
					<Col sm={4} >
						<FormControl
							type="text"
							name={key}
							value={values[ key ]}
							onChange={handleChange}
						/>
					</Col>
					<Col sm={2} >
						<Button
							variant="danger"
							name={key}
							onClick={handleRemove}
						>
							{t('delete')}
						</Button>
					</Col>
				</Row>))}
			<Row>
				<Col sm={4} >
					<FormControl
						type="text"
						name="newKey"
						value={newKey}
						onChange={handleKeyChange}
					/>
				</Col>
				<Col sm={4} >
					<FormControl
						type="text"
						name="newValue"
						value={newValue}
						onChange={handleValueChange}
					/>
				</Col>
				<Col sm={2} >
					<Button
						variant="outline-primary"
						onClick={handleAdd}
					>
						{t('add')}
					</Button>
				</Col>
			</Row>
		</Container>
	);
};


// PROPERTIES //

KeyValueMapInput.propTypes = {
	defaultValue: PropTypes.object,
	name: PropTypes.string.isRequired,
	updateSettings: PropTypes.func
};

KeyValueMapInput.defaultProps = {
	defaultValue: {},
	updateSettings() {}
};


// EXPORTS //

export default KeyValueMapInput;
