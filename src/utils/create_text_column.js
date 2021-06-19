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
import FormControl from 'react-bootstrap/FormControl';
import textFilter from './text_filter.js';


// MAIN //

function createTextColumn({ id, Header, Cell, accessor, maxWidth = 150, minWidth, filterMethod }) {
	if ( minWidth > maxWidth ) {
		maxWidth = minWidth;
	}
	const spec = {
		id,
		Header,
		accessor,
		Cell,
		filterMethod: filterMethod ? filterMethod : textFilter,
		Filter: ({ filter, onChange }) => {
			return (
				<FormControl
					aria-label={Header}
					autoComplete="none"
					onChange={( event ) => {
						onChange( event.target.value );
					}}
				/>
			);
		}
	};
	if ( maxWidth ) {
		spec.maxWidth = maxWidth;
	}
	if ( minWidth ) {
		spec.minWidth = minWidth;
	}
	return spec;
}


// EXPORTS //

export default createTextColumn;
