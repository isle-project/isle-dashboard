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
import InputGroup from 'react-bootstrap/InputGroup';
import SelectInput from 'react-select';
import CreatableSelect from 'react-select/creatable';
import objectValues from '@stdlib/utils/values';
import COVERAGE_OPTIONS from './coverage_options.json';
import hash from 'object-hash';


// VARIABLES //

const COVERAGE_OPTIONS_ARRAY = objectValues( COVERAGE_OPTIONS );
const SELECT_STYLES = {
	menuPortal: ( base ) => ({
		...base,
		zIndex: 9999
	})
};


// FUNCTIONS //

function convertRuleParameter( value, parameter ) {
	switch ( parameter.type ) {
		case 'number':
			return parseFloat( value );
		case 'string':
			return value;
	}
}

function selectOption( value ) {
	return {
		label: value,
		value: value
	};
}

function analyzeLessonMetrics( name, lessons ) {
	const lessonInfo = lessons.reduce( (acc, lesson) => {
		const namedMetric = lesson.completions.find( metric => metric.name === name );
		if ( namedMetric ) {
			acc.active[lesson._id] = namedMetric;
			acc.rules.add( JSON.stringify(namedMetric.rule) );
			acc.rule = namedMetric.rule;
			acc.refs.add( namedMetric.ref );
			acc.ref = namedMetric.ref;
		}
		return acc;
	}, { rules: new Set(), refs: new Set(), active: {}, rule: null, ref: null }, lessons);
	if ( lessonInfo.rules.size > 0 ) {
		return {
			hasSharedRule: lessonInfo.rules.size === 1,
			hasSharedRef: lessonInfo.refs.size === 1,
			activeLessons: lessonInfo.active,
			rule: lessonInfo.rule,
			ref: lessonInfo.ref
		};
	}
	return {
		activeLessons: {},
		hasSharedRule: true,
		hasSharedRef: true,
		rule: null,
		ref: null
	};
}

function availableLessonMetrics( lessons ) {
	const allMetrics = lessons.reduce( ( acc, lesson ) => {
		lesson.completions.forEach( metric => {
			acc.add( metric.name );
		});
		return acc;
	}, new Set() );
	return Array.from( allMetrics ).sort().map( metric => ({ value: metric, label: metric }) );
}


// MAIN //

