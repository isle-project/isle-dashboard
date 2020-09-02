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
import { withTranslation } from 'react-i18next';
import ReactTable from 'react-table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import isArray from '@stdlib/assert/is-array';
import objectKeys from '@stdlib/utils/keys';
import COLORS from 'constants/colors';
import createUsersColumn from './create_users_column.js';


// FUNCTIONS //

function groupReplacer( name, val ) {
	if ( name === 'joinTime' || name === 'exitTime' || name === 'picture' ) {
		return void 0;
	}
	return val;
}


// MAIN //

class Rooms extends Component {
	constructor( props ) {
		super( props );
		this.columns = this.createColumns();
	}

	componentDidMount() {
		this.props.getRooms();
	}

	createColumns = () => {
		const { t } = this.props;
		return [
			{
				Header: t('common:course'),
				id: 'namespace',
				maxWidth: 200,
				accessor: d => {
					return d.name.substring( 0, d.name.indexOf( '/' ) );
				},
				style: { marginTop: '8px', color: 'darkslategrey' }
			},
			{
				Header: t('common:lesson'),
				id: 'lesson',
				maxWidth: 200,
				accessor: d => {
					return d.name.substring( d.name.indexOf( '/' )+1 );
				},
				style: { marginTop: '8px', color: 'darkslategrey' }
			},
			{
				Header: t( 'common:time' ),
				accessor: 'startTime',
				style: { marginTop: '2px', color: 'darkslategrey' },
				Cell: ( row ) => {
					if ( row.value ) {
						return new Date( row.value ).toLocaleString();
					}
					return null;
				},
				maxWidth: 150
			},
			createUsersColumn({
				Header: t( 'admin:users' ),
				accessor: 'members',
				maxWidth: 400
			}),
			{
				Header: t( 'common:groups' ),
				accessor: 'groups',
				style: { marginTop: '2px', color: 'darkslategrey' },
				Cell: ( row ) => {
					if ( isArray( row.value ) ) {
						const groups = row.value;
						const out = new Array( groups.length );
						for ( let i = 0; i < groups.length; i++ ) {
							const group = groups[ i ];
							const popover = <Popover key={`groups-${i}`} id="popover-data" style={{ maxWidth: 400 }}>
								<Popover.Title as="h3">{group.name}</Popover.Title>
								<Popover.Content style={{ backgroundColor: 'lightblue' }} >
									<pre>{JSON.stringify( group, groupReplacer, 2 )}
									</pre>
								</Popover.Content>
							</Popover>;
							out[ i ] = (
								<OverlayTrigger trigger="click" placement="right" overlay={popover}>
									<span style={{
										cursor: 'pointer',
										backgroundColor: COLORS[ i % COLORS.length ],
										marginRight: 4,
										padding: 8,
										color: 'white',
										fontWeight: 700
									}}>{group.name}</span>
								</OverlayTrigger>
							);
						}
						return <Fragment>{out}</Fragment>;
					}
					return null;
				},
				maxWidth: 120
			},
			{
				Header: t( 'common:chats' ),
				accessor: 'chats',
				style: { marginTop: '2px', color: 'darkslategrey' },
				Cell: ( row ) => {
					if ( row.value ) {
						const chats = row.value;
						const keys = objectKeys( row.value );
						const out = new Array( keys.length );
						for ( let i = 0; i < keys.length; i++ ) {
							const key = keys[ i ];
							const chat = chats[ key ];
							const name = chat.name.substring( chat.name.indexOf( ':' )+1 );
							const popover = <Popover key={`chats-${i}`} id="popover-data" style={{ maxWidth: 400 }}>
								<Popover.Title as="h3">{name}</Popover.Title>
								<Popover.Content style={{ backgroundColor: 'lightblue' }} >
									<pre>{chat.messages.map( x => {
										return `${x.user}: ${x.content}`;
									}).join('\n' )}
									</pre>
								</Popover.Content>
							</Popover>;
							out[ i ] = (
								<OverlayTrigger trigger="click" placement="right" overlay={popover}>
									<span style={{
										cursor: 'pointer',
										backgroundColor: COLORS[ i % COLORS.length ],
										marginRight: 4,
										padding: 8,
										color: 'white',
										fontWeight: 700
									}}>{name}</span>
								</OverlayTrigger>
							);
						}
						return <Fragment>{out}</Fragment>;
					}
					return null;
				},
				maxWidth: 120
			}
		];
	}

	render() {
		console.log( this.props.admin.rooms )
		return (
			<Fragment>
				<ReactTable
					filterable
					data={this.props.admin.rooms}
					columns={this.columns}
					ref={(r) => {
						this.reactTable = r;
					}}
				/>
			</Fragment>
		);
	}
}


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( Rooms );
