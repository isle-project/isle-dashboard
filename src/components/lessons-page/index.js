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
import logger from 'debug';
import { withTranslation } from 'react-i18next';
import { Jumbotron } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import isArray from '@stdlib/assert/is-array';
import isObject from '@stdlib/assert/is-object';
import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';
import pluck from '@stdlib/utils/pluck';
import floor from '@stdlib/math/base/special/floor';
import Lesson from './lesson.js';
import EnrolledLesson from './enrolled_lesson.js';
import sortLessons from 'utils/sort_lessons.js';
import 'css/image.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './lessons.css';


// VARIABLES //

const debug = logger( 'isle-dashboard:lessons-page' );
const ResponsiveReactGridLayout = WidthProvider( Responsive );


// FUNCTIONS //

function searchLessons( lessons, phrase ) {
	if ( !phrase ) {
		return lessons;
	}
	const filteredLessons = [];
	if ( isArray( lessons ) ) {
		for ( let i = 0; i < lessons.length; i++ ) {
			if (
				contains( lowercase( lessons[ i ].title ), phrase ) ||
				contains( lowercase( lessons[ i ].description ), phrase )
			) {
				filteredLessons.push( lessons[ i ] );
			}
		}
	}
	return filteredLessons;
}

function createLayout( lessons ) {
	debug( 'Create layout...' );
	const elemH = 3.52;
	let layouts = lessons.map( ( e, i ) => {
		return {
			lg: { i: `cell-${e.title}`, x: i*4 % 24, y: floor( i / 6 ) * elemH, w: 4, h: elemH },
			md: { i: `cell-${e.title}`, x: i*4 % 20, y: floor( i / 5 ) * elemH, w: 4, h: elemH },
			sm: { i: `cell-${e.title}`, x: i*4 % 16, y: floor( i / 4 ) * elemH, w: 4, h: elemH },
			xs: { i: `cell-${e.title}`, x: i*4 % 12, y: floor( i / 3 ) * elemH, w: 4, h: elemH },
			xxs: { i: `cell-${e.title}`, x: i*4 % 8, y: floor( i / 2 ) * elemH, w: 4, h: elemH },
			tiny: { i: `cell-${e.title}`, x: i*4 % 4, y: floor( i / 1 ) * elemH, w: 4, h: elemH }
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

function isOwner( user, namespace ) {
	let bool = false;
	for ( let i = 0; i < namespace.owners.length; i++ ) {
		const owner = namespace.owners[ i ];
		if ( isObject( owner ) ) {
			if ( owner.email === user.email ) {
				bool = true;
			}
		} else if ( owner === user.id ) {
			// Case: Owners array is not yet populated but contains only string IDs:
			bool = true;
		}
	}
	return bool;
}


// MAIN //

class LessonsPage extends Component {
	constructor( props ) {
		super( props );

		let lessons = props.namespace.lessons;
		if ( !isOwner( props.user, props.namespace ) ) {
			debug( 'Filter out inactive lessons for enrolled students...' );
			lessons = lessons.filter( e => e.active === true );
		}
		this.state = {
			filteredLessons: searchLessons( lessons, props.search.phrase ),
			layouts: createLayout( lessons ),
			unfilteredLessons: lessons,
			search: props.search
		};
	}

	static getDerivedStateFromProps( nextProps, prevState ) {
		if (
			nextProps.namespace.lessons !== prevState.unfilteredLessons ||
			nextProps.search.phrase !== prevState.search.phrase ||
			nextProps.search.direction !== prevState.search.direction ||
			nextProps.search.type !== prevState.search.type
		) {
			debug( 'Get derived state...' );
			let lessons = nextProps.namespace.lessons || [];
			if ( !isOwner( nextProps.user, nextProps.namespace ) ) {
				debug( 'Filter out inactive lessons for enrolled students...' );
				lessons = lessons.filter( e => e.active === true );
			}
			const filteredLessons = searchLessons( lessons, nextProps.search.phrase );
			sortLessons( filteredLessons, nextProps.search );
			const layouts = createLayout( filteredLessons );
			return {
				filteredLessons,
				layouts,
				unfilteredLessons: nextProps.namespace.lessons,
				search: nextProps.search
			};
		}
		return null;
	}

	shouldComponentUpdate( nextProps, nextState ) {
		if (
			nextProps.search.direction !== this.props.search.direction ||
			nextProps.search.type !== this.props.search.type ||
			nextState.filteredLessons !== this.state.filteredLessons
		) {
			debug( 'Should update page...' );
			return true;
		}
		return false;
	}

	preventOpeningLink = ( event ) => {
		event.preventDefault();
	};

	renderLessons() {
		let lessons = this.state.filteredLessons;
		if ( !isOwner( this.props.user, this.props.namespace ) ) {
			return lessons.map( ( e, i ) => {
				return (<div className="lesson-grid-item" key={`cell-${e.title}`}>
					<EnrolledLesson
						{...lessons[ i ]}
						addNotification={this.props.addNotification}
						user={this.props.user}
						t={this.props.t}
					/>
				</div>);
			});
		}
		return (
			lessons.map( ( e, i ) => {
				return ( <div className="lesson-grid-item" key={`cell-${e.title}`}>
					<Lesson
						{...lessons[ i ]}
						addNotification={this.props.addNotification}
						deleteLesson={this.props.deleteLesson}
						updateLesson={this.props.updateLesson}
						deactivateLesson={this.props.deactivateLesson}
						activateLesson={this.props.activateLesson}
						showLessonInGallery={this.props.showLessonInGallery}
						hideLessonInGallery={this.props.hideLessonInGallery}
						getLessons={this.props.getLessons}
						getIsleFile={this.props.getIsleFile}
						t={this.props.t}
					/>
				</div> );
			})
		);
	}

	render() {
		const { t } = this.props;
		if ( !this.props.namespace.title ) {
			let appendix = null;
			if ( this.props.user.writeAccess ) {
				appendix = <span>{t('create-new-one')}<i className="fa fa-pencil-alt"></i>.</span>;
			} else {
				appendix = ' .';
			}
			return ( <Jumbotron className="lessons-jumbotron" >
				<h1>{t('no-course-selected')}</h1>
				<p>{t('no-course-description')}<i className="fa fa-align-justify"></i>{appendix}
				</p>
			</Jumbotron> );
		}
		let lessons = this.state.filteredLessons;
		if ( isArray( lessons ) ) {
			if ( lessons.length === 0 ) {
				let description = t('no-lessons');
				if ( this.props.user.writeAccess ) {
					description += t('upload-from-editor');
				}
				return ( <Jumbotron className="lessons-jumbotron">
					<h1>{t('no-lessons-found')}</h1>
					<p>{description}</p>
				</Jumbotron> );
			}
			return (
				<div className="lessons-grid-container">
					<ResponsiveReactGridLayout
						layouts={this.state.layouts}
						breakpoints={{ lg: 1800, md: 1550, sm: 1200, xs: 900, xxs: 400, tiny: 0 }}
						cols={{ lg: 24, md: 20, sm: 16, xs: 12, xxs: 8, tiny: 4 }}
						containerPadding={[10, 10]}
						isResizable={false}
						isDraggable={false}
						rowHeight={isOwner( this.props.user, this.props.namespace ) ? 54.5 : 55}
					>
					{this.renderLessons()}
					</ResponsiveReactGridLayout>
				</div>
			);
		}
	}
}


// PROPERTIES //

LessonsPage.propTypes = {
	activateLesson: PropTypes.func.isRequired,
	addNotification: PropTypes.func.isRequired,
	deactivateLesson: PropTypes.func.isRequired,
	deleteLesson: PropTypes.func.isRequired,
	getIsleFile: PropTypes.func.isRequired,
	getLessons: PropTypes.func.isRequired,
	hideLessonInGallery: PropTypes.func.isRequired,
	namespace: PropTypes.object.isRequired,
	search: PropTypes.object.isRequired,
	showLessonInGallery: PropTypes.func.isRequired,
	updateLesson: PropTypes.func.isRequired,
	url: PropTypes.string,
	user: PropTypes.object.isRequired
};

LessonsPage.defaultProps = {
	url: null
};


// EXPORTS //

export default withTranslation( [ 'lessons_page', 'common' ] )( LessonsPage );
