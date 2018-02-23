// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Jumbotron } from 'react-bootstrap';
import { Responsive, WidthProvider } from 'react-grid-layout';
import request from 'request';
import isEmptyArray from '@stdlib/assert/is-empty-array';
import isJSON from '@stdlib/assert/is-json';
import pluck from '@stdlib/utils/pluck';
import floor from '@stdlib/math/base/special/floor';
import Lesson from './lesson.js';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import SERVER from './../../constants/server';


// VARIABLES //

const ResponsiveReactGridLayout = WidthProvider( Responsive );


// MAIN //

class CoursePage extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			lessons: [],
			layouts: {}
		};
	}

	componentDidMount() {
		this.getLessons( this.props.namespace );
	}

	getLessons = ( namespaceName ) => {
		request.get( SERVER+'/get_lessons', {
			qs: {
				namespaceName
			}
		}, ( error, response, body ) => {
			if ( error ) {
				return error;
			}
			if ( isJSON( body ) ) {
				body = JSON.parse( body );
				let lessons = body.lessons;
				lessons = lessons.filter( lesson => {
					return lesson.active;
				});
				lessons = lessons.map( lesson => {
					lesson.url = SERVER+'/'+namespaceName+'/'+lesson.title;
					return lesson;
				});
				const layouts = this.createLayout( lessons );
				this.setState({
					layouts,
					lessons
				});
			}
		});
	}

	createLayout( lessons ) {
		const elemH = 2.8;
		let layouts = lessons.map( ( e, i ) => {
			return {
				lg: { i: `cell-${i}`, x: i*4 % 24, y: floor( i / 6 ) * elemH, w: 4, h: elemH },
				md: { i: `cell-${i}`, x: i*4 % 20, y: floor( i / 5 ) * elemH, w: 4, h: elemH },
				sm: { i: `cell-${i}`, x: i*4 % 16, y: floor( i / 4 ) * elemH, w: 4, h: elemH },
				xs: { i: `cell-${i}`, x: i*4 % 12, y: floor( i / 3 ) * elemH, w: 4, h: elemH },
				xxs: { i: `cell-${i}`, x: i*4 % 8, y: floor( i / 2 ) * elemH, w: 4, h: elemH },
				tiny: { i: `cell-${i}`, x: i*4 % 4, y: floor( i / 1 ) * elemH, w: 4, h: elemH }
			};
		});
		layouts = {
			lg: pluck( layouts, 'lg' ),
			md: pluck( layouts, 'md' ),
			sm: pluck( layouts, 'sm' ),
			xs: pluck( layouts, 'xs' ),
			xxs: pluck( layouts, 'xxs' ),
			tiny: pluck( layouts, 'tiny' )

		};
		return layouts;
	}

	render() {
		let { lessons, layouts } = this.state;
		lessons.sort( ( a, b ) => {
			return a.title.localeCompare( b.title );
		});
		if ( !isEmptyArray( lessons ) ) {
			if ( lessons.length === 0 ) {
				return (<Jumbotron style={{ position: 'relative', top: 70, textAlign: 'left', paddingLeft: 20 }}>
					<h1>No Lessons Found</h1>
					<p>The selected course does not contain any lessons. You can upload lessons from the ISLE editor.</p>
				</Jumbotron>);
			}
			return (
				<Fragment>
					<h1 style={{ paddingLeft: '20px' }}>{this.props.namespace}</h1>
					<div style={{
						position: 'relative'
					}}>
						<ResponsiveReactGridLayout
							layouts={layouts}
							breakpoints={{ lg: 1800, md: 1550, sm: 1200, xs: 900, xxs: 400, tiny: 0 }}
							cols={{ lg: 24, md: 20, sm: 16, xs: 12, xxs: 8, tiny: 4 }}
							isResizable={false}
							isDraggable={false}
							rowHeight={60}
						>
							{lessons.map( ( e, i ) => {
								return (<div key={`cell-${i}`}>
									<Lesson
										{...lessons[ i ]}
										colorIndex={i % 20}
										key={i}
									/>
								</div>);
							})}
						</ResponsiveReactGridLayout>
					</div>
				</Fragment>
			);
		}
		return (
			<Jumbotron style={{ position: 'relative', top: 70, textAlign: 'left', paddingLeft: 20 }}>
				<h1>The selected course does not exist</h1>
			</Jumbotron>
		);
	}
}


// PROPERTY TYPES //

CoursePage.propTypes = {
	namespace: PropTypes.object.isRequired,
	search: PropTypes.object.isRequired
};


// EXPORTS //

export default CoursePage;
