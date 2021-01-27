/**
* Copyright (C) 2016-present The ISLE Authors
*
* The isle-dashboard program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { withTranslation } from 'react-i18next';
import pluck from '@stdlib/utils/pluck';
import floor from '@stdlib/math/base/special/floor';
import groupBy from '@stdlib/utils/group-by';
import keys from '@stdlib/utils/keys';
import Course from './course.js';
import './enroll-page.css';


// VARIABLES //

const ResponsiveReactGridLayout = WidthProvider( Responsive );


// MAIN //

class EnrollPage extends Component {
	constructor( props ) {
		super( props );
		this.state = {};
	}

	componentDidMount() {
		this.props.fetchCohorts( this.props.user );
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

	checkEnrollable( namespaceTitle ) {
		const user = this.props.user;
		for ( let i = 0; i < user.enrolledNamespaces.length; i++ ) {
			if ( user.enrolledNamespaces[i].title === namespaceTitle ) {
				return false;
			}
		}
		return true;
	}

	renderCourses() {
		let cohorts = this.props.cohorts;
		if ( !cohorts ) {
			return null;
		}
		cohorts = cohorts.filter( x => x.namespace );
		const courses = groupBy( cohorts, function groupCohort( cohort ) {
			return cohort.namespace.title;
		});
		const names = keys( courses );
		const list = new Array( names.length );
		for ( let i = 0; i < names.length; i++ ) {
			const title = names[ i ];
			list[ i ] = <div className="enroll-page-course" key={`cell-${i}`}>
				<Course
					addUserToCohort={this.props.addUserToCohort}
					enrollable={this.checkEnrollable( title )}
					namespace={courses[ title ][0].namespace}
					user={this.props.user}
					cohorts={courses[title]}
					t={this.props.t}
				/>
			</div>;
		}
		const layouts = this.createLayout( names );
		return (
			<ResponsiveReactGridLayout
				margin={[20, 20]}
				containerPadding={[10, 10]}
				layouts={layouts}
				breakpoints={{ lg: 1800, md: 1400, sm: 900, xs: 500 }}
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
				<img className="enroll-page-background" src="img/pexels_background.jpeg" alt="" />
				<div className="enroll-page-content">
					{this.renderCourses()}
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

export default withTranslation( [ 'enroll_page', 'common' ] )( EnrollPage );
