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
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import incrspace from '@stdlib/array/incrspace';
import server from 'constants/server';
import ComputeModal from './compute_modal.js';
import CreateMetricModal from './create_metric_modal.js';
import { levelFieldMapping, levelPredecessorMapping } from './level_fields.js';
import './completions.css';


// VARIABLES //

// TODO: generalize for usage in programs, namespaces, lessons

const COMPLETION_METRICS = [
	{
		name: 'Overall Completion',
		description: 'The overall completion of the course',
		coverage: [ 'all' ],
		rule: [ 'avg' ],
		ref: 'completed'
	},
	{
		name: 'Lab Completion',
		description: 'The lab completion of the course',
		coverage: [ 'all' ],
		rule: [ 'avg' ],
		ref: 'completed'
	},
	{
		name: 'Quiz completion',
		description: '',
		coverage: [ 'include', '123', '456' ],
		rule: [ 'dropNLowest', 3 ],
		ref: 'completed'
	}
]; // TODO: read completion metrics from the server

// TODO: Need specification for the parameters and their types (use the `attr-types` library)
const COMPLETION_RULES = [
	{
		name: 'avg',
		parameters: [],
		defaults: []
	},
	{
		name: 'dropLowest',
		parameters: [],
		defaults: []
	},
	{
		name: 'dropNLowest',
		parameters: [ {
			name: 'n',
			type: 'number'
		}],
		defaults: [ 3 ]
	}
]; // TODO: read completion rules from the server


// MAIN //

