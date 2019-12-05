export const LOCAL = 'http://localhost:17777';
export const REMOTE = 'https://isle.stat.cmu.edu';

let server;
if ( process.env.NODE_ENV === 'development' ) { // eslint-disable-line no-process-env
	server = process.env.REACT_APP_SERVER === 'remote' ? REMOTE : LOCAL; // eslint-disable-line no-process-env
} else {
	server = REMOTE;
}

export default server;
