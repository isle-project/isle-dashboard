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

import { AnyAction } from 'redux';
import * as types from 'constants/action_types.js';
import server from 'constants/server';


// VARIABLES //

interface GalleryState {
	lessons: Array<any> | null;
}

const initialState: GalleryState = {
	lessons: null
};


// EXPORTS //

export default function namespace( state = initialState, action: AnyAction ) {
	switch ( action.type ) {
	case types.RETRIEVED_PUBLIC_LESSONS: {
		let lessons = action.payload.lessons;
		lessons = lessons.map( ( lesson, index ) => {
			lesson.colorIndex = index % 20;
			lesson.url = server+'/'+lesson.namespace+'/'+lesson.title;
			if ( !lesson.createdAt ) {
				lesson.createdAt = new Date( 0 ).toLocaleString();
			}
			if ( !lesson.updatedAt ) {
				lesson.updatedAt = lesson.createdAt;
			}
			return lesson;
		});
		return Object.assign({}, state, {
			lessons
		});
	}
	default:
		return state;
	}
}
