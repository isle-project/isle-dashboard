// MODULES //

import React, { Component } from 'react';
import { Jumbotron, Panel } from 'react-bootstrap';
import { Responsive, WidthProvider } from 'react-grid-layout';
import request from 'request';
import isEmptyArray from '@stdlib/assert/is-empty-array';
import isJSON from '@stdlib/assert/is-json';
import pluck from '@stdlib/utils/pluck';
import floor from '@stdlib/math/base/special/floor';
import server from './../constants/server';
import './image.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';


// VARIABLES //

const ResponsiveReactGridLayout = WidthProvider( Responsive );


// COMPONENTS //

class Lesson extends Component {

	render() {
		console.log( this.props );
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
							<h3>{this.props.description}</h3>
							<span
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
				</Panel>
			</div>
		);
	}
}


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
		request.get( server+'/get_lessons', {
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
				console.log( lessons );
				lessons = lessons.filter( lesson => {
					return lesson.active;
				});
				lessons = lessons.map( lesson => {
					lesson.url = server+'/'+namespaceName+'/'+lesson.title;
					return lesson;
				});
				let layouts = lessons.map( ( e, i ) => {
					return {
						lg: { i: `cell-${i}`, x: i*4 % 20, y: floor( i / 5 ) * 4, w: 4, h: 4 },
						md: { i: `cell-${i}`, x: i*4 % 16, y: floor( i / 4 ) * 4, w: 4, h: 4 },
						sm: { i: `cell-${i}`, x: i*4 % 12, y: floor( i / 3 ) * 4, w: 4, h: 4 },
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
				this.setState({
					layouts, lessons
				});
			}
		});
	}

	render() {
		let { lessons, layouts } = this.state;
		if ( !isEmptyArray( lessons ) ) {
			if ( lessons.length === 0 ) {
				return <Jumbotron style={{ position: 'relative', top: 70, textAlign: 'left', paddingLeft: 20 }}>
					<h1>No Lessons Found</h1>
					<p>The selected course does not contain any lessons. You can upload lessons from the ISLE editor.</p>
				</Jumbotron>;
			}
			return (
				<div>
					<h1 style={{ paddingLeft: '20px' }}>{this.props.namespace}</h1>
					<ResponsiveReactGridLayout
						layouts={layouts}
						breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
						cols={{lg: 20, md: 16, sm: 12, xs: 8, xxs: 8 }}
						isResizable={false}
						isDraggable={false}
						rowHeight={60}
					>
						{lessons.map( ( e, i ) => {
							return <div key={`cell-${i}`}>
								<Lesson
									{...lessons[ i ]}
								/>
							</div>;
						})}
					</ResponsiveReactGridLayout>
				</div>
			);
		}
		return (
			<Jumbotron style={{ position: 'relative', top: 70, textAlign: 'left', paddingLeft: 20 }}>
				<h1>The selected course does not exist</h1>
			</Jumbotron>
		);
	}
}


// EXPORTS //

export default CoursePage;
