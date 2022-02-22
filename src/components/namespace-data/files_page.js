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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logger from 'debug';
import { withTranslation } from 'react-i18next';
import stringify from 'csv-stringify';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import FormLabel from 'react-bootstrap/FormLabel';
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
import DashboardDataExplorer from 'ev/components/data-explorer';
import obsToVar from '@isle-project/utils/obs-to-var';
import DashboardTable from 'components/dashboard-table';
import ConfirmModal from 'components/confirm-modal';
import server from 'constants/server';
import saveAs from 'utils/file_saver.js';
import createDateColumn from 'utils/create_date_column.js';
import createTextColumn from 'utils/create_text_column.js';
import createNumericColumn from 'utils/create_numeric_column.js';
import 'css/input_range.css';
import './files_page.css';


// VARIABLES //

const EXPORT_COLUMNS = [ 'name', 'email', 'lesson', 'title', 'filename', 'type', 'createdAt', 'updatedAt' ];
const debug = logger( 'isle:files-page' );


// FUNCTIONS //

/**
 * Keeps the part of the file path after `/media/`.
 *
 * @param {string} filepath - file path
 * @returns {string} part of the file path after `/media/`
 */
const getPartAfterMedia = ( filepath ) => {
	return filepath.substring( filepath.indexOf( '/media/' ) + 7 );
};

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
		this.state = {
			showDeleteModal: false,
			deletionID: null,
			fileMaxSize: 0,
			fileInputKey: 0,
			showExplorer: false
		};
		this.columns = this.createColumns();
	}

	componentDidMount() {
		debug( 'Component did mount...' );
		this.props.getFiles({
			namespaceName: this.props.namespace.title
		});
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
				fileMaxSize,
				fileInputKey: this.state.fileInputKey + 1
			});
		}
	}

	handleDelete = () => {
		this.props.handleFileDeletion( this.state.deletionID, this.props.ownerFiles );
		this.toggleDeleteModal();
	};

	toggleDeleteModal = () => {
		this.setState({
			showDeleteModal: !this.state.showDeleteModal
		});
	};

	createColumns = () => {
		const { t } = this.props;
		return [
			createTextColumn({
				Header: t('common:filename'),
				accessor: 'title',
				minWidth: 250,
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			}),
			{
				Header: t('common:open'),
				accessor: 'path',
				Cell: ( row ) => {
					return (
						<OverlayTrigger placement="left" overlay={<Tooltip id="external-link-tooltip">{t('open-file')}</Tooltip>}>
							<a aria-label={t('open-file')} href={server+'/'+getPartAfterMedia( row.value )} target="_blank" rel="noopener noreferrer" >
								<Button aria-label={t('open-file')} size="sm" variant="outline-secondary">
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
				Header: t('common:copy'),
				id: 'copy-path',
				accessor: 'path',
				Cell: ( row ) => {
					return (
						<OverlayTrigger placement="right" overlay={<Tooltip id="copy-clipboard-tooltip">{t('common:copy-link')}</Tooltip>}>
							<Button aria-label={t('common:copy-link')} variant="outline-secondary" size="sm"
								onClick={() => {
									copyToClipboard( server+'/'+getPartAfterMedia( row.value ) );
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
			createTextColumn({
				Header: t('common:lesson'),
				accessor: 'lesson',
				maxWidth: 160,
				Cell: ( row ) => {
					if ( !row.row.lesson ) {
						return <span>{t('no-lesson')}</span>;
					}
					return (
						<OverlayTrigger placement="right" overlay={<Tooltip id="open-lesson-tooltip">{t('open-lesson-new-tab')}</Tooltip>}>
							<div style={{ width: '100%', height: '100%' }} >
								<a aria-label={t('open-lesson-new-tab')} href={row.row.lesson.url} target="_blank" rel="noopener noreferrer" >
									{row.row.lesson.title}
								</a>
							</div>
						</OverlayTrigger>
					);
				},
				filterMethod: ( filter, row ) => {
					return row[ filter.id ].title.startsWith( filter.value );
				}
			}),
			createTextColumn({
				Header: t('first-name'),
				id: 'first_name',
				accessor: 'user.firstName',
				maxWidth: 75,
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			}),
			createTextColumn({
				Header: t('last-name'),
				id: 'last_name',
				accessor: 'user.lastName',
				maxWidth: 75,
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			}),
			createTextColumn({
				Header: t('common:email'),
				accessor: 'user.email',
				maxWidth: 160,
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			}),
			createTextColumn({
				Header: t('type'),
				accessor: 'type',
				filterMethod: ( filter, row ) => {
					return contains( row[ filter.id ], filter.value );
				}
			}),
			createNumericColumn({
				Header: t('common:size'),
				accessor: 'size',
				Cell: row => row.value ? `${roundn( row.value, -3 )}mb` : 'NA',
				filterMethod: ( filter, row ) => {
					const id = filter.pivotId || filter.id;
					const size = row[ id ];
					return size >= filter.value.min && size <= filter.value.max;
				},
				formatLabel: value => roundn( value, -2 ),
				maxValue: ceil( this.state.fileMaxSize ) || 1,
				minValue: 0
			}),
			createDateColumn({
				Header: t('common:date'),
				accessor: 'updatedAt',
				Cell: ( row ) => {
					if ( row.value && row.value.toLocaleDateString ) {
						return row.value.toLocaleDateString( 'en-US' );
					}
					return '';
				},
				maxWidth: 120,
				t: t
			}),
			{
				Header: 'Del',
				accessor: '_id',
				Cell: ( row ) => {
					return (
						<OverlayTrigger placement="left" overlay={<Tooltip id="delete-file-tooltip">{t('delete-file-tooltip')}</Tooltip>}>
							<Button
								aria-label={t('delete-file-tooltip')}
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
	};

	saveJSON = () => {
		const currentFiles = this.dashboardTable.getResolvedState().sortedData;
		let data = prepareExportData( currentFiles );
		const blob = new Blob([ JSON.stringify( data ) ], {
			type: 'application/json'
		});
		const name = `files_${this.props.namespace.title}.json`;
		saveAs( blob, name );
	};

	saveCSV = () => {
		const currentFiles = this.dashboardTable.getResolvedState().sortedData;
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
	};

	toggleExplorer = () => {
		this.setState({
			showExplorer: !this.state.showExplorer
		});
	};

	render() {
		const { t } = this.props;
		if ( this.state.showExplorer ) {
			const files = this.props.files;
			let data = [];
			for ( let i = 0; i < files.length; i++ ) {
				const file = files[ i ];
				const replacement = {};
				replacement.title = file.title;
				replacement.type = file.type;
				replacement.lesson = file.lesson ? file.lesson.title : null;
				replacement.size = file.size ? file.size : null;
				replacement.email = file.email;
				replacement.createdAt = file.createdAt;
				replacement.updatedAt = file.updatedAt;
				data.push( replacement );
			}
			data = obsToVar( data );
			const quantitative = [ 'size' ];
			const categorical = [ 'title', 'type', 'lesson', 'email', 'createdAt', 'updatedAt' ];
			return (
				<DashboardDataExplorer
					title={t('explorer-files-title')}
					data={data}
					categorical={categorical}
					quantitative={quantitative}
					close={this.toggleExplorer}
				/>
			);
		}
		console.log( this.props.files );
		return ( <div className="namespace-data-page">
			<div className="namespace-data-buttons">
				<ButtonGroup className="files-export-button-group" >
					<OverlayTrigger placement="bottom" overlay={<Tooltip id="csvTooltip" >{t('save-as-csv')}</Tooltip>}>
						<Button size="sm" variant="secondary" onClick={this.saveCSV} ><i className="fas fa-download"></i> CSV</Button>
					</OverlayTrigger>
					<OverlayTrigger placement="bottom" overlay={<Tooltip id="jsonTooltip">{t('save-as-json')}</Tooltip>}>
						<Button size="sm" variant="secondary" onClick={this.saveJSON} ><i className="fas fa-download"></i> JSON</Button>
					</OverlayTrigger>
				</ButtonGroup>
				{ this.props.ownerFiles ? <FormGroup className="file-upload-button" >
					<FormLabel htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
						<Badge id="file-upload-badge" bg="success">{t('upload-file')}</Badge>
						<input
							id="fileUpload"
							key={this.state.fileInputKey}
							type="file"
							accept=".pdf,.html,.md,image/*,video/*,audio/*,.json,.csv"
							onChange={this.props.handleUpload}
							style={{ display: 'none' }}
						/>
					</FormLabel>
				</FormGroup> : null }
			</div>
			<DashboardTable
				data={this.props.files}
				columns={this.columns}
				t={t}
				ref={(r) => {
					this.dashboardTable = r;
				}}
				onButtonClick={this.toggleExplorer}
			/>
			<ConfirmModal
				show={this.state.showDeleteModal}
				close={this.toggleDeleteModal}
				message={t('delete-file')}
				title={`${t('common:delete')}?`}
				onConfirm={this.handleDelete}
			/>
		</div> );
	}
}


// PROPERTIES //

FilesPage.propTypes = {
	addNotification: PropTypes.func.isRequired,
	files: PropTypes.array.isRequired,
	getFiles: PropTypes.func.isRequired,
	handleFileDeletion: PropTypes.func.isRequired,
	handleUpload: PropTypes.func.isRequired,
	namespace: PropTypes.object.isRequired,
	ownerFiles: PropTypes.bool
};

FilesPage.defaultProps = {
	ownerFiles: false
};


// EXPORTS //

export default withTranslation( [ 'namespace_data', 'common' ] )( FilesPage );
