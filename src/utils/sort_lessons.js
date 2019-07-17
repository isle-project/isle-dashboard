// VARIABLES //

const OPTS = {
	numeric: true // Use numeric collation such that "1" < "2" < "10"...
};


// MAIN //

function sortLessons( lessons, search ) {
	const { type, direction } = search;
	if ( type === 'alphabetically' ) {
		if ( direction === 'ascending' ) {
			lessons.sort( ( a, b ) => {
				const x = a.namespace + a.title;
				const y = b.namespace + b.title;
				return x.localeCompare( y, void 0, OPTS );
			});
		} else {
			lessons.sort( ( a, b ) => {
				const x = a.namespace + a.title;
				const y = b.namespace + b.title;
				return y.localeCompare( x, void 0, OPTS );
			});
		}
	}
	else if ( type === 'created_at' ) {
		if ( direction === 'ascending' ) {
			lessons.sort( ( a, b ) => {
				return a.createdAt.localeCompare( b.createdAt, void 0, OPTS );
			});
		} else {
			lessons.sort( ( a, b ) => {
				return b.createdAt.localeCompare( a.createdAt, void 0, OPTS );
			});
		}
	}
	else if ( type === 'updated_at' ) {
		if ( direction === 'ascending' ) {
			lessons.sort( ( a, b ) => {
				return a.updatedAt.localeCompare( b.updatedAt, void 0, OPTS );
			});
		} else {
			lessons.sort( ( a, b ) => {
				return b.updatedAt.localeCompare( a.updatedAt, void 0, OPTS );
			});
		}
	}
}


// EXPORTS //

export default sortLessons;
