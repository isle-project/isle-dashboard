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
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Popover from 'react-bootstrap/Popover';
import round from '@stdlib/math/base/special/round';
import PINF from '@stdlib/constants/float64/pinf';
import mapKeys from '@stdlib/utils/map-keys';
import DashboardTable from 'components/dashboard-table';
import ConfirmModal from 'components/confirm-modal';
import server from 'constants/server';
import obsToVar from '@isle-project/utils/obs-to-var';
import DashboardDataExplorer from 'ev/components/data-explorer';
import SignupModal from './signup_modal.js';
import createCategoricalColumn from './create_categorical_column.js';
import createBooleanColumn from './create_boolean_column.js';
import createNumericColumn from './create_numeric_column.js';
import createDateColumn from './create_date_column.js';
import createTextColumn from './create_text_column.js';
import EditModal from './user_edit_modal.js';
import textFilter from './text_filter.js';
import formatTime from 'utils/format_time.js';


// VARIABLES //

const debug = logger( 'isle-dashboard:admin' );


// MAIN //

class UserPage extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			selectedUser: null,
			showDeleteModal: false,
			showImpersonateModal: false,
			showUserCreation: false,
			password: '',
			showEditModal: false,
			columns: this.createColumns()
		};
	}

	componentDidMount() {
		this.props.getCustomFields();
		this.props.getUsers();
	}

	componentDidUpdate( prevProps ) {
		if (
			prevProps.admin.users !== this.props.admin.users ||
			prevProps.user.availableCustomFields !== this.props.user.availableCustomFields
		) {
			this.setState({
				columns: this.createColumns()
			});
		}
	}

	toggleImpersonateModal = () => {
		this.setState({
			showImpersonateModal: !this.state.showImpersonateModal
		});
	}

	toggleDeleteModal = () => {
		this.setState({
			showDeleteModal: !this.state.showDeleteModal
		});
	}

	toggleEditModal = () => {
		this.setState({
			showEditModal: !this.state.showEditModal
		});
	}

	impersonateUser = () => {
		this.setState({
			showImpersonateModal: false
		}, () => {
			this.props.impersonateUser({
				id: this.state.selectedUser._id,
				password: this.state.password
			});
		});
	}

	deleteSelectedUser = () => {
		debug( `Delete user ${this.state.selectedUser.name} with id ${this.state.selectedUser._id}` );
		this.setState({
			showDeleteModal: false
		}, () => {
			this.props.deleteUser({
				id: this.state.selectedUser._id
			});
		});
	}

	askToImpersonateSelectedUserFactory = ( user ) => {
		return () => {
			this.setState({
				showImpersonateModal: !this.state.showImpersonateModal,
				selectedUser: user
			});
		};
	}

	askToDeleteSelectedUserFactory = ( user ) => {
		return () => {
			this.setState({
				showDeleteModal: !this.state.showDeleteModal,
				selectedUser: user
			});
		};
	}

	askToEditUserFactory = ( user ) => {
		return () => {
			this.setState({
				showEditModal: !this.state.showEditModal,
				selectedUser: user
			});
		};
	}

	sanitizeFactory = ( user ) => {
		return async () => {
			const result = await this.props.sanitizeRequest({
				id: user._id
			});
			if ( result && result.data ) {
				return this.props.addNotification({
					title: this.props.t('sanitize-user'),
					message: result.data.message,
					level: 'success',
					position: 'tl'
				});
			}
		};
	}

	handlePassword = ( event ) => {
		this.setState({
			password: event.target.value
		});
	}

	createColumns = () => {
		const { t } = this.props;
		const users = this.props.admin.users;
		let maxChatMessages = 0;
		let maxActions = 0;
		let maxSpentTime = 0;
		let minTime = PINF;
		let maxTime = 0;
		for ( let i = 0; i < users.length; i++ ) {
			if ( users[ i ].chatMessages > maxChatMessages ) {
				maxChatMessages = users[ i ].chatMessages;
			}
			if ( users[ i ].nActions > maxActions ) {
				maxActions = users[ i ].nActions;
			}
			if ( users[ i ].spentTime > maxSpentTime ) {
				maxSpentTime = users[ i ].spentTime;
			}
			if ( users[ i ].createdAt > maxTime ) {
				maxTime = users[ i ].createdAt;
			}
			if ( users[ i ].updatedAt > maxTime ) {
				maxTime = users[ i ].updatedAt;
			}
			if ( users[ i ].createdAt < minTime ) {
				minTime = users[ i ].createdAt;
			}
			if ( users[ i ].updatedAt < minTime ) {
				minTime = users[ i ].updatedAt;
			}
		}
		minTime = moment( minTime );
		maxTime = moment( maxTime );
		return [
		{
				Header: 'Pic',
				accessor: 'picture',
				Cell: row => (
					<img className="table-pic" src={`${server}/thumbnail/${row.original.picture}`} alt="Profile Pic" />
				),
				maxWidth: 46,
				minWidth: 46,
				filterable: false,
				resizable: false,
				sortable: false,
				style: { color: 'darkslategrey' }
			},
			createTextColumn({
				Header: t('common:name'),
				accessor: 'name',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' }
			}),
			createTextColumn({
				Header: t('common:email'),
				accessor: 'email',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' },
				filterMethod: textFilter
			}),
			createTextColumn({
				Header: t('common:organization'),
				accessor: 'organization',
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 200,
				filterMethod: textFilter
			}),
			createBooleanColumn({
				Header: t( 'instructor' ),
				accessor: 'writeAccess',
				trueLabel: t('instructor'),
				falseLabel: t('no-instructor'),
				maxWidth: 100
			}),
			createBooleanColumn({
				Header: t( 'admin' ),
				accessor: 'administrator',
				trueLabel: t('admin'),
				falseLabel: t('no-admin'),
				maxWidth: 100
			}),
			createBooleanColumn({
				Header: t( 'email-verified' ),
				accessor: 'verifiedEmail',
				trueLabel: t('verified'),
				falseLabel: t('not-verified'),
				maxWidth: 90
			}),
			createBooleanColumn({
				Header: t( 'common:two-factor-authentication' ),
				accessor: 'twoFactorAuth',
				trueLabel: t('common:enabled'),
				falseLabel: t('common:not-enabled'),
				maxWidth: 100
			}),
			createNumericColumn({
				Header: t('common:chat-messages'),
				accessor: 'chatMessages',
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 120,
				maxValue: maxChatMessages
			}),
			createNumericColumn({
				Header: t('common:time-spent'),
				accessor: 'spentTime',
				Cell: ( row ) => {
					return formatTime( row.value, { minutes: true, hours: true });
				},
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 100,
				maxValue: maxSpentTime,
				formatLabel: x => `${round(x / ( 1000 * 60 * 60 ))}h`
			}),
			createNumericColumn({
				Header: t('common:number-of-actions'),
				accessor: 'nActions',
				style: { marginTop: '8px', color: 'darkslategrey' },
				maxWidth: 100,
				maxValue: maxActions
			}),
			createDateColumn({
				Header: t('last-updated'),
				accessor: 'updatedAt',
				Cell: ( row ) => {
					return new Date( row.value ).toLocaleString();
				},
				startDate: minTime,
				endDate: maxTime,
				t
			}),
			createDateColumn({
				Header: t('created-at'),
				accessor: 'createdAt',
				Cell: ( row ) => {
					return new Date( row.value ).toLocaleString();
				},
				startDate: minTime,
				endDate: maxTime,
				t
			}),
			{
				Header: t( 'common:data' ),
				accessor: 'lessonData',
				style: { marginTop: '2px', color: 'darkslategrey', fontSize: 24, textAlign: 'center', cursor: 'pointer' },
				Cell: ( row ) => {
					if ( row.value ) {
						const lessonData = mapKeys( row.value, ( key ) => {
							if ( this.props.admin.lessonsMap ) {
								return this.props.admin.lessonsMap[ key ];
							}
							return key;
						});
						const popover = <Popover id="popover-data" style={{ maxWidth: 400, maxHeight: '80vh', overflowY: 'auto' }}>
							<Popover.Title as="h3">Data</Popover.Title>
							<Popover.Content style={{ backgroundColor: 'lightblue' }} >
								<pre>{JSON.stringify( lessonData, null, 2 )}
								</pre>
							</Popover.Content>
						</Popover>;
						return (
							<OverlayTrigger trigger="click" placement="left" overlay={popover}>
								<i className="data-icon fas fa-tablet-alt"></i>
							</OverlayTrigger>
						);
					}
					return null;
				},
				maxWidth: 60,
				resizable: false,
				filterable: false,
				sortable: false
			},
			...( this.props.user.availableCustomFields || [] ).map( x => {
				if ( x.type === 'text' ) {
					return createTextColumn({
						Header: x.name,
						accessor: 'customFields.'+x.name,
						maxWidth: 100,
						style: { marginTop: '8px', color: 'darkslategrey' },
						filterMethod: textFilter
					});
				} else if ( x.type === 'checkbox' ) {
					return createBooleanColumn({
						Header: x.name,
						accessor: 'customFields.'+x.name,
						trueLabel: t('yes'),
						falseLabel: t('no'),
						maxWidth: 100
					});
				}
				// Case: Select box...
				return createCategoricalColumn({
					Header: x.name,
					accessor: 'customFields.'+x.name,
					labels: x.options
				});
			}),
			{
				Header: t('common:actions'),
				Cell: ( row ) => {
					if ( row.row.email === this.props.user.email ) {
						return null;
					}
					return ( <div>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="edit_user_data">{t('edit-user-data')}</Tooltip>}>
							<Button
								variant="outline-secondary"
								aria-label={t('edit-user-data')}
								onClick={this.askToEditUserFactory( row.row._original )}
							>
								<div className="fa fa-edit" />
							</Button>
						</OverlayTrigger>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="sanitize_user">{t('sanitize-user')}</Tooltip>}>
							<Button
								variant="outline-secondary"
								style={{ marginLeft: 8 }}
								onClick={this.sanitizeFactory( row.row._original )}
								aria-label={t('sanitize-user')}
							>
								<div className="fas fa-band-aid" />
							</Button>
						</OverlayTrigger>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="impersonate_user">{t('impersonate-user')}</Tooltip>}>
							<Button
								variant="outline-secondary"
								style={{ marginLeft: 8 }}
								onClick={this.askToImpersonateSelectedUserFactory( row.row._original )}
								aria-label={t('impersonate-user')}
							>
								<div className="fa fa-theater-masks" />
							</Button>
						</OverlayTrigger>
						<OverlayTrigger placement="bottom" overlay={<Tooltip id="delete_user">{t('delete-user')}</Tooltip>}>
							<Button
								variant="outline-secondary"
								style={{ marginLeft: 8 }}
								onClick={this.askToDeleteSelectedUserFactory( row.row._original )}
								aria-label={t('delete-user')}
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

	toggleExplorer = () => {
		this.setState({
			showExplorer: !this.state.showExplorer
		});
	}

	toggleUserCreation = () => {
		this.setState({
			showUserCreation: !this.state.showUserCreation
		});
	}

	render() {
		const { t } = this.props;
		if ( this.state.showExplorer ) {
			const users = this.props.admin.users;
			let data = [];
			for ( let i = 0; i < users.length; i++ ) {
				const user = users[ i ];
				const replacement = {};
				replacement.name = user.name;
				replacement.email = user.email;
				replacement.nActions = user.nActions;
				replacement.ownedNamespaces = user.ownedNamespaces.length;
				replacement.enrolledNamespaces = user.enrolledNamespaces.length;
				replacement.chatMessages = user.chatMessages.length;
				replacement.badges = user.badges.length;
				replacement.score = user.score;
				replacement.spentTime = user.spentTime;
				replacement.administrator = user.administrator;
				replacement.verifiedEmail = user.verifiedEmail;
				replacement.instructor = user.writeAccess;
				replacement.createdAt = user.createdAt;
				replacement.updatedAt = user.updatedAt;
				data.push( replacement );
			}
			data = obsToVar( data );
			return (
				<DashboardDataExplorer
					title={t('explorer-users-title')}
					data={data}
					categorical={[ 'administrator', 'instructor', 'verifiedEmail', 'createdAt', 'updatedAt' ]}
					quantitative={[ 'nActions', 'ownedNamespaces', 'enrolledNamespaces', 'chatMessages', 'badges', 'score', 'spentTime' ]}
					close={this.toggleExplorer}
				/>
			);
		}
		return (
			<Fragment>
				<DashboardTable
					data={this.props.admin.users}
					columns={this.state.columns}
					onButtonClick={this.toggleExplorer}
					t={t}
				/>
				<OverlayTrigger placement="left" overlay={<Tooltip>{t('create-new-user')}</Tooltip>} >
					<Button style={{ marginRight: -9, float: 'right' }} onClick={this.toggleUserCreation} >
						<i className="fas fa-plus"></i>
					</Button>
				</OverlayTrigger>
				{ this.state.showImpersonateModal ? <ConfirmModal
					title={t('impersonate-user')}
					message={<span>
						{t('enter-password')}<span style={{ color: 'red' }}>{this.state.selectedUser.name}</span>.{t('automatic-logout')}
						<FormControl
							name="password"
							type="password"
							placeholder={t('password-placeholder')}
							onChange={this.handlePassword}
							maxLength={30}
							minLength={6}
							style={{ marginTop: 8 }}
						/>
					</span>}
					close={this.toggleImpersonateModal}
					show={this.state.showImpersonateModal}
					onConfirm={this.impersonateUser}
				/> : null }
				{ this.state.showDeleteModal ? <ConfirmModal
					title={t('delete-user')}
					message={<span>{t('delete-user-confirm')}<span style={{ color: 'red' }}>{this.state.selectedUser.name}</span>?</span>}
					close={this.toggleDeleteModal}
					show={this.state.showDeleteModal}
					onConfirm={this.deleteSelectedUser}
				/> : null }
				{ this.state.showEditModal ? <EditModal
					user={this.state.selectedUser}
					availableCustomFields={this.props.user.availableCustomFields}
					t={this.props.t}
					show={this.state.showEditModal}
					updateUser={this.props.updateUser}
					onHide={this.toggleEditModal}
				/> : null }
				{ this.state.showUserCreation ?
					<SignupModal
						user={this.props.user}
						getCustomFields={this.props.getCustomFields}
						onHide={this.toggleUserCreation}
						onConfirm={async ( data ) => {
							try {
								await this.props.createUser( data );
								this.props.addNotification({
									message: t('user-successfully-created'),
									level: 'success'
								});
								this.toggleUserCreation();
								this.props.getUsers();
							} catch ( err ) {
								this.props.addNotification({
									message: err.response.data,
									level: 'error'
								});
							}
						}}
					/> : null
				}
			</Fragment>
		);
	}
}


// PROPERTIES //

UserPage.propTypes = {
	addNotification: PropTypes.func.isRequired,
	admin: PropTypes.object.isRequired,
	createUser: PropTypes.func.isRequired,
	deleteUser: PropTypes.func.isRequired,
	getCustomFields: PropTypes.func.isRequired,
	getUsers: PropTypes.func.isRequired,
	impersonateUser: PropTypes.func.isRequired,
	sanitizeRequest: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
	updateUser: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( UserPage );
