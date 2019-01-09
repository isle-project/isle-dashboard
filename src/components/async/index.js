// MODULES //

import React, { Component } from 'react';


// MAIN //

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
			const spinner = <div className="sk-cube-grid">
				<div className="sk-cube sk-cube1"></div>
				<div className="sk-cube sk-cube2"></div>
				<div className="sk-cube sk-cube3"></div>
				<div className="sk-cube sk-cube4"></div>
				<div className="sk-cube sk-cube5"></div>
				<div className="sk-cube sk-cube6"></div>
				<div className="sk-cube sk-cube7"></div>
				<div className="sk-cube sk-cube8"></div>
				<div className="sk-cube sk-cube9"></div>
			</div>;
			const C = this.state.component;
			return C ? <C {...this.props} /> : spinner;
		}
	}
	return AsyncComponent;
}


// EXPORTS //

export default asyncComponent;
