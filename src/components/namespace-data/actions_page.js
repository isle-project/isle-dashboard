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

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import logger from 'debug';
import Select from 'react-select';
import './actions_page.css';


// VARIABLES //

const debug = logger( 'isle-dashboard:namespace-data:actions-page' );


// MAIN //

class ActionsPage extends Component {
	constructor( props ) {
		super( props );

		const cohortOptions = props.cohorts.map( cohort => {
			return { label: cohort.title, value: cohort };
		});

		let displayedMembers = [];
		for ( let i = 0; i < props.cohorts.length; i++ ) {
			displayedMembers = displayedMembers.concat( props.cohorts[i].members);
		}

		this.state = {
			cohortOptions: cohortOptions,
			selectedCohorts: cohortOptions,
			displayedMembers: displayedMembers,
			lessonActionsPage: false,
			actualLesson: null,
			anonymized: true
		};
	}

	retrieveActions = () => {
		this.props.getNamespaceActions({
			namespaceID: this.props.namespace._id,
			namespaceTitle: this.props.namespace.title
		});
	};

	handleRadioChange = ( val ) => {
		this.setState({
			anonymized: !this.state.anonymized
		});
	};

	handleCohortChange = ( cohorts ) => {
		let members = [];
		for ( let i = 0; i < cohorts.length; i++ ) {
			members = members.concat( cohorts[ i ].value.members );
		}
		this.setState({
			selectedCohorts: cohorts,
			displayedMembers: members
		}, () => {
			debug( 'New number of displayed members: '+this.state.displayedMembers.length );
		});
	};

	renderCohorts() {
		return (
			<Fragment>
				<div className="actions-page-cohorts">
					<div style={{ width: '400px', height: '40px' }}>
						<Select
							value={this.state.selectedCohorts}
							isMulti
							name="cohorts"
							options={this.state.cohortOptions}
							onChange={this.handleCohortChange}
						/>
					</div>
				</div>
			</Fragment>
		);
	}

	renderLessonActionsPage() {
		return (
			<div className="actions-page-lesson-action-page">
				<div className="lesson-action-page-resize">	&#x1f5d6;</div>
				<button onClick={this.hideLessonActions} className="lesson-action-page-exit empty-button">&#10005;</button>
				<div className="lesson-action-page-title">{ this.state.actualLesson.title}</div>
				<div className="lesson-action-page-filter">
					{this.renderCohorts() }
				</div>
			</div>
		);
	}


	hideLessonActions = () => {
		this.setState({
			lessonActionsPage: false
		});
	};

	showLessonActions = (lesson) => {
		this.setState({
			lessonActionsPage: true,
			actualLesson: lesson
		});
	};

	renderLessons() {
		const lessons = this.props.namespace.lessons;
		const list = [];
		for ( let i = 0; i < lessons.length; i++ ) {
			list.push(
				<button key={i} onClick={()=> this.showLessonActions( lessons[i] )} className="actions-page-lesson">
					<div className="actions-page-lesson-title">{lessons[i].title}</div>
				</button>
			);
		}
		return (
			<div className="actions-page">
				<div className="actions-page-export">
				{ this.renderExportSection() }
				</div>
				<div className="actions-page-lessons">
					{ list }
				</div>
			</div>
		);
	}

	renderExportSection() {
		return (
			<Fragment>
				<div className="actions-page-export-title">Export Actions</div>
				<ToggleButtonGroup
					name="options"
					onChange={this.handleRadioChange}
					type="radio"
					size="small"
					value={this.state.anonymized}
				>
					<ToggleButton
						size="sm"
						variant="light"
						value={false}
						style={{
							fontSize: '12px',
							color: this.state.anonymized ? '#A9A9A9' : 'black'
						}}
					>Original</ToggleButton>
					<ToggleButton
						size="sm"
						variant="light"
						value={true}
						style={{
							fontSize: '12px',
							color: this.state.anonymized ? 'black' : '#A9A9A9'
						}}
					>Anonymized</ToggleButton>
				</ToggleButtonGroup>
				<Button onClick={this.retrieveActions}>
					Save all namespace actions
				</Button>
			</Fragment>
		);
	}

	render() {
		return ( <div className="namespace-data-page">
			{ this.renderLessons() }
			{ this.state.lessonActionsPage ? this.renderLessonActionsPage() : null }
		</div> );
	}
}


// PROPERTIES //

ActionsPage.propTypes = {
	cohorts: PropTypes.array.isRequired,
	getNamespaceActions: PropTypes.func.isRequired,
	namespace: PropTypes.object.isRequired
};

ActionsPage.defaultProps = {
};


// EXPORTS //

export default ActionsPage;
