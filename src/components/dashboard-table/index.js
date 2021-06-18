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
import ReactTable from 'react-table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import 'react-table/react-table.css';
import './table.css';


// MAIN //

class DashboardTable extends Component {
	render() {
		const { t } = this.props;
		return (
			<Fragment>
				<ReactTable
					{...this.props}
					id="dashboard-table"
					filterable
					className={`dashboard-table ${this.props.className}`}
					data={this.props.data}
					columns={this.props.columns}
					previousText={t('common:previous')}
					nextText={t('common:next')}
					loadingText={t('common:loading')}
					noDataText={t('common:no-rows-found')}
					pageText={t('common:page')}
					ofText={t('common:of')}
					rowsText={t('common:rows')}
					ref={( table ) => {
						this.table = table;
					}}
				/>
				{this.props.onButtonClick ? <ButtonGroup vertical style={{ float: 'right', marginRight: -9 }} >
					<OverlayTrigger placement="left" overlay={<Tooltip id="explorer-tooltip">{t('common:data-explorer')}</Tooltip>}>
						<Button aria-label={t('common:data-explorer')} variant="primary" style={{ marginBottom: 8 }} onClick={this.props.onButtonClick} >
							<i className="fas fa-chart-bar" ></i>
						</Button>
					</OverlayTrigger>
				</ButtonGroup> : null}
			</Fragment>
		);
	}
}


// PROPERTIES //

DashboardTable.propTypes = {
	className: PropTypes.string,
	columns: PropTypes.array.isRequired,
	data: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.array
	]).isRequired,
	onButtonClick: PropTypes.func.isRequired,
	t: PropTypes.func
};

DashboardTable.defaultProps = {
	className: '',
	t() {}
};


// EXPORTS //

export default DashboardTable;
