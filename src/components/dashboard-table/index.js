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

import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import 'react-table/react-table.css';
import './table.css';


// MAIN //

/**
 * A table component for displaying data.
 *
 * @param {Object} props - component properties
 * @param {(Array|Object)} props.data - array of objects containing data
 * @param {Array} props.columns - array of column objects
 * @param {Function} props.onButtonClick - callback to invoke upon clicking the data explorer button
 * @param {string} props.className - CSS class name
 * @param {Function} props.t - i18n translation function
 * @returns {ReactElement} component
 */
const DashboardTable = ( props ) => {
	const { id, t } = props;
	const getProps = useCallback( () => {
		return {
			id: id || 'dashboard-table'
		};
	}, [ id ] );
	return (
		<Fragment>
			<ReactTable
				{...props}
				filterable
				className={`dashboard-table ${props.className}`}
				data={props.data}
				columns={props.columns}
				previousText={t('common:previous')}
				nextText={t('common:next')}
				loadingText={t('common:loading')}
				noDataText={t('common:no-rows-found')}
				pageText={t('common:page')}
				ofText={t('common:of')}
				rowsText={t('common:rows')}
				getProps={getProps}
			/>
			{props.onButtonClick ? <ButtonGroup vertical style={{ float: 'right', marginRight: -9 }} >
				<OverlayTrigger placement="left" overlay={<Tooltip id="explorer-tooltip">{t('common:data-explorer')}</Tooltip>}>
					<Button aria-label={t('common:data-explorer')} variant="primary" style={{ marginBottom: 8 }} onClick={props.onButtonClick} >
						<i className="fas fa-chart-bar" ></i>
					</Button>
				</OverlayTrigger>
			</ButtonGroup> : null}
		</Fragment>
	);
};


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
