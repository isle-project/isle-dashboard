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
import { withTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
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

export function validateTitle( title ) {
	return title.length >= 3 && !contains( title, ' ' ) && !checkURLPath( title );
}

export function validateDescription( description ) {
	return description.length >= 3;
}


// MAIN //

class CreateNamespace extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			title: '',
			description: '',
			owners: [ this.props.user.email ]
		};
	}

	handleInputChange = ( event ) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[ name ]: value
		});
	};

	handleSubmit = () => {
		this.props.createNamespace({
			title: this.state.title,
			description: this.state.description,
			owners: this.state.owners,
			props: this.props
		});
	};

	handleOwnerChange = ( newValue ) => {
		if ( !newValue ) {
			return this.setState({
				owners: []
			});
		}
		const owners = newValue.map( x => trim( x.value ) );
		this.setState({
			owners: owners
		});
	};

	render() {
		const validTitle = validateTitle( this.state.title );
		const invalidTitleChars = checkURLPath( this.state.title );
		const validDescription = validateDescription( this.state.description );
		const validOwners = validateOwners( this.state.owners );
		debug( 'Validation status of input fields: ' );
		debug( `Title: ${validTitle}` );
		debug( `Description: ${validDescription}` );
		debug( `Owners: ${validOwners}` );
		const { t } = this.props;
		return (
			<div className="create-namespace-container" >
				<Card className="create-namespace-card" >
					<Card.Header>
						<Card.Title as="h2" >{t('create-course')}</Card.Title>
					</Card.Header>
					<Form style={{ padding: '20px' }}>
						<OverlayTrigger placement="right" overlay={<Tooltip id="ownerTooltip">{t('owner-tooltip')}</Tooltip>}>
							<FormGroup controlId="form-owners" >
								<FormLabel>{t('common:owners')}</FormLabel>
								<TextSelect
									id="owners-text-select"
									onChange={this.handleOwnerChange}
									defaultValue={this.state.owners}
									isInvalid={!validOwners}
									placeholder={t('enter-emails')}
								/>
								<FormControl.Feedback type="invalid">
									{t('invalid-owners')}
								</FormControl.Feedback>
							</FormGroup>
						</OverlayTrigger>
						<OverlayTrigger placement="right" overlay={<Tooltip id="courseTooltip" >{t('accessible-at')}<code>{SERVER+'/<course>/<lesson>'}</code></Tooltip>}>
							<FormGroup controlId="form-course" >
								<FormLabel>{t('common:course')}</FormLabel>
								<FormControl
									name="title"
									type="text"
									placeholder={t('course-placeholder')}
									onChange={this.handleInputChange}
									isInvalid={this.state.title && !validTitle}
								/>
								<FormControl.Feedback type="invalid">
									{ invalidTitleChars ?
										'Course identifier contains invalid character(s): '+invalidTitleChars[ 0 ] :
										'Course identifier must be at least three characters long and should not contain any spaces.'
									}
								</FormControl.Feedback>
							</FormGroup>
						</OverlayTrigger>
						<OverlayTrigger placement="right" overlay={<Tooltip id="titleTooltip">{t('title-tooltip')}</Tooltip>}>
							<FormGroup controlId="form-description" >
								<FormLabel>{t('title-description')}</FormLabel>
								<FormControl
									name="description"
									type="text"
									placeholder={t('title-placeholder')}
									onChange={this.handleInputChange}
									isInvalid={this.state.description && !validDescription}
								/>
								<FormControl.Feedback type="invalid">
									{t('invalid-description')}
								</FormControl.Feedback>
							</FormGroup>
						</OverlayTrigger>
					</Form>
					<Button
						variant="success"
						onClick={this.handleSubmit}
						disabled={!validOwners || !validTitle || !validDescription}
						block
					>{t('common:create')}</Button>
				</Card>
			</div>
		);
	}
}


// PROPERTIES //

CreateNamespace.propTypes = {
	createNamespace: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

CreateNamespace.defaultProps = {
};


// EXPORTS //

export default withTranslation( [ 'namespace', 'common' ] )( CreateNamespace );
