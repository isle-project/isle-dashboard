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

import React, { useEffect, useState } from 'react';
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


// FUNCTIONS //

function convertRuleParameter( value, parameter ) {
	switch ( parameter.type ) {
		case 'number':
			return parseFloat( value );
		case 'string':
			return value;
	}
}


// MAIN //

function SharedEditLessonMetricsModal({ name, preferredLesson, lessons, lessonRefs, allRules, show, onHide, onConfirm }) {
	const [ chosenName, setChosenName ] = useState( null );
	const [ displayedName, setDisplayedName ] = useState( name );
	const [ hasSharedRule, setHasSharedRule ] = useState( false );
	const [ sharedRule, setSharedRule ] = useState( null );
	const [ sharedRuleParameters, setSharedRuleParameters ] = useState( [] );
	const [ hasSharedRef, setHasSharedRef ] = useState( false );
	const [ sharedRef, setSharedRef ] = useState( null );
	const [ activeLessons, setActiveLessons ] = useState( {} );

	function lessonActivator() {
		return {
			name: chosenName,
			rule: hasSharedRule ? [ sharedRule.name, ...sharedRuleParameters ] : null,
			ref: hasSharedRef ? sharedRef : null,
			coverage: [ 'all' ]
		};
	}
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
					value={hasSharedRule}
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
					value={hasSharedRef}
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
					defaultValue={sharedRef ? { value: sharedRef, label: sharedRef } : null}
				/>
			</Col>
		</Form.Group>
	</>;
	const lessonInputs = lessons.map( x => {
		const lessonIsActive = activeLessons[ x._id ] !== void 0;
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
				console.log( 'ACTIVE RULE' );
				console.log( activeLessons[ x._id ].rule );
				const activeRule = allRules[ activeLessons[ x._id ].rule[ 0 ] ];
				console.log( activeRule );
				defaultRule = { value: activeRule, label: activeRule.label };
				defaultRuleParameters = activeLessons[ x._id ].rule.slice( 1 );
			} else {
				defaultRule = null;
				defaultRuleParameters = [];
			}
		}
		return (
			<>
				<Form.Check
					type="switch"
					id="custom-switch"
					label={x.title}
					key={x._id}
					onChange={( event ) => {
						const newActive = { ...activeLessons };
						if ( event.target.checked ) {
							newActive[ x._id ] = lessonActivator();
						} else {
							delete newActive[ x._id ];
						}
						setActiveLessons( newActive );
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
							/>
						</Col>
					</Form.Group>
				</>}
			</>
		);
	});
	return (
		<Modal size="lg" show={show} onHide={onHide} dialogClassName="modal-75w modal-80h" >
			<Modal.Header closeButton >
				<Modal.Title as="h3">{t('lesson-metrics')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>
					{t('lesson-metrics-description')}
				</p>
				<InputGroup className="mb-2" >
					<InputGroup.Text>{t('common:name')}</InputGroup.Text>
					<Form.Control
						name="metric-name"
						type="text"
						placeholder={t('metric-name-placeholder')}
						onChange={( event ) => setDisplayedName( event.target.value )}
						value={displayedName}
						disabled={!!chosenName}
					/>
					<Button variant="secondary" onClick={() => {
						if ( !chosenName ) {
							setChosenName( displayedName );
						} else {
							setChosenName( null );
							setDisplayedName( '' );
						}
					}}>
						{!chosenName ? t('use') : t('clear')}
					</Button>
				</InputGroup >
				{chosenName ? <>
					{sharedInputs}
					<Form.Check
						type="switch"
						id="all-lessons-switch"
						label={<h3>All Lessons</h3>}
						onChange={( event ) => {
							let newActive;
							if ( event.target.checked ) {
								newActive = { ...activeLessons };
								lessons.forEach( ( lesson ) => {
									if ( !newActive[ lesson._id ] ) {
										newActive[ lesson._id ] = lessonActivator();
									}
								});
							} else {
								newActive = {};
							}
							setActiveLessons( newActive );
						}}
					/>
					<div style={{ maxHeight: '75vh', minHeight: '50vh', border: 'solid 1px darkgray', overflowY: 'auto', padding: 4, overflowX: 'hidden' }} >
						{lessonInputs}
					</div>
				</> : null}
			</Modal.Body>
			{chosenName && <Modal.Footer>
				<Button onClick={onHide}>
					{t('common:cancel')}
				</Button>
				<Button variant="success" onClick={onConfirm} >
					{t('common:save')}
				</Button>
			</Modal.Footer>}
		</Modal>
	);
}


// PROPERTIES //

SharedEditLessonMetricsModal.propTypes = {
	allRules: PropTypes.array.isRequired,
	lessonRefs: PropTypes.arrayOf( PropTypes.string ).isRequired,
	lessons: PropTypes.array.isRequired,
	name: PropTypes.string,
	onConfirm: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	preferredLesson: PropTypes.object,
	show: PropTypes.bool.isRequired
};

SharedEditLessonMetricsModal.defaultProps = {
	name: null,
	preferredLesson: null
};


// EXPORTS //

export default SharedEditLessonMetricsModal;
