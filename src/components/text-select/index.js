// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import copy from 'clipboard-copy';
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import contains from '@stdlib/assert/contains';


// VARIABLES //

const customComponents = {
	DropdownIndicator: null,
	MultiValueLabel: props => {
		return (
			<OverlayTrigger
				overlay={<Tooltip id="copy_tooltip">Click to copy to clipboard</Tooltip>}
				placement="bottom"
			>
				<span onClick={() => {
					copy( props.data.label );
				}} style={{ cursor: 'copy' }}>
					<components.MultiValueLabel {...props} />
				</span>
			</OverlayTrigger>
		);
	}
};

const createOption = ( label ) => ({
	label,
	value: label
});


// MAIN //

class TextSelect extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			inputValue: '',
			value: props.defaultValue.map( createOption )
		};
	}

	handleChange = ( value ) => {
		this.setState({ value });
		this.props.onChange( value );
	}

	handleInputChange = ( inputValue, action ) => {
		if ( action.action !== 'input-blur' && action.action !== 'menu-close' ) {
			this.setState({
				inputValue
			});
		}
	}

	handleKeyDown = ( event ) => {
		let { inputValue, value } = this.state;
		if ( !inputValue ) {
			return;
		}
		switch ( event.key ) {
			case 'Enter':
			case 'Tab':
				if ( contains( inputValue, ',' ) ) {
					inputValue = inputValue.split( ',' );
				} else {
					inputValue = [ inputValue ];
				}
				this.setState({
					inputValue: '',
					value: [
						...value, ...inputValue.map( createOption )
					]
				}, () => {
					this.props.onChange( this.state.value );
				});
				event.preventDefault();
		}
	}

	render() {
		const { inputValue, value } = this.state;
		return (
			<CreatableSelect
				components={customComponents}
				inputValue={inputValue}
				isClearable={this.props.isClearable}
				isMulti
				menuIsOpen={false}
				onChange={this.handleChange}
				onInputChange={this.handleInputChange}
				onKeyDown={this.handleKeyDown}
				placeholder="Enter email addresses..."
				value={value}
				styles={this.props.styles}
			/>
		);
	}
}


// PROPERTIES //

TextSelect.propTypes = {
	defaultValue: PropTypes.array,
	isClearable: PropTypes.bool,
	onChange: PropTypes.func,
	styles: PropTypes.object
};

TextSelect.defaultProps = {
	defaultValue: [],
	isClearable: false,
	onChange() {},
	styles: {}
};


// EXPORTS //

export default TextSelect;
