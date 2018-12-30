// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	Button, ButtonGroup, Modal, FormLabel, Form, FormControl, FormGroup,
	OverlayTrigger, Col, Row, Tooltip
} from 'react-bootstrap';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import isEmail from '@stdlib/assert/is-email-address';
import ConfirmModal from 'components/confirm-modal';
import TextSelect from 'components/text-select';


// FUNCTIONS //

function validateInputs({ emails, title }) {
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
	return title.length >= 4;
}


// MAIN //

class EditCohortModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			disabled: false,
			startDate: moment( props.startDate ),
			endDate: moment( props.endDate ),
			title: props.title,
			members: props.members,
			showDeleteModal: false
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
					title: this.state.title
				})
			});
		});
	}

	handleUpdate = () => {
		const updatedCohort = {
			_id: this.props._id,
			startDate: this.state.startDate.toDate(),
			endDate: this.state.endDate.toDate(),
			members: this.state.members.join( ',' ),
			title: this.state.title
		};
		this.props.onUpdate( updatedCohort );
		this.props.onHide();
	}

	handleDelete = () => {
		this.props.onDelete( this.props._id );
		this.closeDeleteModal();
		this.props.onHide();
	}

	closeDeleteModal = () => {
		this.setState({
			showDeleteModal: false
		});
	}

	handleStudentChange = ( newValue ) => {
		const members = newValue.map( x => x.value );
		this.setState({
			members: members,
			disabled: !validateInputs({
				emails: members,
				title: this.state.title
			})
		});
	}

	render() {
		const content = (
			<Form style={{ padding: '10px' }}>
				<Row>
					<Col md={6}>
						<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Title with a minimum length of four characters.</Tooltip>}>
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
					</Col>
					<Col md={6}>
						<FormGroup>
							<FormLabel> From ... To </FormLabel>
							<br />
							<DateRangePicker
								startDateId="panel_start_date_input"
								endDateId="panel_end_date_input"
								startDate={this.state.startDate}
								endDate={this.state.endDate}
								onDatesChange={({ startDate, endDate }) =>
									this.setState({ startDate, endDate })
								}
								focusedInput={this.state.focusedInput}
								onFocusChange={focusedInput => this.setState({ focusedInput })}
							/>
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Comma-separated list of email addresses denoting the students for this cohort</Tooltip>}>
						<FormGroup>
							<FormLabel>Enrolled Students</FormLabel>
							<TextSelect
								onChange={this.handleStudentChange}
								defaultValue={this.state.members}
								styles={{
									control: () => ({
										width: '100%'
									})
								}}
							/>
						</FormGroup>
					</OverlayTrigger>
				</Row>
			</Form>
		);

		return (
			<Fragment>
				<Modal size="lg" show={this.props.show} onHide={this.props.onHide} >
					<Modal.Header closeButton>
						<Modal.Title as="h3">
							{`Edit Cohort: ${this.props.title}`}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{content}
					</Modal.Body>
					<Modal.Footer>
						<ButtonGroup>
							<Button onClick={() => {
								this.setState({
									showDeleteModal: true
								});
							}} variant="danger">Delete</Button>
							<Button
								onClick={this.props.onHide}
							>Cancel</Button>
							<Button
								variant="success"
								disabled={this.state.disabled}
								onClick={this.handleUpdate}
							>Save</Button>
						</ButtonGroup>
					</Modal.Footer>
				</Modal>
				<ConfirmModal
					show={this.state.showDeleteModal}
					close={this.closeDeleteModal}
					message="Are you sure that you want to delete this cohort?"
					title="Delete?"
					onDelete={this.handleDelete}
				/>
			</Fragment>
		);
	}
}


// PROPERTIES //

EditCohortModal.propTypes = {
	endDate: PropTypes.string,
	members: PropTypes.array.isRequired,
	onDelete: PropTypes.func,
	onHide: PropTypes.func.isRequired,
	onUpdate: PropTypes.func,
	show: PropTypes.bool.isRequired,
	startDate: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired
};

EditCohortModal.defaultProps = {
	endDate: null,
	onUpdate() {},
	onDelete() {}
};


// EXPORTS //

export default EditCohortModal;
