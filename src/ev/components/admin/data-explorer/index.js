// MODULES //

import asyncComponent from 'components/async';


// MAIN //

const AdminDataExplorer = asyncComponent( () => import( './main.js' ) );


// EXPORTS //

export default AdminDataExplorer;
