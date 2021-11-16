// MODULES //

import React from 'react';
import identity from '@stdlib/utils/identity-function';


// EXPORTS //

export const withTranslation = () => {
	return Component => {
		Component.defaultProps = { ...Component.defaultProps, t: ( key ) => key };
		return Component;
	};
};

export const Trans = ({ children }) => children;

export const translate = () => Component => props => <Component t={() => ''} {...props} />;

export const useTranslation = () => {
	return {
		t: identity
	};
};
