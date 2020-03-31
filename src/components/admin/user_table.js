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
import ReactTable from 'react-table';
import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';
import server from 'constants/server';
import 'react-table/react-table.css';


// MAIN //

class UserPage extends Component {
	constructor( props ) {
		super( props );
		this.columns = this.createColumns();
	}

	createColumns = () => {
		return [
			{
				Header: 'Pic',
				accessor: 'picture',
				Cell: row => (
					<img className="table-pic" src={`${server}/thumbnail/${row.original.picture}`} alt="Profile Pic" />
				),
				maxWidth: 46,
				minWidth: 46,
				filterable: false,
				resizable: false,
				sortable: false,
				style: { color: 'darkslategrey' }
			},
			{
				Header: 'First',
				id: 'first_name',
				accessor: 'firstName',
				maxWidth: 75,
				style: { marginTop: '8px', color: 'darkslategrey' },
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			},
			{
				Header: 'Last',
				id: 'last_name',
				accessor: 'lastName',
				maxWidth: 75,
				style: { marginTop: '8px', color: 'darkslategrey' },
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			},
			{
				Header: 'email',
				accessor: 'email',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' },
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			},
			{
				Header: 'Last Updated',
				accessor: 'updatedAt',
				Cell: ( row ) => {
					if ( row.value && row.value.toLocaleDateString ) {
						return row.value.toLocaleDateString( 'en-US' );
					}
					return '';
				},
				maxWidth: 120
			}
		];
	}

	render() {
		return (
			<ReactTable
				filterable
				data={[]}
				columns={this.columns}
				ref={(r) => {
					this.reactTable = r;
				}}
			/>
		);
	}
}


// PROPERTIES //

UserPage.propTypes = {
};


// EXPORTS //

export default UserPage;
