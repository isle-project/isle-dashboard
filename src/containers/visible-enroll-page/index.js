// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import EnrollPage from 'components/enroll-page';
import request from 'request';
import server from 'constants/server';
import * as actions from 'actions';


// EXPORTS //

const VisibleEnrollPage = connect( mapStateToProps, mapDispatchToProps )( EnrollPage );

function mapStateToProps( state ) {
	return {
		cohorts: state.cohorts,
		user: state.user
	};
}

function mapDispatchToProps(dispatch) {
	return {
		addUserToCohort(cohortID, userToken, namespace, callback ) {
			request.get( server+'/add_to_cohort', {
				headers: {
					'Authorization': 'JWT ' + userToken
				},
				qs: {
					cohortID
				}
			}, function onAdded( error, response, body ) {
				if ( error ) {
					dispatch( actions.addNotification({
						message: error.message,
						level: 'error'
					}) );

					return callback();
				}
				body = JSON.parse( body );
				dispatch( actions.addNotification({
					message: body.message,
					level: 'success'
				}) );

				dispatch( actions.addEnrolledNamespace(namespace) );

				return callback();
			});
		},
		fetchCohorts(token) {
			request.get( server+'/get_enrollable_cohorts', {
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, function onCohorts( error, response, body ) {
				if ( error ) {
					return error;
				}
				body = JSON.parse( body );
				dispatch( actions.retrievedEnrollableCohorts( body.cohorts ) );
			});
		}
	};
}


export default VisibleEnrollPage;
