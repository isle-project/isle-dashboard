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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ComputeModal from './compute_modal.js';
import CreateMetricModal from './create_metric_modal.js';


// VARIABLES //

const COMPLETION_METRICS = [
	{
		name: 'Overall Completion',
		description: 'The overall completion of the course',
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
];


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
	const { t } = useTranslation( 'namespace' );
	const [ selectedMetric, setSelectedMetric ] = useState( null );
	const [ showComputeModal, setShowComputeModal ] = useState( false );
	const metrics = props.namespace.metric || COMPLETION_METRICS;
	return (
		<div style={{ margin: 12 }} >
			<ListGroup>
				{metrics.map( ( metric, idx ) => {
					const handleCompute = () => {
						setSelectedMetric( metric );
						setShowComputeModal( true );
					};
					return (
						<ListGroup.Item key={idx} className="d-flex w-100 justify-content-start" >
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
									<Button variant="secondary" size="sm" className="mx-1" onClick={handleCompute} >{t('common:compute')}</Button>
								</OverlayTrigger>
								<OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-edit-${idx}`} >{t( 'edit-metric-tooltip' )}</Tooltip>} >
									<Button variant="secondary" size="sm" className="mx-1" onClick={function() {}} >{t('common:edit')}</Button>
								</OverlayTrigger>
								<OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-delete-${idx}`} >{t( 'delete-metric-tooltip' )}</Tooltip>} >
									<Button variant="danger" size="sm" className="mx-1" onClick={function() {}} >{t('common:delete')}</Button>
								</OverlayTrigger>
							</span>
						</ListGroup.Item>
					);
				})}
			</ListGroup>
			<OverlayTrigger placement="right" overlay={<Tooltip id="tooltip-create-metric" >{t( 'create-metric-tooltip' )}</Tooltip>} >
				<Button variant="primary" style={{ marginTop: 12 }}>
					{t('common:create-metric')}
				</Button>
			</OverlayTrigger>
			<ComputeModal
				metric={selectedMetric}
				show={showComputeModal}
				onHide={() => setShowComputeModal( false )}
				cohorts={props.cohorts}
			/>
		</div>
	);
}


// PROPERTIES //

CompletionsPage.propTypes = {
	cohorts: PropTypes.array.isRequired,
	namespace: PropTypes.object.isRequired
};


// EXPORTS //

export default CompletionsPage;
