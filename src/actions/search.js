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

import { SEARCH_PHRASE_SET, LESSON_ORDER, LESSON_ORDER_DIRECTION } from 'constants/action_types.js';


// EXPORTS //

/**
 * Returns an action object to set the search phrase.
 *
 * @param {string} phrase - search phrase
 * @returns {Object} action object
 */
export function setSearchPhrase( phrase ) {
	return {
		type: SEARCH_PHRASE_SET,
		payload: {
			phrase
		}
	};
}

/**
 * Returns an action object to set the lesson order.
 *
 * @param {string} type - type of order
 * @returns {Object} action object
 */
export function setLessonOrder( type ) {
	return {
		type: LESSON_ORDER,
		payload: {
			type
		}
	};
}

/**
 * Returns an action object to set the lesson order direction.
 *
 * @param {string} direction - direction of order (either `ascending` or `descending`)
 * @returns {Object} action object
 */
export function setLessonOrderDirection( direction ) {
	return {
		type: LESSON_ORDER_DIRECTION,
		payload: {
			direction
		}
	};
}

/**
 * Returns a function that dispatches a set search phrase action.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to dispatch an action
 */
export const setSearchPhraseInjector = ( dispatch ) => {
	return ( str ) => {
		dispatch( setSearchPhrase( str ) );
	};
};

/**
 * Returns a function that dispatches a set lesson order action.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to dispatch an action
 */
export const setLessonOrderInjector = ( dispatch ) => {
	return ( order ) => {
		dispatch( setLessonOrder( order ) );
	};
};

/**
 * Returns a function that dispatches a set lesson order direction action.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to dispatch an action
 */
export const setLessonOrderDirInjector = ( dispatch ) => {
	return ( direction ) => {
		dispatch( setLessonOrderDirection( direction ) );
	};
};
