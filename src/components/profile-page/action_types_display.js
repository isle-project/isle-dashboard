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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import objectKeys from '@stdlib/utils/keys';


// MAIN //

class ActionTypesDisplay extends Component {
	shouldComponentUpdate( nextProps ) {
		if ( nextProps.selectedNamespaceID !== this.props.selectedNamespaceID ) {
			return true;
		}
		return false;
	}

	render() {
		const { selectedNamespace, lessonData: data } = this.props;
		if ( !selectedNamespace || !data ) {
			return null;
		}
		const lessons = selectedNamespace.lessons;
		if ( !lessons ) {
			return null;
		}
		const actionTypes = {};
		for ( let i = 0; i < lessons.length; i++ ) {
			const lesson = lessons[ i ];
			const id = lesson._id;
			if ( data[ id ] ) {
				const types = data[ id ].actionTypes;
				if ( types ) {
					const typeNames = objectKeys( types );
					for ( let j = 0; j < typeNames.length; j++ ) {
						const name = typeNames[ j ];
						if ( actionTypes[ name ] ) {
							actionTypes[ name ] += types[ name ];
						} else {
							actionTypes[ name ] = types[ name ];
						}
					}
				}
			}
		}
		const keys = objectKeys( actionTypes );
		const rows = new Array( keys.length );
		for ( let i = 0; i < keys.length; i++ ) {
			const type = keys[ i ];
			const count = actionTypes[ keys[ i ] ];
			rows[ i ] = <tr key={i}>
				<td>{type}</td>
				<td>{count}</td>
			</tr>;
		}
		return ( <Table size="sm" striped style={{ fontSize: '0.8rem' }}>
			<thead>
				<tr>
					<th>Action Type</th>
					<th>Count</th>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</Table> );
	}
}


// PROPERTIES //

ActionTypesDisplay.propTypes = {
	lessonData: PropTypes.object,
	selectedNamespace: PropTypes.object,
	selectedNamespaceID: PropTypes.string
};

ActionTypesDisplay.defaultProps = {
	lessonData: null,
	selectedNamespace: null,
	selectedNamespaceID: ''
};


// EXPORTS //

export default ActionTypesDisplay;
