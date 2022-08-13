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
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import FormGroup from 'react-bootstrap/FormGroup';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import logger from 'debug';
import isEmail from '@stdlib/assert/is-email-address';
import trim from '@stdlib/string/trim';
import contains from '@stdlib/assert/contains';
import TextSelect from 'components/text-select';
import SERVER from 'constants/server';
import checkURLPath from '../../utils/check_url_path';
import './create_namespace.css';


// VARIABLES //

const debug = logger( 'isle-dashboard:create-namespace' );


// FUNCTIONS //

/**
 * Validates that a list of owners contains only email addresses.
 *
 * @private
 * @param {Array<string>} owners - list of owners
 * @returns {boolean} boolean indicating if the list of owners contains only email addresses
 */
export function validateOwners( owners ) {
	let invalid = false;
	if ( owners.length === 0 ) {
		invalid = true;
	} else {
		owners.forEach( owner => {
			if ( !isEmail( owner ) ) {
				invalid = true;
			}
		});
	}
	if ( invalid ) {
		return false;
	}
	return true;
}

/**
 * Validates a namespace name.
 *
 * @private
 * @param {string} title - namespace name
 * @returns {boolean} boolean indicating if the namespace name is valid
 */
export function validateTitle( title ) {
	return title && title.length >= 3 && !contains( title, ' ' ) && !checkURLPath( title );
}

/**
 * Validates a namespace description.
 *
 * @private
 * @param {string} description - namespace description
 * @returns {boolean} boolean indicating if the namespace description is valid
 */
export function validateDescription( description ) {
	return description && description.length >= 3;
}


// MAIN //

/**
 * A component for creating a new namespace.
 *
 * @param {Object} props - component properties
 * @param {Object} props.user - user object
 * @param {Function} props.createNamespace - callback function for creating a new namespace with the specified title, description, and owners
 * @returns {ReactElement} component for creating a new namespace
 */
const CreateNamespace = ( props ) => {
	const [ title, setTitle ] = useState( '' );
	const [ description, setDescription ] = useState( '' );
	const [ owners, setOwners ] = useState( [ props.user.email ] );
	const [ tag, setTag ] = useState( null );
	const { t } = useTranslation( [ 'namespace', 'common' ] );

	const handleSubmit = () => {
		props.createNamespace({
			title,
			description,
			owners,
			tag,
			props
		});
	};
	const handleOwnerChange = ( newValue ) => {
		if ( !newValue ) {
			setOwners( [] );
		}
		const newOwners = newValue.map( x => trim( x.value ) );
		setOwners( newOwners );
	};
	const handleTitleChange = ( event ) => {
		const value = event.target.value;
		setTitle( value );
	};
	const handleDescriptionChange = ( event ) => {
		const value = event.target.value;
		setDescription( value );
	};
	const handleTagChange = ( event ) => {
		const value = event.target.value;
		setTag( value );
	};
	const validTitle = validateTitle( title );
	const invalidTitleChars = checkURLPath( title );
	const validDescription = validateDescription( description );
	const validOwners = validateOwners( owners );
	debug( 'Validation status of input fields: ' );
	debug( `Title: ${validTitle}` );
	debug( `Description: ${validDescription}` );
	debug( `Owners: ${validOwners}` );
	return (
		<div className="create-namespace-container" >
			<Card className="create-namespace-card" >
				<Card.Header>
					<Card.Title as="h2" >{t('create-course')}</Card.Title>
				</Card.Header>
				<Form style={{ padding: '20px' }}>
					<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">{t('owner-tooltip')}</Tooltip>}>
						<FormGroup className="mb-3" controlId="form-owners" as={Row} >
							<FormLabel column sm={3} >{t('common:owners')}</FormLabel>
							<Col sm={9} >
								<TextSelect
									id="owners-text-select"
									onChange={handleOwnerChange}
									defaultValue={owners}
									isInvalid={!validOwners}
									placeholder={t('enter-emails')}
								/>
								{!validOwners && <Alert variant="danger" >
									{t('invalid-owners')}
								</Alert>}
							</Col>
						</FormGroup>
					</OverlayTrigger>
					<OverlayTrigger placement="right" overlay={<Tooltip id="courseTooltip" >{t('accessible-at')}<code>{SERVER+'/<course>/<lesson>'}</code></Tooltip>}>
						<FormGroup className="mb-3" controlId="form-course" as={Row} >
							<FormLabel column sm={3} >{t('common:course')}</FormLabel>
							<Col sm={9} >
								<FormControl
									name="title"
									type="text"
									placeholder={t('course-placeholder')}
									onChange={handleTitleChange}
									isInvalid={title && !validTitle}
								/>
								<FormControl.Feedback type="invalid">
									{ invalidTitleChars ?
										'Course identifier contains invalid character(s): '+invalidTitleChars[ 0 ] :
										'Course identifier must be at least three characters long and should not contain any spaces.'
									}
								</FormControl.Feedback>
							</Col>
						</FormGroup>
					</OverlayTrigger>
					<OverlayTrigger placement="right" overlay={<Tooltip id="titleTooltip">{t('title-tooltip')}</Tooltip>}>
						<FormGroup className="mb-3" controlId="form-description" as={Row} >
							<FormLabel column sm={3} >{t('title-description')}</FormLabel>
							<Col sm={9} >
								<FormControl
									name="description"
									type="text"
									placeholder={t('title-placeholder')}
									onChange={handleDescriptionChange}
									isInvalid={description && !validDescription}
								/>
								<FormControl.Feedback type="invalid">
									{t('invalid-description')}
								</FormControl.Feedback>
							</Col>
						</FormGroup>
					</OverlayTrigger>
					<OverlayTrigger placement="right" overlay={<Tooltip id="tagTooltip">{t('tag-tooltip')}</Tooltip>}>
						<FormGroup className="mb-3" controlId="form-tag" as={Row} >
							<FormLabel column sm={3} >{t('common:tag')}</FormLabel>
							<Col sm={9} >
								<FormControl
									name="description"
									type="text"
									placeholder={t('tag-placeholder')}
									onChange={handleTagChange}
									isInvalid={description && !validDescription}
								/>
								<FormControl.Feedback type="invalid">
									{t('invalid-tag')}
								</FormControl.Feedback>
							</Col>
						</FormGroup>
					</OverlayTrigger>
				</Form>
				<Button
					variant="success"
					onClick={handleSubmit}
					disabled={!validOwners || !validTitle || !validDescription}
					block
				>{t('common:create')}</Button>
			</Card>
		</div>
	);
};


// PROPERTIES //

CreateNamespace.propTypes = {
	createNamespace: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

CreateNamespace.defaultProps = {
};


// EXPORTS //

export default CreateNamespace;
