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
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ConfirmEmail from '../../src/components/confirm-email';


// TESTS //

describe( '<ConfirmEmail />', function test() {
	it( 'should render without throwing an error', async () => {
		render(
			<BrowserRouter>
				<ConfirmEmail confirmEmail={() => Promise.resolve( true )} settings={{}} />
			</BrowserRouter>
		);
		await waitFor(() => {
			expect( screen.getByRole( 'heading' ) ).toHaveTextContent( 'common:confirm-email' );
		});
	});

	it( 'should display a message retrieved from server', async () => {
		const msg = 'Your email is confirmed';
		const { queryByTestId } = render(
			<BrowserRouter>
				<ConfirmEmail confirmEmail={() => Promise.resolve( msg )} settings={{}} />
			</BrowserRouter>
		);
		await waitFor(() => {
			const msgParagraph = queryByTestId( 'message' );
			expect( msgParagraph ).toHaveTextContent( msg );
		});
	});
});
