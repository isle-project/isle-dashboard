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

import React from 'react';
import axios from 'axios';
import server from 'constants/server';
import { addErrorNotification } from 'actions/notification';
import { GET_EVENTS } from 'constants/action_types.js';


// EXPORTS //

export const getEvents = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_events' );
		dispatch({
			type: GET_EVENTS,
			payload: {
				events: res.data.events
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const getEventsInjector = dispatch => {
	return async () => {
		await getEvents( dispatch );
	};
};
