// MODULES //

import React, { Component, Fragment } from 'react';
import {
	ProgressBar
} from 'react-bootstrap';
import './cohorts.css';

// MAIN //

class CohortsPage extends Component {
	showUser = () => {
		alert('hier kommt der Nutzer');
	}

	renderMember() {
		let progress = 55;
		let name = 'Donald Kiefer Sutherland';
		let score = 2799;
		let time = '5:39';

		return (
			<Fragment>
			<div className="cohort-member" onClick={this.showUser}>
				<img src="https://isle.heinz.cmu.edu/avatar/595cf2a7a03a977d01299320.jpg" />
				<div className="cohort-member-name">{name}</div>
				<div className="cohort-member-values">
					<span className="cohort-member-score">{ score }</span>
					<span className="cohort-member-time">{ time }</span>
				</div>
				<div className="cohort-member-progress">
					<ProgressBar style={{ borderRadius: 0, height: 12, fontSize: 10}} variant='success' now={progress} label={progress+'%'} />
				</div>
			</div>

			</Fragment>
		);
	}

	renderCohort() {
		var list = [];
		for (var i = 0; i < 90; i++) {
			list.push( this.renderMember() );
		}
		return list;
	}

	render() {
		return (
			<Fragment>
				<div className="namespace-data-page">
				<h1>Cohort Data</h1>
				</div>

				<div className="cohort-page">
					{ this.renderCohort() }
				</div>
			</Fragment>

		);
	}
}


// PROPERTIES //

CohortsPage.propTypes = {
};

CohortsPage.defaultProps = {
};


// EXPORTS //

export default CohortsPage;
