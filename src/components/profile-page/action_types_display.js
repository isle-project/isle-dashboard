// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
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
				const namespace = data[ id ].namespace;
				const types = data[ id ].actionTypes;
				if ( namespace === this.props.selectedNamespaceID && types ) {
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
		return ( <Table size="sm" striped >
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
	selectedNamespace: PropTypes.object
};

ActionTypesDisplay.defaultProps = {
	lessonData: null,
	selectedNamespace: null
};


// EXPORTS //

export default ActionTypesDisplay;
