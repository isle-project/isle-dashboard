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


const EXTENSIONS = [
	{
		user: '600e0ad44c7a064db2b42556',
		lastName: 'Genovese',
		firstName: 'Christopher',
		cohort: 'Cohort 1',
		lesson: { _id: '62d0303b6048815e19d2fedd', title: 'Lesson 1' },
		extensionStart: new Date(),
		extensionEnd: new Date()
	},
	{
		user: '6171a92ccf6e189c3144f65a',
		lastName: 'Burckhardt',
		firstName: 'Philipp',
		cohort: 'Cohort 2',
		lesson: { _id: '61956dcba011aec3438b260d', title: 'Lesson 2' },
		extensionStart: new Date(),
		extensionEnd: new Date()
	},
	{
		user: '60186c3ff996a8399ca8276d',
		lastName: 'Klein',
		firstName: 'Sebastian',
		cohort: 'Cohort 1',
		lesson: { _id: '62d0303b6048815e19d2fedd', title: 'Lesson 3' },
		extensionStart: new Date(),
		extensionEnd: new Date()
	}
];


// MAIN //

function ExtensionsTable({ cohorts, namespace, lessons }) {
	console.log( lessons );
	/*
	const members = cohorts.map( cohort => {
		console.log( cohort );
		const members = cohort.members.map( member => ({
			...member,
			cohort: cohort.title
		}) );
		members.sort( ( a, b ) => {
			if ( a.cohort < b.cohort ) {
				return -1;
			}
			if ( a.cohort > b.cohort ) {
				return 1;
			}
			const aName = a.lastName + a.firstName;
			const bName = b.lastName + b.firstName;
			if ( aName < bName ) {
				return -1;
			}
			if ( aName > bName ) {
				return 1;
			}
			return 0;
		});
		return members;
	}).flat();
	*/

	EXTENSIONS.sort( ( a, b ) => {
		if ( a.cohort < b.cohort ) {
			return -1;
		}
		if ( a.cohort > b.cohort ) {
			return 1;
		}
		const aName = a.lastName + a.firstName;
		const bName = b.lastName + b.firstName;
		if ( aName < bName ) {
			return -1;
		}
		if ( aName > bName ) {
			return 1;
		}
		if ( a.lesson.title < b.lesson.title ) {
			return -1;
		}
		if ( a.lesson.title > b.lesson.title ) {
			return 1;
		}
		return 0;
	});
	const { t } = useTranslation( 'common' );
	const columns = [
		{
			accessorKey: 'lastName',
			header: t('lastName')
		},
		{
			accessorKey: 'firstName',
			header: t('firstName')
		},
		{
			accessorKey: 'cohort',
			header: t('cohort')
		},
		{
			accessorKey: 'lesson.title',
			header: t('lesson')
		},
		{
			accessorKey: 'extensionStart',
			header: t('extensionStart')
		},
		{
			accessorKey: 'extensionEnd',
			header: t('extensionEnd')
		}
	];
	return ( <StandardTable
		columns={columns}
		data={EXTENSIONS}
	/> );
}


// EXPORTS //

export default ExtensionsTable;
