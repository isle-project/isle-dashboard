// MODULES //

import asyncComponent from 'components/async';


// MAIN //

const UserFields = asyncComponent( () => import( './main.js' ) );


// EXPORTS //

export default UserFields;
