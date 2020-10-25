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


// MAIN //

function createCategoricalColumn({ Header, Cell, accessor, labels, maxWidth = 150 }) {
	let style;
	return {
		Header,
		accessor,
		style,
		Cell,
		filterMethod: ( filter, row ) => {
			if ( filter.value === 'all' ) {
				return true;
			}
			const id = filter.pivotId || filter.id;
			if ( row[ id ] === void 0 ) {
				return true;
			}
			return String( row[ id ] ) === filter.value;
		},
		Filter: ({ filter, onChange }) => {
			const handleChange = ( event ) => {
				const newValue = event.target.value;
				onChange( newValue );
			};
			let value;
			if ( !filter ) {
				value = 'all';
			} else {
				value = filter.value;
			}
			return (
				<select
					onBlur={handleChange} onChange={handleChange}
					style={{ width: '100%', backgroundColor: 'ghostwhite' }}
					value={value}
				>
					<option value="all">Show All</option>
					{labels.map( ( x, idx ) => <option value={x} key={idx} >{x}</option> )}
				</select>
			);
		},
		maxWidth: maxWidth
	};
}


// EXPORTS //

export default createCategoricalColumn;
