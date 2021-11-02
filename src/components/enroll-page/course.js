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
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import FormGroup from 'react-bootstrap/FormGroup';
import FormCheck from 'react-bootstrap/FormCheck';
import sqrt from '@stdlib/math/base/special/sqrt';
import floor from '@stdlib/math/base/special/floor';
import server from 'constants/server';


// FUNCTIONS //

function renderUserBadge( user, idx ) {
	if ( !user ) {
		return null;
	}
	return ( <Col key={`owner-${idx}`} className="enroll-page-course-teacher" >
		<img className="enroll-page-course-teacher-thumbnail" src={server + '/thumbnail/' + user.picture} alt="Lesson Thumbnail" />
		<span className="enroll-page-course-teacher-info">
			<span className="enroll-page-courses-teacher-name">{user.name}</span>
			<br />
			<span className="enroll-page-course-teacher-email">
				<a href={'mailto:' + user.email} >{user.email}</a>
			</span>
		</span>
	</Col> );
}


// MAIN //

class Course extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showModal: false,
			checked: null
		};
	}

	renderOwners() {
		const profiles = [];
		const owners = this.props.namespace.owners.filter( x => x.writeAccess );
		const colsPerRow = floor( sqrt( owners.length ) );
		for ( let i = 0; i < owners.length; i += colsPerRow ) {
			const row = [];
			for ( let j = 0; j < colsPerRow; j++ ) {
				row[ j ] = renderUserBadge( owners[ i+j ], i+j );
			}
			profiles.push(
				<Row key={`row-${i}`} >
					{row}
				</Row>
			);
		}
		return (
			<div className="enroll-page-course-owner-wrapper" >
				<Container className="enroll-page-course-owners">
					{profiles}
				</Container>
			</div>
		);
	}

	handleEnroll = () => {
		const cohortID = this.props.cohorts[ this.state.checked ]._id;
		this.props.addUserToCohort( cohortID, this.props.namespace );
		this.setState({
			showModal: false
		});
	};

	handleFormClick = ( event ) => {
		const check = event.target.checked;
		const pos = event.target.dataset.pos;
		if ( check ) {
			this.setState({
				checked: Number(pos)
			});
		}
	};

	renderAvailableCohorts() {
		const list = [];
		for ( let i = 0; i < this.props.cohorts.length; i++) {
			const cohort = this.props.cohorts[ i ];
			const from = new Date( cohort.startDate ).toLocaleDateString();
			const to = new Date( cohort.endDate ).toLocaleDateString();
			const label = <Fragment>
					<span>{cohort.title}</span><span className="enroll-cohort-date">{from} - {to}</span>
				</Fragment>;
			list.push(
				<FormCheck
					id={i} key={i} data-pos={i} type="radio"
					checked={this.state.checked===i} label={label} name="radioGroup"
					onChange={this.handleFormClick}
				/>
			);
		}
		return list;
	}

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal
		});
	};

	render() {
		const { t } = this.props;
		let cardClassName = 'enroll-page-course-item';
		let buttonText = t('common:enroll');
		if ( this.props.enrollable === false ) {
			cardClassName = 'enroll-item-deactivated';
			buttonText = t('already-enrolled');
		}
		return (
			<Fragment>
				<div className={cardClassName}>
					<h1>{this.props.namespace.title}</h1>
					<div className="enroll-page-course-description">
						{this.props.namespace.description}
					</div>
					{this.renderOwners()}
					<Button
						size="sm" className="enroll-button"
						disabled={!this.props.enrollable}
						onClick={this.toggleModal}
					>{ buttonText }</Button>
				</div>
				<Modal onHide={this.toggleModal} show={this.state.showModal}>
					<Modal.Header closeButton>
						<h1>{this.props.namespace.title}</h1>
					</Modal.Header>
					<Modal.Body>
						<div className="enroll-page-cohort-information">
							({t('select-cohort')})
						</div>
						<div className="enroll-page-cohorts-list">
							<FormGroup>
								{this.renderAvailableCohorts(this.props.cohorts)}
							</FormGroup>
						</div>
						<Button onClick={this.handleEnroll} size="sm" className="enroll-button-modal">{t('enroll-in-course')}</Button>
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
	enrollable: PropTypes.bool.isRequired,
	namespace: PropTypes.object.isRequired,
	t: PropTypes.func.isRequired
};


// EXPORTS //

export default Course;
