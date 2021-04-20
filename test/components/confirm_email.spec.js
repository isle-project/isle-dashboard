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
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import noop from '@stdlib/utils/noop';
import ConfirmEmail from '../../src/components/confirm-email';


// TESTS //

describe( '<ConfirmEmail />', function test() {
	const history = createMemoryHistory();

	it( 'should render without throwing an error', () => {
		render(
			<Router history={history}>
				<ConfirmEmail confirmEmail={noop} settings={{}} />
			</Router>
		);
		expect( screen.getByRole( 'heading' ) ).toHaveTextContent( 'common:confirm-email' );
	});

	it( 'should display a message retrieved from server', () => {
		const msg = 'Your email is confirmed';
		const { queryByTestId } = render(
			<Router history={history}>
				<ConfirmEmail confirmEmail={() => {
					return new Promise( () => {
						return msg;
					}).then( () => {
						const msgParagraph = queryByTestId( 'message' );
						expect( msgParagraph ).toHaveTextContent( msg );
					});
				}} settings={{}} />
			</Router>
		);
		const msgParagraph = queryByTestId( 'message' );
		expect( msgParagraph ).toHaveTextContent( 'common:waiting' );
	});
});
