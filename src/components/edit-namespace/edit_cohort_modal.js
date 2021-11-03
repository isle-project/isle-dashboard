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

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import logger from 'debug';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import FormControl from 'react-bootstrap/FormControl';
import FormCheck from 'react-bootstrap/FormCheck';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import isEmail from '@stdlib/assert/is-email-address';
import isArray from '@stdlib/assert/is-array';
import ConfirmModal from 'components/confirm-modal';
import TextSelect from 'components/text-select';
import 'react-dates/lib/css/_datepicker.css';
import './cohort_modal.css';


// VARIABLES //

const debug = logger( 'isle-dashboard:edit-cohort' );


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

class EditCohortModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			disabled: false,
			startDate: moment( props.startDate ),
			endDate: moment( props.endDate ),
			title: props.title,
			members: props.members.map( user => user.email ),
			showDeleteModal: false,
			private: props.private,
			emailFilter: props.emailFilter
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
					emails: this.state.members,
					title: this.state.title
				})
			});
		});
	};

	handleUpdate = () => {
		const updatedCohort = {
			_id: this.props._id,
			emailFilter: this.state.emailFilter,
			startDate: this.state.startDate.startOf( 'day' ).toDate(),
			endDate: this.state.endDate.endOf( 'day' ).toDate(),
			members: this.state.members.join( ',' ),
			title: this.state.title,
			private: this.state.private
		};
		this.props.onUpdate( updatedCohort );
		this.props.onHide();
	};

	handleDelete = () => {
		this.props.onDelete( this.props._id );
		this.closeDeleteModal();
		this.props.onHide();
	};

	closeDeleteModal = () => {
		this.setState({
			showDeleteModal: false
		});
	};

	handleStudentChange = ( newValue ) => {
		debug( 'Handle change of cohort members...' );
		const members = isArray( newValue ) ? newValue.map( x => x.value ) : [];
		this.setState({
			members: members,
			disabled: !validateInputs({
				emails: members,
				title: this.state.title
			})
		});
	};

	render() {
		const { t } = this.props;
		const content = (
			<Form style={{ padding: '10px' }}>
				<Row>
					<Col md={6}>
						<OverlayTrigger placement="right" overlay={<Tooltip id="titleTooltip">{t('cohort-title-tooltip')}</Tooltip>}>
							<FormGroup>
								<FormLabel>{t('common:title')}</FormLabel>
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
							<FormLabel>{t('cohort-period')}</FormLabel>
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
				<hr />
				<Row>
					<OverlayTrigger placement="right" overlay={<Tooltip id="enrolledTooltip">{t('enrolled-tooltip')}</Tooltip>}>
						<FormGroup className="cohort-modal-enrolled-group" >
							<FormLabel>{t('enrolled-students')}</FormLabel>
							<TextSelect
								placeholder={t('enter-emails')}
								defaultValue={this.state.members}
								onChange={this.handleStudentChange}
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
					<FormCheck checked={this.state.private} onChange={(event) => {
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
							<FormControl style={{ width: '25vw' }}
								name="emailFilter"
								type="text"
								value={this.state.emailFilter}
								placeholder={t('filter-placeholder')}
								onChange={this.handleInputChange}
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
							{t('edit-cohort', { title: this.props.title })}
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
							}} variant="danger">{t('common:delete')}</Button>
							<Button
								onClick={this.props.onHide}
							>{t('common:cancel')}</Button>
							<Button
								variant="success"
								disabled={this.state.disabled}
								onClick={this.handleUpdate}
							>{t('common:save')}</Button>
						</ButtonGroup>
					</Modal.Footer>
				</Modal>
				<ConfirmModal
					show={this.state.showDeleteModal}
					close={this.closeDeleteModal}
					message={t('delete-cohort')}
					title={`${t('delete')}?`}
					onConfirm={this.handleDelete}
				/>
			</Fragment>
		);
	}
}


// PROPERTIES //

EditCohortModal.propTypes = {
	_id: PropTypes.string.isRequired,
	emailFilter: PropTypes.string.isRequired,
	endDate: PropTypes.string,
	members: PropTypes.array.isRequired,
	onDelete: PropTypes.func,
	onHide: PropTypes.func.isRequired,
	onUpdate: PropTypes.func,
	private: PropTypes.bool.isRequired,
	show: PropTypes.bool.isRequired,
	startDate: PropTypes.string.isRequired,
	t: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired
};

EditCohortModal.defaultProps = {
	endDate: null,
	onUpdate() {},
	onDelete() {}
};


// EXPORTS //

export default EditCohortModal;
