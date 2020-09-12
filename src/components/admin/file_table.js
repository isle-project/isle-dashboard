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
import { withTranslation } from 'react-i18next';
import ReactTable from 'react-table';
import InputRange from 'react-input-range';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import copyToClipboard from 'clipboard-copy';
import roundn from '@stdlib/math/base/special/roundn';
import ceil from '@stdlib/math/base/special/ceil';
import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';
import trim from '@stdlib/string/trim';
import ConfirmModal from 'components/confirm-modal';
import server from 'constants/server';
import FILE_TYPE_ICONS from 'constants/file_type_icons.js';
import 'react-table/react-table.css';
import 'css/table.css';
import 'css/input_range.css';


// MAIN //

class FilePage extends Component {
	constructor( props ) {
		super( props );
		this.columns = this.createColumns();
		this.state = {
			showDeleteModal: false,
			deletionID: null,
			fileMaxSize: 0,
			fileInputKey: 0
		};
	}

	componentDidMount() {
		this.props.getAllFiles();
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.admin.files !== this.props.admin.files ) {
			const files = this.props.admin.files;
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
	}

	toggleDeleteModal = () => {
		this.setState({
			showDeleteModal: !this.state.showDeleteModal
		});
	}

	createColumns = () => {
		const { t } = this.props;
		return [
			{
				Header: t('namespace_data:filename'),
				accessor: 'title',
				minWidth: 250,
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			},
			{
				Header: t('common:open'),
				accessor: 'filename',
				Cell: ( row ) => {
					return (
						<OverlayTrigger placement="left" overlay={<Tooltip id="external-link-tooltip">{t('namespace_data:open-file')}</Tooltip>}>
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
				Header: t('common:copy'),
				id: 'copy-path',
				accessor: 'filename',
				Cell: ( row ) => {
					return (
						<OverlayTrigger placement="right" overlay={<Tooltip id="copy-clipboard-tooltip">{t('common:copy-link')}</Tooltip>}>
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
				Header: t('common:course'),
				accessor: 'namespace.title',
				maxWidth: 160,
				filterMethod: ( filter, row ) => {
					return row[ filter.id ].title.startsWith( filter.value );
				}
			},
			{
				Header: t('common:lesson'),
				accessor: 'lesson.title',
				maxWidth: 160,
				Cell: ( row ) => {
					if ( !row.value ) {
						return null;
					}
					const url = `${server}/${row.original.namespace.title}/${row.value}`;
					return (
						<OverlayTrigger placement="right" overlay={<Tooltip id="open-lesson-tooltip">{t('namespace_data:open-lesson-new-tab')}</Tooltip>}>
							<div style={{ width: '100%', height: '100%' }} >
								<a href={url} target="_blank">
									{row.value}
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
				Header: t('namespace_data:first-name'),
				id: 'first_name',
				accessor: d => {
					const parts = trim( d.user.name ).split( ' ' );
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
				Header: t('namespace_data:last-name'),
				id: 'last_name',
				accessor: d => {
					const parts = trim( d.user.name ).split( ' ' );
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
				Header: t('common:email'),
				accessor: 'user.email',
				maxWidth: 160,
				filterMethod: ( filter, row ) => {
					return contains( lowercase( row[ filter.id ] ), lowercase( filter.value ) );
				}
			},
			{
				Header: t('namespace_data:type'),
				accessor: 'type',
				Cell: row => {
					if ( FILE_TYPE_ICONS[ row.value ] ) {
						return (
							<OverlayTrigger placement="left" overlay={<Tooltip id="type-tooltip">{row.value}</Tooltip>}>
								<i className={FILE_TYPE_ICONS[ row.value ]} ></i>
							</OverlayTrigger>
						);
					}
					return (
						<OverlayTrigger placement="left" overlay={<Tooltip id="type-tooltip">{row.value}</Tooltip>}>
							<i className="fa fa-file"></i>
						</OverlayTrigger>
					);
				},
				maxWidth: 50,
				filterMethod: ( filter, row ) => {
					return contains( row[ filter.id ], filter.value );
				},
				style: { fontSize: '1.5em', padding: 4, textAlign: 'center' }
			},
			{
				Header: t('namespace_data:size'),
				accessor: 'size',
				Cell: row => row.value ? `${roundn( row.value, -3 )}mb` : 'NA',
				filterMethod: ( filter, row ) => {
					const id = filter.pivotId || filter.id;
					const size = row[ id ];
					return size >= filter.value.min && size <= filter.value.max;
				},
				Filter: ({ filter, onChange }) => {
					const maxValue = ceil( this.state.fileMaxSize ) || 1;
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
				Header: t('common:date'),
				accessor: 'updatedAt',
				Cell: ( row ) => {
					if ( row.value ) {
						return new Date( row.value ).toLocaleDateString( 'en-US' );
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
						<OverlayTrigger placement="left" overlay={<Tooltip id="delete-file-tooltip">{t('delete-file-tooltip')}</Tooltip>}>
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

	render() {
		const { t } = this.props;
		console.log( this.props.admin.files);
		return ( <Fragment>
			<ReactTable
				filterable
				data={this.props.admin.files}
				columns={this.columns}
				ref={(r) => {
					this.reactTable = r;
				}}
			/>
			<ConfirmModal
				show={this.state.showDeleteModal}
				close={this.toggleDeleteModal}
				message={t('delete-file')}
				title={`${t('common:delete')}?`}
				onConfirm={this.handleDelete}
			/>
		</Fragment> );
	}
}


// PROPERTIES //

FilePage.propTypes = {
	addNotification: PropTypes.func.isRequired,
	getAllFiles: PropTypes.func.isRequired,
	handleFileDeletion: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'namespace_data', 'common' ] )( FilePage );
