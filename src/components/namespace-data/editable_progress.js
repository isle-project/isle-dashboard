// MODULES //

import React, { Component, Fragment } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import clamp from '@stdlib/math/base/special/clamp';
import './editable_progress.css';


// MAIN //

class EditableProgress extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isEditing: false,
			hasChanged: false,
			newProgress: props.progress,
			originalProgress: props.progress
		};
	}

	static getDerivedStateFromProps( nextProps, prevState ) {
		if ( nextProps.progress !== prevState.originalProgress ) {
			return {
				newProgress: nextProps.progress,
				originalProgress: nextProps.progress
			};
		}
		return null;
	}

	toggleEditing = () => {
		this.setState({
			isEditing: !this.state.isEditing,
			newProgress: this.props.progress
		});
	}

	handleChange = ( event ) => {
		this.setState({
			newProgress: clamp( event.target.value, 0, 100 ),
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
				<i
					role="button" tabIndex={0}
					onClick={this.toggleEditing}
					onKeyPress={this.toggleEditing}
					className="fas fa-window-close editable-progress-close"
				></i>
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
				now={this.state.newProgress}
				label={`${this.state.newProgress}%`}
				onClick={this.toggleEditing}
			/>
		);
	}
}


// EXPORTS //

export default EditableProgress;
