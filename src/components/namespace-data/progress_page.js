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
import logger from 'debug';
import { withTranslation } from 'react-i18next';
import stringify from 'csv-stringify';
import InputRange from 'react-input-range';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import round from '@stdlib/math/base/special/round';
import min from '@stdlib/math/base/special/min';
import isArray from '@stdlib/assert/is-array';
import isUndefinedOrNull from '@stdlib/assert/is-undefined-or-null';
import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';
import DashboardTable from 'components/dashboard-table';
import DashboardDataExplorer from 'ev/components/data-explorer';
import obsToVar from '@isle-project/utils/obs-to-var';
import server from 'constants/server';
import saveAs from 'utils/file_saver.js';
import createTextColumn from 'utils/create_text_column.js';
import EditableProgress from './editable_progress.js';
import formatTime from 'utils/format_time.js';
import './progress_page.css';
import 'css/input_range.css';


// VARIABLES //

const debug = logger( 'isle:progress-page' );


// FUNCTIONS //

function filterNumbersFactory( lessons, idx ) {
	return ( filter, row ) => {
		const data = row[ filter.id ];
		const lessonData = data[ lessons[ idx ]._id ];
		if ( isUndefinedOrNull( lessonData ) ) {
			return filter.value.min === 0;
		}
		const progress = min( round( lessonData.progress*100 ), 100 );
		return progress >= filter.value.min && progress <= filter.value.max;
	};
}

function sortFactory( lessons, idx ) {
	return ( a, b ) => {
		a = a[ lessons[ idx ]._id ];
		b = b[ lessons[ idx ]._id ];
		if ( !a && !b ) {
			return 0;
		}
		if ( a && !b ) {
			return 1;
		}
		if ( !a && b ) {
			return -1;
		}
		if ( a.progress > b.progress ) {
			return 1;
		}
		if ( a.progress < b.progress ) {
			return -1;
		}
		return 0;
	};
}

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


// MAIN //

class ProgressPage extends Component {
	constructor( props ) {
		super( props );

		this.columns = this.createColumns( props.lessons, props.cohorts );
		this.state = {
			displayedMembers: [],
			lessonSortDirection: 'ascending',
			lessonOrder: 'createdAt',
			showExplorer: false
		};
	}

	componentDidMount() {
		this.createDisplayedMembers();
	}

	componentDidUpdate( prevProps ) {
		if (
			this.props.cohorts !== prevProps.cohorts ||
			this.props.lessons !== prevProps.lessons
		) {
			this.createDisplayedMembers();
			this.columns = this.createColumns( this.props.lessons, this.props.cohorts );
		}
	}

	createDisplayedMembers() {
		let members = [];
		for ( let i = 0; i < this.props.cohorts.length; i++ ) {
			const cohortMembers = this.props.cohorts[ i ].members;
			for ( let j = 0; j < cohortMembers.length; j++ ) {
				cohortMembers[ j ].cohort = this.props.cohorts[ i ].title;
				if ( !cohortMembers[ j ].lessonData ) {
					cohortMembers[ j ].lessonData = {};
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
				Header: t('first-name'),
				id: 'first_name',
				accessor: 'firstName',
				maxWidth: 75,
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			}),
			createTextColumn({
				Header: t('last-name'),
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
		for ( let i = 0; i < lessons.length; i++ ) {
			const id = 'lesson_'+i;
			COLUMNS.push({
				id,
				Header: <span id={id} >{lessons[ i ].title}</span>,
				_lesson: lessons[ i ],
				Cell: this.accessorFactory( lessons, i ),
				accessor: 'lessonData',
				sortMethod: sortFactory( lessons, i ),
				filterMethod: filterNumbersFactory( lessons, i ),
				Filter: ({ filter, onChange }) => {
					const defaultVal = {
						max: 100,
						min: 0
					};
					return (
						<div style={{
							paddingLeft: '4px',
							paddingRight: '4px',
							paddingTop: '8px'
						}}>
							<InputRange
								ariaLabelledby={id}
								ariaControls="dashboard-table"
								allowSameValues
								maxValue={100}
								minValue={0}
								value={filter ? filter.value : defaultVal}
								onChange={( newValue ) => {
									onChange( newValue );
								}}
							/>
						</div>
					);
				}
			});
		}
		return COLUMNS;
	}

	accessorFactory = ( lessons, idx ) => {
		const { t } = this.props;
		return d => {
			let data = d.original.lessonData;
			const lessonID = lessons[ idx ]._id;
			data = data[ lessonID ];
			if ( data ) {
				const progress = min( round( data.progress*100 ), 100 );
				return (
					<span style={{ fontSize: '12px', fontWeight: 800 }}>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="durationTooltip" >{t('hours-minutes-seconds')}</Tooltip>}>
							<span>{t('duration')}: {formatTime( data.spentTime )}</span>
						</OverlayTrigger>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="startTooltip" >{t('first-accessed')}</Tooltip>}>
							<span> | {new Date( data.createdAt ).toLocaleString()}</span>
						</OverlayTrigger>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="startTooltip" >{t('last-accessed')}</Tooltip>}>
							<span> - {new Date( data.updatedAt ).toLocaleString()}</span>
						</OverlayTrigger>
						<br />
						<EditableProgress
							progress={progress}
							email={d.original.email}
							lessonID={lessonID}
							onSubmit={( newProgress ) => {
								this.props.adjustProgress({
									email: d.original.email,
									lessonID: lessonID,
									namespaceID: this.props.namespace._id,
									cohort: d.original.cohort,
									progress: newProgress
								});
							}}
						/>
					</span>
				);
			}
			return <span></span>;
		};
	};

