/**
* Copyright (C) 2016-present The ISLE Authors
*
* The isle-dashboard program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logger from 'debug';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import FormLabel from 'react-bootstrap/FormLabel';
import FormGroup from 'react-bootstrap/FormGroup';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import DateTimePicker from 'react-datetime-picker';
import isEmptyObject from '@stdlib/assert/is-empty-object';
import SERVER from 'constants/server';


// VARIABLES //

const debug = logger( 'isle-dashboard' );


// FUNCTIONS //

function preventPropagation( event ) {
	event.stopPropagation();
}


// MAIN //

class DetailsModal extends Component {
	constructor( props ) {
		super( props );

		let unlockLesson;
		let lockLesson;
		let lockUntil;
		let lockAfter;
		if ( props.lockUntil ) {
			unlockLesson = true;
			lockUntil = props.lockUntil;
		} else {
			unlockLesson = false;
			lockUntil = new Date();
		}
		if ( props.lockAfter ) {
			lockLesson = true;
			lockAfter = props.lockAfter;
		} else {
			lockLesson = false;
			lockAfter = new Date();
		}
		this.state = {
			title: props.title,
			description: props.description,
			disabled: false,
			hideFromDashboard: props.hideFromDashboard,
			template: props.template,
			changedTemplate: false,
			unlockLesson,
			lockUntil,
			lockLesson,
			lockAfter,
			tag: props.tag
		};
	}

	componentDidUpdate( prevProps ) {
		const newState = {};
		if ( prevProps.title !== this.props.title ) {
			newState.title = this.props.title;
		}
		if ( prevProps.description !== this.props.description ) {
			newState.description = this.props.description;
		}
		if ( prevProps.template !== this.props.template ) {
			newState.template = this.props.template;
		}
		if ( prevProps.tag !== this.props.tag ) {
			newState.tag = this.props.tag;
		}
		if ( prevProps.lockUntil !== this.props.lockUntil ) {
			if ( this.props.lockUntil ) {
				newState.unlockLesson = true;
				newState.lockUntil = this.props.lockUntil;
			} else {
				newState.unlockLesson = false;
				newState.lockUntil = new Date();
			}
		}
		if ( prevProps.lockAfter !== this.props.lockAfter ) {
			if ( this.props.lockAfter ) {
				newState.lockLesson = true;
				newState.lockAfter = this.props.lockAfter;
			} else {
				newState.lockLesson = false;
				newState.lockAfter = new Date();
			}
		}
		if ( !isEmptyObject( newState ) ) {
			this.setState( newState );
		}
	}

	handleInputChange = ( event ) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		debug( `Input field ${name} changed to ${value}` );
		this.setState({
			[ name ]: value
		}, () => {
			if ( this.state.title.length >= 3 && this.state.description.length > 0 ) {
				this.setState({
					disabled: false
				});
			} else {
				this.setState({
					disabled: true
				});
			}
		});
	};

	handleUnlockChange = ( event ) => {
		this.setState({
			unlockLesson: event.target.checked
		});
	};

	handleLockChange = ( event ) => {
		this.setState({
			lockLesson: event.target.checked
		});
	};

	handleTimeUntilChange = ( value ) => {
		this.setState({
			lockUntil: value
		});
	};

	handleTimeAfterChange = ( value ) => {
		this.setState({
			lockAfter: value
		});
	};

	handleTemplateChange = ( event ) => {
		this.setState({
			template: event.target.checked,
			changedTemplate: true
		});
	};

	hideFromDashboardChange = ( event ) => {
		this.setState({
			hideFromDashboard: event.target.checked
		});
	};

	onSubmit = ( evt ) => {
		evt.preventDefault();
		const details = {
			newTitle: this.state.title,
			newDescription: this.state.description
		};
		if ( this.state.unlockLesson ) {
			details.lockUntil = this.state.lockUntil;
		}
		if ( this.state.lockLesson ) {
			details.lockAfter = this.state.lockAfter;
		}
		if ( this.state.hideFromDashboard !== this.props.hideFromDashboard ) {
			details.hideFromDashboard = this.state.hideFromDashboard;
		}
		if ( this.state.changedTemplate ) {
			details.template = this.state.template;
		}
		if ( this.state.tag ) {
			details.tag = this.state.tag;
		}
		this.props.update( details );
	};

	render() {
		const { t } = this.props;
		return (
			<Modal show={this.props.show} onHide={this.props.close}>
				<Form action={SERVER} method="get" onSubmit={this.onSubmit} onKeyDown={preventPropagation} >
					<Modal.Header>
						<Modal.Title as="h3">{t('lesson-details')}</Modal.Title>
					</Modal.Header>
					<Modal.Body className="d-grid gap-2" >
						<FormGroup>
							<FormLabel>{t('common:title')}</FormLabel>
							<FormControl
								name="title"
								type="title"
								onChange={this.handleInputChange}
								defaultValue={this.state.title}
							/>
						</FormGroup>
						<FormGroup>
							<FormLabel>{t('common:description')}</FormLabel>
							<FormControl
								name="description"
								type="description"
								onChange={this.handleInputChange}
								defaultValue={this.state.description}
							/>
						</FormGroup>
						<FormGroup>
							<Form.Check
								type="checkbox"
								label={t('common:lock-until')}
								checked={this.state.unlockLesson}
								onChange={this.handleUnlockChange}
							/>
							<div>
								{this.state.unlockLesson ? <DateTimePicker
									minDate={new Date()}
									onChange={this.handleTimeUntilChange}
									value={this.state.lockUntil}
									clearIcon={null}
								/> : null }
							</div>
						</FormGroup>
						<FormGroup>
							<Form.Check
								type="checkbox"
								label={t('common:lock-after')}
								checked={this.state.lockLesson}
								onChange={this.handleLockChange}
							/>
							<div>
								{this.state.lockLesson ? <DateTimePicker
									minDate={new Date()}
									onChange={this.handleTimeAfterChange}
									value={this.state.lockAfter}
									clearIcon={null}
								/> : null }
							</div>
						</FormGroup>
						<FormGroup>
							<Form.Check
								type="checkbox"
								label={t('common:hide-from-dashboard')}
								checked={this.state.hideFromDashboard}
								onChange={this.hideFromDashboardChange}
							/>
						</FormGroup>
						{ this.props.user.administrator ? <FormGroup>
							<Form.Check
								type="checkbox"
								label={t('provide-as-template')}
								checked={this.state.template}
								onChange={this.handleTemplateChange}
							/>
						</FormGroup> : null}
						<FormGroup>
							<FormLabel>{t('common:tag')}</FormLabel>
							<FormControl
								name="tag"
								type="tag"
								onChange={this.handleInputChange}
								defaultValue={this.state.tag}
							/>
						</FormGroup>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.props.close}>{t('common:cancel')}</Button>
						<Button
							variant="success"
							type="submit"
							disabled={this.state.disabled}
						>{t('common:save')}</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		);
	}
}


// PROPERTIES //

DetailsModal.propTypes = {
	close: PropTypes.func.isRequired,
	description: PropTypes.string.isRequired,
	hideFromDashboard: PropTypes.bool,
	lockAfter: PropTypes.instanceOf( Date ),
	lockUntil: PropTypes.instanceOf( Date ),
	show: PropTypes.bool.isRequired,
	tag: PropTypes.string,
	template: PropTypes.bool,
	title: PropTypes.string.isRequired,
	update: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

DetailsModal.defaultProps = {
	hideFromDashboard: false,
	lockAfter: null,
	lockUntil: null,
	tag: null,
	template: null
};


// EXPORTS //

export default DetailsModal;
