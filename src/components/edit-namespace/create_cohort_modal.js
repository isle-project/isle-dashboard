// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Button, Col, FormLabel, Form, FormControl,
	FormGroup, OverlayTrigger, Modal, Row, Tooltip
} from 'react-bootstrap';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import isEmail from '@stdlib/assert/is-email-address';
import TextSelect from '../text_select.js';


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

class CreateCohortModal extends Component {
	constructor( props ) {
		super( props );

		const startDate = moment();
		const endDate = moment().add( 3, 'months' );
		const initialState = {
			startDate,
			endDate,
			disabled: true,
			students: []
		};
		this.state = initialState;

		this.onClose = () => {
			this.setState( initialState );
			this.props.close();
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
					emails: this.state.students,
					title: this.state.title
				})
			});
		});
	}

	onCreate = () => {
		const cohort = {
			title: this.state.title,
			startDate: this.state.startDate.toDate(),
			endDate: this.state.endDate.toDate(),
			students: this.state.students.join( ',' )
		};
		this.props.onCreate( cohort );
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
		return (
			<Modal show={this.props.show} onHide={this.onClose}>
				<Modal.Header>
					<Modal.Title>Create a new Cohort</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form style={{ paddingLeft: 20, paddingRight: 20 }}>
						<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Please enter the name of the cohort.</Tooltip>}>
							<FormGroup>
								<Row>
									<Col sm={2}>
										<FormLabel>Title</FormLabel>
									</Col>
									<Col sm={10}>
										<FormControl
											name="title"
											type="text"
											placeholder="Enter title"
											onChange={this.handleInputChange}
										/>
									</Col>
								</Row>
							</FormGroup>
						</OverlayTrigger>
						<FormGroup>
							<Row>
								<Col sm={2}>
									<FormLabel>From ... To </FormLabel>
								</Col>
								<Col sm={10}>
									<DateRangePicker
										startDateId="start_date_input"
										endDateId="end_date_input"
										startDate={this.state.startDate}
										endDate={this.state.endDate}
										onDatesChange={({ startDate, endDate }) =>
											this.setState({ startDate, endDate })
										}
										focusedInput={this.state.focusedInput}
										onFocusChange={focusedInput => this.setState({ focusedInput })}
									/>
								</Col>
							</Row>
						</FormGroup>
						<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Comma-separated list of email addresses denoting the students for this cohort</Tooltip>}>
							<FormGroup>
								<Row>
									<Col sm={2}>
										<FormLabel>Enrolled Students</FormLabel>
									</Col>
									<Col sm={10}>
										<TextSelect
											onChange={this.handleStudentChange}
											defaultValue={this.state.students}
											isClearable
										/>
									</Col>
								</Row>
							</FormGroup>
						</OverlayTrigger>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.onClose}>Cancel</Button>
					<Button variant="success" disabled={this.state.disabled} onClick={this.onCreate}>Create</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}


// PROPERTY TYPES //

CreateCohortModal.propTypes = {
	close: PropTypes.func,
	onCreate: PropTypes.func,
	show: PropTypes.bool
};

CreateCohortModal.defaultProps = {
	close(){},
	onCreate(){},
	show: false
};


// EXPORTS //

export default CreateCohortModal;
