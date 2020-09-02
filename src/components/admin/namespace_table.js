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
import Avatar from 'react-string-avatar';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ConfirmModal from 'components/confirm-modal';
import server from 'constants/server';
import COLORS from 'constants/colors';
import textFilter from './text_filter.js';
import 'react-table/react-table.css';


// VARIABLES //

const debug = logger( 'isle-dashboard:admin' );


// MAIN //

class NamespacePage extends Component {
	constructor( props ) {
		super( props );
		this.columns = this.createColumns();
		this.state = {
			selectedCourse: null,
			showDeleteModal: false
		};
	}

	componentDidMount() {
		this.props.getAllNamespaces();
	}

	createColumns = () => {
		const { t } = this.props;
		return [
			{
				Header: t('common:title'),
				id: 'title',
				accessor: 'title',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' },
				filterMethod: textFilter
			},
			{
				Header: t( 'common:description' ),
				accessor: 'description',
				style: { marginTop: '2px', color: 'darkslategrey' },
				maxWidth: 200,
				filterMethod: textFilter
			},
			{
				Header: t( 'common:owners' ),
				accessor: 'owners',
				style: { marginTop: '2px', color: 'darkslategrey' },
				maxWidth: 600,
				Cell: ( row ) => {
					const arr = [];
					for ( let i = 0; i < row.value.length; i++ ) {
						const owner = row.value[ i ];
						if ( owner.picture !== 'anonymous.jpg' ) {
							arr.push(
								<OverlayTrigger key={owner.email} trigger={['hover', 'focus']}
									overlay={<Tooltip key={owner.email} >{owner.name} ({owner.email})</Tooltip>}
								>
									<img className="table-pic" src={`${server}/thumbnail/${owner.picture}`} alt="Profile Pic" />
								</OverlayTrigger>
							);
						} else {
							const initials = owner.name
								.split( ' ' )
								.map( x => x[ 0 ] )
								.join( '' );
							const bgColor = COLORS[ i % COLORS.length ];
							arr.push(
								<OverlayTrigger key={owner.email} trigger={['hover', 'focus']}
									overlay={<Tooltip key={owner.email} >{owner.name} ({owner.email})</Tooltip>}
								>
									<span><Avatar
										initials={initials} bgColor={bgColor}
										key={i} width={40} height={40}
									/></span>
								</OverlayTrigger>
							);
						}
					}
					return arr;
				}
			},
			{
				Header: t('last-updated'),
				accessor: 'updatedAt',
				Cell: ( row ) => {
					return new Date( row.value ).toLocaleString();
				},
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 150
			},
			{
				Header: t('created-at'),
				accessor: 'createdAt',
				Cell: ( row ) => {
					return new Date( row.value ).toLocaleString();
				},
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 150
			},
			{
				Header: t('common:actions'),
				Cell: ( row ) => {
					return ( <div>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="delete_course">{t('namespace:delete-course')}</Tooltip>}>
							<Button
								variant="outline-secondary"
								style={{ marginLeft: 8 }}
								onClick={this.askToDeleteSelectedCourseFactory( row.row._original )}
								aria-label={t('namespace:delete-course')}
							>
								<div className="fa fa-trash-alt" />
							</Button>
						</OverlayTrigger>
					</div> );
				}
			}
		];
	}

	askToDeleteSelectedCourseFactory = ( course ) => {
		return () => {
			this.setState({
				showDeleteModal: !this.state.showDeleteModal,
				selectedCourse: course
			});
		};
	}

	deleteSelectedCourse = () => {
		debug( `Delete course ${this.state.selectedCourse.title} with id ${this.state.selectedCourse._id}` );
		this.setState({
			showDeleteModal: false
		}, async () => {
			await this.props.deleteCurrentNamespace( this.state.selectedCourse._id );
			this.props.getAllNamespaces();
		});
	}

	toggleDeleteModal = () => {
		this.setState({
			showDeleteModal: !this.state.showDeleteModal
		});
	}

	render() {
		return (
			<Fragment>
				<ReactTable
					filterable
					data={this.props.admin.namespaces}
					columns={this.columns}
					ref={(r) => {
						this.reactTable = r;
					}}
				/>
				{ this.state.showDeleteModal ? <ConfirmModal
					title={this.props.t('namespace:delete-course')}
					message={<span>{this.props.t('namespace:delete-course-confirm')}<span style={{ color: 'red' }}>{this.state.selectedCourse.title}</span></span>}
					close={this.toggleDeleteModal}
					show={this.state.showDeleteModal}
					onConfirm={this.deleteSelectedCourse}
				/> : null }
			</Fragment>
		);
	}
}


// PROPERTIES //

NamespacePage.propTypes = {
	admin: PropTypes.object.isRequired,
	deleteCurrentNamespace: PropTypes.func.isRequired,
	getAllNamespaces: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'namespace', 'common' ] )( NamespacePage );
