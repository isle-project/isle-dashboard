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

import React, { useEffect, useState, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import logger from 'debug';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
import debounce from 'lodash.debounce';
import isOwner from 'utils/is_owner.js';
import useMountEffect from 'hooks/use-mount-effect';
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

const GalleryButton = ({ onNavigate, writeAccess, t }) => {
	if ( !writeAccess ) {
		return null;
	}
	return (
		<div className="header-bar-container">
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="open_gallery">{t('open-gallery')}</Tooltip>}>
				<Button
					aria-label="Gallery"
					onClick={onNavigate}
					className="header-bar-container-button"
				>
					<i className="fa fa-eye"></i>
					<small className="gallery-label">{t('gallery')}</small>
				</Button>
			</OverlayTrigger>
		</div>
	);
};

const HelpLink = ({ writeAccess, t }) => {
	if ( !writeAccess ) {
		return null;
	}
	return ( <div className="header-bar-container">
		<div key="help" className="header-bar-link-div" >
			<a
				href="http://isledocs.com/" target="_blank"
				className="header-bar-link"
			>{t('help')}</a>
		</div>
	</div> );
};

const CreateButton = ({ onNavigate, writeAccess, t }) => {
	if ( !writeAccess ) {
		return null;
	}
	return (
		<div className="header-bar-container">
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="new_course">{t('create-course')}</Tooltip>}>
				<Button
					style={{ float: 'left', marginRight: '4px', marginLeft: '4px', marginTop: '8px' }}
					onClick={onNavigate}
					aria-label={t('create-course')}
				>
					<i className="fa fa-pencil-alt"></i>
				</Button>
			</OverlayTrigger>
		</div>
	);
};

const EditButton = ({ onNavigate, namespace, user, t }) => {
	let owners = namespace.owners;
	if ( isObjectArray( owners ) ) {
		owners = owners.map( user => user.email );
	}
	if ( !contains( owners, user.email ) ) {
		return null;
	}
	return (
		<OverlayTrigger placement="bottom" overlay={<Tooltip id="edit_course">{t('edit-course')}</Tooltip>}>
			<Button
				style={{ float: 'left', marginRight: '4px' }}
				onClick={onNavigate}
				aria-label={t('edit-course')}
			>
				<i className="fa fa-edit"></i>
			</Button>
		</OverlayTrigger>
	);
};

const DataButton = ({ onNavigate, namespace, user, t }) => {
	if ( !namespace.title ) {
		return null;
	}
	const owner = isOwner( user, namespace );
	if ( !owner ) {
		return null;
	}
	return (
		<OverlayTrigger placement="bottom" overlay={<Tooltip id="course_data">{t('course-data')}</Tooltip>}>
			<Button
				style={{ float: 'left', marginRight: '4px' }}
				onClick={onNavigate}
				aria-label={t('course-data')}
			>
				<i className="fa fa-chart-pie"></i>
				<small className="course-data-label" >{t('course-data')}</small>
			</Button>
		</OverlayTrigger>
	);
};

const CoursesButton = ({ user, namespace, goBackToLesson, onEnroll, ownedClickFactory, enrolledClickFactory, t }) => {
	const [ showNamespacesOverlay, setShowNamespacesOverlay ] = useState( false );
	const overlayTarget = useRef( null );
	let disabled = false;
	if (
		user.ownedNamespaces.length > 0 || user.enrolledNamespaces.length > 0
	) {
		disabled = false;
	}
	const selectCourseTooltip = <Tooltip id="select_course">{t('select-course')}</Tooltip>;
	return (
		<Fragment>
			<ButtonGroup style={{
				float: 'left',
				marginRight: '4px'
			}}>
				<OverlayTrigger placement="right" overlay={selectCourseTooltip}>
					<Button
						variant="secondary"
						ref={overlayTarget}
						disabled={disabled}
						onClick={() => {
							setShowNamespacesOverlay( !showNamespacesOverlay );
						}}
						aria-label={t('select-course')}
					>
						<i className="fa fa-align-justify"></i>
					</Button>
				</OverlayTrigger>
				<OverlayTrigger
					placement="right"
					overlay={namespace.title ?
						<Tooltip id="to_course">{t('goto-course-lessons')}</Tooltip> :
						selectCourseTooltip}
				>
					<Button
						variant="secondary"
						onClick={() => {
							if ( !namespace.title ) {
								setShowNamespacesOverlay( !showNamespacesOverlay );
							}
							goBackToLesson();
						}}
					>
						<small className="title-limited-length" >
							{namespace.title || t('open-your-courses')}
						</small>
					</Button>
				</OverlayTrigger>
			</ButtonGroup>
			<Overlay
				show={showNamespacesOverlay}
				target={overlayTarget.current}
				onHide={() => {
					setShowNamespacesOverlay( false );
				}}
				placement="bottom"
				rootClose
				rootCloseEvent="click"
			>
				<Popover id="popover-courses" onClick={() => {
					setShowNamespacesOverlay( false );
				}} className="d-grid">
					{ user.ownedNamespaces.length > 0 ? <Fragment>
						<span className="label-display">{t('owned-courses')}</span>
						{namespaceListGroup( user.ownedNamespaces, ownedClickFactory )}
						<div className="separator" />
						</Fragment> : null}
					{user.enrolledNamespaces.length > 0 ? <Fragment>
						<span className="label-display">{t('enrolled-courses')}</span>
						{namespaceListGroup( user.enrolledNamespaces, enrolledClickFactory )}
					</Fragment> : null}
					<Button onClick={onEnroll} style={{ marginTop: 10 }} size="sm" variant="outline-success" >
						{t('enroll')}
					</Button>
				</Popover>
			</Overlay>
		</Fragment>
	);
};

