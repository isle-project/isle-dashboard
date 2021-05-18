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
import PropTypes from 'prop-types';
import logger from 'debug';
import { withTranslation } from 'react-i18next';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Tooltip from 'react-bootstrap/Tooltip';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';
import Plotly from 'react-plotly.js';
import round from '@stdlib/math/base/special/round';
import objectKeys from '@stdlib/utils/keys';
import pluck from '@stdlib/utils/pluck';
import uppercase from '@stdlib/string/uppercase';
import SearchBar from 'components/searchbar';
import server from 'constants/server';
import COLORS from 'constants/colors';
import saveAs from 'utils/file_saver.js';
import obsToVar from '@isle-project/utils/obs-to-var';
import DashboardDataExplorer from 'ev/components/data-explorer';


// FUNCTIONS //

function diff( y ) {
	const out = [];
	if ( !y ) {
		return out;
	}
	for ( let i = 1; i < y.length; i++ ) {
		const v = y[ i ] - y[ i-1 ];
		out.push( v );
	}
	return out;
}

function reverse( side ) {
	switch ( side ) {
		case 'left':
			return 'right';
		case 'right':
			return 'left';
		case 'up':
			return 'down';
		case 'down':
			return 'up';
	}
}


// VARIABLES //

const debug = logger( 'isle-dashboard:admin' );
const POSITIONS = [ 0, 0.9, 0.1, 0.8, 0.2, 0.7, 0.3 ];
const COLOR_MAPPING = {
	users: COLORS[ 0 ],
	namespaces: COLORS[ 1 ],
	lessons: COLORS[ 2 ],
	cohorts: COLORS[ 3 ],
	files: COLORS[ 4 ],
	events: COLORS[ 5 ],
	sessionData: COLORS[ 7 ],
	dailyActiveUsers: COLORS[ 8 ],
	weeklyActiveUsers: COLORS[ 9 ],
	monthlyActiveUsers: COLORS[ 10 ],
	tickets: COLORS[ 11 ],
	closedTickets: COLORS[ 12 ],
	openTickets: COLORS[ 13 ]
};
const DATA_KEY_MAPPING = {
	users: 'nUsers',
	namespaces: 'nNamespaces',
	lessons: 'nLessons',
	cohorts: 'nCohorts',
	files: 'nFiles',
	events: 'nEvents',
	sessionData: 'nSessionData',
	tickets: 'nTickets',
	openTickets: 'nOpenTickets',
	closedTickets: 'nClosedTickets',
	dailyActiveUsers: 'dailyActiveUsers',
	weeklyActiveUsers: 'weeklyActiveUsers',
	monthlyActiveUsers: 'monthlyActiveUsers'
};
const DISPLAY_IN_PLOT = {
	users: false,
	namespaces: false,
	lessons: false,
	cohorts: false,
	files: false,
	events: false,
	sessionData: false,
	dailyActiveUsers: false,
	weeklyActiveUsers: false,
	monthlyActiveUsers: false,
	tickets: false,
	openTickets: false,
	closedTickets: false
};
const BUTTONS_TO_REMOVE = [
	'sendDataToCloud',
	'zoom2d',
	'pan2d',
	'select2d',
	'zoomIn2d',
	'zoomOut2d',
	'autoScale2d',
	'resetScale2d',
	'hoverClosestCartesian',
	'hoverCompareCartesian',
	'toggleHover',
	'toggleSpikelines',
	'resetViews'
];


// MAIN //

