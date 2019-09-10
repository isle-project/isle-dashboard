// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import stringify from 'csv-stringify';
import ReactTable from 'react-table';
import InputRange from 'react-input-range';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Badge from 'react-bootstrap/Badge';
import copyToClipboard from 'clipboard-copy';
import roundn from '@stdlib/math/base/special/roundn';
import ceil from '@stdlib/math/base/special/ceil';
import pick from '@stdlib/utils/pick';
import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';
import trim from '@stdlib/string/trim';
import ConfirmModal from 'components/confirm-modal';
import server from 'constants/server';
import saveAs from 'utils/file_saver.js';
import 'react-table/react-table.css';
import './react_table_height.css';
import './files_page.css';


// VARIABLES //

const EXPORT_COLUMNS = [ 'name', 'email', 'lesson', 'title', 'filename', 'type', 'createdAt', 'updatedAt' ];


// FUNCTIONS //

const prepareExportData = ( data ) => {
	for ( let i = 0; i < data.length; i++ ) {
		const row = pick( data[ i ], EXPORT_COLUMNS );
		row.lesson = row.lesson.title;
		row.filename = server+'/'+row.filename;
		data[ i ] = row;
	}
	return data;
};


// MAIN //

class FilesPage extends Component {
	constructor( props ) {
		super( props );
		this.columns = this.createColumns();
		this.state = {
			showDeleteModal: false,
			deletionID: null,
			fileMaxSize: 0
		};
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.files !== this.props.files ) {
			const files = this.props.files;
			let fileMaxSize = 0;
			for ( let i = 0; i < files.length; i++ ) {
				const size = files[ i ].size;
				if ( size && size > fileMaxSize ) {
					fileMaxSize = size;
				}
			}
			this.setState({
				fileMaxSize
			});
		}
	}

	handleDelete = () => {
		this.props.handleFileDeletion( this.state.deletionID, this.props.ownerFiles );
		this.toggleDeleteModal();
	}

	toggleDeleteModal = () => {
		this.setState({
			showDeleteModal: !this.state.showDeleteModal
		});
	}

	createColumns = () => {
		return [
			{
				Header: 'Filename',
				accessor: 'title',
				minWidth: 250,
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			},
			{
				Header: 'Open',
				accessor: 'filename',
				Cell: ( row ) => {
					return (
						<OverlayTrigger placement="left" overlay={<Tooltip id="external-link-tooltip">Open the file.</Tooltip>}>
							<a href={server+'/'+row.value} target="_blank">
								<Button size="sm" variant="outline-secondary">
									<i className="fa fa-external-link-alt"></i>
								</Button>
							</a>
						</OverlayTrigger> );
				},
				resizable: false,
				filterable: false,
				sortable: false,
				width: 45
			},
			{
				Header: 'Copy',
				id: 'copy-path',
				accessor: 'filename',
				Cell: ( row ) => {
					return (
						<OverlayTrigger placement="right" overlay={<Tooltip id="copy-clipboard-tooltip">Copy link to clipboard.</Tooltip>}>
							<Button variant="outline-secondary" size="sm"
								onClick={() => {
									copyToClipboard( server+'/'+row.value );
									this.props.addNotification({
										title: 'Copied',
										message: 'Link copied to clipboard',
										level: 'success',
										position: 'tl'
									});
								}}
							>
								<i className="fa fa-clipboard"></i>
							</Button>
						</OverlayTrigger>
					);
				},
				resizable: false,
				filterable: false,
				sortable: false,
				width: 45
			},
			{
				Header: 'Lesson',
				accessor: 'lesson',
				maxWidth: 160,
				Cell: ( row ) => {
					if ( !row.row.lesson ) {
						return <span>no lesson</span>;
					}
					return (
						<OverlayTrigger placement="right" overlay={<Tooltip id="open-lesson-tooltip">Open lesson in new tab.</Tooltip>}>
							<div style={{ width: '100%', height: '100%' }} >
								<a href={row.row.lesson.url} target="_blank">
									{row.row.lesson.title}
								</a>
							</div>
						</OverlayTrigger>
					);
				},
				filterMethod: ( filter, row ) => {
					return row[ filter.id ].title.startsWith( filter.value );
				}
			},
			{
				Header: 'First',
				id: 'first_name',
				accessor: d => {
					const parts = trim( d.name ).split( ' ' );
					if ( parts.length > 1 ) {
						parts.pop();
						return parts.join( ' ' );
					}
					return parts[ 0 ];
				},
				maxWidth: 75,
				style: { color: 'darkslategrey' },
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			},
			{
				Header: 'Last',
				id: 'last_name',
				accessor: d => {
					const parts = trim( d.name ).split( ' ' );
					if ( parts.length > 1 ) {
						return parts[ parts.length - 1 ];
					}
					return '';
				},
				maxWidth: 75,
				style: { color: 'darkslategrey' },
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			},
			{
				Header: 'Email',
				accessor: 'email',
				maxWidth: 160,
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
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
				Header: 'Size',
				accessor: 'size',
				Cell: row => row.value ? `${roundn( row.value, -3 )}mb` : 'NA',
				filterMethod: ( filter, row ) => {
					const id = filter.pivotId || filter.id;
					const size = row[ id ];
					return size >= filter.value.min && size <= filter.value.max;
				},
				Filter: ({ filter, onChange }) => {
					const maxValue = ceil( this.state.fileMaxSize );
					const defaultVal = {
						max: maxValue,
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
								maxValue={maxValue}
								minValue={0}
								step={0.1}
								value={filter ? filter.value : defaultVal}
								onChange={( newValue ) => {
									onChange( newValue );
								}}
								formatLabel={value => roundn( value, -2 )}
							/>
						</div>
					);
				}
			},
			{
				Header: 'Date',
				accessor: 'updatedAt',
				Cell: ( row ) => {
					if ( row.value && row.value.toLocaleDateString ) {
						return row.value.toLocaleDateString( 'en-US' );
					}
					return '';
				},
				maxWidth: 120
			},
			{
				Header: 'Del',
				accessor: '_id',
				Cell: ( row ) => {
					return (
						<OverlayTrigger placement="left" overlay={<Tooltip id="delete-file-tooltip">Delete the file.</Tooltip>}>
							<Button
								size="sm" variant="outline-secondary"
								onClick={() => {
								this.setState({
									deletionID: row.value,
									showDeleteModal: true
								});
							}} >
								<div className="fa fa-trash-alt" />
							</Button>
						</OverlayTrigger>
					);
				},
				resizable: false,
				filterable: false,
				sortable: false,
				width: 45
			}
		];
	}

	saveJSON = () => {
		const currentFiles = this.reactTable.getResolvedState().sortedData;
		let data = prepareExportData( currentFiles );
		const blob = new Blob([ JSON.stringify( data ) ], {
			type: 'application/json'
		});
		const name = `files_${this.props.namespace.title}.json`;
		saveAs( blob, name );
	}

	saveCSV = () => {
		const currentFiles = this.reactTable.getResolvedState().sortedData;
		let data = prepareExportData( currentFiles );
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
			const name = `files_${this.props.namespace.title}.csv`;
			saveAs( blob, name );
		});
	}

	render() {
		return ( <div className="namespace-data-page">
			<ButtonGroup className="files-export-button-group" >
				<Button size="sm" variant="secondary" onClick={this.saveCSV} >Save as CSV</Button>
				<Button size="sm" variant="secondary" onClick={this.saveJSON} >Save as JSON</Button>
			</ButtonGroup>
			{ this.props.ownerFiles ? <FormGroup style={{
				position: 'absolute',
				top: '4px',
				right: '16px',
				display: 'inline-block'
			}}>
					<FormLabel htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
						<h3><Badge variant="success">Upload file</Badge></h3>
						<FormControl
							id="fileUpload"
							type="file"
							accept=".pdf,.html,.md,image/*,video/*,audio/*,.json,.csv"
							onChange={this.props.handleUpload}
							style={{ display: 'none' }}
						/>
					</FormLabel>
			</FormGroup> : null }
			<ReactTable
				filterable
				data={this.props.files}
				columns={this.columns}
				ref={(r) => {
					this.reactTable = r;
				}}
			/>
			<ConfirmModal
				show={this.state.showDeleteModal}
				close={this.toggleDeleteModal}
				message="Are you sure that you want to delete this file?"
				title="Delete?"
				onDelete={this.handleDelete}
			/>
		</div> );
	}
}


// PROPERTIES //

FilesPage.propTypes = {
	addNotification: PropTypes.func.isRequired,
	files: PropTypes.array.isRequired,
	handleFileDeletion: PropTypes.func.isRequired,
	handleUpload: PropTypes.func.isRequired,
	namespace: PropTypes.object.isRequired,
	ownerFiles: PropTypes.bool
};

FilesPage.defaultProps = {
	ownerFiles: false
};


// EXPORTS //

export default FilesPage;