const CourseDropdownButton = ({ setLessonOrder, setLessonOrderDirection, search, user, namespace, t }) => {
	const pth = window.location.pathname;
	if (
		( !namespace.title && pth === '/lessons' ) ||
		( pth !== `/lessons/${namespace.title}` && pth !== '/lessons' && pth !== '/gallery' )
	) {
		return null;
	}
	let title;
	switch ( search.type ) {
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
	const owner = isOwner( user, namespace );
	return (
		<ButtonGroup style={{ float: 'left', marginBottom: '4px' }} >
			<DropdownButton
				variant="secondary"
				id="dropdown-search-type"
				title={
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
				}
				onClick={( event ) => {
					event.preventDefault();
					event.stopPropagation();
				}}
				onSelect={( newValue ) => {
					setLessonOrder( newValue );
				}}
			>
				<Dropdown.Item eventKey="sequentially" >
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
				if ( search.direction === 'ascending' ) {
					setLessonOrderDirection( 'descending' );
				} else {
					setLessonOrderDirection( 'ascending' );
				}
			}} aria-label={search.direction === 'ascending' ?
				t('common:sort-descending') : t('common:sort-ascending')}>
				{ search.direction === 'ascending' ?
					<i className="fas fa-arrow-down" /> :
					<i className="fas fa-arrow-up" />
				}
			</Button>
		</ButtonGroup>
	);
};

const AdminButton = ({ onNavigate, namespace, user, t }) => {
	if ( !user.administrator ) {
		return null;
	}
	return (
		<div className="header-bar-container">
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="open_admin">{t('open-admin')}</Tooltip>}>
				<Button
					onClick={onNavigate}
					className="header-bar-container-button"
					aria-label={t('open-admin')}
				>
					<i className="fa fa-cogs"></i>
					<small className="admin-label">{t('admin')}</small>
				</Button>
			</OverlayTrigger>
		</div>
	);
};


// MAIN //

