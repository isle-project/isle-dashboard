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
import logger from 'debug';
import { withTranslation } from 'react-i18next';
import ReactTable from 'react-table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import server from 'constants/server';
import ConfirmModal from 'components/confirm-modal';
import createBooleanColumn from './create_boolean_column.js';
import createTextColumn from './create_text_column.js';
import createDateColumn from './create_date_column.js';
import 'react-table/react-table.css';


// VARIABLES //

const debug = logger( 'isle-dashboard:admin' );


// MAIN //

class EventTable extends Component {
	constructor( props ) {
		super( props );
		this.columns = this.createColumns();

		this.state = {
			showDeleteModal: false,
			selectedEvent: null
		};
	}

	componentDidMount() {
		this.props.getEvents();
	}

	createColumns = () => {
		const { t } = this.props;
		return [
			createTextColumn({
				Header: t('common:type'),
				id: 'type',
				accessor: 'type',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' }
			}),
			createDateColumn({
				Header: t( 'common:time' ),
				accessor: 'time',
				style: { marginTop: '2px', color: 'darkslategrey' },
				maxWidth: 150
			}),
			{
				Header: t( 'common:data' ),
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
				maxWidth: 120,
				resizable: false,
				filterable: false,
				sortable: false
			},
			createBooleanColumn({
				Header: t('common:done'),
				accessor: 'done',
				trueLabel: t('common:done'),
				falseLabel: t('common:not-done')
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
			createTextColumn({
				Header: t('common:name'),
				accessor: 'user.name',
				style: { marginTop: '8px', color: 'darkslategrey' }
			}),
			createTextColumn({
				Header: t('common:email'),
				accessor: 'user.email',
				style: { marginTop: '8px', color: 'darkslategrey' }
			}),
			{
				Header: t('common:actions'),
				Cell: ( row ) => {
					return ( <div>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="delete_event">{t('namespace:delete-event')}</Tooltip>}>
							<Button
								variant="outline-secondary"
								style={{ marginLeft: 8 }}
								onClick={this.askToDeleteSelectedEventFactory( row.row._original )}
								aria-label={t('namespace:delete-event')}
							>
								<div className="fa fa-trash-alt" />
							</Button>
						</OverlayTrigger>
					</div> );
				},
				resizable: false,
				filterable: false,
				sortable: false
			}
		];
	}

	askToDeleteSelectedEventFactory = ( event ) => {
		return () => {
			this.setState({
				showDeleteModal: !this.state.showDeleteModal,
				selectedEvent: event
			});
		};
	}

	deleteSelectedEvent = () => {
		this.setState({
			showDeleteModal: false
		}, async () => {
			debug( `Delete event with id ${this.state.selectedEvent._id}...` );
			await this.props.deleteEvent( this.state.selectedEvent._id );

			debug( 'Retrieve events from server...' );
			this.props.getEvents();
		});
	}

	toggleDeleteModal = () => {
		this.setState({
			showDeleteModal: !this.state.showDeleteModal
		});
	}


	render() {
		const { t } = this.props;
		return (
			<Fragment>
				<ReactTable
					filterable
					data={this.props.admin.events}
					columns={this.columns}
					ref={(r) => {
						this.reactTable = r;
					}}
					previousText={t('common:previous')}
					nextText={t('common:next')}
					loadingText={t('common:loading')}
					noDataText={t('common:no-rows-found')}
					pageText={t('common:page')}
					ofText={t('common:of')}
					rowsText={t('common:rows')}
				/>
				{ this.state.showDeleteModal ? <ConfirmModal
					title={t('lesson:delete-event')}
					message={<span>{t('namespace:delete-event-confirm')}</span>}
					close={this.toggleDeleteModal}
					show={this.state.showDeleteModal}
					onConfirm={this.deleteSelectedEvent}
				/> : null }
			</Fragment>
		);
	}
}


// PROPERTIES //

EventTable.propTypes = {
	admin: PropTypes.object.isRequired,
	deleteEvent: PropTypes.func.isRequired,
	getEvents: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( EventTable );
