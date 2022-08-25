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

import hasOwnProp from '@stdlib/assert/has-own-property';
import isString from '@stdlib/assert/is-string';
import isWhitespace from '@stdlib/assert/is-whitespace';
import copy from '@stdlib/utils/copy';
import isObject from '@stdlib/assert/is-object';
import objectKeys from '@stdlib/utils/keys';
import mapValues from '@stdlib/utils/map-values';
import * as types from 'constants/action_types.js';


// FUNCTIONS //

function titleCompare( a, b ) {
	return ( '' + a.title ).localeCompare( b.title );
}


// VARIABLES //

const initialState = {
	_id: null,
	title: '',
	description: '',
	owners: '',
	enableTicketing: false,
	announcements: [],
	lessons: [],
	cohorts: [],
	files: [],
	ownerFiles: [],
	lessonTags: [ '_default_tag' ],
	componentTags: [ '_default_tag' ],
	tickets: [],
	assessments: [],
	componentsByLesson: {}
};


// EXPORTS //

export default function namespace( state = initialState, action ) {
	switch ( action.type ) {
	case types.CHANGED_NAMESPACE: {
		const tags = new Set();
		const assessments = action.payload.assessments;
		for ( let i = 0; i < assessments.length; i++ ) {
			const { tagWeights } = assessments[ i ];
			for ( const tag in tagWeights ) {
				if ( hasOwnProp( tagWeights, tag ) ) {
					tags.add( tag );
				}
			}
		}
		return Object.assign({}, state, {
			_id: action.payload._id,
			title: action.payload.title,
			description: action.payload.description,
			announcements: action.payload.announcements,
			enableTicketing: action.payload.enableTicketing,
			owners: action.payload.owners,
			cohorts: action.payload.cohorts,
			assessments: assessments,
			lessonTags: Array.from( tags )
		});
	}
	case types.DELETED_CURRENT_NAMESPACE: {
		return initialState;
	}
	case types.UPDATED_STUDENT_PROGRESS: {
		const { cohort, email, lessonID, progress } = action.payload;
		const cohorts = state.cohorts;
		for ( let i = 0; i < cohorts.length; i++ ) {
			if ( cohorts[ i ].title === cohort ) {
				const members = cohorts[ i ].members;
				for ( let j = 0; j < members.length; j++ ) {
					if ( members[ j ].email === email ) {
						const member = members[ j ];
						member.lessonData[ lessonID ].progress = progress / 100;
						break;
					}
				}
				break;
			}
		}
		return Object.assign({}, state, { cohorts });
	}
	case types.RETRIEVED_LESSONS: {
		if ( action.payload.namespaceName === state.title ) {
			const lessons = action.payload.lessons;
			const tags = new Set( state.lessonTags );
			lessons.forEach( lesson => {
				if ( isString( lesson.tag ) && !isWhitespace( lesson.tag ) && lesson.tag !== '_default_tag' ) {
					tags.add( lesson.tag );
				}
			});
			return Object.assign({}, state, {
				lessons,
				lessonTags: Array.from( tags )
			});
		}
		return state;
	}
	case types.RETRIEVED_COHORTS: {
		const newCohorts = action.payload.cohorts;
		const lastUpdatedAsDate = ( assessment ) => {
			const date = new Date( assessment.lastUpdated );
			assessment.lastUpdated = date;
			return assessment;
		};
		for ( let i = 0; i < newCohorts.length; i++ ) {
			const cohort = newCohorts[ i ];
			for ( let j = 0; j < cohort.members.length; j++ ) {
				const member = cohort.members[ j ];
				member.assessments = mapValues( member.assessments || {}, lastUpdatedAsDate );
			}
		}
		return Object.assign({}, state, {
			cohorts: newCohorts.sort( titleCompare )
		});
	}
	case types.DELETED_LESSON: {
		let lessons = state.lessons.slice();
		lessons = lessons.filter( x => x.title !== action.payload.lessonName );
		return Object.assign({}, state, {
			lessons
		});
	}
	case types.UPDATED_LESSON: {
		let lessons = state.lessons.slice();
		const { props, lessonName } = action.payload;
		for ( let i = 0; i < lessons.length; i++ ) {
			if ( lessons[ i ].title === lessonName ) {
				for ( let key in props ) {
					if ( hasOwnProp( props, key ) ) {
						lessons[ i ][ key ] = props[ key ];
					}
				}
				break;
			}
		}
		const lessonTags = state.lessonTags.slice();
		if ( props.tag && !isWhitespace( props.tag ) && props.tag !== '_default_tag' ) {
			if ( !state.lessonTags.includes( props.tag ) ) {
				lessonTags.push( props.tag );
			}
		}
		return Object.assign({}, state, {
			lessons,
			lessonTags
		});
	}
	case types.RECEIVED_NAMESPACE_FILES: {
		let lessons = state.lessons;
		let files = action.payload.files;
		files = files.map( file => {
			file.updatedAt = new Date( file.updatedAt );
			for ( let i = 0; i < lessons.length; i++ ) {
				if ( lessons[ i ]._id === file.lesson ) {
					file.lesson = lessons[ i ];
					break;
				}
			}
			return file;
		});
		const newState = {};
		if ( action.payload.owner ) {
			newState.ownerFiles = files;
		} else {
			newState.files = files;
		}
		return Object.assign({}, state, newState );
	}
	case types.EDITED_ANNOUNCEMENT: {
		const announcements = state.announcements.slice();
		for (let i = 0; i < announcements.length; i++) {
			if (announcements[i].createdAt === action.payload.announcement.createdAt) {
				announcements[i] = action.payload.announcement;
			}
		}
		return Object.assign({}, state, {
			announcements: announcements
		});
	}
	case types.CREATED_ANNOUNCEMENT: {
		const announcements = state.announcements.slice();
		announcements.unshift(action.payload.announcement);
		return Object.assign({}, state, {
			announcements: announcements
		});
	}
	case types.DELETED_ANNOUNCEMENT: {
		const announcements = state.announcements.slice();
		announcements.splice(action.payload.index, 1);

		return Object.assign({}, state, {
			announcements: announcements
		});
	}
	case types.GET_COURSE_TICKETS: {
		let tickets = action.payload.tickets;
		tickets = tickets.map( x => {
			x.createdAt = new Date( x.createdAt );
			return x;
		});
		return Object.assign({}, state, {
			tickets
		});
	}
	case types.TICKET_OPENED: {
		const tickets = state.tickets.map( ticket => {
			if ( ticket._id === action.payload.id ) {
				ticket.done = false;
			}
			return ticket;
		});
		return Object.assign({}, state, {
			tickets
		});
	}
	case types.TICKET_CLOSED: {
		const tickets = state.tickets.map( ticket => {
			if ( ticket._id === action.payload.id ) {
				ticket.done = true;
			}
			return ticket;
		});
		return Object.assign({}, state, {
			tickets
		});
	}
	case types.TICKET_PRIORITY_UPDATED: {
		const tickets = state.tickets.map( ticket => {
			if ( ticket._id === action.payload.id ) {
				ticket.priority = action.payload.priority;
			}
			return ticket;
		});
		return Object.assign({}, state, {
			tickets
		});
	}
	case types.TICKET_MESSAGE_ADDED: {
		const tickets = state.tickets.map( ticket => {
			if ( ticket._id === action.payload.id ) {
				const message = action.payload.message;
				message.picture = message.picture.substring( message.picture.lastIndexOf( '/' )+1 );
				ticket.messages.unshift( message );
			}
			return ticket;
		});
		return Object.assign({}, state, {
			tickets
		});
	}
	case types.LOGGED_OUT: {
		return initialState;
	}
	case types.UPDATED_METRIC: {
		console.log( 'UPDATED_METRIC IN CURRENT NS', action.payload );
		if ( action.payload.level !== 'namespace' || action.payload.id !== state._id ) {
			return state;
		}
		console.log( 'Need to update...' );
		const assessments = state.assessments.slice();
		const metric = action.payload.metric;
		for ( let i = 0; i < assessments.length; i++ ) {
			if ( assessments[ i ].name === metric.name ) {
				assessments[ i ] = metric;
				break;
			}
		}
		let newLessonTags;
		if ( isObject( metric.tagWeights ) ) {
			newLessonTags = new Set( state.lessonTags );
			const tags = objectKeys( metric.tagWeights );
			for ( let i = 0; i < tags.length; i++ ) {
				if ( newLessonTags.has( tags[ i ] ) ) {
					newLessonTags.add( tags[ i ] );
				}
			}
			newLessonTags = Array.from( newLessonTags );
		}
		return Object.assign({}, state, {
			assessments,
			...(newLessonTags && { lessonTags: newLessonTags })
		});
	}
	case types.CREATED_METRIC: {
		if ( action.payload.level !== 'namespace' || action.payload.id !== state._id ) {
			return state;
		}
		const assessments = state.assessments.slice();
		const metric = action.payload.metric;
		let newLessonTags;
		if ( isObject( metric.tagWeights ) ) {
			newLessonTags = new Set( state.lessonTags );
			const tags = objectKeys( metric.tagWeights );
			for ( let i = 0; i < tags.length; i++ ) {
				if ( newLessonTags.has( tags[ i ] ) ) {
					newLessonTags.add( tags[ i ] );
				}
			}
			newLessonTags = Array.from( newLessonTags );
		}
		assessments.push( metric );
		return Object.assign({}, state, {
			assessments,
			...(newLessonTags && { lessonTags: newLessonTags })
		});
	}
	case types.DELETED_METRIC: {
		if ( action.payload.level !== 'namespace' || action.payload.id !== state._id ) {
			return state;
		}
		const newAssessments = [];
		for ( let i = 0; i < state.assessments.length; i++ ) {
			if ( state.assessments[ i ].name !== action.payload.name ) {
				newAssessments.push( state.assessments[ i ] );
			}
		}
		const metricKey = `${action.payload.level}-${action.payload.id}-${action.payload.name}`;
		const newCohorts = copy( state.cohorts );
		for ( let i = 0; i < newCohorts.length; i++ ) {
			for ( let j = 0; j < newCohorts[ i ].members.length; j++ ) {
				const user = newCohorts[ i ].members[ j ];
				delete user.assessments[ metricKey ];
			}
		}
		return Object.assign({}, state, {
			assessments: newAssessments,
			cohorts: newCohorts
		});
	}
	case types.COMPUTED_ASSESSMENTS: {
		const { assessments, entityIds, lastUpdated, metrics } = action.payload;
		const newCohorts = copy( state.cohorts );
		for ( let i = 0; i < newCohorts.length; i++ ) {
			for ( let j = 0; j < newCohorts[ i ].members.length; j++ ) {
				const user = newCohorts[ i ].members[ j ];
				for ( let k = 0; k < entityIds.length; k++ ) {
					const id = entityIds[ k ];
					const metric = metrics[ k ];
					if ( assessments[ k ][ user._id ] !== void 0 ) {
						user.assessments = {
							...user.assessments,
							[`${metric.level}-${id}-${metric.name}`]: {
								metricName: metric.name,
								instance: assessments[ k ][ user._id ],
								lastUpdated: new Date( lastUpdated )
							}
						};
					}
				}
			}
		}
		return Object.assign({}, state, {
			cohorts: newCohorts
		});
	}
	case types.SAVED_LESSON_METRICS: {
		const { lessons, metricName } = action.payload;
		const updatedLessons = [...lessons.changed, ...lessons.created, ...lessons.deleted ];

		let newCohorts = state.cohorts;
		if ( lessons.deleted.length > 0 ) {
			newCohorts = copy( state.cohorts );
			for ( let i = 0; i < newCohorts.length; i++ ) {
				for ( let j = 0; j < newCohorts[ i ].members.length; j++ ) {
					const user = newCohorts[ i ].members[ j ];
					user.assessments = {...user.assessments };
					for ( let k = 0; k < lessons.deleted.length; k++ ) {
						const lesson = lessons.deleted[ k ];
						const metricKey = `lesson-${lesson._id}-${metricName}`;
						delete user.assessments[ metricKey ];
					}
				}
			}
		}
		const idsToLessons = {};
		updatedLessons.forEach( lesson => {
			idsToLessons[ lesson._id ] = lesson;
		});
		const newLessons = state.lessons.map( lesson => {
			if ( idsToLessons[ lesson._id ] !== void 0 ) {
				return idsToLessons[ lesson._id ];
			}
			return lesson;
		});
		return Object.assign({}, state, {
			lessons: newLessons,
			cohorts: newCohorts
		});
	}
	case types.GET_ASSESSMENT_TAGS: {
		const { assessmentTags } = action.payload;
		console.log( 'Received assessment tags', assessmentTags );
		return Object.assign({}, state, {
			componentTags: assessmentTags
		});
	}
	case types.GET_ASSESSMENT_COMPONENTS: {
		const { componentsByLesson } = action.payload;
		console.log( 'Received assessment components', componentsByLesson );
		return Object.assign({}, state, {
			componentsByLesson
		});
	}
	default:
		return state;
	}
}
