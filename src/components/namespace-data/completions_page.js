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
import stringify from 'csv-stringify';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tooltip from 'react-bootstrap/Tooltip';
import isArray from '@stdlib/assert/is-array';
import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';
import DashboardTable from 'components/dashboard-table';
import DashboardDataExplorer from 'ev/components/data-explorer';
import obsToVar from '@isle-project/utils/obs-to-var';
import server from 'constants/server';
import saveAs from 'utils/file_saver.js';
import createTextColumn from 'utils/create_text_column.js';
import './progress_page.css';
import 'css/input_range.css';


// FUNCTIONS //

function filterMethodCategories( filter, row ) {
	if ( filter.value === 'all' ) {
		return true;
	}
	const id = filter.pivotId || filter.id;
	if ( row[ id ] === void 0 ) {
		return true;
	}
	if ( isArray( filter.value ) ) {
		return contains( filter.value, String( row[ id ] ) );
	}
	return String( row[ id ] ) === filter.value;
}

/**
 * Extracts metrics from cohort members for the chosen scope and returns a list of metrics.
 *
 * @param {Array} cohorts - array of cohorts
 * @param {Object} scope - scope of the completions (with 'value' key having value either `course-wide` or a lesson identifier)
 * @param {Object} namespace - namespace object
 * @returns {Array} array of objects with label (name of the metric) and value (key in user object)
 */
function extractMetricSet( cohorts, scope, namespace ) {
	const metricSet = new Set();
	const metricLabels = {};
	const keyCriterion = scope.value === 'course-wide' ? `namespace-${namespace._id}-` : `lesson-${scope.value}-`;
	for ( let i = 0; i < cohorts.length; i++ ) {
		for ( let j = 0; j < cohorts[ i ].members.length; j++ ) {
			console.log( 'Cohorts: ', cohorts[ i ] );
			const userCompletions = Object.keys( cohorts[ i ].members[ j ].completions || {} );
			for ( let k = 0; k < userCompletions.length; ++k ) {
				const key = userCompletions[k];
				if ( key.startsWith(keyCriterion) ) {
					metricSet.add( key );
					metricLabels[ key ] = cohorts[ i ].members[ j ].completions[ key ].metricName;
				}
			}
		}
	}
	const uniqueMetrics = [];
	metricSet.forEach( key => {
		uniqueMetrics.push( { value: key, label: metricLabels[ key ] } );
	});
	uniqueMetrics.sort( (a, b) => a.label.localeCompare( b.label ) );
	return uniqueMetrics;
}


// MAIN //

class CompletionsPage extends Component {
	constructor( props ) {
		super( props );

		const scope = { value: 'course-wide', label: props.t('common:course-wide') };
		this.metrics = extractMetricSet( props.cohorts, scope, props.namespace );
		this.columns = this.createColumns( props.lessons, props.cohorts );
		this.state = {
			displayedMembers: [],
			showExplorer: false,
			scope: scope
		};
	}

	componentDidMount() {
		this.createDisplayedMembers();
	}

	componentDidUpdate( prevProps, prevState ) {
		if (
			this.props.cohorts !== prevProps.cohorts ||
			this.props.lessons !== prevProps.lessons ||
			this.state.scope !== prevState.scope
		) {
			this.metrics = extractMetricSet( this.props.cohorts, this.state.scope, this.props.namespace );
			this.columns = this.createColumns( this.props.lessons, this.props.cohorts );
			this.createDisplayedMembers();
		}
	}

	createDisplayedMembers() {
		let members = [];
		for ( let i = 0; i < this.props.cohorts.length; i++ ) {
			const cohortMembers = this.props.cohorts[ i ].members;
			for ( let j = 0; j < cohortMembers.length; j++ ) {
				cohortMembers[ j ].cohort = this.props.cohorts[ i ].title;
				if ( !cohortMembers[ j ].lessonGrades ) {
					cohortMembers[ j ].lessonGrades = {};
				}
			}
			members = members.concat( this.props.cohorts[ i ].members );
		}
		this.setState({ // eslint-disable-line react/no-did-mount-set-state
			displayedMembers: members
		});
	}

	createColumns( lessons, cohorts ) {
		const { t } = this.props;
		const COLUMNS = [
			{
				Header: 'Pic',
				accessor: 'picture',
				Cell: row => (
					<img className="table-pic" src={`${server}/thumbnail/${row.original.picture}`} alt="Profile Pic" />
				),
				maxWidth: 46,
				minWidth: 46,
				filterable: false,
				resizable: false,
				sortable: false,
				style: { color: 'darkslategrey' }
			},
			createTextColumn({
				Header: t('common:first-name'),
				id: 'first_name',
				accessor: 'firstName',
				maxWidth: 75,
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			}),
			createTextColumn({
				Header: t('common:last-name'),
				id: 'last_name',
				accessor: 'lastName',
				maxWidth: 75,
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			}),
			createTextColumn({
				Header: t('common:email'),
				accessor: 'email',
				maxWidth: 200,
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			}),
			{
				Header: t('common:cohort'),
				accessor: 'cohort',
				style: { marginTop: '8px', color: 'darkslategrey' },
				filterMethod: filterMethodCategories,
				Filter: ({ filter, onChange }) => {
					const handleChange = ( event ) => {
						const newValue = event.target.value;
						onChange( newValue );
					};
					let value;
					if ( !filter ) {
						value = 'all';
					} else if ( isArray( filter.value ) ) {
						value = filter.value.join( ', ' );
					} else {
						value = filter.value;
					}
					return (
						<select
							onBlur={handleChange} onChange={handleChange}
							style={{ width: '100%', backgroundColor: 'ghostwhite' }}
							value={value}
						>
							<option value="all">Show All</option>
							{cohorts.map( ( v, key ) => {
								return (
									<option
										key={key}
										value={`${v.title}`}
									>{v.title}</option>
								);
							})}
						</select>
					);
				}
			}
		];
		for ( let i = 0; i < this.metrics.length; i++ ) {
			COLUMNS.push({
				Header: this.metrics[ i ].label,
				accessor: 'completions.'+this.metrics[ i ].value+'.score'
			});
		}
		return COLUMNS;
	}

