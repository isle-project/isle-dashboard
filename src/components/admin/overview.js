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


// VARIABLES //

const debug = logger( 'isle-dashboard:admin' );


// MAIN //

class Overview extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			displayInPlot: {
				users: false,
				namespaces: false,
				lessons: false,
				cohorts: false,
				files: false,
				events: false,
				actions: false
			}
		};
	}

	componentDidMount() {
		this.props.getOverviewStatistics();
	}

	renderTimeSeries() {
		let title = '';
		const keys = objectKeys( this.state.displayInPlot );
		for ( let i = 0; i < keys.length; i++ ) {
			if ( this.state.displayInPlot[ keys[ i ] ] ) {
				title += ( title === '' ) ? '' : ', ';
				title += keys[ i ];
			}
		}
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
					title: `${this.props.t('time-series-of')}${title}`,
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
					<Col className="column-border" >
						<h2>{this.props.t('overall')}</h2>
						<Table striped hover >
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
										{t('common:actions')}
									</td>
									<td>{nSessionData}</td>
									<td>
										{this.renderPlotButton( 'actions' )}
									</td>
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
