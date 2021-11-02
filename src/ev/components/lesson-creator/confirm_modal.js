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
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Modal from 'react-bootstrap/Modal';


// MAIN //

class ConfirmModal extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			targetName: props.title
		};
	}

	handleChange = ( event ) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[ name ]: value
		});
	};

	handleImport = async () => {
		await this.props.copyLesson({
			sourceName: this.props.lesson.title,
			source: this.props.lesson.namespace.title,
			target: this.props.targetNamespace,
			targetName: this.state.targetName
		});
		this.props.onCreate();
	};

	render() {
		const { t } = this.props;
		return (
			<Modal show={this.props.show} onHide={this.props.close} centered >
				<Modal.Header closeButton >
					<Modal.Title>
						{t('create-from-template')}: <br />
						<span style={{ color: 'darkred' }}>{this.props.lesson.title}</span>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						<b>{`${t('common:description')}: `}</b>
						{this.props.lesson.description}
					</p>
					<FormGroup>
						<FormLabel>{t('common:name')}</FormLabel>
						<FormControl
							name="targetName"
							type="text"
							value={this.state.targetName}
							onChange={this.handleChange}
							placeholder={t('common:enter-name')}
						/>
					</FormGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.close}>{t('common:cancel')}</Button>
					<Button variant="success" onClick={this.handleImport} >{t('common:confirm')}</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}


// PROPERTIES //

ConfirmModal.propTypes = {
	close: PropTypes.func.isRequired,
	copyLesson: PropTypes.func.isRequired,
	lesson: PropTypes.object.isRequired,
	onCreate: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	t: PropTypes.func.isRequired,
	targetNamespace: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired
};


// EXPORTS //

export default ConfirmModal;
