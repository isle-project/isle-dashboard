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
import { withTranslation } from 'react-i18next';
import ReactTable from 'react-table';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import isArray from '@stdlib/assert/is-array';
import ceil from '@stdlib/math/base/special/ceil';
import createNumericColumn from './create_numeric_column.js';
import createTextColumn from './create_text_column.js';
import obsToVar from '@isle-project/utils/obs-to-var';
import AdminDataExplorer from 'ev/components/admin/data-explorer';


// MAIN //

class Requests extends Component {
	constructor( props ) {
		super( props );
		this.columns = this.createColumns();

		this.state = {
			showExplorer: false
		};
	}

	componentDidMount() {
		this.props.getRequestStatistics();
	}

	createColumns = () => {
		const { t } = this.props;
		let maxCount = 0;
		let maxMean = 0;
		const stats = this.props.admin.requestStatistics;
		if ( isArray( stats ) ) {
			for ( let i = 0; i < stats.length; i++ ) {
				if ( stats[ i ].count > maxCount ) {
					maxCount = stats[ i ].count;
				}
				if ( stats[ i ].mean > maxMean ) {
					maxMean = stats[ i ].mean;
				}
			}
		}
		return [
			createTextColumn({
				Header: t('common:request'),
				id: 'request',
				accessor: 'request',
				maxWidth: 200,
				style: { marginTop: '8px', color: 'darkslategrey' }
			}),
			createNumericColumn({
				Header: t( 'common:count' ),
				accessor: 'count',
				style: { marginTop: '2px', color: 'darkslategrey' },
				maxWidth: 150,
				minValue: 0,
				maxValue: maxCount
			}),
			createNumericColumn({
				Header: t( 'ms-on-average' ),
				accessor: 'mean',
				style: { marginTop: '2px', color: 'darkslategrey' },
				maxWidth: 250,
				minValue: 0,
				maxValue: ceil( maxMean )
			})
		];
	}

	toggleExplorer = () => {
		this.setState({
			showExplorer: !this.state.showExplorer
		});
	}

	render() {
		const { t } = this.props;
		if ( this.state.showExplorer ) {
			return (
				<AdminDataExplorer
					title="Data Explorer for Requests"
					data={obsToVar( this.props.admin.requestStatistics )}
					categorical={[ 'request' ]}
					quantitative={[ 'mean', 'count' ]}
					close={this.toggleExplorer}
					admin={this.props.admin}
				/>
			);
		}
		return (
			<Fragment>
				<ReactTable
					className="dashboard-table"
					filterable
					data={this.props.admin.requestStatistics}
					columns={this.columns}
					ref={(r) => {
						this.reactTable = r;
					}}
					previousText={t('common:previous')}
					nextText={t('common:next')}
					loadingText={t('common:loading')}
					noDataText={t('common:no-rows-found')}
					pageText={t('common:page')}
					ofText={t('common:of')}
					rowsText={t('common:rows')}
					style={{ maxWidth: 'calc(100% - 42px)', float: 'left' }}
				/>
				<ButtonGroup vertical style={{ float: 'right', marginRight: -9 }} >
					<OverlayTrigger placement="left" overlay={<Tooltip id="explorer-tooltip">{t('common:data-explorer')}</Tooltip>}>
						<Button variant="primary" style={{ marginBottom: 8 }} onClick={this.toggleExplorer} >
							<i className="fas fa-chart-bar" ></i>
						</Button>
					</OverlayTrigger>
				</ButtonGroup>
			</Fragment>
		);
	}
}


// PROPERTIES //

Requests.propTypes = {
};

Requests.defaultProps = {
};


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( Requests );
