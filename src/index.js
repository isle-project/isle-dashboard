// MODULES //

import 'react-dates/initialize';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHashHistory from 'history/createHashHistory';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from 'reducers';
import App from 'containers/app.js';
import 'css/animations.css';
import 'css/index.css';


// VARIABLES //

const history = createHashHistory();

// Apply the middleware to the store
const middleware = routerMiddleware( history );
const store = createStore( createRootReducer( history ), applyMiddleware( middleware ) );


// MAIN //

ReactDOM.render(
	<Provider store={store}>
		<App history={history} />
	</Provider>,
	document.getElementById( 'root' )
);
