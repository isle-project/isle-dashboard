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
		if (!this.props.cohorts) {
			this.props.fetchCohorts(this.props.user.token);
		}
	}


	createLayout( courses ) {
		const elemH = 3.72;
		let layouts = courses.map( ( e, i ) => {
			return {
				lg: { i: `cell-${i}`, x: i*6 % 24, y: floor( i / 4 ) * elemH, w: 6, h: elemH },
				md: { i: `cell-${i}`, x: i*6 % 18, y: floor( i / 3 ) * elemH, w: 6, h: elemH },
				sm: { i: `cell-${i}`, x: i*6 % 12, y: floor( i / 2 ) * elemH, w: 6, h: elemH },
				xs: { i: `cell-${i}`, x: i*6 % 6, y: floor( i / 1 ) * elemH, w: 6, h: elemH }
			};
		});
		layouts = {
			lg: pluck( layouts, 'lg' ),
			md: pluck( layouts, 'md' ),
			sm: pluck( layouts, 'sm' ),
			xs: pluck( layouts, 'xs' )
		};
		return layouts;
	}

	checkEnrollable(namespaceTitle) {
		let user = this.props.user;
		for (let i = 0; i < user.enrolledNamespaces.length; i++) {
			if (user.enrolledNamespaces[i].title === namespaceTitle) {
				return false;
			}
		}
		return true;
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
			let {description, owners } = courses[ title ][0].namespace;

			console.log('transfered course');
			console.log( courses[ title ][0].namespace);

			list[i] = <div className="enroll-page-course" key={`cell-${i}`}>
					<Course
						addUserToCohort={this.props.addUserToCohort}
						enrollable={this.checkEnrollable(title)}
						namespace={courses[ title ][0].namespace}
						user={this.props.user}
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
				breakpoints={{ lg: 1800, md: 1550, sm: 900, xs: 500 }}
				cols={{ lg: 24, md: 18, sm: 12, xs: 6 }}
				isResizable={false}
				isDraggable={false}
				rowHeight={60}
			>
				{list}
			</ResponsiveReactGridLayout>
		);
	}


	render() {
		return (
			<div className="enroll-page">
				<img className="enroll-page-background" src="https://isle.heinz.cmu.edu/pexels-photo-574283_1546971725423.jpeg" />
				<div className="enroll-page-content">
					{ this.renderCourses() }
				</div>
			</div>
		);
	}
}


// PROPERTIES //

EnrollPage.propTypes = {
	addUserToCohort: PropTypes.func.isRequired,
	cohorts: PropTypes.array.isRequired,
	fetchCohorts: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default EnrollPage;
