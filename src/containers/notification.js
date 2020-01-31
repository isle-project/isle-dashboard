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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NotificationSystem from 'react-notification-system';


// VARIABLES //

const style = {
	NotificationItem: {
		DefaultStyle: {
			margin: '20px 2px 2px 1px'
		},
		info: {
			color: 'black',
			backgroundColor: 'white',
			boxShadow: '0 0 4px darkslategray',
			height: '400px',
			width: '400px',
			borderTop: 'none'
		}
	}
};


// MAIN //

class NotificationContainer extends Component {
	constructor( props ) {
		super( props );
	}

	componentDidUpdate( prevProps, prevState ) {
		const notification = this.props.notification;
		const prevNotification = prevProps.notification;
		if ( prevNotification.time !== notification.time ) {
			this.notificationSystem.addNotification( notification );
		}
	}

	render() {
		return (
			<NotificationSystem
				style={style}
				ref={( elem ) => {
					this.notificationSystem = elem;
				}}
			/>
		);
	}
}

NotificationContainer.propTypes = {
	notification: PropTypes.object.isRequired
};

function mapStateToProps( state ) {
	return {
		notification: state.notification
	};
}

export default connect(
	mapStateToProps
)( NotificationContainer );
