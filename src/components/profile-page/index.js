// MODULES //

import React, { Component, Fragment } from 'react';
import { Button, Card, FormLabel, FormControl, FormGroup, Form, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import request from 'request';
import server from './../../constants/server';
import PropTypes from 'prop-types';
import './profile-page.css';
import stats from './img/stats.png';
import badge2 from './img/badge2.svg';

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
			passwordRepeat: '',
			showModal: false
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
			size="small" variant="success"
			style={{ marginTop: -7 }}
		>Instructor Access</Button> );
	}

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal
		});
	}

	renderModal() {
		return (
			<Modal show={this.state.showModal} onHide={this.toggleModal}>
			<Modal.Header closeButton>
				<Modal.Title as="h3">Profile
				</Modal.Title>
			</Modal.Header>
				<Form style={{ padding: '20px' }}>
					<FormGroup
						controlId="form-email"
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
							controlId="form-name"
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
							controlId="form-organization"
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
							controlId="form-password"
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
						controlId="form-repeat-password"
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
                <Card>
                    <Button block onClick={this.handleUpdate}>Update</Button>
                </Card>
			</Modal>
		);
	}

    renderStatisticSection() {
        return (
           <div className="profile-page-stats-section">
               <img src={stats} />
           </div>
        );
    }

    renderBadgesSection() {
        let list = [];
        for (let i =0; i< 12; i++) {
            list.push(
            <div className="profile-page-badge-item">
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="toggle_visibility">Toggle Visibility</Tooltip>}>
                    <div className="profile-page-badge-image">
                        <img src={badge2} />
                    </div>
                </OverlayTrigger>
            </div>);
        }

        return (
            list
        );
    }

    renderUserSection() {
        console.log( this.props.user );
        return (
            <div className="profile-page-user-container">
                <div className="profile-page-user-portrait">
                    <img src="https://isle.heinz.cmu.edu/Philipp-Burckhardt_1545932125612.jpg" />
                    <Button style={{ marginTop: 5}} onClick={this.toggleModal}>EDIT PROFILE</Button>
                </div>
                <div className="profile-page-user-personal">
                    <div className="profile-page-user-personal-name">
                        <Card>
                            <Card.Header>
                                <Card.Title as="h3">{ this.props.user.name}</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <OverlayTrigger placement="top" overlay={createTooltip( 'Your score' )}>
                                    <div className="profile-page-user-score">17912</div>
                                </OverlayTrigger>
                                <div>COMPLETED LESSONS</div>
                                <div>TIME SPENT</div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>

                <div className="profile-page-user-footer">
                    {this.renderInstructorButton()}
                </div>

            </div>
        );
    }


	render() {
		return (
		<Fragment>
			{ this.renderModal() }
			<div className="profile-page-grid-container" style={{
			}}>
                <div className="profile-page-left">
                 { this.renderUserSection() }
                </div>

                <div className="profile-page-statistics">
                 { this.renderStatisticSection() }
                </div>

                <div className="profile-page-badges">
                 { this.renderBadgesSection() }
                </div>
			</div>
		</Fragment>
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
