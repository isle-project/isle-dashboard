// MODULES //

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
	Button, FormGroup, FormControl, Image, InputGroup,
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

	goToCreateCoursePage() {
		this.props.history.replace( '/create-namespace' );
		this.setState({
			location: 'Dashboard'
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
				style={{ float: 'left', marginRight: '6px' }}
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
					style={{ float: 'left', marginRight: '6px' }}
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
					style={{ float: 'left', marginRight: '6px' }}
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
						marginRight: '6px',
						marginLeft: '6px'
					}}
				>
					<i className="fa fa-eye"></i>
					<small style={{ marginLeft: '5px' }}>Gallery</small>
				</Button>
			</OverlayTrigger>
		);
	}

	renderCoursesButton() {
		let disabled = true;
		if (this.props.user.ownedNamespaces.length > 0 || this.props.user.enrolledNamespaces.length > 0) {
			disabled = false;
		}
		return ( <OverlayTrigger placement="right" overlay={selectCourseTooltip}>
			<Button
				ref={( button ) => { this.overlayTarget = button; }}
				style={{
					float: 'left',
					marginRight: '6px'
				}}
				onClick={() => {
					this.setState({
						showNamespacesOverlay: !this.state.showNamespacesOverlay
					});
				}}
				variant="secondary"
				disabled={disabled}
			>
				<i className="fa fa-align-justify"></i>
				<small style={{ marginLeft: '5px' }}>
					{this.props.namespace.title || 'Your Courses'}
				</small>
			</Button>
		</OverlayTrigger> );
	}

	renderSearchField() {
		const pth = this.props.history.location.pathname;
		if (
			( !this.props.namespace.title && pth === '/lessons' ) ||
			( pth !== '/lessons' && pth!== '/gallery' )
		) {
			return null;
		}
		return ( <FormGroup style={{ width: '20vw', float: 'left' }}>
			<InputGroup>
				<FormControl
					style={{
						background: 'white',
						color: '#2a3e54'
					}}
					type="text"
					placeholder="Search"
					onChange={this.handleTextChange}
				/>
					<InputGroup.Append>
						<Button disabled style={{ cursor: 'auto' }}>
							<i className="fa fa-search"></i>
						</Button>
					</InputGroup.Append>
			</InputGroup>
		</FormGroup> );
	}

	renderHelp() {
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
						placement="bottom"
					>
						<Popover id="popover-positioned-bottom">
							{ this.props.user.ownedNamespaces.length > 0 ? <Fragment>
								<label className="label-display">OWNED COURSES</label>
								{namespaceListGroup( this.props.user.ownedNamespaces, this.ownedClickFactory )}
								<div className="separator" />
								</Fragment> : null}
							<label className="label-display">ENROLLED COURSES</label>
							{namespaceListGroup( this.props.user.enrolledNamespaces, this.enrolledClickFactory )}
						</Popover>
					</Overlay>
					{this.renderEditButton()}
					{this.renderDataButton()}
					{this.renderCreateButton()}
					{this.renderSearchField()}
				</div>
				<div className="header-bar-right-container">
					{this.renderHelp()}
					<div className="header-bar-container">
						<Image src={profilePic} className="header-bar-icon"></Image>
						<div key="account" className="header-bar-link-div" >
							<Link to="/profile" onClick={this.setProfileLocation} className="header-bar-link">{this.props.user.name}</Link>
						</div>
					</div>
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


// PROPERTY TYPES //

HeaderBar.propTypes = {
	history: PropTypes.object.isRequired,
	logout: PropTypes.func.isRequired,
	namespace: PropTypes.object.isRequired,
	onEnrolledNamespace: PropTypes.func.isRequired,
	onNamespace: PropTypes.func.isRequired,
	setSearchPhrase: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default HeaderBar;
