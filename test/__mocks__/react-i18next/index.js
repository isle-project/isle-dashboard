// MODULES //

import React from 'react';


// EXPORTS //

export const withTranslation = () => {
	return Component => {
		Component.defaultProps = { ...Component.defaultProps, t: ( key ) => key };
		return Component;
	};
};

export const Trans = ({ children }) => children;

export const translate = () => Component => props => <Component t={() => ''} {...props} />;
