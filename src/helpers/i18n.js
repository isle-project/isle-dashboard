// MODULES //

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';


// MAIN //

i18n.use( LanguageDetector )
	.use( Backend )
	.use( initReactI18next )
	.init({
		debug: true,
		lng: 'en',
		fallbackLng: 'en',
		backend: {
			loadPath: '/locales/{{lng}}/{{ns}}.json'
		}
	});


// EXPORTS //

export default i18n;
