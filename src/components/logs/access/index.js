// MODULES //

import React, { Component } from 'react';
import { LazyLog, ScrollFollow } from 'react-lazylog';
import server from 'constants/server';
import './access_log.css';


// MAIN //

class AccessLog extends Component {
	render() {
		return ( <div className="access-log-wrapper" >
			<ScrollFollow
				startFollowing={true}
				render={({ follow, onScroll }) => (
					<LazyLog
						enableSearch
						url={`${server}/access.log`}
						stream follow={follow} onScroll={onScroll}
						selectableLines
						text="Access Log"
					/>
				)}
			/>
		</div> );
	}
}


// EXPORTS //

export default AccessLog;
