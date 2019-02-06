// MODULES //

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
	Button, ButtonGroup, DropdownButton, Dropdown, FormGroup, FormControl, Image, InputGroup,
	Overlay, OverlayTrigger, Popover, ListGroupItem, ListGroup, Tooltip
} from 'react-bootstrap';
import isObjectArray from '@stdlib/assert/is-object-array';
import contains from '@stdlib/assert/contains';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import icon from './profile_icon.png';
import './header_bar.css';


// VARIABLES //

const createCourseTooltip = <Tooltip id="new_course">Create a new course</Tooltip>;
const editCourseTooltip = <Tooltip id="edit_course">Edit course</Tooltip>;
const courseDataTooltip = <Tooltip id="course_data">Course Data</Tooltip>;
const galleryTooltip = <Tooltip id="open_gallery">Open gallery</Tooltip>;
const selectCourseTooltip = <Tooltip id="select_course">Select course</Tooltip>;
const selectBackTooltip = <Tooltip id="to_course">Go to course lessons</Tooltip>;

const namespaceListGroup = ( namespaces, clickFactory ) => (
	<ListGroup>
		{namespaces.map( ( x, id ) => (
			<ListGroupItem
				key={id}
				style={{ padding: '5px 10px' }}
			>
				<Link to="/lessons" onClick={clickFactory( id )}>
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
			location: 'Dashboard'
		};
	}

	enrolledClickFactory = ( id ) => {
		return () => {
			this.props.onEnrolledNamespace( this.props.user.enrolledNamespaces[ id ], this.props.user.token );
			this.setState({
				showNamespacesOverlay: false,
				location: 'Course'
			});
		};
	}

	ownedClickFactory = ( id ) => {
		return () => {
			this.props.onNamespace( this.props.user.ownedNamespaces[ id ], this.props.user.token );
			this.setState({
				showNamespacesOverlay: false,
				location: 'Course'
			});
		};
	}

	setProfileLocation = () => {
		this.setState({
			location: 'Profile'
		});
	}

	goBackToLesson = () => {
		this.props.history.replace( '/lessons' );
		this.setState({
			location: 'Course'
		});
	}

	goToCreateCoursePage() {
		this.props.history.replace( '/create-namespace' );
		this.setState({
			location: 'Dashboard'
		});
	}

	goToEnrolledPage = () => {
		this.props.history.replace( '/enroll' );
		this.setState({
			location: 'Enroll',
			showNamespacesOverlay: false
		});
	}


	goToCourseEditPage() {
		this.props.history.replace( '/edit-namespace' );
		this.setState({
			location: 'Dashboard'
		});
	}

	goToCourseDataPage() {
		this.props.history.replace( '/namespace-data' );
		this.setState({
			location: 'Course Data'
		});
	}

	goToGallery() {
		this.props.history.replace( '/gallery' );
		this.setState({
			location: 'Gallery'
		});
	}

	handleTextChange = ( event ) => {
		if ( !this.debouncedChange ) {
			this.debouncedChange = debounce( ( value ) => {
				this.props.setSearchPhrase( value );
			}, 750 );
		}
		const { value } = event.target;
		this.debouncedChange( value );
	}

	renderCreateButton() {
		if ( !this.props.user.writeAccess ) {
			return null;
		}
		return ( <OverlayTrigger placement="bottom" overlay={createCourseTooltip}>
			<Button
				style={{ float: 'left', marginRight: '4px' }}
				onClick={this.goToCreateCoursePage.bind( this )}
			>
				<i className="fa fa-pencil-alt"></i>
			</Button>
		</OverlayTrigger> );
	}

	renderEditButton() {
		let owners = this.props.namespace.owners;
		if ( isObjectArray( owners ) ) {
			owners = owners.map( user => user.email );
		}
		if ( !contains( owners, this.props.user.email ) ) {
			return null;
		}
		return (
			<OverlayTrigger placement="bottom" overlay={editCourseTooltip}>
				<Button
					style={{ float: 'left', marginRight: '4px' }}
					onClick={this.goToCourseEditPage.bind( this )}
				>
					<i className="fa fa-edit"></i>
				</Button>
			</OverlayTrigger>
		);
	}

	renderDataButton() {
		if ( !this.props.namespace.title || this.props.namespace.userStatus === 'enrolled' ) {
			return null;
		}
		return (
			<OverlayTrigger placement="bottom" overlay={courseDataTooltip}>
				<Button
					style={{ float: 'left', marginRight: '4px' }}
					onClick={this.goToCourseDataPage.bind( this )}
				>
					<i className="fa fa-chart-pie"></i>
				</Button>
			</OverlayTrigger>
		);
	}

	renderGalleryButton() {
		if ( !this.props.user.writeAccess ) {
			return null;
		}
		return (
			<OverlayTrigger placement="bottom" overlay={galleryTooltip}>
				<Button
					onClick={this.goToGallery.bind( this )}
					style={{
						float: 'left',
						marginRight: '4px'
					}}
				>
					<i className="fa fa-eye"></i>
					<small style={{ marginLeft: '4px' }}>Gallery</small>
				</Button>
			</OverlayTrigger>
		);
	}

	renderCoursesButton() {
		let disabled = false;
		if (
			this.props.user.ownedNamespaces.length > 0 || this.props.user.enrolledNamespaces.length > 0
		) {
			disabled = false;
		}
		return (
			<ButtonGroup style={{
				float: 'left',
				marginRight: '4px'
			}}>
				<OverlayTrigger placement="left" overlay={selectCourseTooltip}>
					<Button
						variant="secondary"
						ref={( button ) => { this.overlayTarget = button; }}
						disabled={disabled}
						onClick={() => {
							this.setState({
								showNamespacesOverlay: !this.state.showNamespacesOverlay
							});
						}}
					>
						<i className="fa fa-align-justify"></i>
					</Button>
				</OverlayTrigger>
				<OverlayTrigger
					placement="right"
					overlay={this.props.namespace.title ? selectBackTooltip : selectCourseTooltip}
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
						<small>
							{this.props.namespace.title || 'Your Courses'}
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
			( pth !== '/lessons' && pth!== '/gallery' )
		) {
			return null;
		}
		let title;
		switch ( this.props.search.type ) {
			case 'alphabetically':
				title = 'Sort alphabetically';
				break;
			case 'created_at':
				title = 'Sort by create date';
				break;
			case 'updated_at':
				title = 'Sort by update date';
				break;
		}
		return (
			<ButtonGroup style={{ marginLeft: 5, float: 'left' }} >
				<DropdownButton variant="secondary" onSelect={( newValue ) => {
					this.props.setLessonOrder( newValue );
				}} id="dropdown" title={<small>{title}</small>} >
					<Dropdown.Item eventKey="alphabetically">
						<small>Sort alphabetically</small>
					</Dropdown.Item>
					<Dropdown.Item eventKey="created_at">
						<small>Sort by create date</small>
					</Dropdown.Item>
					<Dropdown.Item eventKey="updated_at">
						<small>Sort by update date</small>
					</Dropdown.Item>
				</DropdownButton>
				<Button variant="secondary" style={{ marginLeft: 2 }} onClick={() => {
					if ( this.props.search.direction === 'ascending' ) {
						this.props.setLessonOrderDirection( 'descending' );
					} else {
						this.props.setLessonOrderDirection( 'ascending' );
					}
				}}>
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
			( pth !== '/lessons' && pth!== '/gallery' )
		) {
			return null;
		}
		return ( <FormGroup style={{ width: '16vw', float: 'left' }}>
			<InputGroup>
				<FormControl
					className="header-bar-search"
					type="text"
					placeholder="Search"
					defaultValue={this.props.search.phrase}
					onChange={this.handleTextChange}
				/>
					<InputGroup.Append>
						<Button disabled variant="secondary" style={{ cursor: 'auto' }}>
							<i className="fa fa-search"></i>
						</Button>
					</InputGroup.Append>
			</InputGroup>
		</FormGroup> );
	}

	renderHelp() {
		if (!this.props.user.writeAccess) {
			return null;
		}
		return ( <div className="header-bar-container">
			<div key="help" className="header-bar-link-div" >
				<a
					href="http://isledocs.com/" target="_blank"
					className="header-bar-link"
				>Help</a>
			</div>
		</div> );
	}

	render() {
		let profilePic;
		if ( this.props.user.picture ) {
			profilePic = this.props.user.picture;
		} else {
			profilePic = icon;
		}
		return (
			<header className="header-bar">
				<h1 className="header-bar-title">
					ISLE {this.state.location}
				</h1>
				<div className="header-bar-buttons" >
					{this.renderGalleryButton()}
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
								<label className="label-display">OWNED COURSES</label>
								{namespaceListGroup( this.props.user.ownedNamespaces, this.ownedClickFactory )}
								<div className="separator" />
								</Fragment> : null}
							{this.props.user.enrolledNamespaces.length > 0 ? <Fragment>
								<label className="label-display">ENROLLED COURSES</label>
								{namespaceListGroup( this.props.user.enrolledNamespaces, this.enrolledClickFactory )}
							</Fragment> : null}
							<Button onClick={this.goToEnrolledPage} style={{ marginTop: 10 }} size="sm" block variant="success">Enroll</Button>
						</Popover>
					</Overlay>
					{this.renderEditButton()}
					{this.renderDataButton()}
					{this.renderCreateButton()}
					{this.renderSearchField()}
					{this.renderDropdownButton()}
				</div>
				<div className="header-bar-right-container">
					{this.renderHelp()}
					<Link to="/profile" className="header-bar-container">
						<Image alt="Profile picture" src={profilePic} className="header-bar-icon" />
						<span id="header-bar-username" key="account" className="header-bar-link-div" >
							<span onClick={this.setProfileLocation} className="header-bar-link">{this.props.user.name}</span>
						</span>
					</Link>
					<div className="header-bar-container">
						<div key="logout" className="header-bar-link-div" >
							<a
								key="logoutButton"
								href="#"
								className="header-bar-link"
								onClick={this.props.logout}
							> Log out </a>
						</div>
					</div>
				</div>
			</header>
		);
	}
}


// PROPERTIES //

HeaderBar.propTypes = {
	history: PropTypes.object.isRequired,
	logout: PropTypes.func.isRequired,
	namespace: PropTypes.object.isRequired,
	onEnrolledNamespace: PropTypes.func.isRequired,
	onNamespace: PropTypes.func.isRequired,
	search: PropTypes.object.isRequired,
	setLessonOrder: PropTypes.func.isRequired,
	setLessonOrderDirection: PropTypes.func.isRequired,
	setSearchPhrase: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default HeaderBar;
