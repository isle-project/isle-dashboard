
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

import axios from 'axios';
import server from 'constants/server';
import { addErrorNotification } from 'actions/notification.js';
import { GET_OVERVIEW_STATISTICS, GET_HISTORICAL_OVERVIEW_STATISTICS } from 'constants/action_types.js';


// EXPORTS //

export const getOverviewStatistics = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/admin_overview_statistics' );
		dispatch({
			type: GET_OVERVIEW_STATISTICS,
			payload: {
				statistics: res.data.statistics
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const getOverviewStatisticsInjector = ( dispatch ) => {
	return async () => {
		await getOverviewStatistics( dispatch );
	};
};

export const getHistoricalOverviewStats = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/admin_historical_overview_statistics' );
		dispatch({
			type: GET_HISTORICAL_OVERVIEW_STATISTICS,
			payload: {
				statistics: res.data.statistics
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const getHistoricalOverviewStatsInjector = ( dispatch ) => {
	return async () => {
		await getHistoricalOverviewStats( dispatch );
	};
};
