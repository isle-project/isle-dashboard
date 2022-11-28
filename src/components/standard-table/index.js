
// MODULES //

import React, { useRef } from 'react';
import ReactTable from '@tanstack/react-table';
import './table.css';


// VARIABLES //

const { useReactTable, getCoreRowModel, flexRender } = ReactTable;


// MAIN //

const StandardTable = ({ data, columns, tableOptions = {} }) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		columnResizeMode: 'onChange',
		enableColumnResizing: true,
		debugTable: true,
		debugHeaders: true,
		debugColumns: true,
		...tableOptions
	});
	const tableRef = useRef();
	return (
		<table className="standard-table" ref={tableRef} >
			<thead>
			{table.getHeaderGroups().map(headerGroup => (
				<tr key={headerGroup.id} >
				{headerGroup.headers.map( ( header, idx ) => {
					const isLastColumn = idx === headerGroup.headers.length - 1;
					const style = isLastColumn ?
						{ width: tableRef?.current?.offsetWidth - table.getTotalSize() } :
						{ width: header.getSize() };
					return (
						<th
							key={header.id}
							colSpan={header.colSpan}
							style={{ ...style, ...header.column.columnDef.extraStyles }}
							className={header.column.columnDef.className}
						>
						{header.isPlaceholder ? null : flexRender(
							header.column.columnDef.header,
							header.getContext()
						)}
						{header.column.columnDef.enableResizing !== false && !isLastColumn && <div
							className="resizer"
							onMouseDown={header.getResizeHandler()}
							onTouchStart={header.getResizeHandler()}
							tabIndex={-1} role="button"
						/>}
						</th>
					);
				})}
				</tr>
			))}
			</thead>
			<tbody>
			{table.getRowModel().rows.map( row => (
				<tr key={row.id} >
				{row.getVisibleCells().map( ( cell, idx ) => {
					const isLastColumn = idx === row.getVisibleCells().length - 1;
					const style = isLastColumn ?
						{ width: tableRef?.current?.offsetWidth - table.getTotalSize() } :
						{ width: cell.column.getSize() };
					return (
						<td
							key={cell.id}
							style={{ ...style, ...cell.column.columnDef.extraStyles }}
							className={cell.column.columnDef.className}
						>
							{flexRender(cell.column.columnDef.cell, cell.getContext())}
						</td>
					);
				})}
				</tr>
			))}
			</tbody>
			<tfoot>
			{table.getFooterGroups().map(footerGroup => (
				<tr key={footerGroup.id}>
				{footerGroup.headers.map(header => (
					<th key={header.id}>
					{header.isPlaceholder ? null : flexRender(
						header.column.columnDef.footer,
						header.getContext()
					)}
					</th>
				))}
				</tr>
			))}
			</tfoot>
		</table>
	);
};


// EXPORTS //

export default StandardTable;

