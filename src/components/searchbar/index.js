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
import { withTranslation } from 'react-i18next';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';


// MAIN //

const SearchBar = ( props ) => {
	return (
		<FormGroup style={{ width: '14vw', minWidth: '120px', float: 'left', marginBottom: '4px', marginRight: '5px', ...props.style }}>
			<InputGroup>
				<FormControl
					className="header-bar-search"
					type="text"
					placeholder={props.placeholder}
					value={props.value}
					onChange={props.onChange}
					aria-label={props.t('search-field')}
					style={{ height: '38px' }}
				/>
					<InputGroup.Append>
						<Button aria-label={props.t('search-field-icon')} disabled variant="secondary" style={{ cursor: 'auto' }}>
							<i className="fa fa-search"></i>
						</Button>
					</InputGroup.Append>
			</InputGroup>
		</FormGroup>
	);
};


// EXPORTS //

export default withTranslation( [ 'header_bar', 'common' ] )( SearchBar );
