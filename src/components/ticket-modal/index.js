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
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Modal from 'react-bootstrap/Modal';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import server from 'constants/server';
import './ticket_modal.css';


// FUNCTIONS //

const createTooltip = ( str ) => {
	return <Tooltip id="tooltip">{str}</Tooltip>;
};


// MAIN //

class TicketModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			response: ''
		};
	}

	handleResponseChange = ( event ) => {
		this.setState({
			response: event.target.value
		});
	};

	handleResponseSubmit = () => {
		this.props.submitTicketMessage({
			message: this.state.response,
			ticketID: this.props.ticket._id
		});
		this.setState({
			response: ''
		});
	};

	toggleCompletion = () => {
		if ( this.props.ticket.done ) {
			this.props.openTicket( this.props.ticket._id );
		} else {
			this.props.closeTicket( this.props.ticket._id );
		}
	};

	renderMessage = ( val, idx ) => {
		const t = this.props.t;
		const createdAt = new Date( val.createdAt );
		return (
			<div className="message-container" key={idx} >
				<div className="message-data">
					<div className="message-profile-pic">
						<img src={`${server}/thumbnail/${val.picture}`} alt="User Profile Pic" />
					</div>
					<div className="message-author-line">
						<span className="message-author">{ val.author }</span>
						&nbsp;{t('common:wrote-on', { date: `${createdAt.toLocaleTimeString()} ${createdAt.toLocaleDateString()}` })}
					</div>
				</div>
				<div className="message-body">
					{val.body}
				</div>
			</div>
		);
	};

	render() {
		const t = this.props.t;
		const { ticket } = this.props;
		return (
			<Fragment>
				<Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="modal-60w" >
					<Modal.Header>
						<Modal.Title as="h3" style={{ width: '100%' }}>
							{t('common:title')}: {ticket.title}
							<OverlayTrigger placement="right" overlay={createTooltip( t('close-ticket-modal') )}>
								<Button
									onClick={this.props.onHide}
									style={{ float: 'right' }}
									variant="outline-secondary"
									aria-label={t('close-ticket-modal')}
									className="modal-close"
								>
									<span aria-hidden="true">x</span>
								</Button>
							</OverlayTrigger>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body style={{ height: '60vh', overflowY: 'auto' }}>
						<span className="title">{t('common:description')}:</span>
						<p style={{ whiteSpace: 'pre-wrap' }}>
							{ticket.description}
						</p>
						<hr />
						{ticket.namespace.title ?
							<Fragment>
								<span className="title">{`${t('common:course')}: `}</span>
								<span>{ticket.namespace.title}</span>
								{' | '}
							</Fragment> :
							null
						}
						{ticket.lesson ?
							<Fragment>
								<span className="title">{`${t('common:lesson')}: `}</span>
								<span>{ticket.lesson.title}</span>
								{' | '}
							</Fragment> :
							null
						}
						{ticket.component ?
							<Fragment>
								<span className="title">{`${t('common:component')}: `}</span>
								<span>{ticket.component}</span>
							</Fragment> :
							null
						}
						{ticket.attachments.length > 0 ?
							<Fragment>
								<br />
								<span className="title">{`${t('common:attachments')}: `}</span>
								{ticket.attachments.map( ( file, idx ) => {
									return ( <a aria-label={t('common:attachments')} href={`${server}/attachments/${file.filename}`} key={idx} style={{ marginLeft: 6 }} target="_blank" rel="noopener noreferrer" >
										<i className="fas fa-link" style={{ marginRight: 2 }} ></i>
										{file.title}
									</a> );
								})}
							</Fragment> :
							null
						}
						<br />
						<hr />
						<span className="title">{t('common:messages')}:</span>
						{ticket.messages.map( this.renderMessage )}
						<hr />
					</Modal.Body>
					<Modal.Footer style={{ background: 'ghostwhite' }} >
						<FormGroup controlId="form-text" style={{ width: 'calc(100% - 200px)' }} >
							<FormLabel>{t('enter-response')}</FormLabel>
							<FormControl
								name="body"
								type="text"
								as="textarea" rows="5"
								value={this.state.response}
								placeholder={ticket.done ? t('require-open-ticket') : t('response-comes-here')}
								onChange={this.handleResponseChange}
								disabled={ticket.done}
							>
							</FormControl>
						</FormGroup>
						<div style={{ float: 'right', width: '180px' }} className="d-grid gap-2" >
							<Button
								onClick={this.handleResponseSubmit}
								disabled={!this.state.response || ticket.done}
							>
								{t('submit-response')}
							</Button>
							<Button
								onClick={this.toggleCompletion}
							>
								{ticket.done ? t('common:open-ticket') : t('common:close-ticket')}
							</Button>
							<Button
								onClick={this.props.onHide}
							>
								{t('common:hide')}
							</Button>
						</div>
					</Modal.Footer>
				</Modal>
			</Fragment>
		);
	}
}


// PROPERTIES //

TicketModal.propTypes = {
	closeTicket: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	openTicket: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	submitTicketMessage: PropTypes.func.isRequired,
	ticket: PropTypes.object.isRequired
};

TicketModal.defaultProps = {};


// EXPORTS

export default withTranslation( [ 'ticket_modal', 'common' ] )( TicketModal );
