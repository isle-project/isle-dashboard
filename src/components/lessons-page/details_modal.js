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
import template from 'babel-template';


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

		let lockLesson;
		let lockUntil;
		if ( props.lockUntil ) {
			lockLesson = true;
			lockUntil = props.lockUntil;
		} else {
			lockLesson = false;
			lockUntil = new Date();
		}
		this.state = {
			title: props.title,
			description: props.description,
			disabled: false,
			template: props.template,
			lockLesson,
			lockUntil
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
		if ( prevProps.lockUntil !== this.props.lockUntil ) {
			if ( this.props.lockUntil ) {
				newState.lockLesson = true;
				newState.lockUntil = this.props.lockUntil;
			} else {
				newState.lockLesson = false;
				newState.lockUntil = new Date();
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
	}

	handleLockChange = ( event ) => {
		this.setState({
			lockLesson: event.target.checked
		});
	}

	handleTimeChange = ( value ) => {
		this.setState({
			lockUntil: value
		});
	}

	handleTemplateChange = ( event ) => {
		this.setState({
			template: event.target.checked
		});
	}

	onSubmit = ( evt ) => {
		evt.preventDefault();
		const details = {
			newTitle: this.state.title,
			newDescription: this.state.description
		};
		if ( this.state.lockLesson ) {
			details.lockUntil = this.state.lockUntil;
		}
		if ( this.state.template === false || this.state.template === true ) {
			details.template = this.state.template;
		}
		this.props.update( details );
	}

	render() {
		const { t } = this.props;
		return (
			<Modal show={this.props.show} onHide={this.props.close}>
				<Form action={SERVER} method="get" onSubmit={this.onSubmit} onKeyDown={preventPropagation} >
					<Modal.Header>
						<Modal.Title as="h3">{t('lesson-details')}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
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
								checked={this.state.lockLesson}
								onChange={this.handleLockChange}
							/>
							<div>
								{this.state.lockLesson ? <DateTimePicker
									minDate={new Date()}
									onChange={this.handleTimeChange}
									value={this.state.lockUntil}
									clearIcon={null}
								/> : null }
							</div>
						</FormGroup>
						{ this.props.user.administrator ? <FormGroup>
							<Form.Check
								type="checkbox"
								label={t('provide-as-template')}
								checked={this.state.template}
								onChange={this.handleTemplateChange}
							/>
						</FormGroup> : null}
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
	lockUntil: PropTypes.instanceOf( Date ),
	show: PropTypes.bool.isRequired,
	template: PropTypes.bool,
	title: PropTypes.string.isRequired,
	update: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

DetailsModal.defaultProps = {
	lockUntil: null,
	template: null
};


// EXPORTS //

export default DetailsModal;
