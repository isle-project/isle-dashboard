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
import ReactTable from 'react-table';
import InputRange from 'react-input-range';
import { Button, ButtonGroup, ProgressBar, DropdownButton, Dropdown } from 'react-bootstrap';
import stringify from 'csv-stringify';
import round from '@stdlib/math/base/special/round';
import min from '@stdlib/math/base/special/min';
import isArray from '@stdlib/assert/is-array';
import isUndefinedOrNull from '@stdlib/assert/is-undefined-or-null';
import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';
import trim from '@stdlib/string/trim';
import server from 'constants/server';
import saveAs from 'utils/file_saver.js';
import formatTime from 'utils/format_time.js';
import './progress_page.css';
import 'react-table/react-table.css';
import 'css/table.css';
import './input_range.css';


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

function accessorFactory( lessons, idx ) {
	return d => {
		let data = d.original.lessonData;
		data = data[ lessons[ idx ]._id ];
		if ( data ) {
			const progress = min( round( data.progress*100 ), 100 );
			return ( <span>
				<span style={{ fontSize: '12px', fontWeight: 800 }}>Duration: {formatTime( data.spentTime )}</span>
				<ProgressBar style={{ fontSize: '10px', height: '12px'
				}} now={progress} label={`${progress}%`} />
				</span>
			);
		}
		return <span></span>;
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

function createColumns( lessons, cohorts ) {
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
		{
			Header: 'First',
			id: 'first_name',
			accessor: 'firstName',
			maxWidth: 75,
			style: { marginTop: '8px', color: 'darkslategrey' },
			filterMethod: ( filter, row ) => {
				return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
			}
		},
		{
			Header: 'Last',
			id: 'last_name',
			accessor: 'lastName',
			maxWidth: 75,
			style: { marginTop: '8px', color: 'darkslategrey' },
			filterMethod: ( filter, row ) => {
				return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
			}
		},
		{
			Header: 'email',
			accessor: 'email',
			maxWidth: 200,
			style: { marginTop: '8px', color: 'darkslategrey' },
			filterMethod: ( filter, row ) => {
				return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
			}
		},
		{
			Header: 'Cohort',
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
		COLUMNS.push({
			id: 'lesson_'+i,
			Header: lessons[ i ].title,
			_lesson: lessons[ i ],
			Cell: accessorFactory( lessons, i ),
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


// MAIN //

class ProgressPage extends Component {
	constructor( props ) {
		super( props );

		this.columns = createColumns( props.lessons, props.cohorts );
		this.state = {
			displayedMembers: [],
			lessonSortDirection: 'ascending',
			lessonOrder: 'createdAt'
		};
	}

	componentDidMount() {
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
		for ( let i = 0; i < members.length; i++ ) {
			const d = members[ i ];
			const parts = trim( d.name ).split( ' ' );
			if ( parts.length > 1 ) {
				d.lastName = parts.pop();
				d.firstName = parts.join( ' ' );
			} else {
				d.firstName = parts[ 0 ];
				d.lastName = '';
			}
		}
		this.setState({ // eslint-disable-line react/no-did-mount-set-state
			displayedMembers: members
		});
	}

	assembleData() {
		const displayedMembers = this.reactTable.getResolvedState().sortedData;
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
			for ( let j = 0; j < lessons.length; j++ ) {
				const lessonName = lessons[ j ]._id;
				let data = member.lessonData;
				if ( data && data[ lessonName ] ) {
					data = data[ lessonName ];
					out[ i ][ lessons[ j ].title+'_progress' ] = min( round( data.progress*100 ), 100 );
					out[ i ][ lessons[ j ].title+'_time' ] = round( data.spentTime / ( 1000*60 ) );
				} else {
					out[ i ][ lessons[ j ].title+'_progress' ] = 0;
					out[ i ][ lessons[ j ].title+'_time' ] = 0;
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
	}

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
	}

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
		let title;
		switch ( this.state.lessonOrder ) {
			case 'title':
				title = 'Sort alphabetically';
				break;
			case 'createdAt':
				title = 'Sort by create date';
				break;
			case 'updatedAt':
				title = 'Sort by update date';
				break;
		}
		return (
			<ButtonGroup className="sort-button-group" >
				<DropdownButton size="sm" variant="secondary" onSelect={( newValue ) => {
					this.columns = this.reorderColumns( newValue, this.state.lessonSortDirection );
					this.setState({ lessonOrder: newValue });
				}} id="dropdown" title={<small>{title}</small>} >
					<Dropdown.Item eventKey="title" >
						<small>Sort alphabetically</small>
					</Dropdown.Item>
					<Dropdown.Item eventKey="createdAt" >
						<small>Sort by create date</small>
					</Dropdown.Item>
					<Dropdown.Item eventKey="updatedAt" >
						<small>Sort by update date</small>
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
				}}>
					{ this.state.lessonSortDirection === 'ascending' ?
						<i className="fas fa-arrow-right" /> :
						<i className="fas fa-arrow-left" />
					}
				</Button>
			</ButtonGroup>
		);
	}

	render() {
		return (
			<Fragment>
				{this.renderSortButton()}
				<ButtonGroup className="progress-button-group" >
					<Button size="sm" variant="secondary" onClick={this.saveCSV} >Save as CSV</Button>
					<Button size="sm" variant="secondary" onClick={this.saveJSON} >Save as JSON</Button>
				</ButtonGroup>
				<div className="namespace-data-page">
					<ReactTable
						className="progress-table"
						filterable
						data={this.state.displayedMembers}
						columns={this.columns}
						ref={(r) => {
							this.reactTable = r;
						}}
					/>
				</div>
			</Fragment>
		);
	}
}


// PROPERTIES //

ProgressPage.propTypes = {
	addNotification: PropTypes.func.isRequired,
	cohorts: PropTypes.array.isRequired,
	lessons: PropTypes.array.isRequired,
	namespace: PropTypes.object.isRequired
};

ProgressPage.defaultProps = {
};


// EXPORTS //

export default ProgressPage;
