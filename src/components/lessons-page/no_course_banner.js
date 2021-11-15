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

import React from 'react';
import { useTranslation } from 'react-i18next';


// MAIN //

/**
 * A component which displays a message to the user indicating that they have not selected a course.
 *
 * @param {Object} props - component properties
 * @param {Object} props.t - i18next translation function
 * @param {Object} props.user - user object
 * @returns {ReactElement} banner component
 */
const NoCourseBanner = ( props ) => {
	const { user } = props;
	const { t } = useTranslation( [ 'lessons_page', 'common' ] );
	let appendix = null;
	if ( user.writeAccess ) {
		appendix = <span>{t('create-new-one')}<i className="fa fa-pencil-alt"></i>.</span>;
	} else {
		appendix = ' .';
	}
	return ( <div className="jumbotron lessons-jumbotron" >
		<h1>{t('common:no-course-selected')}</h1>
		<p>{t('no-course-description')}<i className="fa fa-align-justify"></i>{appendix}
		</p>
	</div> );
};


// EXPORTS //

export default NoCourseBanner;
