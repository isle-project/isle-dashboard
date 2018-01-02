process.env.NODE_ENV = 'test';  //eslint-disable-line
process.env.PUBLIC_URL = '';    //eslint-disable-line

// Load environment variables from .env file. Surpress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({silent: true});

const jest = require('jest');
const argv = process.argv.slice(2);

// Watch unless on CI
if (!process.env.CI) {    //eslint-disable-line
  argv.push('--watch');
}


jest.run(argv);
