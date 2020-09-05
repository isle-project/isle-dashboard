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


// VARIABLES //

const debug = logger( 'isle-dashboard:admin' );


// MAIN //

class Overview extends Component {
	componentDidMount() {
		this.props.getOverviewStatistics();
	}

	renderTimeSeries() {
		return (
			<Plotly
				data={[
					{
						type: 'scatter',
						mode: 'lines',
						name: 'Users',
						x: [ '2020-09-5', '2020-09-6', '2020-09-7' ],
						y: [ 4, 7, 9 ],
						yaxis: 'y1'
					},
					{
						type: 'scatter',
						mode: 'lines',
						name: 'Actions',
						x: [ '2020-09-5', '2020-09-6', '2020-09-7' ],
						y: [ 2100, 4000, 4300 ],
						yaxis: 'y2'
					}
				]}
				config={{
					displayModeBar: false,
					displaylogo: false
				}}
				layout={{
					title: 'Time Series with Rangeslider',
					xaxis: {
						autorange: true,
						range: ['2020-09-5', '2017-09-7'],
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
							range: ['2015-09-5', '2017-09-7']
						},
						type: 'date'
					},
					yaxis1: {
						title: 'Users',
						side: 'right'
					},
					yaxis2: {
						title: 'Actions',
						overlaying: 'y',
						side: 'left'
					}
				}}
			/>
		);
	}

	renderDiskUsage() {
		let { fsUsedSize, fsTotalSize } = this.props.statistics.database;
		fsUsedSize /= ( 1024 * 1024 * 1024 );
		fsTotalSize /= ( 1024 * 1024 * 1024 );
		const usedSpace = round( fsUsedSize );
		const freeSpace = round( fsTotalSize - fsUsedSize );
		return ( <Plotly
			data={[
				{
					values: [ usedSpace, freeSpace ],
					labels: [ `Used Space: ${usedSpace} GB`, `Free Space: ${freeSpace} GB` ],
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
		let { storageSize, dataSize, objects, avgObjSize } = this.props.statistics.database;
		return (
			<ListGroup variant="flush" style={{ fontSize: '1em' }}>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >Physical Storage Size: {storageSize}</ListGroup.Item>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >Reserved Storage Size: {dataSize}</ListGroup.Item>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >Number of objects: {objects} </ListGroup.Item>
				<ListGroup.Item style={{ padding: '.5rem 0.8rem' }} >Average Object Size: {round( avgObjSize )}</ListGroup.Item>
			</ListGroup>
		);
	}

	render() {
		debug( 'Rendering overview page...' );
		const { nUsers, nNamespaces, nLessons, nCohorts, nSessionData, nFiles, nEvents } = this.props.statistics;
		const { t } = this.props;
		return (
			<Container className="admin-overview-container" >
				<Row className="first-row" >
					<Col className="column-border" >
						<h2>{this.props.t('overall')}</h2>
						<Table striped hover >
							<thead>
								<tr>
								<th>Icon</th>
								<th>Table</th>
								<th>Count</th>
								<th>Visualize</th>
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
										<Button variant="secondary" size="sm" >
											<i className="fas fa-arrow-circle-right"></i>
										</Button>
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
										<Button variant="warning" size="sm" >
											<i className="fas fa-arrow-circle-left"></i>
										</Button>
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
									<td></td>
								</tr>
								<tr>
									<td>
										<i className="fas fa-users"></i>
									</td>
									<td>
										{t('common:cohorts')}
									</td>
									<td>{nCohorts}</td>
									<td></td>
								</tr>
								<tr>
									<td>
										<i className="fas fa-file"></i>
									</td>
									<td>
										{t('common:files')}
									</td>
									<td>{nFiles}</td>
									<td></td>
								</tr>
								<tr>
									<td>
										<i className="fas fa-clock"></i>
									</td>
									<td>
										{t('common:events')}
									</td>
									<td>{nEvents}</td>
									<td></td>
								</tr>
								<tr>
									<td>
										<i className="fas fa-shoe-prints"></i>
									</td>
									<td>
										{t('common:actions')}
									</td>
									<td>{nSessionData}</td>
									<td></td>
								</tr>
							</tbody>
						</Table>
					</Col>
					<Col className="column-border" >
						<h2>{this.props.t('over-time')}</h2>
						{this.renderTimeSeries()}
					</Col>
					<Col>
						<h2>{this.props.t('daily-statistics')}</h2>
					</Col>
				</Row>
				<Row className="second-row" >
					<Col>
						<h3>{t('disk-usage')}</h3>
						{this.renderDiskUsage()}
					</Col>
					<Col>
						<h3>{t('database')}</h3>
						{this.renderDatabaseStats()}
					</Col>
					<Col></Col>
				</Row>
			</Container>
		);
	}
}


// PROPERTIES //

Overview.propTypes = {
	statistics: PropTypes.object.isRequired,
	t: PropTypes.func.isRequired
};


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( Overview );
