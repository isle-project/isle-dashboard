// MODULES //

import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from './containers/app.js';
import VisibleCreateNamespace from './containers/visible_create_namespace.js';
import VisibleEditNamespace from './containers/visible_edit_namespace.js';
import ForgotPassword from './components/forgot_password.js';
import VisibleLessonsPage from './containers/visible_lessons_page.js';
import Lesson from './components/lesson.js';
import VisibleLogin from './containers/visible_login.js';
import Signup from './components/signup.js';
import VisibleProfilePage from './containers/visible_profile_page.js';
import AuthenticationBarrier from './containers/authentication_barrier.js';
import NewPassword from './components/new_password.js';


// EXPORTS //

export default (
	<Route path="/" component={App}>
		<IndexRoute component={VisibleLogin} />
		<Route component={AuthenticationBarrier}>
			<Route
				path="create-namespace"
				component={VisibleCreateNamespace}
			/>
			<Route
				path="edit-namespace"
				component={VisibleEditNamespace}
			/>
			<Route
				path="profile"
				component={VisibleProfilePage}
			/>
			<Route
				path="lessons"
				component={VisibleLessonsPage}
			/>
			<Route
				path="lessons/:lessonId"
				component={Lesson}
			/>
		</Route>
		<Route path="login" component={VisibleLogin}/>
		<Route path="new-password" component={NewPassword}/>
		<Route path="signup" component={Signup}/>
		<Route path="forgot-password" component={ForgotPassword}/>
	</Route>
);
