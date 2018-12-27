// MODULES //

import React, { Component } from 'react';
import { Button, Card, FormLabel, FormControl, FormGroup, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import request from 'request';
import server from './../constants/server';
import PropTypes from 'prop-types';


// FUNCTIONS //

const createTooltip = ( str ) => {
	return <Tooltip id="tooltip">{str}</Tooltip>;
};


// MAIN //

class ProfilePage extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			email: props.user.email,
			name: props.user.name,
			organization: props.user.organization,
			password: '',
			passwordRepeat: ''
		};

		this.handleUpdate = () => {
			const { name, password, passwordRepeat, organization } = this.state;
			let form = {};
			let change = false;
			if ( password ) {
				if ( passwordRepeat === password ) {
					change = true;
					form.password = password;
				}
			}
			if ( name !== this.props.user.name ) {
				form.name = name;
				change = true;
			}
			if ( organization !== this.props.user.organization ) {
				form.organization = organization;
				change = true;
			}
			if ( change ) {
				request.post( server+'/update_user', {
					form: form,
					headers: {
						'Authorization': 'JWT ' + this.props.user.token
					}
				}, ( err, res ) => {
					if ( err ) {
						this.props.addNotification({
							message: err.message,
							level: 'error'
						});
					} else {
						this.props.updateUser({
							name,
							organization
						});
						this.props.addNotification({
							message: JSON.parse( res.body ).message,
							level: 'success'
						});
					}
				});
			}
		};

		this.handleInputChange = ( event ) => {
			const target = event.target;
			const value = target.value;
			const name = target.name;

			this.setState({
				[ name ]: value
			});
		};

		this.getNameValidationState = () => {
			const { name } = this.state;
			if ( name.length > 3 ) {
				return 'success';
			}
			return 'warning';
		};

		this.getPasswordValidationState = () => {
			const { password, passwordRepeat } = this.state;
			if ( password.length < 6 || passwordRepeat.length === 0 ) {
				return 'warning';
			}
			if ( password !== passwordRepeat ) {
				return 'error';
			}
			return 'success';
		};
	}

	gotoTokenPage = () => {
		this.props.history.replace( '/enter-token' );
	}

	renderInstructorButton() {
		if ( this.props.user.writeAccess ) {
			return null;
		}
		return ( <Button
			onClick={this.gotoTokenPage}
			bsSize="small" variant="success"
			style={{ float: 'right', marginTop: -7 }}
		>Instructor Access</Button> );
	}

	render() {
		return (
			<Card style={{
				position: 'relative',
				top: '80px',
				width: '50%',
				margin: '0 auto'
			}}>
			<Card.Header>
				<Card.Title as="h1">Profile
				{this.renderInstructorButton()}
				</Card.Title>
			</Card.Header>
				<Form style={{ padding: '20px' }}>
					<FormGroup
						controlId="formHorizontalEmail"
					>
						<FormLabel>Email Address</FormLabel>
						<FormControl
							name="email"
							type="email"
							value={this.state.email}
							disabled
						/>
					</FormGroup>
					<OverlayTrigger placement="right" overlay={createTooltip( 'Update your name' )}>
						<FormGroup
							controlId="formHorizontalName"
							validationState={this.getNameValidationState()}
						>
							<FormLabel>Name</FormLabel>
							<FormControl
								name="name"
								type="text"
								value={this.state.name}
								onChange={this.handleInputChange}
							/>
						</FormGroup>
					</OverlayTrigger>
					<OverlayTrigger placement="right" overlay={createTooltip( 'Update your organization' )}>
						<FormGroup
							controlId="formHorizontalName"
							validationState={this.getNameValidationState()}
						>
							<FormLabel>Organization</FormLabel>
							<FormControl
								name="organization"
								type="text"
								value={this.state.organization}
								onChange={this.handleInputChange}
							/>
						</FormGroup>
					</OverlayTrigger>
					<OverlayTrigger placement="right" overlay={createTooltip( 'Please enter a password of your choosing with at least six characters' )}>
						<FormGroup
							controlId="formHorizontalPassword"
							validationState={this.getPasswordValidationState()}
						>
							<FormLabel>Password</FormLabel>
							<FormControl
								name="password"
								type="password"
								value={this.state.password}
								placeholder="Choose a new password"
								onChange={this.handleInputChange}
								maxLength={30}
								minLength={6}
							/>
							<FormControl.Feedback />
						</FormGroup>
					</OverlayTrigger>
					<FormGroup
						controlId="formHorizontalPassword"
						validationState={this.getPasswordValidationState()}
					>
						<FormControl
							name="passwordRepeat"
							type="password"
							value={this.state.passwordRepeat}
							placeholder="Repeat new password"
							onChange={this.handleInputChange}
							maxLength={30}
							minLength={6}
						/>
						<FormControl.Feedback />
					</FormGroup>
				</Form>
				<Button block onClick={this.handleUpdate}>Update</Button>
			</Card>
		);
	}
}

ProfilePage.propTypes = {
	addNotification: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	updateUser: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

ProfilePage.defaultProps = {
};


// EXPORTS //

export default ProfilePage;
