// MODULES //

import React, { Component, Fragment } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './editable_progress.css';


// MAIN //

class EditableProgress extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isEditing: false,
			hasChanged: false,
			newProgress: props.progress
		};
	}

	toggleEditing = () => {
		this.setState({
			isEditing: !this.state.isEditing
		});
	}

	handleChange = ( event ) => {
		this.setState({
			newProgress: event.target.value,
			hasChanged: true
		});
	}

	handleSubmit = () => {
		this.setState({
			isEditing: false,
			hasChanged: false
		});
		this.props.onSubmit( this.state.newProgress );
	}

	render() {
		const { progress } = this.props;
		return (
			this.state.isEditing ?
			<Fragment>
				<input
					type="number"
					value={this.state.newProgress}
					min={0}
					max={100}
					onChange={this.handleChange}
					className="editable-progress-input"
				/>
				<span className="editable-progress-submit" style={{ display: this.state.hasChanged ? 'inline' : 'none' }}>
					<i
						role="button" tabIndex={0}
						onClick={this.handleSubmit}
						onKeyPress={this.handleSubmit}
						className="fas fa-check-square"
					></i>
				</span>
			</Fragment>: <ProgressBar
				style={{
					fontSize: '10px', height: '12px'
				}}
				now={progress}
				label={`${progress}%`}
				onClick={this.toggleEditing}
			/>
		);
	}
}


// EXPORTS //

export default EditableProgress;
