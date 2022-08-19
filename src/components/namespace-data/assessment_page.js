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

import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigate, Route, Routes } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import AssessmentScoresPage from './assessment_scores_page.js';
import TagTable from './tag_table.js';
import MetricsPage from './metrics_page.js';
import ExtensionsPage from './extensions_page.js';


// MAIN //

/**
 * Renders the admin settings page.
 *
 * @param {Object} props - component properties
 * @returns {ReactElement} setting page
 */
const AssessmentPage = ( props ) => {
	const [ activePage, setActivePage ] = useState( window.location.pathname );
	const { t } = useTranslation( [ 'namespace_data', 'common' ] );
	const navigate = useNavigate();
	const handleSelect = ( selectedKey ) => {
		navigate( selectedKey );
		setActivePage( selectedKey );
	};
	return (
		<Fragment>
			<div className="namespace-sub-navbar" >
				<Nav variant="pills" activeKey={activePage} onSelect={handleSelect}>
					<Nav.Item>
					<Nav.Link eventKey="scores" title="Scores" >{t('scores')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
					<Nav.Link eventKey="tags" title="Tags" >{t('tags')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
					<Nav.Link eventKey="metrics" title="Metrics" >{t('metrics')}</Nav.Link>
					</Nav.Item>
					<Nav.Item>
					<Nav.Link eventKey="extensions" title="Extensions" >{t('extensions')}</Nav.Link>
					</Nav.Item>
				</Nav>
			</div>
			<Routes>
				<Route path="scores"
					element={<AssessmentScoresPage
						addNotification={props.addNotification}
						namespace={props.namespace}
						cohorts={props.namespace.cohorts}
						lessons={props.lessons}
						user={props.user}
						computeCompletions={props.computeCompletions}
					/>}
				/>
				<Route path="tags"
					element={<TagTable
						lessons={props.lessons}
						namespace={props.namespace}
					/>}
				/>
				<Route path="metrics"
					element={<MetricsPage
						lessons={props.lessons}
						namespace={props.namespace}
					/>}
				/>
				<Route path="extensions"
					element={<ExtensionsPage
						lessons={props.lessons}
						namespace={props.namespace}
						cohorts={props.namespace.cohorts}
					/>}
				/>
			</Routes>
		</Fragment>
	);
};


// PROPERTIES //

AssessmentPage.propTypes = {
		addNotification: PropTypes.func.isRequired,
		computeCompletions: PropTypes.func.isRequired,
		lessons: PropTypes.array.isRequired,
		namespace: PropTypes.object.isRequired,
		user: PropTypes.object.isRequired
};


// EXPORTS //

export default AssessmentPage;
