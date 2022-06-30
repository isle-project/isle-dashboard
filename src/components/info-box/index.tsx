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

import React, { ReactElement } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Card from 'react-bootstrap/Card';
import './info_box.css';


// VARIABLES //

const InfoBoxPropTypes = {
	body: PropTypes.string.isRequired,
	header: PropTypes.string.isRequired
};


// MAIN //

/**
* Renders an info box.
*
* @param props - component properties
* @param props.header - header text
* @param props.body - body text
* @returns component
*/
const InfoBox = ({ header, body }: InferProps<typeof InfoBoxPropTypes>): ReactElement => {
	return (
		<div className="info-box" >
			<Card>
				<Card.Header as="h1" style={{ textAlign: 'center' }} >
					<img src="img/isle_logo.svg" alt="ISLE Logo" />
					{header}
				</Card.Header>
				<Card.Body>
					{body}
				</Card.Body>
			</Card>
		</div>
	);
};


// PROPERTIES //

InfoBox.propTypes = InfoBoxPropTypes;


// EXPORTS //

export default InfoBox;
