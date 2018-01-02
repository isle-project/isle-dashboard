// VARIABLES //

var REGEXP_CHARS = /[‘“!#$%&+^<=>{}()[\]`]/;


// EXPORTS //

export default function checkURLPath( str ) {
	return str.match( REGEXP_CHARS );
}