	assembleData() {
		const displayedMembers = this.dashboardTable.getResolvedState().sortedData;
		const len = displayedMembers.length;
		const out = new Array( len );
		const lessons = this.props.lessons;
		for ( let i = 0; i < len; i++ ) {
			const member = displayedMembers[ i ]._original;
			out[ i ] = {
				name: member.name,
				firstName: member.firstName,
				lastName: member.lastName,
				email: member.email,
				cohort: member.cohort
			};
			const availableCustomFields = this.props.user.availableCustomFields;
			for ( let j = 0; j < availableCustomFields.length; j++ ) {
				const fieldName = availableCustomFields[ j ].name;
				if ( member.customFields ) {
					out[ i ][ fieldName ] = member.customFields[ fieldName ];
				} else {
					out[ i ][ fieldName ] = null;
				}
			}
			for ( let j = 0; j < lessons.length; j++ ) {
				const lessonName = lessons[ j ]._id;
				let data = member.lessonData;
				if ( data && data[ lessonName ] ) {
					data = data[ lessonName ];
					out[ i ][ lessons[ j ].title+'_question_progress' ] = min( round( data.progress*100 ), 100 );
					out[ i ][ lessons[ j ].title+'_time' ] = round( data.spentTime / ( 1000*60 ) );
					out[ i ][ lessons[ j ].title+'_first_accessed' ] = new Date( data.createdAt ).toLocaleString();
					out[ i ][ lessons[ j ].title+'_last_accessed' ] = new Date( data.updatedAt ).toLocaleString();
				} else {
					out[ i ][ lessons[ j ].title+'_question_progress' ] = 0;
					out[ i ][ lessons[ j ].title+'_time' ] = 0;
					out[ i ][ lessons[ j ].title+'_first_accessed' ] = '';
					out[ i ][ lessons[ j ].title+'_last_accessed' ] = '';
				}
			}
		}
		return out;
	}

