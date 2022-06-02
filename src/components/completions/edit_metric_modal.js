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
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import SelectInput from 'react-select';
import CreatableSelect from 'react-select/creatable';
import objectValues from '@stdlib/utils/values';
import { levelFieldMapping } from './level_fields.js';


// VARIABLES //

const COVERAGE_OPTIONS = {
	all: { value: 'all', label: 'All' },
	include: { value: 'include', label: 'Include' },
	exclude: { value: 'exclude', label: 'Exclude' }
};


// MAIN //

function EditMetricModal({ level, entity, show, onHide, allRules, refs, createNew, metric, onConfirm }) {
	const { t } = useTranslation();
	const [ name, setName ] = useState( metric?.name || '' );
	const [ rule, setRule ] = useState( metric?.rule ? allRules[ metric.rule[ 0 ] ] : null );
	const [ ruleParameters, setRuleParameters ] = useState( metric?.rule ? metric.rule.slice( 1 ) : [] );
	const [ coverage, setCoverage ] = useState( COVERAGE_OPTIONS[ metric?.coverage?.[ 0 ] || 'all' ] );
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
			if ( metric && metric.coverage ) {
				const ids = new Set( metric.coverage.slice( 1 ) );
				setCoverageEntities( subEntities.current.filter( x => ids.has( x.value ) ) );
			}
		}
		else {
			subEntities.current = [];
		}
	}, [ level, entity, metric ] );

	const handleConfirm = () => {
		onConfirm({
			name,
			rule: [ rule.name ].concat( ruleParameters ),
			coverage: [ coverage.value ].concat( coverageEntities.map( x => x.value ) ),
			level,
			id: entity._id,
			ref: selectedRef
		});
		onHide();
	};
	const handleEntityChange = ( value ) => {
		console.log( value );
		setCoverageEntities( value );
	};
	console.log( 'Sub-entities:' );
	console.log( subEntities.current );
	return (
		<Modal size="lg" show={show} onHide={onHide}>
			<Modal.Header closeButton >
				<Modal.Title as="h3">{createNew ? t('create-completion-metric') : t('edit-completion-metric')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>
					{createNew ? t('create-completion-metric-description') : t('edit-completion-metric-description')}
				</p>
				<Container>
					<Form.Group className="mb-2" as={Row} >
						<Form.Label>{t('common:name')}</Form.Label>
						<Form.Control
							name="metric-name"
							type="text"
							placeholder={t('metric-name-placeholder')}
							onChange={( event ) => setName( event.target.value )}
							value={name}
						/>
					</Form.Group>
					<Form.Group className="mb-2" as={Row} >
						<Form.Label>{t('common:coverage')}</Form.Label>
						<SelectInput
							options={objectValues( COVERAGE_OPTIONS )}
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
								value={coverageEntities}
							/> : null
						}
					</Form.Group>
					<Form.Group className="mb-2" as={Row} >
						<Form.Label>{t('common:rule')}</Form.Label>
						<SelectInput
							options={objectValues( allRules ).map( ( rule ) => ({ value: rule, label: rule.label }) )}
							onChange={( option ) => {
								const newRule = option.value;
								setRule( newRule );
								setRuleParameters( newRule.defaults );
							}}
							value={rule ? { value: rule, label: rule.label } : null}
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
										defaultValue={ruleParameters[ idx ] !== void 0 ? ruleParameters[ idx ] : rule.defaults[ idx ]}
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
				<Button variant="success" onClick={handleConfirm} disabled={!rule || !name} >
					{createNew ? t('common:create') : t('common:save')}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}


// EXPORTS //

export default EditMetricModal;
