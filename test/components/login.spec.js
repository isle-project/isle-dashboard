// MODULES //

import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import noop from '@stdlib/utils/noop';
import Login from './../../src/components/login';


// VARIABLES //

Enzyme.configure({ adapter: new Adapter() });


// TESTS //

describe( '<Login />', function test() {
	const wrapper = shallow( <Login handleLogin={noop} fetchCredentials={noop} /> );
	it('should render without throwing an error', () => {
		const div = wrapper.find( '.login' );
		expect( div.length ).toBe( 1 );
	});
});
