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

import { useEffect } from 'react';

// MAIN //

/**
 * A custom React hook that calls `useEffect` with a callback that is invoked once when the component is mounted.
 *
 * @param {Function} callback - callback to invoke once the component has mounted
 * @returns {void}
 */
const useMountEffect = ( callback ) => useEffect( callback, [] ); // eslint-disable-line react-hooks/exhaustive-deps


// EXPORTS //

export default useMountEffect;