function SharedEditLessonMetricsModal({ name, preferredLesson, lessons, lessonRefs, lessonComponents, namespace, allRules, show, onHide, onSave }) {
	const [ chosenName, setChosenName ] = useState( name );
	const [ hasSharedRule, setHasSharedRule ] = useState( false );
	const [ sharedRule, setSharedRule ] = useState( null );
	const [ sharedRuleParameters, setSharedRuleParameters ] = useState( [] );
	const [ hasSharedRef, setHasSharedRef ] = useState( false );
	const [ sharedRef, setSharedRef ] = useState( null );
	const [ activeLessons, setActiveLessons ] = useState( {} );
	const [ selectedLessons, setSelectedLessons ] = useState( {} );
	const [ currentHash, setCurrentHash ] = useState( null );
	const [ isNewMetric, setIsNewMetric ] = useState( false );

	const availableMetrics = useRef( null );
	const analyzedHash = useRef( null );
	const analysisRef = useRef( null );

	const incorporateAnalysis = useCallback( ( analysis ) => {
		setHasSharedRule( analysis.hasSharedRule );
		let newSharedRule = null;
		let newSharedRuleParameters = [];
		const isSharedRuleSet = analysis.hasSharedRule && analysis.rule && analysis.rule[ 0 ];
		if ( isSharedRuleSet ) {
			newSharedRule = allRules[ analysis.rule[ 0 ] ];
			newSharedRuleParameters = analysis.rule.slice( 1 );
			setSharedRule( newSharedRule );
			setSharedRuleParameters( newSharedRuleParameters );
		}
		setHasSharedRef( analysis.hasSharedRef );
		if ( analysis.hasSharedRef ) {
			setSharedRef( analysis.ref );
		}
		const lessonSpec = {
			sharedRule: newSharedRule,
			sharedRuleParameters: newSharedRuleParameters,
			sharedRef: analysis.hasSharedRef ? analysis.ref : null,
			activeLessons: { ...analysis.activeLessons }
		};
		const newSelectedLessons = {};
		for ( let i = 0; i < lessons.length; i++ ) {
			const lesson = lessons[ i ];
			const lessonId = lesson._id;
			const lessonMetric = lessonSpec.activeLessons[ lessonId ];
			if ( lessonMetric ) {
				newSelectedLessons[ lessonId ] = true;
			} else {
				newSelectedLessons[ lessonId ] = false;
				lessonSpec.activeLessons[ lessonId ] = {
					name: chosenName,
					rule: isSharedRuleSet ? [ lessonSpec.sharedRule.name, ...lessonSpec.sharedRuleParameters ] : null,
					ref: analysis.hasSharedRef ? lessonSpec.sharedRef : null,
					coverage: [ 'all' ],
					level: 'lesson'
				};
			}
		}
		lessonSpec.selectedLessons = newSelectedLessons;
		analyzedHash.current = hash( lessonSpec );
		setCurrentHash( analyzedHash.current );
		setActiveLessons( lessonSpec.activeLessons );
		setSelectedLessons( newSelectedLessons );
	}, [ allRules, chosenName, lessons ] );

	useEffect( () => {
		availableMetrics.current = availableLessonMetrics( lessons );
	}, [ lessons ] );
	useEffect( () => {
		const analysis = analyzeLessonMetrics( chosenName, lessons );
		analysisRef.current = analysis;
		incorporateAnalysis( analysis );
	}, [ allRules, incorporateAnalysis, lessons, chosenName ] );
	useEffect( () => {
		const lessonSpec = {
			sharedRule: hasSharedRule ? sharedRule : null,
			sharedRuleParameters: hasSharedRule ? sharedRuleParameters : [],
			sharedRef: hasSharedRef ? sharedRef : null,
			activeLessons,
			selectedLessons
		};
		setCurrentHash( hash( lessonSpec ) );
	}, [ sharedRule, sharedRef, sharedRuleParameters, activeLessons, selectedLessons, hasSharedRef, hasSharedRule ] );

	const handleSave = useCallback( () => {
		const lessonMetrics = { ...activeLessons };
		namespace.lessons.forEach( lesson => {
			if ( !selectedLessons[ lesson._id ] ) {
				lessonMetrics[ lesson._id ] = null;
			} else {
				lessonMetrics[ lesson._id ] = {
					...lessonMetrics[ lesson._id ],
					...( hasSharedRef ? { ref: sharedRef } : {} ),
					...( hasSharedRule ? { rule: [ sharedRule.name, ...sharedRuleParameters ] } : {} )
				};
			}
		});
		const body = {
			namespaceID: namespace._id,
			name: chosenName,
			lessonMetrics
		};
		onSave( body );
	}, [ activeLessons, chosenName, namespace, hasSharedRef, sharedRef, hasSharedRule, selectedLessons, sharedRule, sharedRuleParameters, onSave ] );
	const { t } = useTranslation();
	const lessonRefOptions = lessonRefs.map( ( ref ) => ({ value: ref, label: ref }) );
	const allRulesOptions = objectValues( allRules ).map( ( rule ) => ({ value: rule, label: rule.label }) );
	const sharedInputs = <>
		<Form.Group className="mb-2" as={Row} >
			<Col sm={4} >
				<Form.Check
					type="checkbox"
					id="shared-rule-checkbox"
					label={t('share-across-lessons')}
					onChange={( event ) => {
						setHasSharedRule( event.target.checked );
					}}
					checked={hasSharedRule}
				/>
			</Col>
			<Form.Label column sm={2} >{t('common:rule')}</Form.Label>
			<Col sm={6} >
				<SelectInput
					isDisabled={!hasSharedRule}
					options={allRulesOptions}
					onChange={( option ) => {
						const newRule = option.value;
						setSharedRule( newRule );
						setSharedRuleParameters( newRule.defaults );
					}}
					value={sharedRule ? { value: sharedRule, label: sharedRule.label } : null}
				/>
			</Col>
		</Form.Group>
		{hasSharedRule && sharedRule && sharedRule.parameters.length > 0 &&
			sharedRule.parameters.map( ( parameter, idx ) => {
				return (
					<Form.Group key={`param-${idx}`} className="mb-2" as={Row} >
						<Col sm={4} ></Col>
						<Form.Label column sm={2} >{parameter.name}</Form.Label>
						<Col sm={6} >
							<Form.Control
								name={parameter.name}
								type={parameter.type}
								placeholder={t('enter-parameter-value')}
								onChange={( event ) => {
									const newParams = sharedRuleParameters.slice();
									newParams[ idx ] = convertRuleParameter( event.target.value, parameter );
									setSharedRuleParameters( newParams );
								}}
								defaultValue={sharedRuleParameters[ idx ] !== void 0 ? sharedRuleParameters[ idx ] : sharedRule.defaults[ idx ]}
							/>
						</Col>
					</Form.Group>
				);
		})}
		<Form.Group className="mb-2" as={Row} >
			<Col sm={4} >
				<Form.Check
					type="checkbox"
					id="shared-ref-checkbox"
					label={t('share-across-lessons')}
					onChange={( event ) => {
						setHasSharedRef( event.target.checked );
					}}
					checked={hasSharedRef}
				/>
			</Col>
			<Form.Label column sm={2} >{t('common:ref')}</Form.Label>
			<Col sm={6} >
				<CreatableSelect
					isClearable
					isDisabled={!hasSharedRef}
					options={lessonRefOptions}
					onChange={( option ) => {
						setSharedRef( option ? option.value : null );
					}}
					value={sharedRef ? { value: sharedRef, label: sharedRef } : null}
				/>
			</Col>
		</Form.Group>
	</>;
	const sortedLessons = Array.from( lessons ).sort( preferredLesson ? ( a, b ) => {
		if ( a.title === preferredLesson.title ) {
			return -1;
		}
		if ( b.title === preferredLesson.title ) {
			return 1;
		}
		return a.title.localeCompare( b.title );
	} : ( a, b ) => a.title.localeCompare( b.title ) );
	const lessonInputs = sortedLessons.map( x => {
		const lessonIsActive = selectedLessons[ x._id ];
		let defaultRuleParameters;
		let defaultRule;
		let defaultRef;
		if ( lessonIsActive ) {
			if ( hasSharedRef && sharedRef ) {
				defaultRef = { value: sharedRef, label: sharedRef };
			} else {
				defaultRef = activeLessons[ x._id ].ref ? { value: activeLessons[ x._id ].ref, label: activeLessons[ x._id ].ref } : null;
			}
			if ( hasSharedRule && sharedRule ) {
				defaultRule = { value: sharedRule, label: sharedRule.label };
				defaultRuleParameters = sharedRuleParameters;
			} else if ( activeLessons[ x._id ].rule ) {
				const activeRule = allRules[ activeLessons[ x._id ].rule[ 0 ] ];
				defaultRule = { value: activeRule, label: activeRule.label };
				defaultRuleParameters = activeLessons[ x._id ].rule.slice( 1 );
			} else {
				defaultRule = null;
				defaultRuleParameters = [];
			}
		}
		const activeLesson = activeLessons[ x._id ];
		const coverage = activeLesson?.coverage || [ 'all' ];
		const coverageQualifier = coverage[ 0 ];
		const coverageEntities = coverage.slice( 1 ).map( selectOption );
		return (
			<>
				<Form.Check
					type="switch"
					id="custom-switch"
					label={x.title}
					key={x._id}
					onChange={( event ) => {
						const newSelected = { ...selectedLessons };
						newSelected[ x._id ] = event.target.checked;
						setSelectedLessons( newSelected );
					}}
					checked={lessonIsActive}
				/>
				{lessonIsActive && <>
					<Form.Group className="mb-2" as={Row} >
						<Col sm={2} />
						<Form.Label column sm={4} >{t('common:rule')}</Form.Label>
						<Col sm={6} >
							<SelectInput
								options={allRulesOptions}
								isDisabled={hasSharedRule}
								onChange={( option ) => {
									const newActive = { ...activeLessons };
									newActive[ x._id ].rule = [ option.value.name, ...option.value.defaults ];
									setActiveLessons( newActive );
								}}
								value={defaultRule}
								menuPortalTarget={document.body}
								menuPlacement="auto"
								styles={SELECT_STYLES}
							/>
						</Col>
					</Form.Group>
					{defaultRuleParameters.length > 0 &&
						defaultRuleParameters.map( ( value, idx ) => {
							const parameter = allRules[ defaultRule.value.name ].parameters[ idx ];
							return (
								<Form.Group key={`${x._id}-param-${idx}`} className="mb-2" as={Row} >
									<Col sm={4} ></Col>
									<Form.Label column sm={2} >{parameter.name}</Form.Label>
									<Col sm={6} >
										<Form.Control
											name={parameter.name}
											type={parameter.type}
											placeholder={t('enter-parameter-value')}
											disabled={hasSharedRule}
											onChange={( event ) => {
												const newActive = { ...activeLessons };
												newActive[ x._id ].rule[ idx + 1 ] = convertRuleParameter( event.target.value, parameter );
												setActiveLessons( newActive );
											}}
											value={defaultRuleParameters[ idx ]}
										/>
									</Col>
								</Form.Group>
							);
					})}
					<Form.Group className="mb-2" as={Row} >
						<Col sm={2} />
						<Form.Label column sm={4} >{t('common:ref')}</Form.Label>
						<Col sm={6} >
							<CreatableSelect
								isClearable
								isDisabled={hasSharedRef}
								options={lessonRefOptions}
								onChange={( option ) => {
									const newActive = { ...activeLessons };
									newActive[ x._id ].ref = option ? option.value : null;
									setActiveLessons( newActive );
								}}
								value={defaultRef}
								menuPortalTarget={document.body}
								menuPlacement="auto"
								styles={SELECT_STYLES}
							/>
						</Col>
					</Form.Group>
					<Form.Group className="mb-2" as={Row} >
						<Col sm={2} />
						<Form.Label column sm={4} >{t('common:coverage')}</Form.Label>
						<Col sm={6} >
							<SelectInput
								options={COVERAGE_OPTIONS_ARRAY}
								onChange={( option ) => {
									const newActive = { ...activeLessons };
									newActive[ x._id ].coverage[ 0 ] = option.value;
									setActiveLessons( newActive );
								}}
								value={COVERAGE_OPTIONS[ coverageQualifier ]}
							/>
							{( coverageQualifier === 'include' || coverageQualifier === 'exclude' ) ?
								<CreatableSelect
									isMulti
									options={( lessonComponents[ x._id ] || [] ).map( ( y ) => {
										const label = y.componentType ? `${y.component} (type ${y.componentType})` : y.component;
										return { value: y.component, label };
									})}
									onChange={( option ) => {
										const newActive = { ...activeLessons };
										newActive[ x._id ].coverage = [ coverageQualifier, ...option.map( ( x ) => x.value ) ];
										setActiveLessons( newActive );
									}}
									value={coverageEntities}
									placeholder="Select component identifiers..."
								/> : null
							}
						</Col>
					</Form.Group>
				</>}
			</>
		);
	});
	const hasUnsavedChanges = currentHash !== analyzedHash.current;
	return (
		<Modal size="lg" show={show} onHide={onHide} dialogClassName="modal-75w modal-80h" >
			<Modal.Header closeButton={!hasUnsavedChanges} >
				<Modal.Title as="h3">{`${t('lesson-metrics-for')} ${namespace.title}`}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>
					{t('lesson-metrics-description')}
				</p>
				<InputGroup className="mb-2" >
					<InputGroup.Text>{t('metric-name')}</InputGroup.Text>
					<CreatableSelect
						name="metric-name"
						placeholder={t('metric-name-placeholder')}
						onChange={( value ) => {
							if ( value ) {
								setChosenName( value.value );
							} else {
								setChosenName( null );
								setSharedRule( null );
								setSharedRef( null );
							}
						}}
						onCreateOption={( inputValue ) => {
							console.log( 'Creating new lesson metric: ', inputValue );
							setChosenName( inputValue );
							setIsNewMetric( true );
						}}
						value={chosenName ? { value: chosenName, label: chosenName } : null}
						isClearable
						isDisabled={name || ( currentHash && currentHash !== analyzedHash.current )}
						options={availableMetrics.current}
					/>
				</InputGroup >
				{chosenName ? <>
					{sharedInputs}
					<Form.Check
						type="switch"
						id="all-lessons-switch"
						label={<h3>All Lessons</h3>}
						onChange={( event ) => {
							const newSelectedLessons = {};
							lessons.forEach( ( lesson ) => {
								newSelectedLessons[ lesson._id ] = event.target.checked;
							});
							setSelectedLessons( newSelectedLessons );
						}}
						checked={Object.values( selectedLessons ).every( ( x ) => x )}
					/>
					<div style={{ maxHeight: '75vh', minHeight: '50vh', border: 'solid 1px darkgray', overflowY: 'auto', padding: 4, overflowX: 'hidden' }} >
						{lessonInputs}
					</div>
				</> : null}
			</Modal.Body>
			{chosenName && <Modal.Footer>
				<Button onClick={onHide} disabled={hasUnsavedChanges} >
					{t('common:dismiss')}
				</Button>
				<Button
					variant={hasUnsavedChanges ? 'warning' : 'secondary'}
					disabled={!hasUnsavedChanges}
					onClick={() => {
						if ( analysisRef.current ) {
							incorporateAnalysis( analysisRef.current );
						}
					}}
				>
					{t('discard-unsaved-changes')}
				</Button>
				<Button variant="success" onClick={handleSave} disabled={!hasUnsavedChanges || !sharedRef || !sharedRule || ( isNewMetric && Object.values( selectedLessons ).every( x => !x ))} >
					{t('common:save')}
				</Button>
			</Modal.Footer>}
		</Modal>
	);
}


// PROPERTIES //

SharedEditLessonMetricsModal.propTypes = {
	allRules: PropTypes.array.isRequired,
	lessonComponents: PropTypes.object,
	lessonRefs: PropTypes.arrayOf( PropTypes.string ).isRequired,
	lessons: PropTypes.array.isRequired,
	name: PropTypes.string,
	namespace: PropTypes.object.isRequired,
	onHide: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	preferredLesson: PropTypes.object,
	show: PropTypes.bool.isRequired
};

SharedEditLessonMetricsModal.defaultProps = {
	name: null,
	lessonComponents: {},
	preferredLesson: null
};


// EXPORTS //

export default SharedEditLessonMetricsModal;
