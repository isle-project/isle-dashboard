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

import React from 'react';
import { useTranslation } from 'react-i18next';
import StandardTable from 'components/standard-table';
import { getExpandedRowModel } from '@tanstack/react-table';
import isEmptyObject from '@stdlib/assert/is-empty-object';
import objectValues from '@stdlib/utils/values';


// MAIN //

function MetricsTable({ namespace, lessons }) {
	const { t } = useTranslation( 'common' );
	const columns = [
		{
			accessorKey: 'title',
			header: t('lesson')
		},
		{
			accessorKey: 'description',
			header: t('description'),
			cell: info => {
				const description = info.getValue();
				if ( description === 'No description supplied.' ) {
					return '';
				}
				return description;
			}
		},
		{
			accessorKey: 'name',
			header: t('name')
		},
		{
			accessorFn: row => row.rule ? row.rule[ 0 ] : '',
			header: t('rule')
		},
		{
			header: t('coverage'),
			accessorKey: 'coverage',
			cell: info => {
				const coverage = info.getValue();
				if ( !coverage ) {
					return '';
				}
				if ( coverage[ 0 ] === 'All' ) {
					return 'All components';
				}
				return 'Selected components';
			}
		},
		{
			accessorKey: 'ref',
			header: t('submetric')
		},
		{
			accessorKey: 'autoCompute',
			header: t('auto compute')
		},
		{
			accessorKey: 'visibleToStudent',
			header: t('visible to student')
		},
		{
			accessorKey: 'timeFilter',
			header: t('time filter')
		},
		{
			accessorKey: 'tagWeights',
			header: t('tag weights'),
			cell: info => {
				const tagWeights = info.getValue();
				if ( !tagWeights ) {
					return '';
				}
				const weights = objectValues( tagWeights );
				if (
					isEmptyObject( tagWeights ) ||
					weights.every( v => v === 0 ) ||
					( weights.length === 1 && tagWeights?.[ '_default_tag' ] )
				) {
					return '';
				}
				return 'Custom';
			}
		}
	];
	return ( <StandardTable
		columns={columns}
		data={lessons}
		tableOptions={{
			getSubRows: row => {
				return row.completions;
			},
			getExpandedRowModel: getExpandedRowModel(),
			initialState: {
				expanded: true
			}
		}}
	/> );
}


// EXPORTS //

export default MetricsTable;
