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
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FormControl from 'react-bootstrap/FormControl';
import FormLabel from 'react-bootstrap/FormLabel';
import FormGroup from 'react-bootstrap/FormGroup';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import isArray from '@stdlib/assert/is-array';
import trim from '@stdlib/string/trim';
import TextSelect from 'components/text-select';
import MsgModal from 'components/message-modal';
import ConfirmModal from 'components/confirm-modal';
import { validateOwners, validateDescription, validateTitle } from 'components/create-namespace';
import checkURLPath from 'utils/check_url_path.js';
import EditCohortModal from './edit_cohort_modal.js';
import CreateCohortModal from './create_cohort_modal.js';
import ImportCourseModal from './import_course_modal.js';
import CompletionsPage  from './completions.js';
import SERVER from 'constants/server';
import 'react-dates/lib/css/_datepicker.css';
import './edit_namespace.css';


// MAIN //

class EditNamespace extends Component {
	constructor( props ) {
		super( props );
		let { title, description, owners, enableTicketing } = this.props.namespace;
		if ( isArray( owners ) ) {
			owners = owners.map( ( owner ) => {
				return owner.email;
			});
		}
		this.state = {
			title,
			description,
			owners,
			enableTicketing,
			showDeleteModal: false,
			showImportModal: false,
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
	};

	handleUpdate = () => {
		this.props.updateCurrentNamespace({
			_id: this.props.namespace._id,
			description: this.state.description,
			title: this.state.title,
			enableTicketing: this.state.enableTicketing,
			owners: this.state.owners
		});
	};

	handleDelete = () => {
		this.props.deleteCurrentNamespace( this.props.namespace._id, this.props.history );
	};

	close = () => {
		this.setState({
			showModal: false
		});
	};

	closeDeleteModal = () => {
		this.setState({
			showDeleteModal: false
		});
	};

	closeCreateCohortModal = () => {
		this.setState({
			showCreateCohortModal: false
		});
	};

	closeImportModal = () => {
		this.setState({
			showImportModal: false
		});
	};

	createCohort = ( cohort ) => {
		cohort.namespaceID = this.props.namespace._id;
		this.props.createCohort( cohort, this.props.namespace._id );
		this.closeCreateCohortModal();
	};

	deleteCohort = ( cohortID ) => {
		this.props.deleteCohort( cohortID, this.props.namespace._id );
	};

	updateCohort = ( cohort ) => {
		this.props.updateCohort( cohort, this.props.namespace._id );
	};

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
	};

	closeEditCohortModal = () => {
		this.setState({
			selectedCohort: null,
			showEditCohortModal: false
		});
	};

	cohortModalFactory = ( idx ) => {
		return () => {
			this.setState({
				selectedCohort: this.props.cohorts[ idx ],
				showEditCohortModal: true
			});
		};
	};

	renderModals() {
		const { t } = this.props;
		return (
			<Fragment>
				<MsgModal
					show={this.state.showModal}
					close={this.close}
					message={this.state.message}
					successful={this.state.successful}
					title={t('update-course')}
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
					t={this.props.t}
				/> : null }
				{ this.state.showImportModal ? <ImportCourseModal
					show={this.state.showImportModal}
					close={this.closeImportModal}
					namespaces={this.props.user.ownedNamespaces}
					targetNamespace={this.props.namespace}
					copyNamespaceLessons={this.props.copyNamespaceLessons}
					t={this.props.t}
				/> : null }
				{ this.state.showEditCohortModal ? <EditCohortModal
					show={this.state.showEditCohortModal}
					{...this.state.selectedCohort}
					onDelete={this.deleteCohort}
					onHide={this.closeEditCohortModal}
					onUpdate={this.updateCohort}
					t={this.props.t}
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
						<Badge bg="primary">{cohort.members.length}</Badge>
						<span style={{ color: 'black' }} >)</span>
						<Button size="sm" onClick={this.cohortModalFactory( idx )} style={{ float: 'right' }}>{t('common:edit')}</Button>
					</ListGroupItem>
				);
			})}
		</ListGroup> );
	}

	render() {
		const { t } = this.props;
		if ( !this.props.namespace._id ) {
			return ( <Container className="edit-namespace-container" >
				<Alert variant="danger">{t('common:no-course-selected')}</Alert>
			</Container> );
		}
		const validTitle = validateTitle( this.state.title );
		const invalidTitleChars = checkURLPath( this.state.title );
		const validDescription = validateDescription( this.state.description );
		const validOwners = validateOwners( this.state.owners );
		return (
			<Container className="edit-namespace-container" >
				<Row>
					<Col sm={9} >
						<Card>
							<Tabs defaultActiveKey="manage-cohorts" >
								<Tab eventKey="manage-cohorts" title={<h3>{t('manage-cohorts')}</h3>} style={{ padding: 12 }} >
									{this.renderCohortList()}
									<Button
										size="small"
										variant="success"
										style={{
											marginTop: 10, background: '#3c763d'
										}}
										onClick={() => {
											this.setState({
												showCreateCohortModal: true
											});
										}}
									>
										{t('create-cohort')}
									</Button>
								</Tab>
								<Tab eventKey="completions" title={<h3>{t('completions')}</h3>} >
									<CompletionsPage
										namespace={this.props.namespace}
										cohorts={this.props.cohorts}
									/>
								</Tab>
								<Tab eventKey="edit-course" title={<h3>{t('edit-course')}</h3>} style={{ padding: 12 }} >
									<Form style={{ padding: '20px' }} className="d-grid gap-3" >
										<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">{t('owner-tooltip')}</Tooltip>}>
											<FormGroup >
												<FormLabel htmlFor="owners-text-select" >{t('common:owners')}</FormLabel>
												<TextSelect
													id="owners-text-select"
													placeholder={t('enter-emails')}
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
											<FormGroup controlId="form-course" >
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
											<FormGroup controlId="form-description" >
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
										<Form.Check
											aria-label={t('enable-ticketing')}
											type="checkbox"
											label={t('enable-ticketing')}
											defaultChecked={this.state.enableTicketing}
											onChange={( event) => {
												this.setState({
													enableTicketing: event.target.checked
												});
											}}
										/>
									</Form>
									<Button
										type="submit"
										disabled={!validOwners || !validTitle || !validDescription}
										onClick={this.handleUpdate}
									>{t('common:update')}</Button>
									{this.renderModals()}
								</Tab>
								<Tab eventKey="permissions" title={<h3>{t('permissions')}</h3>} disabled >
								</Tab>
							</Tabs>
						</Card>
					</Col>
					<Col sm={3} >
						<Card>
							<Card.Body>
								<ButtonGroup vertical>
									<Button onClick={() => {
										this.setState({
											showImportModal: true
										});
									}} variant="outline-danger" >{t('import-existing-course')}</Button>
									<Button onClick={() => {
										this.setState({
											showDeleteModal: true
										});
									}} variant="outline-danger">{t('delete-namespace')}</Button>
								</ButtonGroup>
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
	copyNamespaceLessons: PropTypes.func.isRequired,
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

export default withTranslation( [ 'namespace', 'common' ] )( EditNamespace );
