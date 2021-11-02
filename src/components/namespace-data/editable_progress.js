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
	};

	handleChange = ( event ) => {
		this.setState({
			newProgress: clamp( event.target.value, 0, 100 ),
			hasChanged: true
		});
	};

	handleSubmit = () => {
		this.setState({
			isEditing: false,
			hasChanged: false
		});
		this.props.onSubmit( this.state.newProgress );
	};

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
				aria-label="new-progress"
				style={{
					fontSize: '10px',
					height: '12px'
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
