// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { ProgressBar } from 'react-bootstrap';
import round from '@stdlib/math/base/special/round';
import server from 'constants/server';
import formatTime from 'utils/format_time.js';
import './progress_page.css';


// FUNCTIONS //

function accessorFactory( lessons, idx ) {
	return d => {
		let data = d.original.lessonData;
		if ( !data ) {
			return <span></span>;
		}
		data = data[ lessons[ idx ]._id ];
		if ( data ) {
			const progress = round( data.progress*100 );
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

function createColumns( lessons ) {
	const COLUMNS = [
		{
			Header: 'Pic',
			accessor: 'picture',
			Cell: row => (
				<img className="table-pic" src={`${server}/thumbnail/${row.original.picture}`} />
			),
			maxWidth: 46,
			minWidth: 46,
			filterable: false,
			resizable: false
		},
		{
			Header: 'Name',
			accessor: 'name',
			maxWidth: 150
		},
		{
			Header: 'email',
			accessor: 'email',
			maxWidth: 200
		},
		{
			Header: 'Cohort',
			accessor: 'cohort'
		}
	];
	for ( let i = 0; i < lessons.length; i++ ) {
		COLUMNS.push({
			id: 'lesson_'+i,
			Header: lessons[ i ].title,
			Cell: accessorFactory( lessons, i )
		});
	}
	return COLUMNS;
}


// MAIN //

class ProgressPage extends Component {
	constructor( props ) {
		super( props );

		this.columns = createColumns( props.lessons );
		this.state = {
			displayedMembers: []
		};
	}

	componentDidMount() {
		let members = [];
		for ( let i = 0; i < this.props.cohorts.length; i++ ) {
			const cohortMembers = this.props.cohorts[ i ].members;
			for ( let j = 0; j < cohortMembers.length; j++ ) {
				cohortMembers[ j ].cohort = this.props.cohorts[ i ].title;
			}
			members = members.concat( this.props.cohorts[ i ].members );
		}
		console.log( 'MEMBERS:');
		console.log( members );
		this.setState({
			displayedMembers: members
		});
	}

	render() {
		console.log( this.state.displayedMembers );
		return ( <div className="namespace-data-page">
			<ReactTable
				className="progress-table"
				filterable
				data={this.state.displayedMembers}
				columns={this.columns}
			/>
		</div> );
	}
}


// PROPERTIES //

ProgressPage.propTypes = {
	cohorts: PropTypes.array.isRequired
};

ProgressPage.defaultProps = {
};


// EXPORTS //

export default ProgressPage;
