// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, FormGroup, FormCheck } from 'react-bootstrap';
// VARIABLES //


// MAIN //

class Course extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showModal: false
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
						{user.name}
						{ user.picture}
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

	renderAvailableCohorts() {
		let list = [];

		for ( let i = 0; i < this.props.cohorts.length; i++) {
			let cohort = this.props.cohorts[i];
			list.push(
				<FormCheck type="radio" label={cohort.title} name="radioGroup" />
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
		return (
			<Fragment>
			<div className="enroll-page-course-item">
				<h1>{this.props.title}</h1>
				<div className="enroll-page-course-description">{this.props.description}</div>
				{ this.renderOwners() }
				<Button onClick={this.toggleModal}>ENROLL</Button>
			</div>
				<Modal onHide={this.toggleModal} show={this.state.showModal}>
					<Modal.Header>
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
						<Button>ENROLL TO THIS COURSE</Button>
					</Modal.Body>

				</Modal>
			</Fragment>
		);
	}
}


// PROPERTIES //

Course.propTypes = {
	cohorts: PropTypes.array.isRequired,
	description: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired
};


// EXPORTS //

export default Course;
