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
import SelectInput from 'react-select';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


// MAIN //

class ImportCourseModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			selectedCourse: null
		};
	}

	handleSelection = ( obj ) => {
		this.setState({
			selectedCourse: obj.value
		});
	}

	handleImport = async () => {
		const res = await this.props.copyNamespaceLessons({
			source: this.state.selectedCourse.title,
			target: this.props.targetNamespace.title
		});
		if ( res instanceof Error === false ) {
			this.props.close();
		}
	}

	render() {
		const { t } = this.props;
		const options = this.props.namespaces.map( x => {
			return {
				label: x.title,
				value: x
			};
		});
		return (
			<Modal size="lg" show={this.props.show} onHide={this.props.close}>
				<Modal.Header closeButton>
					<Modal.Title as="h3">{t('import-course')}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						{t('import-course-description')}
					</p>
					<Form.Group controlId="form-course-select" >
						<Form.Label>{t('select-namespace')}</Form.Label>
						<SelectInput
							options={options}
							onChange={this.handleSelection}
						/>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.close}>{t('common:cancel')}</Button>
					<Button variant="success" disabled={!this.state.selectedCourse} onClick={this.handleImport}>{t('common:import')}</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}


// PROPERTIES //

ImportCourseModal.propTypes = {
	close: PropTypes.func.isRequired,
	copyNamespaceLessons: PropTypes.func.isRequired,
	namespaces: PropTypes.array,
	show: PropTypes.bool,
	t: PropTypes.func.isRequired,
	targetNamespace: PropTypes.object.isRequired
};

ImportCourseModal.defaultProps = {
	namespaces: [],
	show: false
};


// EXPORTS //

export default ImportCourseModal;
