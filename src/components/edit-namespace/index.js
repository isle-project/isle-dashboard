// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	Badge, Button, ButtonGroup, Card, Container, Col, Row, FormLabel, FormControl, FormGroup, Form, ListGroup, ListGroupItem, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import 'react-dates/lib/css/_datepicker.css';
import { withRouter } from 'react-router';
import isArray from '@stdlib/assert/is-array';
import isEmail from '@stdlib/assert/is-email-address';
import TextSelect from 'components/text-select';
import MsgModal from 'components/message-modal';
import ConfirmModal from 'components/confirm-modal';
import checkURLPath from 'utils/check_url_path.js';
import EditCohortModal from './edit_cohort_modal.js';
import CreateCohortModal from './create_cohort_modal.js';
import './edit_namespace.css';


// FUNCTIONS //

function validateInputs({ emails, title, description }) {
	let invalid = false;
	if ( emails.length === 0 ) {
		invalid = true;
	} else {
		emails.forEach( owner => {
			if ( !isEmail( owner ) ) {
				invalid = true;
			}
		});
	}
	if ( invalid ) {
		return false;
	}
	return title.length >= 6 && description.length > 3;
}


// MAIN //

class EditNamespace extends Component {
	constructor( props ) {
		super( props );
		let { title, description, owners } = this.props.namespace;
		if ( isArray( owners ) ) {
			owners = owners.map( ( owner ) => {
				return owner.email;
			});
		}
		this.state = {
			disabled: false,
			title,
			description,
			owners,
			showDeleteModal: false,
			showCreateCohortModal: false,
			showEditCohortModal: false,
			selectedCohort: null
		};
	}

	handleInputChange = ( event ) => {
		const target = event.target;
		const name = target.name;
		let value = target.value;
		this.setState({
			[ name ]: value
		}, () => {
			this.setState({
				disabled: !validateInputs({
					emails: this.state.owners,
					description: this.state.description,
					title: this.state.title
				})
			});
		});
	}

	validateInputs = () => {
		if ( this.state.owners === '' ) {
			return 'Owners field cannot be empty';
		}
		const owners = this.state.owners;
		let invalidOwner = false;
		owners.forEach( owner => {
			if ( isEmail( owner ) === false ) {
				invalidOwner = true;
			}
		});
		if ( invalidOwner ) {
			return 'Owners must be valid email addresses';
		}
		const res = checkURLPath( this.state.title );
		if ( res ) {
			return 'Namespace title contains invalid characters: '+res[ 0 ]+'';
		}
		return 'success';
	}

	handleUpdate = () => {
		var msg = this.validateInputs();
		if ( msg === 'success' ) {
			this.props.updateCurrentNamespace({
				_id: this.props.namespace._id,
				description: this.state.description,
				title: this.state.title,
				owners: this.state.owners,
				token: this.props.user.token
			}, ( err, res ) => {
				if ( err ) {
					this.props.addNotification({
						message: err.message,
						level: 'error'
					});
				}
				else if ( res.statusCode >= 400 ) {
					this.props.addNotification({
						message: res.body,
						level: 'error'
					});
				} else {
					this.props.addNotification({
						message: JSON.parse( res.body ).message,
						level: 'success'
					});
					this.props.getCohorts({
						namespaceID: this.props.namespace._id,
						userToken: this.props.user.token
					});
				}
			});
		} else {
			this.props.addNotification({
				message: msg,
				level: 'warning'
			});
		}
	}

	handleDelete = () => {
		this.props.deleteCurrentNamespace( this.props.namespace._id, this.props.user.token, this.props.history );
	}

	close = () => {
		this.setState({
			showModal: false
		});
	}

	closeDeleteModal = () => {
		this.setState({
			showDeleteModal: false
		});
	}

	closeCreateCohortModal = () => {
		this.setState({
			showCreateCohortModal: false
		});
	}

	createCohort = ( cohort ) => {
		cohort.namespaceID = this.props.namespace._id;
		this.props.createCohort( this.props.user, cohort, () => {
			this.closeCreateCohortModal();
			this.props.getCohorts({
				userToken: this.props.user.token,
				namespaceID: this.props.namespace._id
			});
		});
	}

	deleteCohort = ( cohortID ) => {
		this.props.deleteCohort( cohortID, this.props.user.token, () => {
			this.props.getCohorts({
				userToken: this.props.user.token,
				namespaceID: this.props.namespace._id
			});
		});
	}

	updateCohort = ( cohort ) => {
		this.props.updateCohort( cohort, this.props.user.token, () => {
			this.props.getCohorts({
				userToken: this.props.user.token,
				namespaceID: this.props.namespace._id
			});
		});
	}

