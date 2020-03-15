// MODULES //

import React, { Component } from 'react';
import { LazyLog, ScrollFollow } from 'react-lazylog';
import server from 'constants/server';
import './errors_log.css';


// MAIN //

class ErrorLog extends Component {
	render() {
		return ( <div className="error-log-wrapper" >
			<ScrollFollow
				startFollowing={true}
				render={({ follow, onScroll }) => (
					<LazyLog
						enableSearch
						url={`${server}/errors.log`}
						stream follow={follow} onScroll={onScroll}
						selectableLines
						text="Error Log"
					/>
				)}
			/>
		</div> );
	}
}


// EXPORTS //

export default ErrorLog;
