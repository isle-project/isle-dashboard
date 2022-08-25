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
import ConfirmModal from 'components/confirm-modal';
import ComputeModal from './compute_modal.js';
import EditMetricModal from './edit_metric_modal.js';
import { levelFieldMapping } from './level_fields.js';
import './assessments.css';


// MAIN //

/**
* Assessment and assessment reports pane.
*
* ## Notes
*
* -   Renders the list of assessment metrics for the course
* -   Configuration displays the list of assessment for the course with an edit and delete button as well as a button to create a new assessment metric.
* -   When creating or editing a assessment metric, users will have to choose a name, the coverage (multi-select box with "all" lessons or ones to "include" or "exclude"), the rule for combining the information across lessons (selected from a fixed list of options) with associated parameters (e.g., dropN where the lowest N grades are dropped), and a `submetric` select field that specifies which metric to use on the lower level (populated by the metrics contained in the selected lessons of the course)
* -   Each assessment metric item has a compute button, which opens a form in a model window containing four fields: A date range select box to define the time range, a multi-select field to choose the set of users for which to compute the grades, a select field for the multiples policy ('last', 'first', 'max', or 'pass-through'), and a tag weight selector
* -   Computing the scores will save the generated results within the individual user objects (associated with the data when they were last computed)
*/
function AssessmentsPage( props ) {
	const { t } = useTranslation( 'assessments' );
	const [ selectedMetric, setSelectedMetric ] = useState( null );
	const [ showComputeModal, setShowComputeModal ] = useState( false );
	const [ showDeleteModal, setShowDeleteModal ] = useState( false );
	const [ showCreateModal, setShowCreateModal ] = useState( false );
	const [ showEditModal, setShowEditModal ] = useState( false );
	const [ submetrics, setSubmetrics ] = useState( null );
	const metrics = props.entity.assessments || [];
	const [ order, setOrder ] = useState( incrspace( 0, metrics.length, 1 ) );
	useEffect( () => {
		// ATTN: this is a hack to get the tags and submetrics to be populated before the first render
		if ( props.level === 'lesson' ) {
			setSubmetrics( props.lessonSubmetrics );
		} else {
			const subentities = props.entity[ levelFieldMapping[ props.level ] ];
			const assessments = new Set();
			subentities.forEach( subentity => {
				subentity.assessments.forEach( assessment => {
					assessments.add( assessment.name );
				});
			});
			setSubmetrics( Array.from( assessments ).sort() );
		}
	}, [ props.entity, props.level, props.lessonSubmetrics ] );

	const handleDeleteMetric = () => {
		const idx = metrics.findIndex( metric => metric.name === selectedMetric.name );
		const newOrder = order.filter( v => v !== idx ).map( x => {
			if ( x > idx ) {
				return x - 1;
			}
			return x;
		});
		setOrder( newOrder );
		props.deleteMetric({
			id: props.entity._id,
			level: props.level,
			name: selectedMetric.name
		})
			.then( response => {
				setSelectedMetric( null );
				setShowDeleteModal( false );
			})
			.catch( err => {
				console.log( 'Error deleting metric:', err );
			});
	};
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
					if ( !metric ) {
						return null;
					}
					const handleCompute = () => {
						setSelectedMetric( metric );
						setShowComputeModal( true );
					};
					// TODO: edit metric functionality & delete metric functionality

					return (
						<ListGroup.Item key={`${metricIndex}-${idx}`} className="d-flex w-100 justify-content-start metric-list-item" >
							<label className="me-2" >
								{metric.name}
								{submetrics && !submetrics.includes( metric.submetric ) && <span className="assessments-warning ms-2" >{t('uses-not-yet-existing-lesson-metric')}</span>}
							</label>
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
								{!metric.autoCompute && <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-compute-${idx}`} >{t( 'compute-metric-tooltip' )}</Tooltip>} >
									<Button variant="secondary" size="sm" className="mx-2" onClick={handleCompute} >{t('common:compute')}</Button>
								</OverlayTrigger>}
								<OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-edit-${idx}`} >{t( 'edit-metric-tooltip' )}</Tooltip>} >
									<Button variant="secondary" size="sm" className="mx-2" onClick={() => {
										setSelectedMetric( metric );
										setShowEditModal( true );
									}} >{t('common:edit')}</Button>
								</OverlayTrigger>
								<OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-delete-${idx}`} >{t( 'delete-metric-tooltip' )}</Tooltip>} >
									<Button variant="danger" size="sm" className="mx-2" onClick={() => {
										setSelectedMetric( metric );
										setShowDeleteModal( true );
									}} >{t('common:delete')}</Button>
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
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-create-metric" >{t( 'create-metric-tooltip' )}</Tooltip>} >
				<Button variant="primary" style={{ marginTop: 12 }} onClick={() => {
					setShowCreateModal( true );
				}} >
					{t('create-metric')}
				</Button>
			</OverlayTrigger>
			{selectedMetric ? <ComputeModal
				key={`compute-modal-${selectedMetric.name}`}
				metric={selectedMetric}
				show={showComputeModal}
				onHide={() => setShowComputeModal( false )}
				cohorts={props.cohorts}

				entity={props.entity}
				level={props.level}
				computeAssessments={props.computeAssessments}
				onCompute={() => setShowComputeModal( false )}
			/> : null}
			{showCreateModal ? <EditMetricModal
				key="create-modal"
				show={showCreateModal}
				onHide={() => setShowCreateModal( false )}
				allRules={props.settings.assessmentRules}
				level={props.level}
				entity={props.entity}
				submetrics={submetrics}
				createNew={true}
				onConfirm={( body ) => {
					props.createMetric( body );
					const newOrder = order.slice();
					newOrder.push( order.length );
					setOrder( newOrder );
				}}
			/> : null}
			{showDeleteModal ? <ConfirmModal
				title={t('delete-metric')}
				message={t('delete-metric-confirm')}
				close={() => setShowDeleteModal( false )}
				show={showDeleteModal}
				onConfirm={handleDeleteMetric}
			/> : null }
			{showEditModal ? <EditMetricModal
				key={`edit-modal-${selectedMetric.name}`}
				show={showEditModal}
				onHide={() => setShowEditModal( false )}
				allRules={props.settings.assessmentRules}
				level={props.level}
				entity={props.entity}
				submetrics={submetrics}
				createNew={false}
				metric={selectedMetric}
				onConfirm={props.updateMetric}
			/> : null}
		</div>
	);
}


// PROPERTIES //

AssessmentsPage.propTypes = {
	cohorts: PropTypes.array.isRequired,
	computeAssessments: PropTypes.func.isRequired,
	createMetric: PropTypes.func.isRequired,
	deleteMetric: PropTypes.func.isRequired,
	entity: PropTypes.object.isRequired,
	lessonSubmetrics: PropTypes.array.isRequired,
	level: PropTypes.string.isRequired,
	settings: PropTypes.object.isRequired,
	updateMetric: PropTypes.func.isRequired
};


// EXPORTS //

export default AssessmentsPage;
