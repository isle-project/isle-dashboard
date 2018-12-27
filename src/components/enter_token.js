// MODULES //

import React, { Component } from 'react';
import { Button, Card, Col, FormLabel, Form, FormControl, FormGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';


// MAIN //

class EnterToken extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			token: null
		};

		this.handleInputChange = ( event ) => {
			this.setState({
				token: event.target.value
			});
		};

		this.handleSubmit = () => {
			this.props.authenticate({ writeAccessToken: this.state.token, userToken: this.props.user.token });
		};
	}

	render() {
		return (
			<Card style={{
				position: 'relative',
				top: '150px',
				width: '50%',
				margin: '0 auto'
			}}>
				<Card.Heading>
					<Card.Title componentClass="h2">Enter Access Token</Card.Title>
				</Card.Heading>
				<Card.Body>
					<div>
						Please enter the write-access token that was sent to you. If you have not received it yet,
						please get in touch with <a href="mailto:pgb@andrew.cmu.edu">Philipp Burckhardt</a>.
					</div>
					<br />
					<Form horizontal>
						<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Please enter the access token.</Tooltip>}>
							<FormGroup>
								<Col componentClass={FormLabel} sm={2}>Token</Col>
								<Col sm={10}>
									<FormControl
										name="title"
										type="text"
										placeholder="Enter token"
										onChange={this.handleInputChange}
									/>
								</Col>
							</FormGroup>
						</OverlayTrigger>
						<FormGroup>
							<Col smOffset={2} sm={10}>
								<Button onClick={this.handleSubmit}>
									Submit
								</Button>
							</Col>
						</FormGroup>
					</Form>
				</Card.Body>
			</Card>
		);
	}
}


// PROPERTY TYPES //

EnterToken.propTypes = {
	authenticate: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default EnterToken;
