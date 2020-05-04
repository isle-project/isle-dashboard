// MODULES //

import React from 'react';
import { withTranslation } from 'react-i18next';
import Jumbotron from 'react-bootstrap/Jumbotron';


// MAIN //

const NoLessonBanner = ( props ) => {
	const { user, t } = props;
	let description = t('no-lessons');
	if ( user.writeAccess ) {
		description += t('upload-from-editor');
	}
	return ( <Jumbotron className="lessons-jumbotron">
		<h1>{t('no-lessons-found')}</h1>
		<p>{description}</p>
	</Jumbotron> );
};


// EXPORTS //

export default withTranslation( [ 'lessons_page', 'common' ] )( NoLessonBanner );

