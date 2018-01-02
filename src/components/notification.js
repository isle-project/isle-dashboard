// MODULES //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import NotificationSystem from 'react-notification-system';


// VARIABLES //

const style = {
	NotificationItem: {
		DefaultStyle: {
			margin: '20px 2px 2px 1px'
		}
	}
};


// MAIN //

class NotificationContainer extends Component {
	constructor( props ) {
		super( props );
	}

	componentWillReceiveProps( newProps ) {
		const { message, level, position } = newProps.notification;
		this.notificationSystem.addNotification({
			message,
			position,
			level
		});
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

function mapStateToProps( state ) {
	return {
		notification: state.notification
	};
}

export default connect(
	mapStateToProps
)( NotificationContainer );
