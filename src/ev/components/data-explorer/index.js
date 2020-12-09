// MODULES //

import asyncComponent from 'components/async';


// MAIN //

const DashboardDataExplorer = asyncComponent( () => import( './main.js' ) );


// EXPORTS //

export default DashboardDataExplorer;
