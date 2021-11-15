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

import React, { useState } from 'react';
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

/**
 * Validate a list of emails and namespace title.
 *
 * @private
 * @param {Array<string>} emails - list of emails
 * @param {string} title - namespace title
 * @returns {boolean} boolean indicating whether the list of emails and namespace title are valid
 */
function validateInputs( emails, title ) {
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

/**
 * A modal for creating a new cohort.
 *
 * @param {Object} props - component properties
 * @param {boolean} props.show - boolean indicating whether the modal is visible
 * @param {Function} props.close - callback to invoke upon hiding the modal
 * @param {Function} props.onCreate - callback to invoke upon creating a new cohort
 * @param {Function} props.t - i18n translation function
 * @returns {ReactElement} modal dialog
 */
const CreateCohortModal = ({ close, onCreate, show, t }) => {
	const [ title, setTitle ] = useState( '' );
	const [ emailFilter, setEmailFilter ] = useState( '' );
	const [ dates, setDates ] = useState({
		start: moment()
			.startOf( 'day' ),
		end: moment()
			.add( 3, 'months' )
			.endOf( 'day' )
	});
	const [ isPrivate, setIsPrivate ] = useState( false );
	const [ students, setStudents ] = useState( [] );
	const [ focusedInput, setFocusedInput ] = useState( null );

	const handleClose = () => {
		close();
	};
	const handleCreate = () => {
		const cohort = {
			emailFilter,
			title,
			startDate: dates.start.startOf( 'day' ).toDate(),
			endDate: dates.end.endOf( 'day' ).toDate(),
			private: isPrivate,
			students: students.join( ',' )
		};
		onCreate( cohort );
	};
	const disabled = !validateInputs( students, title );
	const body = <Form style={{ paddingLeft: 20, paddingRight: 20 }}>
		<Row>
			<Col md={6}>
				<OverlayTrigger placement="right" overlay={<Tooltip id="titleTooltip">{t('cohort-title-tooltip')}</Tooltip>}>
					<FormGroup>
						<FormLabel>{t('common:title')}</FormLabel>
						<FormControl
							name="title"
							type="text"
							placeholder={t('cohort-title-placeholder')}
							onChange={( event ) => setTitle( event.target.value )}
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
						startDate={dates.start}
						endDate={dates.end}
						onDatesChange={({ startDate, endDate }) => {
							setDates({ start: startDate, end: endDate });
						}}
						focusedInput={focusedInput}
						onFocusChange={setFocusedInput}
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
						onChange={( newValue ) => {
							const newStudents = isArray( newValue ) ? newValue.map( x => x.value ) : [];
							setStudents( newStudents );
						}}
						defaultValue={students}
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
				<FormCheck checked={isPrivate} onChange={() => {
					setIsPrivate( !isPrivate );
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
						onChange={( event ) => setEmailFilter( event.target.value )}
					/>
				</FormGroup>
			</OverlayTrigger>
		</Row>
	</Form>;
	return (
		<Modal size="lg" show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title as="h3">{t('create-new-cohort')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{body}
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={handleClose}>
					{t('common:cancel')}
				</Button>
				<Button variant="success" disabled={disabled} onClick={handleCreate} >
					{t('common:create')}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};


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
