// MODULES //

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import badges from './badges';
import cohorts from './cohorts';
import namespace from './namespace';
import notification from './notification';
import gallery from './gallery';
import search from './search';
import user from './user';


// EXPORTS //

export default ( history ) => combineReducers({
	badges,
	cohorts,
	gallery,
	namespace,
	notification,
	router: connectRouter( history ),
	search,
	user
});
