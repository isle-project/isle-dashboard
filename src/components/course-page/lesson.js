// MODULES //

import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import PropTypes from 'prop-types';
import COLORS from './../../constants/colors';


// MAIN //

class Lesson extends Component {
	constructor( props ) {
		super( props );
	}

	render() {
		return (
			<Panel id={this.props.key}>
				<Panel.Body style={{ padding: 0 }}>
					<div className="hovereffect">
						<img
							className="img-responsive"
							src={this.props.url+'/preview.jpg'}
							alt=""
							style={{
								width: '100%',
								height: 180,
								background: COLORS[ this.props.colorIndex ]
							}}
						/>
						<div className="overlay" >
							<h2>{this.props.title}</h2>
							<h3>{this.props.description}</h3>
							<span
								ref={( link ) => {
									this.link = link;
								}}
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
				</Panel.Body>
			</Panel>
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
