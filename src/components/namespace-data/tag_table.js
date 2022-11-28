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

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StandardTable from 'components/standard-table';
import ReactTable from '@tanstack/react-table';


// MAIN //

function TagTable({ namespace, lessons }) {
	const { t } = useTranslation( 'common' );
	const [ expanded, setExpanded ] = useState( true );
	console.log( namespace.componentsByLesson );
	const columns = [
		{
			Header: '',
			id: 'expand',
			cell: ({ row, getValue }) => {
				return ( <>
					{row.getCanExpand() ? (
					<button
						className="unstyled-text-button"
						{...{
							onClick: row.getToggleExpandedHandler()
						}}
					>
						{row.getIsExpanded() ? <i className="fa fa-minus" /> : <i className="fa fa-plus" />}
					</button> ) : null}
				</> );
			},
			size: 5,
			maxSize: 5,
			minSize: 5,
			enableResizing: false,
			className: 'expander-column'
		},
		{
			accessorFn: ( row ) => row.title,
			header: t('lesson')
		},
		{
			accessorFn: ( row ) => row.component,
			header: t('component')
		},
		{
			accessorFn: ( row ) => row.description || row.componentType,
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
			header: t('tag'),
			accessorKey: 'tag'
		}
	];
	return ( <StandardTable
		columns={columns}
		data={lessons}
		tableOptions={{
			getSubRows: row => {
				const components = namespace.componentsByLesson[ row._id ];
				console.log( 'COMPONENTS: ' );
				console.log( namespace.componentsByLesson );
				console.log( row._id );
				console.log( components );
				return components;
			},
			getExpandedRowModel: ReactTable.getExpandedRowModel(),
			state: {
				expanded
			},
			onExpandedChange: setExpanded
		}}
	/> );
}


// EXPORTS //

export default TagTable;
