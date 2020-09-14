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
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import createBooleanColumn from './create_boolean_column.js';
import ConfirmModal from 'components/confirm-modal';
import createNumericColumn from './create_numeric_column.js';
import textFilter from './text_filter.js';
import 'react-table/react-table.css';


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
		for ( let i = 0; i < cohorts.length; i++ ) {
			const members = cohorts[ i ].members;
			const nMembers = members.length;
			if ( nMembers && nMembers > maxStudents ) {
				maxStudents = nMembers;
			}
		}
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
				Header: t('common:course'),
				id: 'namespace',
				accessor: 'namespace.title',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' },
				filterMethod: textFilter
			},
			{
				Header: t('namespace:email-filter'),
				id: 'emailFilter',
				accessor: 'emailFilter',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' }
			},
			createBooleanColumn({
				Header: t('enrollment'),
				accessor: 'private',
				trueLabel: t('open-enrollment'),
				falseLabel: t('manual-enrollment'),
				printLabels: true
			}),
			{
				Header: t('start-date'),
				accessor: 'startDate',
				Cell: ( row ) => {
					return new Date( row.value ).toLocaleDateString();
				},
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 150
			},
			{
				Header: t('end-date'),
				accessor: 'endDate',
				Cell: ( row ) => {
					return new Date( row.value ).toLocaleDateString();
				},
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 150
			},
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
				}
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

	render() {
		return (
			<Fragment>
				<ReactTable
					filterable
					data={this.props.admin.cohorts}
					columns={this.state.columns}
					ref={(r) => {
						this.reactTable = r;
					}}
				/>
				{ this.state.showDeleteModal ? <ConfirmModal
					title={this.props.t('namespace:delete-cohort')}
					message={<span>{this.props.t('namespace:delete-cohort-confirm')}<span style={{ color: 'red' }}>{this.state.selectedCohort.title}</span></span>}
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
	getAllCohorts: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'namespace', 'common' ] )( CohortTable );
