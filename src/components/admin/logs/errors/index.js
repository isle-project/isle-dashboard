// MODULES //

import React, { Component, Fragment } from 'react';
import { LazyLog, ScrollFollow } from 'react-lazylog';
import qs from 'querystring';
import Button from 'react-bootstrap/Button';
import './errors_log.css';


// MAIN //

class ErrorLog extends Component {
	render() {
		const url = `/logs/errors.log?${qs.stringify({ jwt: this.props.user.token })}`;
		return (
			<Fragment>
				<a href={url} target="_blank" download >
					<Button variant="success" className="admin-page-log-side-button" >Save File</Button>
				</a>
				<div className="error-log-wrapper" >
					<ScrollFollow
						startFollowing={true}
						render={({ follow, onScroll }) => (
							<LazyLog
								enableSearch
								url={url}
								stream follow={follow} onScroll={onScroll}
								selectableLines
								text="Error Log"
							/>
						)}
					/>
				</div>
			</Fragment>
		);
	}
}


// EXPORTS //

export default ErrorLog;
