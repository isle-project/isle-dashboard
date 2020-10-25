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
import ReactTable from 'react-table';
import InputRange from 'react-input-range';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Card from 'react-bootstrap/Card';
import isArray from '@stdlib/assert/is-array';
import isUndefinedOrNull from '@stdlib/assert/is-undefined-or-null';
import hasOwnProp from '@stdlib/assert/has-own-property';
import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';
import trim from '@stdlib/string/trim';
import server from 'constants/server';
import './progress_page.css';
import 'react-table/react-table.css';
import 'css/table.css';
import 'css/input_range.css';


// VARIABLES //

const debug = logger( 'isle:progress-page' );


// FUNCTIONS //

function filterNumbersFactory( lessons, idx ) {
	return ( filter, row ) => {
		const data = row[ filter.id ];
		const grades = data[ lessons[ idx ]._id ];
		if ( isUndefinedOrNull( grades ) ) {
			return filter.value.min === 0;
		}
		const points = grades._sumPoints;
		return points >= filter.value.min && points <= filter.value.max;
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

function sortFactory( lessons, idx ) {
	return ( a, b ) => {
		console.log( a );
		console.log( b );
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
		if ( a._sumPoints > b._sumPoints ) {
			return 1;
		}
		if ( a._sumPoints < b._sumPoints ) {
			return -1;
		}
		return 0;
	};
}


// MAIN //

class GradesPage extends Component {
	constructor( props ) {
		super( props );

		this.columns = this.createColumns( props.lessons, props.cohorts );
		this.state = {
			displayedMembers: [],
			lessonSortDirection: 'ascending',
			lessonOrder: 'createdAt'
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
				if ( !cohortMembers[ j ].lessonGrades ) {
					cohortMembers[ j ].lessonGrades = {};
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
		console.log( members );
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
			{
				Header: t('first-name'),
				id: 'first_name',
				accessor: 'firstName',
				maxWidth: 75,
				style: { marginTop: '8px', color: 'darkslategrey' },
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			},
			{
				Header: t('last-name'),
				id: 'last_name',
				accessor: 'lastName',
				maxWidth: 75,
				style: { marginTop: '8px', color: 'darkslategrey' },
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			},
			{
				Header: t('common:email'),
				accessor: 'email',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' },
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			},
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
			COLUMNS.push({
				id: 'lesson_'+i,
				Header: lessons[ i ].title,
				_lesson: lessons[ i ],
				Cell: this.accessorFactory( lessons, i ),
				sortMethod: sortFactory( lessons, i ),
				filterMethod: filterNumbersFactory( lessons, i ),
				Filter: ({ filter, onChange }) => {
					let maxPoints = 0;
					if ( lessons[ i ].metadata && lessons[ i ].metadata.grades ) {
						maxPoints = lessons[ i ].metadata.grades.maxPoints;
					}
					const defaultVal = {
						max: maxPoints,
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
								maxValue={maxPoints}
								minValue={0}
								value={filter ? filter.value : defaultVal}
								onChange={( newValue ) => {
									onChange( newValue );
								}}
							/>
						</div>
					);
				},
				accessor: 'lessonGrades'
			});
		}
		return COLUMNS;
	}

	accessorFactory = ( lessons, idx ) => {
		return d => {
			let data = d.original.lessonGrades || {};
			const lesson = lessons[ idx ];
			const lessonID = lesson._id;
			let maxPoints = '';
			if ( lesson.metadata && lesson.metadata.grades ) {
				maxPoints += ` / ${lessons[ idx ].metadata.grades.maxPoints}`;
			}
			data = data[ lessonID ];
			if ( data ) {
				let tally = [];
				for ( let key in data ) {
					if ( hasOwnProp( data, key ) && key !== '_sumPoints' ) {
						tally.push( <p style={{ margin: 0 }} key={key}>{key}: <b style={{ float: 'right', marginLeft: 12 }}>{data[ key ]}</b></p> );
					}
				}
				return ( <OverlayTrigger placement="top" overlay={<Card className="tickets-description-overlay" body id="description-tooltip">
					{tally}
				</Card>}>
					<p>{data._sumPoints}{maxPoints}</p>
				</OverlayTrigger> );
			}
			return <span></span>;
		};
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
		return (
			<Fragment>
				<div className="namespace-data-buttons" >
				</div>
				<div className="namespace-data-page">
					<ReactTable
						className="grades-table"
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

GradesPage.propTypes = {
	cohorts: PropTypes.array.isRequired,
	lessons: PropTypes.array.isRequired
};

GradesPage.defaultProps = {
};


// EXPORTS //

export default withTranslation( [ 'namespace_data', 'common' ] )( GradesPage );
