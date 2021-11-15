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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SelectInput from 'react-select';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


// MAIN //

/**
* A modal dialog for importing an existing course into a namespace.
*
* @param {Object} props - component props
* @param {boolean} props.show - boolean indicating whether the modal is visible
* @param {Function} props.close - callback to hide the modal
* @param {Function} props.copyNamespaceLessons - callback to copy a course's lessons into a namespace
* @param {Object} props.targetNamespace - target namespace
* @param {Object} props.namespaces - available namespaces
* @param {Function} props.t - translation function
* @returns {ReactElement} modal dialog
*/
const ImportCourseModal = ({ namespaces, show, close, targetNamespace, copyNamespaceLessons, t }) => {
	const [ selectedCourse, setSelectedCourse ] = useState( null );

	const handleSelection = ( obj ) => {
		setSelectedCourse( obj.value );
	};
	const handleImport = async () => {
		const res = await copyNamespaceLessons({
			source: selectedCourse.title,
			target: targetNamespace.title
		});
		if ( res instanceof Error === false ) {
			close();
		}
	};
	const options = namespaces.map( x => {
		return {
			label: x.title,
			value: x
		};
	});
	return (
		<Modal size="lg" show={show} onHide={close}>
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
						onChange={handleSelection}
					/>
				</Form.Group>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={close}>{t('common:cancel')}</Button>
				<Button variant="success" disabled={!selectedCourse} onClick={handleImport}>{t('common:import')}</Button>
			</Modal.Footer>
		</Modal>
	);
};


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
