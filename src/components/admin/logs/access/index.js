// MODULES //

import React, { Component, Fragment } from 'react';
import { LazyLog, ScrollFollow } from 'react-lazylog';
import { withTranslation } from 'react-i18next';
import qs from 'querystring';
import Button from 'react-bootstrap/Button';
import './access_log.css';


// MAIN //

class AccessLog extends Component {
	render() {
		const { user, t } = this.props;
		const url = `/logs/access.log?${qs.stringify({ jwt: user.token })}`;
		return (
			<Fragment>
				<a href={url} target="_blank" download >
					<Button variant="success" className="admin-page-log-side-button" >{t('common:save-file')}</Button>
				</a>
				<div className="access-log-wrapper" >
					<ScrollFollow
						startFollowing={true}
						render={({ follow, onScroll }) => (
							<LazyLog
								enableSearch
								url={url}
								stream follow={follow} onScroll={onScroll}
								selectableLines
								text={t('access-log')}
							/>
						)}
					/>
				</div>
			</Fragment>
		);
	}
}


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( AccessLog );
