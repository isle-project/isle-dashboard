/**
* Copyright (C) 2016-present The ISLE Authors
*
* The isle-dashboard program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FormLabel from 'react-bootstrap/FormLabel';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import isEmail from '@stdlib/assert/is-email-address';
import isArray from '@stdlib/assert/is-array';
import TextSelect from 'components/text-select';
import './cohort_modal.css';


// FUNCTIONS //

function validateInputs({ emails, title }) {
	let invalid = false;
	emails.forEach( owner => {
		if ( !isEmail( owner ) ) {
			invalid = true;
		}
	});
	if ( invalid ) {
		return false;
	}
	return title.length >= 4;
}


// MAIN //

class CreateCohortModal extends Component {
	constructor( props ) {
		super( props );

		const startDate = moment().startOf( 'day' );
		const endDate = moment()
			.add( 3, 'months' )
			.endOf( 'day' );
		const initialState = {
			startDate,
			endDate,
			disabled: true,
			students: [],
			private: false,
			emailFilter: '',
			title: ''
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
	};

	onCreate = () => {
		const cohort = {
			emailFilter: this.state.emailFilter,
			title: this.state.title,
			startDate: this.state.startDate.startOf( 'day' ).toDate(),
			endDate: this.state.endDate.endOf( 'day' ).toDate(),
			private: this.state.private,
			students: this.state.students.join( ',' )
		};
		this.props.onCreate( cohort );
	};

	handleStudentChange = ( newValue ) => {
		const students = isArray( newValue ) ? newValue.map( x => x.value ) : [];
		this.setState({
			students: students,
			disabled: !validateInputs({
				emails: students,
				title: this.state.title
			})
		});
	};

	renderBody() {
		const { t } = this.props;
		return ( <Form style={{ paddingLeft: 20, paddingRight: 20 }}>
			<Row>
				<Col md={6}>
					<OverlayTrigger placement="right" overlay={<Tooltip id="titleTooltip">{t('cohort-title-tooltip')}</Tooltip>}>
						<FormGroup>
							<FormLabel>{t('common:title')}</FormLabel>
							<FormControl
								name="title"
								type="text"
								placeholder={t('cohort-title-placeholder')}
								onChange={this.handleInputChange}
							/>
						</FormGroup>
					</OverlayTrigger>
				</Col>
				<Col md={6}>
					<FormGroup>
						<FormLabel>{t('cohort-period')}</FormLabel>
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
					</FormGroup>
				</Col>
			</Row>
			<hr />
			<Row>
				<OverlayTrigger placement="right" overlay={<Tooltip id="enrolledTooltip">{t('enrolled-tooltip')}</Tooltip>}>
					<FormGroup className="cohort-modal-enrolled-group" >
						<FormLabel>{t('enrolled-students')}</FormLabel>
						<TextSelect
							placeholder={t('enter-emails')}
							onChange={this.handleStudentChange}
							defaultValue={this.state.students}
							isClearable
							styles={{
								control: () => ({
									width: '100%'
								})
							}}
						/>
					</FormGroup>
				</OverlayTrigger>
			</Row>
			<hr />
			<Row>
				<OverlayTrigger placement="left" overlay={<Tooltip id="preventTooltip">{t('prevent-tooltip')}</Tooltip>}>
					<FormCheck checked={this.state.private} onChange={() => {
						this.setState({
							private: !this.state.private
						});
					}} type="checkbox" label={t('prevent-label')} />
				</OverlayTrigger>
			</Row>
			<hr />
			<Row>
				<OverlayTrigger placement="right" overlay={<Tooltip id="filterTooltip">{t('filter-tooltip')}</Tooltip>}>
					<FormGroup>
						<FormLabel>{t('email-filter')}</FormLabel>
						<FormControl
							style={{ width: '25vw' }}
							name="emailFilter"
							type="text"
							placeholder={t('filter-placeholder')}
							onChange={this.handleInputChange}
						/>
					</FormGroup>
				</OverlayTrigger>
			</Row>
		</Form> );
	}

	render() {
		const { t } = this.props;
		return (
			<Modal size="lg" show={this.props.show} onHide={this.onClose}>
				<Modal.Header closeButton>
					<Modal.Title as="h3">{t('create-new-cohort')}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.renderBody()}
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.onClose}>{t('common:cancel')}</Button>
					<Button variant="success" disabled={this.state.disabled} onClick={this.onCreate}>{t('common:create')}</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}


// PROPERTIES //

CreateCohortModal.propTypes = {
	close: PropTypes.func,
	onCreate: PropTypes.func,
	show: PropTypes.bool,
	t: PropTypes.func.isRequired
};

CreateCohortModal.defaultProps = {
	close() {},
	onCreate() {},
	show: false
};


// EXPORTS //

export default CreateCohortModal;
