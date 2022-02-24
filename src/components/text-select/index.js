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
import copy from 'clipboard-copy';
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import isObjectArray from '@stdlib/assert/is-object-array';
import isEmptyString from '@stdlib/assert/is-empty-string';
import contains from '@stdlib/assert/contains';
import isNull from '@stdlib/assert/is-null';
import trim from '@stdlib/string/trim';
import './text_select.css';


// VARIABLES //

const customStyles = {
	clearIndicator: ( provided, state ) => ({
		...provided,
		cursor: 'pointer'
	}),
	multiValueRemove: ( provided, state ) => ({
		...provided,
		cursor: 'pointer'
	}),
	valueContainer: ( provided, state ) => ({
		...provided,
		cursor: 'text'
	})
};


// FUNCTIONS //

/**
 * Returns a select option object.
 *
 * @private
 * @param {string} label - option label
 * @returns {Object} option object
 */
const createOption = ( label ) => ({
	label,
	value: label
});

/**
 * Maps elements of an array to option objects.
 *
 * @private
 * @param {Array} arr - array of elements
 * @returns {Array} array of option objects
 */
const toOptions = ( arr ) => {
	if ( isNull( arr ) ) {
		return null;
	}
	if ( isObjectArray( arr ) && arr[ 0 ].label && arr[ 0 ].value ) {
		return arr;
	}
	return arr.map( createOption );
};


// MAIN //

class TextSelect extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			inputValue: '',
			value: toOptions( props.defaultValue )
		};
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.defaultValue !== prevProps.defaultValue ) {
			this.setState({
				value: toOptions( this.props.defaultValue )
			});
		}
	}

	handleChange = ( value ) => {
		this.setState({ value });
		this.props.onChange( value );
	};

	handleInputChange = ( inputValue, action ) => {
		if ( action.action === 'menu-close' ) {
			this.addInputValues();
		}
		else if ( action.action !== 'input-blur' ) {
			this.setState({
				inputValue
			});
		}
	};

	addInputValues = () => {
		let { inputValue, value } = this.state;
		if ( !inputValue ) {
			return null;
		}
		if ( contains( inputValue, ',' ) ) {
			inputValue = inputValue.split( ',' )
				.map( x => trim( x ) )
				.filter( x => !isEmptyString( x ) );
		} else {
			inputValue = [ trim( inputValue ) ];
		}
		let newValue;
		if ( value ) {
			newValue = value.concat( inputValue.map( createOption ) );
		} else {
			newValue = inputValue.map( createOption );
		}
		this.setState({
			inputValue: '',
			value: newValue
		}, () => {
			this.props.onChange( this.state.value );
		});
	};

	handleKeyDown = ( event ) => {
		switch ( event.key ) {
			case 'Enter':
			case 'Tab': {
				this.addInputValues();
			}
		}
	};

	render() {
		const { inputValue, value } = this.state;
		const isInvalid = this.props.isInvalid;
		const control = ( provided, state ) => {
			const out = {
				...provided
			};
			if ( state.isFocused && isInvalid ) {
				out.boxShadow = '0 0 0 0.2rem rgba(220,53,69,0.25)';
			}
			out.borderColor = isInvalid ? '#dc3545' : '#ddd';
			out[ '&:hover' ] = {
				borderColor: isInvalid ? '#dc3545' : '#ddd'
			};
			return out;
		};
		const customComponents = {
			DropdownIndicator: null,
			MultiValueLabel: props => {
				const copyToClipboard = () => {
					copy( props.data.label );
				};
				return (
					<OverlayTrigger
						overlay={<Tooltip id="copy_tooltip">{this.props.t('copy-tooltip')}</Tooltip>}
						placement="bottom"
					>
						<span
							role="button" tabIndex={0}
							onClick={copyToClipboard} onKeyPress={copyToClipboard}
							className="text-select-copy"
							aria-label={this.props.t('copy-tooltip')}
						>
							<components.MultiValueLabel {...props} />
						</span>
					</OverlayTrigger>
				);
			}
		};
		return (
			<CreatableSelect
				inputId={this.props.id}
				components={customComponents}
				inputValue={inputValue}
				isClearable={this.props.isClearable}
				isMulti
				menuIsOpen={false}
				onChange={this.handleChange}
				onInputChange={this.handleInputChange}
				onKeyDown={this.handleKeyDown}
				placeholder={this.props.placeholder}
				value={value}
				styles={{ ...customStyles, control: control, ...this.props.styles }}
				t={this.props.t}
			/>
		);
	}
}


// PROPERTIES //

TextSelect.propTypes = {
	defaultValue: PropTypes.array,
	id: PropTypes.string,
	isClearable: PropTypes.bool,
	isInvalid: PropTypes.bool,
	onChange: PropTypes.func,
	placeholder: PropTypes.string,
	styles: PropTypes.object
};

TextSelect.defaultProps = {
	defaultValue: [],
	id: null,
	isClearable: false,
	isInvalid: false,
	onChange() {},
	placeholder: '',
	styles: {}
};


// EXPORTS //

export default withTranslation( [ 'text_select', 'common' ] )( TextSelect );
