
// MODULES //

import { publicUrl } from './../../config/server.json';


// VARIABLES //

export const REMOTE = publicUrl;
export const LOCAL = 'http://localhost:17777';


// MAIN //

let server;
if ( process.env.NODE_ENV === 'development' ) { // eslint-disable-line no-process-env
	server = process.env.REACT_APP_SERVER === 'remote' ? REMOTE : LOCAL; // eslint-disable-line no-process-env
} else {
	server = REMOTE;
}


// EXPORTS //

export default server;
