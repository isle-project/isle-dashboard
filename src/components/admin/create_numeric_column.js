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

import React from 'react';
import InputRange from 'react-input-range';
import roundn from '@stdlib/math/base/special/roundn';
import 'css/input_range.css';


// FUNCTIONS //

const defaultFilterMethod = ( filter, row ) => {
	const id = filter.pivotId || filter.id;
	const val = row[ id ];
	return val >= filter.value.min && val <= filter.value.max;
};

const defaultFormatLabel = ( value ) => roundn( value, -2 );


// MAIN //

function createNumericColumn({ Header, accessor, Cell, minValue = 0, maxValue = 1, maxWidth = 150, filterMethod, formatLabel }) {
	return {
		Header: <span id={Header} >{Header}</span>,
		accessor,
		Cell: Cell ? Cell : ( row ) => row.value ? `${roundn( row.value, -3 )}` : 'NA',
		filterMethod: filterMethod || defaultFilterMethod,
		Filter: ({ filter, onChange }) => {
			if ( minValue === maxValue ) {
				maxValue = minValue += 1;
			}
			const defaultVal = {
				max: maxValue,
				min: minValue
			};
			return (
				<div style={{
					paddingLeft: '4px',
					paddingRight: '4px',
					paddingTop: '8px'
				}}>
					<InputRange
						ariaLabelledby={Header}
						ariaControls="dashboard-table"
						allowSameValues
						maxValue={maxValue}
						minValue={minValue}
						step={0.1}
						value={filter ? filter.value : defaultVal}
						onChange={( newValue ) => {
							onChange( newValue );
						}}
						formatLabel={formatLabel || defaultFormatLabel}
					/>
				</div>
			);
		},
		maxWidth: maxWidth
	};
}


// EXPORTS //

export default createNumericColumn;
