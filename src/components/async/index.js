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

import React, { Component } from 'react';
import Spinner from 'components/spinner';


// MAIN //

/**
 * Adds a spinner to a component for asynchronous loading.
 *
 * @param {Component} importComponent - component to be wrapped
 * @returns {AsyncComponent} wrapped component
 */
function asyncComponent( importComponent ) {
	class AsyncComponent extends Component {
		constructor( props ) {
			super( props );

			this.state = {
				component: null
			};
		}

		async componentDidMount() {
			const { default: component } = await importComponent();
			this.setState({ // eslint-disable-line react/no-did-mount-set-state
				component: component
			});
		}

		render() {
			const C = this.state.component;
			return C ? <C {...this.props} /> : <Spinner />;
		}
	}
	return AsyncComponent;
}


// EXPORTS //

export default asyncComponent;
