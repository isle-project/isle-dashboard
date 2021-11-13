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
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import './info_box.css';


// MAIN //

/**
* Renders an info box.
*
* @param {Object} props - component properties
* @param {string} props.header - header text
* @param {boolean} props.body - body text
* @returns {ReactElement} component
*/
const InfoBox = ({ header, body }) => {
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

InfoBox.propTypes = {
	body: PropTypes.string.isRequired,
	header: PropTypes.string.isRequired
};


// EXPORTS //

export default InfoBox;
