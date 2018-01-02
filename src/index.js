// MODULES //

import 'react-dates/initialize';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import App from './containers/app.js';
import './index.css';


// VARIABLES //

let store = createStore( reducers );


// MAIN //

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById( 'root' )
);
