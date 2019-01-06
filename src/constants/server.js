export const LOCAL = 'https://isle.heinz.cmu.edu';
export const REMOTE = 'https://isle.heinz.cmu.edu';

export default ( process.env.NODE_ENV === 'development' ? LOCAL : REMOTE ); // eslint-disable-line no-process-env
