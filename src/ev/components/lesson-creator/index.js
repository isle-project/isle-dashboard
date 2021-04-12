// MODULES //

import asyncComponent from 'components/async';


// MAIN //

const LessonCreator = asyncComponent( () => import( './main.js' ) );


// EXPORTS //

export default LessonCreator;
