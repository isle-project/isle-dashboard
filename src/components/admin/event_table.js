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

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ReactTable from 'react-table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import server from 'constants/server';
import createBooleanColumn from './create_boolean_column.js';
import 'react-table/react-table.css';


// MAIN //

class EventTable extends Component {
	constructor( props ) {
		super( props );
		this.columns = this.createColumns();
	}

	componentDidMount() {
		this.props.getEvents();
	}

	createColumns = () => {
		const { t } = this.props;
		return [
			{
				Header: t('common:type'),
				id: 'type',
				accessor: 'type',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' }
			},
			{
				Header: t( 'time' ),
				accessor: 'time',
				style: { marginTop: '2px', color: 'darkslategrey' },
				Cell: ( row ) => {
					if ( row.value ) {
						return new Date( row.value ).toLocaleString();
					}
					return null;
				},
				maxWidth: 150
			},
			{
				Header: t( 'data' ),
				accessor: 'data',
				style: { marginTop: '2px', color: 'darkslategrey', fontSize: 24, textAlign: 'center', cursor: 'pointer' },
				Cell: ( row ) => {
					if ( row.value ) {
						const popover = <Popover id="popover-data" style={{ maxWidth: 400 }}>
							<Popover.Title as="h3">Data</Popover.Title>
							<Popover.Content style={{ backgroundColor: 'lightblue' }} >
								<pre>{JSON.stringify( row.value, null, 2 )}
								</pre>
							</Popover.Content>
						</Popover>;
						return (
							<OverlayTrigger trigger="click" placement="right" overlay={popover}>
								<i className="data-icon fas fa-tablet-alt"></i>
							</OverlayTrigger>
						);
					}
					return null;
				},
				maxWidth: 120
			},
			createBooleanColumn({
				Header: t('done'),
				accessor: 'done',
				trueLabel: t('done'),
				falseLabel: t('not-done')
			}),
			{
				Header: 'Pic',
				accessor: 'user.picture',
				Cell: ( row ) => {
					return <img className="table-pic" src={`${server}/thumbnail/${row.value}`} alt="Profile Pic" />;
				},
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 46,
				minWidth: 46,
				filterable: false,
				resizable: false,
				sortable: false
			},
			{
				Header: t('common:name'),
				accessor: 'user.name',
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 150
			},
			{
				Header: t('common:email'),
				accessor: 'user.email',
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 150
			},
			{
				Header: t('common:actions')
			}
		];
	}

	render() {
		return (
			<Fragment>
				<ReactTable
					filterable
					data={this.props.admin.events}
					columns={this.columns}
					ref={(r) => {
						this.reactTable = r;
					}}
				/>
			</Fragment>
		);
	}
}


// PROPERTIES //

EventTable.propTypes = {
	admin: PropTypes.object.isRequired,
	getEvents: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( EventTable );
