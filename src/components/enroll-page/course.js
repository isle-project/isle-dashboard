// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form, FormGroup, FormCheck } from 'react-bootstrap';
import server from 'constants/server';

// VARIABLES //


// MAIN //

class Course extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showModal: false,
			checked: null
		};
	}

	componentDidMount() {
	}

	renderOwners() {
		let profiles = [];
		let owners = this.props.owners;
		for (let i = 0; i < owners.length; i++) {
			if (owners[i].writeAccess === true) {
				let user = owners[i];
				profiles.push(
					<div className="enroll-page-course-teacher">
						<img src={server + '/thumbnail/' + user.picture} />
						<div className="enroll-page-course-teacher-info">
							<div className="enroll-page-courses-teacher-name">{user.name}</div>
							<div className="enroll-page-course-teacher-email">
							<a href={'mailto:' + user.email}>{user.email}</a>
							</div>
						</div>
					</div>
				);
			}
		}

		return (
			<div className="enroll-page-course-owners">
				{profiles}
			</div>
		);
	}

	handleEnroll = (event) => {
		let cohortID = this.props.cohorts[this.state.checked]._id;

		this.props.addUserToCohort(cohortID, this.props.user.token, this.props.namespace, () => {
			this.setState({
				showModal: false
			});
		});
	}


	handleFormClick = (event) => {
		const check = event.target.checked;
		const pos = event.target.dataset.pos;
		if (check) {
			this.setState({
				checked: Number(pos)
			});
		}
	}

	renderAvailableCohorts() {
		let list = [];

		for ( let i = 0; i < this.props.cohorts.length; i++) {
			let cohort = this.props.cohorts[i];
			list.push(
				<Form onClick={this.handleFormClick}>
					<FormCheck id={i} data-pos={i} type="radio" checked={this.state.checked===i} label={cohort.title} name="radioGroup" />
				</Form>
			);
		}
		return list;
	}

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal
		});
	}

	render() {
		let cardClassName = 'enroll-page-course-item';
		let buttonText = 'ENROLL';

		if (this.props.enrollable === false) {
			cardClassName = 'enroll-item-deactivated';
			buttonText = 'ALREADY ENROLLED';
		}

		return (
			<Fragment>
			<div className={cardClassName}>
				<h1>{this.props.title}</h1>
				<div className="enroll-page-course-description">{this.props.description}</div>
				{ this.renderOwners() }
				<Button size="sm" className="enroll-button" disabled={!this.props.enrollable} onClick={this.toggleModal}>{ buttonText }</Button>
			</div>
				<Modal onHide={this.toggleModal} show={this.state.showModal}>
					<Modal.Header closeButton>
						<h1>{this.props.title}</h1>
					</Modal.Header>
					<Modal.Body>
						<div className="enroll-page-cohort-information">
							Please select the cohort you belong to.
						</div>
						<div className="enroll-page-cohorts-list">
							<FormGroup>
								{ this.renderAvailableCohorts(this.props.cohorts)}
							</FormGroup>
						</div>
						<Button onClick={this.handleEnroll} size="sm" className="enroll-button-modal">ENROLL TO THIS COURSE</Button>
					</Modal.Body>

				</Modal>
			</Fragment>
		);
	}
}


// PROPERTIES //

Course.propTypes = {
	addUserToCohort: PropTypes.func.isRequired,
	cohorts: PropTypes.array.isRequired,
	description: PropTypes.string.isRequired,
	enrollable: PropTypes.bool.isRequired,
	namespace: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	user: PropTypes.object.isRequired

};


// EXPORTS //

export default Course;
