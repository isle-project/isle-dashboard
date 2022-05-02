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

import React, { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SelectInput from 'react-select';


// VARIABLES //

const MULTIPLES_POLICIES = [
	'last', 'first', 'max', 'pass-through'
].map( x => { return { value: x, label: x }; });


// MAIN //

const memberSelection =( member ) => {
	return { value: member.id, label: `${member.firstName} ${member.lastName} (${member.email})` };
};

function TagWeightInput({ value, onChange }) {
	const tags = Object.keys( value );
	const handleChange = useCallback( ( event ) => {
		const weight = event.target.value;
		const tag = event.target.getAttribute( 'data-tag' );
		const newWeights = { ...value };
		newWeights[ tag ] = weight;
		onChange( newWeights );
	}, [ value, onChange ] );

	const inputs = new Array( tags.length );
	for ( let i = 0; i < tags.length; i++ ) {
		const tag = tags[ i ];
		const weight = value[ tag ];
		inputs[ i ] = ( <Fragment>
			<Form.Label>{tag}</Form.Label>
			<Form.Control
				type="number"
				value={weight}
				onChange={handleChange}
				placeholder={1}
				data-tag={tag}
				min={0}
			/>
		</Fragment> );
	}

	return inputs;
}

function ComputeModal({ cohorts, show, onHide }) {
	console.log( cohorts );
	const { t } = useTranslation();
	const [ timeFilter, setTimeFilter ] = useState( [ null, null ] );
	const [ selectedUsers, setSelectedUsers ] = useState( [] );
	const [ activeCohorts, setActiveCohorts ] = useState( {} );
	const [ tagWeights, setTagWeights ] = useState( {
		'default': 1
	} );
	const onChange = useCallback( ( dates ) => {
		console.log( dates );
		setTimeFilter( dates );
	}, [] );
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
			if ( data.value.category === 'cohort' && activeCohorts[ data.value.id ] ) {
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
			return setSelectedUsers( [] );
		}
		if ( value.some( x => x.value.category === 'all' ) ) {
			setSelectedUsers( users );
			setActiveCohorts( {} );
			return;
		}
		const selectedUsersSet= new Set();
		const removeIds = new Set();
		const newValue = [];
		const newActiveCohorts = Object.assign( {}, activeCohorts );
		for ( let i = 0; i < value.length; i++ ) {
			if ( value[ i ].value.category === 'cohort' ) {
				if ( !activeCohorts[ value[i].value.id ] ) {
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
		setActiveCohorts( newActiveCohorts );
		setSelectedUsers( newValue.filter( x => !removeIds.has( x.value ) ) );
	}, [ activeCohorts, users ] );
	return (
		<Modal size="lg" show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title as="h3">{t('calculate-scores')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<SelectInput options={MULTIPLES_POLICIES} />
				<DateTimeRangePicker onChange={onChange} value={timeFilter} />
				<SelectInput
					value={selectedUsers} isMulti options={selectOptions} onChange={handleUserSelectChange}
					hideSelectedOptions={true}
					styles={userSelectStyles}
				/>
				<TagWeightInput value={tagWeights} onChange={setTagWeights} />
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={onHide}>
					{t('common:cancel')}
				</Button>
				<Button variant="success" onClick={onHide} >
					{t('common:calculate')}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}


// PROPERTIES //

ComputeModal.propTypes = {
	cohorts: PropTypes.array.isRequired,
	onHide: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired
};

ComputeModal.defaultProps = {};


// EXPORTS //

export default ComputeModal;
