// MODULES //

import React from 'react';
import { withTranslation } from 'react-i18next';
import Jumbotron from 'react-bootstrap/Jumbotron';


// MAIN //

const NoCourseBanner = ( props ) => {
	const { user, t } = props;
	let appendix = null;
	if ( user.writeAccess ) {
		appendix = <span>{t('create-new-one')}<i className="fa fa-pencil-alt"></i>.</span>;
	} else {
		appendix = ' .';
	}
	return ( <Jumbotron className="lessons-jumbotron" >
		<h1>{t('common:no-course-selected')}</h1>
		<p>{t('no-course-description')}<i className="fa fa-align-justify"></i>{appendix}
		</p>
	</Jumbotron> );
};


// EXPORTS //

export default withTranslation( [ 'lessons_page', 'common' ] )( NoCourseBanner );
