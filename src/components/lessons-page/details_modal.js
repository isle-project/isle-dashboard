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
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import FormLabel from 'react-bootstrap/FormLabel';
import FormGroup from 'react-bootstrap/FormGroup';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import logger from 'debug';
import SERVER from 'constants/server';


// VARIABLES //

const debug = logger( 'isle-dashboard' );


// MAIN //

class DetailsModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			title: props.title,
			description: props.description,
			disabled: false
		};
	}

	componentDidUpdate( prevProps ) {
		if (
			prevProps.title !== this.props.title ||
			prevProps.description !== this.props.description
		) {
			this.setState({
				title: this.props.title,
				description: this.props.description
			});
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

	onSubmit = ( evt ) => {
		evt.preventDefault();
		this.props.update({
			newTitle: this.state.title,
			newDescription: this.state.description
		});
	}

	render() {
		const { t } = this.props;
		return (
			<Modal show={this.props.show} onHide={this.props.close}>
				<Form action={SERVER} method="get" onSubmit={this.onSubmit}>
					<Modal.Header>
						<Modal.Title as="h3">{t('lesson-details')}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<FormGroup>
							<Col sm={2}>
								<FormLabel>{t('common:title')}</FormLabel>
							</Col>
							<Col sm={10}>
								<FormControl
									name="title"
									type="title"
									onChange={this.handleInputChange}
									defaultValue={this.state.title}
								/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={2}>
								<FormLabel>{t('common:description')}</FormLabel>
							</Col>
							<Col sm={10}>
								<FormControl
									name="description"
									type="description"
									onChange={this.handleInputChange}
									defaultValue={this.state.description}
								/>
							</Col>
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
	show: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	update: PropTypes.func.isRequired
};


// EXPORTS //

export default DetailsModal;
