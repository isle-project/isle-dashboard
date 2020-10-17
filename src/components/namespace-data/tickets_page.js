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
import logger from 'debug';
import { withTranslation } from 'react-i18next';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import 'css/table.css';
import 'css/input_range.css';
import './files_page.css';


// VARIABLES //

const debug = logger( 'isle:files-page' );


// MAIN //

class TicketsPage extends Component {
	constructor( props ) {
		super( props );
		this.columns = this.createColumns();
	}

	componentDidMount() {
		debug( 'Component did mount...' );
		console.log( this.props.namespace )
		this.props.getCourseTickets( this.props.namespace._id );
	}

	createColumns = () => {
		return [

		];
	}

	render() {
		return ( <div className="namespace-data-page">
			<ReactTable
				filterable
				data={this.props.tickets}
				columns={this.columns}
				ref={(r) => {
					this.reactTable = r;
				}}
			/>
		</div> );
	}
}


// PROPERTIES //

TicketsPage.propTypes = {
	getCourseTickets: PropTypes.func.isRequired,
	namespace: PropTypes.object.isRequired
};

TicketsPage.defaultProps = {
};


// EXPORTS //

export default withTranslation( [ 'namespace_data', 'common' ] )( TicketsPage );
