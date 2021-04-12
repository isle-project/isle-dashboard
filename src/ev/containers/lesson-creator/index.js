// MODULES //

import { connect } from 'react-redux';
import LessonCreator from 'ev/components/lesson-creator';
import { copyLessonInjector } from 'actions/lesson';


// FUNCTIONS //

function mapStateToProps( state ) {
	return {
		admin: state.admin,
		user: state.user
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		copyLesson: copyLessonInjector( dispatch )
	};
}


// MAIN //

const VisibleLessonCreator = connect( mapStateToProps, mapDispatchToProps )( LessonCreator );


// EXPORTS //

export default VisibleLessonCreator;
