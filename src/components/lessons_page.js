// MODULES //

import React, { Component } from 'react';
import {
	Button, ButtonGroup, ButtonToolbar, Glyphicon,
	Grid, Row, Col, ControlLabel, Jumbotron, Label, Modal, Panel
} from 'react-bootstrap';
import chunkify from 'compute-chunkify';
import isArray from '@stdlib/utils/is-array';
import './image.css';


// COMPONENTS //


const DeleteModel = ( props ) =>
	<Modal show={props.show} onHide={props.close}>
		<Modal.Header>
			<Modal.Title>Delete?</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			Are you sure that you want to delete the lesson with the name "{props.title}"?
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={props.close}>Cancel</Button>
			<Button bsStyle="danger" onClick={props.delete} >Delete</Button>
		</Modal.Footer>
	</Modal>;


// MAIN //

class Lesson extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			showDeleteModal: false
		};

		this.showDeleteModal = () => {
			this.setState({ showDeleteModal: true });
		};

		this.closeDeleteModal = () => {
			this.setState({ showDeleteModal: false });
		};

		this.toggleLessonState = () => {
			const query = {
				lessonName: this.props.title,
				namespaceName: this.props.namespace,
				token: this.props.token
			};
			if ( this.props.active ) {
				this.props.deactivateLesson( query );
			} else {
				this.props.activateLesson( query );
			}
		};

		this.delete = () => {
			this.props.deleteLesson({
				lessonName: this.props.title,
				namespaceName: this.props.namespace,
				token: this.props.token
			});
			this.closeDeleteModal();
		};

	}

	render() {
		const labelStyle = this.props.active === true ? 'success' : 'warning';
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
							<h2>{this.props.title}</h2>
							<a className="info" href={this.props.url} target="_blank" >Open Lesson</a>
						</div>
					</div>
					<ButtonToolbar>
						<ButtonGroup>
							<Button><Glyphicon glyph="cog" /></Button>
							<Button onClick={this.toggleLessonState}><Glyphicon glyph="off" /></Button>
							<Button onClick={this.showDeleteModal} ><Glyphicon glyph="trash" /></Button>
						</ButtonGroup>
						<ButtonGroup>
							<ControlLabel>
								<Label bsStyle={labelStyle} style={{
									fontSize: '16px',
									float: 'right'
								}}>{this.props.active ? 'Active' : 'Disabled'}</Label>
							</ControlLabel>
						</ButtonGroup>
					</ButtonToolbar>
					<DeleteModel {...this.props} show={this.state.showDeleteModal} close={this.closeDeleteModal} delete={this.delete} />
				</Panel>
			</div>
		);
	}
}


// COMPONENTS //

class LessonsPage extends Component {

	constructor( props ) {
		super( props );
		props.getLessons( props.namespace.title );
	}

	componentWillReceiveProps( nextProps ) {
		if (
			nextProps.namespace.title !== this.props.namespace.title
		) {
			this.props.getLessons( nextProps.namespace.title );
		}
	}

	render() {
		const { lessons } = this.props.namespace;
		if ( isArray( lessons ) ) {
			if ( lessons.length === 0 ) {
				return <Jumbotron style={{ position: 'relative', top: 70, textAlign: 'left', paddingLeft: 20 }}>
					<h1>No Lessons Found</h1>
					<p>The selected course does not contain any lessons. You can upload lessons from the ISLE editor.</p>
				</Jumbotron>;
			}
			let chunks = chunkify( lessons, 4 );
			for ( let i = 0; i < chunks.length; i++ ) {
				let chunk = chunks[ i ];
				for ( let j = 0; j < chunk.length; j++ ) {
					if ( chunk[ j ]) {
						chunk[ j ] = <Col key={`cell${i}${j}`} xs={6} md={3}>
							<Lesson
								{...chunk[ j ]}
								deleteLesson={this.props.deleteLesson}
								token={this.props.user.token}
								deactivateLesson={this.props.deactivateLesson}
								activateLesson={this.props.activateLesson}
							/>
						</Col>;
					} else {
						chunk[ j ] = null;
					}
				}
			}
			return (
				<Grid style={{ position: 'relative', top: 70 }} >
					{chunks.map( ( chunk, id ) => {
						return (
							<Row key={`row${id}`} >
								{chunk}
							</Row>
						);
					})}
				</Grid>
			);
		}
		return (
			<Jumbotron style={{ position: 'relative', top: 70, textAlign: 'left', paddingLeft: 20 }}>
				<h1>No Course Selected</h1>
				<p>Open an existing course by selecting one from the dropdown menu above at <Glyphicon glyph="align-justify" /> or create a new one under <Glyphicon glyph="pencil" />.</p>
			</Jumbotron>
		);
	}
}


// EXPORTS //

export default LessonsPage;
