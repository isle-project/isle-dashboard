// MODULES //

import React, { Component } from 'react';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';
import ForgotPassword from './components/forgot_password';
import LessonsPage from './components/lessons_page';
import Lesson from './components/lesson';
import Login from './components/login';
import Signup from './components/signup';
import ProfilePage from './components/profile_page';
import './App.css';


// MAIN //

class App extends Component {

	render() {
		return (
			<div className="App">
				{this.props.children}
			</div>
		);
	}
}


class Main extends Component {
	
	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={App}>
					<IndexRoute component={LessonsPage} />
					<Route path="profile" component={ProfilePage}/>
					<Route path="lessons" component={LessonsPage}/>
					<Route path="lessons/:id" component={Lesson} />
					<Route path="login" component={Login}/>
					<Route path="signup" component={Signup}/>
					<Route path="forgot-password" component={ForgotPassword}/>
				</Route>
			</Router>
		);
	}
}


// EXPORTS //

export default Main;
