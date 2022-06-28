/**
* Copyright (C) 2016-present The ISLE Authors
*
* The isle-dashboard program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// VARIABLES //

const REGEXP_CHARS = /[‘“!#$%&+^<=>{}()[\]`]/;


// MAIN //

/**
* Validates a string as a URL path.
*
* @param {string} str - value to validate
* @returns {(RegExpMatchArray|null)} match array or null
*/
function checkURLPath( str: string ): RegExpMatchArray | null {
	return str.match( REGEXP_CHARS );
}


// EXPORTS //

export default checkURLPath;
