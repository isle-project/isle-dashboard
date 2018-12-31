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
