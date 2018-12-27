// MODULES //

import React, { Component } from 'react';
import {
	Button, ButtonGroup, FormLabel, Form, FormControl, FormGroup,
	OverlayTrigger, Row, Tooltip
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import isEmail from '@stdlib/assert/is-email-address';
import ConfirmModal from './confirm_modal.js';
import TextSelect from './text_select.js';


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

class CohortPanel extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			disabled: false,
			startDate: moment( props.startDate ),
			endDate: moment( props.endDate ),
			title: props.title,
			students: props.students,
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
			_id: this.props.id,
			startDate: this.state.startDate.toDate(),
			endDate: this.state.endDate.toDate(),
			members: this.state.students.join( ',' ),
			title: this.state.title
		};
		this.props.onUpdate( updatedCohort );
	}

	handleDelete = () => {
		this.props.onDelete( this.props.id );
		this.closeDeleteModal();
	}

	closeDeleteModal = () => {
		this.setState({
			showDeleteModal: false
		});
	}

	handleStudentChange = ( newValue ) => {
		const students = newValue.map( x => x.value );
		this.setState({
			students: students,
			disabled: !validateInputs({
				emails: students,
				title: this.state.title
			})
		});
	}

	render() {
		const content = (
			<Form style={{ padding: '10px' }}>
				<Row>
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
				</Row>
				<Row>
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
				</Row>
				<Row>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Comma-separated list of email addresses denoting the students for this cohort</Tooltip>}>
						<FormGroup>
							<FormLabel>Enrolled Students</FormLabel>
							<TextSelect
								onChange={this.handleStudentChange}
								defaultValue={this.state.students}
							/>
						</FormGroup>
					</OverlayTrigger>
				</Row>
				<Row>
					<ButtonGroup>
						<Button
							disabled={this.state.disabled}
							onClick={this.handleUpdate}
						>Save</Button>
						<Button onClick={() => {
							this.setState({
								showDeleteModal: true
							});
						}} variant="danger">Delete</Button>
					</ButtonGroup>
				</Row>
				<ConfirmModal
					show={this.state.showDeleteModal}
					close={this.closeDeleteModal}
					message="Are you sure that you want to delete this cohort?"
					title="Delete?"
					onDelete={this.handleDelete}
				/>
			</Form>
		);
		return content;
	}
}


// PROPERTIES //

CohortPanel.propTypes = {
	endDate: PropTypes.string,
	onDelete: PropTypes.func,
	onUpdate: PropTypes.func,
	startDate: PropTypes.string.isRequired,
	students: PropTypes.array.isRequired,
	title: PropTypes.string.isRequired
};

CohortPanel.defaultProps = {
	endDate: null,
	onUpdate() {},
	onDelete() {}
};


// EXPORTS //

export default CohortPanel;
