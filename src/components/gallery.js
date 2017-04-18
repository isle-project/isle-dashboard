// MODULES //

import React, { Component } from 'react';
import {
	ButtonToolbar, ButtonGroup, Button,
	ControlLabel, FormControl, FormGroup,
	Grid, Row, Col, Jumbotron, Modal, Panel
} from 'react-bootstrap';
import chunkify from 'compute-chunkify';
import isArray from '@stdlib/utils/is-array';
import './image.css';


// COMPONENTS //

class ImportModal extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			selected: isArray( props.userNamespaces ) ?
				props.userNamespaces[ 0 ].title :
				null,
			targetName: null
		};

		this.handleChange = ( event ) => {
			const target = event.target;
			const value = target.value;
			const name = target.name;
			this.setState({
				[ name ]: value
			});
		};

		this.handleImport = () => {
			this.props.copyLesson({
				sourceName: this.props.title,
				source: this.props.namespace,
				target: this.state.selected,
				targetName: this.state.targetName,
				token: this.props.token
			});
			this.props.close();
		};
	}

	render () {
		return (
			<Modal show={this.props.show} onHide={this.props.close}>
				<Modal.Header>
					<Modal.Title>Import lesson <span style={{ color: 'darkred' }}>{this.props.namespace}: {this.props.title}</span></Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Please select the course that the lesson should be copied into.
					<br />
					<FormGroup>
						<ControlLabel>Select Course</ControlLabel>
						<FormControl
							name="selected"
							componentClass="select"
							placeholder="select"
							onChange={this.handleChange}
						>
							{this.props.userNamespaces.map( ns => <option value={ns.title}>{ns.title}</option> )}
						</FormControl>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Lesson Name</ControlLabel>
						<FormControl
							name="targetName"
							type="text"
							placeholder={this.props.title}
							onChange={this.handleChange}
						/>
					</FormGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.close}>Cancel</Button>
					<Button bsStyle="primary" onClick={this.handleImport} >Import</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}


// MAIN //

class Lesson extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			showImportModal: false
		};

		this.showImportModal = () => {
			this.setState({ showImportModal: true });
		};

		this.closeImportModal = () => {
			this.setState({ showImportModal: false });
		};
	}

	render() {
		return (
			<div>
				<Panel>
					<div className="hovereffect">
						<img
							className="img-responsive"
							src={this.props.url+'/preview.jpg'}
							alt=""
							style={{
								width: 350,
								height: 200
							}}
						/>
						<div className="overlay">
							<h2>{this.props.namespace}: {this.props.title}</h2>
							<a className="info" href={this.props.url} target="_blank" >Open Lesson</a>
						</div>
					</div>
					<ButtonToolbar>
						<ButtonGroup>
							<Button onClick={this.showImportModal}>Import</Button>
						</ButtonGroup>
					</ButtonToolbar>
				</Panel>
				<ImportModal
					{...this.props}
					show={this.state.showImportModal}
					close={this.closeImportModal}
					userNamespaces={this.props.userNamespaces}
					token={this.props.token}
					copyLesson={this.props.copyLesson}
				/>
			</div>
		);
	}
}


// COMPONENTS //

class Gallery extends Component {

	constructor( props ) {
		super( props );
		props.findPublicLessons();
	}

	render() {
		const { lessons } = this.props.gallery;
		if ( !isArray( lessons ) || lessons.length === 0 ) {
			return <Jumbotron style={{ position: 'relative', top: 70, textAlign: 'left', paddingLeft: 20 }}>
				<h1>No Lessons Found</h1>
			</Jumbotron>;
		}
		let chunks = chunkify( lessons, 4 );
		for ( let i = 0; i < chunks.length; i++ ) {
			let chunk = chunks[ i ];
			for ( let j = 0; j < chunk.length; j++ ) {
				if ( chunk[ j ]) {
					chunk[ j ] = <Col key={`cell${i}${j}`} xs={6} md={3}>
						<Lesson
							userNamespaces={this.props.user.namespaces}
							token={this.props.user.token}
							copyLesson={this.props.copyLesson}
							{...chunk[ j ]}
						/>
					</Col>;
				} else {
					chunk[ j ] = null;
				}
			}
		}
		return (
			<div style={{
				background: 'gainsboro',
				width: '100%',
				height: 'auto',
				minHeight: '100%',
				position: 'relative',
				paddingBottom: '10%'
			}}>
				<Grid style={{ position: 'relative', top: 70 }} >
					{chunks.map( ( chunk, id ) => {
						return (
							<Row key={`row${id}`} >
								{chunk}
							</Row>
						);
					})}
				</Grid>
			</div>
		);
	}
}


// EXPORTS //

export default Gallery;
