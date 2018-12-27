// MODULES //

import React, { Component } from 'react';
import {
	Button, ButtonToolbar, FormLabel, Form, FormControl, FormGroup,
	OverlayTrigger, Row, Tooltip
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import ConfirmModal from './confirm_modal.js';


// MAIN //

class CohortPanel extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			disabled: false,
			startDate: moment( props.startDate ),
			endDate: moment( props.endDate ),
			title: props.title,
			students: props.students.join( ',' ),
			showDeleteModal: false
		};

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

		this.handleUpdate = () => {
			const updatedCohort = {
				_id: this.props.id,
				startDate: this.state.startDate.toDate(),
				endDate: this.state.endDate.toDate(),
				members: this.state.students,
				title: this.state.title
			};
			this.props.onUpdate( updatedCohort );
		};

		this.handleDelete = () => {
			this.props.onDelete( this.props.id );
			this.closeDeleteModal();
		};

		this.closeDeleteModal = () => {
			this.setState({
				showDeleteModal: false
			});
		};
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
							<FormControl
								name="students"
								componentClass="textarea"
								value={this.state.students}
								onChange={this.handleInputChange}
							/>
						</FormGroup>
					</OverlayTrigger>
				</Row>
				<Row>
					<ButtonToolbar>
						<Button
							disabled={this.state.disabled}
							onClick={this.handleUpdate}
						>Save</Button>
						<Button onClick={() => {
							this.setState({
								showDeleteModal: true
							});
						}} bsStyle="danger">Delete</Button>
					</ButtonToolbar>
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

// PROPERTY TYPES //

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
