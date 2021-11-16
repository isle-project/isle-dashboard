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
import SelectInput from 'react-select';
import isArray from '@stdlib/assert/is-array';


// MAIN //

class ImportModal extends Component {
	constructor( props ) {
		super( props );

		const ns = props.userNamespaces;
		let selected;
		if ( props.openedNamespace.title ) {
			selected = props.openedNamespace.title;
		} else {
			selected = ( isArray( ns ) && ns.length > 0 ) ?
				ns[ 0 ].title :
				null;
		}
		if ( selected ) {
			selected = { label: selected, value: selected };
		}
		this.state = {
			selected: selected,
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

	handleImport = () => {
		this.props.copyLesson({
			sourceName: this.props.title,
			source: this.props.namespace,
			target: this.state.selected.value,
			targetName: this.state.targetName
		});
		this.props.close();
	};

	handleCourseChange = ( newValue ) => {
		this.setState({
			selected: newValue
		});
	};

	render() {
		const { t } = this.props;
		return (
			<Modal show={this.props.show} onHide={this.props.close}>
				<Modal.Header>
					<Modal.Title>
						{t('import-lesson')}<span style={{ color: 'darkred' }}>{this.props.namespace}: {this.props.title}</span>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className="d-grid gap-2">
					<p>{t('import-lesson-description')}</p>
					<FormGroup>
						<FormLabel>{t('select-course')}</FormLabel>
						<SelectInput
							options={this.props.userNamespaces.map( ns => {
								return { value: ns.title, label: ns.title };
							})}
							onChange={this.handleCourseChange}
							value={this.state.selected}
						/>
					</FormGroup>
					<FormGroup>
						<FormLabel>{t('lesson-name')}</FormLabel>
						<FormControl
							name="targetName"
							type="text"
							value={this.state.targetName}
							onChange={this.handleChange}
						/>
					</FormGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.close}>{t('common:cancel')}</Button>
					<Button variant="success" onClick={this.handleImport} >{t('import')}</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}


// PROPERTIES //

ImportModal.propTypes = {
	close: PropTypes.func.isRequired,
	copyLesson: PropTypes.func.isRequired,
	namespace: PropTypes.string.isRequired,
	openedNamespace: PropTypes.object.isRequired,
	show: PropTypes.bool.isRequired,
	t: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	userNamespaces: PropTypes.array.isRequired
};


// EXPORTS //

export default ImportModal;
