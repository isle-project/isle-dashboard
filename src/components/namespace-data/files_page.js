// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import contains from '@stdlib/assert/contains';
import server from './../../constants/server';
import 'react-table/react-table.css';
import './react_table_height.css';


// VARIABLES //

const FILE_COLUMNS = [
	{
		Header: 'Lesson',
		accessor: 'lesson',
		maxWidth: 160,
		Cell: ( row ) => {
			return ( <a href={row.row.lesson.url} target="_blank">
				{row.row.lesson.title}
			</a> );
		},
		filterMethod: ( filter, row ) => {
			return row[ filter.id ].title.startsWith( filter.value );
		}
	},
	{
		Header: 'User',
		accessor: 'user',
		maxWidth: 160
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
		}
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
			<h1>Files</h1>
			<ReactTable
				filterable
				data={this.props.files}
				columns={FILE_COLUMNS}
			/>
		</div> );
	}
}


// PROPERTY TYPES //

FilesPage.propTypes = {
	files: PropTypes.array.isRequired
};

FilesPage.defaultProps = {
};


// EXPORTS //

export default FilesPage;
