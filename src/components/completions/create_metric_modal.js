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

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import SelectInput from 'react-select';
import CreatableSelect from 'react-select/creatable';
import server from 'constants/server';
import { levelFieldMapping } from './level_field_mapping.js';


// VARIABLES //

const COVERAGE_OPTIONS = [
	{ value: 'all', label: 'All' },
	{ value: 'include', label: 'Include' },
	{ value: 'exclude', label: 'Exclude' }
];


// MAIN //

function CreateMetricModal({ level, entity, show, onHide, onCreate, allRules, refs }) {
	const { t } = useTranslation();
	const [ name, setName ] = useState( '' );
	const [ rule, setRule ] = useState( null );
	const [ ruleParameters, setRuleParameters ] = useState( [] );
	const [ coverage, setCoverage ] = useState( COVERAGE_OPTIONS[ 0 ] );
	const [ coverageEntities, setCoverageEntities ] = useState( [] );
	const [ selectedRef, setSelectedRef ] = useState( null );
	const subEntities = useRef( [] );

	useEffect( () => {
		if ( level === 'lesson' ) {
			// TODO: fetch component IDs of that lesson from completion data table
			subEntities.current = [];
		} else if ( levelFieldMapping[ level ] ) {
			const entities = entity[ levelFieldMapping[ level ] ];
			console.log( entities );
			subEntities.current = entities.map( x => {
				return {
					label: x.title,
					value: x._id
				};
			});
		}
		else {
			subEntities.current = [];
		}
	}, [ level, entity ] );

	const handleCreate = () => {
		console.log( 'Creating metric...' );
		console.log( selectedRef );
		axios.post( `${server}/create_metric`, {
			name,
			rule: [ rule.name ].concat( ruleParameters ),
			coverage: [ coverage.value ].concat( coverageEntities ),
			level,
			id: entity._id,
			ref: selectedRef
		})
			.then( res => {
				console.log( 'Metric created.' );
				onCreate();
				onHide();
			})
			.catch( err => {
				console.log( 'Error creating metric:', err );
			});
	};
	const handleEntityChange = ( value ) => {
		console.log( value );
		setCoverageEntities( value.map( x => x.value ) );
	};
	console.log( 'Sub-entities:' );
	console.log( subEntities.current );
	return (
		<Modal size="lg" show={show} onHide={onHide}>
			<Modal.Header closeButton >
				<Modal.Title as="h3">{t('create-completion-metric')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>
					{t('create-completion-metric-description')}
				</p>
				<Container>
					<Form.Group className="mb-2" as={Row} >
						<Form.Label>{t('common:name')}</Form.Label>
						<Form.Control
							name="metric-name"
							type="text"
							placeholder={t('metric-name-placeholder')}
							onChange={( event ) => setName( event.target.value )}
						/>
					</Form.Group>
					<Form.Group className="mb-2" as={Row} >
						<Form.Label>{t('common:coverage')}</Form.Label>
						<SelectInput
							options={COVERAGE_OPTIONS}
							onChange={( option ) => {
								setCoverage( option );
								if ( option.value === 'all' ) {
									setCoverageEntities( [] );
								}
							}}
							value={coverage}
						/>
						{( coverage.value === 'include' || coverage.value === 'exclude' ) ?
							<SelectInput
								isMulti
								options={subEntities.current}
								onChange={handleEntityChange}
							/> : null
						}
					</Form.Group>
					<Form.Group className="mb-2" as={Row} >
						<Form.Label>{t('common:rule')}</Form.Label>
						<SelectInput
							options={allRules.map( ( rule ) => ({ value: rule, label: rule.name }) )}
							onChange={( option ) => {
								const newRule = option.value;
								setRule( newRule );
								setRuleParameters( newRule.defaults );
							}}
						/>
					</Form.Group>
					{rule && rule.parameters.length > 0 ?
						rule.parameters.map( ( parameter, idx ) => {
							return (
								<Form.Group key={`param-${idx}`} className="mb-2" as={Row} >
									<Form.Label>{parameter.name}</Form.Label>
									<Form.Control
										name={parameter.name}
										type={parameter.type}
										placeholder={t('enter-parameter-value')}
										onChange={( event ) => {
											const newParams = ruleParameters.slice();
											switch ( parameter.type ) {
												case 'number':
													newParams[ idx ] = parseFloat( event.target.value );
													break;
												case 'string':
													newParams[ idx ] = event.target.value;
													break;
											}
											setRuleParameters( newParams );
										}}
										defaultValue={rule.defaults[ idx ]}
									/>
								</Form.Group>
							);
						}) : null}
						<Form.Group className="mb-2" as={Row} >
							<Form.Label>{t('common:ref')}</Form.Label>
							<CreatableSelect
								isClearable
								options={refs.map( ( ref ) => ({ value: ref, label: ref }) )}
								onChange={( option ) => {
									setSelectedRef( option ? option.value : null );
								}}
							/>
					</Form.Group>
				</Container>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={onHide}>
					{t('common:cancel')}
				</Button>
				<Button variant="success" onClick={handleCreate} disabled={!rule || !name} >
					{t('common:create')}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}


// EXPORTS //

export default CreateMetricModal;
