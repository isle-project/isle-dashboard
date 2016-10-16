// MODULES //

import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import HeaderBar from './header_bar';


// MAIN //

class ProfilePage extends Component {

	render() {

		return (
			<div>
				<HeaderBar
					username="Philipp Burckhardt"
					onDashboardClick={this.showLessons}
					onProfileClick={this.showProfile}
				/>
				<Panel style={{
					position: 'relative',
					top: '80px',
					width: '50%',
					margin: '0 auto'
				}} header={<h2>Profile</h2>}>
					PROFILE COMES HERE
				</Panel>
			</div>
		);
	}

}


// EXPORTS //

export default ProfilePage;
