// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Plotly from 'react-plotly.js';
import isArray from '@stdlib/assert/is-array';
import iterMean from '@stdlib/stats/iterators/mean';
import array2iterator from '@stdlib/array/to-iterator';
import formatTime from 'utils/format_time.js';


// MAIN //

class ProgressStats extends Component {
	render() {
		if ( !this.props.selectedNamespace ) {
			return null;
		}
		const lessons = this.props.selectedNamespace.lessons;
		if ( !isArray( lessons ) ) {
			return null;
		}
		const data = this.props.user.lessonData;
		let values = [];
		const names = [];
		const texts = [];
		for ( let i = 0; i < lessons.length; i++ ) {
			const lesson = lessons[ i ];
			if ( data[ lesson._id ] ) {
				values.push( data[ lesson._id ].progress );
				names.push( lesson.title );
				texts.push( `Time spent: ${formatTime( data[ lesson._id ].spentTime )}` );
			}
		}
		const it = array2iterator( values );
		const avg = iterMean( it );
		return (
			<div style={{ padding: '5px', overflow: 'hidden' }}>
				{avg ? <Fragment>
					<label>Average progress: </label><span>{` ${ avg.toFixed( 3 ) }`}</span>
				</Fragment>: null}
				<Plotly
					data={[{
						x: names,
						y: values,
						text: texts,
						type: 'bar',
						marker: {
							color: '#0069d9',
							opacity: 0.6,
							line: {
								color: 'rgb(8,48,107)',
								width: 1.5
							}
						}
					}]}
					config={{
						displayModeBar: false,
						displaylogo: false
					}}
					layout={{
						plot_bgcolor: 'rgba(0,0,0,0.0)',
						paper_bgcolor: 'rgba(0,0,0,0.0)',
						xaxis: {
							title: 'Lesson Name',
							fixedrange: true
						},
						yaxis: {
							title: 'Completed (in percent)',
							fixedrange: true
						},
						autosize: true,
						margin: {
							l: 50,
							r: 50,
							b: 50,
							t: 50
						}
					}}
					useResizeHandler={true}
					style={{
						width: '100%',
						height: '17vw'
					}}
				/>
			</div>
		);
	}
}


// PROPERTIES //

ProgressStats.propTypes = {
	selectedNamespace: PropTypes.object,
	user: PropTypes.object.isRequired
};

ProgressStats.defaultProps = {
	selectedNamespace: null
};


// EXPORTS //

export default ProgressStats;
