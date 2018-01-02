// MODULES //

import React, { Component } from 'react';
import {
	Accordion, Button, ButtonToolbar, Col, ControlLabel, FormControl, FormGroup,
	Form, Grid, OverlayTrigger, Panel, Tooltip
} from 'react-bootstrap';
import 'react-dates/lib/css/_datepicker.css';
import { withRouter } from 'react-router';
import isArray from '@stdlib/assert/is-array';
import isEmail from '@stdlib/assert/is-email-address';
import MsgModal from './message_modal.js';
import ConfirmModal from './confirm_modal.js';
import checkURLPath from './../utils/check_url_path.js';
import CohortPanel from './cohort_panel.js';
import CreateCohortModal from './create_cohort_modal.js';
import PropTypes from 'prop-types';

// MAIN //

class EditNamespace extends Component {
	constructor( props ) {
		super( props );
		let { title, description, owners } = this.props.namespace;
		if ( isArray( owners ) ) {
			owners = owners.join( ',' );
		}
		this.state = {
			disabled: true,
			title,
			description,
			owners,
			showDeleteModal: false,
			showCreateCohortModal: false
		};

		this.handleInputChange = ( event ) => {
			const target = event.target;
			const name = target.name;
			let value = target.value;

			if ( name === 'owners' ) {
				value = value.replace( /\s/g, '' );
			}

			this.setState({
				[ name ]: value
			}, () => {
				let { title } = this.state;
				if ( title.length > 6 ) {
					this.setState({
						disabled: false
					});
				} else {
					this.setState({
						disabled: true
					});
				}
			});
		};

		this.validateInputs = () => {
			if ( this.state.owners === '' ) {
				return 'Owners field cannot be empty';
			}
			console.log( this.state.owners );
			const owners = this.state.owners.split( ',' );
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
		};

		this.handleUpdate = () => {
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
					else {
						if ( res.statusCode >= 400 ) {
							this.props.addNotification({
								message: res.body,
								level: 'error'
							});
						} else {
							this.props.addNotification({
								message: JSON.parse( res.body ).message,
								level: 'success'
							});
							this.props.getNamespaces( this.props.user.token );
							this.props.getCohorts({
								namespaceID: this.props.namespace._id,
								userToken: this.props.user.token
							});
						}
					}
				});
			} else {
				this.props.addNotification({
					message: msg,
					level: 'warning'
				});
			}
		};

		this.handleDelete = () => {
			this.props.deleteCurrentNamespace( this.props.namespace._id, this.props.user.token, this.props.history, () => {
				this.props.getNamespaces( this.props.user.token );
				this.setState({
					showDeleteModal: false
				});
			});
		};

		this.close = () => {
			this.setState({
				showModal: false
			});
		};

		this.closeDeleteModal = () => {
			this.setState({
				showDeleteModal: false
			});
		};

		this.closeCreateCohortModal = () => {
			this.setState({
				showCreateCohortModal: false
			});
		};

		this.createCohort = ( cohort ) => {
			cohort.namespaceID = this.props.namespace._id;
			this.props.createCohort( this.props.user, cohort, () => {
				this.closeCreateCohortModal();
				this.props.getCohorts({
					userToken: this.props.user.token,
					namespaceID: this.props.namespace._id
				});
			});
		};

		this.deleteCohort = ( cohortID ) => {
			this.props.deleteCohort( cohortID, this.props.user.token, () => {
				this.props.getCohorts({
					userToken: this.props.user.token,
					namespaceID: this.props.namespace._id
				});
			});
		};

		this.updateCohort = ( cohort ) => {
			this.props.updateCohort( cohort, this.props.user.token, () => {
				this.props.getCohorts({
					userToken: this.props.user.token,
					namespaceID: this.props.namespace._id
				});
			});
		};
	}

	render() {
		return (
			<Grid style={{
				position: 'relative',
				top: '80px',
				width: '80%',
				margin: '0 auto'
			}} >
				<Col md={6} >
					<Panel header={<h2>Edit Course</h2>}>
						<Form style={{ padding: '20px' }}>
							<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Comma-separated list of email addresses denoting the administrators for this course</Tooltip>}>
								<FormGroup>
									<ControlLabel>Owners</ControlLabel>
									<FormControl
										name="owners"
										componentClass="textarea"
										value={this.state.owners}
										onChange={this.handleInputChange}
									/>
								</FormGroup>
							</OverlayTrigger>
							<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Title with a minimum length of six characters.</Tooltip>}>
								<FormGroup>
									<ControlLabel>Title</ControlLabel>
									<FormControl
										name="title"
										type="text"
										value={this.state.title}
										onChange={this.handleInputChange}
									/>
								</FormGroup>
							</OverlayTrigger>
							<FormGroup>
								<ControlLabel>Description</ControlLabel>
								<FormControl
									name="description"
									type="text"
									value={this.state.description}
									onChange={this.handleInputChange}
								>
								</FormControl>
							</FormGroup>
						</Form>
						<ButtonToolbar>
							<Button type="submit" onClick={this.handleUpdate}>Update</Button>
							<Button onClick={() => {
								this.setState({
									showDeleteModal: true
								});
							}} bsStyle="danger">Delete</Button>
						</ButtonToolbar>
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
					</Panel>
				</Col>
				<Col md={6} >
					<Panel header={
						<h2>Cohorts
							<Button bsSize="small" bsStyle="success" style={{ float: 'right', marginTop: -7 }}
								onClick={() => {
									this.setState({
										showCreateCohortModal: true
									});
								}}
							>
								Create Cohort
							</Button>
						</h2>}>
						<Accordion>
							{this.props.cohorts.map( ( cohort, idx ) => {
								return ( <Panel
									header={cohort.title}
									eventKey={idx}
									key={idx}
									style={{
										background: 'ivory'
									}}
								>
									<CohortPanel
										id={cohort._id}
										title={cohort.title}
										startDate={cohort.startDate}
										endDate={cohort.endDate}
										students={cohort.members}
										onDelete={this.deleteCohort}
										onUpdate={this.updateCohort}
									 />
								</Panel> );
							})}
						</Accordion>
					</Panel>
				</Col>
			</Grid>
		);
	}
}

EditNamespace.propTypes = {
	updateCurrentNamespace: PropTypes.func.isRequired
};

EditNamespace.defaultProps = {
};


// EXPORTS //

export default withRouter( EditNamespace );
