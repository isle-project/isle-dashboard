// MODULES //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import NotificationSystem from 'react-notification-system';
import PropTypes from 'prop-types';


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

	componentDidUpdate() {
		const notification = this.props.notification;
		const { message, level, position } = notification;
		if ( message && level ) {
			this.notificationSystem.addNotification({
				message,
				position,
				level
			});
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
