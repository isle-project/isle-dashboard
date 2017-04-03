export const LOCAL = 'http://localhost:3000';
export const REMOTE = 'http://isle.heinz.cmu.edu/server';

export default ( process.env.NODE_ENV === 'development' ? LOCAL : REMOTE );
