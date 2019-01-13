// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Plotly from 'react-plotly.js';
import isArray from '@stdlib/assert/is-array';
import round from '@stdlib/math/base/special/round';
import iterMean from '@stdlib/stats/iter/mean';
import iterStdev from '@stdlib/stats/iter/stdev';
import array2iterator from '@stdlib/array/to-iterator';
import formatTime from 'utils/format_time.js';


// MAIN //

class TimeSpentStats extends Component {
	render() {
		if ( !this.props.selectedNamespace ) {
			return null;
		}
		const lessons = this.props.selectedNamespace.lessons;
		if ( !isArray( lessons ) ) {
			return null;
		}
		const data = this.props.user.lessonData;
		let durations = [];
		const names = [];
		const texts = [];
		for ( let i = 0; i < lessons.length; i++ ) {
			const lesson = lessons[ i ];
			if ( data[ lesson._id ] ) {
				durations.push( data[ lesson._id ].spentTime );
				names.push( lesson.title );
				texts.push( `Completed: ${round( data[ lesson._id ].progress*100.0 )}%` );
			}
		}
		let it = array2iterator( durations );
		const avg = iterMean( it );
		it = array2iterator( durations );
		const stdev = iterStdev( it );
		durations = durations.map( d => {
			return d / ( 1000*60 );
		});
		return (
			<div style={{ padding: '5px', overflow: 'hidden' }}>
				<label>Average time spent: </label>
				<span>{` ${formatTime( avg )}`}</span>
				<span>(SD: {stdev.toFixed( 3 )})</span>
				<Plotly
					data={[{
						x: names,
						y: durations,
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
							title: 'Time (in min)',
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

TimeSpentStats.propTypes = {
	selectedNamespace: PropTypes.object,
	user: PropTypes.object.isRequired
};

TimeSpentStats.defaultProps = {
	selectedNamespace: null
};


// EXPORTS //

export default TimeSpentStats;
