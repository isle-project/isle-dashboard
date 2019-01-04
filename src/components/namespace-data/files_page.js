// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import FormLabel from 'react-bootstrap/lib/FormLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Badge from 'react-bootstrap/lib/Badge';
import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';
import server from 'constants/server';
import 'react-table/react-table.css';
import './react_table_height.css';


// VARIABLES //

const FILE_COLUMNS = [
	{
		Header: 'Lesson',
		accessor: 'lesson',
		maxWidth: 160,
		Cell: ( row ) => {
			if ( !row.row.lesson ) {
				return <span>no lesson</span>;
			}
			return ( <a href={row.row.lesson.url} target="_blank">
				{row.row.lesson.title}
			</a> );
		},
		filterMethod: ( filter, row ) => {
			return row[ filter.id ].title.startsWith( filter.value );
		}
	},
	{
		Header: 'Name',
		accessor: 'name',
		maxWidth: 160,
		filterMethod: ( filter, row ) => {
			return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
		}
	},
	{
		Header: 'Email',
		accessor: 'email',
		maxWidth: 160,
		filterMethod: ( filter, row ) => {
			return row[ filter.id ].startsWith( filter.value );
		}
	},
	{
		Header: 'Type',
		accessor: 'type',
		filterMethod: ( filter, row ) => {
			return contains( row[ filter.id ], filter.value );
		}
	},
	{
		Header: 'Date',
		accessor: 'updatedAt',
		Cell: ( row ) => {
			return row.value.toLocaleDateString( 'en-US' );
		},
		maxWidth: 120
	},
	{
		Header: 'Filename',
		accessor: 'title',
		filterable: false,
		minWidth: 250
	},
	{
		Header: 'Access',
		accessor: 'filename',
		Cell: ( row ) => {
			return ( <a href={server+'/'+row.value} target="_blank">
				Open
			</a> );
		},
		filterable: false,
		width: 100
	}
];


// MAIN //

class FilesPage extends Component {
	render() {
		return ( <div className="namespace-data-page">
			<FormGroup style={{
				position: 'absolute',
				top: '4px',
				right: '32px',
				display: 'inline-block'
			}}>
					<FormLabel htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
						<h3><Badge variant="success">Upload file</Badge></h3>
						<FormControl
							id="fileUpload"
							type="file"
							accept=".pdf"
							onChange={this.props.handleUpload}
							style={{ display: 'none' }}
						/>
					</FormLabel>
			</FormGroup>
			<ReactTable
				filterable
				data={this.props.files}
				columns={FILE_COLUMNS}
			/>
		</div> );
	}
}


// PROPERTIES //

FilesPage.propTypes = {
	files: PropTypes.array.isRequired,
	handleUpload: PropTypes.func.isRequired
};

FilesPage.defaultProps = {
};


// EXPORTS //

export default FilesPage;
