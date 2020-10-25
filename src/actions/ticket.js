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

import React from 'react';
import axios from 'axios';
import qs from 'querystring';
import server from 'constants/server';
import i18next from 'i18next';
import { addNotification, addErrorNotification } from 'actions/notification';
import { CREATED_TICKET, DELETED_TICKET, GET_ALL_TICKETS,
	GET_COURSE_TICKETS, GET_USER_TICKETS, TICKET_CLOSED,
	TICKET_OPENED, TICKET_MESSAGE_ADDED, TICKET_PRIORITY_UPDATED } from 'constants/action_types.js';


// EXPORTS //

export const getAllTickets = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_all_tickets' );
		dispatch({
			type: GET_ALL_TICKETS,
			payload: {
				tickets: res.data.tickets
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const getAllTicketsInjector = dispatch => {
	return async () => {
		await getAllTickets( dispatch );
	};
};

export const getCourseTickets = async ( dispatch, namespaceID ) => {
	try {
		const res = await axios.get( server+'/get_course_tickets?'+qs.stringify({ namespaceID }) );
		dispatch({
			type: GET_COURSE_TICKETS,
			payload: {
				tickets: res.data.tickets
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const getCourseTicketsInjector = dispatch => {
	return async ( id ) => {
		await getCourseTickets( dispatch, id );
	};
};

export const getUserTickets = async ( dispatch ) => {
	try {
		const res = await axios.get( server+'/get_user_tickets' );
		dispatch({
			type: GET_USER_TICKETS,
			payload: {
				tickets: res.data.tickets
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const getUserTicketsInjector = dispatch => {
	return async () => {
		await getUserTickets( dispatch );
	};
};

export const deleteTicket = async ( dispatch, id ) => {
	try {
		const res = await axios.post( server+'/delete_ticket', {
			id
		});
		addNotification( dispatch, {
			title: i18next.t('common:deleted'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: DELETED_TICKET,
			payload: {
				id
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const deleteTicketInjector = dispatch => {
	return async ( id ) => {
		await deleteTicket( dispatch, id );
	};
};

export const createTicket = async ( dispatch, {
	title,
	description,
	platform,
	namespace,
	files
}) => {
	try {
		let res;
		let attachments;
		if ( !files || files.length === 0 ) {
			res = await axios.post( server + '/create_ticket', {
				title,
				description,
				platform,
				namespaceID: namespace._id
			});
			attachments = [];
		} else {
			const formData = new FormData();
			for ( let i = 0; i < files.length; i++ ) {
				formData.append( 'attachment', files[ i ] );
			}
			formData.append( 'title', title );
			formData.append( 'description', description );
			formData.append( 'platform', JSON.stringify( platform ) );
			formData.append( 'namespaceID', namespace._id );
			res = await axios.post( server + '/create_ticket', formData );
			attachments = res.data.attachments;
		}
		addNotification( dispatch, {
			title: i18next.t('common:created'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: CREATED_TICKET,
			payload: {
				title,
				description,
				platform,
				namespace,
				attachments
			}
		});
		return res;
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const createTicketInjector = dispatch => {
	return async ({
		title,
		description,
		platform,
		namespace,
		files
	}) => {
		await createTicket( dispatch, {
			title,
			description,
			platform,
			namespace,
			files
		});
	};
};

export const sendTicketMessage = async ( dispatch, { message, ticketID, user } ) => {
	try {
		const res = await axios.post( server+'/add_ticket_message', {
			body: message,
			ticketID
		});
		const msgObj = {
			body: message,
			author: user.name,
			email: user.email,
			picture: user.picture,
			createdAt: new Date().getTime()
		};
		dispatch({
			type: TICKET_MESSAGE_ADDED,
			payload: {
				id: ticketID,
				message: msgObj
			}
		});
		addNotification( dispatch, {
			title: i18next.t('common:added'),
			message: res.data.message,
			level: 'success'
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const sendTicketMessageInjector = dispatch => {
	return async ({ message, ticketID, user }) => {
		await sendTicketMessage( dispatch, { message, ticketID, user } );
	};
};

export const closeTicket = async ( dispatch, id ) => {
	try {
		const res = await axios.post( server+'/close_ticket', {
			ticketID: id
		});
		addNotification( dispatch, {
			title: i18next.t('common:closed'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: TICKET_CLOSED,
			payload: {
				id
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const closeTicketInjector = dispatch => {
	return async ( id ) => {
		await closeTicket( dispatch, id );
	};
};

export const updatePriority = async ( dispatch, id, priority ) => {
	try {
		const res = await axios.post( server+'/update_ticket_priority', {
			ticketID: id,
			priority
		});
		addNotification( dispatch, {
			title: i18next.t('common:updated'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: TICKET_PRIORITY_UPDATED,
			payload: {
				id,
				priority
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const updatePriorityInjector = dispatch => {
	return async ( id, priority ) => {
		await updatePriority( dispatch, id, priority );
	};
};

export const openTicket = async ( dispatch, id ) => {
	try {
		const res = await axios.post( server+'/open_ticket', {
			ticketID: id
		});
		addNotification( dispatch, {
			title: i18next.t('common:opened'),
			message: res.data.message,
			level: 'success'
		});
		dispatch({
			type: TICKET_OPENED,
			payload: {
				id
			}
		});
	} catch ( err ) {
		return addErrorNotification( dispatch, err );
	}
};

export const openTicketInjector = dispatch => {
	return async ( id ) => {
		await openTicket( dispatch, id );
	};
};
