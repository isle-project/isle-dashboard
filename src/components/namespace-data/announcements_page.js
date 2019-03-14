// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Button, ButtonGroup, Card, FormLabel, FormControl, FormGroup, Form, OverlayTrigger, Tooltip
} from 'react-bootstrap';
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
			editItem: null
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

	deleteMessage(ndx) {
		const announcement = this.props.namespace.announcements[ ndx ];
		this.props.deleteAnnouncement( announcement.createdAt, ndx );
		this.clear();
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
									<img src={value.picture} />
								</div>
								<div className="message-author-line">
									<span className="message-author">{ value.author }</span>
									wrote on { dateString }
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
							<div onClick={() => {
								this.deleteMessage(index);
							}} className="message-delete">DELETE</div>
							<div onClick={() => {
								this.editMessage(index);
							}} className="message-edit">EDIT</div>
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
			mode: 'New Message',
			editItem: null
		});
	}

	render() {
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
							<Button type="submit" disabled={this.state.disabled} onClick={this.createMessage}>Submit</Button>
							<Button onClick={this.clear} variant="danger">Clear</Button>
						</ButtonGroup>
					</Card.Body>
				</Card>
			</div>
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
