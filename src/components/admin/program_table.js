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

class ProgramPage extends Component {
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
		this.props.getAllPrograms();
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.admin.programs !== this.props.admin.programs ) {
			this.setState({
				columns: this.createColumns()
			});
		}
	}

	createColumns = () => {
		const { t } = this.props;
		const programs = this.props.admin.programs;
		let maxOwners = 0;
		let minTime = PINF;
		let maxTime = 0;
		for ( let i = 0; i < programs.length; i++ ) {
			const owners = programs[ i ].owners;
			const nOwners = owners.length;
			if ( nOwners && nOwners > maxOwners ) {
				maxOwners = nOwners;
			}
			if ( programs[ i ].createdAt > maxTime ) {
				maxTime = programs[ i ].createdAt;
			}
			if ( programs[ i ].updatedAt > maxTime ) {
				maxTime = programs[ i ].updatedAt;
			}
			if ( programs[ i ].createdAt < minTime ) {
				minTime = programs[ i ].createdAt;
			}
			if ( programs[ i ].updatedAt < minTime ) {
				minTime = programs[ i ].updatedAt;
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
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="delete_course">{t('program:delete-program')}</Tooltip>}>
							<Button
								variant="outline-secondary"
								style={{ marginLeft: 8 }}
								onClick={this.askToDeleteSelectedProgramFactory( row.row._original )}
								aria-label={t('program:delete-program')}
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

	askToDeleteSelectedProgramFactory = ( program ) => {
		return () => {
			this.setState({
				showDeleteModal: !this.state.showDeleteModal,
				selectedProgram: program
			});
		};
	};

	deleteSelectedProgram = () => {
		debug( `Delete program ${this.state.selectedProgram.title} with id ${this.state.selectedProgram._id}` );
		this.setState({
			showDeleteModal: false
		}, async () => {
			await this.props.deleteCurrentProgram( this.state.selectedProgram._id );
			this.props.getAllPrograms();
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
			const programs = this.props.admin.programs;
			let data = [];
			for ( let i = 0; i < programs.length; i++ ) {
				const program = programs[ i ];
				const replacement = {};
				replacement.title = program.title;
				replacement.description = program.description;
				replacement.owners = program.owners.length;
				replacement.createdAt = program.createdAt;
				replacement.updatedAt = program.updatedAt;
				data.push( replacement );
			}
			data = obsToVar( data );
			return (
				<DashboardDataExplorer
					title={t('explorer-programs-title')}
					data={data}
					categorical={[ 'title', 'createdAt', 'updatedAt' ]}
					quantitative={[ 'owners' ]}
					close={this.toggleExplorer}
				/>
			);
		}
		return (
			<Fragment>
				<DashboardTable
					data={this.props.admin.programs}
					columns={this.state.columns}
					onButtonClick={this.toggleExplorer}
					t={t}
				/>
				{ this.state.showDeleteModal ? <ConfirmModal
					title={t('program:delete-program')}
					message={<span>
						{t('program:delete-program-confirm')}
						<span style={{ color: 'red' }}>{this.state.selectedProgram.title}</span>
					</span>}
					close={this.toggleDeleteModal}
					show={this.state.showDeleteModal}
					onConfirm={this.deleteSelectedProgram}
				/> : null }
			</Fragment>
		);
	}
}


// PROPERTIES //

ProgramPage.propTypes = {
	admin: PropTypes.object.isRequired,
	deleteCurrentProgram: PropTypes.func.isRequired,
	getAllPrograms: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'program', 'common' ] )( ProgramPage );
