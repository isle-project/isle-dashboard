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
import PropTypes, { InferProps } from 'prop-types';
import { useTranslation } from 'react-i18next';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';


// VARIABLES //

const SearchBarPropTypes = {
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
	style: PropTypes.object.isRequired,
	value: PropTypes.string.isRequired
};


// MAIN //

/**
* A search bar component.
*
* @param props - component properties
* @param props.onChange - callback to invoke upon changing the search bar value
* @param props.placeholder - placeholder text
* @param props.style - CSS styles
* @param props.value - search bar value
* @returns search bar component
*/
const SearchBar = ({ placeholder, value, style, onChange }: InferProps<typeof SearchBarPropTypes>) => {
	const { t } = useTranslation( [ 'header_bar', 'common' ] );
	return (
		<FormGroup style={{ width: '14vw', minWidth: '120px', float: 'left', marginBottom: '4px', marginRight: '5px', ...style }}>
			<InputGroup>
				<FormControl
					className="header-bar-search"
					type="text"
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					aria-label={t('search-field')}
					style={{ height: '38px' }}
				/>
				<Button aria-label={t('search-field-icon')} disabled variant="secondary" style={{ cursor: 'auto' }}>
					<i className="fa fa-search"></i>
				</Button>
			</InputGroup>
		</FormGroup>
	);
};


// PROPERTIES //

SearchBar.propTypes = SearchBarPropTypes;


// EXPORTS //

export default SearchBar;
