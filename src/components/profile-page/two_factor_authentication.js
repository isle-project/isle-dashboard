// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';


// MAIN //

class TwoFactorAuthentication extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			token: null
		};
	}

	requestTfaQRCode = async () => {
		const res = await this.props.getTfaQRCode();
		if ( res ) {
			this.setState({
				tfaQRCode: {
					__html: res.data
				}
			});
		}
	}

	enableTfa = () => {
		this.props.enableTFA( this.state.token );
	}

	disableTfa = () => {
		this.props.disableTFA();
	}

	renderQRCode = () => {
		if ( !this.state.tfaQRCode ) {
			return null;
		}
		/* eslint-disable react/no-danger */
		return (
			<Fragment>
				<div dangerouslySetInnerHTML={this.state.tfaQRCode} />
				<p>
					Please register ISLE with your authenticator app by scanning above QRCode and enter the received token below
				</p>
				<FormControl
					type="text"
					onChange={( event ) => {
						this.setState({
							token: event.target.value
						});
					}}
				/>
				<Button onClick={this.enableTfa} >
					Submit
				</Button>
			</Fragment>
		);
		/* eslint-enable react/no-danger */
	}

	render() {
		const t = this.props.t;
		if ( !this.props.user.twoFactorAuth ) {
			return (
				<Card bg="light" >
					<Card.Header>
						<span className="title" >
							{t('two-factor-authentication')}
						</span>
					</Card.Header>
					<Card.Body>
						<Button
							variant="success"
							style={{ float: 'right', marginRight: 5 }}
							onClick={this.requestTfaQRCode}
						>
							<i className="fas fa-qrcode" style={{ marginRight: 10 }}></i>
							{t('enable')}
						</Button>
						{this.renderQRCode()}
					</Card.Body>
				</Card>
			);
		}
		return (
			<Card bg="light" border="success" >
				<Card.Header>
					{t('two-factor-authentication')}
				</Card.Header>
				<Card.Body>
					<p>
						{t('two-factor-authentication-is-enabled')}
					</p>
					<Button
						variant="warning"
						style={{ float: 'right', marginRight: 5 }}
						onClick={this.disableTfa}
					>
						{t('disable')}
					</Button>
				</Card.Body>
			</Card>
		);
	}
}


// PROPERTIES //

TwoFactorAuthentication.propTypes = {
	disableTFA: PropTypes.func.isRequired,
	enableTFA: PropTypes.func.isRequired,
	getTfaQRCode: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

TwoFactorAuthentication.defaultProps = {};


// EXPORTS //

export default TwoFactorAuthentication;
