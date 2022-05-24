// MAIN //

/**
* Mapping from a given node level to the corresponding field in the schema that contains the children.
*/
export const levelFieldMapping = {
	program: 'namespaces',
	namespace: 'lessons',
	lesson: null,
	component: null
};

/**
* Returns the next lower level in the hierarchy.
*
* @private
* @param {string} level - input level
* @returns {string} predecessor level
*/
export function predecessor( level ) {
    switch ( level ) {
            case 'lesson':
                    return 'component';
            case 'namespace':
                    return 'lesson';
            case 'program':
                    return 'namespace';
            case 'global':
                    return 'program';
            case 'component':
            default:
                    return null;
    }
}

/**
* Returns the next lower level in the hierarchy.
*/
export const levelPredecessorMapping = {
    global: 'program',
	program: 'namespace',
	namespace: 'lesson',
	lesson: 'component',
	component: null
};
