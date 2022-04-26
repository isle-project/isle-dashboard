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

import axios from 'axios';
import server from 'constants/server';
import { addNotification, addErrorNotification } from 'actions/notification';
import { DELETED_PROGRAM, GET_ALL_PROGRAMS } from 'constants/action_types.js';


// MAIN //

/**
 * Returns an action object to be used in signalling that a program has been deleted.
 *
 * @param {string} id - the id of the program to be deleted
 * @returns {Object} the action object
 */
export function deletedProgram( id ) {
	return {
		type: DELETED_PROGRAM,
		payload: {
			id
		}
	};
}

/**
 * Makes a GET request to get a all available programs.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {void}
 */
export const getAllPrograms = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_all_programs' );
		dispatch({
			type: GET_ALL_PROGRAMS,
			payload: {
				programs: res.data.programs
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a GET request to get a all available programs.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make the GET request to get all available programs
 */
export const getAllProgramsInjector = ( dispatch ) => {
	return async () => {
		await getAllPrograms( dispatch );
	};
};

/**
 * Makes a POST request to delete a program.
 *
 * @param {Function} dispatch - dispatch function
 * @param {string} id - the id of the program to be deleted
 * @returns {void}
 */
export const deleteProgram = async ( dispatch, id ) => {
	try {
		const res = await axios.post( server+'/delete_program', { id });
		window.location.replace( '/dashboard/lessons' );
		dispatch( deletedProgram( id ) );
		addNotification( dispatch, {
			message: res.data.message,
			level: 'success'
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

/**
 * Returns a function to make a POST request to delete a namespace.
 *
 * @param {Function} dispatch - dispatch function
 * @returns {Function} function to make the POST request to delete a namespace
 */
export const deleteProgramInjector = ( dispatch ) => {
	return async ( id ) => {
		await deleteProgram( dispatch, id );
	};
};
