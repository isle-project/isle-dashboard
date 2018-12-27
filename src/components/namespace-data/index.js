// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'react-bootstrap';
import logger from 'debug';
import FilesPage from './files_page.js';
import RecentActivityPage from './recent_activity_page.js';
import StatisticsPage from './statistics_page.js';
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

	renderStatisticsPage() {
		return ( <div className="namespace-data-page">
			<h1>Statistics</h1>
		</div> );
	}

	renderPage() {
		switch ( this.state.activePage ) {
			case 1:
				return <RecentActivityPage />;
			case 2:
				return <StatisticsPage />;
			case 4:
				return <FilesPage files={this.state.files} handleUpload={this.handleUpload} />;
		}
	}

	render() {
		const page = this.renderPage();
		return (
			<div className="namespace-data-div">
				<div className="namespace-data-navbar">
					<Nav variant="pills" stacked activeKey={1} onSelect={this.handleSelect}>
						<Nav.Item title="Recent Activity">
							<Nav.Link eventKey={1} >Recent Activity</Nav.Link>
						</Nav.Item>
						<Nav.Item title="Statistics">
							<Nav.Link eventKey={2} >Statistics</Nav.Link>
						</Nav.Item>
						<Nav.Item disabled title="Cohorts">
							<Nav.Link eventKey={3} >Cohorts</Nav.Link>
						</Nav.Item>
						<Nav.Item title="Files">
							<Nav.Link eventKey={4} >Files</Nav.Link>
						</Nav.Item>
						<Nav.Item disabled title="Actions">
							<Nav.Link eventKey={5} >Actions</Nav.Link>
						</Nav.Item>
					</Nav>
				</div>
				{page}
			</div>
		);
	}
}

// PROPERTY TYPES //

NamespaceData.propTypes = {
	getFiles: PropTypes.func.isRequired,
	namespace: PropTypes.object.isRequired,
	uploadFile: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

NamespaceData.defaultProps = {
};


// EXPORTS //

export default NamespaceData;
