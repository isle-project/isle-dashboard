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
import { withTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ConfirmModal from 'components/confirm-modal';
import '../profile-page/message-page.css';
import './message_admin_page.css';


// MAIN //

class AnnouncementsPage extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			title: '',
			body: '',
			mode: 'new-announcement',
			editItem: null,
			showDeleteModal: false
		};
	}

	renderModals() {
		return null;
	}

	editMessage( ndx ) {
		const announcement = this.props.namespace.announcements[ ndx ];
		this.setState({
			mode: 'edit-announcement',
			editItem: ndx,
			title: announcement.title,
			body: announcement.body
		});
	}

	deleteSelectedMessage = () => {
		const ndx = this.state.editItem;
		const announcement = this.props.namespace.announcements[ ndx ];
		this.props.deleteAnnouncement( announcement.createdAt, ndx );
		this.clear();
		this.closeDeleteModal();
	};

	renderMessages() {
		const { t } = this.props;
		return (
			<div>
				{this.props.namespace.announcements.map( ( value, index ) => {
					const date = new Date( value.createdAt );
					const dateString = date.toLocaleDateString() + '  -  ' + date.toLocaleTimeString( navigator.language, {
						hour: '2-digit',
						minute: '2-digit'
					});
					return (
						<div key={index}>
						<div className="message-container">
							<div className="message-data">
								<div className="message-profile-pic">
									<img src={value.picture} alt="User Profile Pic" />
								</div>
								<div className="message-author-line">
									<span className="message-author">{ value.author }</span>
									&nbsp;{t('common:wrote-on', { date: dateString })}
								</div>
							</div>
							<div className="message-title">
								{ value.title }
							</div>
							<div className="message-body">
								{ value.body }
							</div>
						</div>
						<div className="message-manip">
							<button onClick={() => {
								this.setState({
									editItem: index,
									showDeleteModal: true
								});
							}} className="message-delete">{t('common:delete')}</button>
							<button onClick={() => {
								this.editMessage(index);
							}} className="message-edit">{t('common:edit')}</button>
						</div>
					</div>
					);
				})}
			</div>
		);
	}

	createMessage = () => {
		const now = new Date().getTime();
		const message = {
			title: this.state.title,
			body: this.state.body,
			author: this.props.user.name,
			email: this.props.user.email,
			picture: this.props.user.picture
		};
		if ( this.state.editItem === null ) {
			message.createdAt = now;
			this.props.addAnnouncement( message );
		}
		else {
			const announcement = this.props.namespace.announcements[ this.state.editItem ];
			message.createdAt = announcement.createdAt;
			this.props.editAnnouncement( message );
		}
		this.clear();
	};

	handleInputChange = ( event ) => {
		const target = event.target;
		const name = target.name;
		let value = target.value;
		this.setState({
			[ name ]: value
		});
	};

	clear = () => {
		this.setState({
			title: '',
			body: '',
			mode: 'new-announcement',
			editItem: null
		});
	};

	closeDeleteModal = () => {
		this.setState({
			editItem: null,
			showDeleteModal: false
		});
	};

	render() {
		const { t } = this.props;
		const isDisabled = this.state.title.length < 3 || this.state.body.length < 3;
		const isEmpty = this.state.title.length === 0 && this.state.body.length === 0;
		return ( <div className="namespace-data-page">
			<div className="messages">
				{ this.renderMessages() }
			</div>
			<div className="new_message">
				<Card>
					<Card.Header>
						<Card.Title as="h3">
							{t(this.state.mode)}
						</Card.Title>
					</Card.Header>
					<Card.Body>
						<Form style={{ padding: '20px' }}>
							<OverlayTrigger placement="bottom" overlay={<Tooltip id="titleTooltip">{t('announcement-title')}</Tooltip>}>
								<FormGroup controlId="form-title" >
									<FormLabel>{t('common:title')}</FormLabel>
									<FormControl
										name="title"
										type="text"
										value={this.state.title}
										onChange={this.handleInputChange}
									/>
								</FormGroup>
							</OverlayTrigger>
							<FormGroup controlId="form-text" >
								<FormLabel>{t('announcement-text')}</FormLabel>
								<FormControl
									name="body"
									type="text"
									as="textarea" rows="10"
									value={this.state.body}
									onChange={this.handleInputChange}
								>
								</FormControl>
							</FormGroup>
						</Form>
						<ButtonGroup>
							<Button type="submit" disabled={isDisabled} onClick={this.createMessage}>
								{ this.state.mode === 'new-announcement' ? t('common:create') : t('common:update') }
							</Button>
							<Button onClick={this.clear} disabled={isEmpty} variant="danger">{t('common:clear')}</Button>
						</ButtonGroup>
					</Card.Body>
				</Card>
			</div>
			<ConfirmModal
				show={this.state.showDeleteModal}
				close={this.closeDeleteModal}
				message={t('delete-announcement')}
				title={`${t('common:delete')}?`}
				onConfirm={this.deleteSelectedMessage}
			/>
		</div> );
	}
}


// PROPERTIES //

AnnouncementsPage.propTypes = {
	addAnnouncement: PropTypes.func.isRequired,
	deleteAnnouncement: PropTypes.func.isRequired,
	editAnnouncement: PropTypes.func.isRequired,
	namespace: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired
};

AnnouncementsPage.defaultProps = {
};


// EXPORTS //

export default withTranslation( [ 'namespace_data', 'common' ] )( AnnouncementsPage );
