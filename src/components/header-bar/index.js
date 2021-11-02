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
import { Link } from 'react-router-dom';
import logger from 'debug';
import { withTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import Overlay from 'react-bootstrap/Overlay';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Tooltip from 'react-bootstrap/Tooltip';
import isObjectArray from '@stdlib/assert/is-object-array';
import contains from '@stdlib/assert/contains';
import SearchBar from 'components/searchbar';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import isOwner from 'utils/is_owner.js';
import icon from './profile_icon.png';
import './header_bar.css';


// VARIABLES //

const debug = logger( 'isle:header-bar' );
const namespaceListGroup = ( namespaces, clickFactory ) => (
	<ListGroup>
		{namespaces.map( ( x, id ) => (
			<ListGroupItem
				key={id}
				style={{ padding: '5px 10px' }}
			>
				<Link to={`/lessons/${x.title}`} onClick={clickFactory( id )}>
					{x.title}
				</Link>
			</ListGroupItem>
		) )}
	</ListGroup>
);


// MAIN //

class HeaderBar extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showNamespacesOverlay: false,
			location: 'Dashboard',
			searchPhrase: ''
		};
	}

	componentDidMount() {
		debug( 'Header bar did mount...' );
		const { namespace, match, user } = this.props;
		if ( namespace ) {
			if ( namespace.title !== match.params.namespace ) {
				let subset = user.enrolledNamespaces.filter( x => x.title === match.params.namespace );
				if ( subset.length > 0 ) {
					debug( 'Open enrolled namespace...' );
					this.props.onEnrolledNamespace( subset[ 0 ] );

					// eslint-disable-next-line react/no-did-mount-set-state
					this.setState({
						location: this.props.t('common:course')
					});
				}
				else {
					subset = user.ownedNamespaces.filter( x => x.title === match.params.namespace );
					if ( subset.length > 0 ) {
						debug( 'Open owned namespace...' );
						this.props.onNamespace( subset[ 0 ] );

						// eslint-disable-next-line react/no-did-mount-set-state
						this.setState({
							location: this.props.t('common:course')
						});
					}
				}
			}
			else {
				debug( 'Retrieve (updated) lessons upon mounting in all cases...' );
				this.props.onNamespace( namespace );
			}
		}
		document.addEventListener( 'visibilitychange', this.handleVisibilityChange );
		this.props.userUpdateCheck( this.props.user );
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.search.phrase !== prevProps.search.phrase ) {
			this.setState({
				searchPhrase: this.props.search.phrase
			});
		}
	}

	componentWillUnmount() {
		document.removeEventListener( 'visibilitychange', this.handleVisibilityChange );
	}

	handleVisibilityChange = () => {
		debug(`Your page is ${document.visibilityState}`);
		this.props.userUpdateCheck( this.props.user );
	};

	enrolledClickFactory = ( id ) => {
		return () => {
			this.props.onEnrolledNamespace( this.props.user.enrolledNamespaces[ id ], this.props.user.token );
			this.setState({
				showNamespacesOverlay: false,
				location: this.props.t('common:course'),
				searchPhrase: ''
			});
		};
	};

	ownedClickFactory = ( id ) => {
		return () => {
			this.props.onNamespace( this.props.user.ownedNamespaces[ id ], this.props.user.token );
			this.setState({
				showNamespacesOverlay: false,
				location: this.props.t('common:course'),
				searchPhrase: ''
			});
		};
	};

	setProfileLocation = () => {
		this.setState({
			location: this.props.t('common:profile')
		});
	};

	goBackToLesson = () => {
		this.props.history.replace( `/lessons/${this.props.namespace.title}` );
		this.props.onNamespace( this.props.namespace, this.props.user.token );
		this.setState({
			location: this.props.t('common:course')
		});
	};

	goToCreateCoursePage() {
		this.props.history.replace( '/create-namespace' );
		this.setState({
			location: 'Dashboard'
		});
	}

	goToEnrolledPage = () => {
		this.props.history.replace( '/enroll' );
		this.setState({
			location: this.props.t('common:enroll'),
			showNamespacesOverlay: false
		});
	};

	goToCourseEditPage() {
		this.props.history.replace( `/edit-namespace/${this.props.namespace.title}` );
		this.setState({
			location: 'Dashboard'
		});
	}

	goToCourseDataPage() {
		this.props.history.replace( `/namespace-data/${this.props.namespace.title}` );
		this.setState({
			location: this.props.t('course-data')
		});
	}

	goToGallery() {
		this.props.history.replace( '/gallery' );
		this.setState({
			location: this.props.t('gallery'),
			searchPhrase: ''
		});
	}

	goToAdmin() {
		this.props.history.replace( '/admin' );
		this.setState({
			location: 'Administrator Panel',
			searchPhrase: ''
		});
	}

	handleTextChange = ( event ) => {
		if ( !this.debouncedChange ) {
			this.debouncedChange = debounce( ( value ) => {
				this.props.setSearchPhrase( value );
			}, 750 );
		}
		const { value } = event.target;
		this.setState({
			searchPhrase: value
		});
		this.debouncedChange( value );
	};

	renderCreateButton() {
		if ( !this.props.user.writeAccess ) {
			return null;
		}
		const { t } = this.props;
		return (
			<div className="header-bar-container">
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="new_course">{t('create-course')}</Tooltip>}>
					<Button
						style={{ float: 'left', marginRight: '4px', marginLeft: '4px', marginTop: '8px' }}
						onClick={this.goToCreateCoursePage.bind( this )}
						aria-label={t('create-course')}
					>
						<i className="fa fa-pencil-alt"></i>
					</Button>
				</OverlayTrigger>
			</div>
		);
	}

	renderEditButton() {
		let owners = this.props.namespace.owners;
		if ( isObjectArray( owners ) ) {
			owners = owners.map( user => user.email );
		}
		if ( !contains( owners, this.props.user.email ) ) {
			return null;
		}
		const { t } = this.props;
		return (
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="edit_course">{t('edit-course')}</Tooltip>}>
				<Button
					style={{ float: 'left', marginRight: '4px' }}
					onClick={this.goToCourseEditPage.bind( this )}
					aria-label={t('edit-course')}
				>
					<i className="fa fa-edit"></i>
				</Button>
			</OverlayTrigger>
		);
	}

	renderDataButton() {
		if ( !this.props.namespace.title ) {
			return null;
		}
		const owner = isOwner( this.props.user, this.props.namespace );
		if ( !owner ) {
			return null;
		}
		const { t } = this.props;
		return (
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="course_data">{t('course-data')}</Tooltip>}>
				<Button
					style={{ float: 'left', marginRight: '4px' }}
					onClick={this.goToCourseDataPage.bind( this )}
					aria-label={t('course-data')}
				>
					<i className="fa fa-chart-pie"></i>
					<small className="course-data-label" >{t('course-data')}</small>
				</Button>
			</OverlayTrigger>
		);
	}

	renderAdminButton() {
		if ( !this.props.user.administrator ) {
			return null;
		}
		const { t } = this.props;
		return (
			<div className="header-bar-container">
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="open_admin">{t('open-admin')}</Tooltip>}>
					<Button
						onClick={this.goToAdmin.bind( this )}
						className="header-bar-container-button"
						aria-label={t('open-admin')}
					>
						<i className="fa fa-cogs"></i>
						<small className="admin-label">{t('admin')}</small>
					</Button>
				</OverlayTrigger>
			</div>
		);
	}

	renderGalleryButton() {
		if ( !this.props.user.writeAccess ) {
			return null;
		}
		const { t } = this.props;
		return (
			<div className="header-bar-container">
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="open_gallery">{t('open-gallery')}</Tooltip>}>
					<Button
						aria-label="Gallery"
						onClick={this.goToGallery.bind( this )}
						className="header-bar-container-button"
					>
						<i className="fa fa-eye"></i>
						<small className="gallery-label">{t('gallery')}</small>
					</Button>
				</OverlayTrigger>
			</div>
		);
	}

	renderCoursesButton() {
		let disabled = false;
		if (
			this.props.user.ownedNamespaces.length > 0 || this.props.user.enrolledNamespaces.length > 0
		) {
			disabled = false;
		}
		const { t } = this.props;
		const selectCourseTooltip = <Tooltip id="select_course">{t('select-course')}</Tooltip>;
		return (
			<ButtonGroup style={{
				float: 'left',
				marginRight: '4px'
			}}>
				<OverlayTrigger placement="right" overlay={selectCourseTooltip}>
					<Button
						variant="secondary"
						ref={( button ) => { this.overlayTarget = button; }}
						disabled={disabled}
						onClick={() => {
							this.setState({
								showNamespacesOverlay: !this.state.showNamespacesOverlay
							});
						}}
						aria-label={t('select-course')}
					>
						<i className="fa fa-align-justify"></i>
					</Button>
				</OverlayTrigger>
				<OverlayTrigger
					placement="right"
					overlay={this.props.namespace.title ?
						<Tooltip id="to_course">{t('goto-course-lessons')}</Tooltip> :
						selectCourseTooltip}
				>
					<Button
						variant="secondary"
						onClick={() => {
							if ( !this.props.namespace.title ) {
								return this.setState({
									showNamespacesOverlay: !this.state.showNamespacesOverlay
								});
							}
							this.goBackToLesson();
						}}
					>
						<small className="title-limited-length" >
							{this.props.namespace.title || t('open-your-courses')}
						</small>
					</Button>
				</OverlayTrigger>
			</ButtonGroup>
		);
	}

	renderDropdownButton() {
		const pth = this.props.history.location.pathname;
		if (
			( !this.props.namespace.title && pth === '/lessons' ) ||
			( pth !== `/lessons/${this.props.namespace.title}` && pth !== '/lessons' && pth !== '/gallery' )
		) {
			return null;
		}
		let title;
		const { t } = this.props;
		switch ( this.props.search.type ) {
			case 'sequentially':
				title = t('common:sort-default');
				break;
			case 'alphabetically':
				title = t('common:sort-alphabetically');
				break;
			case 'created_at':
				title = t('common:sort-create-date');
				break;
			case 'updated_at':
				title = t('common:sort-update-date');
				break;
		}
		const owner = isOwner( this.props.user, this.props.namespace );
		return (
			<ButtonGroup style={{ float: 'left', marginBottom: '4px' }} >
				<DropdownButton variant="secondary" onSelect={( newValue ) => {
					this.props.setLessonOrder( newValue );
				}} id="dropdown" title={
					<OverlayTrigger
						placement="left"
						overlay={<Tooltip id="sort-default-explanation" >
							{owner ? t('sort-default-owner-explanation') : t('sort-default-student-explanation')}
						</Tooltip>}
					>
						<small>
							<span className="title-limited-length">
								{title}
							</span>
						</small>
					</OverlayTrigger>
				} >
					<Dropdown.Item eventKey="sequentially">
						<small>{t('common:sort-default')}</small>
					</Dropdown.Item>
					<Dropdown.Item eventKey="alphabetically">
						<small>{t('common:sort-alphabetically')}</small>
					</Dropdown.Item>
					<Dropdown.Item eventKey="created_at">
						<small>{t('common:sort-create-date')}</small>
					</Dropdown.Item>
					<Dropdown.Item eventKey="updated_at">
						<small>{t('common:sort-update-date')}</small>
					</Dropdown.Item>
				</DropdownButton>
				<Button variant="secondary" style={{ marginLeft: 2 }} onClick={() => {
					if ( this.props.search.direction === 'ascending' ) {
						this.props.setLessonOrderDirection( 'descending' );
					} else {
						this.props.setLessonOrderDirection( 'ascending' );
					}
				}} aria-label={this.props.search.direction === 'ascending' ?
					t('common:sort-descending') : t('common:sort-ascending')}>
					{ this.props.search.direction === 'ascending' ?
						<i className="fas fa-arrow-down" /> :
						<i className="fas fa-arrow-up" />
					}
				</Button>
			</ButtonGroup>
		);
	}

	renderSearchField() {
		const pth = this.props.history.location.pathname;
		if (
			( !this.props.namespace.title && pth === '/lessons' ) ||
			( pth !== `/lessons/${this.props.namespace.title}` && pth !== '/lessons' && pth!== '/gallery' )
		) {
			return null;
		}
		return (
			<SearchBar
				onChange={this.handleTextChange}
				value={this.state.searchPhrase || ''}
				placeholder={this.props.t('search-placeholder')}
			/>
		);
	}

	renderHelp() {
		if ( !this.props.user.writeAccess ) {
			return null;
		}
		const { t } = this.props;
		return ( <div className="header-bar-container">
			<div key="help" className="header-bar-link-div" >
				<a
					href="http://isledocs.com/" target="_blank"
					className="header-bar-link"
				>{t('help')}</a>
			</div>
		</div> );
	}

	render() {
		const { t } = this.props;
		let profilePic;
		if ( this.props.user.picture ) {
			profilePic = this.props.user.picture;
		} else {
			profilePic = icon;
		}
		return (
			<header className="header-bar">
				<div className="header-bar-buttons" >
					{this.renderCoursesButton()}
					<Overlay
						show={this.state.showNamespacesOverlay}
						target={this.overlayTarget}
						onHide={() => {
							this.setState({
								showNamespacesOverlay: false
							});
						}}
						placement="bottom"
						rootClose
						rootCloseEvent="click"
					>
						<Popover id="popover-courses">
							{ this.props.user.ownedNamespaces.length > 0 ? <Fragment>
								<span className="label-display">{t('owned-courses')}</span>
								{namespaceListGroup( this.props.user.ownedNamespaces, this.ownedClickFactory )}
								<div className="separator" />
								</Fragment> : null}
							{this.props.user.enrolledNamespaces.length > 0 ? <Fragment>
								<span className="label-display">{t('enrolled-courses')}</span>
								{namespaceListGroup( this.props.user.enrolledNamespaces, this.enrolledClickFactory )}
							</Fragment> : null}
							<Button onClick={this.goToEnrolledPage} style={{ marginTop: 10 }} size="sm" block variant="outline-success" >
								{t('enroll')}
							</Button>
						</Popover>
					</Overlay>
					{this.renderEditButton()}
					{this.renderDataButton()}
					{this.renderSearchField()}
					{this.renderDropdownButton()}
				</div>
				<div className="header-bar-title-wrapper" >
					<h1 className="header-bar-title">
						ISLE {this.state.location}
					</h1>
				</div>
				<div className="header-bar-right-container">
					{this.renderAdminButton()}
					{this.renderGalleryButton()}
					{this.renderCreateButton()}
					{this.renderHelp()}
					<OverlayTrigger placement="bottom" overlay={<Tooltip id="profile-button">{t('common:open-profile')}</Tooltip>}>
						<Link to="/profile" className="header-bar-container" onClick={this.setProfileLocation} >
							<Image alt="Profile picture" src={profilePic} className="header-bar-icon" />
							<span id="header-bar-username" key="account" className="header-bar-link-div" >
								<span className="header-bar-link">
									{this.props.user.name}
								</span>
							</span>
						</Link>
					</OverlayTrigger>
					<OverlayTrigger placement="bottom" overlay={<Tooltip id="logout-button">{t('common:logout')}</Tooltip>}>
						<div className="header-bar-container">
								<div key="logout" className="header-bar-link-div" >
									<button
										key="logoutButton"
										aria-label={t('common:logout')}
										className="header-bar-link empty-button"
										onClick={this.props.logout}
									>
										<i className="fas fa-sign-out-alt" ></i>
									</button>
								</div>
						</div>
					</OverlayTrigger>
				</div>
			</header>
		);
	}
}


// PROPERTIES //

HeaderBar.propTypes = {
	history: PropTypes.object.isRequired,
	logout: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	namespace: PropTypes.object.isRequired,
	onEnrolledNamespace: PropTypes.func.isRequired,
	onNamespace: PropTypes.func.isRequired,
	search: PropTypes.object.isRequired,
	setLessonOrder: PropTypes.func.isRequired,
	setLessonOrderDirection: PropTypes.func.isRequired,
	setSearchPhrase: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	userUpdateCheck: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation( [ 'header_bar', 'common' ] )( HeaderBar );
