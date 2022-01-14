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

const InputField = ({ name, defaultValue, type, updateSettings, t }) => {
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
						aria-label={t('common:confirm')}
						onClick={handleConfirm}
						variant="success" size="sm" style={{ marginRight: 6, marginLeft: 8 }}
					>
						<i className="fas fa-check" />
					</Button>
					<Button
						aria-label={t('common:reset')}
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

export default InputField;
