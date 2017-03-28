// MODULES //

import React, { Component } from 'react';
import {
	Button, ButtonGroup, ButtonToolbar, Glyphicon,
	Grid, Row, Col, ControlLabel, Label, Modal, Panel
} from 'react-bootstrap';
import chunkify from 'compute-chunkify';
import icon from './../../public/screenshot.jpg';
import './image.css';


// COMPONENTS //


const DeleteModel = ( props ) =>
	<Modal show={props.show} onHide={props.close}>
		<Modal.Header>
			<Modal.Title>Delete?</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			Are you sure that you want to delete the lesson with the name "{props.name}"?
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={props.close}>Cancel</Button>
			<Button bsStyle="danger">Delete</Button>
		</Modal.Footer>
	</Modal>;


// MAIN //

class Lesson extends Component {

	constructor() {
		super();

		this.state = {
			showDeleteModal: false
		};

		this.showDeleteModal = () => {
			this.setState({ showDeleteModal: true });
		};

		this.closeDeleteModal = () => {
			this.setState({ showDeleteModal: false });
		};

	}

	render() {
		const labelStyle = this.props.status === 'active' ? 'success' : 'warning';
		return (
			<div>
				<Panel>
					<div className="hovereffect">
						<img
							className="img-responsive"
							src={icon}
							alt=""
							style={{
								width: 350,
								height: 200
							}}
						/>
						<div className="overlay">
							<h2>{this.props.name}</h2>
							<a className="info" href={this.props.url} target="_blank" >Open Lesson</a>
						</div>
					</div>
					<ButtonToolbar>
						<ButtonGroup>
							<Button><Glyphicon glyph="cog" /></Button>
							<Button><Glyphicon glyph="off" /></Button>
							<Button onClick={this.showDeleteModal} ><Glyphicon glyph="trash" /></Button>
						</ButtonGroup>
						<ButtonGroup>
							<ControlLabel>
								<Label bsStyle={labelStyle} style={{
									fontSize: '18px',
									float: 'right'
								}}>{this.props.status}</Label>
							</ControlLabel>
						</ButtonGroup>
					</ButtonToolbar>
					<DeleteModel {...this.props} show={this.state.showDeleteModal} close={this.closeDeleteModal}/>
				</Panel>
			</div>
		);
	}
}


// COMPONENTS //

class LessonsPage extends Component {

	constructor() {

		super();

		this.state = {
			lessons: [
				{
					'name': 'Normal Distribution',
					'status': 'active',
					'url': 'http://isle.heinz.cmu.edu/90-711/normal/'
				},
				{
					'name': 'Binomial',
					'status': 'active',
					'url': 'http://isle.heinz.cmu.edu/90-711/binomial/'
				},
				{
					'name': 'Central Limit Theorem',
					'status': 'active',
					'url': 'http://isle.heinz.cmu.edu/90-711/clt/'
				},
				{
					'name': 'Normal Distribution',
					'status': 'active',
					'url': 'http://isle.heinz.cmu.edu/90-711/normal/'
				},
				{
					'name': 'Normal Distribution',
					'status': 'active',
					'url': 'http://isle.heinz.cmu.edu/90-711/normal/'
				},
				{
					'name': 'Normal Distribution',
					'status': 'active',
					'url': 'http://isle.heinz.cmu.edu/90-711/normal/'
				},
				{
					'name': 'Normal Distribution',
					'status': 'active',
					'url': 'http://isle.heinz.cmu.edu/90-711/normal/'
				},
				{
					'name': 'Binomial',
					'status': 'active',
					'url': 'http://isle.heinz.cmu.edu/90-711/binomial/'
				},
				{
					'name': 'Central Limit Theorem',
					'status': 'active',
					'url': 'http://isle.heinz.cmu.edu/90-711/clt/'
				},
				{
					'name': 'Normal Distribution',
					'status': 'active',
					'url': 'http://isle.heinz.cmu.edu/90-711/normal/'
				},
				{
					'name': 'Normal Distribution',
					'status': 'active',
					'url': 'http://isle.heinz.cmu.edu/90-711/normal/'
				},
				{
					'name': 'Normal Distribution',
					'status': 'active',
					'url': 'http://isle.heinz.cmu.edu/90-711/normal/'
				}
			]
		};

	}

	render() {

		let chunks = chunkify( this.state.lessons, 4 );
		for ( let i = 0; i < chunks.length; i++ ) {
			let chunk = chunks[ i ];
			for ( let j = 0; j < chunk.length; j++ ) {
				if ( chunk[ j ]) {
					chunk[ j ] = <Col key={`cell${i}${j}`} xs={6} md={3}>
						<Lesson {...chunk[ j ]} />
					</Col>;
				} else {
					chunk[ j ] = null;
				}
			}
		}

		return (
			<Grid style={{ position: 'relative', top: 70 }} >
				{chunks.map( ( chunk, id ) => {
					return (
						<Row key={`row${id}`} >
							{chunk}
						</Row>
					);
				})}
			</Grid>
		);
	}

}


// EXPORTS //

export default LessonsPage;
