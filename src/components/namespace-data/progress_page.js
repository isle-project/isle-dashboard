// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { Button, ButtonGroup, ProgressBar } from 'react-bootstrap';
import stringify from 'csv-stringify';
import round from '@stdlib/math/base/special/round';
import server from 'constants/server';
import saveAs from 'utils/file_saver.js';
import formatTime from 'utils/format_time.js';
import './progress_page.css';


// FUNCTIONS //

function accessorFactory( lessons, idx ) {
	return d => {
		let data = d.original.lessonData;
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
			resizable: false,
			style: { color: 'darkslategrey' }
		},
		{
			Header: 'Name',
			accessor: 'name',
			maxWidth: 150,
			style: { marginTop: '8px', color: 'darkslategrey' }

		},
		{
			Header: 'email',
			accessor: 'email',
			maxWidth: 200,
			style: { marginTop: '8px', color: 'darkslategrey' }
		},
		{
			Header: 'Cohort',
			accessor: 'cohort',
			style: { marginTop: '8px', color: 'darkslategrey' }
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

	assembleData() {
		const len = this.state.displayedMembers.length;
		const out = new Array( len );
		const lessons = this.props.lessons;
		for ( let i = 0; i < len; i++ ) {
			const member = this.state.displayedMembers[ i ];
			out[ i ] = {
				name: member.name,
				email: member.email,
				cohort: member.cohort
			};
			for ( let j = 0; j < lessons.length; j++ ) {
				const data = member.lessonData;
				const lessonName = lessons[ j ]._id;
				data = data[ lessonName ];
				if ( data ) {
					out[ i ][ lessons[ j ].title+'_progress' ] = round( data.progress*100 );
					out[ i ][ lessons[ j ].title+'_time' ] = round( data.spentTime / ( 1000*60 ) );
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

	render() {
		return (
			<Fragment>
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
					/>
				</div>
			</Fragment>
		);
	}
}


// PROPERTIES //

ProgressPage.propTypes = {
	addNotification: PropTypes.func.isRequired,
	cohorts: PropTypes.array.isRequired
};

ProgressPage.defaultProps = {
};


// EXPORTS //

export default ProgressPage;
