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
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import noop from '@stdlib/utils/noop';
import Login from './../../src/components/login';


// TESTS //

describe( '<Login />', function test() {
	it( 'should render without throwing an error', () => {
		render(
			<BrowserRouter>
				<Login handleLogin={noop} fetchCredentials={noop} getEnrollableCohorts={noop} restoreLogin={noop} settings={{ siteTitle: 'Dashboard' }} user={{}} />
			</BrowserRouter>
		);
		expect( screen.getByRole( 'heading' ) ).toHaveTextContent( 'Dashboard' );
	});

	it( 'should update email field on change', () => {
		const { queryByPlaceholderText } = render(
			<BrowserRouter>
				<Login handleLogin={noop} fetchCredentials={noop} getEnrollableCohorts={noop} restoreLogin={noop} settings={{}} user={{}} />
			</BrowserRouter>
		);
		const emailInput = queryByPlaceholderText( 'common:email' );
		const expected = 'isle@stat.cmu.edu';
		const event = {
			target: {
				value: expected
			}
		};
		fireEvent.change( emailInput, event );
		expect( emailInput.value ).toBe( expected );
	});

	it( 'should update password field on change', () => {
		const { queryByPlaceholderText } = render(
			<BrowserRouter>
				<Login handleLogin={noop} fetchCredentials={noop} getEnrollableCohorts={noop} restoreLogin={noop} settings={{}} user={{}} />
			</BrowserRouter>
		);
		const passwordInput = queryByPlaceholderText( 'common:password' );
		const expected = 'birthday';
		const event = {
			target: {
				value: expected
			}
		};
		fireEvent.change( passwordInput, event );
		expect( passwordInput.value ).toBe( expected );
	});
});
