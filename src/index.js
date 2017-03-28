// MODULES //

import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import routes from './routes';
import './index.css';


// VARIABLES //

let store = createStore( reducers );
const history = syncHistoryWithStore( browserHistory, store );


// MAIN //

ReactDOM.render(
	<Provider store={store}>
		<Router history={history} routes={routes} />
	</Provider>,
	document.getElementById( 'root' )
);