/**
* Completion and assessment reports pane.
*
* ## Notes
*
* -   Renders the list of completion metrics for the course
* -   Configuration displays the list of completion for the course with an edit and delete button as well as a button to create a new completion metric.
* -   When creating or editing a completion metric, users will have to choose a name, the coverage (multi-select box with "all" lessons or ones to "include" or "exclude"), the rule for combining the information across lessons (selected from a fixed list of options) with associated parameters (e.g., dropN where the lowest N grades are dropped), and a `ref` select field that specifies which metric to use on the lower level (populated by the metrics contained in the selected lessons of the course)
* -   Each completion metric item has a compute button, which opens a form in a model window containing four fields: A date range select box to define the time range, a multi-select field to choose the set of users for which to compute the grades, a select field for the multiples policy ('last', 'first', 'max', or 'pass-through'), and a tag weight selector
* -   Computing the scores will save the generated results within the individual user objects (associated with the data when they were last computed)
*/
function CompletionsPage( props ) {
	const { t } = useTranslation( 'completions' );
	const [ selectedMetric, setSelectedMetric ] = useState( null );
	const [ showComputeModal, setShowComputeModal ] = useState( false );
	const [ showCreateModal, setShowCreateModal ] = useState( false );
	const [ tags, setTags ] = useState( null );
	const [ refs, setRefs ] = useState( null );
	const metrics = props.entity.metric || COMPLETION_METRICS;
	console.log( incrspace( 0, metrics.length, 1 ) );
	const [ order, setOrder ] = useState( incrspace( 0, metrics.length, 1 ) );
	useEffect( () => {
		axios.post( `${server}/completion_tags` )
			.then( response => {
				setTags( response.data );
			})
			.catch( err => {
				console.log( 'Error fetching completion tags:', err );
				setTags([
					'quiz',
					'homework',
					'exam',
					'_default_tag'
				]);
			});
		axios.post( `${server}/completion_refs`, {
			target: levelPredecessorMapping[ props.level ],
			entities: props.entity[ levelFieldMapping[ props.level ] ]
		})
			.then( response => {
				setRefs( response.data );
			})
			.catch( err => {
				console.log( 'Error fetching completion refs:', err );
			});
	}, [ props.entity, props.level ] );

	const transposeMetrics = ( index, next ) => {
		return debounce( () => {
			const newOrder = [ ...order ];
			const i = newOrder[ index ];
			if ( next ) {
				newOrder[ index ] = newOrder[ index + 1 ];
				newOrder[ index + 1 ] = i;
			} else {
				newOrder[ index ] = newOrder[ index - 1 ];
				newOrder[ index - 1 ] = i;
			}
			setOrder( newOrder );
			axios.post( `${server}/metric_order`, { id: props.entity._id, level: props.level, index: index, next: next })
				.then( response => {
					console.log( response );
				})
				.catch( err => {
					console.log( 'Error updating metric order:', err );
				});
		}, 200 );
	};
	return (
		<div style={{ margin: 12 }} >
			<ListGroup>
				{order.map( ( metricIndex, idx ) => {
					const metric = metrics[ metricIndex ];
					const handleCompute = () => {
						setSelectedMetric( metric );
						setShowComputeModal( true );
					};
					// TODO: edit metric functionality & delete metric functionality

					return (
						<ListGroup.Item key={`${metricIndex}-${idx}`} className="d-flex w-100 justify-content-start metric-list-item" >
							<label className="me-2" >{metric.name}</label>
							<span
								style={{
									display: 'inline-block',
									maxWidth: 'calc(100% - 400px)',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									fontStyle: 'italic'
								}}
							>{metric.description}</span>
							<span className="ms-auto" >
								<OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-compute-${idx}`} >{t( 'compute-metric-tooltip' )}</Tooltip>} >
									<Button variant="secondary" size="sm" className="mx-2" onClick={handleCompute} >{t('common:compute')}</Button>
								</OverlayTrigger>
								<OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-edit-${idx}`} >{t( 'edit-metric-tooltip' )}</Tooltip>} >
									<Button variant="secondary" size="sm" className="mx-2" onClick={function() {}} >{t('common:edit')}</Button>
								</OverlayTrigger>
								<OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-delete-${idx}`} >{t( 'delete-metric-tooltip' )}</Tooltip>} >
									<Button variant="danger" size="sm" className="mx-2" onClick={function() {}} >{t('common:delete')}</Button>
								</OverlayTrigger>
								<Button
									aria-label={t('move-metric-down')}
									size="sm" variant="secondary"
									className="mx-1" disabled={idx === metrics.length - 1}
									onClick={transposeMetrics( idx, true )}
								>
									<i className="fas fa-chevron-down" />
								</Button>
								<Button
									aria-label={t('move-metric-up')}
									size="sm" variant="secondary"
									disabled={idx === 0}
									onClick={transposeMetrics( idx, false )}
								>
									<i className="fas fa-chevron-up" />
								</Button>
							</span>
						</ListGroup.Item>
					);
				})}
			</ListGroup>
			<OverlayTrigger placement="right" overlay={<Tooltip id="tooltip-create-metric" >{t( 'create-metric-tooltip' )}</Tooltip>} >
				<Button variant="primary" style={{ marginTop: 12 }} onClick={() => {
					setShowCreateModal( true );
				}} >
					{t('common:create-completion-metric')}
				</Button>
			</OverlayTrigger>
			{selectedMetric ? <ComputeModal
				key={`compute-modal-${selectedMetric.name}`}
				metric={selectedMetric}
				show={showComputeModal}
				onHide={() => setShowComputeModal( false )}
				cohorts={props.cohorts}
				tags={tags}
				entity={props.entity}
				level={props.level}
			/> : null}
			{showCreateModal ? <CreateMetricModal
				key="create-modal"
				show={showCreateModal}
				onHide={() => setShowCreateModal( false )}
				allRules={COMPLETION_RULES}
				level={props.level}
				entity={props.entity}
				refs={refs}
			/> : null}
		</div>
	);
}


// PROPERTIES //

CompletionsPage.propTypes = {
	cohorts: PropTypes.array.isRequired,
	entity: PropTypes.object.isRequired,
	level: PropTypes.string.isRequired,
	transposeMetric: PropTypes.func.isRequired
};


// EXPORTS //

export default CompletionsPage;
