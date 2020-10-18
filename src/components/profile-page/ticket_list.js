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
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TicketModal from 'components/ticket-modal';
import CreateTicketModal from './create_ticket_modal.js';


// MAIN //

class TicketListModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showCreateModal: false,
			showMessagesModal: false,
			showAll: false
		};
	}

	componentDidMount() {
		this.props.getUserTickets();
	}

	toggleCreateModal = () => {
		this.setState({
			showCreateModal: !this.state.showCreateModal
		});
	}

	toggleTicketModal = () => {
		this.setState({
			showMessagesModal: !this.state.showMessagesModal
		});
	}

	toggleShowAll = () => {
		this.setState({
			showAll: !this.state.showAll
		});
	}

	renderTicketList() {
		const out = [];
		const { tickets } = this.props.user;
		const { t } = this.props;
		if ( this.state.showAll ) {
			for ( let i = 0; i < tickets.length; i++ ) {
				const ticket = tickets[ i ];
				out.push(
					<ListGroup.Item key={`ticket-${i}`}>
						{ticket.title}: {ticket.description}
						{ticket.done ? <i className="far fa-check-square"></i> : null}
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
						</Button>
					</ListGroup.Item>
				);
			}
		} else {
			for ( let i = 0; i < tickets.length; i++ ) {
				const ticket = tickets[ i ];
				if ( ticket.done ) {
					continue;
				}
				out.push(
					<ListGroup.Item key={`ticket-${i}`}>
						{ticket.title}: {ticket.description}
						{ticket.done ? <i className="far fa-check-square"></i> : null}
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
							{this.state.showAll ? t('show-completed-tickets') : t('show-all-tickets')}
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
				<CreateTicketModal
					show={this.state.showCreateModal}
					onHide={this.toggleCreateModal}
					enrolledNamespaces={this.props.user.enrolledNamespaces}
					createTicket={this.props.createTicket}
					t={t}
				/>
				{ this.state.showMessagesModal ? <TicketModal
					show={this.state.showMessagesModal}
					onHide={this.toggleTicketModal}
					ticket={this.state.selectedTicket}
				/> : null }
			</Fragment>
		);
	}
}


// PROPERTIES //

TicketListModal.propTypes = {
	createTicket: PropTypes.func.isRequired,
	getUserTickets: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired
};


// EXPORTS //

export default TicketListModal;
