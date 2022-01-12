// MODULES //

import asyncComponent from 'components/async';


// MAIN //

const Saml = asyncComponent( () => import( './main.js' ) );


// EXPORTS //

export default Saml;
