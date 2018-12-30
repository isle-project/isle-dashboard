// MODULES //

import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import server from 'constants/server';
import EditNamespace from 'components/edit-namespace';
import * as actions from 'actions';


// EXPORTS //

const VisibleEditNamespace = connect( mapStateToProps, mapDispatchToProps )( EditNamespace );

function mapStateToProps( state ) {
	return {
		user: state.user,
		namespace: state.namespace,
		cohorts: state.namespace.cohorts
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		addNotification: ({ message, level }) => {
			dispatch( actions.addNotification({ message, level }) );
		},
		createCohort: ( user, cohortInstance, clbk ) => {
			request.post( server+'/create_cohort', {
				form: cohortInstance,
				headers: {
					'Authorization': 'JWT ' + user.token
				}
			}, ( err, res ) => {
				if ( !err && res.statusCode === 200 ) {
					dispatch( actions.addNotification({
						message: 'Cohort successfully created',
						level: 'success'
					}) );
					return clbk();
				}
				const message = err ? err.msg : res.body;
				dispatch( actions.addNotification({
					message: message,
					level: 'error'
				}) );
			});
		},
		getCohorts: ({ namespaceID, userToken }) => {
			request.get( server+'/get_cohorts', {
				headers: {
					'Authorization': 'JWT ' + userToken
				},
				qs: {
					namespaceID
				}
			}, function onCohorts( error, response, body ) {
				if ( error ) {
					return error;
				}
				body = JSON.parse( body );
				dispatch( actions.retrievedCohorts( body.cohorts ) );
			});
		},
		deleteCohort: ( _id, token, clbk ) => {
			request.get( server+'/delete_cohort', {
				qs: {
					_id
				},
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, ( err, res ) => {
				if ( err || res.statusCode !== 200 ) {
					let msg = res.body;
					return dispatch( actions.addNotification({
						message: msg,
						level: 'error'
					}) );
				}
				dispatch( actions.addNotification({
					message: 'Cohort successfully deleted',
					level: 'success'
				}) );
				clbk();
			});
		},
		updateCohort: ( cohort, userToken, clbk ) => {
			request.post( server+'/update_cohort', {
				form: {
					cohort
				},
				headers: {
					'Authorization': 'JWT ' + userToken
				}
			}, ( err, res ) => {
				if ( err ) {
					return clbk( err );
				}
				dispatch( actions.addNotification({
					message: 'Cohort successfully updated',
					level: 'success'
				}) );
				clbk( null, res );
			});
		},
		deleteCurrentNamespace: ( id, token, history ) => {
			request.get( server+'/delete_namespace', {
				qs: {
					id
				},
				headers: {
					'Authorization': 'JWT ' + token
				}
			}, ( err, res ) => {
				if ( err || res.statusCode >= 400 ) {
					let msg = res.body;
					if ( res.statusCode === 403 ) {
						msg = 'Only courses with no lessons can be deleted.';
					}
					return dispatch( actions.addNotification({
						message: msg,
						level: 'error'
					}) );
				}
				history.replace( '/lessons' );
				dispatch( actions.deletedCurrentNamespace( id ) );
				dispatch( actions.addNotification({
					message: 'Course successfully deleted',
					level: 'success'
				}) );
			});
		},
		updateCurrentNamespace: ( ns, clbk ) => {
			request.post( server+'/update_namespace', {
				form: {
					ns
				},
				headers: {
					'Authorization': 'JWT ' + ns.token
				}
			}, ( err, res ) => {
				if ( err ) {
					return clbk( err );
				}
				dispatch( actions.changedNamespace( ns ) );
				dispatch( actions.updatedOwnedNamespace( ns ) );
				clbk( null, res );
			});
		}
	};
}

export default VisibleEditNamespace;
