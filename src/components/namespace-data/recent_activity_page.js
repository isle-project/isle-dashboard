// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Button, ButtonGroup, Card, FormLabel, FormControl, FormGroup, Form, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import '../profile-page/message-page.css';
import './message_admin_page.css';


let Announcements = [];

// MAIN //

class RecentActivityPage extends Component {
	constructor( props ) {
		super( props );

		console.log( this.props.user );

		this.state = {
			title: '',
			body: '',
			mode: 'New Message',
			editItem: null
		};
	}

	renderModals() {
		return null;
	}

	editMessage(ndx) {
		this.setState({
			mode: 'Edit Message',
			editItem: ndx,
			title: Announcements[ndx].title,
			body: Announcements[ndx].body
		});
	}

	deleteMessage(ndx) {
		Announcements.splice(ndx, 1);
		this.clear();
		this.forceUpdate();
	}

	getMessage(ndx) {
		let date = new Date(Announcements[ndx].createdAt).toDateString();

		return (
			<div>
			<div className="message-container">
				<div className="message-data">
					<div className="message-profile-pic">
						<img src={Announcements[ndx].picture} />
					</div>

					<div className="message-author-line">
						<span className="message-author">{ Announcements[ndx].author } </span>
						wrote on { date }
					</div>
				</div>

				<div className="message-title">
					{ Announcements[ndx].title }
				</div>
				<div className="message-body">
					{ Announcements[ndx].body }
				</div>
			</div>

			<div className="message-manip">
				<div onClick={() => {
					this.deleteMessage(ndx);
				}} className="message-delete">DELETE</div>
				<div onClick={() => {
					this.editMessage(ndx);
				}} className="message-edit">EDIT</div>
			</div>
		</div>

		);
	}

	renderMessages() {
		let msg = [];
		for (let i = 0; i < Announcements.length; i++) {
			msg.push( this.getMessage(i));
		}

		return (
			<div>{ msg }</div>
		);
	}

	createMessage = () => {
		let now = new Date().getTime();

			const message = {
				title: this.state.title,
				body: this.state.body,
				author: this.props.user.name,
				email: this.props.user.email,
				picture: this.props.user.picture,
				createdAt: now
			};

			if (this.state.editItem === null) {
				Announcements.push(message);
			}
			else {
				Announcements[this.state.editItem] = message;
			}

			this.clear();
	}

	handleInputChange = (event) => {
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

RecentActivityPage.propTypes = {
	user: PropTypes.object.isRequired
};

RecentActivityPage.defaultProps = {
};


// EXPORTS //

export default RecentActivityPage;