class Overview extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			displayInPlot: {
				...DISPLAY_IN_PLOT,
				users: true
			},
			revision: 0,
			filteredActionTypes: props.statistics.actionTypes,
			historicalActionTypes: null,
			useDifferencing: false,
			dataExplorer: 'hidden'
		};
	}

	componentDidMount() {
		this.props.getOverviewStatistics();
		const last = this.props.historicalStatistics[ this.props.historicalStatistics.length-1 ];
		if ( last && last.updatedAt ) {
			const date = new Date( last.updatedAt );
			const year = date.getFullYear();
			const month = date.getMonth();
			const dayOfMonth = date.getDate();
			debug( `Latest data from ${month}/${dayOfMonth}/${year}...` );
			const currentDate = new Date();
			const currentYear = currentDate.getFullYear();
			const currentMonth = currentDate.getMonth();
			const currentDayOfMonth = currentDate.getDate();
			debug( `Current date is ${currentMonth}/${currentDayOfMonth}/${currentYear}` );
			if (
				currentYear > year ||
				currentMonth > month ||
				currentDayOfMonth > dayOfMonth
			) {
				debug( 'Request historical data from server...' );
				this.props.getHistoricalOverviewStats();
			}
		} else {
			debug( 'Retrieve overview data...' );
			this.props.getHistoricalOverviewStats();
		}
		if ( this.props.historicalStatistics ) {
			this.extractHistoricalActionTypes();
		}
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.statistics.actionTypes !== prevProps.statistics.actionTypes ) {
			this.setState({
				filteredActionTypes: this.props.statistics.actionTypes
			});
		}
		if (
			this.props.historicalStatistics.length !== prevProps.historicalStatistics.length
		) {
			this.extractHistoricalActionTypes();
		}
	}

	extractHistoricalActionTypes() {
		debug( 'Extract and format action types for time series display...' );
		const actionTypes = pluck( this.props.historicalStatistics, 'actionTypes' );
		const out = {};
		for ( let i = 0; i < actionTypes.length; i++ ) {
			if ( !actionTypes[ i ] ) {
				continue;
			}
			for ( let j = 0; j < actionTypes[ i ].length; j++ ) {
				const action = actionTypes[ i ][ j ];
				const name = action._id.type;
				if ( !out[ name ] ) {
					out[ name ] = [];
				}
				out[ name ][ i ] = action.count;
			}
		}
		this.setState({
			historicalActionTypes: out
		});
	}

	renderTimeSeries() {
		let title = '';
		const data = this.props.historicalStatistics;
		const dates = pluck( data, 'createdAt' );
		const dateRange = [ dates[ 0 ], dates[ dates.length-1 ] ];
		const layout = {
			xaxis: {
				autorange: true,
				range: dateRange,
				rangeselector: {
					buttons: [
						{
							count: 7,
							label: '1w',
							step: 'day',
							stepmode: 'backward'
						},
						{
							count: 1,
							label: '1m',
							step: 'month',
							stepmode: 'backward'
						},
						{
							count: 6,
							label: '6m',
							step: 'month',
							stepmode: 'backward'
						},
						{
							step: 'all'
						}
					]
				},
				rangeslider: {
					range: dateRange
				},
				type: 'date',
				fixedrange: true
			},
			legend: {
				orientation: 'h'
			},
			margin: {
				l: 10,
				r: 15,
				b: 30,
				t: 30,
				pad: 10
			}
		};
		const keys = objectKeys( this.state.displayInPlot );
		const displayedData = [];
		const domain = [ 0, 1 ];
		for ( let i = 0; i < keys.length; i++ ) {
			const key = keys[ i ];
			if ( this.state.displayInPlot[ key ] === true ) {
				title += ( title === '' ) ? '' : ', ';
				title += this.props.t('common:'+key );
				let color;
				let y;
				if ( COLOR_MAPPING[ key ] ) {
					color = COLOR_MAPPING[ key ];
					y = pluck( data, DATA_KEY_MAPPING[ key ] );
				} else {
					// Case: displaying an action type
					color = COLORS[ ( i % COLORS.length ) + 7 ];
					y = this.state.historicalActionTypes[ key ];
				}
				if ( this.state.useDifferencing ) {
					y = diff( y );
				}
				const trace = {
					type: this.state.useDifferencing ? 'bar' : 'scatter',
					mode: 'line',
					name: this.props.t('common:'+key),
					x: dates,
					y: y,
					marker: {
						color
					}
				};
				if ( this.state.useDifferencing ) {
					trace.offsetgroup = displayedData.length;
				}
				const len = displayedData.length;
				if ( len > 0 ) {
					trace.yaxis = `y${len+1}`;
				}
				displayedData.push( trace );
				const yaxis = {
					title: this.props.t( 'common:'+key ),
					titlefont: { color },
					tickfont: { color },
					fixedrange: true
				};
				if ( displayedData.length > 1 ) {
					yaxis.overlaying = 'y';
				}
				if ( displayedData.length % 2 === 0 ) {
					yaxis.side = 'left';
					domain[ 0 ] += 0.1;
				} else {
					yaxis.side = 'right';
					domain[ 1 ] -= 0.1;
				}
				yaxis.position = POSITIONS[ displayedData.length ];
				if ( len === 0 ) {
					layout[ 'yaxis' ] = yaxis;
				} else {
					layout[ `yaxis${len+1}` ] = yaxis;
				}
			}
		}
		layout.xaxis.domain = domain;
		layout.title = `${!this.state.useDifferencing ? this.props.t('time-series-of') : this.props.t('daily-changes-of')}${title}`;
		if ( displayedData.length === 0 ) {
			return ( <Jumbotron
				style={{
					width: '100%',
					height: '73.7%'
				}}
			>
				<h3 style={{ textAlign: 'center', marginTop: '12%' }}>Select a variable to be displayed...</h3>
			</Jumbotron> );
		}
		return (
			<Fragment>
				<Plotly
					revision={this.state.revision}
					data={displayedData}
					config={{
						displayModeBar: 'hover',
						displaylogo: false,
						modeBarButtonsToRemove: BUTTONS_TO_REMOVE,
						modeBarButtonsToAdd: [
							{
								name: this.props.t('download-data'),
								icon: {
									'width': 857.1,
									'height': 1000,
									'path': 'm214-7h429v214h-429v-214z m500 0h72v500q0 8-6 21t-11 20l-157 156q-5 6-19 12t-22 5v-232q0-22-15-38t-38-16h-322q-22 0-37 16t-16 38v232h-72v-714h72v232q0 22 16 38t37 16h465q22 0 38-16t15-38v-232z m-214 518v178q0 8-5 13t-13 5h-107q-7 0-13-5t-5-13v-178q0-8 5-13t13-5h107q7 0 13 5t5 13z m357-18v-518q0-22-15-38t-38-16h-750q-23 0-38 16t-16 38v750q0 22 16 38t38 16h517q23 0 50-12t42-26l156-157q16-15 27-42t11-49z',
									'transform': 'matrix(1 0 0 -1 0 850)'
								},
								click: ( gd ) => {
									const blob = new Blob([ JSON.stringify( gd.data ) ], {
										type: 'application/json'
									});
									saveAs( blob, `stats_${title}.json` );
								}
							}
						]
					}}
					layout={layout}
					style={{
						width: '100%',
						height: '80%'
					}}
					useResizeHandler
				/>
				{displayedData.length > 0 ?
					<Fragment>
						<Button
							onClick={() => {
								this.setState({
									displayInPlot: {
										...DISPLAY_IN_PLOT
									},
									revision: this.state.revision + 1
								});
							}}
							style={{
								marginLeft: '35%'
							}}
						>{this.props.t('common:reset')}</Button>
						<Button
							onClick={() => {
								this.setState({
									useDifferencing: !this.state.useDifferencing
								});
							}}
							style={{
								marginLeft: '1%'
							}}
						>{this.state.useDifferencing ? 'Display Time Series' : this.props.t('display-daily-changes') }</Button>
					</Fragment> :
					null
				}
			</Fragment>
		);
	}

	hideExplorer = () => {
		this.setState({
			dataExplorer: 'hidden'
		});
	}

	renderDiskUsage() {
		if ( !this.props.statistics.database ) {
			return null;
		}
		let { fsUsedSize, fsTotalSize } = this.props.statistics.database;
		fsUsedSize /= ( 1024 * 1024 * 1024 );
		fsTotalSize /= ( 1024 * 1024 * 1024 );
		const usedSpace = round( fsUsedSize );
		const freeSpace = round( fsTotalSize - fsUsedSize );
		const { t } = this.props;
		return ( <Plotly
			data={[
				{
					values: [ usedSpace, freeSpace ],
					labels: [ `${t('used-space')}: ${usedSpace} GB`, `${t('free-space')}: ${freeSpace} GB` ],
					type: 'pie'
				}
			]}
			config={{
				displayModeBar: false,
				displaylogo: false
			}}
			layout={{
				plot_bgcolor: 'rgba(0,0,0,0.0)',
				paper_bgcolor: 'rgba(0,0,0,0.0)',
				xaxis: {
					fixedrange: true
				},
				yaxis: {
					fixedrange: true
				},
				autosize: true,
				margin: {
					l: 50,
					r: 50,
					b: 50,
					t: 50
				}
			}}
			useResizeHandler={true}
			style={{
				width: '75%',
				height: '200px'
			}}
		/> );
	}

	renderDatabaseStats() {
		const { t } = this.props;
		if ( !this.props.statistics.database ) {
			return null;
		}
		const { storageSize, dataSize, objects, avgObjSize } = this.props.statistics.database;
		return (
			<ListGroup variant="flush" style={{ fontSize: '1em' }}>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >{t('physical-storage-size')}: {storageSize}</ListGroup.Item>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >{t('reserved-storage-size')}: {dataSize}</ListGroup.Item>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >{t('number-of-objects')}: {objects} </ListGroup.Item>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >{t('average-object-size')}: {round( avgObjSize )}</ListGroup.Item>
			</ListGroup>
		);
	}

	renderDailyStatistics() {
		const { t } = this.props;
		const { dailyActiveUsers, weeklyActiveUsers, monthlyActiveUsers, lastHourActiveUsers } = this.props.statistics;
		return (
			<ListGroup variant="flush" style={{ fontSize: '1em' }}>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >
					{t('last-hour-active-users')}:
					<span style={{ float: 'right', marginRight: 56 }} >{lastHourActiveUsers}</span>
				</ListGroup.Item>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >
					<span>{t('daily-active-users')}:</span>
					<span style={{ float: 'right' }}>
						<span style={{ marginRight: 24 }} >{dailyActiveUsers}</span>
						{this.renderPlotButton( 'dailyActiveUsers', 'down' )}
					</span>
				</ListGroup.Item>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >
					<span>{t('weekly-active-users')}:</span>
					<span style={{ float: 'right' }}>
						<span style={{ marginRight: 24 }} >{weeklyActiveUsers}</span>
						{this.renderPlotButton( 'weeklyActiveUsers', 'down' )}
					</span>
				</ListGroup.Item>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >
					<span>{t('monthly-active-users')}:</span>
					<span style={{ float: 'right' }}>
						<span style={{ marginRight: 24 }} >{monthlyActiveUsers}</span>
						{this.renderPlotButton( 'monthlyActiveUsers', 'down' )}
					</span>
				</ListGroup.Item>
			</ListGroup>
		);
	}

	handleFilterChange = ( event ) => {
		const str = uppercase( event.target.value );
		const filtered = [];
		for ( let i = 0; i < this.props.statistics.actionTypes.length; i++ ) {
			const actionType = this.props.statistics.actionTypes[ i ];
			if ( actionType ) {
				const type = actionType._id.type || '';
				if ( type.includes( str ) ) {
					filtered.push( actionType );
				}
			}
		}
		this.setState({
			filteredActionTypes: filtered
		});
	}

	renderActionTypes() {
		const actionTypes = this.state.filteredActionTypes;
		if ( !actionTypes ) {
			return null;
		}
		return (
			<Fragment>
				<h2>
					{this.props.t('common:actions')}
					<OverlayTrigger placement="right" overlay={<Tooltip id="explorer-action-types-tooltip">{this.props.t('common:data-explorer')}</Tooltip>}>
						<Button
							onClick={() => {
								this.setState({
									dataExplorer: 'action-types'
								});
							}}
							style={{
								marginLeft: 12
							}}
						>
							<i className="fas fa-chart-bar" ></i>
						</Button>
					</OverlayTrigger>
					<SearchBar
						style={{
							position: 'absolute',
							top: 0,
							right: 8,
							width: 140,
							fontSize: '1.2rem'
						}}
						placeholder="Search..."
						onChange={this.handleFilterChange}
					/>
				</h2>
				<div className="action-types-table-container">
					<Table striped hover className="action-types-table" size="sm" >
						<thead>
							<tr>
								<th>{this.props.t('common:visualize')}</th>
								<th>{this.props.t('common:type')}</th>
								<th>{this.props.t('common:count')}</th>
							</tr>
						</thead>
						<tbody>
							{actionTypes.map( ( x, i ) => {
								return (
									<tr key={i} >
										<td>
											{this.renderPlotButton( x._id.type, 'right' )}
										</td>
										<td>{x._id.type}</td>
										<td>{x.count}</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</div>
			</Fragment>
		);
	}

	renderPlotButton( name, side = 'left', icon ) {
		const clickHandler = () => {
			const newDisplayInPlot = { ...this.state.displayInPlot };
			newDisplayInPlot[ name ] = !newDisplayInPlot[ name ];

			// Reset object to trigger additional render to force range slider to be redrawn:
			this.setState({
				displayInPlot: DISPLAY_IN_PLOT
			}, () => {
				this.setState({
					displayInPlot: newDisplayInPlot,
					revision: this.state.revision + 1
				});
			});
		};
		if ( this.state.displayInPlot[ name ] ) {
			return ( <Button variant="warning" size="sm" onClick={clickHandler} >
				<i className={icon ? icon : `fas fa-arrow-circle-${side}`} ></i>
			</Button> );
		}
		return ( <Button variant="secondary" size="sm" onClick={clickHandler} >
				<i className={icon ? icon : `fas fa-arrow-circle-${reverse( side )}`} ></i>
		</Button> );
	}

	renderExplorer = () => {
		let explorer;
		switch ( this.state.dataExplorer ) {
			case 'action-types':
				explorer = <DashboardDataExplorer
					title={this.props.t('explorer-action-types-title')}
					data={{
						...this.state.historicalActionTypes,
						time: this.props.historicalStatistics.map( x => x.createdAt )
					}}
					categorical={[ 'time' ]}
					close={this.hideExplorer}
				/>;
				break;
			case 'overview-statistics':
				explorer = <DashboardDataExplorer
					title={this.props.t('explorer-overview-stats-title')}
					data={obsToVar( this.props.historicalStatistics )}
					categorical={[ 'createdAt' ]}
					close={this.hideExplorer}
				/>;
				break;
		}
		return explorer;
	}

	render() {
		debug( 'Rendering overview page...' );
		const { nUsers, nNamespaces, nLessons, nCohorts, nSessionData, nFiles, nEvents, nTickets } = this.props.statistics;
		const { t } = this.props;
		const overviewPanel = <Container className="admin-outer-container slide-in-right" >
			<Row className="first-row" >
				<Col className="column-border" sm={4} md={3} >
					<h2>
						{this.props.t('overall')}
						<OverlayTrigger placement="right" overlay={<Tooltip id="explorer-overview-tooltip">{t('common:data-explorer')}</Tooltip>}>
							<Button
								onClick={() => {
									this.setState({
										dataExplorer: 'overview-statistics'
									});
								}}
								style={{
									marginLeft: 12
								}}
							>
								<i className="fas fa-chart-bar" ></i>
							</Button>
						</OverlayTrigger>
						<span className="overview-server-name">{server}</span>
					</h2>
					<Table striped hover className="overview-table" >
						<thead>
							<tr>
							<th>{this.props.t('common:icon')}</th>
							<th>{this.props.t('common:table')}</th>
							<th>{this.props.t('common:count')}</th>
							<th>{this.props.t('common:visualize')}</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<i className="fas fa-user" style={{ color: COLOR_MAPPING.users }} ></i>
								</td>
								<td>
									{t('admin:users')}
								</td>
								<td>{nUsers}</td>
								<td>
									{this.renderPlotButton( 'users' )}
								</td>
							</tr>
							<tr>
								<td>
									<i className="fas fa-school" style={{ color: COLOR_MAPPING.namespaces }} ></i>
								</td>
								<td>
									{t('common:courses')}
								</td>
								<td>{nNamespaces}</td>
								<td>
									{this.renderPlotButton( 'namespaces' )}
								</td>
							</tr>
							<tr>
								<td>
									<i className="fas fa-chalkboard" style={{ color: COLOR_MAPPING.lessons }} ></i>
								</td>
								<td>
									{t('common:lessons')}
								</td>
								<td>{nLessons}</td>
								<td>
									{this.renderPlotButton( 'lessons' )}
								</td>
							</tr>
							<tr>
								<td>
									<i className="fas fa-users" style={{ color: COLOR_MAPPING.cohorts }} ></i>
								</td>
								<td>
									{t('common:cohorts')}
								</td>
								<td>{nCohorts}</td>
								<td>
									{this.renderPlotButton( 'cohorts' )}
								</td>
							</tr>
							<tr>
								<td>
									<i className="fas fa-file" style={{ color: COLOR_MAPPING.files }} ></i>
								</td>
								<td>
									{t('common:files')}
								</td>
								<td>{nFiles}</td>
								<td>
									{this.renderPlotButton( 'files' )}
								</td>
							</tr>
							<tr>
								<td>
									<i className="fas fa-clock" style={{ color: COLOR_MAPPING.events }} ></i>
								</td>
								<td>
									{t('common:events')}
								</td>
								<td>{nEvents}</td>
								<td>
									{this.renderPlotButton( 'events' )}
								</td>
							</tr>
							<tr>
								<td>
									<i className="fas fa-shoe-prints" style={{ color: COLOR_MAPPING.sessionData }} ></i>
								</td>
								<td>
									{t('common:sessionData')}
								</td>
								<td>{nSessionData}</td>
								<td>
									{this.renderPlotButton( 'sessionData' )}
								</td>
							</tr>
							<tr>
								<td>
									<i className="fas fa-medkit" style={{ color: COLOR_MAPPING.tickets }} ></i>
								</td>
								<td>
									{t('common:tickets')}
								</td>
								<td>{nTickets}</td>
								<td>
									<ButtonGroup>
										{this.renderPlotButton( 'tickets' )}
										{this.renderPlotButton( 'openTickets', 'left', 'fas fa-lock-open' )}
										{this.renderPlotButton( 'closedTickets', 'left', 'fas fa-lock' )}
									</ButtonGroup>
								</td>
							</tr>
						</tbody>
					</Table>
				</Col>
				<Col className="column-border" sm={8} md={6} >
					<h2>{this.props.t('over-time')}</h2>
					{this.renderTimeSeries()}
				</Col>
				<Col sm={12} md={3} >
					{this.renderActionTypes()}
				</Col>
			</Row>
			<Row className="second-row" >
				<Col md={3} sm={4} className="column-border" >
					<h3>{t('disk-usage')}</h3>
					{this.renderDiskUsage()}
				</Col>
				<Col md={6} sm={8} className="column-border" >
					<h3>{t('database')}</h3>
					{this.renderDatabaseStats()}
				</Col>
				<Col md={3} sm={12} >
					<h3>{this.props.t('daily-statistics')}</h3>
					{this.renderDailyStatistics()}
				</Col>
			</Row>
		</Container>;
		return (
			this.state.dataExplorer === 'hidden' ?
				overviewPanel:
				this.renderExplorer()
		);
	}
}


// PROPERTIES //

Overview.propTypes = {
	getHistoricalOverviewStats: PropTypes.func.isRequired,
	getOverviewStatistics: PropTypes.func.isRequired,
	historicalStatistics: PropTypes.array,
	statistics: PropTypes.object,
	t: PropTypes.func.isRequired
};

Overview.defaultProps = {
	historicalStatistics: [],
	statistics: {}
};


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( Overview );
