// MODULES //

import React, { Component } from 'react';
import {
	Button, ButtonGroup, ButtonToolbar, FormGroup, Glyphicon,
	ControlLabel, Jumbotron, Label, Modal, Panel
} from 'react-bootstrap';
import { Responsive, WidthProvider } from 'react-grid-layout';
import isArray from '@stdlib/assert/is-array';
import pluck from '@stdlib/utils/pluck';
import floor from '@stdlib/math/base/special/floor';
import './image.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';


// VARIABLES //

const ResponsiveReactGridLayout = WidthProvider( Responsive );


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

		this.toggleLessonVisibility = () => {
			console.log( this.props );
			const query = {
				lessonName: this.props.title,
				namespaceName: this.props.namespace,
				token: this.props.token
			};
			if ( this.props.public ) {
				this.props.hideLessonInGallery( query );
			} else {
				this.props.showLessonInGallery( query );
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
		const activeStyle = this.props.active === true ? 'success' : 'warning';
		const publicStyle = this.props.public === true ? 'success' : 'warning';
		return (
			<div key={this.props.key}>
				<Panel>
					<div className="hovereffect">
						<img
							className="img-responsive"
							src={this.props.url+'/preview.jpg'}
							alt=""
							style={{
								width: 300,
								height: 180
							}}
						/>
						<div className="overlay">
							<h2>{this.props.title}</h2>
							<span
								ref={ ( link ) => this.link = link }
								className="info"
								onClick={() => {
									const win = window.open( this.props.url, '_blank' );
									win.focus();
								}}
							>
								Open Lesson
							</span>
						</div>
					</div>
					<ButtonToolbar>
						<ButtonGroup style={{ marginRight: '5px' }} >
							<Button><Glyphicon glyph="cog" /></Button>
							<Button onClick={this.toggleLessonState}><Glyphicon glyph="off" /></Button>
							<Button onClick={this.toggleLessonVisibility}><Glyphicon glyph="lock" /></Button>
							<Button onClick={this.showDeleteModal} ><Glyphicon glyph="trash" /></Button>
						</ButtonGroup>
						<FormGroup>
							<ControlLabel style={{ marginRight: '2px' }}>
								<Label bsStyle={activeStyle} style={{
									fontSize: '12px'
								}}>{this.props.active ? 'Active' : 'Inactive'}</Label>
							</ControlLabel>
							<ControlLabel>
								<Label bsStyle={publicStyle} style={{
									fontSize: '12px'
								}}>{this.props.public ? 'Public' : 'Private'}</Label>
							</ControlLabel>
						</FormGroup>
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

		this.state = {
			layouts: {}
		};

		props.getLessons( props.namespace.title );
	}

	componentWillReceiveProps( nextProps ) {
		if (
			nextProps.namespace.title !== this.props.namespace.title
		) {
			this.props.getLessons( nextProps.namespace.title );
		}
		if (
			nextProps.namespace.lessons !== this.props.namespace.lessons
		) {
			let lessons = nextProps.namespace.lessons;
			lessons = lessons.map( ( elem, i ) =>
				<Lesson
					{...elem}
					key={i}
					deleteLesson={nextProps.deleteLesson}
					token={nextProps.user.token}
					deactivateLesson={nextProps.deactivateLesson}
					activateLesson={nextProps.activateLesson}
					showLessonInGallery={nextProps.showLessonInGallery}
					hideLessonInGallery={nextProps.hideLessonInGallery}
				/>
			);
			let layouts = lessons.map( ( e, i ) => {
				return {
					lg: { i: `cell-${i}`, x: i*4 % 16, y: floor( i / 4 ) * 4, w: 4, h: 4 },
					md: { i: `cell-${i}`, x: i*4 % 12, y: floor( i / 2 ) * 4, w: 4, h: 4 },
					sm: { i: `cell-${i}`, x: i*4 % 8, y: floor( i / 2 ) * 4, w: 4, h: 4 },
					xs: { i: `cell-${i}`, x: i*4 % 8, y: floor( i / 2 ) * 4, w: 4, h: 4 },
					xxs: { i: `cell-${i}`, x: i*4 % 8, y: floor( i / 2 ) * 4, w: 4, h: 4 }
				};
			});
			layouts = {
				lg: pluck( layouts, 'lg' ),
				md: pluck( layouts, 'md' ),
				sm: pluck( layouts, 'sm' ),
				xs: pluck( layouts, 'xs' ),
				xxs: pluck( layouts, 'xxs' )
			};
			this.state = {
				layouts
			};
		}
	}

	preventOpeningLink = ( event ) => {
		event.preventDefault();
	};

	render() {
		let { lessons } = this.props.namespace;
		if ( isArray( lessons ) ) {
			if ( lessons.length === 0 ) {
				return <Jumbotron style={{ position: 'relative', top: 70, textAlign: 'left', paddingLeft: 20 }}>
					<h1>No Lessons Found</h1>
					<p>The selected course does not contain any lessons. You can upload lessons from the ISLE editor.</p>
				</Jumbotron>;
			}
			return (
				<ResponsiveReactGridLayout
					layouts={this.state.layouts}
					breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
					cols={{lg: 16, md: 12, sm: 8, xs: 8, xxs: 8 }}
					isResizable={false}
					rowHeight={60}
					style={{
						position: 'relative',
						top: 70
					}}
				>
					{lessons.map( ( e, i ) => {
						return <div key={`cell-${i}`}>
							<Lesson
								{...lessons[ i ]}
								deleteLesson={this.props.deleteLesson}
								token={this.props.user.token}
								deactivateLesson={this.props.deactivateLesson}
								activateLesson={this.props.activateLesson}
								showLessonInGallery={this.props.showLessonInGallery}
								hideLessonInGallery={this.props.hideLessonInGallery}
							/>
						</div>;
					})}
				</ResponsiveReactGridLayout>
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
