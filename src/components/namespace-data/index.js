// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Nav } from 'react-bootstrap';
import logger from 'debug';
import FilesPage from './files_page.js';
import RecentActivityPage from './recent_activity_page.js';
import ProgressPage from './progress_page.js';
import CohortsPage from './cohorts_page.js';
import ActionsPage from './actions_page.js';
import './namespace_data.css';


// VARIABLES //

const debug = logger( 'isle-dashboard:namespace-data' );


// MAIN //

class NamespaceData extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			activePage: 1,
			files: null
		};
	}

	componentDidMount() {
		this.props.getBadges();
	}

	handleUpload = ( event ) => {
		debug( 'Uploading file...' );
		const file = event.target.files[ 0 ];
		const formData = new FormData();
		formData.append( 'file', file );
		formData.append( 'namespaceName', this.props.namespace.title );
		this.props.uploadFile({
			token: this.props.user.token,
			formData: formData
		});
	}

	handleSelect = ( selectedKey ) => {
		selectedKey = Number( selectedKey );
		if ( selectedKey === 4 ) {
			this.props.getFiles({
				namespaceName: this.props.namespace.title,
				token: this.props.user.token
			}, ( err, files ) => {
				const lessons = this.props.namespace.lessons;
				files = files.map( file => {
					file.updatedAt = new Date( file.updatedAt );
					for ( let i = 0; i < lessons.length; i++ ) {
						if ( lessons[ i ]._id === file.lesson ) {
							file.lesson = lessons[ i ];
							break;
						}
					}
					return file;
				});
				this.setState({
					activePage: selectedKey,
					files: files
				});
			});
		} else {
			this.setState({
				activePage: selectedKey
			});
		}
	}

	renderPage() {
		switch ( this.state.activePage ) {
			case 1:
				return <RecentActivityPage />;
			case 2:
				return <ProgressPage addNotification={this.props.addNotification} namespace={this.props.namespace} cohorts={this.props.namespace.cohorts} lessons={this.props.namespace.lessons} />;
			case 3:
				return <CohortsPage badges={this.props.badges} cohorts={this.props.namespace.cohorts} lessons={this.props.namespace.lessons} />;
			case 4:
				return <FilesPage files={this.state.files} handleUpload={this.handleUpload} />;
			case 5:
				return <ActionsPage namespace={this.props.namespace} getNamespaceActions={this.props.getNamespaceActions} user={this.props.user} cohorts={this.props.namespace.cohorts} />;
		}
	}

	render() {
		if ( !this.props.namespace._id ) {
			return ( <div className="namespace-data-div">
				<Alert variant="danger">No namespace selected.</Alert>
			</div> );
		}
		const page = this.renderPage();
		return (
			<div className="namespace-data-div">
				<div className="namespace-data-navbar">
					<Nav variant="pills" activeKey={this.state.activePage} onSelect={this.handleSelect}>
						<Nav.Item>
							<Nav.Link eventKey="1" title="Recent Activity" >Recent Activity</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="2" title="Progress" >Progress</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="3" title="Cohorts" >Cohorts</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="4" title="Files" >Files</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="5" title="Actions" >Actions</Nav.Link>
						</Nav.Item>
					</Nav>
				</div>
				<div className="namespace-data-page-container" style={{ overflowY: 'auto' }}>
					{page}
				</div>
			</div>
		);
	}
}


// PROPERTIES //

NamespaceData.propTypes = {
	addNotification: PropTypes.func.isRequired,
	badges: PropTypes.array.isRequired,
	getBadges: PropTypes.func.isRequired,
	getFiles: PropTypes.func.isRequired,
	getNamespaceActions: PropTypes.func.isRequired,
	namespace: PropTypes.object.isRequired,
	uploadFile: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

NamespaceData.defaultProps = {
};


// EXPORTS //

export default NamespaceData;
