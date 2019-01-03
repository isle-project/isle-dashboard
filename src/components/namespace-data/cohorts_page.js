// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import server from 'constants/server';
import './cohorts.css';


// MAIN //

class CohortsPage extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			cohortOptions: props.cohorts.map( cohort => {
				return { label: cohort.title, value: cohort };
			}),
			selectedCohorts: null,
			displayedMembers: []
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

	showUser = () => {
		alert('hier kommt der Nutzer');
	}

	renderMember( member ) {
		return (
			<Fragment>
			<div className="cohort-member" onClick={this.showUser}>
				<img src={server + '/thumbnail/'+member.picture} />
				<div className="cohort-member-name">{member.name}</div>
				<div className="cohort-member-values">
					<span className="cohort-member-score">{member.score}</span>
					<span className="cohort-member-time">{member.spentTime}</span>
				</div>
			</div>

			</Fragment>
		);
	}

	renderCohort() {
		const members = this.state.displayedMembers;
		const list = [];
		for ( let i = 0; i < members.length; i++ ) {
			list.push( this.renderMember( members[ i ] ) );
		}
		return list;
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
