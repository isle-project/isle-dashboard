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
import { withTranslation } from 'react-i18next';
import DashboardTable from 'components/dashboard-table';
import isArray from '@stdlib/assert/is-array';
import ceil from '@stdlib/math/base/special/ceil';
import createNumericColumn from 'utils/create_numeric_column.js';
import createTextColumn from 'utils/create_text_column.js';
import obsToVar from '@isle-project/utils/obs-to-var';
import DashboardDataExplorer from 'ev/components/data-explorer';


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
	};

	toggleExplorer = () => {
		this.setState({
			showExplorer: !this.state.showExplorer
		});
	};

	render() {
		const { t } = this.props;
		if ( this.state.showExplorer ) {
			return (
				<DashboardDataExplorer
					title={t('explorer-requests-title')}
					data={obsToVar( this.props.admin.requestStatistics )}
					categorical={[ 'request' ]}
					quantitative={[ 'mean', 'count' ]}
					close={this.toggleExplorer}
				/>
			);
		}
		return (
			<DashboardTable
				data={this.props.admin.requestStatistics}
				columns={this.columns}
				onButtonClick={this.toggleExplorer}
				t={t}
			/>
		);
	}
}


// PROPERTIES //

Requests.propTypes = {
	admin: PropTypes.object.isRequired,
	getRequestStatistics: PropTypes.func.isRequired
};

Requests.defaultProps = {};


// EXPORTS //

export default withTranslation( [ 'admin', 'common' ] )( Requests );
