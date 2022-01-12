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
import TextSelect from 'components/text-select';


// MAIN //

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


// EXPORTS //

export default TextSelectField;
