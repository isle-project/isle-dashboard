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
import logger from 'debug';
import { withTranslation } from 'react-i18next';
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
import capitalize from '@stdlib/string/capitalize';
import COLORS from 'constants/colors';


// VARIABLES //

const debug = logger( 'isle-dashboard:admin' );
const POSITIONS = [ 0, 0.9, 0.1, 0.8, 0.2, 0.7, 0.3 ];


// MAIN //

class Overview extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			displayInPlot: {
				users: true,
				namespaces: false,
				lessons: false,
				cohorts: false,
				files: false,
				events: false,
				sessionData: false
			}
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
			const currentDate = new Date();
			const currentYear = currentDate.getFullYear();
			const currentMonth = currentDate.getMonth();
			const currentDayOfMonth = currentDate.getDate();
			if (
				currentYear > year ||
				currentMonth > month ||
				currentDayOfMonth > dayOfMonth
			) {
				debug( 'Request historical data from server...' );
				this.props.getHistoricalOverviewStats();
			}
			else {
				debug( 'Already have latest data...' );
			}
		} else {
			this.props.getHistoricalOverviewStats();
		}
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
			if ( this.state.displayInPlot[ key ] ) {
				title += ( title === '' ) ? '' : ', ';
				title += this.props.t('common:'+key );
				const color = COLORS[ displayedData.length ];
				const y = pluck( data, `n${capitalize( key )}` );
				displayedData.push({
					type: 'scatter',
					mode: 'lines',
					name: this.props.t('common:'+key),
					x: dates,
					y: y,
					yaxis: 'y'+(i+1),
					marker: {
						color
					}
				});
				const yaxis = {
					title: this.props.t( 'common:'+key ),
					titlefont: { color },
					tickfont: { color },
					fixedrange: true
				};
				if ( i > 0 ) {
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
				layout[ 'yaxis'+(i+1) ] = yaxis;
			}
		}
		layout.xaxis.domain = domain;
		layout.title = `${this.props.t('time-series-of')}${title}`;
		if ( displayedData.length === 0 ) {
			return null;
		}
		return (
			<Plotly
				key={title}
				data={displayedData}
				config={{
					displayModeBar: false,
					displaylogo: false
				}}
				layout={layout}
				style={{
					width: '100%',
					height: '80%'
				}}
				useResizeHandler
			/>
		);
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
		let { storageSize, dataSize, objects, avgObjSize } = this.props.statistics.database;
		return (
			<ListGroup variant="flush" style={{ fontSize: '1em' }}>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >{t('physical-storage-size')}: {storageSize}</ListGroup.Item>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >{t('reserved-storage-size')}: {dataSize}</ListGroup.Item>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >{t('number-of-objects')}: {objects} </ListGroup.Item>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >{t('average-object-size')}: {round( avgObjSize )}</ListGroup.Item>
			</ListGroup>
		);
	}

	renderPlotButton( name ) {
		const clickHandler = () => {
			const newDisplayInPlot = { ...this.state.displayInPlot };
			newDisplayInPlot[ name ] = !newDisplayInPlot[ name ];
			this.setState({
				displayInPlot: newDisplayInPlot
			});
		};
		if ( this.state.displayInPlot[ name ] ) {
			return ( <Button variant="warning" size="sm" onClick={clickHandler} >
				<i className="fas fa-arrow-circle-left"></i>
			</Button> );
		}
		return ( <Button variant="secondary" size="sm" onClick={clickHandler} >
			<i className="fas fa-arrow-circle-right"></i>
		</Button> );
	}

	render() {
		debug( 'Rendering overview page...' );
		const { nUsers, nNamespaces, nLessons, nCohorts, nSessionData, nFiles, nEvents } = this.props.statistics;
		const { t } = this.props;
		return (
			<Container className="admin-overview-container" >
				<Row className="first-row" >
					<Col className="column-border" sm={4} md={3} >
						<h2>{this.props.t('overall')}</h2>
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
										<i className="fas fa-user"></i>
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
										<i className="fas fa-school"></i>
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
										<i className="fas fa-chalkboard"></i>
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
										<i className="fas fa-users"></i>
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
										<i className="fas fa-file"></i>
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
										<i className="fas fa-clock"></i>
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
										<i className="fas fa-shoe-prints"></i>
									</td>
									<td>
										{t('common:sessionData')}
									</td>
									<td>{nSessionData}</td>
									<td>
										{this.renderPlotButton( 'sessionData' )}
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
						<h2>{this.props.t('daily-statistics')}</h2>
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
					<Col md={3} sm={12} ></Col>
				</Row>
			</Container>
		);
	}
}


// PROPERTIES //

Overview.propTypes = {
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
