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
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import PINF from '@stdlib/constants/float64/pinf';
import DashboardTable from 'components/dashboard-table';
import ConfirmModal from 'components/confirm-modal';
import obsToVar from '@isle-project/utils/obs-to-var';
import DashboardDataExplorer from 'ev/components/data-explorer';
import textFilter from 'utils/text_filter.js';
import createUsersColumn from 'utils/create_users_column.js';
import createNumericColumn from 'utils/create_numeric_column.js';
import createDateColumn from 'utils/create_date_column.js';


// VARIABLES //

const debug = logger( 'isle-dashboard:admin' );


// MAIN //

class NamespacePage extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			selectedCourse: null,
			showDeleteModal: false,
			columns: this.createColumns(),
			showExplorer: false
		};
	}

	componentDidMount() {
		this.props.getAllNamespaces();
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.admin.namespaces !== this.props.admin.namespaces ) {
			this.setState({
				columns: this.createColumns()
			});
		}
	}

	createColumns = () => {
		const { t } = this.props;
		const namespaces = this.props.admin.namespaces;
		let maxOwners = 0;
		let minTime = PINF;
		let maxTime = 0;
		for ( let i = 0; i < namespaces.length; i++ ) {
			const owners = namespaces[ i ].owners;
			const nOwners = owners.length;
			if ( nOwners && nOwners > maxOwners ) {
				maxOwners = nOwners;
			}
			if ( namespaces[ i ].createdAt > maxTime ) {
				maxTime = namespaces[ i ].createdAt;
			}
			if ( namespaces[ i ].updatedAt > maxTime ) {
				maxTime = namespaces[ i ].updatedAt;
			}
			if ( namespaces[ i ].createdAt < minTime ) {
				minTime = namespaces[ i ].createdAt;
			}
			if ( namespaces[ i ].updatedAt < minTime ) {
				minTime = namespaces[ i ].updatedAt;
			}
		}
		maxTime = moment( maxTime );
		minTime = moment( minTime );
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
			createUsersColumn({
				Header: t( 'common:owners' ),
				accessor: 'owners'
			}),
			createNumericColumn({
				Header: `# ${t( 'common:owners' )}`,
				accessor: 'owners.length',
				maxWidth: 120,
				style: { marginTop: '2px', color: 'darkslategrey' },
				minValue: 1,
				maxValue: maxOwners
			}),
			createDateColumn({
				Header: t('last-updated'),
				accessor: 'updatedAt',
				startDate: minTime,
				endDate: maxTime,
				t
			}),
			createDateColumn({
				Header: t('created-at'),
				accessor: 'createdAt',
				startDate: minTime,
				endDate: maxTime,
				t
			}),
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
				},
				resizable: false,
				filterable: false,
				sortable: false
			}
		];
	};

	askToDeleteSelectedCourseFactory = ( course ) => {
		return () => {
			this.setState({
				showDeleteModal: !this.state.showDeleteModal,
				selectedCourse: course
			});
		};
	};

	deleteSelectedCourse = () => {
		debug( `Delete course ${this.state.selectedCourse.title} with id ${this.state.selectedCourse._id}` );
		this.setState({
			showDeleteModal: false
		}, async () => {
			await this.props.deleteCurrentNamespace( this.state.selectedCourse._id );
			this.props.getAllNamespaces();
		});
	};

	toggleDeleteModal = () => {
		this.setState({
			showDeleteModal: !this.state.showDeleteModal
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
			const namespaces = this.props.admin.namespaces;
			let data = [];
			for ( let i = 0; i < namespaces.length; i++ ) {
				const namespace = namespaces[ i ];
				const replacement = {};
				replacement.title = namespace.title;
				replacement.description = namespace.description;
				replacement.enableTicketing = namespace.enableTicketing;
				replacement.announcements = namespace.announcements.length;
				replacement.owners = namespace.owners.length;
				replacement.createdAt = namespace.createdAt;
				replacement.updatedAt = namespace.updatedAt;
				data.push( replacement );
			}
			data = obsToVar( data );
			return (
				<DashboardDataExplorer
					title={t('explorer-namespaces-title')}
					data={data}
					categorical={[ 'title', 'enableTicketing', 'createdAt', 'updatedAt' ]}
					quantitative={[ 'announcements', 'owners' ]}
					close={this.toggleExplorer}
				/>
			);
		}
		return (
			<Fragment>
				<DashboardTable
					data={this.props.admin.namespaces}
					columns={this.state.columns}
					onButtonClick={this.toggleExplorer}
					t={t}
				/>
				{ this.state.showDeleteModal ? <ConfirmModal
					title={t('namespace:delete-course')}
					message={<span>
						{t('namespace:delete-course-confirm')}
						<span style={{ color: 'red' }}>{this.state.selectedCourse.title}</span>
					</span>}
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
