export const LOCAL = 'http://localhost:17777';
export const REMOTE = 'http://isle.heinz.cmu.edu';

export default ( process.env.NODE_ENV === 'development' ? LOCAL : REMOTE );
