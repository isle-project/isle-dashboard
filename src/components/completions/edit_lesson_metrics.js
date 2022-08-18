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

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import SelectInput, { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import objectValues from '@stdlib/utils/values';
import ConfirmModal from 'components/confirm-modal';
import COVERAGE_OPTIONS from './coverage_options.json';
import hash from 'object-hash';
import ComputeModal from './compute_modal.js';
import TagWeightsEditor from './tag_weights_editor';
import ParameterInput, { convertRuleParameter } from './parameter_input.js';
import HelpfulLabel from './helpful_label.js';


// VARIABLES //

const COVERAGE_OPTIONS_ARRAY = objectValues( COVERAGE_OPTIONS );
const SELECT_STYLES = {
	menuPortal: ( base ) => ({
		...base,
		zIndex: 9999
	})
};
const RULE_COMPONENTS = {
	Option: ( { data, ...props }) => {
		const isSelected = data.value.name === props.selectProps?.value?.value.name;
		return (
			<components.Option {...props}>
				<span>{data.value.label}</span>
				<br />
				<span
					className={`${isSelected ? 'text-white' : 'text-muted'}`}
				>{data.value.description}</span>
			</components.Option>
		);
	}
};


// FUNCTIONS //

function selectOption( value, transform ) {
	return {
		label: transform ? transform(value) : value,
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

function EditLessonMetrics({ name, preferredLesson, lessons, lessonRefs, componentsByLesson, computeCompletions, namespace, saveLessonMetrics, allRules, tags, onSave }) {
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
	const [ showComputeModal, setShowComputeModal ] = useState( false );
	const [ showDeleteModal, setShowDeleteModal ] = useState( false );
	const [ hasSaved, setHasSaved ] = useState( false );

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
				// Case: lesson does not have the metric (yet)
				newSelectedLessons[ lessonId ] = false;
				lessonSpec.activeLessons[ lessonId ] = {
					name: chosenName,
					rule: isSharedRuleSet ? [ lessonSpec.sharedRule.name, ...lessonSpec.sharedRuleParameters ] : null,
					ref: analysis.hasSharedRef ? lessonSpec.sharedRef : null,
					coverage: [ 'all' ],
					level: 'lesson',
					autoCompute: false,
					visibleToStudents: false,
					tagWeights: {
						'_default_tag': 1
					}
				};
			}
		}
		lessonSpec.selectedLessons = newSelectedLessons;
		analyzedHash.current = hash( lessonSpec );
		setCurrentHash( analyzedHash.current );
		setActiveLessons( lessonSpec.activeLessons );
		setSelectedLessons( newSelectedLessons );
	}, [ chosenName, lessons ] );

	useEffect( () => {
		availableMetrics.current = availableLessonMetrics( lessons );
	}, [ lessons ] );
	useEffect( () => {
		console.log( 'Analyze lesson metrics and incorporate analysis...' );
		const analysis = analyzeLessonMetrics( chosenName, lessons );
		analysisRef.current = analysis;
		incorporateAnalysis( analysis );
	}, [ incorporateAnalysis, lessons, chosenName ] );
	const resetHash = useCallback( () => {
		const lessonSpec = {
			sharedRule: hasSharedRule ? sharedRule : null,
			sharedRuleParameters: hasSharedRule ? sharedRuleParameters : [],
			sharedRef: hasSharedRef ? sharedRef : null,
			activeLessons,
			selectedLessons
		};
		setCurrentHash( hash( lessonSpec ) );
	}, [ hasSharedRule, sharedRule, sharedRuleParameters, hasSharedRef, sharedRef, activeLessons, selectedLessons ] );
	useEffect( resetHash, [ resetHash ] );

	const handleSave = useCallback( () => {
		const lessonMetrics = { ...activeLessons };
		namespace.lessons.forEach( lesson => {
			if ( !selectedLessons[ lesson._id ] ) {
				// Case: mark for deletion on server
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
		saveLessonMetrics( body )
			.then( res => {
				console.log( 'Saved lesson metrics:', res.data );
				setHasSaved( true );
				setIsNewMetric( false );
				if ( objectValues( selectedLessons ).every( x => x === false ) ) {
					setChosenName( null );
					setCurrentHash( null );
					setSharedRef( null );
					setSharedRule( null );
				}
				resetHash();
			})
			.catch( err => {

			});
	}, [ activeLessons, chosenName, namespace, hasSharedRef, sharedRef, hasSharedRule, resetHash, selectedLessons, sharedRule, sharedRuleParameters, saveLessonMetrics, onSave ] );
	const { t } = useTranslation( 'completions' );
	const lessonRefOptions = lessonRefs.map( ( ref ) => ({ value: ref, label: ref }) );
	const allRulesOptions = objectValues( allRules ).map( ( rule ) => ({ value: rule, label: rule.label }) );
	const sharedInputs = <>
		<Form.Group className="mb-2" as={Row} >
			<Col sm={3} >
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
			<HelpfulLabel colWidth={3} name={t('common:rule')} description={t('rule-tooltip', {
				upperLevel: t('common:lesson'),
				level: t('common:component')
			})} disabled={!hasSharedRule} />
			<Col sm={6} >
				<SelectInput
					isDisabled={!hasSharedRule}
					options={allRulesOptions}
					onChange={( option ) => {
						const newRule = option.value;
						setSharedRule( newRule );
						setSharedRuleParameters( newRule.parameters.map( x => x.default || null ) );
					}}
					value={sharedRule ? { value: sharedRule, label: sharedRule.label } : null}
					components={RULE_COMPONENTS}
				/>
			</Col>
		</Form.Group>
		{hasSharedRule && sharedRule && sharedRule.parameters.length > 0 &&
			sharedRule.parameters.map( ( parameter, idx ) => {
				return (
					<Form.Group key={`param-${idx}`} className="mb-2" as={Row} >
						<Col sm={3} ></Col>
						<HelpfulLabel className="ps-5" colWidth={3} name={parameter.name} description={parameter.description} />
						<Col sm={6} >
							<ParameterInput
								key={`${sharedRule.name}-param-${idx}`}
								parameter={parameter}
								value={sharedRuleParameters[ idx ] !== void 0 ? sharedRuleParameters[ idx ] : parameter.default}
								onChange={( value ) => {
									console.log( 'Changed parameter value:', value );
									const newParams = sharedRuleParameters.slice();
									newParams[ idx ] = convertRuleParameter( value, parameter );
									setSharedRuleParameters( newParams );
								}}
								t={t}
							/>
						</Col>
					</Form.Group>
				);
		})}
		<Form.Group className="mb-2" as={Row} >
			<Col sm={3} >
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
			<HelpfulLabel colWidth={3} name={t('component-metric')} description={t('component-metric-tooltip')} />
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
			<div key={`${x._id}-inputs`} >
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
						<Col sm={3} />
						<HelpfulLabel colWidth={3} name={t('common:rule')} description={t('rule-tooltip', {
							upperLevel: t('common:lesson'),
							level: t('common:component')
						})} />
						<Col sm={6} >
							<SelectInput
								options={allRulesOptions}
								isDisabled={hasSharedRule}
								onChange={( option ) => {
									const newActive = { ...activeLessons };
									newActive[ x._id ].rule = [ option.value.name, ...option.value.parameters.map( x => x.default || null ) ];
									setActiveLessons( newActive );
								}}
								value={defaultRule}
								menuPortalTarget={document.body}
								menuPlacement="auto"
								styles={SELECT_STYLES}
								components={RULE_COMPONENTS}
							/>
						</Col>
					</Form.Group>
					{defaultRuleParameters.length > 0 &&
						defaultRuleParameters.map( ( value, idx ) => {
							const parameter = allRules[ defaultRule.value.name ].parameters[ idx ];
							return (
								<Form.Group key={`${x._id}-param-${idx}`} className="mb-2" as={Row} >
									<Col sm={3} ></Col>
									<HelpfulLabel className="ps-5" colWidth={3} name={parameter.name} description={parameter.description} />
									<Col sm={6} >
										<ParameterInput
											key={`${defaultRule.value.name}-param-${idx}`}
											parameter={parameter}
											disabled={hasSharedRule}
											value={defaultRuleParameters[ idx ]}
											onChange={( value ) => {
												const newActive = { ...activeLessons };
												newActive[ x._id ].rule[ idx + 1 ] = convertRuleParameter( value, parameter );
												setActiveLessons( newActive );
											}}
											t={t}
										/>
									</Col>
								</Form.Group>
							);
					})}
					<Form.Group className="mb-2" as={Row} >
						<Col sm={3} />
						<HelpfulLabel colWidth={3} name={t('component-metric')} description={t('component-metric-tooltip')} />
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
						<Col sm={3} />
						<HelpfulLabel colWidth={3} name={t('common:coverage')} description={t('coverage-tooltip', {
							level: t('components')
						})} />
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
									options={( componentsByLesson[ x._id ] || [] ).map( ( y ) => {
										const label = y.componentType ? `${y.component} (type ${y.componentType})` : y.component;
										return { value: y.component, label };
									})}
									onChange={( option ) => {
										const newActive = { ...activeLessons };
										newActive[ x._id ].coverage = [ coverageQualifier, ...option.map( ( x ) => x.value ) ];
										setActiveLessons( newActive );
									}}
									value={coverageEntities}
									placeholder={t('select-components-placeholder')}
								/> : null
							}
						</Col>
					</Form.Group>
					<Form.Group className="mb-2" as={Row} >
						<Col sm={3} />
						<HelpfulLabel colWidth={3} name={t('tag-weights')} description={t('tag-weights-tooltip')} />
						<Col sm={6} >
							<TagWeightsEditor
								key={`${x._id}-tag-weights`}
								tagWeights={activeLessons[ x._id ].tagWeights || void 0}
								visibleTags={namespace.componentTags}
								onUpdate={( tagWeights ) => {
									const newActive = { ...activeLessons };
									newActive[ x._id ].tagWeights = tagWeights;
									setActiveLessons( newActive );
								}}
							/>
						</Col>
					</Form.Group>
					<Form.Group className="mb-2" as={Row} >
						<Col sm={6} />
						<Col sm={3} >
							<Form.Check
								aria-label={t('visible-to-student')}
								type="checkbox"
								label={<HelpfulLabel name={t('visible-to-student')} description={t('visible-to-student-tooltip')} placement="top" as="span" />}
								defaultChecked={activeLessons[ x._id ].visibleToStudent}
								onChange={( event) => {
									const newActive = { ...activeLessons };
									newActive[ x._id ].visibleToStudent = event.target.checked;
									setActiveLessons( newActive );
								}}
							/>
						</Col>
						<Col sm={3} >
							<Form.Check
								aria-label={t('auto-compute')}
								type="checkbox"
								label={<HelpfulLabel name={t('auto-compute')} description={t('auto-compute-tooltip')} placement="top" as="span" />}
								defaultChecked={activeLessons[ x._id ].autoCompute}
								onChange={( event) => {
									const newActive = { ...activeLessons };
									newActive[ x._id ].autoCompute = event.target.checked;
									setActiveLessons( newActive );
								}}
							/>
						</Col>
					</Form.Group>
				</>}
			</div>
		);
	});
	const hasUnsavedChanges = currentHash !== analyzedHash.current;
	const noLessonsSelected = Object.values( selectedLessons ).every( x => !x );
	const saveBar = chosenName && <Fragment>
		<Button
			variant={hasUnsavedChanges ? 'warning' : 'secondary'}
			disabled={!hasUnsavedChanges}
			onClick={() => {
				if ( analysisRef.current ) {
					incorporateAnalysis( analysisRef.current );
				}
			}}
			className="me-2 ms-auto w-25"
		>
			{t('discard-unsaved-changes')}
		</Button>
		<Button variant="success" className="me-2"
			disabled={!hasUnsavedChanges || !sharedRef || !sharedRule || ( isNewMetric && noLessonsSelected )}
			onClick={noLessonsSelected ? () => setShowDeleteModal( true ) : handleSave}
		>
			{t('common:save')}
		</Button>
		<Button variant="info" disabled={hasUnsavedChanges || ( isNewMetric && !hasSaved)} onClick={() => {
			setShowComputeModal( true );
		}} >
			{t('common:compute')}
		</Button>
	</Fragment>;
	return (
		<Fragment>
			<Card className="pb-3" >
				<Card.Body>
					<p>
						{t('lesson-metrics-description')}
					</p>
					<div className="d-flex w-100 mb-2" >
						<span><InputGroup className="mb-2" >
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
						</InputGroup ></span>
						{saveBar}
					</div>
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
					<div className="d-flex w-100 mt-2" style={{ height: 46 }} >
						{saveBar}
					</div>
				</Card.Body>
			</Card>
			{showComputeModal && <ComputeModal
				metric={namespace.lessons.reduce( ( acc, lesson ) => {
					if ( selectedLessons[ lesson._id ] ) {
						acc.push({
							...activeLessons[ lesson._id ],
							...( hasSharedRef ? { ref: sharedRef } : {} ),
							...( hasSharedRule ? { rule: [ sharedRule.name, ...sharedRuleParameters ] } : {} )
						});
					}
					return acc;
				}, [] )}
				show={showComputeModal}
				onHide={() => setShowComputeModal( false )}
				cohorts={namespace.cohorts}
				tags={tags}
				entity={lessons.filter( ( x ) => selectedLessons[ x._id ] )}
				level="lesson"
				onCompute={() => setShowComputeModal( false )}
				computeCompletions={computeCompletions}
			/>}
			{showDeleteModal && <ConfirmModal
				title={t('delete-lesson-metric')}
				message={<span>
					{t('delete-lesson-metric-confirm', { name: chosenName })}
				</span>}
				close={() => setShowDeleteModal( false )}
				show={showDeleteModal}
				onConfirm={() => {
					handleSave();
					setShowDeleteModal( false );
				}}
			/>}
		</Fragment>
	);
}


// PROPERTIES //

EditLessonMetrics.propTypes = {
	allRules: PropTypes.object.isRequired,
	componentsByLesson: PropTypes.object,
	computeCompletions: PropTypes.func.isRequired,
	lessonRefs: PropTypes.arrayOf( PropTypes.string ).isRequired,
	lessons: PropTypes.array.isRequired,
	name: PropTypes.string,
	namespace: PropTypes.object.isRequired,
	onSave: PropTypes.func.isRequired,
	preferredLesson: PropTypes.object,
	saveLessonMetrics: PropTypes.func.isRequired,
	tags: PropTypes.arrayOf( PropTypes.string )
};

EditLessonMetrics.defaultProps = {
	name: null,
	componentsByLesson: {},
	preferredLesson: null,
	tags: []
};


// EXPORTS //

export default EditLessonMetrics;
