// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './../image.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import COLORS from './../../constants/colors';


// MAIN //

class Lesson extends Component {
	render() {
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
									width: 300,
									height: 180
								}}
							/>
							<div
								className="overlay"
							>
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
					</div>
				</div>
			</div>
		);
	}
}


// PROPERTY TYPES //

Lesson.propTypes = {
	colorIndex: PropTypes.number.isRequired,
	description: PropTypes.string.isRequired,
	key: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired
};


// EXPORTS //

export default Lesson;
