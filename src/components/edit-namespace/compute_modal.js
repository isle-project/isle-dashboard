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
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SelectInput from 'react-select';
import usePrevious from 'hooks/use-previous';
import server from 'constants/server';


// VARIABLES //

const MULTIPLES_POLICIES = [
	{ value: 'last', label: 'Last submitted value' },
	{ value: 'first', label: 'First submitted value' },
	{ value: 'pass-through', label: 'All submitted values' },
	{ value: 'max', label: 'Best submitted value' }
];


// FUNCTIONS //

/**
 * Returns an object mapping tags to weights of one.
 *
 * @param {Array<string>} tags - list of tags
 * @param {Object} [existingWeights={}] - existing weights
 * @returns {Object} map of tag to weight
 */
function createTagWeights( tags, existingWeights={} ) {
	if ( !tags ) {
		return {
			'DEFAULT': 1
		};
	}
	const weights = {};
	tags.forEach( tag => {
		if ( tag === '_default_tag' ) {
			tag = 'DEFAULT';
		}
		weights[ tag ] = existingWeights?.[ tag ] ?? 1;
	});
	return weights;
}


// MAIN //

const memberSelection =( member ) => {
	return { value: member.id, label: `${member.firstName} ${member.lastName} (${member.email})` };
};

function TagWeightInput({ value, onChange }) {
	const tags = Object.keys( value );
	const handleChange = useCallback( ( event ) => {
		const weight = Number( event.target.value );
		const tag = event.target.getAttribute( 'data-tag' );
		const newWeights = { ...value };
		newWeights[ tag ] = weight;
		onChange( newWeights );
	}, [ value, onChange ] );

	const inputs = new Array( tags.length );
	for ( let i = 0; i < tags.length; i++ ) {
		const tag = tags[ i ];
		const weight = value[ tag ];
		inputs[ i ] = ( <Form.Group key={`tag-${i}`} >
			<Form.Label>{tag}</Form.Label>
			<Form.Control
				type="number"
				value={weight}
				onChange={handleChange}
				placeholder={1}
				data-tag={tag}
				min={0}
			/>
		</Form.Group> );
	}
	return inputs;
}

function ComputeModal({ cohorts, metric, namespace, show, tags, onHide }) {
	console.log( cohorts );
	const { t } = useTranslation();

	const [ formValues, setFormValues ] = useState({
		users: [],
		activeCohorts: {},
		policyOptions: {
			tagWeights: createTagWeights( tags, {} ),
			multiples: MULTIPLES_POLICIES[ 0 ]
		}
	});
	const FORM_STORAGE_KEY = 'ISLE?level=namespace&id='+namespace.id+'&metric='+metric.name;
	useEffect( () => {
		let oldFormValues = localStorage.getItem( FORM_STORAGE_KEY );
		if ( oldFormValues ) {
			oldFormValues = JSON.parse( oldFormValues );
			setFormValues( oldFormValues );
		}
	}, [ FORM_STORAGE_KEY ] );
	const oldTags = usePrevious( tags || [] );
	useEffect( () => {
		if ( tags && oldTags && tags.length !== oldTags.length ) {
			const newFormValues = {
				...formValues
			};
			newFormValues.policyOptions.tagWeights = createTagWeights( tags, formValues.policyOptions.tagWeights );
			setFormValues( newFormValues );
		}
	}, [ tags, oldTags, formValues ] );
	const onTimeChange = useCallback( ( dates ) => {
		const newFormValues = { ...formValues };
		newFormValues.policyOptions.timeFilter = dates;
		setFormValues( newFormValues );
	}, [ formValues ] );
	const handleMultiplesPolicyChange = useCallback( ( multiples ) => {
		const newFormValues = { ...formValues };
		newFormValues.policyOptions.multiples = multiples;
		setFormValues( newFormValues );
	}, [ formValues ] );
	const handleTagWeightsChange = useCallback( ( tagWeights ) => {
		const newFormValues = { ...formValues };
		newFormValues.policyOptions.tagWeights = tagWeights;
		setFormValues( newFormValues );
	}, [ formValues ] );
	const onCalculate = useCallback( () => {
		if ( formValues.policyOptions.timeFilter ) {
			formValues.policyOptions.timeFilter = formValues.policyOptions.timeFilter.map( x => x.getTime() );
		}
		localStorage.setItem( FORM_STORAGE_KEY, JSON.stringify( formValues ) );
		const body = {
			id: namespace._id,
			users: formValues.users.map( x => x.value ),
			metric: metric,
			policyOptions: {
				...formValues.policyOptions,
				multiples: formValues.policyOptions.multiples.value
			}
		};
		axios.post( server+'/calculate_completions', body ).then( response => {
			console.log( response );
		});
	}, [ metric, namespace, formValues, FORM_STORAGE_KEY ] );
	const users = cohorts.reduce( ( userList, cohort ) => {
		const members = cohort.members.map( member => memberSelection(member) );
		return userList.concat( members );
	}, [] );
	const selectOptions = [
		{ value: { category: 'all', members: users }, label: t( 'All users' ) },
		...cohorts.map( cohort => {
			return { value: { category: 'cohort', id: cohort._id, members: cohort.members }, label: 'Cohort ' + cohort.title };
		})
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
				<Modal.Title as="h3">{t('calculate-scores')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<SelectInput value={formValues.policyOptions.multiples} options={MULTIPLES_POLICIES} onChange={handleMultiplesPolicyChange} />
				<DateTimeRangePicker onChange={onTimeChange} value={formValues.policyOptions.timeFilter} />
				<SelectInput
					value={formValues.users} isMulti options={selectOptions} onChange={handleUserSelectChange}
					hideSelectedOptions={true}
					styles={userSelectStyles}
				/>
				<TagWeightInput value={formValues.policyOptions.tagWeights} onChange={handleTagWeightsChange} />
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={onHide}>
					{t('common:cancel')}
				</Button>
				<Button variant="success" onClick={onCalculate} >
					{t('common:calculate')}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}


// PROPERTIES //

ComputeModal.propTypes = {
	cohorts: PropTypes.array.isRequired,
	metric: PropTypes.object.isRequired,
	namespace: PropTypes.object.isRequired,
	onHide: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	tags: PropTypes.array
};

ComputeModal.defaultProps = {
	tags: null
};


// EXPORTS //

export default ComputeModal;