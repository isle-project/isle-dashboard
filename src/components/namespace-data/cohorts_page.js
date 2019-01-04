// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ProgressBar, OverlayTrigger, Tooltip } from 'react-bootstrap';
import round from '@stdlib/math/base/special/round';
import Select from 'react-select';
import server from 'constants/server';
import formatTime from 'utils/format_time.js';
import contains from '@stdlib/assert/contains';
import './cohorts.css';


// MAIN //

class CohortsPage extends Component {
	constructor( props ) {
		super( props );

		const cohortOptions = props.cohorts.map( cohort => {
			return { label: cohort.title, value: cohort };
		});

		let displayedMembers = [];
		for (var i = 0; i < props.cohorts.length; i++) {
			displayedMembers = displayedMembers.concat( props.cohorts[i].members);
		}

		this.state = {
			cohortOptions: cohortOptions,
			selectedCohorts: cohortOptions,
			displayedMembers: displayedMembers,
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
		let progress = 0;
		let spentTime = 0;
		let list = [];
		let totalTime = 0;

		for (var i = 0; i < lessons.length; i++) {
			let id = lessons[i]._id;

			if (member.lessonData && member.lessonData[id]) {
				progress = round(member.lessonData[id].progress * 100);
				spentTime = formatTime(member.lessonData[id].spentTime);
				totalTime += member.lessonData[id].spentTime;
			}


			list.push(
				<Fragment>
				<div className="cohort-actual-member-lesson-title">{lessons[i].title}</div>
				<ProgressBar className="cohort-actual-member-lesson-progress" style={{ float: 'left', fontSize: '10px', height: '12px'
				}} now={progress} label={`${progress}%`} />
				<span className="cohort-actual-member-lesson-time">{spentTime}</span>
				</Fragment>
			);
		}

		console.log(totalTime);
		totalTime = formatTime(totalTime);

		return (
			<Fragment>
			<hr />
			<div className="cohort-actual-member-lesson-header">COURSE INFO</div>
			<div className="cohort-actual-member-lesson-total">COURSE TOTAL TIME: {totalTime}</div>
			<div className="lessons-area">
				{ list }
			</div>
			</Fragment>
		);
	}

	closeActualMember = () => {
		this.setState({
			actualMember: null
		});
	}

	renderMemberBadges(member) {
		let badges = this.props.badges;
		console.log( member );
		console.log( badges );

		let time = formatTime(member.spentTime);
		let list = [];

		for (let i = 0; i < badges.length; i++) {
			if (contains(member.badges, badges[i].name) ) {
				console.log('ist enthalten');

				list.push(
				<Fragment>
					<OverlayTrigger placement="bottom" overlay={<Tooltip id="isleTime">{ badges[i].description }</Tooltip>}>
					<div className="cohort-user-badge" >
						<img src={server + '/badges/' + badges[i].picture} />
					</div>
					</OverlayTrigger>
				</Fragment>

				);
			}
		}

		let isleTime = 'the time the user spent with ISLE';
		let scoreComment = 'user score';

		return (
			<Fragment>
				<div>General User Info</div>
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="isleTime">{ isleTime }</Tooltip>}>
					<span className="user-info-time">ISLE TIME: {time}</span>
				</OverlayTrigger>
				<OverlayTrigger placement="bottom" overlay={<Tooltip id="isleTime">{ scoreComment }</Tooltip>}>
					<span className="user-info-score">SCORE: {member.score}</span>
				</OverlayTrigger>
				<div></div>

				<div className="user-info-badges">
					<div className="user-info-seperator">Badges</div>
					{list}
				</div>
			</Fragment>
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
				<div className="cohort-actual-member-badges">
					{ this.renderMemberBadges(member) }
				</div>
			</div>
		);
	}

	render() {
		return (
			<div className="namespace-data-page">
				<OverlayTrigger placement="right" overlay={<Tooltip id="select">Select user cohorts</Tooltip>}>
					<div style={{ width: '400px', height: '40px' }}>
						<Select
							value={this.state.selectedCohorts}
							isMulti
							name="cohorts"
							options={this.state.cohortOptions}
							onChange={this.handleCohortChange}
						/>
					</div>
				</OverlayTrigger>
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
	badges: PropTypes.array.isRequired,
	cohorts: PropTypes.array.isRequired

};

CohortsPage.defaultProps = {
};


// EXPORTS //

export default CohortsPage;
