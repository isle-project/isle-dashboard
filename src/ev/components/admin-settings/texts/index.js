// MODULES //

import asyncComponent from 'components/async';


// MAIN //

const Texts = asyncComponent( () => import( './main.js' ) );


// EXPORTS //

export default Texts;
