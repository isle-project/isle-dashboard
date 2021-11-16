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
import { DateRangePicker } from 'react-dates';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import 'react-dates/lib/css/_datepicker.css';


// FUNCTIONS //

class CustomDatePicker extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			startDate: props.startDate,
			endDate: props.endDate
		};
	}

	componentDidUpdate( prevProps ) {
		if (
			this.props.startDate !== prevProps.startDate ||
			this.props.endDate !== prevProps.endDate
		) {
			this.setState({
				startDate: this.props.startDate,
				endDate: this.props.endDate
			});
		}
	}

	handleDatesChange = ({ startDate, endDate }) => {
		this.setState({
			startDate,
			endDate
		}, () => {
			this.props.onDatesChange( this.state );
		});
	};

	handleReset = () => {
		this.setState({
			startDate: this.props.minDate,
			endDate: this.props.maxDate
		}, () => {
			this.props.onDatesChange( this.state );
		});
	};

	render() {
		return (
			<Fragment>
				<DateRangePicker
					startDate={this.state.startDate}
					endDate={this.state.endDate}
					startDateId="start_date_input"
					endDateId="end_date_input"
					onDatesChange={this.handleDatesChange}
					focusedInput={this.state.focusedInput}
					onFocusChange={focusedInput => this.setState({ focusedInput })}
					isOutsideRange={() => false}
				/>
				<Button
					aria-label={this.props.t('common:close')}
					variant="warning"
					onClick={this.handleReset}
					style={{
						paddingTop: 8,
						paddingLeft: 16,
						paddingRight: 16,
						paddingBottom: 8,
						fontSize: 20
					}}
				>x</Button>
			</Fragment>
		);
	}
}

const DefaultCell = ( row ) => {
	return new Date( row.value ).toLocaleString();
};


// MAIN //

function createBooleanColumn({ Header, accessor, Cell, style, startDate, endDate, t, maxWidth = 150 }) {
	return {
		Header,
		accessor,
		style,
		Cell: Cell || DefaultCell,
		filterMethod: ( filter, row ) => {
			if ( !filter.value ) {
				return true;
			}
			const { startDate, endDate } = filter.value;
			const id = filter.pivotId || filter.id;
			const value = row[ id ].getTime();
			if ( startDate && endDate ) {
				return value >= startDate.valueOf() && value <= endDate.valueOf();
			}
			if ( startDate ) {
				return value >= startDate.valueOf();
			}
			if ( endDate ) {
				return value <= endDate.valueOf();
			}
			return true;
		},
		Filter: ({ filter, onChange }) => {
			const filterValue = filter ? ( filter.value || {} ) : {};
			const popover = <Popover id="popover-data" style={{ maxWidth: 400 }}>
				<Popover.Header as="h3">{t('common:dates')}</Popover.Header>
				<Popover.Body style={{ backgroundColor: 'grey' }} >
					<CustomDatePicker
						startDate={filterValue.startDate || startDate}
						minDate={startDate}
						maxDate={endDate}
						endDate={filterValue.endDate || endDate}
						onDatesChange={({ startDate, endDate }) => {
							onChange({ startDate, endDate });
						}}
						t={t}
					/>
				</Popover.Body>
			</Popover>;
			return (
				<OverlayTrigger trigger="click" placement="right" overlay={popover}>
					<Button aria-label={t('common:toggle-calendar')} size="sm" style={{ float: 'left', marginLeft: 6 }} variant="secondary" >
						<i className="far fa-calendar-alt"></i>
					</Button>
				</OverlayTrigger>
			);
		},
		maxWidth: maxWidth
	};
}


// EXPORTS //

export default createBooleanColumn;