const HeaderBar = ({ logout, namespace, user, search, onEnrolledNamespace, onNamespace, setSearchPhrase, setLessonOrder, setLessonOrderDirection, userUpdateCheck }) => {
	const { t } = useTranslation( [ 'header_bar', 'common' ] );
	const navigate = useNavigate();
	const [ location, setLocation ] = useState( t('dashboard') );
	const debouncedChange = useRef( null );

	useEffect( () => {
		const handleVisibilityChange = () => {
			debug(`Your page is ${document.visibilityState}`);
			userUpdateCheck( user );
		};
		document.addEventListener( 'visibilitychange', handleVisibilityChange );
		userUpdateCheck( user );
		return () => {
			document.removeEventListener( 'visibilitychange', handleVisibilityChange );
		};
	});

	useMountEffect( () => {
		debug( 'Header bar did mount...' );
		const match = {
			params: {}
		};
		if ( namespace ) {
			if ( namespace.title !== match.params.namespace ) {
				let subset = user.enrolledNamespaces.filter( x => x.title === match.params.namespace );
				if ( subset.length > 0 ) {
					debug( 'Open enrolled namespace...' );
					onEnrolledNamespace( subset[ 0 ] );
					setLocation( t('common:course') );
				}
				else {
					subset = user.ownedNamespaces.filter( x => x.title === match.params.namespace );
					if ( subset.length > 0 ) {
						debug( 'Open owned namespace...' );
						onNamespace( subset[ 0 ] );
						setLocation( t('common:course') );
					}
				}
			}
			else {
				debug( 'Retrieve (updated) lessons upon mounting in all cases...' );
				onNamespace( namespace );
			}
		}
	});
	let profilePic;
	if ( user.picture ) {
		profilePic = user.picture;
	} else {
		profilePic = icon;
	}
	const pth = window.location.pathname;
	let searchBar;
	if (
		( !namespace.title && pth === '/lessons' ) ||
		( pth !== `/lessons/${namespace.title}` && pth !== '/lessons' && pth!== '/gallery' )
	) {
		searchBar = null;
	} else {
		searchBar = <SearchBar
			onChange={( event ) => {
				if ( !debouncedChange.current ) {
					debouncedChange.current = debounce( ( value ) => {
						setSearchPhrase( value );
					}, 750 );
				}
				const { value } = event.target;
				setSearchPhrase( value );
				debouncedChange.current( value );
			}}
			value={search.phrase || ''}
			placeholder={t('search-placeholder')}
		/>;
	}
	const goToGallery = () => {
		navigate( '/gallery' );
		setLocation( t('gallery') );
		setSearchPhrase( '' );
	};
	const goToCourseDataPage = () => {
		navigate( `/namespace-data/${namespace.title}/announcements` );
		setLocation( t('course-data') );
	};
	const setProfileLocation = () => {
		setLocation( t('common:profile') );
	};
	const goBackToLesson = () => {
		navigate( `/lessons/${namespace.title}` );
		onNamespace( namespace, user.token );
		setLocation( t('common:course') );
	};
	const goToAdminPage = () => {
		navigate( '/admin/overview' );
		setLocation( 'Administrator Panel' );
		setSearchPhrase( '' );
	};
	const goToEnrolledPage = () => {
		navigate( '/enroll' );
		setLocation( t('common:enroll') );
	};
	const goToCreateCoursePage = () => {
		navigate( '/create-namespace' );
		setLocation( t('create-course') );
	};
	const goToCourseEditPage = () => {
		navigate( `/edit-namespace/${namespace.title}` );
		setLocation( 'Dashboard' );
	};
	const enrolledClickFactory = ( id ) => {
		return () => {
			onEnrolledNamespace( user.enrolledNamespaces[ id ], user.token );
			setLocation( t('common:course') );
			setSearchPhrase( '' );
		};
	};
	const ownedClickFactory = ( id ) => {
		return () => {
			onNamespace( user.ownedNamespaces[ id ], user.token );
			setLocation( t('common:course') );
			setSearchPhrase( '' );
		};
	};
	return (
		<header className="header-bar">
			<div className="header-bar-buttons" >
				<CoursesButton
					namespace={namespace} user={user} t={t} goBackToLesson={goBackToLesson}
					enrolledClickFactory={enrolledClickFactory} ownedClickFactory={ownedClickFactory}
					onEnroll={goToEnrolledPage}
				/>
				<EditButton onNavigate={goToCourseEditPage} namespace={namespace} user={user} t={t} />
				<DataButton onNavigate={goToCourseDataPage} namespace={namespace} user={user} t={t} />
				{searchBar}
				<CourseDropdownButton
					search={search} namespace={namespace} user={user} t={t}
					setLessonOrder={setLessonOrder} setLessonOrderDirection={setLessonOrderDirection}
				/>
			</div>
			<div className="header-bar-title-wrapper" >
				<h1 className="header-bar-title">
					ISLE {location}
				</h1>
			</div>
			<div className="header-bar-right-container">
				<AdminButton onNavigate={goToAdminPage} namespace={namespace} user={user} t={t} />
				<GalleryButton onNavigate={goToGallery} writeAccess={user.writeAccess} t={t} />
				<CreateButton onNavigate={goToCreateCoursePage} writeAccess={user.writeAccess} t={t} />
				<HelpLink writeAccess={user.writeAccess} t={t} />
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="profile-button">{t('common:open-profile')}</Tooltip>}>
					<Link to="/profile" className="header-bar-container" onClick={setProfileLocation} >
						<Image alt="Profile picture" src={profilePic} className="header-bar-icon" />
						<span id="header-bar-username" key="account" className="header-bar-link-div" >
							<span className="header-bar-link">
								{user.name}
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
								onClick={logout}
							>
								<i className="fas fa-sign-out-alt" ></i>
							</button>
						</div>
					</div>
				</OverlayTrigger>
			</div>
		</header>
	);
};


// PROPERTIES //

HeaderBar.propTypes = {
	logout: PropTypes.func.isRequired,
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

export default HeaderBar;
