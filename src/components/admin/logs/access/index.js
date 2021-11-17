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

import React, { Fragment } from 'react';
import { LazyLog, ScrollFollow } from 'react-lazylog';
import { useTranslation } from 'react-i18next';
import qs from 'querystring';
import Button from 'react-bootstrap/Button';
import './access_log.css';


// MAIN //

/**
* A component that displays the access log.
*
* @param {Object} props - component properties
* @param {Object} props.user - user object
* @returns {ReactElement} access log
*/
const AccessLog = ({ user }) => {
	const url = `/logs/access.log?${qs.stringify({ jwt: user.token })}`;
	const { t } = useTranslation( [ 'admin', 'common' ] );
	return (
		<Fragment>
			<a href={url} target="_blank" download rel="noopener noreferrer" >
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
};


// EXPORTS //

export default AccessLog;
