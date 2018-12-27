// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/lib/Creatable';
import contains from '@stdlib/assert/contains';


// VARIABLES //

const components = {
	DropdownIndicator: null
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

	handleInputChange = ( inputValue ) => {
		this.setState({
			inputValue
		});
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
				components={components}
				inputValue={inputValue}
				isClearable={this.props.isClearable}
				isMulti
				menuIsOpen={false}
				onChange={this.handleChange}
				onInputChange={this.handleInputChange}
				onKeyDown={this.handleKeyDown}
				placeholder="Enter email addresses..."
				value={value}
			/>
		);
	}
}


// PROPERTIES //

TextSelect.propTypes = {
	defaultValue: PropTypes.array,
	isClearable: PropTypes.bool,
	onChange: PropTypes.func
};

TextSelect.defaultProps = {
	defaultValue: [],
	isClearable: false,
	onChange() {}
};


// EXPORTS //

export default TextSelect;
