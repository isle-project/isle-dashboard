// MODULES //

import React, { Component } from 'react';
import {
	Button, ButtonGroup, ButtonToolbar, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon,
	Jumbotron, Label, Modal
} from 'react-bootstrap';
import { Responsive, WidthProvider } from 'react-grid-layout';
import isArray from '@stdlib/assert/is-array';
import pluck from '@stdlib/utils/pluck';
import floor from '@stdlib/math/base/special/floor';
import SERVER from './../constants/server';
import COLORS from './../constants/colors';
import './image.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';


// VARIABLES //

const ResponsiveReactGridLayout = WidthProvider( Responsive );


// COMPONENTS //

const DeleteModal = ( props ) =>
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

class DetailsModal extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			title: props.title,
			description: props.description,
			disabled: true
		};
	}

	componentWillReceiveProps( nextProps ) {
		if (
			this.props.title !== nextProps.title ||
			this.props.description !== nextProps.description
		) {
			this.setState({
				title: nextProps.title,
				description: nextProps.description
			});
		}
	}

	handleInputChange = ( event ) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[ name ]: value
		}, () => {
			if ( this.state.title.length >= 3 && this.state.description.length > 0 ) {
				this.setState({
					disabled: false
				});
			} else {
				this.setState({
					disabled: true
				});
			}
		});
	};

	onSubmit = ( evt ) => {
		evt.preventDefault();
		this.props.update({
			newTitle: this.state.title,
			newDescription: this.state.description
		});
	}

	render() {
		return (
			<Modal show={this.props.show} onHide={this.props.close}>
				<Form horizontal action={SERVER} method="get" onSubmit={this.onSubmit}>
					<Modal.Header>
						<Modal.Title>Lesson Details</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={2}>
								Title
							</Col>
							<Col sm={10}>
								<FormControl
									name="title"
									type="title"
									onChange={this.handleInputChange}
									defaultValue={this.state.title}
								/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={2}>
								Description
							</Col>
							<Col sm={10}>
								<FormControl
									name="description"
									type="description"
									onChange={this.handleInputChange}
									defaultValue={this.state.description}
								/>
							</Col>
						</FormGroup>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.props.close}>Cancel</Button>
						<Button
							bsStyle="success"
							type="submit"
							disabled={this.state.disabled}
						>Save</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		);
	}
}


// MAIN //

class Lesson extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			showDeleteModal: false,
			showDetailsModal: false,
			description: props.description
		};

		this.showDeleteModal = () => {
			this.setState({ showDeleteModal: true });
		};

		this.showDetailsModal = () => {
			this.setState({ showDetailsModal: true });
		};

		this.closeDeleteModal = () => {
			this.setState({ showDeleteModal: false });
		};

		this.closeDetailsModal = () => {
			this.setState({ showDetailsModal: false });
		};

		this.handleDescriptionChange = ( evt ) => {
			this.setState({
				description: evt.target.value
			});
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

		this.update = ({ newTitle, newDescription }) => {
			this.props.updateLesson({
				lessonName: this.props.title,
				namespaceName: this.props.namespace,
				token: this.props.token,
				newTitle,
				newDescription
			}, () => {
				this.props.getLessons( this.props.namespace );
			});
			this.closeDetailsModal();
		};
	}

	render() {
		const activeStyle = this.props.active === true ? 'success' : 'warning';
		const publicStyle = this.props.public === true ? 'success' : 'warning';
		return (
			<div key={this.props.key}>
				<div className="panel panel-default" style={{
					background: COLORS[ this.props.colorIndex ]
				}}>
					<div className="panel-body" style={{ padding: 0 }}>
						<div className="hovereffect">
							<img
								className="img-responsive"
								src={this.props.url+'/preview.jpg'}
								alt=""
								style={{
									width: '100%',
									height: 180
								}}
							/>
							<div className="overlay" >
								<h2>{this.props.title}</h2>
								<h3>{this.props.description}</h3>
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
						<ButtonToolbar style={{
							paddingTop: 5,
							paddingLeft: 5,
							paddingRight: 5,
							position: 'absolute',
							top: 180,
							width: '100%',
							height: '50px',
							left: 5,
							background: 'rgba(0, 0, 0, 0.75)',
							border: '1px solid transparent',
							borderRadius: '4px'
						}}>
							<ButtonGroup style={{ marginRight: '5px' }} >
								<Button onClick={this.showDetailsModal}><Glyphicon glyph="cog" /></Button>
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
						<DeleteModal {...this.props} show={this.state.showDeleteModal} close={this.closeDeleteModal} delete={this.delete} />
						<DetailsModal {...this.props} show={this.state.showDetailsModal} close={this.closeDetailsModal} update={this.update} />
					</div>
				</div>
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
					updateLesson={nextProps.updateLesson}
					token={nextProps.user.token}
					deactivateLesson={nextProps.deactivateLesson}
					activateLesson={nextProps.activateLesson}
					showLessonInGallery={nextProps.showLessonInGallery}
					hideLessonInGallery={nextProps.hideLessonInGallery}
					getLessons={nextProps.getLessons}
					colorIndex={i % 20}
				/>
			);
			const elemH = 3.4;
			let layouts = lessons.map( ( e, i ) => {
				return {
					lg: { i: `cell-${i}`, x: i*4 % 16, y: floor( i / 4 ) * elemH, w: 4, h: elemH },
					md: { i: `cell-${i}`, x: i*4 % 12, y: floor( i / 3 ) * elemH, w: 4, h: elemH },
					sm: { i: `cell-${i}`, x: i*4 % 8, y: floor( i / 2 ) * elemH, w: 4, h: elemH },
					xs: { i: `cell-${i}`, x: i*4 % 8, y: floor( i / 2 ) * elemH, w: 4, h: elemH },
					xxs: { i: `cell-${i}`, x: i*4 % 8, y: floor( i / 2 ) * elemH, w: 4, h: elemH }
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
			lessons = lessons.sort( ( a, b ) => {
				return a.title > b.title;
			});
			return (
				<div style={{
					position: 'relative',
					top: 70
				}}>
					<ResponsiveReactGridLayout
						layouts={this.state.layouts}
						breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
						cols={{lg: 16, md: 12, sm: 8, xs: 8, xxs: 8 }}
						isResizable={false}
						rowHeight={60}
					>
						{lessons.map( ( e, i ) => {
							return <div key={`cell-${i}`}>
								<Lesson
									{...lessons[ i ]}
									deleteLesson={this.props.deleteLesson}
									updateLesson={this.props.updateLesson}
									token={this.props.user.token}
									deactivateLesson={this.props.deactivateLesson}
									activateLesson={this.props.activateLesson}
									showLessonInGallery={this.props.showLessonInGallery}
									hideLessonInGallery={this.props.hideLessonInGallery}
									getLessons={this.props.getLessons}
									key={i}
									colorIndex={i % 20}
								/>
							</div>;
						})}
					</ResponsiveReactGridLayout>
				</div>
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
