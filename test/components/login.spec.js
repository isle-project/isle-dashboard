// MODULES //

import test from 'tape';
import React from 'react';
import { shallow } from 'enzyme';
import Login from './../../src/components/login';


// TESTS //

test( 'the component renders a div element of class `.login`', t => {
	const wrapper = shallow( <Login></Login> );
	const div = wrapper.find( '.login' );
	t.strictEqual( div.length, 1, 'returns one element' );
	t.end();
});
