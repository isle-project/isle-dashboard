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

import React, { useCallback, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import CreatableSelect from 'react-select/creatable';
import objectKeys from '@stdlib/utils/keys';
import isEmptyObject from '@stdlib/assert/is-empty-object';


// FUNCTIONS //

function createOptions( arr ) {
	return arr.map( ( tag ) => {
		return {
			value: tag,
			label: tag
		};
	});
}


// MAIN //

function TagWeightsEditor({ tagWeights, visibleTags, onUpdate }) {
	const { t } = useTranslation( 'assessments' );
	const tags = objectKeys( tagWeights );
	const [ newTag, setNewTag ] = useState( null );

	const handleChange = useCallback( ( event ) => {
		const weight = Number( event.target.value );
		const tag = event.target.getAttribute( 'data-tag' );
		const newWeights = { ...tagWeights };
		newWeights[ tag ] = weight;
		onUpdate( newWeights );
	}, [ tagWeights, onUpdate ] );

	const handleTagDeletion = useCallback( ( event ) => {
		const tag = event.target.getAttribute( 'data-tag' );
		const newWeights = { ...tagWeights };
		delete newWeights[ tag ];
		if ( isEmptyObject( newWeights ) ) {
			newWeights[ '_default_tag' ] = 1;
		}
		onUpdate( newWeights );
	}, [ tagWeights, onUpdate ] );

	const handleTagCreation = useCallback( ( elem ) => {
		if ( elem && elem.value && tagWeights[ elem.value ] === void 0 ) {
			const { value } = elem;
			const newWeights = { ...tagWeights };
			newWeights[ value ] = tagWeights[ '_default_tag' ] ?? 0;
			setNewTag( null );
			onUpdate( newWeights );
		}
	}, [ tagWeights, onUpdate ] );

	const inputs = new Array( tags.length );
	const hideWeights = tags.length === 1 && tags[ 0 ] === '_default_tag';
	if ( !hideWeights ) {
		for ( let i = 0; i < tags.length; i++ ) {
			const tag = tags[ i ];
			const weight = tagWeights[ tag ];
			inputs[ i ] = ( <Form.Group className="mb-1" as={Row} key={`tag-${i}`} >
				<Form.Label column sm={5} >{tag === '_default_tag' ? t( 'other' ) : tag}</Form.Label>
				<Col sm={5} >
					<Form.Control
						type="number"
						value={weight}
						onChange={handleChange}
						data-tag={tag}
						placeholder={t( 'weight-placeholder' )}
						min={0}
					/>
				</Col>
				<Col sm={2} >
					<Button variant="outline-secondary" onClick={handleTagDeletion} data-tag={tag} size="xm" >
						<i className="fa fa-times" style={{ pointerEvents: 'none' }} />
					</Button>
				</Col>
			</Form.Group> );
		}
	}
	inputs.reverse();
	return (
		<Fragment>
			{inputs}
			<Form.Group className="mb-1" as={Row} >
				<Col sm={5} >
					<CreatableSelect
						options={createOptions( visibleTags.filter( tag => tagWeights?.[ tag ] === void 0 ) )}
						onChange={handleTagCreation}
						placeholder={t('select-a-new-tag')}
						value={newTag}
					/>
				</Col>
				<Form.Label className="assessments-info" column sm={5} >{t( 'add-new-weight' )}</Form.Label>
				<Col sm={2} >

				</Col>
			</Form.Group>
		</Fragment>
	);
}


// PROPERTIES //

TagWeightsEditor.propTypes = {
	onUpdate: PropTypes.func.isRequired,
	tagWeights: PropTypes.object,
	visibleTags: PropTypes.array.isRequired
};

TagWeightsEditor.defaultProps = {
	tagWeights: {
		'_default_tag': 1
	}
};


// EXPORTS //

export default TagWeightsEditor;
