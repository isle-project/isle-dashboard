// MODULES //

import React, { Component } from 'react';
import { Grid, Row, Col, Jumbotron } from 'react-bootstrap';
import PropTypes from 'prop-types';
import chunkify from 'compute-chunkify';
import isArray from '@stdlib/assert/is-array';
import Lesson from './lesson.js';
import './../image.css';
import './gallery.css';


// MAIN //

class Gallery extends Component {
	constructor( props ) {
		super( props );
		props.findPublicLessons();
	}

	render() {
		const { lessons } = this.props.gallery;
		if ( !isArray( lessons ) || lessons.length === 0 ) {
			return ( <Jumbotron style={{ position: 'relative', top: 70, textAlign: 'left', paddingLeft: 20 }}>
				<h1>No Lessons Found</h1>
			</Jumbotron> );
		}
		let chunks = chunkify( lessons, 4 );
		let count = 0;
		for ( let i = 0; i < chunks.length; i++ ) {
			let chunk = chunks[ i ];
			for ( let j = 0; j < chunk.length; j++ ) {
				count += 1;
				if ( chunk[ j ]) {
					chunk[ j ] = <Col key={`cell${i}${j}`} xs={6} md={3}>
						<Lesson
							userNamespaces={this.props.user.namespaces}
							token={this.props.user.token}
							copyLesson={this.props.copyLesson}
							colorIndex={count % 20}
							{...chunk[ j ]}
						/>
					</Col>;
				} else {
					chunk[ j ] = null;
				}
			}
		}
		return (
			<div className="gallery">
				<Grid className="gallery-grid" >
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


// PROPERTY TYPES //

Gallery.propTypes = {
	copyLesson: PropTypes.func.isRequired,
	findPublicLessons: PropTypes.func.isRequired,
	gallery: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default Gallery;
