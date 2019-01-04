// MODULES //

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import saveAs from 'utils/file_saver.js';


// MAIN //

class ActionsPage extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			anonymized: true
		};
	}

	retrieveActions = () => {
		this.props.getNamespaceActions({
			namespaceID: this.props.namespace._id,
			token: this.props.user.token
		}, ( err, res, body ) => {
			const blob = new Blob([ body ], {
				type: 'application/json'
			});
			const name = `actions_${this.props.namespace.title}.json`;
			saveAs( blob, name );
		});
	}

	handleRadioChange = ( val ) => {
		this.setState({
			anonymized: !this.state.anonymized
		});
	}

	render() {
		return ( <div className="namespace-data-page">
			<h1>Export Actions</h1>
			<ToggleButtonGroup
				name="options"
				onChange={this.handleRadioChange}
				type="radio"
				size="small"
				value={this.state.anonymized}
			>
				<ToggleButton
					size="sm"
					variant="light"
					value={false}
					style={{
						fontSize: '12px',
						color: this.state.anonymized ? '#A9A9A9' : 'black'
					}}
				>Original</ToggleButton>
				<ToggleButton
					size="sm"
					variant="light"
					value={true}
					style={{
						fontSize: '12px',
						color: this.state.anonymized ? 'black' : '#A9A9A9'
					}}
				>Anonymized</ToggleButton>
			</ToggleButtonGroup>
			<Button onClick={this.retrieveActions}>Save all namespace actions</Button>
		</div> );
	}
}


// PROPERTIES //

ActionsPage.propTypes = {
	getNamespaceActions: PropTypes.func.isRequired,
	namespace: PropTypes.object.isRequired
};

ActionsPage.defaultProps = {
};


// EXPORTS //

export default ActionsPage;
