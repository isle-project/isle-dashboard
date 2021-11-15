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

import React, { useCallback, useState, Fragment } from 'react';
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

/**
 * A component which displays a user badge.
 *
 * @param {Object} props - component properties
 * @param {Object} props.user - user object
 * @param {number} props.idx - index of the user
 * @returns {ReactElement} badge component
 */
const UserBadge = ({ user, idx }) => {
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
};

/**
 * A component which displays a list of available cohorts.
 *
 * @param {Object} props - component properties
 * @param {ObjectArray} props.cohorts - list of available cohorts
 * @param {Function} props.onCohortSelect - callback to handle cohort selection
 * @param {boolean} props.checked - indicates whether a cohort is selected
 * @returns {ReactElement} cohort list component
 */
const AvailableCohorts = ( props ) => {
	const list = [];
	for ( let i = 0; i < props.cohorts.length; i++) {
		const cohort = props.cohorts[ i ];
		const from = new Date( cohort.startDate ).toLocaleDateString();
		const to = new Date( cohort.endDate ).toLocaleDateString();
		const label = <Fragment>
				<span>{cohort.title}</span><span className="enroll-cohort-date">{from} - {to}</span>
			</Fragment>;
		list.push(
			<FormCheck
				id={i} key={i} data-pos={i} type="radio"
				checked={props.checked===i} label={label} name="radioGroup"
				onChange={props.onCohortSelect}
			/>
		);
	}
	return list;
};

/**
 * A component which displays a modal window for enrolling a user.
 *
 * @param {Object} props - component properties
 * @param {boolean} props.show - indicates whether the modal is visible
 * @param {Function} props.onHide - callback to handle hiding the modal
 * @param {Function} props.onCohortSelect - callback to handle cohort selection
 * @param {ObjectArray} props.cohorts - list of available cohorts
 * @param {Object} props.namespace - namespace object
 * @param {Function} props.onEnroll - callback to handle enrolling a user
 * @param {Function} props.t - translation function
 * @returns {ReactElement} modal component
 */
const EnrollModal = ( props ) => {
	return (
		<Modal onHide={props.onHide} show={props.show}>
			<Modal.Header closeButton>
				<h1>{props.namespace.title}</h1>
			</Modal.Header>
			<Modal.Body>
				<div className="enroll-page-cohort-information">
					({props.t('select-cohort')})
				</div>
				<div className="enroll-page-cohorts-list">
					<FormGroup>
						<AvailableCohorts
							cohorts={props.cohorts}
							onCohortSelect={props.onCohortSelect}
							checked={props.checked}
						/>
					</FormGroup>
				</div>
				<Button onClick={props.onEnroll} size="sm" className="enroll-button-modal">
					{props.t('enroll-in-course')}
				</Button>
			</Modal.Body>
		</Modal>
	);
};

/**
 * A component which displays a list of course owners.
 *
 * @param {Object} props - component properties
 * @param {Object} props.namespace - namespace object
 * @returns {ReactElement} owner list component
 */
const OwnersList = ( props ) => {
	const profiles = [];
	const owners = props.namespace.owners.filter( x => x.writeAccess );
	const colsPerRow = floor( sqrt( owners.length ) );
	for ( let i = 0; i < owners.length; i += colsPerRow ) {
		const row = [];
		for ( let j = 0; j < colsPerRow; j++ ) {
			row[ j ] = <UserBadge user={owners[ i+j ]} idx={i+j} key={`badge-${i+j}`} />;
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
};


// MAIN //

/**
 * A component which displays a course.
 *
 * @param {Object} props - component properties
 * @param {Object} props.namespace - namespace object
 * @param {ObjectArray} props.cohorts - list of available cohorts
 * @param {boolean} props.enrollable - indicates whether the user can enroll in the course
 * @param {Function} props.addUserToCohort - callback to handle adding a user to a cohort
 * @param {Function} props.t - translation function
 * @returns {ReactElement} course component
 */
const Course = ({ cohorts, namespace, enrollable, addUserToCohort, t }) => {
	const [ checked, setChecked ] = useState( false );
	const [ showModal, setShowModal ] = useState( false );
	const handleEnroll = useCallback( () => {
		const cohortID = cohorts[ checked ]._id;
		addUserToCohort( cohortID, namespace );
		setShowModal( false );
	}, [ checked, cohorts, namespace, addUserToCohort ] );
	const toggleModal = useCallback( () => {
		setShowModal( !showModal );
	}, [ showModal ] );
	const handleCohortSelect = useCallback( ( event ) => {
		const check = event.target.checked;
		const pos = event.target.dataset.pos;
		if ( check ) {
			setChecked( Number( pos ) );
		}
	}, [] );

	let cardClassName = 'enroll-page-course-item';
	let buttonText = t('common:enroll');
	if ( enrollable === false ) {
		cardClassName = 'enroll-item-deactivated';
		buttonText = t('already-enrolled');
	}
	return (
		<Fragment>
			<div className={cardClassName}>
				<h1>{namespace.title}</h1>
				<div className="enroll-page-course-description">
					{namespace.description}
				</div>
				<OwnersList namespace={namespace} />
				<Button
					size="sm" className="enroll-button"
					disabled={!enrollable}
					onClick={toggleModal}
				>{ buttonText }</Button>
			</div>
			<EnrollModal
				namespace={namespace} cohorts={cohorts}
				onHide={toggleModal} show={showModal}
				onEnroll={handleEnroll}
				onCohortSelect={handleCohortSelect}
				checked={checked}
				t={t}
			/>
		</Fragment>
	);
};


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
