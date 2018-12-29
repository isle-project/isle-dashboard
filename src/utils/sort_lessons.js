// MAIN //

function sortLessons( lessons, search ) {
	const { type, direction } = search;
	if ( type === 'alphabetically' ) {
		if ( direction === 'ascending' ) {
			lessons.sort( ( a, b ) => {
				const x = a.namespace + a.title;
				const y = b.namespace + b.title;
				return x.localeCompare( y );
			});
		} else {
			lessons.sort( ( a, b ) => {
				const x = a.namespace + a.title;
				const y = b.namespace + b.title;
				return y.localeCompare( x );
			});
		}
	}
	else if ( type === 'created_at' ) {
		if ( direction === 'ascending' ) {
			lessons.sort( ( a, b ) => {
				return a.createdAt.localeCompare( b.createdAt );
			});
		} else {
			lessons.sort( ( a, b ) => {
				return b.createdAt.localeCompare( a.createdAt );
			});
		}
	}
	else if ( type === 'updated_at' ) {
		if ( direction === 'ascending' ) {
			lessons.sort( ( a, b ) => {
				return a.updatedAt.localeCompare( b.updatedAt );
			});
		} else {
			lessons.sort( ( a, b ) => {
				return b.updatedAt.localeCompare( a.updatedAt );
			});
		}
	}
}


// EXPORTS //

export default sortLessons;
