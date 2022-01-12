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


// MAIN //

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


// EXPORTS //

export default SelectInputField;
