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
import { withTranslation } from 'react-i18next';
import {
	Alert, Badge, Button, ButtonGroup, Card, Container, Col, Row, FormLabel, FormControl, FormGroup, Form, ListGroup, ListGroupItem, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import 'react-dates/lib/css/_datepicker.css';
import { withRouter } from 'react-router';
import isArray from '@stdlib/assert/is-array';
import trim from '@stdlib/string/trim';
import TextSelect from 'components/text-select';
import MsgModal from 'components/message-modal';
import ConfirmModal from 'components/confirm-modal';
import { validateOwners, validateDescription, validateTitle } from 'components/create-namespace';
import checkURLPath from 'utils/check_url_path.js';
import EditCohortModal from './edit_cohort_modal.js';
import CreateCohortModal from './create_cohort_modal.js';
import SERVER from 'constants/server';
import './edit_namespace.css';


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
		});
	}

	handleUpdate = () => {
		this.props.updateCurrentNamespace({
			_id: this.props.namespace._id,
			description: this.state.description,
			title: this.state.title,
			owners: this.state.owners
		});
	}

	handleDelete = () => {
		this.props.deleteCurrentNamespace( this.props.namespace._id, this.props.history );
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
		this.props.createCohort( cohort, this.props.namespace._id );
		this.closeCreateCohortModal();
	}

	deleteCohort = ( cohortID ) => {
		this.props.deleteCohort( cohortID, this.props.namespace._id );
	}

	updateCohort = ( cohort ) => {
		this.props.updateCohort( cohort, this.props.namespace._id );
	}

	handleOwnerChange = ( newValue ) => {
		if ( !newValue ) {
			return this.setState({
				owners: []
			});
		}
		const owners = newValue.map( x => trim( x.value ) );
		this.setState({
			owners: owners
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
		const { t } = this.props;
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
					message={t('delete-course')}
					title={`${t('delete')}?`}
					onConfirm={this.handleDelete}
				/>
				{ this.state.showCreateCohortModal ? <CreateCohortModal
					show={this.state.showCreateCohortModal}
					close={this.closeCreateCohortModal}
					onCreate={this.createCohort}
				/> : null }
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
		const { t } = this.props;
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
							({t('no-students')}:
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
		const { t } = this.props;
		if ( !this.props.namespace._id ) {
			return ( <Container className="edit-namespace-container" >
				<Alert variant="danger">{t('no-course-selected')}</Alert>
			</Container> );
		}
		const validTitle = validateTitle( this.state.title );
		const invalidTitleChars = checkURLPath( this.state.title );
		const validDescription = validateDescription( this.state.description );
		const validOwners = validateOwners( this.state.owners );
		return (
			<Container className="edit-namespace-container" >
				<Row>
					<Col md={6} >
						<Card>
							<Card.Header>
								<Card.Title as="h2">
									{t('edit-course')}
								</Card.Title>
							</Card.Header>
							<Card.Body>
								<Form style={{ padding: '20px' }}>
									<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">{t('owner-tooltip')}</Tooltip>}>
										<FormGroup>
											<FormLabel>{t('common:owners')}</FormLabel>
											<TextSelect
												onChange={this.handleOwnerChange}
												defaultValue={this.state.owners}
												isInvalid={!validateOwners( this.state.owners )}
											/>
											<FormControl.Feedback type="invalid">
												{t('invalid-owners')}
											</FormControl.Feedback>
										</FormGroup>
									</OverlayTrigger>
									<OverlayTrigger placement="right" overlay={<Tooltip id="courseTooltip">{t('accessible-at')}<code>{SERVER+'/<course>/<lesson>'}</code></Tooltip>}>
										<FormGroup>
											<FormLabel>{t('course-identifier')}</FormLabel>
											<FormControl
												name="title"
												type="text"
												value={this.state.title}
												onChange={this.handleInputChange}
												isInvalid={!validTitle}
											/>
											<FormControl.Feedback type="invalid">
												{ invalidTitleChars ?
													'Course identifier contains invalid character(s): '+invalidTitleChars[ 0 ] :
													'Course identifier must be at least three characters long and should not contain any spaces.'
												}
											</FormControl.Feedback>
										</FormGroup>
									</OverlayTrigger>
									<OverlayTrigger placement="right" overlay={<Tooltip id="titleTooltip">{t('title-tooltip')}</Tooltip>}>
										<FormGroup>
											<FormLabel>{t('title-description')}</FormLabel>
											<FormControl
												name="description"
												type="text"
												value={this.state.description}
												onChange={this.handleInputChange}
												isInvalid={!validDescription}
											>
											</FormControl>
											<FormControl.Feedback type="invalid">
												{t('invalid-description')}
											</FormControl.Feedback>
										</FormGroup>
									</OverlayTrigger>
								</Form>
								<ButtonGroup>
									<Button
										type="submit"
										disabled={!validOwners || !validTitle || !validDescription}
										onClick={this.handleUpdate}
									>{t('common:update')}</Button>
									<Button onClick={() => {
										this.setState({
											showDeleteModal: true
										});
									}} variant="danger">{t('common:delete')}</Button>
								</ButtonGroup>
							</Card.Body>
							{ this.renderModals() }
						</Card>
					</Col>
					<Col md={6} >
						<Card>
							<Card.Header>
								<Card.Title as="h2">{t('manage-cohorts')}
									<Button size="small" variant="success" style={{ float: 'right', marginTop: 7 }}
										onClick={() => {
											this.setState({
												showCreateCohortModal: true
											});
										}}
									>
										{t('create-cohort')}
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
	history: PropTypes.object.isRequired,
	namespace: PropTypes.object.isRequired,
	t: PropTypes.func.isRequired,
	updateCohort: PropTypes.func.isRequired,
	updateCurrentNamespace: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

EditNamespace.defaultProps = {
	cohorts: []
};


// EXPORTS //

export default withTranslation( [ 'namespace', 'common' ] )( withRouter( EditNamespace ) );
