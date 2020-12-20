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

import React, { Component, Fragment } from 'react';
import { LazyLog, ScrollFollow } from 'react-lazylog';
import { withTranslation } from 'react-i18next';
import qs from 'querystring';
import Button from 'react-bootstrap/Button';
import './errors_log.css';


// MAIN //

class ErrorLog extends Component {
	render() {
		const { user, t } = this.props;
		const url = `/logs/errors.log?${qs.stringify({ jwt: user.token })}`;
		return (
			<Fragment>
				<a href={url} target="_blank" downloadrel="noopener noreferrer" >
					<Button variant="success" className="admin-page-log-side-button" >{t('common:save-file')}</Button>
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
								text={t('error-log')}
							/>
						)}
					/>
				</div>
			</Fragment>
		);
	}
}


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( ErrorLog );
