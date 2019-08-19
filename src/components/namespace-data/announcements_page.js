// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Button, ButtonGroup, Card, FormLabel, FormControl, FormGroup, Form, OverlayTrigger, Tooltip
} from 'react-bootstrap';
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
			mode: 'New Announcement',
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
			mode: 'Edit Announcement',
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
	}

	renderMessages() {
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
									&nbsp;wrote on { dateString }
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
							}} className="message-delete">DELETE</button>
							<button onClick={() => {
								this.editMessage(index);
							}} className="message-edit">EDIT</button>
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
	}

	handleInputChange = ( event ) => {
		const target = event.target;
		const name = target.name;
		let value = target.value;
		this.setState({
			[ name ]: value
		});
	}

	clear = () => {
		this.setState({
			title: '',
			body: '',
			mode: 'New Announcement',
			editItem: null
		});
	}

	closeDeleteModal = () => {
		this.setState({
			editItem: null,
			showDeleteModal: false
		});
	}

	render() {
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
							{this.state.mode}
						</Card.Title>
					</Card.Header>
					<Card.Body>
						<Form style={{ padding: '20px' }}>
							<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Title with a minimum length of three characters.</Tooltip>}>
								<FormGroup>
									<FormLabel>Title</FormLabel>
									<FormControl
										name="title"
										type="text"
										value={this.state.title}
										onChange={this.handleInputChange}
									/>
								</FormGroup>
							</OverlayTrigger>
							<FormGroup>
								<FormLabel>Body</FormLabel>
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
								{ this.state.mode === 'New Announcement' ? 'Create' : 'Update' }
							</Button>
							<Button onClick={this.clear} disabled={isEmpty} variant="danger">Clear</Button>
						</ButtonGroup>
					</Card.Body>
				</Card>
			</div>
			<ConfirmModal
				show={this.state.showDeleteModal}
				close={this.closeDeleteModal}
				message="Are you sure that you want to delete this announcement?"
				title="Delete?"
				onDelete={this.deleteSelectedMessage}
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

export default AnnouncementsPage;
