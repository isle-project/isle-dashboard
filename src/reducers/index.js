// MODULES //

import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import namespace from './namespace';
import notification from './notification';
import gallery from './gallery';
import user from './user';


// MAIN //

const rootReducer = combineReducers({
	gallery,
	namespace,
	notification,
	routing,
	user
});


// EXPORTS //

export default rootReducer;
