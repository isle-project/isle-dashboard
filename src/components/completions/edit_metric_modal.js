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

import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import SelectInput, { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import isPositiveNumber from '@stdlib/assert/is-positive-number';
import objectValues from '@stdlib/utils/values';
import { levelFieldMapping } from './level_fields.js';
import COVERAGE_OPTIONS from './coverage_options.json';


// FUNCTIONS //

/**
 * Returns an object mapping tags to weights of one.
 *
 * @param {Array<string>} tags - list of tags
 * @param {Object} [existingWeights] - existing weights
 * @returns {Object} map of tag to weight
 */
 function createTagWeights( tags, existingWeights ) {
	if ( !tags ) {
		return {
			'_default_tag': 1
		};
	}
	const defaultWeight = (existingWeights && objectValues(existingWeights).some(isPositiveNumber)) ? 0 : 1;
	const weights = {};
	tags.forEach( tag => {
		weights[ tag ] = existingWeights?.[ tag ] ?? defaultWeight;
	});
	return weights;
}

function TagWeightInput({ value, t, onChange }) {
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
		inputs[ i ] = ( <Form.Group className="mb-1" as={Row} key={`tag-${i}`} >
			<Form.Label column sm={3} >{tag === '_default_tag' ? t( 'default' ) : tag}</Form.Label>
			<Col sm={9} >
				<Form.Control
					type="number"
					value={weight}
					onChange={handleChange}
					placeholder={1}
					data-tag={tag}
					min={0}
				/>
			</Col>
		</Form.Group> );
	}
	return inputs;
}


// MAIN //

function EditMetricModal({ level, entity, show, onHide, allRules, refs, createNew, metric, tags, onConfirm }) {
	const { t } = useTranslation();
	const [ name, setName ] = useState( metric?.name || '' );
	const [ rule, setRule ] = useState( metric?.rule ? allRules[ metric.rule[ 0 ] ] : null );
	const [ ruleParameters, setRuleParameters ] = useState( metric?.rule ? metric.rule.slice( 1 ) : [] );
	const [ coverage, setCoverage ] = useState( COVERAGE_OPTIONS[ metric?.coverage?.[ 0 ] || 'all' ] );
	const [ coverageEntities, setCoverageEntities ] = useState( [] );
	const [ selectedRef, setSelectedRef ] = useState( metric?.ref || null );
	const [ tagWeights, setTagWeights ] = useState( createTagWeights( tags, metric?.tagWeights ) );
	const [ autoCompute, setAutoCompute ] = useState( metric?.autoCompute ?? false );
	const [ visibleToStudent, setVisibleToStudent ] = useState( metric?.visibleToStudent ?? false );
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
					value: x
				};
			});
			if ( metric && metric.coverage ) {
				const ids = new Set( metric.coverage.slice( 1 ) );
				setCoverageEntities( subEntities.current.filter( x => ids.has( x.value._id ) ) );
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
			coverage: [ coverage.value ].concat( coverageEntities.map( x => x.value._id ) ),
			level,
			id: entity._id,
			ref: selectedRef,
			tagWeights,
			autoCompute,
			visibleToStudent
		});
		onHide();
	};
	const handleEntityChange = ( value ) => {
		console.log( value );
		setCoverageEntities( value );
	};
	console.log( 'Sub-entities:' );
	console.log( subEntities.current );

	const labelStyler = ( styles, { data }) => {
		if ( !selectedRef || data.value.completions.some( x => x.name === selectedRef ) ) {
			return styles;
		}
		return {
			...styles,
			opacity: 0.65
		};
	};
	const subentitySelectorStyles = {
		option: labelStyler,
		multiValueLabel: labelStyler
	};
	return (
		<Modal size="lg" show={show} onHide={onHide}>
			<Modal.Header closeButton >
				<Modal.Title as="h3">{createNew ? t('create-completion-metric') : t('edit-completion-metric')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>
					{createNew ? t('create-completion-metric-description') : t('edit-completion-metric-description')}
				</p>
				<Form.Group className="mb-2" >
					<Form.Label>{t('common:name')}</Form.Label>
					<Form.Control
						name="metric-name"
						type="text"
						placeholder={t('metric-name-placeholder')}
						onChange={( event ) => setName( event.target.value )}
						value={name}
					/>
				</Form.Group>
				<Form.Group className="mb-2" >
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
							<Form.Group key={`param-${idx}`} className="mb-2" >
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
				<Form.Group className="mb-2" >
					<Form.Label>{t('common:lesson-metric')}</Form.Label>
					<CreatableSelect
						isClearable
						options={refs.map( ( ref ) => ({ value: ref, label: ref }) )}
						onChange={( option ) => {
							setSelectedRef( option ? option.value : null );
						}}
						defaultValue={selectedRef ? { value: selectedRef, label: selectedRef } : null}
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
							styles={subentitySelectorStyles}
							placeholder="Select lessons..."
							components={{
								Placeholder: ({ children, isFocused, ...rest }) => {
									console.log( rest );
									return ( <components.Placeholder {...rest}>
										{children} {isFocused ? '(opaque lessons have no metric for the selected ref)' : ''}
									</components.Placeholder> );
								}
							}}
						/> : null
					}
				</Form.Group>
				<Form.Group className="mb-2" as={Row} controlId="users" >
					<Form.Label column sm={3} >
						{t('tag-weights')}
					</Form.Label>
					<Col sm={9} >
						<TagWeightInput value={tagWeights} onChange={setTagWeights} t={t} />
					</Col>
				</Form.Group>
				<Form.Check
					aria-label={t('auto-compute')}
					type="checkbox"
					label={t('auto-compute')}
					defaultChecked={autoCompute}
					onChange={( event) => {
						setAutoCompute( event.target.checked );
					}}
				/>
				<Form.Check
					aria-label={t('visible-to-student')}
					type="checkbox"
					label={t('visible-to-student')}
					defaultChecked={visibleToStudent}
					onChange={( event) => {
						setVisibleToStudent( event.target.checked );
					}}
				/>
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


// PROPERTIES //

EditMetricModal.propTypes = {
	allRules: PropTypes.object.isRequired,
	createNew: PropTypes.bool.isRequired,
	entity: PropTypes.object.isRequired,
	level: PropTypes.oneOf([ 'program', 'namespace', 'lesson', 'component' ]).isRequired,
	metric: PropTypes.object,
	onConfirm: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	refs: PropTypes.array.isRequired,
	show: PropTypes.bool.isRequired,
	tags: PropTypes.array
};

EditMetricModal.defaultProps = {
	metric: null,
	tags: null
};


// EXPORTS //

export default EditMetricModal;