	assembleData() {
		const displayedMembers = this.dashboardTable.getResolvedState().sortedData;
		const len = displayedMembers.length;
		const out = new Array( len );
		for ( let i = 0; i < len; i++ ) {
			const member = displayedMembers[ i ]._original;
			out[ i ] = {
				name: member.name,
				firstName: member.firstName,
				lastName: member.lastName,
				email: member.email,
				cohort: member.cohort
			};
		}
		return out;
	}

	saveJSON = () => {
		const data = this.assembleData();
		const blob = new Blob([ JSON.stringify( data ) ], {
			type: 'application/json'
		});
		const name = `completions_${this.props.namespace.title}.json`;
		saveAs( blob, name );
	};

	saveCSV = () => {
		const data = this.assembleData();
		stringify( data, {
			header: true
		}, ( err, output ) => {
			if ( err ) {
				return this.props.addNotification({
					title: 'Error encountered',
					message: 'Encountered an error while creating CSV: '+err.message,
					level: 'error',
					position: 'tl'
				});
			}
			const blob = new Blob([ output ], {
				type: 'text/plain'
			});
			const name = `completions_${this.props.namespace.title}.csv`;
			saveAs( blob, name );
		});
	};

	toggleExplorer = () => {
		this.setState({
			showExplorer: !this.state.showExplorer
		});
	};

	handleScopeChange = ( value ) => {
		this.setState({
			scope: value
		});
	};

	renderMetricSelect() {
		const { t } = this.props;
		const options = [
			{ value: 'course-wide', label: t('common:course-wide') },
			...this.props.lessons.map( ( lesson ) => {
				return {
					value: lesson._id,
					label: lesson.title
				};
			})
		];
		return (
			<Form.Group className="align-items-center d-flex" as={Row} style={{ float: 'right', marginRight: 6, minWidth: 350, marginTop: -3 }} >
				<Col md={4} >
					<Form.Label style={{ marginBottom: 0 }} >
						{t('display-for')}:
					</Form.Label>
				</Col>
				<Col md={8} >
					<Select
						defaultValue={options[ 0 ]}
						options={options}
						onChange={this.handleScopeChange}
					/>
				</Col>
			</Form.Group>
		);
	}

	render() {
		const { t } = this.props;
		if ( this.state.showExplorer ) {
			let data = this.assembleData();
			data = obsToVar( data );
			const quantitative = [];
			const categorical = [ 'name', 'email', 'cohort' ];
			for ( let i = 0; i < this.props.lessons.length; i++ ) {
				quantitative.push( this.props.lessons[ i ].title );
			}
			return (
				<DashboardDataExplorer
					title={t('explorer-grades-title')}
					data={data}
					categorical={categorical}
					quantitative={quantitative}
					close={this.toggleExplorer}
				/>
			);
		}
		return (
			<Fragment>
				<div className="namespace-data-buttons" >
					<ButtonGroup className="progress-button-group" >
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="csvTooltip" >{t('save-as-csv')}</Tooltip>}>
							<Button size="sm" variant="secondary" onClick={this.saveCSV} ><i className="fas fa-download"></i> CSV</Button>
						</OverlayTrigger>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="jsonTooltip">{t('save-as-json')}</Tooltip>}>
							<Button size="sm" variant="secondary" onClick={this.saveJSON} ><i className="fas fa-download"></i> JSON</Button>
						</OverlayTrigger>
					</ButtonGroup>
					{this.renderMetricSelect()}
				</div>
				<div className="namespace-data-page">
					<DashboardTable
						className="grades-table"
						data={this.state.displayedMembers}
						columns={this.columns}
						t={t}
						ref={(r) => {
							this.dashboardTable = r;
						}}
						onButtonClick={this.toggleExplorer}
					/>
				</div>
			</Fragment>
		);
	}
}


// PROPERTIES //

CompletionsPage.propTypes = {
	addNotification: PropTypes.func.isRequired,
	cohorts: PropTypes.array.isRequired,
	lessons: PropTypes.array.isRequired,
	namespace: PropTypes.object.isRequired
};

CompletionsPage.defaultProps = {
};


// EXPORTS //

export default withTranslation( [ 'namespace_data', 'common' ] )( CompletionsPage );