	saveJSON = () => {
		const data = this.assembleData();
		const blob = new Blob([ JSON.stringify( data ) ], {
			type: 'application/json'
		});
		const name = `completion_${this.props.namespace.title}.json`;
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
			const name = `completion_${this.props.namespace.title}.csv`;
			saveAs( blob, name );
		});
	};

	toggleExplorer = () => {
		this.setState({
			showExplorer: !this.state.showExplorer
		});
	};

	reorderColumns( lessonOrder, lessonSortDirection ) {
		debug( 'Sort columns by '+lessonOrder+' in '+lessonSortDirection+' order' );
		if ( lessonSortDirection === 'ascending' ) {
			return this.columns.slice().sort( ( a, b ) => {
				if ( !a._lesson || !b._lesson ) {
					return 1;
				}
				if ( lessonOrder === 'title' ) {
					return a._lesson.title.localeCompare( b._lesson.title );
				}
				return a._lesson[ lessonOrder ] > b._lesson[ lessonOrder ] ? 1 : -1;
			});
		}
		return this.columns.slice().sort( ( a, b ) => {
			if ( !a._lesson || !b._lesson ) {
				return 1;
			}
			if ( lessonOrder === 'title' ) {
				return b._lesson.title.localeCompare( a._lesson.title );
			}
			return a._lesson[ lessonOrder ] < b._lesson[ lessonOrder ] ? 1 : -1;
		});
	}

	renderSortButton() {
		const { t } = this.props;
		let title;
		switch ( this.state.lessonOrder ) {
			case 'title':
				title = t('common:sort-alphabetically');
				break;
			case 'createdAt':
				title = t('common:sort-create-date');
				break;
			case 'updatedAt':
				title = t('common:sort-update-date');
				break;
		}
		return (
			<ButtonGroup className="sort-button-group" >
				<DropdownButton size="sm" variant="secondary" onSelect={( newValue ) => {
					this.columns = this.reorderColumns( newValue, this.state.lessonSortDirection );
					this.setState({ lessonOrder: newValue });
				}} id="dropdown" title={<small>{title}</small>} >
					<Dropdown.Item eventKey="title" >
						<small>{t('common:sort-alphabetically')}</small>
					</Dropdown.Item>
					<Dropdown.Item eventKey="createdAt" >
						<small>{t('common:sort-create-date')}</small>
					</Dropdown.Item>
					<Dropdown.Item eventKey="updatedAt" >
						<small>{t('common:sort-update-date')}</small>
					</Dropdown.Item>
				</DropdownButton>
				<Button size="sm" variant="secondary" style={{ marginLeft: 2 }} onClick={() => {
					if ( this.state.lessonSortDirection === 'ascending' ) {
						this.columns = this.reorderColumns( this.state.lessonOrder, 'descending' );
						this.setState({ lessonSortDirection: 'descending' });
					} else {
						this.columns = this.reorderColumns( this.state.lessonOrder, 'ascending' );
						this.setState({ lessonSortDirection: 'ascending' });
					}
				}} aria-label={this.state.lessonSortDirection === 'ascending' ?
				t('common:sort-descending') : t('common:sort-ascending')} >
					{ this.state.lessonSortDirection === 'ascending' ?
						<i className="fas fa-arrow-right" /> :
						<i className="fas fa-arrow-left" />
					}
				</Button>
			</ButtonGroup>
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
				const title = this.props.lessons[ i ].title;
				quantitative.push( `${title}_question_progress` );
				quantitative.push( `${title}_time` );
				categorical.push( `${title}_first_accessed` );
				categorical.push( `${title}_last_accessed` );
			}
			const availableCustomFields = this.props.user.availableCustomFields;
			for ( let i = 0; i < availableCustomFields.length; i++ ) {
				categorical.push( availableCustomFields[ i ].name );
			}
			return (
				<DashboardDataExplorer
					title={t('explorer-progress-title')}
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
					{this.renderSortButton()}
					<ButtonGroup className="progress-button-group" >
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="csvTooltip" >{t('save-as-csv')}</Tooltip>}>
							<Button size="sm" variant="secondary" onClick={this.saveCSV} ><i className="fas fa-download"></i> CSV</Button>
						</OverlayTrigger>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="jsonTooltip">{t('save-as-json')}</Tooltip>}>
							<Button size="sm" variant="secondary" onClick={this.saveJSON} ><i className="fas fa-download"></i> JSON</Button>
						</OverlayTrigger>
					</ButtonGroup>
				</div>
				<div className="namespace-data-page">
					<DashboardTable
						className="progress-table"
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

ProgressPage.propTypes = {
	addNotification: PropTypes.func.isRequired,
	adjustProgress: PropTypes.func.isRequired,
	cohorts: PropTypes.array.isRequired,
	lessons: PropTypes.array.isRequired,
	namespace: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired
};

ProgressPage.defaultProps = {
};


// EXPORTS //

export default withTranslation( [ 'namespace_data', 'common' ] )( ProgressPage );
