// MODULES //

import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import isArray from '@stdlib/assert/is-array';
import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';
import pluck from '@stdlib/utils/pluck';
import floor from '@stdlib/math/base/special/floor';
import Lesson from './lesson.js';
import './../image.css';
import './gallery.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';


// VARIABLES //

const ResponsiveReactGridLayout = WidthProvider( Responsive );


// MAIN //

class Gallery extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			filteredLessons: [],
			layouts: {}
		};
		props.findPublicLessons();
	}

	componentWillReceiveProps( nextProps ) {
		if (
			nextProps.gallery.lessons !== this.props.gallery.lessons
		) {
			const lessons = nextProps.gallery.lessons || [];
			const filteredLessons = this.searchLessons( lessons, this.props.search.phrase );
			const layouts = this.createLayout( filteredLessons );
			this.setState({
				filteredLessons,
				layouts
			});
		}
		if (
			nextProps.search.phrase !== this.props.search.phrase
		) {
			const lessons = this.props.gallery.lessons || [];
			const filteredLessons = this.searchLessons( lessons, nextProps.search.phrase );
			const layouts = this.createLayout( filteredLessons );
			this.setState({
				filteredLessons,
				layouts
			});
		}
	}

	createLayout( lessons ) {
		const elemH = 3.72;
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

	searchLessons( lessons, phrase ) {
		if ( !phrase ) {
			return lessons;
		}
		const filteredLessons = [];
		if ( isArray( lessons ) ) {
			for ( let i = 0; i < lessons.length; i++ ) {
				if (
					contains( lowercase( lessons[ i ].title ), phrase ) ||
					contains( lowercase( lessons[ i ].namespace ), phrase ) ||
					contains( lowercase( lessons[ i ].description ), phrase )
				) {
					filteredLessons.push( lessons[ i ] );
				}
			}
		}
		return filteredLessons;
	}

	render() {
		let lessons = this.state.filteredLessons;
		if ( !isArray( lessons ) || lessons.length === 0 ) {
			return (<Jumbotron style={{ position: 'relative', top: 70, textAlign: 'left', paddingLeft: 20 }}>
				<h1>No Lessons Found</h1>
				<p>The selected course does not contain any lessons. You can upload lessons from the ISLE editor.</p>
		</Jumbotron>);
		}
		lessons.sort( ( a, b ) => {
			return a.title.localeCompare( b.title );
		});
		return (
			<div className="gallery">
				<ResponsiveReactGridLayout
					layouts={this.state.layouts}
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
								userNamespaces={this.props.user.namespaces}
								token={this.props.user.token}
								copyLesson={this.props.copyLesson}
								key={i}
								colorIndex={i % 20}
							/>
					</div>);
					})}
				</ResponsiveReactGridLayout>
			</div>
		);
	}
}


// PROPERTY TYPES //

Gallery.propTypes = {
	copyLesson: PropTypes.func.isRequired,
	findPublicLessons: PropTypes.func.isRequired,
	gallery: PropTypes.object.isRequired,
	search: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default Gallery;
