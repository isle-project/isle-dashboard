// MODULES //

import 'react-dates/initialize';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage
import { PersistGate } from 'redux-persist/integration/react';
import { createHashHistory } from 'history';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from 'reducers';
import App from 'containers/app.js';
import 'css/animations.css';
import 'css/index.css';


// VARIABLES //

const persistConfig = {
	key: 'root',
	storage,
	blacklist: [ 'router' ]
};
const history = createHashHistory();
const rootReducer = createRootReducer( history );
const persistedReducer = persistReducer( persistConfig, rootReducer );


// Apply the middleware to the store
const middleware = routerMiddleware( history );
const store = createStore( persistedReducer, applyMiddleware( middleware ) );
const persistor = persistStore( store );


// MAIN //

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<App history={history} />
		</PersistGate>
	</Provider>,
	document.getElementById( 'root' )
);
