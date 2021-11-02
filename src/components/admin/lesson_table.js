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
import Popover from 'react-bootstrap/Popover';
import capitalize from '@stdlib/string/capitalize';
import PINF from '@stdlib/constants/float64/pinf';
import obsToVar from '@isle-project/utils/obs-to-var';
import DashboardTable from 'components/dashboard-table';
import DashboardDataExplorer from 'ev/components/data-explorer';
import ConfirmModal from 'components/confirm-modal';
import server from 'constants/server';
import createBooleanColumn from 'utils/create_boolean_column.js';
import createDateColumn from 'utils/create_date_column.js';
import textFilter from 'utils/text_filter.js';


// VARIABLES //

const debug = logger( 'isle-dashboard:admin' );


// MAIN //

class LessonTable extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			selectedLesson: null,
			showDeleteModal: false,
			columns: this.createColumns(),
			showExplorer: false
		};
	}

	componentDidMount() {
		this.props.getAllLessons();
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.admin.lessons !== this.props.admin.lessons ) {
			this.setState({
				columns: this.createColumns()
			});
		}
	}

	createColumns = () => {
		const { t } = this.props;
		const lessons = this.props.admin.lessons;
		let minTime = PINF;
		let maxTime = 0;
		for ( let i = 0; i < lessons.length; i++ ) {
			if ( lessons[ i ].createdAt > maxTime ) {
				maxTime = lessons[ i ].createdAt;
			}
			if ( lessons[ i ].updatedAt > maxTime ) {
				maxTime = lessons[ i ].updatedAt;
			}
			if ( lessons[ i ].createdAt < minTime ) {
				minTime = lessons[ i ].createdAt;
			}
			if ( lessons[ i ].updatedAt < minTime ) {
				minTime = lessons[ i ].updatedAt;
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
				filterMethod: textFilter,
				Cell: ( row ) => {
					return (
						<a
							href={`${server}/${row.original.namespace.title}/${row.original.title}`}
						>{row.original.title}</a>
					);
				}
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
				Header: t('common:description'),
				id: 'description',
				accessor: 'description',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' },
				filterMethod: textFilter
			},
			createBooleanColumn({
				Header: capitalize( t('lesson:active') ),
				accessor: 'active',
				trueLabel: t('lesson:active'),
				falseLabel: t('lesson:inactive')
			}),
			createBooleanColumn({
				Header: capitalize( t('lesson:public') ),
				accessor: 'public',
				trueLabel: t('lesson:public'),
				falseLabel: t('lesson:private')
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
				Header: t( 'metadata' ),
				accessor: 'metadata',
				style: { marginTop: '2px', color: 'darkslategrey', fontSize: 24, textAlign: 'center', cursor: 'pointer' },
				Cell: ( row ) => {
					if ( row.value ) {
						const popover = <Popover id="popover-data" style={{ maxWidth: 400 }}>
							<Popover.Title as="h3">Data</Popover.Title>
							<Popover.Content style={{ backgroundColor: 'lightblue' }} >
								<pre>{JSON.stringify( row.value, null, 2 )}
								</pre>
							</Popover.Content>
						</Popover>;
						return (
							<OverlayTrigger trigger="click" placement="right" overlay={popover}>
								<i className="data-icon fas fa-tablet-alt"></i>
							</OverlayTrigger>
						);
					}
					return null;
				},
				maxWidth: 120,
				resizable: false,
				filterable: false,
				sortable: false
			},
			{
				Header: t('common:actions'),
				Cell: ( row ) => {
					return ( <div>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="delete_lesson">{t('lesson:delete-lesson')}</Tooltip>}>
							<Button
								variant="outline-secondary"
								style={{ marginLeft: 8 }}
								onClick={this.askToDeleteSelectedLessonFactory( row.row._original )}
								aria-label={t('lesson:delete-lesson')}
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

	askToDeleteSelectedLessonFactory = ( lesson ) => {
		return () => {
			this.setState({
				showDeleteModal: !this.state.showDeleteModal,
				selectedLesson: lesson
			});
		};
	};

	deleteSelectedLesson = () => {
		const lessonName = this.state.selectedLesson.title;
		const namespaceName = this.state.selectedLesson.namespace.title;
		debug( `Delete lesson ${lessonName} of course ${namespaceName}.` );
		this.setState({
			showDeleteModal: false
		}, async () => {
			await this.props.deleteLesson({
				lessonName,
				namespaceName
			});
			this.props.getAllLessons();
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
			const lessons = this.props.admin.lessons;
			let data = [];
			for ( let i = 0; i < lessons.length; i++ ) {
				const lesson = lessons[ i ];
				const replacement = {};
				replacement.title = lesson.title;
				replacement.namespace = lesson.namespace ? lesson.namespace.title : null;
				replacement.description = lesson.description;
				replacement.active = lesson.active;
				replacement.public = lesson.public;
				replacement.createdAt = lesson.createdAt;
				replacement.updatedAt = lesson.updatedAt;
				data.push( replacement );
			}
			data = obsToVar( data );
			return (
				<DashboardDataExplorer
					title={t('explorer-lessons-title')}
					data={data}
					categorical={[ 'title', 'namespace', 'active', 'public', 'createdAt', 'updatedAt' ]}
					quantitative={[]}
					close={this.toggleExplorer}
				/>
			);
		}
		return (
			<Fragment>
				<DashboardTable
					data={this.props.admin.lessons}
					columns={this.state.columns}
					onButtonClick={this.toggleExplorer}
					t={t}
				/>
				{ this.state.showDeleteModal ? <ConfirmModal
					title={t('lesson:delete-lesson')}
					message={<span>{t('lesson:delete-modal-body', {
						name: this.state.selectedLesson.title
					})}</span>}
					close={this.toggleDeleteModal}
					show={this.state.showDeleteModal}
					onConfirm={this.deleteSelectedLesson}
				/> : null }
			</Fragment>
		);
	}
}


// PROPERTIES //

LessonTable.propTypes = {
	admin: PropTypes.object.isRequired,
	deleteLesson: PropTypes.func.isRequired,
	getAllLessons: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'lesson', 'common' ] )( LessonTable );
