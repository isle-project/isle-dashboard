// MODULES //

import React, { Component } from 'react';
import { Glyphicon, Jumbotron } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import isArray from '@stdlib/assert/is-array';
import pluck from '@stdlib/utils/pluck';
import floor from '@stdlib/math/base/special/floor';
import Lesson from './lesson.js';
import './../image.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';


// VARIABLES //

const ResponsiveReactGridLayout = WidthProvider( Responsive );


// MAIN //

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
				(<Lesson
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
				/>)
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
			this.setState({
				layouts
			});
		}
	}

	preventOpeningLink = ( event ) => {
		event.preventDefault();
	};

	render() {
		let { lessons } = this.props.namespace;
		if ( isArray( lessons ) ) {
			if ( lessons.length === 0 ) {
				return (<Jumbotron style={{ position: 'relative', top: 70, textAlign: 'left', paddingLeft: 20 }}>
					<h1>No Lessons Found</h1>
					<p>The selected course does not contain any lessons. You can upload lessons from the ISLE editor.</p>
			</Jumbotron>);
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
							return (<div key={`cell-${i}`}>
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
						</div>);
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


// PROPERTY TYPES //

LessonsPage.propTypes = {
	activateLesson: PropTypes.func.isRequired,
	deactivateLesson: PropTypes.func.isRequired,
	deleteLesson: PropTypes.func.isRequired,
	getLessons: PropTypes.func.isRequired,
	hideLessonInGallery: PropTypes.func.isRequired,
	namespace: PropTypes.object.isRequired,
	showLessonInGallery: PropTypes.func.isRequired,
	updateLesson: PropTypes.func.isRequired,
	url: PropTypes.string.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default LessonsPage;
