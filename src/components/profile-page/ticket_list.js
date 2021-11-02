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
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import TicketModal from 'components/ticket-modal';
import CreateTicketModal from './create_ticket_modal.js';


// VARIABLES //

const RE_TICKET = /ticket=([^&]*)/;


// MAIN //

class TicketListModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showCreateModal: false,
			showMessagesModal: false,
			showOpen: true
		};
	}

	async componentDidMount() {
		await this.props.getUserTickets();
		if ( this.props.history && this.props.history.location.search ) {
			const match = RE_TICKET.exec( this.props.history.location.search );
			if ( match && match[ 1 ] ) {
				const { tickets } = this.props.user;
				if ( tickets ) {
					for ( let i = 0; i < tickets.length; i++ ) {
						const ticket = tickets[ i ];
						if ( ticket._id === match[ 1 ] ) {
							// eslint-disable-next-line react/no-did-mount-set-state
							this.setState({
								selectedTicket: ticket,
								showMessagesModal: true
							});
							break;
						}
					}
				}
			}
		}
	}

	toggleCreateModal = () => {
		this.setState({
			showCreateModal: !this.state.showCreateModal
		});
	};

	toggleTicketModal = () => {
		this.setState({
			showMessagesModal: !this.state.showMessagesModal
		});
	};

	toggleShowAll = () => {
		this.setState({
			showOpen: !this.state.showOpen
		});
	};

	renderTicketList() {
		const out = [];
		const { user, t } = this.props;
		if ( !user ) {
			return null;
		}
		const { tickets } = user;
		if ( !tickets ) {
			return null;
		}
		if ( this.state.showOpen ) {
			for ( let i = 0; i < tickets.length; i++ ) {
				const ticket = tickets[ i ];
				if ( ticket.done === true ) {
					continue;
				}
				out.push(
					<ListGroup.Item key={`ticket-${i}`}>
						{ticket.title}: {ticket.description}
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="ticket-status-tooltip">
							{t('common:close-ticket')}
						</Tooltip>}>
							<Button
								variant="outline-secondary" size="sm"
								style={{ float: 'right', marginLeft: 6 }}
								onClick={() => {
									this.props.closeTicket( ticket._id );
								}}
							>
								<i className="far fa-square" />
							</Button>
						</OverlayTrigger>
						<Button
							size="sm"
							variant="outline-secondary"
							style={{ float: 'right' }}
							onClick={() => {
								this.setState({
									selectedTicket: ticket
								}, this.toggleTicketModal );
							}}
						>
							{t('common:messages')}
							<Badge className="ticket-badge" variant="secondary" >{ticket.messages.length}</Badge>
						</Button>
					</ListGroup.Item>
				);
			}
		} else {
			for ( let i = 0; i < tickets.length; i++ ) {
				const ticket = tickets[ i ];
				if ( ticket.done === false ) {
					continue;
				}
				out.push(
					<ListGroup.Item key={`ticket-${i}`}>
						{ticket.title}: {ticket.description}
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="ticket-status-tooltip">
							{t('common:open-ticket')}
						</Tooltip>}>
							<Button
								variant="outline-secondary"
								size="sm" style={{ float: 'right', marginLeft: 6 }}
								onClick={() => {
									this.props.openTicket( ticket._id );
								}}
							>
								<i className="far fa-check-square"></i>
							</Button>
						</OverlayTrigger>
						<Button
							size="sm"
							variant="outline-secondary"
							style={{ float: 'right' }}
							onClick={() => {
								this.setState({
									selectedTicket: ticket
								}, this.toggleTicketModal );
							}}
						>
							{t('common:messages')}
							<Badge className="ticket-badge" variant="secondary" >{ticket.messages.length}</Badge>
						</Button>
					</ListGroup.Item>
				);
			}
		}
		return ( <ListGroup>
			{out}
		</ListGroup> );
	}

	render() {
		const { t } = this.props;
		const enrolledNamespaces = this.props.user.enrolledNamespaces.filter( x => x.enableTicketing );
		return (
			<Fragment>
				<Modal onHide={this.props.onHide} show={this.props.show} dialogClassName="modal-40w" >
					<Modal.Header closeButton >
						<Modal.Title as="h3">{t('my-tickets')}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this.renderTicketList()}

					</Modal.Body>
					<Modal.Footer>
						<Button
							onClick={this.toggleShowAll}
						>
							{this.state.showOpen ? t('show-completed-tickets') : t('show-open-tickets')}
						</Button>
						<Button
							onClick={this.toggleCreateModal}
						>
							{t('new-ticket')}
						</Button>
						<Button
							onClick={this.props.onHide}
						>
							{t('common:close')}
						</Button>
					</Modal.Footer>
				</Modal>
				{ this.state.showCreateModal ? <CreateTicketModal
					show={this.state.showCreateModal}
					onHide={this.toggleCreateModal}
					enrolledNamespaces={enrolledNamespaces}
					createTicket={this.props.createTicket}
					t={t}
				/> : null }
				{ this.state.showMessagesModal ? <TicketModal
					show={this.state.showMessagesModal}
					onHide={this.toggleTicketModal}
					ticket={this.state.selectedTicket}
					submitTicketMessage={this.props.submitTicketMessage}
					closeTicket={this.props.closeTicket}
					openTicket={this.props.openTicket}
				/> : null }
			</Fragment>
		);
	}
}


// PROPERTIES //

TicketListModal.propTypes = {
	closeTicket: PropTypes.func.isRequired,
	createTicket: PropTypes.func.isRequired,
	getUserTickets: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	openTicket: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	submitTicketMessage: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default TicketListModal;
