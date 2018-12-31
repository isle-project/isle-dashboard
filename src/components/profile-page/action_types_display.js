// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import objectKeys from '@stdlib/utils/keys';


// MAIN //

class ActionTypesDisplay extends Component {
	render() {
		let table;
		const actionTypes = this.props.actionTypes;
		if ( actionTypes ) {
			const keys = objectKeys( actionTypes );
			const rows = new Array( keys.length );
			for ( let i = 0; i < keys.length; i++ ) {
				const type = keys[ i ];
				const count = actionTypes[ keys[ i ] ];
				rows[ i ] = <tr>
					<td>{type}</td>
					<td>{count}</td>
				</tr>;
			}
			table = <Table>
				<thead>
					<tr>
						<th>Action</th>
						<th>Count</th>
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</Table>;
		}
		return ( <div>
			{table}
		</div> );
	}
}


// PROPERTIES //

ActionTypesDisplay.propTypes = {
	actionTypes: PropTypes.object
};

ActionTypesDisplay.defaultProps = {
	actionTypes: null
};


// EXPORTS //

export default ActionTypesDisplay;
