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

export function setSearchPhrase( phrase ) {
	return {
		type: SEARCH_PHRASE_SET,
		payload: {
			phrase
		}
	};
}

export function setLessonOrder( type ) {
	return {
		type: LESSON_ORDER,
		payload: {
			type
		}
	};
}

export function setLessonOrderDirection( direction ) {
	return {
		type: LESSON_ORDER_DIRECTION,
		payload: {
			direction
		}
	};
}

export const setSearchPhraseInjector = ( dispatch ) => {
	return ( str ) => {
		dispatch( setSearchPhrase( str ) );
	};
};

export const setLessonOrderInjector = ( dispatch ) => {
	return ( order ) => {
		dispatch( setLessonOrder( order ) );
	};
};

export const setLessonOrderDirInjector = ( dispatch ) => {
	return ( direction ) => {
		dispatch( setLessonOrderDirection( direction ) );
	};
};
