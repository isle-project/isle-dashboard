
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
	server = window.location.origin;
}


// EXPORTS //

export default server;
