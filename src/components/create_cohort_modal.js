// MODULES //

import React, { Component } from 'react';
import {
	Button, Col, ControlLabel, Form, FormControl,
	FormGroup, OverlayTrigger, Modal, Row, Tooltip
} from 'react-bootstrap';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import PropTypes from 'prop-types';


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
			students: ''
		};
		this.state = initialState;

		this.handleInputChange = ( event ) => {
			const target = event.target;
			const name = target.name;
			let value = target.value;

			if ( name === 'students' ) {
				value = value.replace( /\s/g, '' );
			}
			this.setState({
				[ name ]: value
			}, () => {
				let { title } = this.state;
				if ( title.length > 4 ) {
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

		this.onCreate = () => {
			const cohort = {
				title: this.state.title,
				startDate: this.state.startDate.toDate(),
				endDate: this.state.endDate.toDate(),
				students: this.state.students
			};
			this.props.onCreate( cohort );
		};

		this.onClose = () => {
			this.setState( initialState );
			this.props.close();
		};
	}

	render() {
		return (
			<Modal show={this.props.show} onHide={this.onClose}>
				<Modal.Header>
					<Modal.Title>Create a new Cohort</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form horizontal style={{ paddingLeft: 20, paddingRight: 20 }}>
						<Row>
							<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Please enter the name of the cohort.</Tooltip>}>
								<FormGroup>
									<Col componentClass={ControlLabel} sm={2}>Title</Col>
									<Col sm={10}>
										<FormControl
											name="title"
											type="text"
											placeholder="Enter title"
											onChange={this.handleInputChange}
										/>
									</Col>
								</FormGroup>
							</OverlayTrigger>
						</Row>
						<Row>
							<FormGroup>
								<Col componentClass={ControlLabel} sm={2}>From ... To </Col>
								<Col sm={10}>
									<DateRangePicker
										startDate={this.state.startDate}
										endDate={this.state.endDate}
										onDatesChange={({ startDate, endDate }) =>
											this.setState({ startDate, endDate })
										}
										focusedInput={this.state.focusedInput}
										onFocusChange={focusedInput => this.setState({ focusedInput })}
									/>
								</Col>
							</FormGroup>
						</Row>
						<Row>
							<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">Comma-separated list of email addresses denoting the students for this cohort</Tooltip>}>
								<FormGroup>
									<Col componentClass={ControlLabel} sm={2}>Enrolled Students</Col>
									<Col sm={10}>
										<FormControl
											name="students"
											componentClass="textarea"
											value={this.state.students}
											onChange={this.handleInputChange}
										/>
									</Col>
								</FormGroup>
							</OverlayTrigger>
						</Row>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.onClose}>Cancel</Button>
					<Button bsStyle="success" disabled={this.state.disabled} onClick={this.onCreate}>Create</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

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
