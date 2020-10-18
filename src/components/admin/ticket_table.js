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
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import PINF from '@stdlib/constants/math/float64-pinf';
import Tooltip from 'react-bootstrap/Tooltip';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import ConfirmModal from 'components/confirm-modal';
import server from 'constants/server';
import createBooleanColumn from './create_boolean_column.js';
import createTextColumn from './create_text_column.js';
import createDateColumn from './create_date_column.js';
import 'react-table/react-table.css';
import 'css/table.css';


// MAIN //

class TicketPage extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			showDeleteModal: false,
			deletionID: null,
			columns: this.createColumns()
		};
	}

	componentDidMount() {
		this.props.getAllTickets();
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.admin.tickets !== this.props.admin.tickets ) {
			this.setState({
				columns: this.createColumns()
			});
		}
	}

	handleDelete = () => {
		this.props.deleteTicket( this.state.deletionID );
		this.toggleDeleteModal();
	}

	toggleDeleteModal = () => {
		this.setState({
			showDeleteModal: !this.state.showDeleteModal
		});
	}

	askToDeleteSelectedTicketFactory = ( event ) => {
		return () => {
			this.setState({
				showDeleteModal: !this.state.showDeleteModal,
				selectedTicket: event
			});
		};
	}

	deleteSelectedTicket = () => {
		this.setState({
			showDeleteModal: false
		}, async () => {
			await this.props.deleteTicket( this.state.selectedTicket._id );
			this.props.getAllTickets();
		});
	}

	createColumns = () => {
		const { t } = this.props;
		const tickets = this.props.admin.tickets || [];
		let minTime = PINF;
		let maxTime = 0;
		for ( let i = 0; i < tickets.length; i++ ) {
			if ( tickets[ i ].createdAt > maxTime ) {
				maxTime = tickets[ i ].createdAt;
			}
			if ( tickets[ i ].updatedAt > maxTime ) {
				maxTime = tickets[ i ].updatedAt;
			}
			if ( tickets[ i ].createdAt < minTime ) {
				minTime = tickets[ i ].createdAt;
			}
			if ( tickets[ i ].updatedAt < minTime ) {
				minTime = tickets[ i ].updatedAt;
			}
		}
		maxTime = moment( maxTime );
		minTime = moment( minTime );
		return [
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
			createTextColumn({
				Header: t('common:title'),
				accessor: 'title',
				minWidth: 200
			}),
			{
				Header: t('common:description'),
				accessor: 'description',
				Cell: ( row ) => {
					return ( <OverlayTrigger placement="top" overlay={<Card className="tickets-description-overlay" body id="description-tooltip">
						{row.value}
					</Card>}>
						<p className="tickets-description" >{row.value}</p>
					</OverlayTrigger> );
				},
				style: { marginTop: '8px', color: 'darkslategrey' },
				minWidth: 350
			},
			createTextColumn({
				Header: t('common:course'),
				accessor: 'namespace.title',
				maxWidth: 140
			}),
			createTextColumn({
				Header: t('common:lesson'),
				accessor: 'lesson.title',
				maxWidth: 140,
				Cell: ( row ) => {
					if ( !row.value || !row.original.namespace ) {
						return null;
					}
					const url = `${server}/${row.original.namespace.title}/${row.value}`;
					return (
						<Badge variant="light" style={{ fontSize: '1em' }} >
							<a href={url} target="_blank">
								{row.value}
							</a>
						</Badge>
					);
				}
			}),
			createBooleanColumn({
				Header: t('common:done'),
				accessor: 'done',
				trueLabel: t('common:done'),
				falseLabel: t('common:not-done')
			}),
			createDateColumn({
				Header: t('last-updated'),
				accessor: 'updatedAt',
				startDate: minTime,
				endDate: maxTime
			}),
			createDateColumn({
				Header: t('created-at'),
				accessor: 'createdAt',
				startDate: minTime,
				endDate: maxTime
			}),
			{
				Header: t('common:actions'),
				Cell: ( row ) => {
					return ( <div>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="delete_ticket">{t('namespace:delete-ticket')}</Tooltip>}>
							<Button
								variant="outline-secondary"
								style={{ marginLeft: 8 }}
								onClick={this.askToDeleteSelectedTicketFactory( row.row._original )}
								aria-label={t('namespace:delete-ticket')}
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

	render() {
		return ( <Fragment>
			<ReactTable
				filterable
				data={this.props.admin.tickets}
				columns={this.state.columns}
				ref={(r) => {
					this.reactTable = r;
				}}
			/>
			{ this.state.showDeleteModal ? <ConfirmModal
				title={this.props.t('lesson:delete-ticket')}
				message={<span>{this.props.t('namespace:delete-ticket-confirm')}</span>}
				close={this.toggleDeleteModal}
				show={this.state.showDeleteModal}
				onConfirm={this.deleteSelectedTicket}
			/> : null }
		</Fragment> );
	}
}


// PROPERTIES //

TicketPage.propTypes = {
	deleteTicket: PropTypes.func.isRequired,
	getAllTickets: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( TicketPage );