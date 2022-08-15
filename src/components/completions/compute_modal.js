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

import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SelectInput from 'react-select';
import isArray from '@stdlib/assert/is-array';
import HelpfulLabel from './helpful_label.js';


// VARIABLES //

const MULTIPLES_POLICIES = [
	{ value: 'last', label: 'Last submitted value' },
	{ value: 'first', label: 'First submitted value' },
	{ value: 'pass-through', label: 'All submitted values' },
	{ value: 'max', label: 'Best submitted value' }
];


// MAIN //

const memberSelection =( member ) => {
	return { value: member.id, label: `${member.firstName} ${member.lastName} (${member.email})` };
};

function ComputeModal({ cohorts, metric, entity, level, show, onHide, computeCompletions, onCompute }) {
	const { t } = useTranslation([ 'completions', 'common' ]);
	const metricName = isArray( metric ) ? metric[ 0 ].name : metric.name;

	const [ formValues, setFormValues ] = useState({
		users: [],
		activeCohorts: {},
		policyOptions: {
			multiples: MULTIPLES_POLICIES[ 0 ]
		}
	});
	const FORM_STORAGE_KEY = `ISLE?level=${level}&metric=${metricName}`;
	useEffect( () => {
		let oldFormValues = localStorage.getItem( FORM_STORAGE_KEY );
		if ( oldFormValues ) {
			oldFormValues = JSON.parse( oldFormValues );
			if ( oldFormValues.policyOptions?.timeFilter ) {
				oldFormValues.policyOptions.timeFilter = oldFormValues.policyOptions.timeFilter.map( x => new Date( x ) );
			}
			setFormValues( oldFormValues );
		}
	}, [ FORM_STORAGE_KEY ] );
	const onTimeChange = useCallback( ( dates ) => {
		const newFormValues = { ...formValues };
		if ( dates ) {
			newFormValues.policyOptions.timeFilter = dates;
		} else {
			delete newFormValues.policyOptions.timeFilter;
		}
		setFormValues( newFormValues );
	}, [ formValues ] );
	const handleMultiplesPolicyChange = useCallback( ( multiples ) => {
		const newFormValues = { ...formValues };
		newFormValues.policyOptions.multiples = multiples;
		setFormValues( newFormValues );
	}, [ formValues ] );
	const handleCompute = useCallback( () => {
		const policyOptions = {
			...formValues.policyOptions,
			multiples: formValues.policyOptions.multiples.value
		};
		if ( formValues.policyOptions.timeFilter ) {
			policyOptions.timeFilter = formValues.policyOptions.timeFilter.map( x => x.getTime() );
		}
		localStorage.setItem( FORM_STORAGE_KEY, JSON.stringify( formValues ) );
		const body = {
			ids: isArray( entity ) ? entity.map( x => x._id ) : [ entity._id ],
			users: formValues.users.map( x => x.value ),
			metric: metric,
			policyOptions
		};
		computeCompletions( body ).then( onCompute );
	}, [ metric, entity, formValues, FORM_STORAGE_KEY, computeCompletions, onCompute ] );
	const users = cohorts.reduce( ( userList, cohort ) => {
		const members = cohort.members.map( member => memberSelection(member) );
		return userList.concat( members );
	}, [] );
	const selectOptions = [
		{ value: { category: 'all', members: users }, label: t( 'All users' ) },
		...( cohorts.length > 1 ? cohorts.map( cohort => {
			return { value: { category: 'cohort', id: cohort._id, members: cohort.members }, label: 'Cohort ' + cohort.title };
		}) : [] )
	].concat( users );

	const userSelectStyles = {
		option: ( styles, { data }) => {
			if ( data.value.category === 'cohort' && formValues.activeCohorts[ data.value.id ] ) {
				return {
					...styles,
					':before': {
						content: '"\u2713 "'
					}
				};
			}
			return styles;
		}
	};
	const handleUserSelectChange = useCallback( ( value ) => {
		if ( !value ) {
			setFormValues( {
				...formValues,
				users: []
			});
			return;
		}
		if ( value.some( x => x.value.category === 'all' ) ) {
			setFormValues({
				...formValues,
				users: users,
				activeCohorts: {}
			});
			return;
		}
		const selectedUsersSet= new Set();
		const removeIds = new Set();
		const newValue = [];
		const newActiveCohorts = Object.assign( {}, formValues.activeCohorts );
		for ( let i = 0; i < value.length; i++ ) {
			if ( value[ i ].value.category === 'cohort' ) {
				if ( !formValues.activeCohorts[ value[i].value.id ] ) {
					newActiveCohorts[ value[i].value.id ] = true;
					for ( let j = 0; j < value[ i ].value.members.length; ++j ) {
						if ( !selectedUsersSet.has( value[ i ].value.members[ j ].id ) ) {
							const member = value[ i ].value.members[ j ];
							newValue.push( memberSelection( member ) );
							selectedUsersSet.add( member.id );
						}
					}
				} else {
					newActiveCohorts[ value[i].value.id ] = false;
					value[ i ].value.members.forEach( member => {
						removeIds.add( member.id );
					});
				}
			}
			else if ( !selectedUsersSet.has( value[ i ].value ) ) {
				newValue.push( value[ i ] );
				selectedUsersSet.add( value[ i ].value );
			}
		}
		setFormValues({
			...formValues,
			users: newValue.filter( x => !removeIds.has( x.value ) ),
			activeCohorts: newActiveCohorts
		});
	}, [ formValues, users ] );
	return (
		<Modal size="lg" show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title as="h3">{t('calculate-scores-for', { metric: metricName })}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container>
					<Form.Group className="mb-2" as={Row} controlId="multiplesPolicy" >
						<HelpfulLabel colWidth={3} name={t('multiples-policy')} description={t('multiples-policy-tooltip')} />
						<Col sm={9} >
							<SelectInput value={formValues.policyOptions.multiples} options={MULTIPLES_POLICIES} onChange={handleMultiplesPolicyChange} />
						</Col>
					</Form.Group>
					<Form.Group className="mb-2" as={Row} controlId="timeFilter" >
						<HelpfulLabel colWidth={3} name={t('time-filter')} description={t('time-filter-tooltip')} />
						<Col sm={9} >
							<DateTimeRangePicker onChange={onTimeChange} value={formValues.policyOptions.timeFilter} />
						</Col>
					</Form.Group>
					<Form.Group className="mb-2" as={Row} controlId="users" >
						<HelpfulLabel colWidth={3} name={t('common:users')} description={t('users-tooltip')} />
						<Col sm={9} >
							<SelectInput
								value={formValues.users} isMulti
								options={selectOptions} onChange={handleUserSelectChange}
								hideSelectedOptions={true}
								styles={userSelectStyles}
								placeholder={t('common:select-users-placeholder')}
							/>
						</Col>
					</Form.Group>
				</Container>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={onHide}>
					{t('common:cancel')}
				</Button>
				<Button variant="success" onClick={handleCompute} disabled={formValues.users.length === 0}>
					{t('common:compute')}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}


// PROPERTIES //

ComputeModal.propTypes = {
	cohorts: PropTypes.array.isRequired,
	computeCompletions: PropTypes.func.isRequired,
	entity: PropTypes.oneOfType([
		PropTypes.arrayOf( PropTypes.object ),
		PropTypes.object
	]).isRequired,
	level: PropTypes.string.isRequired,
	metric: PropTypes.oneOfType([
		PropTypes.arrayOf( PropTypes.object ),
		PropTypes.object
	]).isRequired,
	onCompute: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired
};

ComputeModal.defaultProps = {};


// EXPORTS //

export default ComputeModal;
