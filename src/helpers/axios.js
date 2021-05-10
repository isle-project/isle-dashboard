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
import i18next from './i18n';
import { store } from './../index.js';


// MAIN //

axios.interceptors.request.use( ( config ) => {
	config.headers[ 'Accept-Language' ] = i18next.language;
	const state = store.getState();
	const token = state.user.token;
	if ( token ) {
		config.headers.Authorization = `JWT ${token}`;
	}
	return config;
});

const namespaceClient = axios.create();
namespaceClient.interceptors.request.use( ( config ) => {
	config.headers[ 'Accept-Language' ] = i18next.language;
	const state = store.getState();
	const token = state.user.token;
	if ( token ) {
		config.headers.Authorization = `JWT ${token}`;
	}
	config.headers[ 'X-Context-Level' ] = 'namespace';

	const target = config.data.namespaceID || config.params.namespaceID || state.namespace._id;
	config.headers[ 'X-Context-Target' ] = target;
	return config;
});

const programClient = axios.create();

const lessonClient = axios.create();
lessonClient.interceptors.request.use( ( config ) => {
	config.headers[ 'Accept-Language' ] = i18next.language;
	const state = store.getState();
	const token = state.user.token;
	if ( token ) {
		config.headers.Authorization = `JWT ${token}`;
	}
	config.headers[ 'X-Context-Level' ] = 'lesson';

	let target = config.data.lessonID || config.params.lessonID;
	target += state.namespace._id;
	config.headers[ 'X-Context-Target' ] = target;

	return config;
});

const globalClient = axios.create();
globalClient.interceptors.request.use( ( config ) => {
	config.headers[ 'Accept-Language' ] = i18next.language;
	const token = store.getState().user.token;
	if ( token ) {
		config.headers.Authorization = `JWT ${token}`;
	}
	config.headers[ 'X-Context-Level' ] = 'global';
	config.headers[ 'X-Context-Target' ] = true;
	return config;
});


// EXPORTS //

export const namespaceAxios = namespaceClient;
export const programAxios = programClient;
export const lessonAxios = lessonClient;
export const globalAxios = globalClient;
