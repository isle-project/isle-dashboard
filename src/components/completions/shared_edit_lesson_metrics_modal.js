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
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import SelectInput, { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import objectValues from '@stdlib/utils/values';


// MAIN //

function SharedEditLessonMetricsModal({ name, preferredLesson, lessons, lessonRefs, allRules, show, onHide, onConfirm }) {
	const [ chosenName, setChosenName ] = useState( null );
	const [ displayedName, setDisplayedName ] = useState( name );
	const [ sharedRule, setSharedRule ] = useState( null );
	const [ sharedRuleParameters, setSharedRuleParameters ] = useState( [] );
	const [ sharedRef, setSharedRef ] = useState( null );
	const [ activeLessons, setActiveLessons ] = useState( {} );

	function lessonActivator() {
		return {
			name: chosenName,
			rule: sharedRule ? [ sharedRule, ...sharedRuleParameters ] : null,
			ref: sharedRef ? sharedRef : null,
			coverage: [ 'all' ]
		};
	}
	const { t } = useTranslation();
	const sharedInputs = <>
		<Form.Group className="mb-2" as={Row} >
			<Col sm={4} >
				<Form.Check
					type="checkbox"
					id="shared-rule-checkbox"
					label={t('share-across-lessons')}
				/>
			</Col>
			<Form.Label column sm={2} >{t('common:rule')}</Form.Label>
			<Col sm={6} >
				<SelectInput
					options={objectValues( allRules ).map( ( rule ) => ({ value: rule, label: rule.label }) )}
					onChange={( option ) => {
						const newRule = option.value;
						setSharedRule( newRule );
						setSharedRuleParameters( newRule.defaults );
					}}
					value={sharedRule ? { value: sharedRule, label: sharedRule.label } : null}
				/>
			</Col>
		</Form.Group>
		{sharedRule && sharedRule.parameters.length > 0 ?
			sharedRule.parameters.map( ( parameter, idx ) => {
				return (
					<Form.Group key={`param-${idx}`} className="mb-2" as={Row} >
						<Col sm={4	} ></Col>
						<Form.Label column sm={2} >{parameter.name}</Form.Label>
						<Col sm={6} >
							<Form.Control
								name={parameter.name}
								type={parameter.type}
								placeholder={t('enter-parameter-value')}
								onChange={( event ) => {
									const newParams = sharedRuleParameters.slice();
									switch ( parameter.type ) {
										case 'number':
											newParams[ idx ] = parseFloat( event.target.value );
											break;
										case 'string':
											newParams[ idx ] = event.target.value;
											break;
									}
									setSharedRuleParameters( newParams );
								}}
								defaultValue={sharedRuleParameters[ idx ] !== void 0 ? sharedRuleParameters[ idx ] : sharedRule.defaults[ idx ]}
							/>
						</Col>
					</Form.Group>
				);
		}) : null}
		<Form.Group className="mb-2" as={Row} >
			<Col sm={4} >
				<Form.Check
					type="checkbox"
					id="shared-ref-checkbox"
					label={t('share-across-lessons')}
				/>
			</Col>
			<Form.Label column sm={2} >{t('common:ref')}</Form.Label>
			<Col sm={6} >
				<CreatableSelect
					isClearable
					options={lessonRefs.map( ( ref ) => ({ value: ref, label: ref }) )}
					onChange={( option ) => {
						setSharedRef( option ? option.value : null );
					}}
					defaultValue={sharedRef ? { value: sharedRef, label: sharedRef } : null}
				/>
			</Col>
		</Form.Group>
	</>;
	const lessonInputs = lessons.map( x => {
		return (
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
				checked={activeLessons[ x._id ] !== void 0}
			/>
		);
	});
	return (
		<Modal size="lg" show={show} onHide={onHide}>
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
					<div style={{ maxHeight: 250, border: 'solid 1px darkgray', overflowY: 'auto', padding: 4 }} >
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


// EXPORTS //

export default SharedEditLessonMetricsModal;
