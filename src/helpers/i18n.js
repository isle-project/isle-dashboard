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

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend/cjs';
import Backend from 'i18next-chained-backend';
import server from 'constants/server';
import { store } from './../index.js';


// MAIN //

i18n.use( Backend )
	.use( LanguageDetector )
	.use( initReactI18next )
	.init({
		debug: false,
		lng: localStorage.getItem( 'i18nextLng' ) || 'en',
		fallbackLng: 'en',
		backend: {
			backends: [
				HttpApi,
				HttpApi,
				HttpApi
			],
			backendOptions: [
				{
					loadPath: './locales/{{lng}}/{{ns}}.json'
				},
				{
					loadPath: server+'/locales/{{lng}}/{{ns}}.json'
				},
				{
					loadPath: 'https://cdn.jsdelivr.net/npm/@isle-project/locales/components/{{ns}}/{{lng}}.json'
				}
			]
		},
		react: {
			useSuspense: false
		},
		interpolation: {
			escapeValue: false // Not needed for React!
		}
	});


i18n.store.on( 'added', function onLoaded( lng, ns ) {
	const state = store.getState();
	const translations = state.translations;
	const custom = translations[ lng ][ ns ];
	if ( custom ) {
		const keys = Object.keys( custom );
		if ( !i18n.store.data[ lng ][ ns+'_ORIGINAL' ] ) {
			i18n.store.data[ lng ][ ns+'_ORIGINAL' ] = {};
		}
		for ( let i = 0; i < keys.length; i++ ) {
			i18n.store.data[ lng ][ ns+'_ORIGINAL' ][ keys[ i ] ] = i18n.store.data[ lng ][ ns ][ keys[ i ] ];
			i18n.store.data[ lng ][ ns ][ keys[ i ] ] = custom[ keys[ i ] ];
		}
	}
});


// EXPORTS //

export default i18n;
