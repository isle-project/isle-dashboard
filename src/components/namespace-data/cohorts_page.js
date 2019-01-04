// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ProgressBar } from 'react-bootstrap';
import round from '@stdlib/math/base/special/round';
import Select from 'react-select';
import server from 'constants/server';
import formatTime from 'utils/format_time.js';
import './cohorts.css';


// MAIN //

class CohortsPage extends Component {
	constructor( props ) {
		super( props );

		this.totalTime = 0;

		this.state = {
			cohortOptions: props.cohorts.map( cohort => {
				return { label: cohort.title, value: cohort };
			}),
			selectedCohorts: null,
			displayedMembers: [],
			actualMember: null
		};
	}

	handleCohortChange = ( cohorts ) => {
		let members = [];
		for ( let i = 0; i < cohorts.length; i++ ) {
			members = members.concat( cohorts[ i ].value.members );
		}
		this.setState({
			selectedCohorts: cohorts,
			displayedMembers: members
		}, () => {
			console.log( 'MEMBERS: ');
			console.log( this.state.displayedMembers );
			console.log( this.state.selectedCohorts );
		});
	}

	showUser = (member) => {
		this.setState({
			actualMember: member
		});
	}


	renderMember( member, key ) {
		// let mailto = "mailto:" + member.email;

		return (
			<Fragment key={key}>
			<div className="cohort-member">
				<div className="cohort-member-name">{member.name}</div>
				<img onClick={()=>this.showUser(member)} src={server + '/thumbnail/'+member.picture} />
				<div className="cohort-member-email"><a href={'mailto:' + member.email}>{member.email}</a></div>
			</div>

			</Fragment>
		);
	}

	renderCohort() {
		const members = this.state.displayedMembers;
		const list = [];
		for ( let i = 0; i < members.length; i++ ) {
			list.push( this.renderMember( members[ i ], i ) );
		}
		return list;
	}

	renderMemberLessons(member) {
		let lessons = this.props.lessons;
		let progress = 30;
		let spentTime = 0;
		let list = [];
		let totalTime = 0;
		for (var i = 0; i < lessons.length; i++) {
			let id = lessons[i]._id;
			if (member.lessonData[id]) {
				progress = round(member.lessonData[id].progress * 100);
				spentTime = formatTime(member.lessonData[id].spentTime);
				totalTime += member.lessonData[id].spentTime;
			}

			this.totalTime = formatTime(totalTime);

			list.push(
				<Fragment>
				<div className="cohort-actual-member-lesson-title">{lessons[i].title}</div>
				<ProgressBar className="cohort-actual-member-lesson-progress" style={{ float: 'left', fontSize: '10px', height: '12px'
				}} now={progress} label={`${progress}%`} />
				<span className="cohort-actual-member-lesson-time">{spentTime}</span>
				</Fragment>
			);
		}

		return (
			list
		);
	}

	closeActualMember = () => {
		this.setState({
			actualMember: null
		});
	}

	renderMemberBadges(member) {
		// var list = [];

		return (
			<div>Hier die Badges</div>
		);
	}

	renderActualMember() {
		const member = this.state.actualMember;
		let date = null;
		if ( member.createdAt ) {
			date = new Date( member.createdAt ).toLocaleDateString();
		}

		return (
			<div className="cohort-actual-member">
				<div onClick={this.closeActualMember} className="cohort-actual-member-exit" >&#10005;</div>
				<img className="cohort-actual-member-portrait" src={server + '/avatar/'+member.picture} />
				<div className="cohort-actual-member-portrait-shadow" />
				{date ? <div className="cohort-actual-member-registered">registered since {date}</div> : null}
				<div className="cohort-actual-member-name">
					<h3>{member.name}</h3>
					<div>{member.email}</div>
				</div>
				<div className="cohort-actual-member-info">
					{ this.renderMemberLessons(member)}
				</div>
				<div className="cohort-actual-member-total-time">TOTAL TIME: {this.totalTime}</div>
				<div className="cohort-actual-member-badges">
					{ this.renderMemberBadges(member) }
				</div>
			</div>
		);
	}

	render() {
		return (
			<div className="namespace-data-page">
				<div style={{ width: '300px', height: '40px' }}>
					<Select
						isMulti
						name="cohorts"
						options={this.state.cohortOptions}
						onChange={this.handleCohortChange}
					/>
				</div>
				<div className="cohort-page">
					{ this.renderCohort() }
				</div>
				{this.state.actualMember ? this.renderActualMember() : null}
			</div>
		);
	}
}


// PROPERTIES //

CohortsPage.propTypes = {
	cohorts: PropTypes.array.isRequired
};

CohortsPage.defaultProps = {
};


// EXPORTS //

export default CohortsPage;