	handleOwnerChange = ( newValue ) => {
		const owners = newValue.map( x => x.value );
		this.setState({
			owners: owners,
			disabled: !validateInputs({
				emails: owners,
				description: this.state.description,
				title: this.state.title
			})
		});
	}

	closeEditCohortModal = () => {
		this.setState({
			selectedCohort: null,
			showEditCohortModal: false
		});
	}

	cohortModalFactory = ( idx ) => {
		return () => {
			this.setState({
				selectedCohort: this.props.cohorts[ idx ],
				showEditCohortModal: true
			});
		};
	}

	renderModals() {
		return (
			<Fragment>
				<MsgModal
					show={this.state.showModal}
					close={this.close}
					message={this.state.message}
					successful={this.state.successful}
					title="Update Course"
				/>
				<ConfirmModal
					show={this.state.showDeleteModal}
					close={this.closeDeleteModal}
					message="Are you sure that you want to delete this course?"
					title="Delete?"
					onDelete={this.handleDelete}
				/>
				<CreateCohortModal
					show={this.state.showCreateCohortModal}
					close={this.closeCreateCohortModal}
					onCreate={this.createCohort}
				/>
				{ this.state.showEditCohortModal ? <EditCohortModal
					show={this.state.showEditCohortModal}
					{...this.state.selectedCohort}
					onDelete={this.deleteCohort}
					onHide={this.closeEditCohortModal}
					onUpdate={this.updateCohort}
				/> : null }
			</Fragment>
		);
	}

	renderCohortList() {
		return ( <ListGroup>
			{this.props.cohorts.map( ( cohort, idx ) => {
				return (
					<ListGroupItem
						variant="light"
						eventKey={idx}
						key={idx}
						style={{
							backgroundColor: 'white'
						}}
					>
						<label>{cohort.title}</label>
						<span style={{ marginLeft: 5, color: 'black' }} >
							(no of students:
						</span>
						<Badge variant="primary">{cohort.members.length}</Badge>
						<span style={{ color: 'black' }} >)</span>
						<Button size="sm" onClick={this.cohortModalFactory( idx )} style={{ float: 'right' }}>Edit</Button>
					</ListGroupItem>
				);
			})}
		</ListGroup> );
	}

	render() {
		return (
			<Container className="edit-namespace-container" >
				<Row>
					<Col md={6} >
						<Card>
							<Card.Header>
								<Card.Title as="h2">
									Edit Course
								</Card.Title>
							</Card.Header>
							<Card.Body>
								<Form style={{ padding: '20px' }}>
									<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Enter list of email addresses denoting the administrators for this course</Tooltip>}>
										<FormGroup>
											<FormLabel>Owners</FormLabel>
											<TextSelect
												onChange={this.handleOwnerChange}
												defaultValue={this.state.owners}
											/>
										</FormGroup>
									</OverlayTrigger>
									<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Title with a minimum length of six characters.</Tooltip>}>
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
										<FormLabel>Description</FormLabel>
										<FormControl
											name="description"
											type="text"
											value={this.state.description}
											onChange={this.handleInputChange}
										>
										</FormControl>
									</FormGroup>
								</Form>
								<ButtonGroup>
									<Button type="submit" disabled={this.state.disabled} onClick={this.handleUpdate}>Update</Button>
									<Button onClick={() => {
										this.setState({
											showDeleteModal: true
										});
									}} variant="danger">Delete</Button>
								</ButtonGroup>
							</Card.Body>
							{ this.renderModals() }
						</Card>
					</Col>
					<Col md={6} >
						<Card>
							<Card.Header>
								<Card.Title as="h2">Manage Cohorts
									<Button size="small" variant="success" style={{ float: 'right', marginTop: 7 }}
										onClick={() => {
											this.setState({
												showCreateCohortModal: true
											});
										}}
									>
										Create Cohort
									</Button>
								</Card.Title>
							</Card.Header>
							<Card.Body>
								{this.renderCohortList()}
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		);
	}
}


// PROPERTIES //

EditNamespace.propTypes = {
	addNotification: PropTypes.func.isRequired,
	cohorts: PropTypes.array,
	createCohort: PropTypes.func.isRequired,
	deleteCohort: PropTypes.func.isRequired,
	deleteCurrentNamespace: PropTypes.func.isRequired,
	getCohorts: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	namespace: PropTypes.object.isRequired,
	updateCohort: PropTypes.func.isRequired,
	updateCurrentNamespace: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

EditNamespace.defaultProps = {
	cohorts: []
};


// EXPORTS //

export default withRouter( EditNamespace );
