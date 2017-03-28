// MODULES //

import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import Radium from 'radium';
import {
	Button, FormGroup, FormControl, Glyphicon, InputGroup,
	OverlayTrigger, Popover, ListGroupItem, ListGroup
} from 'react-bootstrap';
import { Image } from 'react-bootstrap';
import icon from './../../public/profile_pic.jpg';


// VARIABLES //

const RadiumLink = Radium( Link );


// FUNCTIONS //

function goToCreateCoursePage() {
	browserHistory.replace( '/create-namespace' );
}

function goToCoursePage() {
	browserHistory.replace( '/edit-namespace' );
}


// MAIN //

class HeaderBar extends Component {

	constructor( props ) {
		super( props );

		this.logout = () => {

		};
	}

	render() {

		const containerStyle = {
			borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
			float: 'left',
			position: 'relative',
			height: '52px',
			width: 'auto'
		};
		const spanStyle = {
			float: 'left',
			marginTop: '16px',
			marginLeft: '10px',
			position: 'relative',
			marginRight: '10px',
			cursor: 'pointer',
			color: 'silver',
			':hover': {
				color: 'white'
			}
		};

		const namespacePopover = (
			<Popover id="popover-positioned-bottom">
				<ListGroup>
					<ListGroupItem>Personal</ListGroupItem>
					<ListGroupItem>Chouldechova</ListGroupItem>
					<ListGroupItem>Nagin</ListGroupItem>
				</ListGroup>
			</Popover>
		);

		return (
			<header style={{
				width: '100%',
				height: '52px',
				position: 'fixed',
				top: 0,
				left: 0,
				background: '#2a3e54',
				zIndex: 100
			}}>
				<h1 style={{
					float: 'left',
					fontSize: '22px',
					marginTop: '15px',
					position: 'relative',
					marginLeft: '10px',
				}} onClick={this.props.onDashboardClick}>
					<RadiumLink to="/lessons" style={{
						color: 'silver',
						textDecoration: 'none',
						':hover': {
							color: 'white'
						}
					}}> ISLE Dashboard </RadiumLink>
				</h1>
				<div style={{
					marginLeft: '30px',
					marginTop: '8px',
					float: 'left',
					position: 'relative',
				}}>
					<OverlayTrigger trigger="click" placement="bottom" overlay={namespacePopover}>
						<Button style={{
							float: 'left',
							marginRight: '6px',
							marginLeft: '6px'
						}}>
							<Glyphicon glyph="align-justify" />
							<span><small>{this.props.currentNamespace.title}</small></span>
						</Button>
					</OverlayTrigger>
					<Button
						style={{ float: 'left', marginRight: '6px' }}
						onClick={goToCoursePage}
						disabled={!this.props.currentNamespace.title}
					>
						<Glyphicon glyph="edit" />
					</Button>
					<Button
						style={{ float: 'left', marginRight: '6px' }}
						onClick={goToCreateCoursePage}
					>
						<Glyphicon glyph="pencil" />
					</Button>
					<FormGroup style={{ width: '500px' }}>
						<InputGroup>
							<InputGroup.Addon>
								<Glyphicon glyph="search" />
							</InputGroup.Addon>
							<FormControl style={{
								background: 'silver',
								color: '#2a3e54'
							}} type="text" placeholder="Search" />
						</InputGroup>
					</FormGroup>
				</div>
				<div style={{
					float: 'right',
					position: 'relative',
					fontSize: '15px',
					marginRight: '10px'
				}}>
					<div style={containerStyle}>
						<div key="help" style={spanStyle} >
							<a href="http://isledocs.com/" target="_blank" style={{
								color: 'silver',
								textDecoration: 'none',
								':hover': {
									color: 'white'
								}
							}}>Help</a>
						</div>
					</div>
					<div style={containerStyle}>
						<Image src={icon} circle style={{
							width: '32px',
							height: '32px',
							float: 'left',
							position: 'relative',
							marginLeft: '10px',
							marginTop: '10px'
						}}></Image>
						<div key="account" style={spanStyle} >
							<RadiumLink to="/profile" style={{
								color: 'silver',
								textDecoration: 'none',
								':hover': {
									color: 'white'
								}
							}}>{this.props.username}</RadiumLink>
						</div>
					</div>
					<div style={containerStyle}>
						<div key="logout" style={spanStyle} >
							<a
								key="logoutButton"
								href="#"
								style={{
									color: 'silver',
									textDecoration: 'none',
									':hover': {
										color: 'white'
									}
								}}
								onClick={this.props.onLogout}
							> Log out </a>
						</div>
					</div>
				</div>
			</header>
		);
	}
}


// EXPORTS //

export default Radium( HeaderBar );
