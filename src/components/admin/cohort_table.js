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
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import PINF from '@stdlib/constants/float64/pinf';
import ConfirmModal from 'components/confirm-modal';
import DashboardTable from 'components/dashboard-table';
import obsToVar from '@isle-project/utils/obs-to-var';
import DashboardDataExplorer from 'ev/components/data-explorer';
import createBooleanColumn from 'utils/create_boolean_column.js';
import createNumericColumn from 'utils/create_numeric_column.js';
import createDateColumn from 'utils/create_date_column.js';
import createTextColumn from 'utils/create_text_column.js';


// MAIN //

class CohortTable extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			selectedCohort: null,
			showDeleteModal: false,
			columns: this.createColumns()
		};
	}

	componentDidMount() {
		this.props.getAllCohorts();
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.admin.cohorts !== this.props.admin.cohorts ) {
			this.setState({
				columns: this.createColumns()
			});
		}
	}

	createColumns = () => {
		const { t } = this.props;
		let maxStudents = 0;
		const cohorts = this.props.admin.cohorts;
		let minTime = PINF;
		let maxTime = 0;
		for ( let i = 0; i < cohorts.length; i++ ) {
			const members = cohorts[ i ].members;
			const nMembers = members.length;
			if ( nMembers && nMembers > maxStudents ) {
				maxStudents = nMembers;
			}
			if ( cohorts[ i ].startDate > maxTime ) {
				maxTime = cohorts[ i ].startDate;
			}
			if ( cohorts[ i ].endDate > maxTime ) {
				maxTime = cohorts[ i ].endDate;
			}
			if ( cohorts[ i ].startDate < minTime ) {
				minTime = cohorts[ i ].startDate;
			}
			if ( cohorts[ i ].endDate < minTime ) {
				minTime = cohorts[ i ].endDate;
			}
		}
		maxTime = moment( maxTime );
		minTime = moment( minTime );
		return [
			createTextColumn({
				Header: t('common:title'),
				id: 'title',
				accessor: 'title',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' }
			}),
			createTextColumn({
				Header: t('common:course'),
				id: 'namespace',
				accessor: 'namespace.title',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' }
			}),
			createTextColumn({
				Header: t('namespace:email-filter'),
				id: 'emailFilter',
				accessor: 'emailFilter',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' }
			}),
			createBooleanColumn({
				Header: t('enrollment'),
				accessor: 'private',
				trueLabel: t('open-enrollment'),
				falseLabel: t('manual-enrollment'),
				printLabels: true
			}),
			createDateColumn({
				Header: t('start-date'),
				accessor: 'startDate',
				startDate: minTime,
				endDate: maxTime,
				t
			}),
			createDateColumn({
				Header: t('end-date'),
				accessor: 'endDate',
				startDate: minTime,
				endDate: maxTime,
				t
			}),
			createNumericColumn({
				Header: t( 'common:number-of-students' ),
				accessor: 'members.length',
				style: { marginTop: '2px', color: 'darkslategrey' },
				maxWidth: 150,
				minValue: 0,
				maxValue: maxStudents
			}),
			{
				Header: t('common:actions'),
				Cell: ( row ) => {
					return ( <div>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="delete_cohort">{t('namespace:delete-cohort')}</Tooltip>}>
							<Button
								variant="outline-secondary"
								style={{ marginLeft: 8 }}
								onClick={this.askToDeleteSelectedCohortFactory( row.row._original )}
								aria-label={t('namespace:delete-cohort')}
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
	}

	askToDeleteSelectedCohortFactory = ( cohort ) => {
		return () => {
			this.setState({
				showDeleteModal: !this.state.showDeleteModal,
				selectedCohort: cohort
			});
		};
	}

	deleteSelectedCohort = () => {
		this.setState({
			showDeleteModal: false
		}, async () => {
			await this.props.deleteCohort( this.state.selectedCohort._id );
			this.props.getAllCohorts();
		});
	}

	toggleDeleteModal = () => {
		this.setState({
			showDeleteModal: !this.state.showDeleteModal
		});
	}

	toggleExplorer = () => {
		this.setState({
			showExplorer: !this.state.showExplorer
		});
	}

	render() {
		const { t } = this.props;
		if ( this.state.showExplorer ) {
			const cohorts = this.props.admin.cohorts;
			let data = [];
			for ( let i = 0; i < cohorts.length; i++ ) {
				const cohort = cohorts[ i ];
				const replacement = {};
				replacement.title = cohort.title;
				replacement.members = cohort.members.length;
				replacement.namespace = cohort.namespace ? cohort.namespace.title : null;
				replacement.private = cohort.private;
				replacement.emailFilter = cohort.emailFilter ? cohort.emailFilter : null;
				replacement.startDate = cohort.startDate;
				replacement.endDate = cohort.endDate;
				data.push( replacement );
			}
			data = obsToVar( data );
			return (
				<DashboardDataExplorer
					title={t('explorer-cohorts-title')}
					data={data}
					categorical={[ 'title', 'namespace', 'private', 'startDate', 'endDate', 'emailFilter' ]}
					quantitative={[ 'members' ]}
					close={this.toggleExplorer}
				/>
			);
		}
		return (
			<Fragment>
				<DashboardTable
					data={this.props.admin.cohorts}
					columns={this.state.columns}
					onButtonClick={this.toggleExplorer}
					t={this.props.t}
				/>
				{ this.state.showDeleteModal ? <ConfirmModal
					title={t('namespace:delete-cohort')}
					message={<span>
						{t('namespace:delete-cohort-confirm')}
						<span style={{ color: 'red' }}>{this.state.selectedCohort.title}</span>
					</span>}
					close={this.toggleDeleteModal}
					show={this.state.showDeleteModal}
					onConfirm={this.deleteSelectedCohort}
				/> : null }
			</Fragment>
		);
	}
}


// PROPERTIES //

CohortTable.propTypes = {
	admin: PropTypes.object.isRequired,
	deleteCohort: PropTypes.func.isRequired,
	getAllCohorts: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'namespace', 'common' ] )( CohortTable );
