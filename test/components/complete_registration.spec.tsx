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
import '@testing-library/jest-dom/extend-expect';
import CompleteRegistration from '../../src/components/complete-registration';


// TESTS //

describe( '<CompleteRegistration />', function test() {
	it( 'should render without throwing an error', () => {
		render(
			<BrowserRouter>
				<CompleteRegistration settings={{}} />
			</BrowserRouter>
		);
		expect( screen.getByRole( 'heading' ) ).toHaveTextContent( 'Complete Registration' );
	});

	it( 'should update last name field on change', () => {
		const { queryByPlaceholderText } = render(
			<BrowserRouter>
				<CompleteRegistration settings={{}} />
			</BrowserRouter>
		);
		const nameInput = queryByPlaceholderText( 'common:enter-last-name' ) as HTMLInputElement;
		const expected = 'Doe';
		const event = {
			target: {
				value: expected
			}
		};
		fireEvent.change( nameInput, event );
		expect( nameInput.value ).toBe( expected );
	});

	it( 'should update first name field on change', () => {
		const { queryByPlaceholderText } = render(
			<BrowserRouter>
				<CompleteRegistration settings={{}} />
			</BrowserRouter>
		);
		const nameInput = queryByPlaceholderText( 'common:enter-first-name' ) as HTMLInputElement;
		const expected = 'John';
		const event = {
			target: {
				value: expected
			}
		};
		fireEvent.change( nameInput, event );
		expect( nameInput.value ).toBe( expected );
	});

	it( 'should update preferred name field on change', () => {
		const { queryByPlaceholderText } = render(
			<BrowserRouter>
				<CompleteRegistration settings={{}} />
			</BrowserRouter>
		);
		const nameInput = queryByPlaceholderText( 'common:enter-preferred-name' ) as HTMLInputElement;
		const expected = 'John';
		const event = {
			target: {
				value: expected
			}
		};
		fireEvent.change( nameInput, event );
		expect( nameInput.value ).toBe( expected );
	});

	it( 'should update password field on change', () => {
		const { queryByPlaceholderText } = render(
			<BrowserRouter>
				<CompleteRegistration settings={{}} />
			</BrowserRouter>
		);
		const passwordInput = queryByPlaceholderText( 'common:choose-new-password' ) as HTMLInputElement;
		const expected = 'birthday';
		const event = {
			target: {
				value: expected
			}
		};
		fireEvent.change( passwordInput, event );
		expect( passwordInput.value ).toBe( expected );
	});

	it( 'should update password confirmation field on change', () => {
		const { queryByPlaceholderText } = render(
			<BrowserRouter>
				<CompleteRegistration settings={{}} />
			</BrowserRouter>
		);
		const passwordInput = queryByPlaceholderText( 'signup:confirm-password' ) as HTMLInputElement;
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
