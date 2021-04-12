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

import React, { Component, Fragment } from 'react';
import logger from 'debug';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import isArray from '@stdlib/assert/is-array';
import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';
import pluck from '@stdlib/utils/pluck';
import floor from '@stdlib/math/base/special/floor';
import LessonCreator from 'ev/containers/lesson-creator';
import Lesson from './lesson.js';
import EnrolledLesson from './enrolled_lesson.js';
import NoCourseBanner from './no_course_banner.js';
import NoLessonBanner from './no_lesson_banner.js';
import sortLessons from 'utils/sort_lessons.js';
import isOwner from 'utils/is_owner.js';
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
			lg: { i: `cell-${e.title}-${i}`, x: i*4 % 24, y: floor( i / 6 ) * elemH, w: 4, h: elemH },
			md: { i: `cell-${e.title}-${i}`, x: i*4 % 20, y: floor( i / 5 ) * elemH, w: 4, h: elemH },
			sm: { i: `cell-${e.title}-${i}`, x: i*4 % 16, y: floor( i / 4 ) * elemH, w: 4, h: elemH },
			xs: { i: `cell-${e.title}-${i}`, x: i*4 % 12, y: floor( i / 3 ) * elemH, w: 4, h: elemH },
			xxs: { i: `cell-${e.title}-${i}`, x: i*4 % 8, y: floor( i / 2 ) * elemH, w: 4, h: elemH },
			tiny: { i: `cell-${e.title}-${i}`, x: i*4 % 4, y: floor( i / 1 ) * elemH, w: 4, h: elemH }
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
			search: props.search,
			activeElement: null,
			showLessonCreator: false
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

	componentDidMount() {
		debug( 'Component did mount...' );
		const course = this.props.namespace;
		if ( course.title ) {
			debug( 'Fetch lessons...' );
			this.props.getLessons( course.title );
		}
	}

	shouldComponentUpdate( nextProps, nextState ) {
		if (
			nextProps.search.direction !== this.props.search.direction ||
			nextProps.search.type !== this.props.search.type ||
			nextState.filteredLessons !== this.state.filteredLessons ||
			nextState.showLessonCreator !== this.state.showLessonCreator
		) {
			debug( 'Should update page...' );
			return true;
		}
		return false;
	}

	preventOpeningLink = ( event ) => {
		event.preventDefault();
	}

	repositionLessons( idx, direction ) {
		const unfilteredLessons = this.state.unfilteredLessons.slice();
		if ( direction === 'left' ) {
			if ( idx > 0 ) {
				const lesson = unfilteredLessons[ idx ];
				const left = unfilteredLessons[ idx - 1 ];
				const tmp = left.pos;
				left.pos = lesson.pos;
				lesson.pos = tmp;
			}
		}
		else if ( direction === 'right' ) {
			if ( idx < unfilteredLessons.length - 1 ) {
				const lesson = unfilteredLessons[ idx ];
				const right = unfilteredLessons[ idx + 1 ];
				const tmp = right.pos;
				right.pos = lesson.pos;
				lesson.pos = tmp;
			}
		}
		const filteredLessons = searchLessons( unfilteredLessons, this.props.search.phrase );
		sortLessons( filteredLessons, this.props.search );
		const layouts = createLayout( filteredLessons );
		this.setState({
			filteredLessons,
			layouts,
			unfilteredLessons
		}, this.forceUpdate );
		this.props.setLessonOrder({
			id: this.props.namespace._id,
			lessons: unfilteredLessons.map( x => x._id )
		});
	}

	handlePositionChangeFactory = ( idx ) => {
		return ( event ) => {
			let bool = false;
			switch ( event.code ) {
				case 'ArrowLeft':
					bool = true;
					this.repositionLessons( idx, 'left' );
					break;
				case 'ArrowRight':
					bool = true;
					this.repositionLessons( idx, 'right' );
					break;
			}
			if ( bool ) {
				event.preventDefault();
				event.stopPropagation();
			}
		};
	}

	toggleCreator = () => {
		this.props.getTemplateLessons();
		this.setState({ showLessonCreator: !this.state.showLessonCreator });
	}

	handleCreate = () => {
		this.setState({ showLessonCreator: false });
		const course = this.props.namespace;
		if ( course.title ) {
			debug( 'Fetch lessons...' );
			this.props.getLessons( course.title );
		}
	}

	renderLessons() {
		let lessons = this.state.filteredLessons;
		if ( !isOwner( this.props.user, this.props.namespace ) ) {
			return lessons.map( ( e, i ) => {
				return (<div className="lesson-grid-item" key={`cell-${e.title}-${i}`}>
					<EnrolledLesson
						{...lessons[ i ]}
						addNotification={this.props.addNotification}
						user={this.props.user}
					/>
				</div>);
			});
		}
		return (
			lessons.map( ( e, i ) => {
				const lesson = <Lesson
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
					user={this.props.user}
				/>;
				if ( this.props.search.type === 'sequentially' ) {
					return ( <div
						className="lesson-grid-item"
						key={`cell-${e.title}-${i}`}
						tabIndex={0} role="button"
						ref={input => {
							if ( input && this.state.activeElement === e.title ) {
								input.focus();
							}
							return input;
						}}
						onKeyDown={this.handlePositionChangeFactory( i )}
						onFocus={() => {
							this.setState({
								activeElement: e.title
							});
						}}
					>
						{lesson}
					</div> );
				}
				return (
					<div
						className="lesson-grid-item" key={`cell-${e.title}-${i}`}
					>
						{lesson}
					</div>
				);
			})
		);
	}

	render() {
		if ( !this.props.namespace.title ) {
			return <NoCourseBanner user={this.props.user} />;
		}
		let lessons = this.state.filteredLessons;
		if ( isArray( lessons ) ) {
			const templateButton = <OverlayTrigger placement="left" overlay={<Tooltip id="create-from-template-tooltip">{this.props.t('create-from-template')}</Tooltip>}>
				<Button className="create-from-template-button" onClick={this.toggleCreator} >
					<i className="fas fa-plus" />
				</Button>
			</OverlayTrigger>;
			if ( lessons.length === 0 ) {
				return ( <Fragment>
					<NoLessonBanner user={this.props.user} />
					{templateButton}
					{this.state.showLessonCreator ? <LessonCreator
						onHide={this.toggleCreator}
						onCreate={this.handleCreate}
						namespace={this.props.namespace}
					/> : null}
				</Fragment> );
			}
			return (
				<Fragment>
					<div className="lessons-grid-container">
						<ResponsiveReactGridLayout
							layouts={this.state.layouts}
							breakpoints={{ lg: 1800, md: 1550, sm: 1200, xs: 900, xxs: 400, tiny: 0 }}
							cols={{ lg: 24, md: 20, sm: 16, xs: 12, xxs: 8, tiny: 4 }}
							containerPadding={[10, 10]}
							isResizable={false}
							isBounded={true}
							isDraggable={false}
							rowHeight={isOwner( this.props.user, this.props.namespace ) ? 54.5 : 55}
						>
							{this.renderLessons()}
						</ResponsiveReactGridLayout>
						{templateButton}
					</div>
					{this.state.showLessonCreator ? <LessonCreator
						onHide={this.toggleCreator}
						onCreate={this.handleCreate}
						namespace={this.props.namespace}
					/> : null}
				</Fragment>
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
	getTemplateLessons: PropTypes.func.isRequired,
	hideLessonInGallery: PropTypes.func.isRequired,
	namespace: PropTypes.object.isRequired,
	search: PropTypes.object.isRequired,
	setLessonOrder: PropTypes.func.isRequired,
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
