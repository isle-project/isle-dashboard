// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './enroll-page.css';
import { Responsive, WidthProvider } from 'react-grid-layout';
import pluck from '@stdlib/utils/pluck';
import floor from '@stdlib/math/base/special/floor';
import groupBy from '@stdlib/utils/group-by';
import keys from '@stdlib/utils/keys';
import Course from './course.js';

// VARIABLES //

const ResponsiveReactGridLayout = WidthProvider( Responsive );

// MAIN //

class EnrollPage extends Component {
	constructor( props ) {
		super( props );

		this.state = {
		};
	}

	componentDidMount() {
	}


	createLayout( courses ) {
		const elemH = 3.72;
		let layouts = courses.map( ( e, i ) => {
			return {
				lg: { i: `cell-${i}`, x: i*6 % 24, y: floor( i / 6 ) * elemH, w: 6, h: elemH },
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

	renderCourses() {
		if (!this.props.cohorts) {
			return null;
		}
		let cohorts = this.props.cohorts;
		let courses = groupBy(cohorts, function groupCohort( cohort ) {
			return cohort.namespace.title;
		});

		console.log( courses);

		let names = keys(courses);
		let list = new Array(names.length);
		for (let i = 0; i< names.length; i++) {
			let title= names[i];
			let {description, owners} = courses[ title ][0].namespace;

			list[i] = <div className="enroll-page-course" key={`cell-${i}`}>
					<Course
						title={title}
						owners={owners}
						cohorts={courses[title]}
						description={description} />
				</div>;
		}

		console.log( courses );
		const layouts = this.createLayout(names);

		return (
			<ResponsiveReactGridLayout
				margin={[30, 30]}
				layouts={layouts}
				breakpoints={{ lg: 1800, md: 1550, sm: 1200, xs: 900, xxs: 400, tiny: 0 }}
				cols={{ lg: 24, md: 20, sm: 16, xs: 12, xxs: 8, tiny: 4 }}
				isResizable={false}
				isDraggable={false}
				rowHeight={60}
			>
				{list}
			</ResponsiveReactGridLayout>
		);
	}


	render() {
		console.log( this.props.cohorts);
		return (
			<div className="enroll-page">
				<div className="enroll-page-content">
					{ this.renderCourses() }
				</div>
			</div>
		);
	}
}


// PROPERTIES //

EnrollPage.propTypes = {
	cohorts: PropTypes.array.isRequired
};


// EXPORTS //

export default EnrollPage;
