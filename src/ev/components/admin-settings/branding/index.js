// MODULES //

import asyncComponent from 'components/async';


// MAIN //

const Branding = asyncComponent( () => import( './main.js' ) );


// EXPORTS //

export default Branding;
