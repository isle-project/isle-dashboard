// MODULES //

import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import namespace from './namespace';
import user from './user';


// MAIN //

const rootReducer = combineReducers({
	namespace,
	routing,
	user
});


// EXPORTS //

export default rootReducer;
